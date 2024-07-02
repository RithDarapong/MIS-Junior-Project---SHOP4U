<script lang="ts">
    import { onMount } from "svelte";
    import Logo from "./Logo.svelte";
    import Button from "./ui/button/button.svelte";
    import { PUBLIC_API_URL } from "$env/static/public";
    import { goto } from "$app/navigation";
    interface Business {
        business_id: number;
        seller_id: number;
        business_name: string;
        business_address: string;
        business_contact: string;
        business_hours: string;
    }

    let originalBusiness: Business;

    onMount(() => {
        fetch(`${PUBLIC_API_URL}/seller/business`, {
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
                    originalBusiness = data;
                }
            })
            .catch((err) => {
                console.log(err);
            });
    });
</script>

<aside
    class="fixed top-0 left-0 z-50 w-[300px] min-h-screen bg-gray-800 text-gray-200 font-bold p-4 flex flex-col justify-between"
>
    <div>
        <Logo />
        <div class="mt-8">
            <div>
                <h1 class="text-lg text-orange-500">Dashboard</h1>
                <div class="flex mt-4 flex-col gap-2">
                    <a
                        href="/"
                        class="flex justify-start group text-base px-4 py-2 gap-4 group hover:bg-gray-700 transition-all rounded-md"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="icon icon-tabler icon-tabler-building-store w-6 stroke-gray-200 group-hover:stroke-orange-500"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="#2c3e50"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
                            <path
                                d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"
                            />
                            <path d="M10 12h4v4h-4z" />
                        </svg>
                        <h2 class="group-hover:text-orange-500">Home</h2>
                    </a>
                    <a
                        href="/products"
                        class="flex justify-start group text-base px-4 py-2 gap-4 group hover:bg-gray-700 transition-all rounded-md"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="icon icon-tabler icon-tabler-box-seam w-6 stroke-gray-200 group-hover:stroke-orange-500"
                            viewBox="0 0 24 24"
                            stroke-width="1.75"
                            stroke="#2c3e50"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M12 3l8 4.5v9l-8 4.5l-8 -4.5v-9l8 -4.5" />
                            <path d="M12 12l8 -4.5" />
                            <path d="M8.2 9.8l7.6 -4.6" />
                            <path d="M12 12v9" />
                            <path d="M12 12l-8 -4.5" />
                        </svg>
                        <h2 class="group-hover:text-orange-500">
                            Product Management
                        </h2>
                    </a>
                    <a
                        href="/orders"
                        class="flex justify-start group text-base px-4 py-2 gap-4 group hover:bg-gray-700 transition-all rounded-md"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="icon icon-tabler icon-tabler-truck-delivery w-6 stroke-gray-200 group-hover:stroke-orange-500"
                            viewBox="0 0 24 24"
                            stroke-width="1.75"
                            stroke="#2c3e50"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                            <path
                                d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"
                            />
                            <path
                                d="M5 17h-2v-4m-1 -8h11v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5"
                            />
                            <path d="M3 9l4 0" />
                        </svg>
                        <h2 class="group-hover:text-orange-500">
                            Order Management
                        </h2>
                    </a>
                </div>
            </div>
        </div>
    </div>
    {#if originalBusiness}
        <div class="grid grid-cols-4 gap-4">
            <a
                href="/business"
                class="flex justify-start group text-base px-4 py-2 gap-4 group hover:bg-gray-700 transition-all rounded-md col-span-3"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon icon-tabler icon-tabler-building-store w-6 stroke-gray-200 group-hover:stroke-orange-500"
                    viewBox="0 0 24 24"
                    stroke-width="1.75"
                    stroke="#2c3e50"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M3 21l18 0" />
                    <path
                        d="M3 7v1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1h-18l2 -4h14l2 4"
                    />
                    <path d="M5 21l0 -10.15" />
                    <path d="M19 21l0 -10.15" />
                    <path d="M9 21v-4a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v4" />
                </svg>
                <h2 class="group-hover:text-orange-500">
                    {originalBusiness.business_name}
                </h2>
            </a>
            <Button
                on:click={() => {
                    document.cookie =
                        "token" +
                        "=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
                    location.reload();
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon icon-tabler icon-tabler-building-store w-6 stroke-gray-200"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="#2c3e50"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path
                        d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"
                    />
                    <path d="M9 12h12l-3 -3" />
                    <path d="M18 15l3 -3" />
                </svg>
            </Button>
        </div>
    {/if}
</aside>
