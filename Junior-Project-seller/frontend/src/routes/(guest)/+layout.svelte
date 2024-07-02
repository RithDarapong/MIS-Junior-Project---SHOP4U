<script>
    import Logo from "$lib/components/Logo.svelte";
    import Sidebar from "$lib/components/Sidebar.svelte";
    import "../../app.css";
</script>

<main class="p-4 bg-gray-900 min-h-screen w-full">
    <div class="grid place-items-center mb-4">
        <Logo />
    </div>
    <slot />
</main>
