<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import * as Table from "$lib/components/ui/table/index.js";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { buttonVariants } from "$lib/components/ui/button";
    import { onMount } from "svelte";
    import { PUBLIC_API_URL } from "$env/static/public";

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

    let orderDetails: OrderDetail[] = [];
    let search = "",
        sortByDateAsc = true;
    $: filteredDetails = searchOrderDetails(search, sortByDateAsc);
    function searchOrderDetails(
        searchTerm: string,
        sortByDateAsc: boolean
    ): OrderDetail[] {
        let filteredDetails = orderDetails.filter((orderDetail) => {
            // Check if any property includes the search term
            const includesTerm = (obj: any): boolean => {
                if (typeof obj === "object") {
                    for (const key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            if (includesTerm(obj[key])) {
                                return true;
                            }
                        }
                    }
                } else if (
                    (typeof obj === "string" || typeof obj === "number") &&
                    obj
                        .toString()
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                ) {
                    return true;
                }
                return false;
            };

            // Search for combination of first name and last name
            const fullName =
                orderDetail.buyer.first_name +
                " " +
                orderDetail.buyer.last_name;
            if (fullName.toLowerCase().includes(searchTerm.toLowerCase())) {
                return true;
            }

            // Search for total price
            const totalPrice = orderDetail.products.reduce(
                (total, orderItem) =>
                    total +
                    Number(orderItem.product.product_price) *
                        Number(orderItem.quantity),
                0
            );
            if (
                totalPrice
                    .toString()
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            ) {
                return true;
            }

            return includesTerm(orderDetail);
        });

        // Sort by date
        if (sortByDateAsc) {
            filteredDetails.sort(
                (a, b) =>
                    convertToDate(a.order_date).getTime() -
                    convertToDate(b.order_date).getTime()
            );
        } else {
            filteredDetails.sort(
                (a, b) =>
                    convertToDate(b.order_date).getTime() -
                    convertToDate(a.order_date).getTime()
            );
        }

        return filteredDetails;
    }

    // Helper function to convert date string to Date object
    function convertToDate(dateString: string): Date {
        const parts = dateString.split("-");
        // Assuming the date format is "DD-MM-YYYY"
        return new Date(
            parseInt(parts[2]),
            parseInt(parts[1]) - 1,
            parseInt(parts[0])
        );
    }

    onMount(() => {
        getOrders();
    });

    async function getOrders() {
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
                    filteredDetails = deepClone(orderDetails);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    async function deleteOrder(order_detail_id: number) {
        const response = await fetch(
            `${PUBLIC_API_URL}/order_detail/${order_detail_id}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            }
        );
        if (!response.ok) {
            throw new Error("Failed to delete order");
        }
        const result = await response.json();
        if (result.success) {
            getOrders();
        }
    }

    function deepClone(obj: any) {
        return JSON.parse(JSON.stringify(obj));
    }
    function toggleDateSort() {
        sortByDateAsc = !sortByDateAsc;
    }
</script>

<div class="grid">
    <div class="text-white text-lg flex flex-col gap-4 col-span-2">
        <div class="flex justify-start">
            <h1 class="text-2xl font-bold">Order Management</h1>
        </div>
        <div class="flex justify-between gap-4">
            <Input
                bind:value={search}
                placeholder="Search"
                id="Search"
                class="border-gray-500 border-2 focus:border-orange-500 w-[240px]"
            />
            <div class="flex items-center gap-2">
                <h2>Sort by Date</h2>
                <Button class="px-2 py-1 bg-gray-700" on:click={toggleDateSort}>
                    {#if sortByDateAsc}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="icon icon-tabler icon-tabler-arrow-narrow-up w-5 stroke-white"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="#2c3e50"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M12 5l0 14" />
                            <path d="M16 9l-4 -4" />
                            <path d="M8 9l4 -4" />
                        </svg>
                    {:else}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="icon icon-tabler icon-tabler-arrow-narrow-down w-5 stroke-white"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="#2c3e50"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M12 5l0 14" />
                            <path d="M16 15l-4 4" />
                            <path d="M8 15l4 4" />
                        </svg>
                    {/if}
                </Button>
            </div>
        </div>
        <Table.Root>
            <Table.Header>
                <Table.Row class="font-bold">
                    <Table.Head class="w-[100px] text-orange-500">ID</Table.Head
                    >
                    <Table.Head class="w-32 text-orange-500"
                        >Customer Name</Table.Head
                    >
                    <Table.Head class="text-orange-500"
                        >Customer Contact</Table.Head
                    >
                    <Table.Head class="text-orange-500">Total Price</Table.Head>
                    <Table.Head class="text-orange-500">Order Date</Table.Head>
                    <Table.Head class="text-orange-500"
                        >Delivery Location</Table.Head
                    >
                    <Table.Head class="text-orange-500">Products</Table.Head>
                    <Table.Head class="w-[140px]"></Table.Head>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {#each filteredDetails as order, i (i)}
                    <Table.Row class="hover:bg-gray-800">
                        <Table.Cell>{order.order_detail_id}</Table.Cell>
                        <Table.Cell
                            >{order.buyer.first_name +
                                " " +
                                order.buyer.last_name}</Table.Cell
                        >
                        <Table.Cell>{order.customer_contact}</Table.Cell>
                        <Table.Cell
                            >${order.products.reduce(
                                (total, orderItem) =>
                                    total +
                                    Number(orderItem.product.product_price) *
                                        Number(orderItem.quantity),
                                0
                            )}
                        </Table.Cell>
                        <Table.Cell>{order.order_date}</Table.Cell>
                        <Table.Cell>{order.delivery_location}</Table.Cell>
                        <Table.Cell>
                            {#each order.products as orderItem, j}
                                {#if j != 0}
                                    {", "}
                                {/if}
                                {orderItem.product.product_title +
                                    " x" +
                                    orderItem.quantity}
                            {/each}
                        </Table.Cell>
                        <Table.Cell
                            ><Button
                                class="px-2"
                                href={"/orders/edit/" + order.order_detail_id}
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
                                        Delete Order
                                    </h1>
                                    <p class="text-white text-center">
                                        This action cannot be reverted
                                    </p>
                                    <div class="flex justify-between">
                                        <Dialog.Close
                                            ><Button
                                                type="submit"
                                                variant="secondary"
                                                >Cancel</Button
                                            ></Dialog.Close
                                        >
                                        <Dialog.Close>
                                            <Button
                                                type="submit"
                                                class="bg-red-600 hover:bg-red-700"
                                                on:click={() =>
                                                    deleteOrder(
                                                        order.order_detail_id
                                                    )}>Delete</Button
                                            >
                                        </Dialog.Close>
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
