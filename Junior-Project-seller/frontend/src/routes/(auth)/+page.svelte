<script lang="ts">
    import { PUBLIC_API_URL } from "$env/static/public";
    import { onMount } from "svelte";
    interface OrderDetail {
        order_detail_id: number;
        business_id: number;
        buyer_id: number;
        customer_contact: string;
        order_date: string;
        delivery_location: string;
        buyer: Buyer;
        products: OrderItem[];
    }

    interface Buyer {
        buyer_id: number;
        username: string;
        first_name: string;
        last_name: string;
        email: string;
        password: string;
    }

    interface OrderItem {
        order_item_id: number;
        order_detail_id: number;
        product_id: number;
        quantity: number;
        product: Product;
    }
    let orderDetails: OrderDetail[] = [];
    interface Product {
        product_id: number;
        business_id: number;
        product_title: string;
        product_description: string;
        product_price: string;
        product_image: string;
    }
    let originalProducts: Product[] = [];
    onMount(() => {
        fetch(`${PUBLIC_API_URL}/order_details`, {
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            method: "GET",
        })
            .then((res) => {
                if (res.status == 200) return res.json();
                else throw res.json();
            })
            .then((data) => {
                console.log(data);
                if (data) {
                    orderDetails = data;
                }
            })
            .catch((err) => {
                console.log(err);
            });
        fetch(`${PUBLIC_API_URL}/products`, {
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            method: "GET",
        })
            .then((res) => {
                if (res.status == 200) return res.json();
                else throw res.json();
            })
            .then((data) => {
                console.log(data);
                if (data) {
                    originalProducts = data;
                }
            })
            .catch((err) => {
                console.log(err);
            });
    });
</script>

<div class="text-white">
    <h1 class="text-2xl font-bold mb-4">Dashboard</h1>
    <div class="grid grid-cols-3 w-[900px] gap-4">
        <div class="rounded-md px-4 py-3 bg-gray-700">
            <h2 class="text-xl">Products</h2>
            <h3 class="text-3xl font-bold text-center text-orange-500 py-8">
                {originalProducts.length}
            </h3>
        </div>
        <div class="rounded-md px-4 py-3 bg-gray-700">
            <h2 class="text-xl">Orders</h2>
            <h3 class="text-3xl font-bold text-center text-orange-500 py-8">
                {orderDetails.length}
            </h3>
        </div>
        <div class="col-span-2 rounded-md px-4 py-3 bg-gray-700">
            <ul class="flex flex-col gap-2">
                <h2 class="text-xl">Order List</h2>
                <div class="grid grid-cols-3">
                    <h3 class="text-orange-500 font-bold">Name</h3>
                    <h3 class="text-orange-500 font-bold">Price</h3>
                    <h3 class="text-orange-500 font-bold">Delivery Location</h3>
                </div>
                {#each orderDetails as order}
                    <li
                        class="grid grid-cols-3 gap-2 rounded-md p-2 bg-gray-800"
                    >
                        <h3 class="">
                            {order.buyer.first_name + order.buyer.last_name}
                        </h3>
                        <h3>
                            ${order.products.reduce(
                                (total, orderItem) =>
                                    total +
                                    Number(orderItem.product.product_price) *
                                        Number(orderItem.quantity),
                                0
                            )}
                        </h3>
                        <h3>
                            {order.delivery_location}
                        </h3>
                    </li>
                {/each}
            </ul>
        </div>
    </div>
</div>
