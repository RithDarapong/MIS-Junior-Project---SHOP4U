<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LogicController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::controller(HomeController::class)->group(function () {
    Route::get('/', 'home');
    Route::get('/profile', 'profile');
    Route::get('/checkout', 'cart');
    Route::get('/sign-up', 'signUp');
    Route::get('/login', 'login');
    Route::get('/confirm-order', 'confirmOrder');
    Route::get('/thank-you', 'thankYou');
    Route::get('/product/{id}', 'productDetail');
});

Route::controller(LogicController::class)->group(function () {
    Route::post('/sign-up', 'signUp');
    Route::post('/authenticate', 'authenticate');
    Route::post('/profile/update', 'updateProfile');
    Route::get('/logout', 'logout');
    Route::get('/img', 'img');

    Route::post('/save-cart', 'saveCartToDb');
    Route::post('/checkout', 'checkout');
});
