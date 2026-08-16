<?php

namespace App\Http\Controllers;

use App\Models\StockMovement;
use Inertia\Inertia;

class StockMovementController extends Controller
{
    public function index()
    {
        $movements = StockMovement::with('product')
            ->latest()
            ->get()
            ->map(function ($movement) {
                return [
                    'id'           => $movement->id,
                    'date'         => $movement->created_at->format('d M Y, H:i'),
                    'product_name' => $movement->product->name,
                    'type'         => $movement->movement_type,
                    'quantity'     => $movement->quantity,
                    'notes'        => $movement->notes ?? '-',
                ];
            });

        return Inertia::render('stock-movement', [
            'movements' => $movements,
        ]);
    }
}
