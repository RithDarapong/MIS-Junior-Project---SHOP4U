@extends('layout.master', [])

@section('dyncontent')
    <div class="container mx-auto flex items-center flex-wrap pt-4 pb-12">
        <a href="{{ url()->previous() }}" class="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 mt-20">Back</a>
        <div class="w-full p-4 mt-2">
            <h1 class="text-2xl font-bold text-center">Delivery Information</h1>
            <div class="mt-4">
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="contact">
                        Contact
                    </label>
                    <input name="contact"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="contact" type="text" placeholder="012 122 133 14"
                        value="{{ Auth::user()->phone }}">
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="delivery_location">
                        Delivery location
                    </label>
                    <input name="delivery_location"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="delivery_location" type="text" placeholder="Location">
                </div>
                <div class="mt-4">
                    <h2 class="text-lg font-bold" id="totalPrice">Total: $</h2>
                </div>
                <div class="flex items-center justify-between mt-4">
                    <button class="w-full py-2 bg-gray-500 text-white rounded-md focus:outline-none focus:shadow-outline"
                        type="button" onclick="checkout()">
                        Confirm Order
                    </button>
                </div>
            </div>
        </div>
    </div>
@stop
