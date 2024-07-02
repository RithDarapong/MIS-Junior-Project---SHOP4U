<div class="p-3 flex flex-col">
    <a href="/product/{{ $product->product_id }} " class="flex flex-col">
        <!-- Image -->
        <img class="hover:grow hover:shadow-lg rounded-lg object-cover w-48 h-48"
            src="{{ url('/img?file_path=' . $product->product_image) }}">

        <!-- Product Name and Price -->
        <div class="pt-3 flex items-center justify-between text-lg font-bold">
            <p class="truncate">{{ $product->product_title }}</p>
        </div>

        <div class="flex items-center justify-between">
            <p class="">${{ $product->product_price }}</p>
        </div>
    </a>
    <!-- Buttons -->
    <div class="pt-3 flex items-center justify-end space-x-2">
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

            <!-- <button id="addButton-{{ $product->product_id }}"
                class="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
                onclick="addItemAndRedirect({{ $product->product_id }}, '{{ $product->product_title }}', {{ $product->product_price }}, {{ $product->business_id }}, '{{ $product->product_image }}')">Add to Cart</button>
            <div id="amountControls-{{ $product->product_id }}" class="hidden flex items-center space-x-2"></div> -->

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
