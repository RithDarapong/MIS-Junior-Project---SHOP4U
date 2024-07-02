<script lang="ts">
    import { goto } from "$app/navigation";
    import { PUBLIC_API_URL } from "$env/static/public";
    import Button from "$lib/components/ui/button/button.svelte";
    import Input from "$lib/components/ui/input/input.svelte";

    let product_title = "";
    let product_description = "";
    let product_price = "";
    let files: FileList;

    function addProduct() {
        if (files && files.length > 0) {
            console.log("has file");
            let formData = new FormData();
            formData.append("product_title", product_title);
            formData.append("product_description", product_description);
            formData.append("product_price", product_price.toString());
            formData.append("productImage", files[0]);
            fetch(`${PUBLIC_API_URL}/seller/product`, {
                method: "POST",
                body: formData,
                credentials: "include",
            })
                .then((res) => {
                    if (res.ok) return res.json();
                    else throw new Error("Network response was not ok.");
                })
                .then((data) => {
                    console.log(data);
                    if (data) goto("/products");
                })
                .catch((err) => {
                    console.error("Error:", err);
                });
        }
    }
</script>

<div class="grid grid-cols-2">
    <div class="text-white flex flex-col gap-4">
        <h1 class="text-2xl font-bold">Add Product</h1>
        <div class="flex gap-2 flex-col">
            <label for="Product Title">Product Title</label>
            <Input
                bind:value={product_title}
                placeholder="Product Title"
                id="Product Title"
                class="border-gray-500 border-2 focus:border-orange-500"
            />
        </div>
        <div class="flex gap-2 flex-col">
            <label for="Product Description">Product Description</label>
            <Input
                bind:value={product_description}
                placeholder="Product Description"
                id="Product Description"
                class="border-gray-500 border-2 focus:border-orange-500"
            />
        </div>
        <div class="flex gap-2 flex-col">
            <label for="Product Price">Product Price</label>
            <Input
                bind:value={product_price}
                placeholder="Product Price"
                id="Product Price"
                type="number"
                class="border-gray-500 border-2 focus:border-orange-500"
            />
        </div>
        <div class="flex gap-2 flex-col">
            <label for="Product Image">Product Image</label>
            <input
                bind:files
                type="file"
                placeholder="Product Image"
                id="Product Image"
                class="border-gray-500 border-2 focus:border-orange-500 text-orange-500 bg-gray-600 p-2 rounded-md"
            />
        </div>
        <div class="flex justify-end gap-4 mt-4">
            <Button on:click={addProduct}>Add</Button>
        </div>
    </div>
</div>
