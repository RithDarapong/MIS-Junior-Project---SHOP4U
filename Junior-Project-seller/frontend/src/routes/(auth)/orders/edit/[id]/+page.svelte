<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import * as Table from "$lib/components/ui/table/index.js";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { buttonVariants } from "$lib/components/ui/button";
    import { onMount } from "svelte";
    import { PUBLIC_API_URL } from "$env/static/public";
    import { goto } from "$app/navigation";
    export let data;
    interface Product {
        product_id: number;
        business_id: number;
        product_title: string;
        product_description: string;
        product_price: string;
        product_image: string;
    }
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

    interface Product {
        product_id: number;
        business_id: number;
        product_title: string;
        product_description: string;
        product_price: string;
        product_image: string;
    }
    let originalOrderDetail: OrderDetail;
    let currentOrderDetail: OrderDetail;
    onMount(() => {
        fetch(`${PUBLIC_API_URL}/order_detail/${data.order_detail_id}`, {
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
                    originalOrderDetail = data;
                    currentOrderDetail = deepClone(originalOrderDetail);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    });

    function deepClone(obj: any) {
        return JSON.parse(JSON.stringify(obj));
    }

    function resetChanges() {
        currentOrderDetail = deepClone(originalOrderDetail);
    }
    async function applyChanges() {
        const orderItemUpdates = currentOrderDetail.products.filter(
            (currentItem) => {
                const originalItem = originalOrderDetail.products.find(
                    (item) => item.order_item_id === currentItem.order_item_id
                );
                return currentItem.quantity !== originalItem?.quantity;
            }
        );

        if (orderItemUpdates.length === 0) {
            console.log("No changes detected");
            return;
        }

        try {
            await Promise.all(
                orderItemUpdates.map(async (orderItem) => {
                    const response = await fetch(
                        `${PUBLIC_API_URL}/order_item/${orderItem.order_item_id}`,
                        {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            credentials: "include",
                            body: JSON.stringify({
                                quantity: orderItem.quantity,
                            }),
                        }
                    );

                    if (!response.ok) {
                        throw new Error("Failed to update order item");
                    }
                })
            );

            console.log("Order items updated successfully");
            goto("/orders");
            // Optionally, you can reload the data after successful update
            // or show a success message to the user
        } catch (error) {
            console.error("Error updating order items:", error);
            // Optionally, you can show an error message to the user
        }
    }
</script>

{#if currentOrderDetail}
    <div class="grid grid-cols-3">
        <div class="text-white text-lg flex flex-col gap-4 col-span-2">
            <div class="flex justify-start">
                <h1 class="text-2xl font-bold">Order {data.order_detail_id}</h1>
            </div>
            <Table.Root>
                <Table.Header>
                    <Table.Row class="font-bold">
                        <Table.Head class="w-[100px] text-orange-500"
                            >ID</Table.Head
                        >
                        <Table.Head class="w-32 text-orange-500"
                            >Image</Table.Head
                        >
                        <Table.Head class="text-orange-500">Title</Table.Head>
                        <Table.Head class="text-orange-500">Price</Table.Head>
                        <Table.Head class="text-orange-500 w-[100px]"
                            >Quantity</Table.Head
                        >
                        <Table.Head class="text-orange-500"
                            >Total Price</Table.Head
                        >
                        <Table.Head class="w-[400px] text-orange-500"
                            >Description</Table.Head
                        >
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {#each currentOrderDetail.products as orderItem, i (i)}
                        <Table.Row class="hover:bg-gray-800">
                            <Table.Cell
                                >{orderItem.product.product_id}</Table.Cell
                            >
                            <Table.Cell>
                                <img
                                    src={`${PUBLIC_API_URL}/` +
                                        orderItem.product.product_image}
                                    class="w-24 aspect-square object-cover"
                                    alt=""
                                />
                            </Table.Cell>
                            <Table.Cell
                                >{orderItem.product.product_title}</Table.Cell
                            >
                            <Table.Cell
                                >${orderItem.product.product_price}</Table.Cell
                            >
                            <Table.Cell>
                                <Input
                                    bind:value={orderItem.quantity}
                                    type="number"
                                    class="w-full"
                                />
                            </Table.Cell>
                            <Table.Cell
                                >${Number(orderItem.quantity) *
                                    Number(
                                        orderItem.product.product_price
                                    )}</Table.Cell
                            >
                            <Table.Cell>
                                <p class=" ">
                                    {orderItem.product.product_description}
                                </p>
                            </Table.Cell>
                        </Table.Row>
                    {/each}
                </Table.Body>
            </Table.Root>
            <div class="flex justify-between gap-4 mt-4">
                <h2>
                    Sum: <span class="text-orange-500">
                        ${currentOrderDetail.products.reduce(
                            (total, orderItem) =>
                                total +
                                Number(orderItem.product.product_price) *
                                    Number(orderItem.quantity),
                            0
                        )}
                    </span>
                </h2>
                <div class="flex justify-end gap-4">
                    <Button on:click={resetChanges} variant="secondary"
                        >Reset Changes</Button
                    >
                    <Button on:click={applyChanges}>Apply Changes</Button>
                </div>
            </div>
        </div>
    </div>
{/if}
