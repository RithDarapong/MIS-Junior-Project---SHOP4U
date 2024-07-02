<script lang="ts">
    import { goto } from "$app/navigation";
    import { PUBLIC_API_URL } from "$env/static/public";
    import Button from "$lib/components/ui/button/button.svelte";
    import Input from "$lib/components/ui/input/input.svelte";

    let email = "",
        password = "",
        firstName = "",
        lastName = "",
        username = "",
        businessName = "",
        businessAddress = "",
        businessContact = "",
        businessHours = "";
    function register() {
        fetch(`${PUBLIC_API_URL}/register`, {
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            method: "POST",
            body: JSON.stringify({
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName,
                username: username,
                businessName: businessName,
                businessAddress: businessAddress,
                businessContact: businessContact,
                businessHours: businessHours,
            }),
        })
            .then((res) => {
                if (res.status == 200) return res.json();
                else throw res.json();
            })
            .then((data) => {
                console.log(data);
                if (data) goto("/");
            })
            .catch((err) => {
                console.log(err);
            });
    }
</script>

<div class="grid w-[600px] mx-auto">
    <div class="text-white flex flex-col gap-4">
        <h1 class="text-3xl font-bold text-center">Register</h1>
        <div class="flex gap-2 flex-col">
            <label for="Email">First Name</label>
            <Input
                bind:value={firstName}
                placeholder="FirstName"
                id="FirstName"
                class="border-gray-500 border-2 focus:border-orange-500"
            />
        </div>
        <div class="flex gap-2 flex-col">
            <label for="Email">Last Name</label>
            <Input
                bind:value={lastName}
                placeholder="LastName"
                id="LastName"
                class="border-gray-500 border-2 focus:border-orange-500"
            />
        </div>
        <div class="flex gap-2 flex-col">
            <label for="Email">Username</label>
            <Input
                bind:value={username}
                placeholder="Username"
                id="Username"
                class="border-gray-500 border-2 focus:border-orange-500"
            />
        </div>
        <div class="flex gap-2 flex-col">
            <label for="Email">Email</label>
            <Input
                bind:value={email}
                placeholder="Email"
                id="Email"
                class="border-gray-500 border-2 focus:border-orange-500"
            />
        </div>
        <div class="flex gap-2 flex-col">
            <label for="Password">Password</label>
            <Input
                type="password"
                bind:value={password}
                placeholder="Password"
                id="Password"
                class="border-gray-500 border-2 focus:border-orange-500"
            />
        </div>
        <div class="flex gap-2 flex-col">
            <label for="Business Name">Business Name</label>
            <Input
                bind:value={businessName}
                placeholder="Business Name"
                id="Business Name"
                class="border-gray-500 border-2 focus:border-orange-500"
            />
        </div>
        <div class="flex gap-2 flex-col">
            <label for="Business Address">Business Address</label>
            <Input
                bind:value={businessAddress}
                placeholder="Business Address"
                id="Business Address"
                class="border-gray-500 border-2 focus:border-orange-500"
            />
        </div>
        <div class="flex gap-2 flex-col">
            <label for="Business Contact">Business Contact</label>
            <Input
                bind:value={businessContact}
                placeholder="Business Contact"
                id="Business Contact"
                class="border-gray-500 border-2 focus:border-orange-500"
            />
        </div>
        <div class="flex gap-2 flex-col">
            <label for="Business Hours">Business Hours</label>
            <Input
                bind:value={businessHours}
                placeholder="Business Hours"
                id="Business Hours"
                class="border-gray-500 border-2 focus:border-orange-500"
            />
        </div>
        <div class="flex justify-between gap-4 mt-4">
            <a href="/login" class="text-orange-500">Login</a>
            <Button on:click={register}>Register</Button>
        </div>
    </div>
</div>
