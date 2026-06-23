<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->string('id', 36)->primary();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('icon')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('product_catalogue', function (Blueprint $table) {
            $table->string('id', 36)->primary();
            $table->text('title');
            $table->text('item');
            $table->json('specs')->nullable();
            $table->text('product_name')->unique();
            $table->string('created_by_email')->nullable();
            $table->string('created_by_name')->nullable();
            $table->string('created_by_role')->nullable();
            $table->timestamps();
        });

        Schema::create('products', function (Blueprint $table) {
            $table->string('id', 36)->primary();
            $table->string('category_id', 36)->nullable()->index();
            $table->string('catalogue_id', 36)->nullable()->index();
            $table->string('title');
            $table->string('slug')->unique();
            $table->longText('description')->nullable();
            $table->string('brand')->nullable()->index();
            $table->string('subcategory')->nullable()->index();
            $table->text('subcategories')->nullable();
            $table->decimal('price', 12, 2)->default(0)->index();
            $table->decimal('old_price', 12, 2)->nullable();
            $table->string('stock_status')->default('in_stock')->index();
            $table->json('images')->nullable();
            $table->json('specs')->nullable();
            $table->string('warranty')->nullable();
            $table->boolean('featured')->default(false)->index();
            $table->boolean('category_priority')->default(false)->index();
            $table->boolean('is_hidden')->default(false)->index();
            $table->string('badge')->nullable();
            $table->string('product_origin')->default('website')->index();
            $table->timestamps();
        });

        Schema::create('settings', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->json('value')->nullable();
            $table->timestamps();
        });

        Schema::create('orders', function (Blueprint $table) {
            $table->string('id', 36)->primary();
            $table->string('customer_name')->nullable();
            $table->string('customer_phone')->nullable();
            $table->json('items')->nullable();
            $table->decimal('total', 12, 2)->default(0);
            $table->longText('message')->nullable();
            $table->string('status')->default('pending')->index();
            $table->string('source')->default('website')->index();
            $table->string('payment_method')->default('cash');
            $table->string('warranty')->nullable();
            $table->timestamps();
        });

        Schema::create('admin_users', function (Blueprint $table) {
            $table->string('id', 36)->primary();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password_hash');
            $table->string('role')->default('attendant')->index();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_protected')->default(false);
            $table->string('source')->default('env');
            $table->timestamp('last_login_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admin_users');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('settings');
        Schema::dropIfExists('products');
        Schema::dropIfExists('product_catalogue');
        Schema::dropIfExists('categories');
    }
};
