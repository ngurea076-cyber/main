<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Setting;
use Illuminate\Http\Request;

class ShopController extends Controller
{
    public function home()
    {
        $featured = Product::query()
            ->where('is_hidden', false)
            ->where('featured', true)
            ->latest()
            ->limit(12)
            ->get();

        $products = Product::query()
            ->where('is_hidden', false)
            ->latest()
            ->limit(24)
            ->get();

        return view('shop.home', [
            'featured' => $featured,
            'products' => $products,
            'whatsapp' => $this->whatsappNumber(),
        ]);
    }

    public function shop(Request $request)
    {
        $query = Product::query()->where('is_hidden', false);

        if ($search = trim((string) $request->query('q'))) {
            $query->where(function ($builder) use ($search) {
                $builder->where('title', 'like', "%{$search}%")
                    ->orWhere('brand', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($category = $request->query('category')) {
            $query->whereHas('category', fn ($builder) => $builder->where('slug', $category));
        }

        $sort = $request->query('sort', 'newest');
        match ($sort) {
            'price-asc' => $query->orderBy('price'),
            'price-desc' => $query->orderByDesc('price'),
            default => $query->latest(),
        };

        return view('shop.index', [
            'products' => $query->paginate(24)->withQueryString(),
            'search' => $search ?? '',
            'sort' => $sort,
            'whatsapp' => $this->whatsappNumber(),
        ]);
    }

    public function product(string $slug)
    {
        $product = Product::query()
            ->where('slug', $slug)
            ->where('is_hidden', false)
            ->firstOrFail();

        $related = Product::query()
            ->where('is_hidden', false)
            ->where('id', '<>', $product->id)
            ->when($product->category_id, fn ($query) => $query->where('category_id', $product->category_id))
            ->limit(8)
            ->get();

        return view('shop.product', [
            'product' => $product,
            'related' => $related,
            'whatsapp' => $this->whatsappNumber(),
        ]);
    }

    public function cart()
    {
        return view('shop.cart', [
            'whatsapp' => $this->whatsappNumber(),
        ]);
    }

    private function whatsappNumber(): string
    {
        $setting = Setting::query()->where('key', 'whatsapp_number')->first();
        $value = $setting?->value;

        if (is_array($value) && isset($value['number'])) {
            return (string) $value['number'];
        }

        if (is_string($value)) {
            return $value;
        }

        return env('WHATSAPP_NUMBER', '+254713869018');
    }
}
