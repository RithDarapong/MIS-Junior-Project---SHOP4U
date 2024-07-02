@extends('layout.master')

@section('dyncontent')
    <!-- <section class="bg-white py-8"> -->
    <div class="container mx-auto flex items-center flex-wrap pt-4 pb-12">
        <div class="w-full container mx-auto flex flex-wrap items-center justify-between mt-0 py-2">
            <div class="w-full pt-16">
                <form action="./" method="GET" class="flex flex-col gap-4">
                    <div class="relative ">
                        <input type="text" name="search"
                            class="w-full border-2 border-gray-300 bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none"
                            placeholder="Search..." value="{{ request()->has('search') ? request()->get('search') : '' }}">
                        <button type="submit" class="absolute right-0 top-0 mt-3 mr-4">
                            <svg class="text-gray-600 h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24">
                                <path
                                    d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                            </svg>
                        </button>
                    </div>
                    <div>
                        <select name="sort" id="sort"
                            class="border-2 border-gray-300 bg-white h-10 px-5 rounded-full
                            text-sm focus:outline-none float-right appearance-none
                            text-center font-bold"
                            onchange="this.form.submit()"
                            >
                            <option class="" value="popularity" @if (request()->has('sort') && request()->get('sort') == 'popularity') selected @endif>
                                Popularity</option>
                            <option value="price_low_to_high" @if (request()->has('sort') && request()->get('sort') == 'price_low_to_high') selected @endif>
                                Price: Low to High</option>
                            <option value="price_high_to_low" @if (request()->has('sort') && request()->get('sort') == 'price_high_to_low') selected @endif>
                                Price: High to Low</option>
                        </select>
                    </div>
                </form>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-2">
            @if (isset($products) && count($products) > 0)
                @foreach ($products as $product)
                    @include('product_detail_card', ['product' => $product])
                @endforeach
            @else
                <div class="col-start-1 col-end-3 grid place-items-center">
                    <p class="text-2xl">
                        No products found.
                    </p>
                </div>
            @endif

        </div>
    </div>

    <!-- </section> -->
@stop
