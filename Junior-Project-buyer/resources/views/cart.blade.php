@extends('layout.master', [
    // 'showMenu' => false,
])

@section('dyncontent')
    <div class="container mx-auto flex items-center flex-wrap pt-4 pb-12">
        <!-- <a href="{{ url()->previous() }}" class="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 mt-20">Back</a> -->
        <div class="w-full p-4 mt-10">
            <h1 class="text-2xl font-bold text-center">Cart</h1>
            <div class="mt-4">
                @if (is_null($cart) || count($cart) == 0)
                    <h2 class="text-lg font-bold text-center">Cart is empty</h2>
                @else
                    @foreach ($cart as $product)
                        @include('cart_card', [
                            'product' => $product,
                        ])
                    @endforeach
                    <!-- <div class=" bg-white border-t border-gray-400 ">
                        <div />
                        <div class="mt-4">
                            <h2 class="text-lg font-bold" id="totalPrice">Total: $</h2>
                        </div>
                        <div class="flex items-center justify-between mt-4">
                            <div>
                              <a href="/"
                                class="w-full py-2 bg-gray-500 text-white rounded-md focus:outline-none focus:shadow-outline text-center">
                                Continue Shopping
                                </a>
                                <a href="/confirm-order"
                                    class="w-full py-2 bg-gray-500 text-white rounded-md focus:outline-none focus:shadow-outline text-center">
                                    Confirm Order
                                </a>  
                            </div>
                        </div>
                    </div> -->
                    
                    <div class="bg-white border-t border-gray-400">
                        <div />
                        <div class="mt-4">
                            <h2 class="text-lg font-bold" id="totalPrice">Total: $</h2>
                        </div>
                        
                        <div class="flex items-center justify-between mt-4">
                            <a href="/"
                                class="py-2 text-gray-500 font-bold underline rounded-md focus:outline-none focus:shadow-outline text-center">
                                < Continue Shopping
                            </a>
                            <a href="/confirm-order"
                                class="py-2 px-4 bg-gray-500 text-white rounded-md focus:outline-none focus:shadow-outline text-center">
                                Confirm Order
                            </a>
                        </div>
                    </div>

                @endif
            </div>
        </div>
    </div>
@stop
