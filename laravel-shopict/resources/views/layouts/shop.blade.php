<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $title ?? 'Shop ICT Gadgets' }}</title>
    <meta name="description" content="{{ $description ?? 'Shop ICT products, electronics, accessories, phones, laptops, printers, networking accessories, and more.' }}">
    <link rel="manifest" href="/manifest.webmanifest">
    <link rel="icon" href="/icon-192.png">
    <link rel="stylesheet" href="/assets/styles-lIcuQCyl.css">
  </head>
  <body class="bg-white text-[#222222]">
    <header class="sticky top-0 z-40 border-b border-[#eeeeee] bg-white/95 backdrop-blur">
      <div class="site-desktop-width mx-auto flex items-center justify-between gap-4 px-3 py-3 md:px-6">
        <a href="/" class="flex items-center gap-3">
          <img src="/logo.png" alt="Shop ICT Gadgets" class="h-10 w-auto">
          <span class="hidden text-sm font-semibold tracking-wide text-[#222222] sm:inline">Shop ICT Gadgets</span>
        </a>
        <nav class="flex items-center gap-1 text-sm">
          <a class="rounded-[3px] px-3 py-2 hover:bg-[#f7f7f7]" href="/">Home</a>
          <a class="rounded-[3px] px-3 py-2 hover:bg-[#f7f7f7]" href="/shop">Shop</a>
          <a class="rounded-[3px] px-3 py-2 hover:bg-[#f7f7f7]" href="/cart">Cart</a>
          <a class="rounded-[3px] bg-[#e92d48] px-3 py-2 font-medium text-white" href="/auth">Login</a>
        </nav>
      </div>
    </header>

    <main>
      @yield('content')
    </main>

    <footer class="mt-16 border-t border-[#eeeeee] bg-[#111827] text-white">
      <div class="site-desktop-width mx-auto grid gap-8 px-4 py-10 md:grid-cols-[1.2fr_0.8fr] md:px-6">
        <div>
          <img src="/logo.png" alt="Shop ICT Gadgets" class="h-12 w-auto rounded bg-white p-1">
          <p class="mt-4 max-w-xl text-sm text-white/75">Dealers in IT products, electronics, accessories, phones, homewear, servers, networking accessories, and more.</p>
        </div>
        <div class="text-sm text-white/75">
          <p class="font-semibold text-white">Need help?</p>
          <a class="mt-3 inline-flex rounded-[3px] bg-[#25D366] px-4 py-2 font-medium text-white" href="https://wa.me/{{ preg_replace('/\D+/', '', $whatsapp ?? '+254713869018') }}">WhatsApp us</a>
        </div>
      </div>
    </footer>
  </body>
</html>
