<?php

use App\Http\Controllers\ShopController;
use Illuminate\Support\Facades\Route;

Route::get('/', [ShopController::class, 'home'])->name('home');
Route::get('/shop', [ShopController::class, 'shop'])->name('shop');
Route::get('/cart', [ShopController::class, 'cart'])->name('cart');
Route::get('/products/{slug}', [ShopController::class, 'product'])->name('products.show');
