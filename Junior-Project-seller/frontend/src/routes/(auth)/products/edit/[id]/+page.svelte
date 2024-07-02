<script lang="ts">
    import { goto } from "$app/navigation";
    import { PUBLIC_API_URL } from "$env/static/public";
    import Button from "$lib/components/ui/button/button.svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import { onMount } from "svelte";

    export let data;
    interface Product {
        product_title: string;
        product_description: string;
        product_price: number;
    }

    let originalProduct: Product;
    let currentProduct: Product = {
        product_title: "",
        product_description: "",
        product_price: 0,
    };
    onMount(() => {
        fetch(`${PUBLIC_API_URL}/product/${data.product_id}`, {
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
                    originalProduct = data;
                    currentProduct = { ...originalProduct };
                }
            })
            .catch((err) => {
                console.log(err);
            });
    });

    function updateProduct() {
        fetch(`${PUBLIC_API_URL}/product/${data.product_id}`, {
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            method: "PUT",
            body: JSON.stringify(currentProduct),
        })
            .then((res) => {
                if (res.status == 200) return res.json();
                else throw res.json();
            })
            .then((data) => {
                console.log(data);
                if (data) {
                    originalProduct = { ...currentProduct };
                    goto("/products");
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function resetChanges() {
        currentProduct = { ...originalProduct };
    }
</script>

<div class="grid grid-cols-2">
    <div class="text-white flex flex-col gap-4">
        <h1 class="text-2xl font-bold">Edit Product</h1>
        <div class="flex gap-2 flex-col">
            <label for="Product Title">Product Title</label>
            <Input
                bind:value={currentProduct.product_title}
                placeholder="Product Title"
                id="Product Title"
                class="border-gray-500 border-2 focus:border-orange-500"
            />
        </div>
        <div class="flex gap-2 flex-col">
            <label for="Product Description">Product Description</label>
            <Input
                bind:value={currentProduct.product_description}
                placeholder="Product Description"
                id="Product Description"
                class="border-gray-500 border-2 focus:border-orange-500"
            />
        </div>
        <div class="flex gap-2 flex-col">
            <label for="Product Price">Product Price</label>
            <Input
                bind:value={currentProduct.product_price}
                type="number"
                placeholder="Product Price"
                id="Product Price"
                class="border-gray-500 border-2 focus:border-orange-500"
            />
        </div>
        <div class="flex justify-end gap-4 mt-4">
            <Button on:click={resetChanges} variant="secondary"
                >Reset Changes</Button
            >
            <Button on:click={updateProduct}>Apply Changes</Button>
        </div>
    </div>
</div>
