@props(['product'])

@php
  $images = is_array($product->images) ? $product->images : [];
  $image = $images[0] ?? '/app-icon.jpg';
@endphp

<article class="mb-3 flex h-full w-full flex-col overflow-hidden rounded-[8px] border border-black/5 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)] sm:rounded-xl sm:p-[4px] sm:shadow-none">
  <a href="{{ route('products.show', $product->slug) }}" class="block overflow-hidden rounded-[8px] bg-[#f7f7f7]">
    <img src="{{ $image }}" alt="{{ $product->title }}" class="aspect-square h-auto w-full object-cover transition-transform duration-300 hover:scale-[1.03]" loading="lazy">
  </a>
  <div class="flex flex-1 flex-col px-[6px] pb-[10px] pt-2">
    <div class="flex items-center justify-between gap-2">
      @if($product->brand)
        <span class="truncate text-[11px] uppercase text-[#6b7280]">{{ $product->brand }}</span>
      @endif
      @if($product->badge)
        <span class="rounded-[3px] bg-[#fff4f6] px-2 py-0.5 text-[11px] font-medium text-[#c42544]">{{ $product->badge }}</span>
      @endif
    </div>
    <a href="{{ route('products.show', $product->slug) }}" class="mt-1 line-clamp-2 min-h-[38px] text-[13px] font-medium leading-[1.35] hover:text-[#e92d48]">{{ $product->title }}</a>
    <div class="mt-auto pt-3">
      <p class="text-[15px] font-semibold text-[#e92d48]">KSh {{ number_format((float) $product->price) }}</p>
      @if($product->old_price)
        <p class="text-xs text-[#9ca3af] line-through">KSh {{ number_format((float) $product->old_price) }}</p>
      @endif
    </div>
  </div>
</article>
