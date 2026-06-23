@extends('layouts.shop', ['title' => 'Shop - Shop ICT Gadgets'])

@section('content')
  <section class="site-desktop-width mx-auto px-2 py-8 md:px-6">
    <div class="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <h1 class="text-[34px] font-normal leading-none">Shop</h1>
      <form class="flex flex-col gap-2 sm:flex-row" method="get" action="/shop">
        <input class="h-10 rounded-[3px] border border-[#dddddd] px-3 text-sm outline-none focus:border-[#e92d48]" name="q" value="{{ $search }}" placeholder="Search products">
        <select class="h-10 rounded-[3px] border border-[#dddddd] px-3 text-sm" name="sort">
          <option value="newest" @selected($sort === 'newest')>Newest</option>
          <option value="price-asc" @selected($sort === 'price-asc')>Price: Low to High</option>
          <option value="price-desc" @selected($sort === 'price-desc')>Price: High to Low</option>
        </select>
        <button class="h-10 rounded-[3px] bg-[#e92d48] px-4 text-sm font-medium text-white">Search</button>
      </form>
    </div>

    <div class="grid grid-cols-2 gap-1 md:grid-cols-4 md:gap-3 2xl:grid-cols-6">
      @forelse($products as $product)
        <x-product-card :product="$product" />
      @empty
        <div class="col-span-full rounded-[8px] border border-[#eeeeee] bg-[#fafafa] px-4 py-8 text-center">
          <p class="text-sm font-medium">Product not found.</p>
          <p class="mt-1 text-sm text-[#6b7280]">Try another search or import products into MySQL.</p>
        </div>
      @endforelse
    </div>

    <div class="mt-8">
      {{ $products->links() }}
    </div>
  </section>
@endsection
