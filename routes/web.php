<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\StockMovementController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'home'])->name('home');

Route::post('/cart/add/{product}', [CartController::class, 'add'])->name('cart.add');
Route::delete('/cart/remove/{product}', [CartController::class, 'remove'])->name('cart.remove');

Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
Route::get('/checkout/status', [CheckoutController::class, 'status'])->name('checkout.status');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('category', CategoryController::class)->except(['show']);

    Route::get('product/{product}/stock-movement', [ProductController::class, 'stockMovement'])->name('product.stock-movement');
    Route::post('product/{product}/adjust-stock', [ProductController::class, 'storeStockMovement'])->name('product.store-stock-movement');
    Route::resource('product', ProductController::class);

    Route::resource('order', OrderController::class)->only(['index', 'show']);

    Route::get('stock-movement', [StockMovementController::class, 'index'])->name('stock-movement.index');
});

require __DIR__.'/settings.php';
