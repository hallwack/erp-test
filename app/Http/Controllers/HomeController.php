<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Display the home page.
     */
    public function home()
    {
        $products = Product::with('category')->get();

        return Inertia::render('home', [
            'products' => $products,
        ]);
    }
}
