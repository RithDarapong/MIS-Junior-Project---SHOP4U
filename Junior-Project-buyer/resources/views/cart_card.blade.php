{{--
    product structure
    {
        +"id": 18
        +"image": "uploads/productImage-1714860532693.jpg"
        +"price": 45
        +"title": "ABC"
        +"amount": 2
        +"business_id": 1
    }
--}}

<div class="flex justify-between border-b-2 border-gray-200 py-2" id="productId-{{ $product->id}}">
    <div class="flex items
-center">
        <img src="{{ url('/img?file_path=' . $product->image) }}" alt="product" class="w-20 h-20 object-cover hover:grow hover:shadow-lg rounded-lg">
        <div class="ml-4">
            <h2 class="text-lg font-bold">{{ $product->title }}</h2>
            <p class="text-sm text-gray-500">Price: ${{ $product->price }}</p>
        </div>
    </div>
    <div class="flex items-center">
        <div class="flex items-center justify-center">
            <div class="flex items-center justify-end space-x-2">
                <div id="amountControls-{{ $product->id }}" class="hidden flex items-center space-x-2">
                    <button class="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
                        onclick="decreaseAmount({{ $product->id }}, '{{ $product->title }}', {{ $product->price }}, {{ $product->business_id }})">-</button>
                    <span id="amount-{{ $product->id }}" class="text-gray-700">{{ $product->amount }}</span>
                    <button class="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
                        onclick="increaseAmount({{ $product->id }}, '{{ $product->title }}', {{ $product->price }}, {{ $product->business_id }})">+</button>
                </div>
            </div>
            <button class="ml-4 bg-red-500 text-white px-2 py-1 rounded-md"
                onclick="removeProduct({{ $product->id }})">Remove</button>
        </div>
    </div>
</div>
