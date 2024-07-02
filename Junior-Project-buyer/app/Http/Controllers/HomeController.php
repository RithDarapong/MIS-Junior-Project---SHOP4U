<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    public function home(Request $request)
    {
        $search = $request->input('search');
        $sort = $request->input('sort') ?? 'popularity';

        $query = DB::table('product');

        if ($sort == 'price_low_to_high') {
            $query->orderBy(DB::raw('CAST(product_price AS DECIMAL(10, 2))'), 'asc');
        } else if ($sort == 'price_high_to_low') {
            $query->orderBy(DB::raw('CAST(product_price AS DECIMAL(10, 2))'), 'desc');
        } else if ($sort == 'popularity') {
            // join with order_item table get by product_id and quantity total count to get popularity
            $query->leftJoin('order_item', 'product.product_id', '=', 'order_item.product_id')
                ->select('product.*', DB::raw('SUM(order_item.quantity) as total_quantity'))
                ->groupBy('product.product_id')
                ->orderBy('total_quantity', 'desc');
        }

        if ($search) {
            $query->where('product_title', 'like', '%' . $search . '%');
        }

        $products = $query->get();

        return view('home', [
            'products' => $products
        ]);
    }

    public function cart(Request $request)
    {
        if (!Auth::check()) {
            return redirect('/login');
        }

        $cart = DB::table('cart')->where('buyer_id', Auth::user()->buyer_id)->first();
        if (!$cart) {
            return view('cart', [
                'cart' => [],
            ]);
        }

        $cartdecoded = json_decode($cart->products) ?? [];
        return view('cart', [
            'cart' => $cartdecoded,
        ]);
    }

    public function signUp(Request $request)
    {
        return view('sign-up');
    }

    public function login(Request $request)
    {
        return view('login');
    }

    public function thankYou(Request $request)
    {
        return view('thank-you');
    }

    public function profile(Request $request)
    {
        if (!Auth::check()) {
            return redirect('/login');
        }

        return view('profile');
    }

    public function confirmOrder(Request $request)
    {
        if (!Auth::check()) {
            return redirect('/login');
        }

        $cart = DB::table('cart')->where('buyer_id', Auth::user()->buyer_id)->first();

        if (!$cart || !$cart->products || json_decode($cart->products) == []) {
            return redirect('/');
        }

        return view('confirm_order');
    }

    public function productDetail(Request $request, $id)
    {
        $product = DB::table('product')->where('product_id', $id)->first();

        return view('product_detail', [
            'product' => $product,
        ]);
    }
}
