@extends('layout.master')

@section('dyncontent')
    <div class="container mx-auto flex items-center flex-wrap pt-4 pb-12">
        <div class="w-full p-8 mt-10">
            <h1 class="text-2xl font-bold text-center">Login</h1>
            <p class="text-sm text-gray-500 text-center">Login to start shopping</p>
            <form class="mt-4" method="POST" action="/authenticate">
                @csrf
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
                        Email
                    </label>
                    <input
                        name="email"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="email" type="email" placeholder="Email">
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                        Password
                    </label>
                    <input
                        name="password"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="password" type="password" placeholder="******************">
                </div>
                <div class="flex items-center justify-between">
                    <button class="w-full py-2 bg-gray-500 text-white rounded-md focus:outline-none focus:shadow-outline"
                        type="submit">
                        Login
                    </button>
                </div>
            </form>
            {{-- sign up link --}}
            <div class="text-center mt-4">
                <p class="text-sm text-gray-500">Don't have an account? <a href="/sign-up" class="text-blue-500">Sign Up</a>
                </p>
            </div>
        </div>
    </div>
@stop
