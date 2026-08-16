<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'home'])->name('home');
Route::post('/cart/add/{product}', [CartController::class, 'add'])->name('cart.add');
Route::delete('/cart/remove/{product}', [CartController::class, 'remove'])->name('cart.remove');
Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::resource('category', CategoryController::class)->except(['show']);

    Route::get('product/{product}/stock-movement', [ProductController::class, 'stockMovement'])->name('product.stock-movement');
    Route::post('product/{product}/adjust-stock', [ProductController::class, 'storeStockMovement'])->name('product.store-stock-movement');
    Route::resource('product', ProductController::class);
});

require __DIR__.'/settings.php';
