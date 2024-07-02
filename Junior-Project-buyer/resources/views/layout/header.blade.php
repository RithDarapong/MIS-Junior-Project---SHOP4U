<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link href="{{ asset('css/app.css') }}" rel="stylesheet">
<meta name="csrf-token" content="{{ csrf_token() }}">

{{-- defer mean execute js after page loaded --}}
<script src="{{ asset('/js/cart.js') }}" defer></script>
<script src="{{ asset('/js/profile.js') }}" defer></script>
<style>

    .container {
        max-width: 444px;
        margin: 0 auto; /* Center the container */
        padding: 20px; /* Add some padding inside the container */
        background-color: #fff; /* Just for visualization */
    }

    .container-disableGutters {
        padding-left: 0;
        padding-right: 0;
    }

    .work-sans {
        font-family: 'Work Sans', sans-serif;
    }

    #menu-toggle:checked + #menu {
        display: block;
    }

    .hover\:grow {
        transition: all 0.3s;
        transform: scale(1);
    }

    .hover\:grow:hover {
        transform: scale(1.02);
    }

    .carousel-open:checked + .carousel-item {
        position: static;
        opacity: 100;
    }

    .carousel-item {
        -webkit-transition: opacity 0.6s ease-out;
        transition: opacity 0.6s ease-out;
    }

    #carousel-1:checked ~ .control-1,
    #carousel-2:checked ~ .control-2,
    #carousel-3:checked ~ .control-3 {
        display: block;
    }

    .carousel-indicators {
        list-style: none;
        margin: 0;
        padding: 0;
        position: absolute;
        bottom: 2%;
        left: 0;
        right: 0;
        text-align: center;
        z-index: 10;
    }

    #carousel-1:checked ~ .control-1 ~ .carousel-indicators li:nth-child(1) .carousel-bullet,
    #carousel-2:checked ~ .control-2 ~ .carousel-indicators li:nth-child(2) .carousel-bullet,
    #carousel-3:checked ~ .control-3 ~ .carousel-indicators li:nth-child(3) .carousel-bullet {
        color: #000;
    }

    .relative:hover > ul {
        display: block;
    }

</style>
