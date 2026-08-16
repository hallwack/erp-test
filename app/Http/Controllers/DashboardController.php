<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Summary Data
        $totalRevenue = Order::where('payment_status', 'paid')->sum('total');
        $totalOrders = Order::where('payment_status', 'paid')->count();
        $lowStockCount = Product::whereColumn('stock_quantity', '<', 'stock_threshold')->count();

        // Recent Transactions (Last 5 Paid Orders)
        $transactions = Order::where('payment_status', 'paid')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'date' => $order->created_at->format('d M Y'),
                    'total' => (int) $order->total,
                    'status' => $order->payment_status,
                ];
            });

        return Inertia::render('dashboard', [
            'totalRevenue' => (int) $totalRevenue,
            'totalOrders' => $totalOrders,
            'lowStockCount' => $lowStockCount,
            'recentTransactions' => $transactions,
        ]);
    }
}
