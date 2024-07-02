<script lang="ts">
    import { PUBLIC_API_URL } from "$env/static/public";
    import Button from "$lib/components/ui/button/button.svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import { onMount } from "svelte";

    interface Business {
        business_id: number;
        seller_id: number;
        business_name: string;
        business_address: string;
        business_contact: string;
        business_hours: string;
    }

    let originalBusiness: Business;
    let currentBusiness: Business = {
        business_id: 0,
        seller_id: 0,
        business_name: "",
        business_address: "",
        business_contact: "",
        business_hours: "",
    };
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
                    currentBusiness = { ...originalBusiness };
                }
            })
            .catch((err) => {
                console.log(err);
            });
    });

    function updateBusiness() {
        fetch(`${PUBLIC_API_URL}/seller/business`, {
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            method: "PUT",
            body: JSON.stringify(currentBusiness),
        })
            .then((res) => {
                if (res.status == 200) return res.json();
                else throw res.json();
            })
            .then((data) => {
                console.log(data);
                if (data) {
                    originalBusiness = { ...currentBusiness };
                    location.reload();
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function resetChanges() {
        currentBusiness = { ...originalBusiness };
    }
</script>

<div class="grid grid-cols-2">
    <div class="text-white flex flex-col gap-4">
        <h1 class="text-2xl font-bold">Business Information</h1>
        <div class="flex gap-2 flex-col">
            <label for="Business Name">Business Name</label>
            <Input
                bind:value={currentBusiness.business_name}
                placeholder="Business Name"
                id="Business Name"
                class="border-gray-500 border-2 focus:border-orange-500"
            />
        </div>
        <div class="flex gap-2 flex-col">
            <label for="Business Address">Business Address</label>
            <Input
                bind:value={currentBusiness.business_address}
                placeholder="Business Address"
                id="Business Address"
                class="border-gray-500 border-2 focus:border-orange-500"
            />
        </div>
        <div class="flex gap-2 flex-col">
            <label for="Business Contact">Business Contact</label>
            <Input
                bind:value={currentBusiness.business_contact}
                placeholder="Business Contact"
                id="Business Contact"
                class="border-gray-500 border-2 focus:border-orange-500"
            />
        </div>
        <div class="flex gap-2 flex-col">
            <label for="Business Hours">Business Hours</label>
            <Input
                bind:value={currentBusiness.business_hours}
                placeholder="Business Hours"
                id="Business Hours"
                class="border-gray-500 border-2 focus:border-orange-500"
            />
        </div>
        <div class="flex justify-end gap-4 mt-4">
            <Button on:click={resetChanges} variant="secondary"
                >Reset Changes</Button
            >
            <Button on:click={updateBusiness}>Apply Changes</Button>
        </div>
    </div>
</div>
