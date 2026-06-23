<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use PDO;

class ImportShopDataFromPostgres extends Command
{
    protected $signature = 'shop:import-postgres {--truncate : Empty Laravel MySQL shop tables before importing}';

    protected $description = 'Import Shop ICT categories, products, settings, orders, catalogue, and attendant users from the old Postgres database.';

    public function handle(): int
    {
        $sourceUrl = env('SOURCE_DATABASE_URL') ?: env('DATABASE_URL');

        if (! $sourceUrl) {
            $this->error('Missing SOURCE_DATABASE_URL or DATABASE_URL.');
            return self::FAILURE;
        }

        $source = $this->connectPostgres($sourceUrl);

        if ($this->option('truncate')) {
            DB::statement('SET FOREIGN_KEY_CHECKS=0');
            foreach (['orders', 'admin_users', 'products', 'product_catalogue', 'settings', 'categories'] as $table) {
                DB::table($table)->truncate();
            }
            DB::statement('SET FOREIGN_KEY_CHECKS=1');
        }

        $this->importTable($source, 'categories', ['id', 'name', 'slug', 'icon', 'sort_order', 'created_at', 'updated_at']);
        $this->importTable($source, 'product_catalogue', [
            'id', 'title', 'item', 'specs', 'product_name', 'created_by_email', 'created_by_name', 'created_by_role', 'created_at', 'updated_at',
        ], ['specs']);
        $this->importTable($source, 'products', [
            'id', 'category_id', 'catalogue_id', 'title', 'slug', 'description', 'brand', 'subcategory', 'subcategories', 'price', 'old_price',
            'stock_status', 'images', 'specs', 'warranty', 'featured', 'category_priority', 'is_hidden', 'badge', 'product_origin', 'created_at', 'updated_at',
        ], ['images', 'specs']);
        $this->importTable($source, 'settings', ['key', 'value', 'created_at', 'updated_at'], ['value'], 'key');
        $this->importTable($source, 'orders', [
            'id', 'customer_name', 'customer_phone', 'items', 'total', 'message', 'status', 'source', 'payment_method', 'warranty', 'created_at', 'updated_at',
        ], ['items']);
        $this->importTable($source, 'admin_users', [
            'id', 'name', 'email', 'password_hash', 'role', 'is_active', 'is_protected', 'source', 'last_login_at', 'created_at', 'updated_at',
        ]);

        $this->ensureAttendant();

        $sourceCount = (int) $source->query('select count(*) from products')->fetchColumn();
        $targetCount = (int) DB::table('products')->count();

        $this->info("Postgres products: {$sourceCount}");
        $this->info("MySQL products: {$targetCount}");

        return $sourceCount === $targetCount ? self::SUCCESS : self::FAILURE;
    }

    private function connectPostgres(string $url): PDO
    {
        $parts = parse_url($url);

        if (! $parts || empty($parts['host']) || empty($parts['path'])) {
            throw new \RuntimeException('Invalid Postgres URL.');
        }

        parse_str($parts['query'] ?? '', $query);
        $database = ltrim($parts['path'], '/');
        $dsn = sprintf(
            'pgsql:host=%s;port=%s;dbname=%s;sslmode=%s',
            $parts['host'],
            $parts['port'] ?? 5432,
            $database,
            $query['sslmode'] ?? 'require'
        );

        $options = $query['options'] ?? null;
        if (! $options && str_ends_with($parts['host'], '.neon.tech')) {
            $options = 'endpoint=' . explode('.', $parts['host'])[0];
        }

        if ($options) {
            $dsn .= ';options=' . $options;
        }

        return new PDO($dsn, rawurldecode($parts['user'] ?? ''), rawurldecode($parts['pass'] ?? ''), [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
    }

    private function importTable(PDO $source, string $table, array $columns, array $jsonColumns = [], string $key = 'id'): void
    {
        if (! $this->sourceTableExists($source, $table)) {
            $this->warn("Skipping missing source table: {$table}");
            return;
        }

        $sourceColumns = $this->sourceColumns($source, $table);
        $availableColumns = array_values(array_intersect($columns, $sourceColumns));

        if (! in_array($key, $availableColumns, true)) {
            $this->warn("Skipping {$table}; key column {$key} is missing.");
            return;
        }

        $quoted = implode(', ', array_map(fn ($column) => '"' . $column . '"', $availableColumns));
        $rows = $source->query("select {$quoted} from {$table}")->fetchAll();

        foreach (array_chunk($rows, 250) as $chunk) {
            $payload = array_map(function (array $row) use ($availableColumns, $jsonColumns) {
                $normalized = [];
                foreach ($availableColumns as $column) {
                    $value = $row[$column] ?? null;
                    if (in_array($column, $jsonColumns, true) && $value !== null && ! is_string($value)) {
                        $value = json_encode($value);
                    }
                    if (in_array($column, $jsonColumns, true) && $value === null) {
                        $value = json_encode($column === 'images' || $column === 'items' ? [] : new \stdClass());
                    }
                    $normalized[$column] = $value;
                }
                return $normalized;
            }, $chunk);

            DB::table($table)->upsert($payload, [$key], array_values(array_diff($availableColumns, [$key])));
        }

        $this->info("Imported {$table}: " . count($rows));
    }

    private function sourceTableExists(PDO $source, string $table): bool
    {
        $stmt = $source->prepare("select exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = :table)");
        $stmt->execute(['table' => $table]);
        return (bool) $stmt->fetchColumn();
    }

    private function sourceColumns(PDO $source, string $table): array
    {
        $stmt = $source->prepare("select column_name from information_schema.columns where table_schema = 'public' and table_name = :table");
        $stmt->execute(['table' => $table]);
        return array_column($stmt->fetchAll(), 'column_name');
    }

    private function ensureAttendant(): void
    {
        $email = env('ATTENDANT_EMAIL');
        $password = env('ATTENDANT_PASSWORD');
        $name = env('ATTENDANT_NAME', 'Shop ICT Attendant');

        if (! $email || ! $password) {
            return;
        }

        DB::table('admin_users')->updateOrInsert(
            ['email' => $email],
            [
                'id' => (string) Str::uuid(),
                'name' => $name,
                'password_hash' => password_hash($password, PASSWORD_BCRYPT),
                'role' => 'attendant',
                'is_active' => true,
                'is_protected' => true,
                'source' => 'env',
                'updated_at' => now(),
                'created_at' => now(),
            ]
        );
    }
}
