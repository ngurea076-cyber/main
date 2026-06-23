# Shop ICT Laravel Deployment

This Laravel app is the PHP/MySQL replacement for the Node/Postgres site. Keep the old Neon/Postgres database until the MySQL import count is verified.

## HostPinnacle Setup

1. Create a MySQL database and user in cPanel.
2. Upload or clone this `laravel-shopict` folder to the hosting account.
3. Set the domain document root to:

```text
laravel-shopict/public
```

4. Create `.env` from `.env.example` and fill:

```env
APP_NAME="Shop ICT Gadgets"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://shopictgadgets.co.ke

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=YOUR_CPANEL_DATABASE
DB_USERNAME=YOUR_CPANEL_DB_USER
DB_PASSWORD=YOUR_CPANEL_DB_PASSWORD

SOURCE_DATABASE_URL="your_old_neon_postgres_url"
ATTENDANT_NAME="Shop ICT Attendant"
ATTENDANT_EMAIL="justo@ict.co.ke"
ATTENDANT_PASSWORD="Shop@2026"
WHATSAPP_NUMBER="+254713869018"
```

5. Run:

```bash
composer install --no-dev --optimize-autoloader
php artisan key:generate --force
php artisan migrate --force
php artisan shop:import-postgres --truncate
php artisan optimize
```

The import command prints both counts:

```text
Postgres products: 179
MySQL products: 179
```

Only switch fully away from Postgres when the counts match.

## Local Development

```bash
composer install
php artisan serve
```

The public pages are:

```text
/
/shop
/products/{slug}
/cart
```
