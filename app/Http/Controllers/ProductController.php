<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductStoreRequest;
use App\Http\Requests\ProductUpdateRequest;
use App\Models\Category;
use App\Models\Product;
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
        $product = Product::create($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Product created successfully.']);

        return redirect()->route('product.index', $product);
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

        return redirect()->route('product.index', $product);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $product->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Product deleted successfully.']);

        return redirect()->route('product.index', $product);
    }
}
