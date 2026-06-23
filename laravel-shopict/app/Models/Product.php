<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $guarded = [];

    protected $casts = [
        'images' => 'array',
        'specs' => 'array',
        'price' => 'decimal:2',
        'old_price' => 'decimal:2',
        'featured' => 'boolean',
        'category_priority' => 'boolean',
        'is_hidden' => 'boolean',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
