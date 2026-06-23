@extends('layouts.shop', ['title' => 'Cart - Shop ICT Gadgets'])

@section('content')
  <section class="site-desktop-width mx-auto px-4 py-10 md:px-6">
    <h1 class="text-[34px] font-normal leading-none">Cart</h1>
    <div class="mt-6 rounded-[8px] border border-[#eeeeee] bg-[#fafafa] p-8 text-center">
      <p class="text-sm font-medium">Your cart is ready for the Laravel checkout flow.</p>
      <p class="mt-2 text-sm text-[#6b7280]">For now, continue shopping or contact the shop directly on WhatsApp.</p>
      <div class="mt-6 flex justify-center gap-3">
        <a href="/shop" class="rounded-[3px] bg-[#e92d48] px-5 py-3 text-sm font-semibold text-white">Browse products</a>
        <a href="https://wa.me/{{ preg_replace('/\D+/', '', $whatsapp) }}" class="rounded-[3px] border border-[#dddddd] px-5 py-3 text-sm font-semibold">WhatsApp</a>
      </div>
    </div>
  </section>
@endsection
