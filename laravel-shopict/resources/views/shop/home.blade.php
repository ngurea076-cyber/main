@extends('layouts.shop', ['title' => 'Shop ICT Gadgets'])

@section('content')
  <section class="bg-[#f7f7f7]">
    <div class="site-desktop-width mx-auto px-4 py-10 md:px-6">
      <div class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div class="flex min-h-[300px] flex-col justify-center rounded-[8px] bg-[#111827] px-6 py-10 text-white md:px-10">
          <h1 class="max-w-2xl text-[34px] font-semibold leading-tight md:text-[48px]">Shop ICT Gadgets</h1>
          <p class="mt-4 max-w-xl text-sm leading-6 text-white/75 md:text-base">IT products, electronics, accessories, phones, laptops, printers, and networking accessories.</p>
          <div class="mt-7 flex flex-wrap gap-3">
            <a href="/shop" class="rounded-[3px] bg-[#e92d48] px-5 py-3 text-sm font-semibold text-white">Shop now</a>
            <a href="/cart" class="rounded-[3px] border border-white/30 px-5 py-3 text-sm font-semibold text-white">View cart</a>
          </div>
        </div>
        <div class="overflow-hidden rounded-[8px] bg-white">
          <img src="/app-icon.jpg" alt="Shop ICT Gadgets" class="h-full min-h-[300px] w-full object-cover">
        </div>
      </div>
    </div>
  </section>

  <section class="site-desktop-width mx-auto px-2 py-10 md:px-6">
    <div class="mb-5 flex items-center justify-between">
      <h2 class="text-[24px] font-semibold">Featured products</h2>
      <a href="/shop" class="text-sm font-medium text-[#e92d48]">View all</a>
    </div>
    <div class="grid grid-cols-2 gap-1 md:grid-cols-4 md:gap-3 2xl:grid-cols-6">
      @forelse(($featured->count() ? $featured : $products) as $product)
        <x-product-card :product="$product" />
      @empty
        <p class="col-span-full rounded-[8px] border border-[#eeeeee] bg-[#fafafa] p-6 text-center text-sm text-[#6b7280]">Products will appear here after the MySQL import.</p>
      @endforelse
    </div>
  </section>
@endsection
