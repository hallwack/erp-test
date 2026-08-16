<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PaymentCallbackController extends Controller
{
    protected string $secretKey;

    protected string $callbackToken;

    protected string $baseUrl;

    public function __construct()
    {
        $this->secretKey = config('services.xendit.secret_key');
        $this->callbackToken = config('services.xendit.webhook_token');
        $this->baseUrl = 'https://api.xendit.co';
    }

    /**
     * Handle the webhook callback from Xendit for payment status updates.
     */
    public function webhook(Request $request)
    {
        // 1. Validate the callback token
        if (! $this->isValidCallbackToken($request)) {
            return response()->json(['message' => 'Invalid callback token'], 403);
        }

        $payload = $request->all();
        $orderNumber = $payload['data']['reference_id'] ?? null;
        $paymentSessionId = $payload['data']['payment_session_id'] ?? null;

        if (! $orderNumber) {
            return response()->json(['message' => 'Reference Order Number missing'], 400);
        }

        // 2. Fetch the order from the database
        $order = Order::with('orderDetails.product')->where('order_number', $orderNumber)->firstOrFail();

        if ($order->payment_status === 'paid') {
            return response()->json(['message' => 'Order already paid'], 200);
        }

        try {
            // 3. Fetch Payment Session Data from Xendit
            $sessionData = $this->fetchXenditSession($paymentSessionId);

            // 4. Handle Expired or Canceled Orders
            if (in_array($sessionData['status'] ?? '', ['EXPIRED', 'CANCELED'])) {
                $this->processExpiredOrder($order, $payload);

                return response()->json(['message' => 'Order expired/canceled handled']);
            }

            // If the session is still active, we can check for the payment ID
            $paymentId = $sessionData['payment_id'] ?? null;
            if (! $paymentId) {
                return response()->json(['message' => 'Waiting for actual payment']);
            }

            // 5. Get Payment Data from Xendit
            $paymentData = $this->fetchXenditPaymentData($paymentId);

            // 6. Process Successful Payment
            if (($paymentData['status'] ?? '') === 'SUCCEEDED') {
                $this->processSuccessfulOrder($order, $paymentData, $payload);
            }

            return response()->json(['message' => 'Webhook processed successfully']);

        } catch (\Exception $e) {
            Log::error('Xendit Webhook Error: '.$e->getMessage());

            return response()->json(['message' => 'Internal server error processing webhook'], 500);
        }
    }

    private function isValidCallbackToken(Request $request)
    {
        $token = $request->header('X-Callback-Token');

        return hash_equals((string) $this->callbackToken, (string) $token);
    }

    private function fetchXenditSession(string $paymentSessionId)
    {
        $response = Http::withBasicAuth($this->secretKey, '')
            ->withOptions(['connect_timeout' => 15, 'timeout' => 40, 'force_ip_resolve' => 'v4'])
            ->acceptJson()
            ->get($this->baseUrl.'/sessions/'.$paymentSessionId);

        if ($response->failed()) {
            throw new \Exception('Failed to fetch session data: '.$response->body());
        }

        return $response->json();
    }

    private function fetchXenditPaymentData(string $paymentId)
    {
        $response = Http::withBasicAuth($this->secretKey, '')
            ->withHeaders(['api-version' => '2024-11-11'])
            ->withOptions(['connect_timeout' => 15, 'timeout' => 40, 'force_ip_resolve' => 'v4'])
            ->acceptJson()
            ->get($this->baseUrl.'/v3/payments/'.$paymentId);

        if ($response->failed()) {
            throw new \Exception('Failed to fetch payment data: '.$response->body());
        }

        return $response->json();
    }

    private function processExpiredOrder(Order $order, array $payload)
    {
        DB::transaction(function () use ($order, $payload) {
            $order->update([
                'status' => 'cancelled',
                'payment_status' => 'expired',
            ]);

            $order->payment()->update([
                'status' => 'failed',
                'raw_response' => json_encode($payload),
            ]);
        });
    }

    private function processSuccessfulOrder(Order $order, array $paymentData, array $payload)
    {
        $channelCode = $paymentData['channel_code'] ?? 'XENDIT';

        DB::transaction(function () use ($order, $payload, $channelCode) {

            // 1. Update payments table
            $order->payment()->update([
                'status' => 'success',
                'payment_type' => $channelCode,
                'raw_response' => json_encode($payload),
                'paid_at' => now(),
            ]);

            // 2. Update orders table
            $order->update([
                'status' => 'paid',
                'payment_status' => 'paid',
                'payment_method' => $channelCode,
            ]);

            // 3. Proses pengurangan stok untuk setiap item yang dibeli
            foreach ($order->orderDetails as $item) {
                $this->deductStock($order, $item);
            }
        });
    }

    private function deductStock(Order $order, OrderDetail $item)
    {
        $product = $item->product;

        $product->decrement('stock_quantity', $item->quantity);

        StockMovement::create([
            'product_id' => $product->id,
            'movement_type' => 'out',
            'quantity' => $item->quantity,
            'reference_type' => 'order',
            'reference_id' => $order->id,
            'notes' => 'Stock keluar dari order '.$order->order_number,
        ]);

        $currentStock = $product->fresh()->stock_quantity;
        $threshold = $product->stock_threshold;

        if ($currentStock < $threshold) {
            $this->triggerLowStockAlert($product, $currentStock, $threshold);
        }
    }

    private function triggerLowStockAlert(Product $product, int $currentStock, int $threshold)
    {
        $webhookUrl = config('services.n8n.low_stock_webhook');

        if ($webhookUrl) {
            Http::post($webhookUrl, [
                'product_id' => $product->id,
                'product_name' => $product->name,
                'current_stock' => $currentStock,
                'threshold' => $threshold,
            ]);
        }
    }
}
