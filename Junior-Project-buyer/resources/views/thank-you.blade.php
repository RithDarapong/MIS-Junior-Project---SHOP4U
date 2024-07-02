@extends('layout.master', [
    // 'showMenu' => false,
])

@section('dyncontent')
    <div class="container mx-auto flex items-center flex-wrap pt-4 pb-12">
        <div class="w-full p-4 mt-10">
            <h1 class="text-2xl font-bold text-center">Thank you!</h1>
            <p class="text-sm text-gray-500 text-center">Your order has been placed</p>
            {{-- home btn --}}
            <div class="flex items-center justify-center mt-4">
                <a href="/"
                    class="w-full py-2 bg-gray-500 text-white rounded-md focus:outline-none focus:shadow-outline text-center">
                    Browse more products
                </a>
            </div>
        </div>
    </div>
@stop
