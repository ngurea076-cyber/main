@extends('layouts.shop', ['title' => $product->title . ' - Shop ICT Gadgets'])

@section('content')
  @php
    $images = is_array($product->images) ? $product->images : [];
    $mainImage = $images[0] ?? '/app-icon.jpg';
    $specs = is_array($product->specs) ? $product->specs : [];
  @endphp

  <section class="site-desktop-width mx-auto grid gap-8 px-4 py-8 md:grid-cols-[0.9fr_1.1fr] md:px-6">
    <div class="overflow-hidden rounded-[8px] bg-[#f7f7f7]">
      <img src="{{ $mainImage }}" alt="{{ $product->title }}" class="aspect-square w-full object-cover">
    </div>
    <div>
      <p class="text-sm uppercase text-[#6b7280]">{{ $product->brand }}</p>
      <h1 class="mt-2 text-[32px] font-semibold leading-tight">{{ $product->title }}</h1>
      <p class="mt-4 text-[24px] font-semibold text-[#e92d48]">KSh {{ number_format((float) $product->price) }}</p>
      @if($product->description)
        <div class="prose prose-sm mt-6 max-w-none text-[#4b5563]">{!! nl2br(e($product->description)) !!}</div>
      @endif
      <div class="mt-7 flex flex-wrap gap-3">
        <a href="https://wa.me/{{ preg_replace('/\D+/', '', $whatsapp) }}?text={{ urlencode('Hello, I am interested in ' . $product->title) }}" class="rounded-[3px] bg-[#25D366] px-5 py-3 text-sm font-semibold text-white">WhatsApp</a>
        <a href="/cart" class="rounded-[3px] border border-[#dddddd] px-5 py-3 text-sm font-semibold">View cart</a>
      </div>
      @if(count($specs))
        <dl class="mt-8 grid gap-3 rounded-[8px] border border-[#eeeeee] p-4 text-sm">
          @foreach($specs as $key => $value)
            <div class="grid grid-cols-[120px_1fr] gap-3">
              <dt class="font-medium">{{ $key }}</dt>
              <dd class="text-[#6b7280]">{{ is_scalar($value) ? $value : json_encode($value) }}</dd>
            </div>
          @endforeach
        </dl>
      @endif
    </div>
  </section>

  @if($related->count())
    <section class="site-desktop-width mx-auto px-2 py-8 md:px-6">
      <h2 class="mb-5 text-[24px] font-semibold">Similar products</h2>
      <div class="grid grid-cols-2 gap-1 md:grid-cols-4 md:gap-3">
        @foreach($related as $item)
          <x-product-card :product="$item" />
        @endforeach
      </div>
    </section>
  @endif
@endsection
