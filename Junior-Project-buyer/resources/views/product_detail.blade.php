@extends('layout.master', [
    // 'showMenu' => false,
])

@section('dyncontent')
    <div class="container mx-auto flex items-center flex-wrap pt-4 pb-12">
        <a href="{{ url()->previous() }}" class="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 mt-20">Back</a>
        <div class="w-full p-4 mt-2">
            @if (is_null($product))
                <h2 class="text-lg font-bold text-center">Product not found</h2>
            @else

                <div class="p-3 flex flex-col">
                    <a href="/# " class="flex flex-col gap-4">
                        <!-- Image -->
                        <img class="hover:grow hover:shadow-lg rounded-lg w-96 h-96 object-cover"
                            src="{{ url('/img?file_path=' . $product->product_image) }}">

                        <!-- Product Name and Price -->
                        <div class="pt-3 flex items-center justify-between font-bold text-2xl">
                            <p class="truncate">{{ $product->product_title }}</p>
                        </div>

                        <div class="flex items-center justify-between text-xl">
                            <p class="">${{ $product->product_price }}</p>
                        </div>
                        <div class="flex items-center justify-between">
                            <p class="">{{ $product->product_description }}</p>
                        </div>
                    </a>
                    
                    <!-- Buttons -->
                    <div class="pt-3 flex items-center justify-end space-x-2">
                        <!-- <button id="addButton-{{ $product->product_id }}"
                            class="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
                            onclick="addItem({{ $product->product_id }}, '{{ $product->product_title }}', {{ $product->product_price }}, {{ $product->business_id }}, '{{ $product->product_image }}')">+</button>
                        <div id="amountControls-{{ $product->product_id }}" class="hidden flex items-center space-x-2">
                            <button class="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
                                onclick="decreaseAmount({{ $product->product_id }}, '{{ $product->product_title }}', {{ $product->product_price }}, {{ $product->business_id }})">-</button>
                            <span id="amount-{{ $product->product_id }}" class="text-gray-700">1</span>
                            <button class="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
                                onclick="increaseAmount({{ $product->product_id }}, '{{ $product->product_title }}', {{ $product->product_price }}, {{ $product->business_id }})">+</button>
                        </div> -->
                        @if (Auth::check())
                        <!-- <button id="addButton-{{ $product->product_id }}"
                            class="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
                            onclick="addItem({{ $product->product_id }}, '{{ $product->product_title }}', {{ $product->product_price }}, {{ $product->business_id }}, '{{ $product->product_image }}')">+</button>
                        <div id="amountControls-{{ $product->product_id }}" class="hidden flex items-center space-x-2">
                            <button class="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
                                onclick="decreaseAmount({{ $product->product_id }}, '{{ $product->product_title }}', {{ $product->product_price }}, {{ $product->business_id }})">-</button>
                            <span id="amount-{{ $product->product_id }}" class="text-gray-700">1</span>
                            <button class="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
                                onclick="increaseAmount({{ $product->product_id }}, '{{ $product->product_title }}', {{ $product->product_price }}, {{ $product->business_id }})">+</button>
                        </div> -->

                        <!-- <button 
                            class="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
                            onclick="addToCartAndRedirect({{ $product->product_id }}, '{{ $product->product_title }}', {{ $product->product_price }}, {{ $product->business_id }}, '{{ $product->product_image }}')">
                            Add to Cart
                        </button> -->

                        <button id="addButton-{{ $product->product_id }}"
                            class="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
                            onclick="addItemAndRedirect({{ $product->product_id }}, '{{ $product->product_title }}', {{ $product->product_price }}, {{ $product->business_id }}, '{{ $product->product_image }}')">
                            Add to Cart
                        </button>
                        <div id="amountControls-{{ $product->product_id }}" class="hidden flex items-center space-x-2">
                            <button class="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
                                onclick="decreaseAmount({{ $product->product_id }}, '{{ $product->product_title }}', {{ $product->product_price }}, {{ $product->business_id }})">-</button>
                            <span id="amount-{{ $product->product_id }}" class="text-gray-700">1</span>
                            <button class="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
                                onclick="increaseAmount({{ $product->product_id }}, '{{ $product->product_title }}', {{ $product->product_price }}, {{ $product->business_id }})">+</button>
                        </div>

                        @else
                            <a href="/sign-up" class="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300">Add to Cart</a>
                        @endif
                    </div> 
                </div>
        </div>
    </div>
    @endif
@stop
