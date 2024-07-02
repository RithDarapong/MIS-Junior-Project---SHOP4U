@if ($show)
    <nav id="header" class="w-full z-30 top-0 py-1 fixed bg-white">
        <div
            class="w-full container mx-auto flex flex-wrap items-center justify-between mt-0 py-3 px-6 bg-grey-200 shadow-sm">
            <div class="order-1 md:order-2">
                <a class="flex items-center tracking-wide no-underline hover:no-underline font-bold text-gray-800 text-xl "
                    href="/">
                    <svg class="fill-current text-gray-800 mr-2" xmlns="http://www.w3.org/2000/svg" width="24"
                        height="24" viewBox="0 0 24 24">
                        <path
                            d="M5,22h14c1.103,0,2-0.897,2-2V9c0-0.553-0.447-1-1-1h-3V7c0-2.757-2.243-5-5-5S7,4.243,7,7v1H4C3.447,8,3,8.447,3,9v11 C3,21.103,3.897,22,5,22z M9,7c0-1.654,1.346-3,3-3s3,1.346,3,3v1H9V7z M5,10h2v2h2v-2h6v2h2v-2h2l0.002,10H5V10z" />
                    </svg>
                    SHOP4U
                </a>
            </div>

            <div class="order-2 md:order-3 flex items-center" id="nav-content">

                <a class="pr-4 inline-block no-underline hover:text-black"
                    href="/checkout">
                    <svg class="fill-current hover:text-black" xmlns="http://www.w3.org/2000/svg" width="24"
                        height="24" viewBox="0 0 24 24">
                        <path
                            d="M21,7H7.462L5.91,3.586C5.748,3.229,5.392,3,5,3H2v2h2.356L9.09,15.414C9.252,15.771,9.608,16,10,16h8 c0.4,0,0.762-0.238,0.919-0.606l3-7c0.133-0.309,0.101-0.663-0.084-0.944C21.649,7.169,21.336,7,21,7z M17.341,14h-6.697L8.371,9 h11.112L17.341,14z" />
                        <circle cx="10.5" cy="18.5" r="1.5" />
                        <circle cx="17.5" cy="18.5" r="1.5" />
                    </svg>
                </a>

                <ul class="md:flex items-center justify-between text-base text-gray-700 px-4">
                    @if (Auth::check())
                        <!-- <li>
                            <a class="inline-block no-underline hover:text-black mr-2 font-semibold" href="/profile">
                                {{ Auth::user()->username }}</a>
                        </li>
                        {{-- logout btn --}}
                        <li><a class="inline-block no-underline hover:text-black" href="/logout">Logout</a></li> -->

                        <li class="relative">
                            <a class="inline-block no-underline hover:text-black mr-2 font-semibold" href="#">
                                {{ Auth::user()->username }}</a>
                            
                            <ul
                                class="absolute hidden text-gray-700 pt-2 bg-white border border-gray-300 rounded-lg flex flex-row">
                                {{-- profile btn --}}
                                <li><a class="inline-block text-center no-underline hover:text-black hover:underline py-2 px-2" style="width: 100px;" href="/profile">Profile</a></li>
                                {{-- logout btn --}}
                                <li><a class="inline-block text-center no-underline hover:text-black hover:underline py-2 px-2" style="width: 100px;" href="/logout">Logout</a></li>
                            </ul> 
                        </li>

                    @else
                    <li><a class="inline-block no-underline hover:text-black" href="sign-up">Sign Up</a></li>
                        <!-- <li class="relative">
                            <a class="inline-block no-underline hover:text-black" href="#">Sign Up</a>
                            
                            <ul
                                class="absolute hidden text-gray-700 pt-2 bg-white border border-gray-300 rounded-lg flex flex-row">
                                <li>
                                    <a class="inline-block text-center no-underline hover:text-black hover:underline py-2 px-2" style="width: 100px;" href="sign-up">As Buyer</a>
                                </li>
                                <li><a class="block no-underline hover:text-black hover:underline py-2 px-2"
                                        href="#">As Seller</a></li>
                            </ul> 
                        </li> -->
                    @endif
                </ul>
            </div>
        </div>
    </nav>
@endif
