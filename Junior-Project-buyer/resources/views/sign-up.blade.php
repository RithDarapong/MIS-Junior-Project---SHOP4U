@extends('layout.master')

@section('dyncontent')
    <div class="container mx-auto flex items-center flex-wrap pt-4 pb-12">
        <div class="w-full p-8 mt-10">
            <h1 class="text-2xl font-bold text-center">Sign Up</h1>
            <p class="text-sm text-gray-500 text-center">Sign up to start shopping</p>
            <form action="/sign-up" class="mt-4" method="POST" >
                @csrf
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
                        Username
                    </label>
                    <input
                        required
                        name="username"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="username" type="text" placeholder="Username">
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="first_name">
                        First name
                    </label>
                    <input
                        required
                        name="first_name"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="first_name" type="text" placeholder="First name">
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="last_name">
                        Last name
                    </label>
                    <input
                        required
                        name="last_name"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="last_name" type="text" placeholder="Last name">
                </div>
                <div class="mb-4">
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="last_name">
                        Phone
                    </label>
                    <input
                        required
                        name="phone"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="phone" type="text" placeholder="Phone number">
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
                        Email
                    </label>
                    <input
                        required
                        type="email"
                        name="email"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="email" type="email" placeholder="Email">
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                        Password
                    </label>
                    <input
                        required
                        name="password"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="password" type="password" placeholder="******************">
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                        Confirm Password
                    </label>
                    <input
                        name="password_confirmation"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="password" type="password" placeholder="******************">
                </div>
                <div class="flex items-center justify-between">
                    <button class="w-full py-2 bg-gray-500 text-white rounded-md focus:outline-none focus:shadow-outline"
                        type="submit">
                        Sign Up
                    </button>
                </div </form>
                {{-- login link --}}
                <div class="text-center mt-4">
                    <p class="text-sm text-gray-500">Already have an account? <a href="/login"
                            class="text-blue-500">Login</a></p>
                </div>
        </div>
    </div>
@stop
