<?php

namespace App\Http\Controllers;

use App\Http\Requests\CheckoutStoreRequest;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    private const ENDPOINT_INVOICE_CREATE = '/sessions';

    private const DEFAULT_CURRENCY = 'IDR';

    private const DEFAULT_COUNTRY = 'ID';

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
     * Display the checkout page.
     */
    public function index()
    {
        return Inertia::render('checkout');
    }

    /**
     * Store a newly created order in storage.
     */
    public function store(CheckoutStoreRequest $request)
    {
        $cart = session('cart', []);

        if (empty($cart)) {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'Cart is empty.']);

            return redirect()->back();
        }

        try {
            $paymentUrl = DB::transaction(function () use ($request, $cart) {
                $order = $this->createOrder($request->validated('customer_name'), $cart);

                $xenditItems = $this->processOrderItems($order, $cart);

                return $this->createXenditInvoice($order, $xenditItems);
            });

            session()->forget('cart');

            return Inertia::location($paymentUrl);
        } catch (\Exception $e) {
            Log::error('Checkout Failed: '.$e->getMessage());
            Inertia::flash('toast', ['type' => 'error', 'message' => 'Failed to process checkout. Please try again.']);

            return redirect()->back();
        }
    }

    private function createOrder(?string $customerName, array $cart): Order
    {
        $subtotal = collect($cart)->sum(fn ($item) => $item['price'] * $item['quantity']);
        $orderNumber = 'INV-'.strtoupper(Str::random(8));

        return Order::create([
            'order_number' => $orderNumber,
            'customer_name' => $customerName ?? 'Guest',
            'subtotal' => $subtotal,
            'tax' => 0,
            'total' => $subtotal,
            'payment_status' => 'unpaid',
        ]);
    }

    private function processOrderItems(Order $order, array $cart)
    {
        $productIds = collect($cart)->pluck('id');
        $productsFromDb = Product::with('category')->whereIn('id', $productIds)->get()->keyBy('id');

        $xenditItems = [];

        foreach ($cart as $item) {
            $order->orderDetails()->create([
                'product_id' => $item['id'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
                'subtotal' => $item['price'] * $item['quantity'],
            ]);

            $categoryName = $productsFromDb[$item['id']]->category->name ?? 'RETAIL';
            $xenditItems[] = [
                'reference_id' => (string) $item['id'],
                'type' => 'PHYSICAL_PRODUCT',
                'name' => $item['name'],
                'quantity' => (int) $item['quantity'],
                'net_unit_amount' => (int) $item['price'],
                'category' => $categoryName,
            ];
        }

        return $xenditItems;
    }

    private function createXenditInvoice(Order $order, array $xenditItems)
    {
        $payload = [
            'reference_id' => $order->order_number,
            'customer' => [
                'reference_id' => 'CUST-'.time(),
                'type' => 'INDIVIDUAL',
                'individual_detail' => [
                    'given_names' => $order->customer_name,
                ],
            ],
            'session_type' => 'PAY',
            'currency' => self::DEFAULT_CURRENCY,
            'amount' => (int) $order->total,
            'mode' => 'PAYMENT_LINK',
            'country' => self::DEFAULT_COUNTRY,
            'description' => 'Payment for Order #'.$order->order_number,
            'items' => $xenditItems,

            'success_return_url' => config('app.url') . '/checkout/status?order_id=' . $order->order_number,
            'cancel_return_url'  => config('app.url') . '/checkout/status?order_id=' . $order->order_number,
        ];

        $response = Http::withBasicAuth($this->secretKey, '')
            ->withOptions([
                'connect_timeout' => 15,
                'timeout' => 40,
                'force_ip_resolve' => 'v4',
            ])
            ->acceptJson()
            ->post($this->baseUrl.self::ENDPOINT_INVOICE_CREATE, $payload);

        if ($response->failed()) {
            throw new \Exception("Xendit API Error [{$response->status()}]: ".$response->body());
        }

        $order->payment()->create([
            'gateway_transaction_id' => $response['payment_session_id'] ?? null,
            'amount' => $order->total,
            'status' => 'pending',
            'raw_response' => json_encode($response->json()),
        ]);

        return $response['payment_link_url'];
    }

    public function status(Request $request)
    {
        $orderNumber = $request->query('order_id');

        if (! $orderNumber) {
            return redirect()->route('home');
        }

        $order = Order::where('order_number', $orderNumber)->firstOrFail();

        return Inertia::render('checkout-status', [
            'order' => [
                'order_number' => $order->order_number,
                'customer_name' => $order->customer_name,
                'total' => $order->total,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
            ],
        ]);

    }
}
