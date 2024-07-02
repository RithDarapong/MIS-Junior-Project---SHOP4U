<script lang="ts">
    import { goto } from "$app/navigation";
    import { PUBLIC_API_URL } from "$env/static/public";
    import Button from "$lib/components/ui/button/button.svelte";
    import Input from "$lib/components/ui/input/input.svelte";

    let email = "",
        password = "";
    function login() {
        fetch(`${PUBLIC_API_URL}/login`, {
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            method: "POST",
            body: JSON.stringify({ email: email, password: password }),
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
        <h1 class="text-3xl font-bold text-center">Login</h1>
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
        <div class="flex justify-between gap-4 mt-4">
            <a href="/register" class="text-orange-500">Register</a>
            <Button on:click={login}>Login</Button>
        </div>
    </div>
</div>
