<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductStoreRequest;
use App\Http\Requests\ProductUpdateRequest;
use App\Http\Requests\StoreStockMovementRequest;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $product = Product::all();

        return Inertia::render('product/index', [
            'data' => $product,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::all();

        return Inertia::render('product/form', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProductStoreRequest $request)
    {
        $data = collect($request->validated())
            ->reject(fn ($value) => is_null($value))
            ->toArray();
        Product::create($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Product created successfully.']);

        return redirect()->route('product.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        $categories = Category::all();

        return Inertia::render('product/form', [
            'categories' => $categories,
            'data' => $product,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProductUpdateRequest $request, Product $product)
    {
        $data = collect($request->validated())
            ->reject(fn ($value) => is_null($value))
            ->toArray();
        $product->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Product updated successfully.']);

        return redirect()->route('product.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $product->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Product deleted successfully.']);

        return redirect()->route('product.index');
    }

    public function stockMovement(Product $product)
    {
        return Inertia::render('product/stock-movement', [
            'data' => $product,
        ]);
    }

    /**
     * Adjust the stock of the specified product.
     */
    public function storeStockMovement(StoreStockMovementRequest $request, Product $product)
    {
        $data = $request->validated();

        if ($data['movement_type'] === 'out' && $product->stock_quantity < $data['quantity']) {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'Insufficient stock for this operation.']);
            return redirect()->back();
        }

        DB::transaction(function () use ($data, $product) {
            match ($data['movement_type']) {
                'in' => $product->increment('stock_quantity', $data['quantity']),
                'out' => $product->decrement('stock_quantity', $data['quantity']),
                'adjustment' => $product->update(['stock_quantity' => $data['quantity']]),
            };

            $product->stockMovements()->create([
                'movement_type' => $data['movement_type'],
                'quantity' => $data['quantity'],
                'notes' => $data['notes'] ?? null,
                'reference_type' => 'manual',
            ]);
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Product stock adjusted successfully.']);

        return redirect()->route('product.index');
    }

    public function notifTrigger()
    {
        // API Call
    }
}
