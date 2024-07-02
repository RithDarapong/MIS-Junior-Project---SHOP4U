<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import * as Table from "$lib/components/ui/table/index.js";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { buttonVariants } from "$lib/components/ui/button";
    import { onMount } from "svelte";
    import { PUBLIC_API_URL } from "$env/static/public";
    interface Product {
        product_id: number;
        business_id: number;
        product_title: string;
        product_description: string;
        product_price: string;
        product_image: string;
    }
    let originalProducts: Product[] = [];
    $: filteredProducts = filterProducts(originalProducts, search);
    let search: string = "";
    function filterProducts(products: Product[], search: string) {
        return products.filter((product) => {
            // Convert all object properties to lowercase strings, except product_image
            const productString = Object.keys(product)
                .filter((key) => key !== "product_image") // Exclude 'product_image'
                // @ts-ignore
                .map((key) => String(product[key]).toLowerCase())
                .join(" ");

            // Check if the product string includes the search string
            return productString.includes(search.toLowerCase());
        });
    }

    onMount(() => {
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

    function deleteProduct(id: number) {
        fetch(`${PUBLIC_API_URL}/product/${id}`, {
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            method: "DELETE",
        })
            .then((res) => {
                if (res.status == 200) return res.json();
                else throw res.json();
            })
            .then((data) => {
                console.log(data);
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
            })
            .catch((err) => {
                console.log(err);
            });
    }
</script>

<div class="grid grid-cols-3">
    <div class="text-white text-lg flex flex-col gap-4 col-span-2">
        <div class="flex justify-between">
            <h1 class="text-2xl font-bold">Product Management</h1>
            <Button href="/products/add" class="px-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon icon-tabler icon-tabler-plus w-6 stroke-white"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="#2c3e50"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M12 5l0 14" />
                    <path d="M5 12l14 0" />
                </svg>
            </Button>
        </div>
        <Input
            bind:value={search}
            placeholder="Search"
            id="Search"
            class="border-gray-500 border-2 focus:border-orange-500 w-[240px]"
        />
        <Table.Root>
            <Table.Header>
                <Table.Row class="font-bold">
                    <Table.Head class="w-[100px] text-orange-500">ID</Table.Head
                    >
                    <Table.Head class="w-32 text-orange-500">Image</Table.Head>
                    <Table.Head class="text-orange-500">Title</Table.Head>
                    <Table.Head class="text-orange-500">Price</Table.Head>
                    <Table.Head class="w-[400px] text-orange-500"
                        >Description</Table.Head
                    >
                    <Table.Head class="w-[140px]"></Table.Head>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {#each filteredProducts as product, i (i)}
                    <Table.Row class="hover:bg-gray-800">
                        <Table.Cell>{product.product_id}</Table.Cell>
                        <Table.Cell>
                            <img
                                src={`${PUBLIC_API_URL}/` +
                                    product.product_image}
                                class="w-24 aspect-square object-cover"
                                alt=""
                            />
                        </Table.Cell>
                        <Table.Cell>{product.product_title}</Table.Cell>
                        <Table.Cell>${product.product_price}</Table.Cell>
                        <Table.Cell>
                            <p class=" ">
                                {product.product_description}
                            </p>
                        </Table.Cell>
                        <Table.Cell>
                            <Button
                                class="px-2"
                                href={"/products/edit/" + product.product_id}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="icon icon-tabler icon-tabler-pencil w-6 stroke-white"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="#2c3e50"
                                    fill="none"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <path
                                        stroke="none"
                                        d="M0 0h24v24H0z"
                                        fill="none"
                                    />
                                    <path
                                        d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4"
                                    />
                                    <path d="M13.5 6.5l4 4" />
                                </svg>
                            </Button>
                            <Dialog.Root>
                                <Dialog.Trigger
                                    class={buttonVariants({}) +
                                        " px-[8px] bg-red-600 hover:bg-red-700"}
                                    ><svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="icon icon-tabler icon-tabler-trash w-6 stroke-white"
                                        viewBox="0 0 24 24"
                                        stroke-width="1.5"
                                        stroke="#2c3e50"
                                        fill="none"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    >
                                        <path
                                            stroke="none"
                                            d="M0 0h24v24H0z"
                                            fill="none"
                                        />
                                        <path d="M4 7l16 0" />
                                        <path d="M10 11l0 6" />
                                        <path d="M14 11l0 6" />
                                        <path
                                            d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"
                                        />
                                        <path
                                            d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"
                                        />
                                    </svg></Dialog.Trigger
                                >
                                <Dialog.Content
                                    class="sm:max-w-[425px] bg-gray-800 border-gray-400 flex flex-col gap-8"
                                >
                                    <h1
                                        class="text-2xl font-bold text-center text-orange-500"
                                    >
                                        Delete Product
                                    </h1>
                                    <p class="text-white text-center">
                                        This action cannot be reverted
                                    </p>
                                    <div class="flex justify-between">
                                        <Dialog.Close>
                                            <Button
                                                type="submit"
                                                variant="secondary"
                                                >Cancel</Button
                                            >
                                        </Dialog.Close>
                                        <Dialog.Close
                                            ><Button
                                                on:click={() =>
                                                    deleteProduct(
                                                        product.product_id
                                                    )}
                                                type="submit"
                                                class="bg-red-600 hover:bg-red-700"
                                                >Delete</Button
                                            ></Dialog.Close
                                        >
                                    </div>
                                </Dialog.Content>
                            </Dialog.Root>
                        </Table.Cell>
                    </Table.Row>
                {/each}
            </Table.Body>
        </Table.Root>
    </div>
</div>
