<!DOCTYPE html>
<html>
<head>
  @include('layout.header')
</head>
<body class="bg-white text-gray-600 work-sans leading-normal text-base tracking-normal">

  <!--Nav-->
  @include('layout.menu', [
    'show' => $showMenu ?? true,
  ])
  <!--End Nav-->

  <!--slideshow-->
  @include('layout.slideshow')
  <!--End slideshow-->


  <!--Start Section-->
  @yield('dyncontent')
  <!--End Section-->

    <footer>
        @include('layout.footer')
    </footer>

</body>
</html>
