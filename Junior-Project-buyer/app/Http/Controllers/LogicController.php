<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class LogicController extends Controller
{
    public function signUp(Request $request)
    {
        DB::table('buyer')->insert([
            'username' => $request->input('username'),
            'first_name' => $request->input('first_name'),
            'last_name' => $request->input('last_name'),
            'phone' => $request->input('phone'),
            'password' => bcrypt($request->input('password')),
            'email' => $request->input('email'),
            'created_at' => now()
        ]);

        return redirect('/login');
    }

    public function authenticate(Request $request)
    {
        $email = $request->input('email');
        $password = $request->input('password');

        if (Auth::attempt(['email' => $email, 'password' => $password])) {
            return redirect('/');
        } else {
            return redirect('/login');
        }
    }

    public function logout()
    {
        Auth::logout();
        return redirect('/login');
    }

    public function saveCartToDb(Request $request)
    {
        $body = $request->all();
        $cart = $body['cart'];
        $buyer_id = Auth::user()->buyer_id;

        // update cart if exists
        $cartExists = DB::table('cart')->where('buyer_id', $buyer_id)->first();
        if ($cartExists) {
            DB::table('cart')->where('buyer_id', $buyer_id)->update([
                'products' => $cart,
            ]);
        } else {
            DB::table('cart')->insert([
                'buyer_id' => $buyer_id,
                'products' => $cart,
            ]);
        }

        return response()->json([
            'status' => 'success',
        ]);
    }

    public function checkout(Request $request)
    {
        $body = $request->all();
        
        $cart = json_decode($body['cart'], true);
        $contact = $body['contact'];
        $delivery_location = $body['delivery_location'];
        $buyer_id = Auth::user()->buyer_id;

        if (empty($cart)) {
            return response()->json([
                'success' => false,
                'message' => 'Cart is empty',
            ]);
        }

        // use transaction to ensure all or nothing
        DB::beginTransaction();

        try {
                foreach ($cart as $business_id => $products) {
                $order_detail_id = DB::table('order_detail')->insertGetId([
                    'buyer_id' => $buyer_id,
                    'business_id' => 1,
                    'customer_contact' => $contact,
                    'order_date' => date('Y-m-d H:i:s'),
                    'delivery_location' => $delivery_location,
                    'created_at' => now()
                ]);

                    foreach ($products as $product) {
                        DB::table('order_item')->insert([
                            'order_detail_id' => $order_detail_id,
                            'product_id' => $product['id'],
                            'quantity' => $product['amount'],
                            'created_at' => now()
                        ]);
                    }
                }

            
            // clear cart
            DB::table('cart')->where('buyer_id', $buyer_id)->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Checkout successfully',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }

    public function img(Request $request)
    {
        $file_path = $request->input('file_path');
        $folder = env("FILE_FOLDER", "");
        $file = $folder . '/' . $file_path;

        // check if file exists
        if (!file_exists($file)) {
            return response()->json([
                'message' => 'File not found',
                'path' => $file,
            ], 404);
        }

        // return file
        return response()->file($file);
    }

    public function updateProfile(Request $request)
    {
        if (!Auth::check()) {
            return redirect('/login');
        }

        $buyer_id = Auth::user()->buyer_id;
        $body = $request->all();

        // check if password match
        if (!Hash::check($body['old_password'] , Auth::user()->password))
         {
            return redirect()->back()->with('error', 'Incorrect password');
        }

        $toUpdate = [
            'username' => $body['username'],
            'first_name' => $body['first_name'],
            'last_name' => $body['last_name'],
            'email' => $body['email'],
            'phone' => $body['phone'],
        ];

        if (!empty($body['new_password'])) {
            $toUpdate['password'] = bcrypt($body['new_password']);
        }

        // update profile
        DB::table('buyer')->where('buyer_id', $buyer_id)->update($toUpdate);

        return redirect()->back()->with('success', 'Profile updated');
    }
}
