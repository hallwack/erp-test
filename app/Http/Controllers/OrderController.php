<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $orders = Order::latest()->get()->map(function ($order) {
            return [
                'id'             => $order->id,
                'order_number'   => $order->order_number,
                'customer_name'  => $order->customer_name ?? 'Guest',
                'date'           => $order->created_at->format('d M Y, H:i'),
                'total'          => (int) $order->total,
                'payment_status' => $order->payment_status,
            ];
        });

        return Inertia::render('order/index', [
            'orders' => $orders,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        $order = Order::with(['orderDetails.product', 'payment'])->findOrFail($order->id);

        $orderData = [
            'id'             => $order->id,
            'order_number'   => $order->order_number,
            'customer_name'  => $order->customer_name ?? 'Guest',
            'subtotal'       => (int) $order->subtotal,
            'tax'            => (int) $order->tax,
            'total'          => (int) $order->total,
            'payment_status' => $order->payment_status,
            'payment_method' => $order->payment_method ?? '-',
            'date'           => $order->created_at->format('d M Y, H:i'),

            'orderDetails' => $order->orderDetails->map(function ($item) {
                return [
                    'id'       => $item->id,
                    'name'     => $item->product->name ?? 'Produk Dihapus',
                    'quantity' => $item->quantity,
                    'price'    => (int) $item->price,
                    'subtotal' => (int) $item->subtotal,
                ];
            }),

            'payment' => $order->payment ? [
                'gateway' => $order->payment->gateway,
                'paid_at' => $order->payment->paid_at ? $order->payment->paid_at->format('d M Y, H:i') : null,
            ] : null,
        ];

        return Inertia::render('order/show', [
            'order' => $orderData
        ]);
    }
}
