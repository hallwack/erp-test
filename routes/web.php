<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::resource('category', CategoryController::class)->except(['show']);

    Route::get('product/{product}/stock-movement', [ProductController::class, 'stockMovement'])->name('product.stock-movement');
    Route::post('product/{product}/adjust-stock', [ProductController::class, 'storeStockMovement'])->name('product.store-stock-movement');
    Route::resource('product', ProductController::class);
});


require __DIR__.'/settings.php';
