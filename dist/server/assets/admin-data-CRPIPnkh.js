import { e as createServerRpc, c as createServerFn } from "./tanstack-vendor-DM2N0uEF.js";
import "react/jsx-runtime";
import "seroval";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "react";
import "@tanstack/react-router";
import "@tanstack/react-router/ssr/server";
function normalizeSpecsRecord(specs) {
  const normalized = specs && typeof specs === "object" && !Array.isArray(specs) ? Object.fromEntries(Object.entries(specs).map(([key, value]) => [key, String(value)])) : {};
  if ("HDD size" in normalized && !("Size" in normalized)) {
    normalized["Size"] = normalized["HDD size"];
  }
  delete normalized["HDD size"];
  return normalized;
}
async function ensureOperationsTables() {
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await sql`create extension if not exists pgcrypto`;
  await sql`
    create table if not exists orders (
      id uuid primary key default gen_random_uuid(),
      customer_name text,
      customer_phone text,
      items jsonb not null default '[]'::jsonb,
      total numeric(12,2) not null default 0,
      message text,
      status text not null default 'pending',
      source text not null default 'walkin',
      payment_method text not null default 'cash',
      warranty text,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `;
  await sql`
    alter table orders
    add column if not exists payment_method text not null default 'cash'
  `;
  await sql`alter table orders add column if not exists warranty text`;
  await sql`
    create table if not exists suppliers (
      id uuid primary key default gen_random_uuid(),
      name text not null,
      contact_person text,
      phone text,
      email text,
      address text,
      notes text,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `;
  await sql`
    create table if not exists resellers (
      id uuid primary key default gen_random_uuid(),
      name text not null,
      contact_person text,
      phone text,
      email text,
      address text,
      notes text,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `;
  await sql`
    create table if not exists supplier_bills (
      id uuid primary key default gen_random_uuid(),
      supplier_id uuid references suppliers(id) on delete cascade,
      product_id uuid references products(id) on delete set null,
      stock_intake_id uuid,
      serial_code text,
      bill_number text not null,
      bill_date date not null,
      due_date date,
      opening_stock_price numeric(12,2),
      remaining_stock_price numeric(12,2),
      amount numeric(12,2) not null default 0,
      status text not null default 'pending',
      notes text,
      returned_at timestamptz,
      return_notes text,
      returned_by_email text,
      returned_by_name text,
      returned_by_role text,
      created_by_email text,
      created_by_name text,
      created_by_role text,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `;
  await sql`alter table supplier_bills add column if not exists product_id uuid references products(id) on delete set null`;
  await sql`alter table supplier_bills add column if not exists stock_intake_id uuid`;
  await sql`alter table supplier_bills add column if not exists serial_code text`;
  await sql`alter table supplier_bills add column if not exists opening_stock_price numeric(12,2)`;
  await sql`alter table supplier_bills add column if not exists remaining_stock_price numeric(12,2)`;
  await sql`
    create table if not exists stock_intake_records (
      id uuid primary key default gen_random_uuid(),
      product_id uuid references products(id) on delete cascade,
      supplier_id uuid references suppliers(id) on delete set null,
      serial_code text not null unique,
      quantity integer not null default 1,
      unit_cost numeric(12,2),
      stock_price numeric(12,2),
      due_date date,
      received_at date not null,
      stock_status text not null default 'in_stock',
      notes text,
      created_by_email text,
      created_by_name text,
      created_by_role text,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `;
  await sql`alter table stock_intake_records add column if not exists stock_price numeric(12,2)`;
  await sql`alter table stock_intake_records add column if not exists due_date date`;
  await sql`alter table stock_intake_records add column if not exists deleted_at timestamptz`;
  await sql`alter table stock_intake_records add column if not exists deleted_by_email text`;
  await sql`alter table stock_intake_records add column if not exists deleted_by_name text`;
  await sql`alter table stock_intake_records add column if not exists deleted_by_role text`;
  await sql`
    create table if not exists supplier_bill_serial_payments (
      id uuid primary key default gen_random_uuid(),
      bill_id uuid references supplier_bills(id) on delete cascade,
      supplier_id uuid references suppliers(id) on delete cascade,
      product_id uuid references products(id) on delete set null,
      stock_intake_id uuid,
      serial_code text not null,
      amount numeric(12,2) not null default 0,
      balance_before numeric(12,2),
      balance_after numeric(12,2),
      created_at timestamptz not null default now()
    )
  `;
  await sql`create index if not exists idx_supplier_bill_serial_payments_stock on supplier_bill_serial_payments (stock_intake_id)`;
  await sql`create index if not exists idx_supplier_bill_serial_payments_bill on supplier_bill_serial_payments (bill_id)`;
  await sql`
    create table if not exists stock_return_records (
      id uuid primary key default gen_random_uuid(),
      product_id uuid references products(id) on delete cascade,
      supplier_id uuid references suppliers(id) on delete set null,
      serial_code text not null,
      quantity integer not null default 1,
      return_date date not null,
      reason text not null,
      status text not null default 'pending',
      notes text,
      created_by_email text,
      created_by_name text,
      created_by_role text,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `;
  await sql`
    create table if not exists stock_takeout_records (
      id uuid primary key default gen_random_uuid(),
      product_id uuid references products(id) on delete cascade,
      reseller_id uuid references resellers(id) on delete set null,
      serial_code text not null,
      quantity integer not null default 1,
      takeout_date date not null,
      notes text,
      created_by_email text,
      created_by_name text,
      created_by_role text,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `;
  await sql`alter table stock_takeout_records add column if not exists returned_at timestamptz`;
  await sql`alter table stock_takeout_records add column if not exists return_notes text`;
  await sql`alter table stock_takeout_records add column if not exists returned_by_email text`;
  await sql`alter table stock_takeout_records add column if not exists returned_by_name text`;
  await sql`alter table stock_takeout_records add column if not exists returned_by_role text`;
  await sql`
    create table if not exists stock_count_records (
      id uuid primary key default gen_random_uuid(),
      product_id uuid references products(id) on delete cascade,
      count_date date not null,
      counted_quantity integer not null default 0,
      notes text,
      created_by_email text,
      created_by_name text,
      created_by_role text,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `;
  await sql`
    create table if not exists activity_logs (
      id uuid primary key default gen_random_uuid(),
      actor_email text,
      actor_name text,
      actor_role text,
      action text not null,
      entity_type text not null,
      entity_id text,
      entity_label text,
      details jsonb not null default '{}'::jsonb,
      created_at timestamptz not null default now()
    )
  `;
  await sql`
    create table if not exists super_admin_notifications (
      id uuid primary key default gen_random_uuid(),
      type text not null,
      entity_type text,
      entity_id text,
      title text not null,
      description text not null,
      due_date date,
      created_at timestamptz not null default now(),
      status text not null default 'new'
    )
  `;
  await sql`
    create table if not exists push_subscriptions (
      id uuid primary key default gen_random_uuid(),
      admin_email text not null,
      admin_role text not null,
      endpoint text not null unique,
      p256dh text not null,
      auth text not null,
      user_agent text,
      device_label text,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `;
  await sql`create index if not exists idx_super_admin_notifications_created_at on super_admin_notifications (created_at desc)`;
  await sql`create index if not exists idx_push_subscriptions_role on push_subscriptions (admin_role, updated_at desc)`;
  await sql`
    create table if not exists expenses (
      id uuid primary key default gen_random_uuid(),
      title text not null,
      category text not null,
      amount numeric(12,2) not null default 0,
      expense_date date not null,
      notes text,
      created_by_email text,
      created_by_name text,
      created_by_role text,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `;
  await sql`
    alter table products
    add column if not exists is_hidden boolean not null default false
  `;
  await sql`
    alter table products
    add column if not exists catalogue_id uuid
  `;
  await sql`
    alter table products
    add column if not exists product_origin text not null default 'website'
  `;
  await sql`
    alter table products
    add column if not exists category_priority boolean not null default false
  `;
  await sql`
    update products
    set product_origin = 'inventory'
    where product_origin <> 'inventory'
      and coalesce(description, '') like 'Inventory-only product created%'
  `;
  await sql`
    create table if not exists product_catalogue (
      id uuid primary key default gen_random_uuid(),
      title text not null,
      item text not null,
      specs jsonb not null default '{}'::jsonb,
      product_name text not null unique,
      created_by_email text,
      created_by_name text,
      created_by_role text,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `;
  await sql`create index if not exists idx_products_slug on products (slug)`;
  await sql`create index if not exists idx_products_created_at on products (created_at desc)`;
  await sql`create index if not exists idx_products_featured_created_at on products (featured, created_at desc)`;
  await sql`create index if not exists idx_products_category_priority on products (category_id, category_priority, created_at desc)`;
  await sql`create index if not exists idx_products_category_created_at on products (category_id, created_at desc)`;
  await sql`create index if not exists idx_products_visible_created_at on products (is_hidden, created_at desc)`;
  await sql`create index if not exists idx_products_price on products (price)`;
  await sql`create index if not exists idx_products_catalogue_id on products (catalogue_id)`;
  await sql`create index if not exists idx_products_origin_created_at on products (product_origin, created_at desc)`;
  await sql`create index if not exists idx_product_catalogue_item on product_catalogue (item, created_at desc)`;
}
function parseOrderItems(items) {
  return Array.isArray(items) ? items : [];
}
function parseOrderRow(row) {
  return {
    id: String(row.id),
    customer_name: row.customer_name ?? null,
    customer_phone: row.customer_phone ?? null,
    items: parseOrderItems(row.items),
    total: Number(row.total ?? 0),
    message: row.message ?? null,
    status: String(row.status ?? "pending"),
    source: String(row.source ?? "walkin"),
    payment_method: String(row.payment_method ?? "cash"),
    warranty: row.warranty ?? null,
    created_at: String(row.created_at)
  };
}
async function logActivity(input) {
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await ensureOperationsTables();
  await sql`
    insert into activity_logs (
      actor_email, actor_name, actor_role, action, entity_type, entity_id, entity_label, details
    )
    values (
      ${input.actor?.email ?? null},
      ${input.actor?.name ?? null},
      ${input.actor?.role ?? null},
      ${input.action},
      ${input.entityType},
      ${input.entityId ?? null},
      ${input.entityLabel ?? null},
      ${JSON.stringify(input.details ?? {})}::jsonb
    )
  `;
}
function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env.");
  }
  return {
    cloudName,
    apiKey,
    apiSecret
  };
}
async function uploadImageToCloudinary(image, folder) {
  if (!image.startsWith("data:image/")) return image;
  const matches = image.match(/^data:image\/[a-zA-Z0-9.+-]+;base64,(.+)$/);
  if (!matches?.[1]) {
    throw new Error("Unsupported image format.");
  }
  const {
    createHash
  } = await import("node:crypto");
  const {
    cloudName,
    apiKey,
    apiSecret
  } = getCloudinaryConfig();
  const timestamp = Math.floor(Date.now() / 1e3);
  const signatureBase = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = createHash("sha1").update(signatureBase).digest("hex");
  const body = new URLSearchParams({
    file: image,
    api_key: apiKey,
    timestamp: String(timestamp),
    signature,
    folder
  });
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Cloudinary upload failed: ${text || response.statusText}`);
  }
  const result = await response.json();
  if (!result.secure_url) {
    throw new Error("Cloudinary upload did not return an image URL.");
  }
  return result.secure_url;
}
async function persistProductImage(image) {
  return uploadImageToCloudinary(image, "shop-ict/products");
}
async function persistBannerImage(image) {
  return uploadImageToCloudinary(image, "shop-ict/banners");
}
const listAdminCategoriesServer_createServerFn_handler = createServerRpc({
  id: "3d07a6c2d92cada322e7e4735125878f4073555f1a5df726e4b3db645f0da4b5",
  name: "listAdminCategoriesServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => listAdminCategoriesServer.__executeServer(opts));
const listAdminCategoriesServer = createServerFn({
  method: "POST"
}).handler(listAdminCategoriesServer_createServerFn_handler, async () => {
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  const rows = await sql`
    select id, name, slug, icon, description, sort_order, created_at
    from categories
    order by sort_order asc, created_at asc
  `;
  return rows.map((row) => ({
    id: String(row.id),
    name: String(row.name),
    slug: String(row.slug),
    icon: row.icon ?? null,
    description: row.description ?? null,
    sort_order: Number(row.sort_order ?? 0),
    created_at: String(row.created_at)
  }));
});
const upsertAdminCategoryServer_createServerFn_handler = createServerRpc({
  id: "495091737ff47754458269b2e45f4384529da7319a817dede8e07e66c07b99e7",
  name: "upsertAdminCategoryServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => upsertAdminCategoryServer.__executeServer(opts));
const upsertAdminCategoryServer = createServerFn({
  method: "POST"
}).handler(upsertAdminCategoryServer_createServerFn_handler, async ({
  data
}) => {
  const input = data;
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  if (input.id) {
    await sql`
      update categories
      set
        name = ${input.name},
        slug = ${input.slug},
        icon = ${input.icon ?? null},
        sort_order = ${input.sort_order ?? 0}
      where id = ${input.id}
    `;
    await logActivity({
      action: "updated",
      entityType: "category",
      entityId: input.id,
      entityLabel: input.name,
      details: {
        slug: input.slug
      }
    });
    return {
      ok: true
    };
  }
  await sql`
    insert into categories (name, slug, icon, sort_order)
    values (${input.name}, ${input.slug}, ${input.icon ?? null}, ${input.sort_order ?? 0})
  `;
  await logActivity({
    action: "created",
    entityType: "category",
    entityLabel: input.name,
    details: {
      slug: input.slug
    }
  });
  return {
    ok: true
  };
});
const deleteAdminCategoryServer_createServerFn_handler = createServerRpc({
  id: "1b60ca7604afdcd3d0f03df2b10ebaca423e4d5caa49f81a9b802bfcb0f4c58f",
  name: "deleteAdminCategoryServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => deleteAdminCategoryServer.__executeServer(opts));
const deleteAdminCategoryServer = createServerFn({
  method: "POST"
}).handler(deleteAdminCategoryServer_createServerFn_handler, async ({
  data
}) => {
  const input = data;
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await sql`delete from categories where id = ${input.id}`;
  await logActivity({
    action: "deleted",
    entityType: "category",
    entityId: input.id
  });
  return {
    ok: true
  };
});
const listAdminProductsServer_createServerFn_handler = createServerRpc({
  id: "381f2b8a981bad7d369275e826ec075b46bd805d231d9bb62372b4a05241bf1d",
  name: "listAdminProductsServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => listAdminProductsServer.__executeServer(opts));
const listAdminProductsServer = createServerFn({
  method: "POST"
}).handler(listAdminProductsServer_createServerFn_handler, async () => {
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  const {
    parseSubcategories
  } = await import("./products-DQc7b5GA.js");
  await ensureOperationsTables();
  const rows = await sql`
    select
      p.*,
      c.name as category_name
    from products p
    left join categories c on c.id = p.category_id
    where coalesce(p.product_origin, 'website') = 'website'
    order by p.created_at desc
  `;
  return rows.map((row) => ({
    id: String(row.id),
    catalogue_id: row.catalogue_id ? String(row.catalogue_id) : null,
    title: String(row.title),
    slug: String(row.slug),
    description: row.description ?? null,
    brand: row.brand ?? null,
    subcategory: row.subcategory ?? null,
    subcategories: parseSubcategories(row.subcategory ?? null),
    price: Number(row.price ?? 0),
    old_price: row.old_price == null ? null : Number(row.old_price),
    stock_status: String(row.stock_status ?? "in_stock"),
    category_id: row.category_id ?? null,
    images: Array.isArray(row.images) ? row.images.map(String) : [],
    specs: normalizeSpecsRecord(row.specs),
    featured: Boolean(row.featured),
    category_priority: Boolean(row.category_priority),
    hidden: Boolean(row.is_hidden),
    badge: row.badge ?? null,
    warranty: row.warranty ?? null,
    categories: row.category_name ? {
      name: String(row.category_name)
    } : null
  }));
});
const listInventoryProductsServer_createServerFn_handler = createServerRpc({
  id: "752df7f0ea50413528d2a1fba195a11c948b58d326b1f67129d9594323913321",
  name: "listInventoryProductsServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => listInventoryProductsServer.__executeServer(opts));
const listInventoryProductsServer = createServerFn({
  method: "POST"
}).handler(listInventoryProductsServer_createServerFn_handler, async () => {
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await ensureOperationsTables();
  await syncStockProductsIntoInventoryProducts(sql);
  const rows = await sql`
    select
      p.id,
      p.title,
      p.slug,
      p.price,
      p.stock_status,
      p.created_at,
      p.updated_at,
      count(distinct intake.id) as intake_count,
      count(distinct stock_count.id) as stock_count_count,
      count(distinct stock_return.id) as return_count,
      count(distinct stock_takeout.id) as takeout_count
    from products p
    left join stock_intake_records intake on intake.product_id = p.id
    left join stock_count_records stock_count on stock_count.product_id = p.id
    left join stock_return_records stock_return on stock_return.product_id = p.id
    left join stock_takeout_records stock_takeout on stock_takeout.product_id = p.id
    where coalesce(p.product_origin, 'website') = 'inventory'
    group by p.id
    order by p.title asc
  `;
  return rows.map((row) => {
    const usageCount = Number(row.intake_count ?? 0) + Number(row.stock_count_count ?? 0) + Number(row.return_count ?? 0) + Number(row.takeout_count ?? 0);
    return {
      id: String(row.id),
      title: String(row.title ?? ""),
      slug: String(row.slug ?? ""),
      set_price: row.price == null ? null : Number(row.price),
      stock_status: String(row.stock_status ?? "in_stock"),
      usage_count: usageCount,
      created_at: String(row.created_at),
      updated_at: String(row.updated_at)
    };
  });
});
async function syncStockProductsIntoInventoryProducts(sql) {
  const rows = await sql`
    select distinct
      p.id,
      p.title,
      p.slug,
      p.stock_status,
      p.specs
    from products p
    where coalesce(p.product_origin, 'website') <> 'inventory'
      and (
        exists (select 1 from stock_intake_records r where r.product_id = p.id)
        or exists (select 1 from stock_count_records r where r.product_id = p.id)
        or exists (select 1 from stock_return_records r where r.product_id = p.id)
        or exists (select 1 from stock_takeout_records r where r.product_id = p.id)
      )
    order by p.title asc
  `;
  for (const row of rows) {
    const productName = String(row.title ?? "").trim();
    if (!productName) continue;
    const [existingInventoryProduct] = await sql`
      select id
      from products
      where lower(title) = lower(${productName})
        and coalesce(product_origin, 'website') = 'inventory'
      order by created_at desc
      limit 1
    `;
    let inventoryProductId = existingInventoryProduct?.id ? String(existingInventoryProduct.id) : "";
    if (!inventoryProductId) {
      const baseSlug = `inventory-${slugifyInventoryProductName(productName)}`;
      let slug = baseSlug;
      let suffix = 2;
      while (true) {
        const [existingSlug] = await sql`select id from products where slug = ${slug} limit 1`;
        if (!existingSlug) break;
        slug = `${baseSlug}-${suffix}`;
        suffix += 1;
      }
      const [createdProduct] = await sql`
        insert into products (
          title, slug, description, price, old_price, stock_status,
          category_id, images, specs, featured, is_hidden, badge, warranty, brand, subcategory, product_origin
        )
        values (
          ${productName},
          ${slug},
          ${"Inventory-only product synced from existing stock records"},
          0,
          null,
          ${String(row.stock_status ?? "in_stock")},
          null,
          ${[]}::text[],
          ${JSON.stringify(normalizeSpecsRecord(row.specs))}::jsonb,
          false,
          true,
          null,
          null,
          null,
          null,
          ${"inventory"}
        )
        returning id
      `;
      inventoryProductId = createdProduct?.id ? String(createdProduct.id) : "";
    }
    if (!inventoryProductId) continue;
    await sql`update stock_intake_records set product_id = ${inventoryProductId} where product_id = ${String(row.id)}`;
    await sql`update stock_count_records set product_id = ${inventoryProductId} where product_id = ${String(row.id)}`;
    await sql`update stock_return_records set product_id = ${inventoryProductId} where product_id = ${String(row.id)}`;
    await sql`update stock_takeout_records set product_id = ${inventoryProductId} where product_id = ${String(row.id)}`;
  }
}
const upsertInventoryProductServer_createServerFn_handler = createServerRpc({
  id: "af539b64737c1a34034ce05b978a1d73754d4d0c38788f3faa046b706416cb55",
  name: "upsertInventoryProductServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => upsertInventoryProductServer.__executeServer(opts));
const upsertInventoryProductServer = createServerFn({
  method: "POST"
}).handler(upsertInventoryProductServer_createServerFn_handler, async ({
  data
}) => {
  const input = data;
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await ensureOperationsTables();
  const title = String(input.title ?? "").trim().replace(/\s+/g, " ");
  const stockStatus = String(input.stock_status ?? "in_stock").trim() || "in_stock";
  const setPrice = input.set_price == null ? null : Math.max(0, Number(input.set_price) || 0);
  if (!title) throw new Error("Product name is required.");
  const [duplicate] = input.id ? await sql`
        select id
        from products
        where lower(title) = lower(${title})
          and coalesce(product_origin, 'website') = 'inventory'
          and id <> ${input.id}
        limit 1
      ` : await sql`
        select id
        from products
        where lower(title) = lower(${title})
          and coalesce(product_origin, 'website') = 'inventory'
        limit 1
      `;
  if (duplicate?.id) {
    throw new Error("That inventory product already exists.");
  }
  if (input.id) {
    await sql`
      update products
      set
        title = ${title},
        price = case when ${setPrice}::numeric is null then price else ${setPrice} end,
        stock_status = ${stockStatus},
        is_hidden = true,
        product_origin = 'inventory',
        updated_at = now()
      where id = ${input.id}
        and coalesce(product_origin, 'website') = 'inventory'
    `;
    await logActivity({
      actor: input.actor,
      action: "updated",
      entityType: "inventory_product",
      entityId: input.id,
      entityLabel: title,
      details: {
        stock_status: stockStatus
      }
    });
    if (setPrice != null) {
      await sql`
        update stock_intake_records
        set stock_price = ${setPrice}, updated_at = now()
        where product_id = ${input.id}
      `;
    }
    return {
      ok: true
    };
  }
  const baseSlug = `inventory-${slugifyInventoryProductName(title)}`;
  let slug = baseSlug;
  let suffix = 2;
  while (true) {
    const [existingSlug] = await sql`select id from products where slug = ${slug} limit 1`;
    if (!existingSlug) break;
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
  const [createdProduct] = await sql`
    insert into products (
      title, slug, description, price, old_price, stock_status,
      category_id, images, specs, featured, is_hidden, badge, warranty, brand, subcategory, product_origin
    )
    values (
      ${title},
      ${slug},
      ${"Inventory-only product created from inventory product list"},
      ${setPrice ?? 0},
      null,
      ${stockStatus},
      null,
      ${[]}::text[],
      ${JSON.stringify({
    Source: "Inventory list"
  })}::jsonb,
      false,
      true,
      null,
      null,
      null,
      null,
      ${"inventory"}
    )
    returning id
  `;
  await logActivity({
    actor: input.actor,
    action: "created",
    entityType: "inventory_product",
    entityId: createdProduct?.id ? String(createdProduct.id) : null,
    entityLabel: title,
    details: {
      stock_status: stockStatus
    }
  });
  if (setPrice != null && createdProduct?.id) {
    await sql`
      update stock_intake_records
      set stock_price = ${setPrice}, updated_at = now()
      where product_id = ${String(createdProduct.id)}
    `;
  }
  return {
    ok: true
  };
});
const deleteInventoryProductServer_createServerFn_handler = createServerRpc({
  id: "8ec3286791a97abc95abfe9780ab80279e0b861ddea4c9eea9d9e762456b3620",
  name: "deleteInventoryProductServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => deleteInventoryProductServer.__executeServer(opts));
const deleteInventoryProductServer = createServerFn({
  method: "POST"
}).handler(deleteInventoryProductServer_createServerFn_handler, async ({
  data
}) => {
  const input = data;
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await ensureOperationsTables();
  const [existing] = await sql`
    select id, title
    from products
    where id = ${input.id}
      and coalesce(product_origin, 'website') = 'inventory'
    limit 1
  `;
  if (!existing) throw new Error("Inventory product not found.");
  const [usage] = await sql`
    select
      (select count(*) from stock_intake_records where product_id = ${input.id}) as intake_count,
      (select count(*) from stock_count_records where product_id = ${input.id}) as stock_count_count,
      (select count(*) from stock_return_records where product_id = ${input.id}) as return_count,
      (select count(*) from stock_takeout_records where product_id = ${input.id}) as takeout_count
  `;
  const usageCount = Number(usage?.intake_count ?? 0) + Number(usage?.stock_count_count ?? 0) + Number(usage?.return_count ?? 0) + Number(usage?.takeout_count ?? 0);
  if (usageCount > 0) {
    throw new Error("This inventory product has stock records, so it cannot be deleted.");
  }
  await sql`delete from products where id = ${input.id}`;
  await logActivity({
    actor: input.actor,
    action: "deleted",
    entityType: "inventory_product",
    entityId: input.id,
    entityLabel: String(existing.title ?? "Inventory product")
  });
  return {
    ok: true
  };
});
const listProductCatalogueServer_createServerFn_handler = createServerRpc({
  id: "7f891dd29f543427073502d9d39dd2fa75b3561e1475f1a37d526c66d53f7421",
  name: "listProductCatalogueServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => listProductCatalogueServer.__executeServer(opts));
const listProductCatalogueServer = createServerFn({
  method: "POST"
}).handler(listProductCatalogueServer_createServerFn_handler, async () => {
  try {
    const {
      getNeonSql
    } = await import("./neon.server-CrlN4fYY.js");
    const sql = getNeonSql();
    await ensureOperationsTables();
    await syncProductsIntoCatalogue(sql);
    const rows = await sql`
      select
        c.*,
        p.id as product_id,
        p.price as product_price,
        p.stock_status as product_stock_status
      from product_catalogue c
      left join products p on (p.catalogue_id = c.id or lower(p.title) = lower(c.product_name))
        and coalesce(p.product_origin, 'website') = 'website'
      order by c.created_at desc
    `;
    const unique = /* @__PURE__ */ new Map();
    rows.forEach((row) => {
      const id = String(row.id);
      if (unique.has(id)) return;
      unique.set(id, {
        id,
        title: String(row.title ?? ""),
        item: String(row.item ?? ""),
        specs: normalizeSpecsRecord(row.specs),
        product_name: String(row.product_name ?? ""),
        product_id: row.product_id ? String(row.product_id) : null,
        product_price: row.product_price == null ? null : Number(row.product_price),
        product_stock_status: row.product_stock_status ? String(row.product_stock_status) : null,
        created_by_name: row.created_by_name ?? null,
        created_at: String(row.created_at)
      });
    });
    return Array.from(unique.values());
  } catch (error) {
    console.warn("Could not load product catalogue. Check DATABASE_URL.", error);
    return [];
  }
});
async function syncProductsIntoCatalogue(sql) {
  const productRows = await sql`
    select
      p.id,
      p.title,
      p.brand,
      p.subcategory,
      p.specs,
      p.catalogue_id,
      p.created_at,
      c.id as existing_catalogue_id
    from products p
    left join product_catalogue c on c.id = p.catalogue_id
    where coalesce(p.is_hidden, false) = false
      and coalesce(p.product_origin, 'website') = 'website'
    order by p.created_at desc
  `;
  for (const row of productRows) {
    if (row.catalogue_id && row.existing_catalogue_id) continue;
    const productName = String(row.title ?? "").trim();
    if (!productName) continue;
    const catalogueTitle = String(row.brand ?? "").trim() || productName;
    const item = String(row.subcategory ?? "").split(",")[0]?.trim() || "Product";
    const specs = normalizeSpecsRecord(row.specs);
    const insertedRows = await sql`
      insert into product_catalogue (title, item, specs, product_name)
      values (
        ${catalogueTitle},
        ${item},
        ${JSON.stringify(specs)}::jsonb,
        ${productName}
      )
      on conflict (product_name) do update
      set
        title = coalesce(nullif(product_catalogue.title, ''), excluded.title),
        item = coalesce(nullif(product_catalogue.item, ''), excluded.item),
        specs = case
          when product_catalogue.specs = '{}'::jsonb then excluded.specs
          else product_catalogue.specs
        end,
        updated_at = now()
      returning id
    `;
    const catalogueId = insertedRows[0]?.id ? String(insertedRows[0].id) : null;
    if (catalogueId) {
      await sql`update products set catalogue_id = ${catalogueId} where id = ${String(row.id)}`;
    }
  }
}
const createProductCatalogueBatchServer_createServerFn_handler = createServerRpc({
  id: "6f28a91d1019b2dc159d1b1b58090c10c4aac43b6c6b228a87bccd0ab2a18438",
  name: "createProductCatalogueBatchServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => createProductCatalogueBatchServer.__executeServer(opts));
const createProductCatalogueBatchServer = createServerFn({
  method: "POST"
}).handler(createProductCatalogueBatchServer_createServerFn_handler, async ({
  data
}) => {
  const input = data;
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await ensureOperationsTables();
  const title = String(input.title ?? "").trim();
  const item = String(input.item ?? "").trim();
  const variants = (input.variants ?? []).map((variant) => ({
    specs: normalizeSpecsRecord(variant.specs)
  })).filter((variant) => Object.keys(variant.specs).length > 0);
  if (!title) throw new Error("Title is required.");
  if (!item) throw new Error("Item is required.");
  if (variants.length === 0) throw new Error("Add at least one spec variant.");
  const created = [];
  for (const variant of variants) {
    const productName = buildCatalogueProductName(title, variant.specs);
    await sql`
      insert into product_catalogue (
        title, item, specs, product_name,
        created_by_email, created_by_name, created_by_role
      )
      values (
        ${title},
        ${item},
        ${JSON.stringify(variant.specs)}::jsonb,
        ${productName},
        ${input.actor.email},
        ${input.actor.name},
        ${input.actor.role}
      )
      on conflict (product_name) do update
      set
        title = excluded.title,
        item = excluded.item,
        specs = excluded.specs,
        updated_at = now()
    `;
    created.push(productName);
  }
  await logActivity({
    actor: input.actor,
    action: "created_batch",
    entityType: "product_catalogue",
    entityLabel: title,
    details: {
      item,
      variants: created
    }
  });
  return {
    ok: true,
    count: created.length
  };
});
const updateProductCatalogueItemServer_createServerFn_handler = createServerRpc({
  id: "68afc5cfdac8ff673aa9758b06215c5f0c3823fab63a6f1af433d5275d1d3fe7",
  name: "updateProductCatalogueItemServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => updateProductCatalogueItemServer.__executeServer(opts));
const updateProductCatalogueItemServer = createServerFn({
  method: "POST"
}).handler(updateProductCatalogueItemServer_createServerFn_handler, async ({
  data
}) => {
  const input = data;
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await ensureOperationsTables();
  const title = String(input.title ?? "").trim();
  const item = String(input.item ?? "").trim();
  const specs = normalizeSpecsRecord(input.specs);
  const productName = String(input.product_name ?? "").trim() || buildCatalogueProductName(title, specs);
  if (!input.id) throw new Error("Catalogue item is required.");
  if (!title) throw new Error("Title is required.");
  if (!item) throw new Error("Item is required.");
  if (Object.keys(specs).length === 0) throw new Error("Specs are required.");
  if (!productName) throw new Error("Product name is required.");
  await sql`
    update product_catalogue
    set
      title = ${title},
      item = ${item},
      specs = ${JSON.stringify(specs)}::jsonb,
      product_name = ${productName},
      updated_at = now()
    where id = ${input.id}
  `;
  await sql`
    update products
    set
      title = ${productName},
      brand = ${title},
      subcategory = ${item},
      specs = ${JSON.stringify(specs)}::jsonb,
      updated_at = now()
    where catalogue_id = ${input.id}
  `;
  await logActivity({
    actor: input.actor,
    action: "updated",
    entityType: "product_catalogue",
    entityId: input.id,
    entityLabel: productName,
    details: {
      title,
      item,
      specs
    }
  });
  return {
    ok: true
  };
});
const deleteProductCatalogueItemServer_createServerFn_handler = createServerRpc({
  id: "8e08f7efdeea017fa2ad0cb6afe730106dde3162172a2e614d2d56bb1bf3fc63",
  name: "deleteProductCatalogueItemServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => deleteProductCatalogueItemServer.__executeServer(opts));
const deleteProductCatalogueItemServer = createServerFn({
  method: "POST"
}).handler(deleteProductCatalogueItemServer_createServerFn_handler, async ({
  data
}) => {
  const input = data;
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await ensureOperationsTables();
  const [existing] = await sql`select product_name from product_catalogue where id = ${input.id} limit 1`;
  if (!existing) throw new Error("Catalogue item not found.");
  await sql`update products set catalogue_id = null where catalogue_id = ${input.id}`;
  await sql`delete from product_catalogue where id = ${input.id}`;
  await logActivity({
    action: "deleted",
    entityType: "product_catalogue",
    entityId: input.id,
    entityLabel: String(existing.product_name ?? "Catalogue item")
  });
  return {
    ok: true
  };
});
const upsertAdminProductServer_createServerFn_handler = createServerRpc({
  id: "005f6fb3ea34129e7297d1c41305ab14fa00bd4dee65915b065b13a9d4116f7f",
  name: "upsertAdminProductServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => upsertAdminProductServer.__executeServer(opts));
const upsertAdminProductServer = createServerFn({
  method: "POST"
}).handler(upsertAdminProductServer_createServerFn_handler, async ({
  data
}) => {
  const input = data;
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  const normalizedSpecs = normalizeSpecsRecord(input.specs ?? {});
  await ensureOperationsTables();
  if (input.id) {
    await sql`
      update products
      set
        title = ${input.title},
        catalogue_id = ${input.catalogue_id ?? null},
        slug = ${input.slug},
        description = ${input.description ?? null},
        brand = ${input.brand ?? null},
        subcategory = ${input.subcategory ?? null},
        product_origin = 'website',
        price = ${input.price},
        old_price = ${input.old_price ?? null},
        stock_status = ${input.stock_status},
        category_id = ${input.category_id ?? null},
        images = ${input.images}::text[],
        specs = ${JSON.stringify(normalizedSpecs)}::jsonb,
        featured = ${input.featured},
        is_hidden = ${Boolean(input.hidden)},
        badge = ${input.badge ?? null},
        warranty = ${input.warranty ?? null},
        updated_at = now()
      where id = ${input.id}
    `;
    await logActivity({
      action: "updated",
      entityType: "product",
      entityId: input.id,
      entityLabel: input.title,
      details: {
        price: input.price,
        stock_status: input.stock_status,
        featured: input.featured,
        hidden: Boolean(input.hidden),
        badge: input.badge ?? null
      }
    });
    return {
      ok: true
    };
  }
  await sql`
    insert into products (
      title, slug, description, price, old_price, stock_status,
      category_id, images, specs, featured, is_hidden, badge, warranty, brand, subcategory, catalogue_id, product_origin
    )
    values (
      ${input.title},
      ${input.slug},
      ${input.description ?? null},
      ${input.price},
      ${input.old_price ?? null},
      ${input.stock_status},
      ${input.category_id ?? null},
      ${input.images}::text[],
      ${JSON.stringify(normalizedSpecs)}::jsonb,
      ${input.featured},
      ${Boolean(input.hidden)},
      ${input.badge ?? null},
      ${input.warranty ?? null},
      ${input.brand ?? null},
      ${input.subcategory ?? null},
      ${input.catalogue_id ?? null},
      ${"website"}
    )
  `;
  await logActivity({
    action: "created",
    entityType: "product",
    entityLabel: input.title,
    details: {
      price: input.price,
      stock_status: input.stock_status,
      featured: input.featured,
      hidden: Boolean(input.hidden),
      badge: input.badge ?? null
    }
  });
  return {
    ok: true
  };
});
const storeAdminProductImagesServer_createServerFn_handler = createServerRpc({
  id: "9d03eb21d0cc975d7cc9dd523242c3543e543f40b44ebd5efd516340392ce19d",
  name: "storeAdminProductImagesServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => storeAdminProductImagesServer.__executeServer(opts));
const storeAdminProductImagesServer = createServerFn({
  method: "POST"
}).handler(storeAdminProductImagesServer_createServerFn_handler, async ({
  data
}) => {
  const input = data;
  const normalizedImages = Array.isArray(input.images) ? input.images.map(String).filter(Boolean) : [];
  const storedImages = [];
  for (const image of normalizedImages) {
    storedImages.push(await persistProductImage(image));
  }
  return storedImages;
});
const storeAdminBannerImagesServer_createServerFn_handler = createServerRpc({
  id: "ddbe094c6fc761c99d716bbd1fe9bf631df2403231dddc7f9cac721574decb0b",
  name: "storeAdminBannerImagesServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => storeAdminBannerImagesServer.__executeServer(opts));
const storeAdminBannerImagesServer = createServerFn({
  method: "POST"
}).handler(storeAdminBannerImagesServer_createServerFn_handler, async ({
  data
}) => {
  const input = data;
  const normalizedImages = Array.isArray(input.images) ? input.images.map(String).filter(Boolean) : [];
  const storedImages = [];
  for (const image of normalizedImages) {
    storedImages.push(await persistBannerImage(image));
  }
  return storedImages;
});
const deleteAdminProductServer_createServerFn_handler = createServerRpc({
  id: "98e8b9625e40ae7505b7eef6f02f4fa174b21b7ae0eff4bd8b88a9e5d82306b1",
  name: "deleteAdminProductServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => deleteAdminProductServer.__executeServer(opts));
const deleteAdminProductServer = createServerFn({
  method: "POST"
}).handler(deleteAdminProductServer_createServerFn_handler, async ({
  data
}) => {
  const input = data;
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await sql`delete from products where id = ${input.id}`;
  await logActivity({
    action: "deleted",
    entityType: "product",
    entityId: input.id
  });
  return {
    ok: true
  };
});
const fetchAdminDashboardServer_createServerFn_handler = createServerRpc({
  id: "39f33562f1653f20d5626a1bbf669a31084bf0b73ac8668aef0266761f426768",
  name: "fetchAdminDashboardServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => fetchAdminDashboardServer.__executeServer(opts));
const fetchAdminDashboardServer = createServerFn({
  method: "POST"
}).handler(fetchAdminDashboardServer_createServerFn_handler, async () => {
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const {
    ensureAnalyticsTables
  } = await import("./analytics-DJxVL8O5.js");
  const sql = getNeonSql();
  await ensureAnalyticsTables();
  await ensureOperationsTables();
  const [productCountRow] = await sql`select count(*)::int as count from products`;
  const [categoryCountRow] = await sql`select count(*)::int as count from categories`;
  const [expenseTotalRow] = await sql`
    select coalesce(sum(amount), 0)::numeric as total
    from expenses
    where expense_date >= date_trunc('month', current_date)
  `;
  const recentExpenseRows = await sql`
    select id, title, category, amount, expense_date, created_by_name
    from expenses
    order by expense_date desc, created_at desc
    limit 5
  `;
  const products = await sql`
    select id, title, slug, price, stock_status, images, featured, created_at
    from products
    order by created_at desc
  `;
  const orders = await sql`
    select id, customer_name, customer_phone, items, total, message, status, source, created_at
    from orders
    order by created_at desc
  `;
  const inquiries = await sql`
    select id, customer_name, customer_phone, items, total, status, created_at
    from inquiries
    order by created_at desc
  `;
  const recent = orders.slice(0, 5).map(parseOrderRow);
  const totalRevenue = orders.reduce((sum, row) => sum + Number(row.total ?? 0), 0);
  const pending = orders.filter((row) => row.status === "pending").length;
  const completed = orders.filter((row) => row.status === "completed").length;
  const contacted = orders.filter((row) => row.status === "contacted").length;
  const cancelled = orders.filter((row) => row.status === "cancelled").length;
  const customerMap = /* @__PURE__ */ new Map();
  orders.forEach((row) => {
    const name = typeof row.customer_name === "string" ? row.customer_name.trim() : "";
    const phone = typeof row.customer_phone === "string" ? row.customer_phone.trim() : "";
    const key = phone || name;
    if (!key) return;
    const current = customerMap.get(key) ?? {
      orders: 0,
      name: name || null,
      phone: phone || null
    };
    current.orders += 1;
    customerMap.set(key, current);
  });
  const customers = customerMap.size;
  const returningCustomers = Array.from(customerMap.values()).filter((customer) => customer.orders > 1).length;
  const averageOrderValue = orders.length ? totalRevenue / orders.length : 0;
  const conversionRate = orders.length ? Math.round(completed / orders.length * 100) : 0;
  const productLookup = new Map(products.map((row) => [String(row.slug ?? "").toLowerCase(), {
    id: String(row.id),
    title: String(row.title ?? "Product"),
    slug: String(row.slug ?? ""),
    price: Number(row.price ?? 0),
    stock_status: String(row.stock_status ?? "in_stock"),
    images: Array.isArray(row.images) ? row.images.map(String) : [],
    featured: Boolean(row.featured)
  }]));
  const topProductsMap = /* @__PURE__ */ new Map();
  orders.forEach((row) => {
    const items = Array.isArray(row.items) ? row.items : [];
    items.forEach((item) => {
      const slug = typeof item?.slug === "string" && item.slug ? item.slug : typeof item?.title === "string" ? item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "product";
      const matchedProduct = productLookup.get(String(slug).toLowerCase());
      const key = matchedProduct?.slug || slug;
      const title = matchedProduct?.title || String(item?.title ?? "Product");
      const price = Number(item?.price ?? matchedProduct?.price ?? 0);
      const quantity = Number(item?.quantity ?? 1);
      const current = topProductsMap.get(key) ?? {
        title,
        slug: key,
        image: matchedProduct?.images?.[0] ?? null,
        price,
        inquiries: 0,
        revenue: 0
      };
      current.inquiries += quantity;
      current.revenue += price * quantity;
      topProductsMap.set(key, current);
    });
  });
  const topProducts = Array.from(topProductsMap.values()).sort((a, b) => b.revenue - a.revenue || b.inquiries - a.inquiries).slice(0, 5);
  const lowStockProducts = products.filter((row) => String(row.stock_status ?? "in_stock") !== "in_stock").slice(0, 5).map((row) => ({
    id: String(row.id),
    title: String(row.title ?? "Product"),
    image: Array.isArray(row.images) && row.images.length > 0 ? String(row.images[0]) : null,
    stock_status: String(row.stock_status ?? "in_stock")
  }));
  const upcomingBillRows = await sql`
    select b.id, b.bill_number, b.bill_date, b.due_date, b.amount, b.status, s.name as supplier_name
    from supplier_bills b
    left join suppliers s on s.id = b.supplier_id
    where b.status <> 'paid'
      and b.due_date is not null
      and b.due_date between current_date and current_date + interval '7 days'
    order by b.due_date asc, b.created_at asc
    limit 5
  `;
  const overdueTakeoutRows = await sql`
    select
      r.id,
      r.serial_code,
      r.created_at,
      r.takeout_date,
      p.title as product_title,
      rs.name as reseller_name
    from stock_takeout_records r
    left join products p on p.id = r.product_id
    left join resellers rs on rs.id = r.reseller_id
    where r.returned_at is null
      and r.created_at <= now() - interval '24 hours'
      and not exists (
        select 1
        from orders o
        cross join lateral jsonb_array_elements(coalesce(o.items, '[]'::jsonb)) item
        where trim(lower(item->>'serial_number')) = trim(lower(r.serial_code))
          and coalesce(item ->> 'id', '') = r.product_id::text
          and o.status <> 'cancelled'
      )
    order by r.created_at asc
    limit 5
  `;
  const now = /* @__PURE__ */ new Date();
  const series = Array.from({
    length: 90
  }, (_, index) => {
    const date = new Date(now);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (89 - index));
    const iso = date.toISOString().slice(0, 10);
    return {
      date: iso,
      label: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
      }),
      revenue: 0,
      inquiries: 0,
      orders: 0
    };
  });
  const seriesMap = new Map(series.map((entry) => [entry.date, entry]));
  inquiries.forEach((row) => {
    const date = new Date(row.created_at);
    date.setHours(0, 0, 0, 0);
    const key = date.toISOString().slice(0, 10);
    const point = seriesMap.get(key);
    if (!point) return;
    point.inquiries += 1;
  });
  orders.forEach((row) => {
    const date = new Date(row.created_at);
    date.setHours(0, 0, 0, 0);
    const key = date.toISOString().slice(0, 10);
    const point = seriesMap.get(key);
    if (!point) return;
    point.orders += 1;
    point.revenue += Number(row.total ?? 0);
  });
  const ordersByStatus = {
    pending,
    contacted,
    completed,
    cancelled
  };
  const trafficRows = await sql`
    select source, count(*)::int as count
    from analytics_events
    where event_type = 'page_view'
      and created_at >= now() - interval '30 days'
    group by source
    order by count(*) desc, source asc
    limit 5
  `;
  const deviceRows = await sql`
    select device_type, count(*)::int as count
    from analytics_events
    where event_type = 'page_view'
      and created_at >= now() - interval '30 days'
    group by device_type
    order by count(*) desc, device_type asc
  `;
  const [pageViewRow] = await sql`
    select count(*)::int as count
    from analytics_events
    where event_type = 'page_view'
      and created_at >= now() - interval '30 days'
  `;
  const totalPageViews = Number(pageViewRow?.count ?? 0);
  const trafficSources = trafficRows.map((row) => ({
    name: String(row.source ?? "Unknown"),
    value: Number(row.count ?? 0)
  }));
  const deviceAnalytics = deviceRows.map((row) => ({
    label: String(row.device_type ?? "Unknown"),
    users: Number(row.count ?? 0)
  }));
  return {
    stats: {
      products: Number(productCountRow?.count ?? 0),
      categories: Number(categoryCountRow?.count ?? 0),
      orders: orders.length,
      inquiries: inquiries.length,
      pending,
      contacted,
      completed,
      cancelled,
      revenue: totalRevenue,
      customers,
      returningCustomers,
      averageOrderValue,
      conversionRate,
      monthlyExpenses: Number(expenseTotalRow?.total ?? 0)
    },
    recent,
    products: {
      top: topProducts,
      lowStock: lowStockProducts,
      upcomingBills: upcomingBillRows.map((row) => ({
        id: String(row.id),
        bill_number: String(row.bill_number ?? ""),
        supplier_name: row.supplier_name ? String(row.supplier_name) : "Supplier",
        due_date: row.due_date ? String(row.due_date) : null,
        amount: Number(row.amount ?? 0),
        status: String(row.status ?? "pending")
      })),
      overdueTakeouts: overdueTakeoutRows.map((row) => ({
        id: String(row.id),
        product_title: String(row.product_title ?? "Product"),
        reseller_name: row.reseller_name ? String(row.reseller_name) : "Reseller",
        serial_code: String(row.serial_code ?? ""),
        takeout_date: row.takeout_date ? String(row.takeout_date) : null,
        created_at: String(row.created_at)
      }))
    },
    analytics: {
      series,
      orderStatus: ordersByStatus,
      trafficSources,
      deviceAnalytics,
      totalPageViews
    },
    expenses: recentExpenseRows.map((row) => ({
      id: String(row.id),
      title: String(row.title ?? ""),
      category: String(row.category ?? ""),
      amount: Number(row.amount ?? 0),
      expense_date: String(row.expense_date),
      created_by_name: row.created_by_name ?? null
    }))
  };
});
const listAdminOrdersServer_createServerFn_handler = createServerRpc({
  id: "5fff447da62f1c30a9d4795a770d66220de9295bbccc24148e4b0b10372fb839",
  name: "listAdminOrdersServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => listAdminOrdersServer.__executeServer(opts));
const listAdminOrdersServer = createServerFn({
  method: "POST"
}).handler(listAdminOrdersServer_createServerFn_handler, async () => {
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await ensureOperationsTables();
  const rows = await sql`
    select id, customer_name, customer_phone, items, total, message, status, source, payment_method, warranty, created_at
    from orders
    order by created_at desc
  `;
  return rows.map(parseOrderRow);
});
const exportAdminOrdersServer_createServerFn_handler = createServerRpc({
  id: "4ae54b3340f5ba37dc8ddab31e0d6551030d942800c1a78bf74823ca9d93e32f",
  name: "exportAdminOrdersServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => exportAdminOrdersServer.__executeServer(opts));
const exportAdminOrdersServer = createServerFn({
  method: "POST"
}).handler(exportAdminOrdersServer_createServerFn_handler, async ({
  data
}) => {
  const input = data;
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await ensureOperationsTables();
  const sourceFilter = input.source === "all" ? null : input.source;
  const rows = await sql`
    select id, customer_name, customer_phone, items, total, message, status, source, payment_method, warranty, created_at
    from orders
    where created_at >= current_date - (${input.days} - 1) * interval '1 day'
      and (${sourceFilter}::text is null or source = ${sourceFilter})
    order by created_at desc
  `;
  return rows.map(parseOrderRow);
});
const createAdminOrderServer_createServerFn_handler = createServerRpc({
  id: "46e0a2f4be3b2f7d345cccb9c0110d14059e3b0e14dc708e3f52660d3c3496bd",
  name: "createAdminOrderServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => createAdminOrderServer.__executeServer(opts));
const createAdminOrderServer = createServerFn({
  method: "POST"
}).handler(createAdminOrderServer_createServerFn_handler, async ({
  data
}) => {
  const input = data;
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  const status = "completed";
  await ensureOperationsTables();
  const orderItems = await normalizeCustomInventoryOrderItems({
    sql,
    items: input.items ?? [],
    actor: input.actor ?? null
  });
  const createdRows = await sql`
    insert into orders (customer_name, customer_phone, items, total, message, status, source, payment_method, warranty)
    values (
      ${input.customer_name ?? null},
      ${input.customer_phone ?? null},
      ${JSON.stringify(orderItems)}::jsonb,
      ${input.total},
      ${input.message ?? null},
      ${status},
      ${input.source},
      ${input.payment_method},
      ${input.warranty ?? null}
    )
    returning id, customer_name, total, created_at
  `;
  const createdOrder = createdRows[0];
  const orderNotificationDescription = buildOrderNotificationDescription({
    customerName: input.customer_name ?? null,
    total: input.total,
    items: orderItems
  });
  const notificationRows = await sql`
    insert into super_admin_notifications (type, entity_type, entity_id, title, description, status)
    values (
      'order_created',
      'order',
      ${createdOrder?.id ? String(createdOrder.id) : null},
      'New order received',
      ${orderNotificationDescription},
      'new'
    )
    returning id, created_at
  `;
  const createdNotification = notificationRows[0];
  const depletedNotifications = await createDepletedStockNotificationsForOrder({
    sql,
    items: orderItems
  });
  await logActivity({
    action: "created",
    entityType: "order",
    entityLabel: input.customer_name ?? "Order",
    details: {
      source: input.source,
      payment_method: input.payment_method,
      warranty: input.warranty ?? null,
      status,
      total: input.total,
      items_count: Array.isArray(orderItems) ? orderItems.length : 0
    }
  });
  try {
    const pushRows = await sql`
      select endpoint, p256dh, auth
      from push_subscriptions
      where admin_role = 'super_admin'
      order by updated_at desc
    `;
    if (pushRows.length > 0) {
      const {
        sendWebPushNotification
      } = await import("./web-push.server-Hx0pP6te.js");
      const pushResults = await Promise.all(pushRows.map((row) => sendWebPushNotification({
        subscription: {
          endpoint: String(row.endpoint ?? ""),
          p256dh: String(row.p256dh ?? ""),
          auth: String(row.auth ?? "")
        },
        message: {
          title: "New order received",
          body: orderNotificationDescription,
          url: "/admin/notifications",
          tag: createdNotification?.id ? `order-${String(createdNotification.id)}` : "order-created"
        }
      })));
      const expiredEndpoints = pushRows.filter((_, index) => [404, 410].includes(pushResults[index]?.status ?? 0)).map((row) => String(row.endpoint ?? "")).filter(Boolean);
      for (const endpoint of expiredEndpoints) {
        await sql`delete from push_subscriptions where endpoint = ${endpoint}`;
      }
    }
  } catch (error) {
    console.error("Failed to send super admin push notification", error);
  }
  for (const notification of depletedNotifications) {
    await sendSuperAdminPushAlerts({
      title: notification.title,
      body: notification.description,
      tag: notification.id ? `depleted-${notification.id}` : "stock-depleted"
    });
  }
  return {
    ok: true
  };
});
async function normalizeCustomInventoryOrderItems(input) {
  const normalizedItems = [];
  for (const item of input.items ?? []) {
    const customInventory = item.custom_inventory;
    if (!customInventory) {
      normalizedItems.push(item);
      continue;
    }
    const productName = String(customInventory.product_name ?? item.title ?? "").trim();
    const supplierId = String(customInventory.supplier_id ?? "").trim();
    const serialCode = String(customInventory.serial_code ?? item.serial_number ?? "").trim();
    const catalogueId = String(customInventory.catalogue_id ?? "").trim();
    if (!productName) throw new Error("Custom product name is required.");
    if (!supplierId) throw new Error(`Supplier is required for ${productName}.`);
    if (!serialCode) throw new Error(`Serial code is required for ${productName}.`);
    const [existingSerial] = await input.sql`
      select serial_code
      from stock_intake_records
      where trim(lower(serial_code)) = trim(lower(${serialCode}))
      limit 1
    `;
    if (existingSerial) {
      throw new Error(`Serial number ${serialCode} already exists.`);
    }
    const productId = await resolveInventoryProductId({
      product_id: null,
      catalogue_id: catalogueId || null,
      product_name: productName,
      stock_status: "in_stock"
    });
    await input.sql`
      insert into stock_intake_records (
        product_id, supplier_id, serial_code, quantity, unit_cost, stock_price, due_date, received_at, stock_status, notes,
        created_by_email, created_by_name, created_by_role
      )
      values (
        ${productId},
        ${supplierId},
        ${serialCode},
        1,
        null,
        ${Number(item.price ?? 0) || null},
        null,
        ${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)},
        ${"in_stock"},
        ${"Created from custom order product"},
        ${input.actor?.email ?? null},
        ${input.actor?.name ?? null},
        ${input.actor?.role ?? null}
      )
    `;
    await input.sql`update products set stock_status = 'in_stock', updated_at = now() where id = ${productId}`;
    await logActivity({
      actor: input.actor ?? void 0,
      action: "created_from_order",
      entityType: "stock_intake",
      entityLabel: serialCode,
      details: {
        product_name: productName,
        supplier_id: supplierId
      }
    });
    const {
      custom_inventory,
      ...orderItem
    } = item;
    normalizedItems.push({
      ...orderItem,
      id: productId,
      title: productName,
      serial_number: serialCode
    });
  }
  return normalizedItems;
}
const deleteAdminOrderServer_createServerFn_handler = createServerRpc({
  id: "1d41e017c96da896a9676473069a560785ccb808d8b57bad761ba024d119000b",
  name: "deleteAdminOrderServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => deleteAdminOrderServer.__executeServer(opts));
const deleteAdminOrderServer = createServerFn({
  method: "POST"
}).handler(deleteAdminOrderServer_createServerFn_handler, async ({
  data
}) => {
  const input = data;
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await ensureOperationsTables();
  const [existing] = await sql`
    select id, customer_name, total
    from orders
    where id = ${input.id}
    limit 1
  `;
  if (!existing) {
    throw new Error("Order not found");
  }
  await sql`delete from orders where id = ${input.id}`;
  await logActivity({
    action: "deleted",
    entityType: "order",
    entityId: String(existing.id),
    entityLabel: existing.customer_name ? String(existing.customer_name) : "Order",
    details: {
      total: Number(existing.total ?? 0)
    }
  });
  return {
    ok: true
  };
});
const updateAdminOrderStatusServer_createServerFn_handler = createServerRpc({
  id: "99f2b5e8fbfddf4e33a241d82216df21c81db4ca925a8f04cba6ccdcd429bea0",
  name: "updateAdminOrderStatusServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => updateAdminOrderStatusServer.__executeServer(opts));
const updateAdminOrderStatusServer = createServerFn({
  method: "POST"
}).handler(updateAdminOrderStatusServer_createServerFn_handler, async ({
  data
}) => {
  const input = data;
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await ensureOperationsTables();
  await sql`update orders set status = ${input.status}, updated_at = now() where id = ${input.id}`;
  await logActivity({
    action: "status_updated",
    entityType: "order",
    entityId: input.id,
    details: {
      status: input.status
    }
  });
  return {
    ok: true
  };
});
const listAdminInquiriesServer_createServerFn_handler = createServerRpc({
  id: "a02170316cb5ace4a2d07cd42c534d7af2968a42a53340046a6decff7c270d08",
  name: "listAdminInquiriesServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => listAdminInquiriesServer.__executeServer(opts));
const listAdminInquiriesServer = createServerFn({
  method: "POST"
}).handler(listAdminInquiriesServer_createServerFn_handler, async () => {
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  const rows = await sql`
    select id, customer_name, customer_phone, items, total, message, status, created_at
    from inquiries
    order by created_at desc
  `;
  return rows.map((row) => ({
    id: String(row.id),
    customer_name: row.customer_name ?? null,
    customer_phone: row.customer_phone ?? null,
    items: Array.isArray(row.items) ? row.items : [],
    total: Number(row.total ?? 0),
    message: row.message ?? null,
    status: String(row.status ?? "pending"),
    created_at: String(row.created_at)
  }));
});
const updateAdminInquiryStatusServer_createServerFn_handler = createServerRpc({
  id: "5c3987d8e7901633584fb96d130b1a643777d1d286cb5a44cb8723c2101d7cc5",
  name: "updateAdminInquiryStatusServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => updateAdminInquiryStatusServer.__executeServer(opts));
const updateAdminInquiryStatusServer = createServerFn({
  method: "POST"
}).handler(updateAdminInquiryStatusServer_createServerFn_handler, async ({
  data
}) => {
  const input = data;
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await sql`update inquiries set status = ${input.status} where id = ${input.id}`;
  await logActivity({
    action: "status_updated",
    entityType: "inquiry",
    entityId: input.id,
    details: {
      status: input.status
    }
  });
  return {
    ok: true
  };
});
const fetchAdminAnalyticsServer_createServerFn_handler = createServerRpc({
  id: "b0b2efd8a2b645b9d7af0e8769ae7824cdff974d4c2935e1865dea6bf755d02e",
  name: "fetchAdminAnalyticsServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => fetchAdminAnalyticsServer.__executeServer(opts));
const fetchAdminAnalyticsServer = createServerFn({
  method: "POST"
}).handler(fetchAdminAnalyticsServer_createServerFn_handler, async ({
  data
}) => {
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const {
    ensureAnalyticsTables
  } = await import("./analytics-DJxVL8O5.js");
  const sql = getNeonSql();
  const input = data ?? {};
  const days = [7, 30, 90, 365].includes(Number(input.days)) ? Number(input.days) : 30;
  await ensureAnalyticsTables();
  const inquiries = await sql`
    select id, status, total, created_at, customer_phone
    from inquiries
    where created_at >= now() - (${days}::text || ' days')::interval
    order by created_at desc
  `;
  const trafficRows = await sql`
    select source, count(*)::int as count
    from analytics_events
    where event_type = 'page_view'
      and created_at >= now() - (${days}::text || ' days')::interval
    group by source
    order by count(*) desc, source asc
  `;
  const deviceRows = await sql`
    select device_type, count(*)::int as count
    from analytics_events
    where event_type = 'page_view'
      and created_at >= now() - (${days}::text || ' days')::interval
    group by device_type
    order by count(*) desc, device_type asc
  `;
  const pageRows = await sql`
    select pathname, count(*)::int as count
    from analytics_events
    where event_type = 'page_view'
      and created_at >= now() - (${days}::text || ' days')::interval
    group by pathname
    order by count(*) desc, pathname asc
    limit 8
  `;
  const inquirySourceRows = await sql`
    select source, count(*)::int as count
    from analytics_events
    where event_type = 'inquiry_submitted'
      and created_at >= now() - (${days}::text || ' days')::interval
    group by source
    order by count(*) desc, source asc
  `;
  const totalRevenue = inquiries.reduce((sum, row) => sum + Number(row.total ?? 0), 0);
  const byStatus = inquiries.reduce((acc, row) => {
    const key = String(row.status ?? "pending");
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const completed = Number(byStatus.completed ?? 0);
  const conv = inquiries.length ? Math.round(completed / inquiries.length * 100) : 0;
  const aov = inquiries.length ? totalRevenue / inquiries.length : 0;
  const uniqueCustomers = new Set(inquiries.map((row) => typeof row.customer_phone === "string" ? row.customer_phone.trim() : "").filter(Boolean)).size;
  const now = /* @__PURE__ */ new Date();
  const series = Array.from({
    length: days
  }, (_, index) => {
    const date = new Date(now);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (days - 1 - index));
    const iso = date.toISOString().slice(0, 10);
    return {
      date: iso,
      label: days <= 31 ? date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
      }) : date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
      }),
      revenue: 0,
      inquiries: 0,
      completed: 0,
      visits: 0
    };
  });
  const seriesMap = new Map(series.map((entry) => [entry.date, entry]));
  inquiries.forEach((row) => {
    const date = new Date(row.created_at);
    date.setHours(0, 0, 0, 0);
    const key = date.toISOString().slice(0, 10);
    const point = seriesMap.get(key);
    if (!point) return;
    point.inquiries += 1;
    point.revenue += Number(row.total ?? 0);
    point.completed += row.status === "completed" ? 1 : 0;
  });
  const visitRows = await sql`
    select created_at
    from analytics_events
    where event_type = 'page_view'
      and created_at >= now() - (${days}::text || ' days')::interval
  `;
  visitRows.forEach((row) => {
    const date = new Date(row.created_at);
    date.setHours(0, 0, 0, 0);
    const key = date.toISOString().slice(0, 10);
    const point = seriesMap.get(key);
    if (point) point.visits += 1;
  });
  return {
    days,
    total: totalRevenue,
    count: inquiries.length,
    byStatus,
    conv,
    aov,
    customers: uniqueCustomers,
    trafficSources: trafficRows.map((row) => ({
      name: String(row.source ?? "Unknown"),
      value: Number(row.count ?? 0)
    })),
    deviceAnalytics: deviceRows.map((row) => ({
      label: String(row.device_type ?? "Unknown"),
      users: Number(row.count ?? 0)
    })),
    topPages: pageRows.map((row) => ({
      pathname: String(row.pathname ?? "/"),
      visits: Number(row.count ?? 0)
    })),
    inquirySources: inquirySourceRows.map((row) => ({
      name: String(row.source ?? "Unknown"),
      value: Number(row.count ?? 0)
    })),
    series
  };
});
const fetchAdminWhatsAppSettingServer_createServerFn_handler = createServerRpc({
  id: "06fff0253b77e893725bc29b5c03c6cb9684864bb5be9dc2b0014bd26740e8f2",
  name: "fetchAdminWhatsAppSettingServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => fetchAdminWhatsAppSettingServer.__executeServer(opts));
const fetchAdminWhatsAppSettingServer = createServerFn({
  method: "POST"
}).handler(fetchAdminWhatsAppSettingServer_createServerFn_handler, async () => {
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  const rows = await sql`
    select value
    from settings
    where key = 'whatsapp_number'
    limit 1
  `;
  const value = rows[0]?.value;
  return typeof value === "string" ? value : value ? String(value) : "";
});
const saveAdminWhatsAppSettingServer_createServerFn_handler = createServerRpc({
  id: "779eb388b4c399f9742cfb55b5f22783852cf9be32cc0b87cdb35e5552b0af21",
  name: "saveAdminWhatsAppSettingServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => saveAdminWhatsAppSettingServer.__executeServer(opts));
const saveAdminWhatsAppSettingServer = createServerFn({
  method: "POST"
}).handler(saveAdminWhatsAppSettingServer_createServerFn_handler, async ({
  data
}) => {
  const input = data;
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await sql`
    insert into settings (key, value, updated_at)
    values ('whatsapp_number', ${JSON.stringify(input.value)}::jsonb, now())
    on conflict (key)
    do update set value = excluded.value, updated_at = now()
  `;
  await logActivity({
    action: "updated",
    entityType: "setting",
    entityLabel: "whatsapp_number",
    details: {
      value: input.value
    }
  });
  return {
    ok: true
  };
});
const fetchAdminCatalogMetaServer_createServerFn_handler = createServerRpc({
  id: "c5fc592b6d2082c6999be4952dc58f54c27c69fa201827458f7bb4b27850935e",
  name: "fetchAdminCatalogMetaServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => fetchAdminCatalogMetaServer.__executeServer(opts));
const fetchAdminCatalogMetaServer = createServerFn({
  method: "POST"
}).handler(fetchAdminCatalogMetaServer_createServerFn_handler, async () => {
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  const rows = await sql`
    select key, value
    from settings
    where key in ('brand_names', 'subcategory_map')
  `;
  const brandRow = rows.find((row) => row.key === "brand_names");
  const subcategoryRow = rows.find((row) => row.key === "subcategory_map");
  const brands = Array.isArray(brandRow?.value) ? brandRow.value.map((value) => String(value)).filter(Boolean) : [];
  const subcategoriesByCategory = subcategoryRow?.value && typeof subcategoryRow.value === "object" && !Array.isArray(subcategoryRow.value) ? Object.fromEntries(Object.entries(subcategoryRow.value).map(([key, value]) => [String(key), Array.isArray(value) ? value.map((item) => String(item)).filter(Boolean) : []])) : {};
  return {
    brands,
    subcategoriesByCategory
  };
});
const saveAdminCatalogMetaServer_createServerFn_handler = createServerRpc({
  id: "e94b50899b02899e55e5708d7ab6faa6ccd67680bfdb3cab3a5199a5bdae495d",
  name: "saveAdminCatalogMetaServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => saveAdminCatalogMetaServer.__executeServer(opts));
const saveAdminCatalogMetaServer = createServerFn({
  method: "POST"
}).handler(saveAdminCatalogMetaServer_createServerFn_handler, async ({
  data
}) => {
  const input = data;
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await sql`
    insert into settings (key, value, updated_at)
    values ('brand_names', ${JSON.stringify(input.brands)}::jsonb, now())
    on conflict (key)
    do update set value = excluded.value, updated_at = now()
  `;
  await sql`
    insert into settings (key, value, updated_at)
    values ('subcategory_map', ${JSON.stringify(input.subcategoriesByCategory)}::jsonb, now())
    on conflict (key)
    do update set value = excluded.value, updated_at = now()
  `;
  await logActivity({
    action: "updated",
    entityType: "catalog_meta",
    entityLabel: "brands-and-subcategories",
    details: {
      brands: input.brands.length,
      categories: Object.keys(input.subcategoriesByCategory).length
    }
  });
  return {
    ok: true
  };
});
const fetchAdminHomepageBannersServer_createServerFn_handler = createServerRpc({
  id: "a84786533017f079a09bd65590bcc4fe1dfd6338dab767541759749030e094cb",
  name: "fetchAdminHomepageBannersServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => fetchAdminHomepageBannersServer.__executeServer(opts));
const fetchAdminHomepageBannersServer = createServerFn({
  method: "POST"
}).handler(fetchAdminHomepageBannersServer_createServerFn_handler, async () => {
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  const rows = await sql`
    select key, value
    from settings
    where key in ('homepage_hero_slides', 'homepage_right_banner', 'homepage_popular_banner', 'homepage_popular_banners', 'shop_mobile_carousel_banners')
  `;
  const heroSlidesRow = rows.find((row) => row.key === "homepage_hero_slides");
  const rightBannerRow = rows.find((row) => row.key === "homepage_right_banner");
  const popularBannerRow = rows.find((row) => row.key === "homepage_popular_banner");
  const popularBannersRow = rows.find((row) => row.key === "homepage_popular_banners");
  const shopMobileBannersRow = rows.find((row) => row.key === "shop_mobile_carousel_banners");
  const heroSlides = Array.isArray(heroSlidesRow?.value) ? heroSlidesRow.value.map((item) => ({
    title: String(item?.title ?? ""),
    description: String(item?.description ?? ""),
    image: String(item?.image ?? ""),
    url: String(item?.url ?? ""),
    ctaLabel: String(item?.ctaLabel ?? "Shop now")
  })).slice(0, 3) : [];
  const rightBanner = rightBannerRow?.value && typeof rightBannerRow.value === "object" && !Array.isArray(rightBannerRow.value) ? {
    image: String(rightBannerRow.value.image ?? ""),
    url: String(rightBannerRow.value.url ?? "")
  } : {
    image: "",
    url: ""
  };
  const fallbackPopularBanner = popularBannerRow?.value && typeof popularBannerRow.value === "object" && !Array.isArray(popularBannerRow.value) ? {
    image: String(popularBannerRow.value.image ?? ""),
    url: String(popularBannerRow.value.url ?? "")
  } : {
    image: "",
    url: ""
  };
  const popularBanners = Array.isArray(popularBannersRow?.value) ? popularBannersRow.value.map((item) => ({
    image: String(item?.image ?? ""),
    url: String(item?.url ?? "")
  })).filter((banner) => banner.image || banner.url).slice(0, 2) : fallbackPopularBanner.image || fallbackPopularBanner.url ? [fallbackPopularBanner] : [];
  const shopMobileBanners = Array.isArray(shopMobileBannersRow?.value) ? shopMobileBannersRow.value.map((item) => ({
    image: String(item?.image ?? ""),
    url: String(item?.url ?? "")
  })).filter((banner) => banner.image).slice(0, 3) : [];
  return {
    heroSlides,
    rightBanner,
    popularBanners,
    shopMobileBanners
  };
});
const saveAdminHomepageBannersServer_createServerFn_handler = createServerRpc({
  id: "95b929ade8e0597ee79a8894b0a689af5f98e998085e14d8377cbfe436664588",
  name: "saveAdminHomepageBannersServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => saveAdminHomepageBannersServer.__executeServer(opts));
const saveAdminHomepageBannersServer = createServerFn({
  method: "POST"
}).handler(saveAdminHomepageBannersServer_createServerFn_handler, async ({
  data
}) => {
  const input = data;
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  const heroSlides = Array.isArray(input.heroSlides) ? input.heroSlides.slice(0, 3).map((slide) => ({
    title: String(slide.title ?? "").trim(),
    description: String(slide.description ?? "").trim(),
    image: String(slide.image ?? "").trim(),
    url: String(slide.url ?? "").trim(),
    ctaLabel: String(slide.ctaLabel ?? "Shop now").trim() || "Shop now"
  })) : [];
  const rightBanner = {
    image: String(input.rightBanner?.image ?? "").trim(),
    url: String(input.rightBanner?.url ?? "").trim()
  };
  const popularBanners = Array.isArray(input.popularBanners) ? input.popularBanners.slice(0, 2).map((banner) => ({
    image: String(banner?.image ?? "").trim(),
    url: String(banner?.url ?? "").trim()
  })) : [];
  const shopMobileBanners = Array.isArray(input.shopMobileBanners) ? input.shopMobileBanners.slice(0, 3).map((banner) => ({
    image: String(banner?.image ?? "").trim(),
    url: String(banner?.url ?? "").trim()
  })) : [];
  const firstPopularBanner = popularBanners[0] ?? {
    image: "",
    url: ""
  };
  await sql`
    insert into settings (key, value, updated_at)
    values ('homepage_hero_slides', ${JSON.stringify(heroSlides)}::jsonb, now())
    on conflict (key)
    do update set value = excluded.value, updated_at = now()
  `;
  await sql`
    insert into settings (key, value, updated_at)
    values ('homepage_right_banner', ${JSON.stringify(rightBanner)}::jsonb, now())
    on conflict (key)
    do update set value = excluded.value, updated_at = now()
  `;
  await sql`
    insert into settings (key, value, updated_at)
    values ('homepage_popular_banner', ${JSON.stringify(firstPopularBanner)}::jsonb, now())
    on conflict (key)
    do update set value = excluded.value, updated_at = now()
  `;
  await sql`
    insert into settings (key, value, updated_at)
    values ('homepage_popular_banners', ${JSON.stringify(popularBanners)}::jsonb, now())
    on conflict (key)
    do update set value = excluded.value, updated_at = now()
  `;
  await sql`
    insert into settings (key, value, updated_at)
    values ('shop_mobile_carousel_banners', ${JSON.stringify(shopMobileBanners)}::jsonb, now())
    on conflict (key)
    do update set value = excluded.value, updated_at = now()
  `;
  await logActivity({
    action: "updated",
    entityType: "homepage_banners",
    entityLabel: "homepage-banners",
    details: {
      heroSlides: heroSlides.length,
      rightBanner: Boolean(rightBanner.image),
      popularBanners: popularBanners.filter((banner) => banner.image).length,
      shopMobileBanners: shopMobileBanners.filter((banner) => banner.image).length
    }
  });
  return {
    ok: true
  };
});
const fetchAdminBestDealProductSlugsServer_createServerFn_handler = createServerRpc({
  id: "ca7e35aef4695f41c198c410305f7899dd24fdf7c3114de3d27179e6feb5cbcf",
  name: "fetchAdminBestDealProductSlugsServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => fetchAdminBestDealProductSlugsServer.__executeServer(opts));
const fetchAdminBestDealProductSlugsServer = createServerFn({
  method: "POST"
}).handler(fetchAdminBestDealProductSlugsServer_createServerFn_handler, async () => {
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  const rows = await sql`
    select value
    from settings
    where key = 'homepage_best_deal_product_slugs'
    limit 1
  `;
  const value = rows[0]?.value;
  return Array.isArray(value) ? value.map((item) => String(item).trim()).filter(Boolean) : [];
});
const saveAdminBestDealProductSlugsServer_createServerFn_handler = createServerRpc({
  id: "b9757ac35b1e515ca7adb225af2c17006388439aa3b5c206f98459c40f1740f8",
  name: "saveAdminBestDealProductSlugsServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => saveAdminBestDealProductSlugsServer.__executeServer(opts));
const saveAdminBestDealProductSlugsServer = createServerFn({
  method: "POST"
}).handler(saveAdminBestDealProductSlugsServer_createServerFn_handler, async ({
  data
}) => {
  const input = data;
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  const normalizedSlugs = Array.from(new Set((Array.isArray(input.slugs) ? input.slugs : []).map((slug) => String(slug).trim()).filter(Boolean)));
  await sql`
    insert into settings (key, value, updated_at)
    values ('homepage_best_deal_product_slugs', ${JSON.stringify(normalizedSlugs)}::jsonb, now())
    on conflict (key)
    do update set value = excluded.value, updated_at = now()
  `;
  await logActivity({
    action: "updated",
    entityType: "homepage_best_deals",
    entityLabel: "homepage-best-deals",
    details: {
      count: normalizedSlugs.length
    }
  });
  return {
    ok: true
  };
});
const updateAdminProductFeaturedServer_createServerFn_handler = createServerRpc({
  id: "87473ab7b0417a82621c25b8671b9ef3b1c803f9f64fdd3330499839907bf641",
  name: "updateAdminProductFeaturedServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => updateAdminProductFeaturedServer.__executeServer(opts));
const updateAdminProductFeaturedServer = createServerFn({
  method: "POST"
}).handler(updateAdminProductFeaturedServer_createServerFn_handler, async ({
  data
}) => {
  const input = data;
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await sql`
    update products
    set featured = ${Boolean(input.featured)}, updated_at = now()
    where id = ${input.id}
  `;
  await logActivity({
    action: input.featured ? "featured" : "unfeatured",
    entityType: "product",
    entityId: input.id,
    entityLabel: input.title,
    details: {
      featured: Boolean(input.featured)
    }
  });
  return {
    ok: true
  };
});
const updateAdminProductCategoryPriorityServer_createServerFn_handler = createServerRpc({
  id: "ac1d73e36988d23adbad1aa4d05a092cd4f8faec7e750a3602125734cb8b1e2c",
  name: "updateAdminProductCategoryPriorityServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => updateAdminProductCategoryPriorityServer.__executeServer(opts));
const updateAdminProductCategoryPriorityServer = createServerFn({
  method: "POST"
}).handler(updateAdminProductCategoryPriorityServer_createServerFn_handler, async ({
  data
}) => {
  const input = data;
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await ensureOperationsTables();
  await sql`
    update products
    set category_priority = ${Boolean(input.category_priority)}, updated_at = now()
    where id = ${input.id}
  `;
  await logActivity({
    action: input.category_priority ? "category_priority_enabled" : "category_priority_disabled",
    entityType: "product",
    entityId: input.id,
    entityLabel: input.title,
    details: {
      category_priority: Boolean(input.category_priority)
    }
  });
  return {
    ok: true
  };
});
const fetchWebPushPublicKeyServer_createServerFn_handler = createServerRpc({
  id: "13c63a631b2006afe398972d5236327969b1bd9bc2d4139098a4f13e925625fd",
  name: "fetchWebPushPublicKeyServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => fetchWebPushPublicKeyServer.__executeServer(opts));
const fetchWebPushPublicKeyServer = createServerFn({
  method: "POST"
}).handler(fetchWebPushPublicKeyServer_createServerFn_handler, async () => {
  const {
    getWebPushPublicKey
  } = await import("./web-push.server-Hx0pP6te.js");
  return {
    publicKey: getWebPushPublicKey()
  };
});
const saveSuperAdminPushSubscriptionServer_createServerFn_handler = createServerRpc({
  id: "a775a32ed79ca9f9cc55efc650fda8d6d39f1763cc216578cb3f8fbcf3a75ae6",
  name: "saveSuperAdminPushSubscriptionServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => saveSuperAdminPushSubscriptionServer.__executeServer(opts));
const saveSuperAdminPushSubscriptionServer = createServerFn({
  method: "POST"
}).handler(saveSuperAdminPushSubscriptionServer_createServerFn_handler, async ({
  data
}) => {
  const input = data;
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await ensureOperationsTables();
  const endpoint = String(input.endpoint ?? "").trim();
  const p256dh = String(input.keys?.p256dh ?? "").trim();
  const auth = String(input.keys?.auth ?? "").trim();
  const adminEmail = String(input.admin_email ?? "").trim().toLowerCase();
  const adminRole = input.admin_role === "super_admin" ? "super_admin" : "admin";
  if (!endpoint || !p256dh || !auth || !adminEmail) {
    throw new Error("Push subscription details are incomplete.");
  }
  await sql`
    insert into push_subscriptions (admin_email, admin_role, endpoint, p256dh, auth, user_agent, device_label, updated_at)
    values (
      ${adminEmail},
      ${adminRole},
      ${endpoint},
      ${p256dh},
      ${auth},
      ${input.user_agent ?? null},
      ${input.device_label ?? null},
      now()
    )
    on conflict (endpoint)
    do update set
      admin_email = excluded.admin_email,
      admin_role = excluded.admin_role,
      p256dh = excluded.p256dh,
      auth = excluded.auth,
      user_agent = excluded.user_agent,
      device_label = excluded.device_label,
      updated_at = now()
  `;
  return {
    ok: true
  };
});
const removeSuperAdminPushSubscriptionServer_createServerFn_handler = createServerRpc({
  id: "dccc22e809a9866ef021d443acd0a6eba36d772f44c9674b206b7fd5a37b7ac6",
  name: "removeSuperAdminPushSubscriptionServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => removeSuperAdminPushSubscriptionServer.__executeServer(opts));
const removeSuperAdminPushSubscriptionServer = createServerFn({
  method: "POST"
}).handler(removeSuperAdminPushSubscriptionServer_createServerFn_handler, async ({
  data
}) => {
  const input = data;
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await ensureOperationsTables();
  const endpoint = String(input.endpoint ?? "").trim();
  if (!endpoint) {
    throw new Error("Subscription endpoint is required.");
  }
  await sql`delete from push_subscriptions where endpoint = ${endpoint}`;
  return {
    ok: true
  };
});
const markSuperAdminNotificationReadServer_createServerFn_handler = createServerRpc({
  id: "28220fa7396bfcef9cd3e07df2c76cf0a71883526f3cb8388ca04350c35eb740",
  name: "markSuperAdminNotificationReadServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => markSuperAdminNotificationReadServer.__executeServer(opts));
const markSuperAdminNotificationReadServer = createServerFn({
  method: "POST"
}).handler(markSuperAdminNotificationReadServer_createServerFn_handler, async ({
  data
}) => {
  const input = data;
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  const normalizedId = String(input.id ?? "").trim();
  if (!normalizedId) {
    throw new Error("Notification id is required.");
  }
  const rows = await sql`
    select value
    from settings
    where key = 'super_admin_notification_reads'
    limit 1
  `;
  const existingValue = rows[0]?.value;
  const existingIds = Array.isArray(existingValue) ? existingValue.map((value) => String(value)).filter(Boolean) : [];
  const nextIds = Array.from(/* @__PURE__ */ new Set([...existingIds, normalizedId]));
  await sql`
    insert into settings (key, value, updated_at)
    values ('super_admin_notification_reads', ${JSON.stringify(nextIds)}::jsonb, now())
    on conflict (key)
    do update set value = excluded.value, updated_at = now()
  `;
  return {
    ok: true
  };
});
const listAdminCustomersServer_createServerFn_handler = createServerRpc({
  id: "d666562cb9a5731f16e9873418281fff6eafafe310d86fa753c1b75cedd56581",
  name: "listAdminCustomersServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => listAdminCustomersServer.__executeServer(opts));
const listAdminCustomersServer = createServerFn({
  method: "POST"
}).handler(listAdminCustomersServer_createServerFn_handler, async () => {
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  const rows = await sql`
    select
      min(id)::text as id,
      nullif(trim(customer_name), '') as full_name,
      nullif(trim(customer_phone), '') as phone,
      min(created_at) as created_at
    from inquiries
    where coalesce(trim(customer_name), '') <> '' or coalesce(trim(customer_phone), '') <> ''
    group by nullif(trim(customer_name), ''), nullif(trim(customer_phone), '')
    order by min(created_at) desc
  `;
  return rows.map((row) => ({
    id: String(row.id),
    full_name: row.full_name ?? null,
    phone: row.phone ?? null,
    created_at: String(row.created_at)
  }));
});
const listSuppliersServer_createServerFn_handler = createServerRpc({
  id: "d38f058322f691b5ad61a7db1020e107d30c25484a24216c48f7983e19c26c22",
  name: "listSuppliersServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => listSuppliersServer.__executeServer(opts));
const listSuppliersServer = createServerFn({
  method: "POST"
}).handler(listSuppliersServer_createServerFn_handler, async () => {
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await ensureOperationsTables();
  const rows = await sql`
    select id, name, contact_person, phone, email, address, notes, created_at, updated_at
    from suppliers
    order by created_at desc
  `;
  return rows.map((row) => ({
    id: String(row.id),
    name: String(row.name ?? ""),
    contact_person: row.contact_person ?? null,
    phone: row.phone ?? null,
    email: row.email ?? null,
    address: row.address ?? null,
    notes: row.notes ?? null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at)
  }));
});
const upsertSupplierServer_createServerFn_handler = createServerRpc({
  id: "dbcf1fe52e309bac299a49c1e6c6ad5c276ade75f8f23d2ea5b077aafd3e6e73",
  name: "upsertSupplierServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => upsertSupplierServer.__executeServer(opts));
const upsertSupplierServer = createServerFn({
  method: "POST"
}).handler(upsertSupplierServer_createServerFn_handler, async ({
  data
}) => {
  const input = data;
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await ensureOperationsTables();
  if (input.id) {
    await sql`
      update suppliers
      set
        name = ${input.name},
        contact_person = ${input.contact_person ?? null},
        phone = ${input.phone ?? null},
        email = ${input.email ?? null},
        address = ${input.address ?? null},
        notes = ${input.notes ?? null},
        updated_at = now()
      where id = ${input.id}
    `;
    await logActivity({
      action: "updated",
      entityType: "supplier",
      entityId: input.id,
      entityLabel: input.name
    });
    return {
      ok: true
    };
  }
  await sql`
    insert into suppliers (name, contact_person, phone, email, address, notes)
    values (
      ${input.name},
      ${input.contact_person ?? null},
      ${input.phone ?? null},
      ${input.email ?? null},
      ${input.address ?? null},
      ${input.notes ?? null}
    )
  `;
  await logActivity({
    action: "created",
    entityType: "supplier",
    entityLabel: input.name
  });
  return {
    ok: true
  };
});
const deleteSupplierServer_createServerFn_handler = createServerRpc({
  id: "a9a30835048636d3635808fa17edc8a3c5b7d2ba7f19d42b8ca3858fc30554dd",
  name: "deleteSupplierServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => deleteSupplierServer.__executeServer(opts));
const deleteSupplierServer = createServerFn({
  method: "POST"
}).handler(deleteSupplierServer_createServerFn_handler, async ({
  data
}) => {
  const input = data;
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await ensureOperationsTables();
  await sql`delete from suppliers where id = ${input.id}`;
  await logActivity({
    action: "deleted",
    entityType: "supplier",
    entityId: input.id
  });
  return {
    ok: true
  };
});
const listResellersServer_createServerFn_handler = createServerRpc({
  id: "c95ed22a0d63222711af281a51b3f1ca4bb2a98c374f9abecbb53a88158b998f",
  name: "listResellersServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => listResellersServer.__executeServer(opts));
const listResellersServer = createServerFn({
  method: "POST"
}).handler(listResellersServer_createServerFn_handler, async () => {
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await ensureOperationsTables();
  const rows = await sql`
    select id, name, contact_person, phone, email, address, notes, created_at, updated_at
    from resellers
    order by created_at desc
  `;
  return rows.map((row) => ({
    id: String(row.id),
    name: String(row.name ?? ""),
    contact_person: row.contact_person ?? null,
    phone: row.phone ?? null,
    email: row.email ?? null,
    address: row.address ?? null,
    notes: row.notes ?? null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at)
  }));
});
const upsertResellerServer_createServerFn_handler = createServerRpc({
  id: "51d5029ca1538f24cd107114d4c2805e9bb4ff8de337dc6a228e7b1ecaf16616",
  name: "upsertResellerServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => upsertResellerServer.__executeServer(opts));
const upsertResellerServer = createServerFn({
  method: "POST"
}).handler(upsertResellerServer_createServerFn_handler, async ({
  data
}) => {
  const input = data;
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await ensureOperationsTables();
  if (input.id) {
    await sql`
      update resellers
      set
        name = ${input.name},
        contact_person = ${input.contact_person ?? null},
        phone = ${input.phone ?? null},
        email = ${input.email ?? null},
        address = ${input.address ?? null},
        notes = ${input.notes ?? null},
        updated_at = now()
      where id = ${input.id}
    `;
    await logActivity({
      action: "updated",
      entityType: "reseller",
      entityId: input.id,
      entityLabel: input.name
    });
    return {
      ok: true
    };
  }
  await sql`
    insert into resellers (name, contact_person, phone, email, address, notes)
    values (
      ${input.name},
      ${input.contact_person ?? null},
      ${input.phone ?? null},
      ${input.email ?? null},
      ${input.address ?? null},
      ${input.notes ?? null}
    )
  `;
  await logActivity({
    action: "created",
    entityType: "reseller",
    entityLabel: input.name
  });
  return {
    ok: true
  };
});
const deleteResellerServer_createServerFn_handler = createServerRpc({
  id: "663132f5d1169f71d457139a82fd9abf35dcffa44d73bc77ad1b645b5932a5bf",
  name: "deleteResellerServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => deleteResellerServer.__executeServer(opts));
const deleteResellerServer = createServerFn({
  method: "POST"
}).handler(deleteResellerServer_createServerFn_handler, async ({
  data
}) => {
  const input = data;
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await ensureOperationsTables();
  await sql`delete from resellers where id = ${input.id}`;
  await logActivity({
    action: "deleted",
    entityType: "reseller",
    entityId: input.id
  });
  return {
    ok: true
  };
});
const listSupplierBillsServer_createServerFn_handler = createServerRpc({
  id: "57a73a0169c72143daf3c05a57bfaeac45c4f33b9ad116310b045bc408320a9f",
  name: "listSupplierBillsServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => listSupplierBillsServer.__executeServer(opts));
const listSupplierBillsServer = createServerFn({
  method: "POST"
}).handler(listSupplierBillsServer_createServerFn_handler, async () => {
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await ensureOperationsTables();
  const rows = await sql`
    select
      b.*,
      s.name as supplier_name,
      p.title as product_title
    from supplier_bills b
    left join suppliers s on s.id = b.supplier_id
    left join products p on p.id = b.product_id
    order by b.bill_date desc, b.created_at desc
  `;
  return rows.map((row) => ({
    id: String(row.id),
    supplier_id: row.supplier_id ? String(row.supplier_id) : null,
    supplier_name: row.supplier_name ? String(row.supplier_name) : null,
    product_id: row.product_id ? String(row.product_id) : null,
    product_title: row.product_title ? String(row.product_title) : null,
    stock_intake_id: row.stock_intake_id ? String(row.stock_intake_id) : null,
    serial_code: row.serial_code ? String(row.serial_code) : null,
    bill_number: String(row.bill_number ?? ""),
    bill_date: String(row.bill_date),
    due_date: row.due_date ? String(row.due_date) : null,
    opening_stock_price: row.opening_stock_price == null ? null : Number(row.opening_stock_price),
    remaining_stock_price: row.remaining_stock_price == null ? null : Number(row.remaining_stock_price),
    amount: Number(row.amount ?? 0),
    status: String(row.status ?? "pending"),
    notes: row.notes ?? null,
    created_by_name: row.created_by_name ?? null,
    created_by_role: row.created_by_role ?? null,
    created_at: String(row.created_at)
  }));
});
const listSupplierBillStockOptionsServer_createServerFn_handler = createServerRpc({
  id: "4808e1fff4e219310584aae57903bf1418330c51898bbc00abd2e486129c2523",
  name: "listSupplierBillStockOptionsServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => listSupplierBillStockOptionsServer.__executeServer(opts));
const listSupplierBillStockOptionsServer = createServerFn({
  method: "POST"
}).handler(listSupplierBillStockOptionsServer_createServerFn_handler, async ({
  data
}) => {
  const input = data ?? {};
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await ensureOperationsTables();
  const supplierId = String(input.supplier_id ?? "").trim();
  if (!supplierId) return [];
  const rows = await sql`
    select
      r.id as stock_intake_id,
      r.product_id,
      p.title as product_title,
      r.stock_price as set_price,
      r.supplier_id,
      s.name as supplier_name,
      r.serial_code,
      r.stock_price as remaining_stock_price,
      r.received_at
    from stock_intake_records r
    left join products p on p.id = r.product_id
    left join suppliers s on s.id = r.supplier_id
    where r.supplier_id = ${supplierId}
      and r.deleted_at is null
      and (r.stock_price is null or r.stock_price > 0)
      and not exists (
        select 1
        from stock_return_records sr
        where sr.serial_code = r.serial_code
          and sr.status = 'completed'
      )
    order by p.title asc, r.serial_code asc
    limit 1000
  `;
  return rows.map((row) => ({
    stock_intake_id: String(row.stock_intake_id),
    product_id: String(row.product_id),
    product_title: row.product_title ? String(row.product_title) : "Product",
    supplier_id: row.supplier_id ? String(row.supplier_id) : null,
    supplier_name: row.supplier_name ? String(row.supplier_name) : null,
    serial_code: String(row.serial_code ?? ""),
    set_price: row.set_price == null ? null : Number(row.set_price),
    remaining_stock_price: row.remaining_stock_price == null ? null : Number(row.remaining_stock_price),
    received_at: String(row.received_at)
  }));
});
const listSupplierFinanceRecordsServer_createServerFn_handler = createServerRpc({
  id: "aff9461e65d90734eeb8667f27b59dacabaf71860f9ee4cded97dde1e77d2a8f",
  name: "listSupplierFinanceRecordsServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => listSupplierFinanceRecordsServer.__executeServer(opts));
const listSupplierFinanceRecordsServer = createServerFn({
  method: "POST"
}).handler(listSupplierFinanceRecordsServer_createServerFn_handler, async ({
  data
}) => {
  const input = data ?? {};
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await ensureOperationsTables();
  const supplierId = String(input.supplier_id ?? "").trim();
  const supplierFilter = supplierId || null;
  const startDate = resolveFinancePeriodStart(input.period ?? "month");
  const rows = await sql`
    with sold_serials as (
      select distinct
        item ->> 'serial_number' as serial_code,
        item ->> 'id' as product_id
      from orders o
      cross join lateral jsonb_array_elements(o.items) as item
      where coalesce(item ->> 'serial_number', '') <> ''
        and o.status <> 'cancelled'
    ),
    returned_serials as (
      select distinct serial_code
      from stock_return_records
      where status = 'completed'
    ),
    takeout_serials as (
      select distinct product_id, serial_code
      from stock_takeout_records
      where returned_at is null
    ),
    allocation_agg as (
      select
        a.stock_intake_id,
        sum(a.amount)::numeric(12,2) as amount_paid,
        max(a.created_at) as last_payment_date
      from supplier_bill_serial_payments a
      group by a.stock_intake_id
    ),
    fallback_bill_agg as (
      select
        b.stock_intake_id,
        sum(b.amount)::numeric(12,2) as amount_paid,
        max(b.bill_date) as last_payment_date
      from supplier_bills b
      where b.stock_intake_id is not null
        and not exists (
          select 1
          from supplier_bill_serial_payments a
          where a.bill_id = b.id
        )
      group by b.stock_intake_id
    ),
    payment_agg as (
      select stock_intake_id, sum(amount_paid)::numeric(12,2) as amount_paid, max(last_payment_date) as last_payment_date
      from (
        select * from allocation_agg
        union all
        select * from fallback_bill_agg
      ) payments
      group by stock_intake_id
    )
    select
      r.id as stock_intake_id,
      r.supplier_id,
      s.name as supplier_name,
      r.product_id,
      p.title as product_title,
      r.serial_code,
      r.received_at,
      r.stock_price,
      coalesce(pa.amount_paid, 0) as amount_paid,
      pa.last_payment_date,
      coalesce(ph.payment_history, '[]'::jsonb) as payment_history,
      case
        when ss.serial_code is not null then 'sold'
        when rs.serial_code is not null then 'returned'
        when ts.serial_code is not null then 'takeout'
        else 'in_stock'
      end as inventory_status
    from stock_intake_records r
    left join products p on p.id = r.product_id
    left join suppliers s on s.id = r.supplier_id
    left join sold_serials ss on ss.serial_code = r.serial_code and ss.product_id = r.product_id::text
    left join returned_serials rs on rs.serial_code = r.serial_code
    left join takeout_serials ts on ts.serial_code = r.serial_code and ts.product_id = r.product_id
    left join payment_agg pa on pa.stock_intake_id = r.id
    left join lateral (
      select coalesce(
        jsonb_agg(
          jsonb_build_object(
            'id', entry.id,
            'bill_number', entry.bill_number,
            'bill_date', entry.bill_date,
            'amount', entry.amount,
            'balance_before', entry.balance_before,
            'balance_after', entry.balance_after,
            'created_at', entry.created_at,
            'recorded_by', entry.recorded_by,
            'notes', entry.notes
          )
          order by entry.payment_date desc, entry.created_at desc
        ),
        '[]'::jsonb
      ) as payment_history
      from (
        select
          a.id,
          b.bill_number,
          b.bill_date,
          a.amount,
          a.balance_before,
          a.balance_after,
          a.created_at,
          coalesce(a.created_at::date, b.bill_date) as payment_date,
          b.created_by_name as recorded_by,
          b.notes
        from supplier_bill_serial_payments a
        left join supplier_bills b on b.id = a.bill_id
        where a.stock_intake_id = r.id

        union all

        select
          b.id,
          b.bill_number,
          b.bill_date,
          b.amount,
          b.opening_stock_price as balance_before,
          b.remaining_stock_price as balance_after,
          b.created_at,
          coalesce(b.bill_date, b.created_at::date) as payment_date,
          b.created_by_name as recorded_by,
          b.notes
        from supplier_bills b
        where b.stock_intake_id = r.id
          and not exists (
            select 1
            from supplier_bill_serial_payments a
            where a.bill_id = b.id
          )
      ) entry
    ) ph on true
    where r.deleted_at is null
      and (${supplierFilter}::uuid is null or r.supplier_id = ${supplierFilter}::uuid)
      and (${startDate}::date is null or r.received_at >= ${startDate}::date)
    order by p.title asc, r.serial_code asc
  `;
  const records = rows.map((row) => {
    const amountPaid = Number(row.amount_paid ?? 0);
    const amountRemaining = row.stock_price == null ? null : Number(row.stock_price);
    const inventoryStatus = String(row.inventory_status ?? "in_stock");
    const rawPaymentHistory = Array.isArray(row.payment_history) ? row.payment_history : typeof row.payment_history === "string" ? JSON.parse(row.payment_history) : [];
    const status = inventoryStatus === "returned" ? "invalid" : amountRemaining != null && amountRemaining <= 0 && amountPaid > 0 ? "paid" : amountPaid > 0 ? "partial" : "unpaid";
    return {
      stock_intake_id: String(row.stock_intake_id),
      supplier_id: row.supplier_id ? String(row.supplier_id) : null,
      supplier_name: row.supplier_name ? String(row.supplier_name) : null,
      product_id: row.product_id ? String(row.product_id) : null,
      product_title: String(row.product_title ?? "Product"),
      serial_code: String(row.serial_code ?? ""),
      received_at: String(row.received_at),
      inventory_status: inventoryStatus,
      products_in_stock: inventoryStatus === "in_stock" ? 1 : 0,
      amount_paid: amountPaid,
      amount_remaining: amountRemaining,
      last_payment_date: row.last_payment_date ? String(row.last_payment_date) : null,
      payment_history: rawPaymentHistory.map((payment) => ({
        id: String(payment.id),
        bill_number: payment.bill_number ? String(payment.bill_number) : null,
        bill_date: payment.bill_date ? String(payment.bill_date) : null,
        amount: Number(payment.amount ?? 0),
        balance_before: payment.balance_before == null ? null : Number(payment.balance_before),
        balance_after: payment.balance_after == null ? null : Number(payment.balance_after),
        created_at: payment.created_at ? String(payment.created_at) : null,
        recorded_by: payment.recorded_by ? String(payment.recorded_by) : null,
        notes: payment.notes ? String(payment.notes) : null
      })),
      status
    };
  });
  return {
    summary: {
      products_in_stock: records.reduce((total, row) => total + row.products_in_stock, 0),
      amount_paid: records.reduce((total, row) => total + row.amount_paid, 0),
      amount_remaining: records.reduce((total, row) => total + Number(row.amount_remaining ?? 0), 0),
      paid_products: records.filter((row) => row.status === "paid").length,
      unpaid_products: records.filter((row) => row.status === "unpaid").length
    },
    records
  };
});
function resolveFinancePeriodStart(period) {
  if (!period || period === "all") return null;
  const now = /* @__PURE__ */ new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (period === "month") {
    start.setDate(1);
    return start.toISOString().slice(0, 10);
  }
  const days = Number(period);
  if (!Number.isFinite(days) || days <= 0) return null;
  start.setDate(start.getDate() - (days - 1));
  return start.toISOString().slice(0, 10);
}
const upsertSupplierBillServer_createServerFn_handler = createServerRpc({
  id: "9c8df41c5ba113082c1b26b8edb5b4d2ebf445d7411f13535dbea23fee78197a",
  name: "upsertSupplierBillServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => upsertSupplierBillServer.__executeServer(opts));
const upsertSupplierBillServer = createServerFn({
  method: "POST"
}).handler(upsertSupplierBillServer_createServerFn_handler, async ({
  data
}) => {
  const input = data;
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await ensureOperationsTables();
  if (input.id) {
    await sql`
      update supplier_bills
      set
        supplier_id = ${input.supplier_id},
        product_id = ${input.product_id ?? null},
        stock_intake_id = ${input.stock_intake_id ?? null},
        serial_code = ${input.serial_code ?? null},
        bill_number = ${input.bill_number},
        bill_date = ${input.bill_date},
        due_date = ${input.due_date ?? null},
        amount = ${input.amount},
        status = ${input.status},
        notes = ${input.notes ?? null},
        created_by_email = ${input.actor.email},
        created_by_name = ${input.actor.name},
        created_by_role = ${input.actor.role},
        updated_at = now()
      where id = ${input.id}
    `;
    await logActivity({
      actor: input.actor,
      action: "updated",
      entityType: "supplier_bill",
      entityId: input.id,
      entityLabel: input.bill_number,
      details: {
        amount: input.amount,
        status: input.status
      }
    });
    return {
      ok: true
    };
  }
  const year = new Date(input.bill_date).getFullYear();
  const [{
    count
  }] = await sql`
    select count(*)::int as count
    from supplier_bills
    where extract(year from bill_date) = ${year}
  `;
  const nextNumber = Number(count ?? 0) + 1;
  const billNumber = String(input.bill_number ?? "").trim() || `BILL-${year}-${String(nextNumber).padStart(3, "0")}`;
  const stockIntakeIds = Array.from(new Set([...input.stock_intake_ids ?? [], input.stock_intake_id].map((id) => String(id ?? "").trim()).filter(Boolean)));
  const paidAmount = Math.max(0, Number(input.amount) || 0);
  let linkedProductId = input.product_id ?? null;
  let linkedSerialCode = input.serial_code ?? null;
  let openingStockPrice = null;
  let remainingStockPrice = null;
  let billStatus = input.status;
  const paymentAllocations = [];
  if (stockIntakeIds.length > 0) {
    const stockRows = await sql`
      select
        r.id,
        r.product_id,
        r.supplier_id,
        r.serial_code,
        r.stock_price,
        exists (
          select 1
          from stock_return_records sr
          where sr.serial_code = r.serial_code
            and sr.status = 'completed'
        ) as is_returned
      from stock_intake_records r
      left join products p on p.id = r.product_id
      where r.id = any(${stockIntakeIds}::uuid[])
        and r.deleted_at is null
      order by r.serial_code asc
    `;
    if (stockRows.length !== stockIntakeIds.length) {
      throw new Error("Selected serial number was not found.");
    }
    const wrongSupplier = stockRows.find((row) => String(row.supplier_id ?? "") !== String(input.supplier_id ?? ""));
    if (wrongSupplier) {
      throw new Error("One selected serial number does not belong to this supplier.");
    }
    const selectedProductId = String(input.product_id ?? "").trim();
    if (selectedProductId) {
      const wrongProduct = stockRows.find((row) => String(row.product_id ?? "") !== selectedProductId);
      if (wrongProduct) {
        throw new Error("One selected serial number does not belong to this product.");
      }
    }
    const returnedStock = stockRows.find((row) => Boolean(row.is_returned));
    if (returnedStock) {
      throw new Error(`Cannot pay for returned product serial ${String(returnedStock.serial_code ?? "")}.`);
    }
    const missingPrice = stockRows.find((row) => row.stock_price == null);
    if (missingPrice) {
      throw new Error(`Set price is required for serial ${String(missingPrice.serial_code ?? "")}.`);
    }
    openingStockPrice = stockRows.reduce((total, row) => total + Number(row.stock_price ?? 0), 0);
    if (paidAmount <= 0) {
      throw new Error("Amount paid must be greater than zero.");
    }
    if (paidAmount > openingStockPrice) {
      throw new Error("Amount paid cannot exceed the selected serial set price.");
    }
    let remainingPayment = paidAmount;
    let totalRemainingAfterPayment = 0;
    for (const stockRecord of stockRows) {
      const currentBalance = Number(stockRecord.stock_price ?? 0);
      const appliedAmount = Math.min(currentBalance, remainingPayment);
      const nextBalance = Math.max(0, currentBalance - appliedAmount);
      remainingPayment = Math.max(0, remainingPayment - appliedAmount);
      totalRemainingAfterPayment += nextBalance;
      paymentAllocations.push({
        stock_intake_id: String(stockRecord.id),
        product_id: String(stockRecord.product_id),
        serial_code: String(stockRecord.serial_code ?? ""),
        amount: appliedAmount,
        balance_before: currentBalance,
        balance_after: nextBalance
      });
      await sql`
        update stock_intake_records
        set stock_price = ${nextBalance}, updated_at = now()
        where id = ${String(stockRecord.id)}
      `;
    }
    remainingStockPrice = totalRemainingAfterPayment;
    billStatus = remainingStockPrice <= 0 ? "paid" : "part_paid";
    linkedProductId = selectedProductId || String(stockRows[0]?.product_id ?? "");
    linkedSerialCode = stockRows.map((row) => String(row.serial_code ?? "")).filter(Boolean).join(", ");
  }
  const [createdBill] = await sql`
    insert into supplier_bills (
      supplier_id, product_id, stock_intake_id, serial_code, bill_number, bill_date, due_date,
      opening_stock_price, remaining_stock_price, amount, status, notes,
      created_by_email, created_by_name, created_by_role
    )
    values (
      ${input.supplier_id},
      ${linkedProductId},
      ${stockIntakeIds.length === 1 ? stockIntakeIds[0] : null},
      ${linkedSerialCode},
      ${billNumber},
      ${input.bill_date},
      ${input.due_date ?? null},
      ${openingStockPrice},
      ${remainingStockPrice},
      ${paidAmount},
      ${billStatus},
      ${input.notes ?? null},
      ${input.actor.email},
      ${input.actor.name},
      ${input.actor.role}
    )
    returning id
  `;
  const createdBillId = createdBill?.id ? String(createdBill.id) : null;
  if (createdBillId) {
    for (const allocation of paymentAllocations) {
      if (allocation.amount <= 0) continue;
      await sql`
        insert into supplier_bill_serial_payments (
          bill_id, supplier_id, product_id, stock_intake_id, serial_code, amount, balance_before, balance_after
        )
        values (
          ${createdBillId},
          ${input.supplier_id},
          ${allocation.product_id},
          ${allocation.stock_intake_id},
          ${allocation.serial_code},
          ${allocation.amount},
          ${allocation.balance_before},
          ${allocation.balance_after}
        )
      `;
    }
  }
  await logActivity({
    actor: input.actor,
    action: "created",
    entityType: "supplier_bill",
    entityLabel: billNumber,
    details: {
      amount: paidAmount,
      status: billStatus,
      product_id: linkedProductId,
      serial_code: linkedSerialCode,
      opening_stock_price: openingStockPrice,
      remaining_stock_price: remainingStockPrice
    }
  });
  return {
    ok: true,
    bill_number: billNumber
  };
});
const listInventoryRecordsServer_createServerFn_handler = createServerRpc({
  id: "609bcbee46fb6275a2e90408476d70fe94f78b2f345414a077dcd211c16f05a0",
  name: "listInventoryRecordsServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => listInventoryRecordsServer.__executeServer(opts));
const listInventoryRecordsServer = createServerFn({
  method: "POST"
}).handler(listInventoryRecordsServer_createServerFn_handler, async () => {
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await ensureOperationsTables();
  await syncStockProductsIntoInventoryProducts(sql);
  const [summaryRow] = await sql`
    select
      (select count(*)::int from stock_intake_records where deleted_at is null) as total_intake_records,
      (select count(*)::int from stock_return_records) as total_return_records,
      (select count(*)::int from stock_count_records where count_date = current_date) as today_stock_counts
  `;
  const intakeRows = await sql`
      select
      r.*,
      p.title as product_title,
      s.name as supplier_name
    from stock_intake_records r
    left join products p on p.id = r.product_id
    left join suppliers s on s.id = r.supplier_id
    where r.deleted_at is null
    order by r.received_at desc, r.created_at desc
    limit 30
  `;
  const returnRows = await sql`
    select
      r.*,
      p.title as product_title,
      s.name as supplier_name
    from stock_return_records r
    left join products p on p.id = r.product_id
    left join suppliers s on s.id = r.supplier_id
    order by r.return_date desc, r.created_at desc
    limit 20
  `;
  const takeoutRows = await sql`
    select
      r.*,
      p.title as product_title,
      p.price as product_price,
      rs.name as reseller_name,
      exists (
        select 1
        from orders o
        cross join lateral jsonb_array_elements(o.items) as item
        where coalesce(item ->> 'serial_number', '') = r.serial_code
          and coalesce(item ->> 'id', '') = r.product_id::text
          and o.status <> 'cancelled'
      ) as is_sold
    from stock_takeout_records r
    left join products p on p.id = r.product_id
    left join resellers rs on rs.id = r.reseller_id
    order by r.takeout_date desc, r.created_at desc
    limit 50
  `;
  const countRows = await sql`
    select
      c.*,
      p.title as product_title
    from stock_count_records c
    left join products p on p.id = c.product_id
    order by c.count_date desc, c.created_at desc
    limit 20
  `;
  const stockStatusRows = await sql`
    with sold_serials as (
      select distinct
        item ->> 'serial_number' as serial_code,
        item ->> 'id' as product_id,
        o.id as order_id,
        o.created_at as sold_at
      from orders o
      cross join lateral jsonb_array_elements(o.items) as item
      where coalesce(item ->> 'serial_number', '') <> ''
        and o.status <> 'cancelled'
    ),
    returned_serials as (
      select distinct serial_code
      from stock_return_records
      where status = 'completed'
    ),
    takeout_serials as (
      select distinct
        product_id,
        serial_code,
        reseller_id,
        takeout_date
      from stock_takeout_records
      where returned_at is null
    )
    select
      r.id,
      r.product_id,
      p.title as product_title,
      r.supplier_id,
      s.name as supplier_name,
      r.serial_code,
      r.received_at,
      r.stock_status,
      r.deleted_at,
      r.deleted_by_name,
      ss.order_id,
      ss.sold_at,
      ts.reseller_id as takeout_reseller_id,
      rs2.name as takeout_reseller_name,
      ts.takeout_date,
      case
        when r.deleted_at is not null then 'deleted'
        when ss.serial_code is not null then 'sold'
        when rs.serial_code is not null then 'returned'
        when ts.serial_code is not null then 'takeout'
        else 'in_stock'
      end as availability_status
    from stock_intake_records r
    left join products p on p.id = r.product_id
    left join suppliers s on s.id = r.supplier_id
    left join sold_serials ss on ss.serial_code = r.serial_code and ss.product_id = r.product_id::text
    left join returned_serials rs on rs.serial_code = r.serial_code
    left join takeout_serials ts on ts.serial_code = r.serial_code and ts.product_id = r.product_id
    left join resellers rs2 on rs2.id = ts.reseller_id
    order by r.received_at desc, r.created_at desc
    limit 1000
  `;
  return {
    summary: {
      totalIntakeRecords: Number(summaryRow?.total_intake_records ?? 0),
      totalReturnRecords: Number(summaryRow?.total_return_records ?? 0),
      todayStockCounts: Number(summaryRow?.today_stock_counts ?? 0)
    },
    intake: intakeRows.map((row) => ({
      id: String(row.id),
      product_id: String(row.product_id),
      product_title: row.product_title ? String(row.product_title) : "Product",
      supplier_id: row.supplier_id ? String(row.supplier_id) : null,
      supplier_name: row.supplier_name ? String(row.supplier_name) : null,
      serial_code: String(row.serial_code ?? ""),
      quantity: Number(row.quantity ?? 0),
      unit_cost: row.unit_cost == null ? null : Number(row.unit_cost),
      stock_price: row.stock_price == null ? null : Number(row.stock_price),
      due_date: row.due_date ? String(row.due_date) : null,
      received_at: String(row.received_at),
      stock_status: String(row.stock_status ?? "in_stock"),
      notes: row.notes ?? null,
      created_by_name: row.created_by_name ?? null,
      created_by_role: row.created_by_role ?? null,
      created_at: String(row.created_at)
    })),
    returns: returnRows.map((row) => ({
      id: String(row.id),
      product_id: String(row.product_id),
      product_title: row.product_title ? String(row.product_title) : "Product",
      supplier_id: row.supplier_id ? String(row.supplier_id) : null,
      supplier_name: row.supplier_name ? String(row.supplier_name) : null,
      serial_code: String(row.serial_code ?? ""),
      quantity: Number(row.quantity ?? 0),
      return_date: String(row.return_date),
      reason: String(row.reason ?? ""),
      status: String(row.status ?? "pending"),
      notes: row.notes ?? null,
      created_by_name: row.created_by_name ?? null,
      returned_at: row.returned_at ? String(row.returned_at) : null,
      return_notes: row.return_notes ?? null,
      returned_by_name: row.returned_by_name ?? null,
      is_sold: Boolean(row.is_sold),
      created_at: String(row.created_at)
    })),
    takeouts: takeoutRows.map((row) => ({
      id: String(row.id),
      product_id: String(row.product_id),
      product_title: row.product_title ? String(row.product_title) : "Product",
      product_price: row.product_price == null ? null : Number(row.product_price),
      reseller_id: row.reseller_id ? String(row.reseller_id) : null,
      reseller_name: row.reseller_name ? String(row.reseller_name) : null,
      serial_code: String(row.serial_code ?? ""),
      quantity: Number(row.quantity ?? 0),
      takeout_date: String(row.takeout_date),
      notes: row.notes ?? null,
      created_by_name: row.created_by_name ?? null,
      created_at: String(row.created_at)
    })),
    counts: countRows.map((row) => ({
      id: String(row.id),
      product_id: String(row.product_id),
      product_title: row.product_title ? String(row.product_title) : "Product",
      count_date: String(row.count_date),
      counted_quantity: Number(row.counted_quantity ?? 0),
      notes: row.notes ?? null,
      created_by_name: row.created_by_name ?? null,
      created_at: String(row.created_at)
    })),
    stock: stockStatusRows.map((row) => ({
      id: String(row.id),
      product_id: String(row.product_id),
      product_title: row.product_title ? String(row.product_title) : "Product",
      supplier_id: row.supplier_id ? String(row.supplier_id) : null,
      supplier_name: row.supplier_name ? String(row.supplier_name) : null,
      serial_code: String(row.serial_code ?? ""),
      received_at: String(row.received_at),
      stock_status: String(row.stock_status ?? "in_stock"),
      availability_status: String(row.availability_status ?? "in_stock"),
      deleted_at: row.deleted_at ? String(row.deleted_at) : null,
      deleted_by_name: row.deleted_by_name ? String(row.deleted_by_name) : null,
      order_id: row.order_id ? String(row.order_id) : null,
      sold_at: row.sold_at ? String(row.sold_at) : null,
      takeout_reseller_id: row.takeout_reseller_id ? String(row.takeout_reseller_id) : null,
      takeout_reseller_name: row.takeout_reseller_name ? String(row.takeout_reseller_name) : null,
      takeout_date: row.takeout_date ? String(row.takeout_date) : null
    }))
  };
});
const exportInventoryRecordsServer_createServerFn_handler = createServerRpc({
  id: "da0eb663a1343a0abe68a72607fcfc9dcf89983239ffd87c3e95042395595d48",
  name: "exportInventoryRecordsServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => exportInventoryRecordsServer.__executeServer(opts));
const exportInventoryRecordsServer = createServerFn({
  method: "POST"
}).handler(exportInventoryRecordsServer_createServerFn_handler, async ({
  data
}) => {
  const input = data;
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await ensureOperationsTables();
  const supplierId = String(input.supplier_id ?? "").trim();
  const days = Number(input.days);
  if (!supplierId) {
    throw new Error("Supplier is required");
  }
  if (![7, 30, 90].includes(days)) {
    throw new Error("Export range must be 7, 30, or 90 days");
  }
  const rows = await sql`
    select
      r.id,
      p.title as product_title,
      s.name as supplier_name,
      r.serial_code,
      r.quantity,
      r.stock_price,
      r.due_date,
      r.received_at,
      r.stock_status,
      r.notes,
      r.created_by_name
    from stock_intake_records r
    left join products p on p.id = r.product_id
    left join suppliers s on s.id = r.supplier_id
    where r.supplier_id = ${supplierId}
      and r.deleted_at is null
      and r.received_at >= current_date - (${days - 1}) * interval '1 day'
    order by r.received_at desc, r.created_at desc
  `;
  return rows.map((row) => ({
    id: String(row.id),
    product_title: row.product_title ? String(row.product_title) : "Product",
    supplier_name: row.supplier_name ? String(row.supplier_name) : "",
    serial_code: String(row.serial_code ?? ""),
    quantity: Number(row.quantity ?? 0),
    stock_price: row.stock_price == null ? null : Number(row.stock_price),
    due_date: row.due_date ? String(row.due_date) : null,
    received_at: String(row.received_at),
    stock_status: String(row.stock_status ?? "in_stock"),
    notes: row.notes == null ? "" : String(row.notes),
    created_by_name: row.created_by_name == null ? "" : String(row.created_by_name)
  }));
});
const upsertStockIntakeServer_createServerFn_handler = createServerRpc({
  id: "c1c1eb6ffecf9d3b97775164cde2438fd4c7f0bcdbc289c6be1eef5931f2e954",
  name: "upsertStockIntakeServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => upsertStockIntakeServer.__executeServer(opts));
const upsertStockIntakeServer = createServerFn({
  method: "POST"
}).handler(upsertStockIntakeServer_createServerFn_handler, async ({
  data
}) => {
  const input = data;
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await ensureOperationsTables();
  const normalizedSerialCode = String(input.serial_code ?? "").trim();
  if (!normalizedSerialCode) {
    throw new Error("Serial code is required.");
  }
  if (input.id) {
    const [duplicate2] = await sql`
      select serial_code
      from stock_intake_records
      where lower(serial_code) = lower(${normalizedSerialCode})
        and id <> ${input.id}
      limit 1
    `;
    if (duplicate2) {
      throw new Error(`Serial number ${normalizedSerialCode} already exists.`);
    }
    await sql`
      update stock_intake_records
      set
        product_id = ${input.product_id},
        supplier_id = ${input.supplier_id ?? null},
        serial_code = ${normalizedSerialCode},
        quantity = ${input.quantity},
        unit_cost = ${input.unit_cost ?? null},
        stock_price = ${input.stock_price ?? null},
        due_date = ${input.due_date ?? null},
        received_at = ${input.received_at},
        stock_status = ${input.stock_status},
        notes = ${input.notes ?? null},
        created_by_email = ${input.actor.email},
        created_by_name = ${input.actor.name},
        created_by_role = ${input.actor.role},
        updated_at = now()
      where id = ${input.id}
    `;
    await sql`update products set stock_status = ${input.stock_status}, updated_at = now() where id = ${input.product_id}`;
    await logActivity({
      actor: input.actor,
      action: "updated",
      entityType: "stock_intake",
      entityId: input.id,
      entityLabel: normalizedSerialCode,
      details: {
        quantity: input.quantity,
        stock_status: input.stock_status,
        stock_price: input.stock_price ?? null,
        due_date: input.due_date ?? null
      }
    });
    return {
      ok: true
    };
  }
  const [duplicate] = await sql`
    select serial_code
    from stock_intake_records
    where lower(serial_code) = lower(${normalizedSerialCode})
    limit 1
  `;
  if (duplicate) {
    throw new Error(`Serial number ${normalizedSerialCode} already exists.`);
  }
  await sql`
    insert into stock_intake_records (
      product_id, supplier_id, serial_code, quantity, unit_cost, stock_price, due_date, received_at, stock_status, notes,
      created_by_email, created_by_name, created_by_role
    )
    values (
      ${input.product_id},
      ${input.supplier_id ?? null},
      ${normalizedSerialCode},
      ${input.quantity},
      ${input.unit_cost ?? null},
      ${input.stock_price ?? null},
      ${input.due_date ?? null},
      ${input.received_at},
      ${input.stock_status},
      ${input.notes ?? null},
      ${input.actor.email},
      ${input.actor.name},
      ${input.actor.role}
    )
  `;
  await sql`update products set stock_status = ${input.stock_status}, updated_at = now() where id = ${input.product_id}`;
  await logActivity({
    actor: input.actor,
    action: "created",
    entityType: "stock_intake",
    entityLabel: normalizedSerialCode,
    details: {
      quantity: input.quantity,
      stock_status: input.stock_status,
      stock_price: input.stock_price ?? null,
      due_date: input.due_date ?? null
    }
  });
  return {
    ok: true
  };
});
const updateStockIntakeMetaServer_createServerFn_handler = createServerRpc({
  id: "ffc34b9508ad6ceae46127cacf4eefa09e162dabcc0268561855932d6e58c954",
  name: "updateStockIntakeMetaServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => updateStockIntakeMetaServer.__executeServer(opts));
const updateStockIntakeMetaServer = createServerFn({
  method: "POST"
}).handler(updateStockIntakeMetaServer_createServerFn_handler, async ({
  data
}) => {
  const input = data;
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await ensureOperationsTables();
  const ids = Array.from(new Set((input.ids ?? []).map((id) => String(id)).filter(Boolean)));
  if (ids.length === 0) {
    throw new Error("No stock intake records selected");
  }
  if (input.stock_price !== void 0 && input.actor.role !== "super_admin") {
    throw new Error("Only super admin can set prices.");
  }
  for (const id of ids) {
    await sql`
      update stock_intake_records
      set
        stock_price = ${input.stock_price ?? null},
        due_date = ${input.due_date ?? null},
        created_by_email = ${input.actor.email},
        created_by_name = ${input.actor.name},
        created_by_role = ${input.actor.role},
        updated_at = now()
      where id = ${id}
    `;
  }
  await logActivity({
    actor: input.actor,
    action: "updated",
    entityType: "stock_intake",
    entityLabel: `${ids.length} bundled stock intake record(s)`,
    details: {
      ids,
      stock_price: input.stock_price ?? null,
      due_date: input.due_date ?? null
    }
  });
  return {
    ok: true,
    count: ids.length
  };
});
const deleteStockIntakeServer_createServerFn_handler = createServerRpc({
  id: "41631b48ff1aa46466dbc64ac962de62cd77528843ffc7acf2d58c31a7b99e7a",
  name: "deleteStockIntakeServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => deleteStockIntakeServer.__executeServer(opts));
const deleteStockIntakeServer = createServerFn({
  method: "POST"
}).handler(deleteStockIntakeServer_createServerFn_handler, async ({
  data
}) => {
  const input = data;
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await ensureOperationsTables();
  if (input.actor.role !== "super_admin") {
    throw new Error("Only super admin can delete inventory products.");
  }
  const [record] = await sql`
    with sold_serials as (
      select distinct
        item ->> 'serial_number' as serial_code,
        item ->> 'id' as product_id
      from orders o
      cross join lateral jsonb_array_elements(coalesce(o.items, '[]'::jsonb)) item
      where coalesce(item ->> 'serial_number', '') <> ''
        and o.status <> 'cancelled'
    ),
    returned_serials as (
      select distinct serial_code
      from stock_return_records
      where status = 'completed'
    ),
    takeout_serials as (
      select distinct product_id, serial_code
      from stock_takeout_records
      where returned_at is null
    )
    select
      r.id,
      r.product_id,
      p.title as product_title,
      r.serial_code,
      case
        when r.deleted_at is not null then 'deleted'
        when ss.serial_code is not null then 'sold'
        when rs.serial_code is not null then 'returned'
        when ts.serial_code is not null then 'takeout'
        else 'in_stock'
      end as availability_status
    from stock_intake_records r
    left join products p on p.id = r.product_id
    left join sold_serials ss on ss.serial_code = r.serial_code and ss.product_id = r.product_id::text
    left join returned_serials rs on rs.serial_code = r.serial_code
    left join takeout_serials ts on ts.serial_code = r.serial_code and ts.product_id = r.product_id
    where r.id = ${input.id}
    limit 1
  `;
  if (!record) {
    throw new Error("Inventory product was not found.");
  }
  const availabilityStatus = String(record.availability_status ?? "in_stock");
  if (availabilityStatus !== "in_stock") {
    throw new Error("Only products that are still in stock can be deleted.");
  }
  await sql`
    update stock_intake_records
    set
      stock_status = 'deleted',
      deleted_at = now(),
      deleted_by_email = ${input.actor.email},
      deleted_by_name = ${input.actor.name},
      deleted_by_role = ${input.actor.role},
      updated_at = now()
    where id = ${input.id}
  `;
  await logActivity({
    actor: input.actor,
    action: "deleted",
    entityType: "stock_intake",
    entityId: input.id,
    entityLabel: String(record.serial_code ?? ""),
    details: {
      product_id: String(record.product_id ?? ""),
      product_title: String(record.product_title ?? "Product"),
      serial_code: String(record.serial_code ?? "")
    }
  });
  return {
    ok: true
  };
});
function slugifyInventoryProductName(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "inventory-product";
}
function buildCatalogueProductName(title, specs) {
  const specValues = Object.values(specs).map((value) => String(value ?? "").trim()).filter(Boolean);
  return [String(title ?? "").trim(), ...specValues].filter(Boolean).join(" ").replace(/\s+/g, " ");
}
async function resolveInventoryProductId(input) {
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  const selectedProductId = String(input.product_id ?? "").trim();
  if (selectedProductId) return selectedProductId;
  const selectedCatalogueId = String(input.catalogue_id ?? "").trim();
  if (selectedCatalogueId) {
    const [catalogueItem] = await sql`
      select id, title, item, specs, product_name
      from product_catalogue
      where id = ${selectedCatalogueId}
      limit 1
    `;
    if (!catalogueItem) {
      throw new Error("Catalogue item was not found.");
    }
    const productName2 = String(catalogueItem.product_name ?? "").trim();
    const [existingLinkedProduct] = await sql`
      select id
      from products
      where (catalogue_id = ${selectedCatalogueId} or lower(title) = lower(${productName2}))
        and coalesce(product_origin, 'website') = 'inventory'
      order by created_at desc
      limit 1
    `;
    if (existingLinkedProduct?.id) {
      await sql`
        update products
        set catalogue_id = ${selectedCatalogueId}, updated_at = now()
        where id = ${String(existingLinkedProduct.id)}
      `;
      return String(existingLinkedProduct.id);
    }
    const baseSlug2 = `inventory-${slugifyInventoryProductName(productName2)}`;
    let slug2 = baseSlug2;
    let suffix2 = 2;
    while (true) {
      const [existingSlug] = await sql`select id from products where slug = ${slug2} limit 1`;
      if (!existingSlug) break;
      slug2 = `${baseSlug2}-${suffix2}`;
      suffix2 += 1;
    }
    const [createdProduct2] = await sql`
      insert into products (
        title, slug, description, price, old_price, stock_status,
        category_id, images, specs, featured, is_hidden, badge, warranty, brand, subcategory, catalogue_id, product_origin
      )
      values (
        ${productName2},
        ${slug2},
        ${"Inventory-only product created from catalogue stock intake"},
        0,
        null,
        ${input.stock_status},
        null,
        ${[]}::text[],
        ${JSON.stringify(normalizeSpecsRecord(catalogueItem.specs))}::jsonb,
        false,
        true,
        null,
        null,
        ${String(catalogueItem.title ?? "") || null},
        ${String(catalogueItem.item ?? "") || null},
        ${selectedCatalogueId},
        ${"inventory"}
      )
      returning id
    `;
    return String(createdProduct2.id);
  }
  const productName = String(input.product_name ?? "").trim();
  if (!productName) {
    throw new Error("Enter a product name.");
  }
  const [existingProduct] = await sql`
    select id
    from products
    where lower(title) = lower(${productName})
      and coalesce(product_origin, 'website') = 'inventory'
    order by created_at desc
    limit 1
  `;
  if (existingProduct?.id) {
    return String(existingProduct.id);
  }
  const baseSlug = `inventory-${slugifyInventoryProductName(productName)}`;
  let slug = baseSlug;
  let suffix = 2;
  while (true) {
    const [existingSlug] = await sql`select id from products where slug = ${slug} limit 1`;
    if (!existingSlug) break;
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
  const [createdProduct] = await sql`
    insert into products (
      title, slug, description, price, old_price, stock_status,
      category_id, images, specs, featured, is_hidden, badge, warranty, brand, subcategory, product_origin
    )
    values (
      ${productName},
      ${slug},
      ${"Inventory-only product created from stock intake"},
      0,
      null,
      ${input.stock_status},
      null,
      ${[]}::text[],
      ${JSON.stringify({
    Source: "Stock intake"
  })}::jsonb,
      false,
      true,
      null,
      null,
      null,
      null,
      ${"inventory"}
    )
    returning id
  `;
  return String(createdProduct.id);
}
async function sendSuperAdminPushAlerts(input) {
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  try {
    const pushRows = await sql`
      select endpoint, p256dh, auth
      from push_subscriptions
      where admin_role = 'super_admin'
      order by updated_at desc
    `;
    if (pushRows.length === 0) return;
    const {
      sendWebPushNotification
    } = await import("./web-push.server-Hx0pP6te.js");
    const pushResults = await Promise.all(pushRows.map((row) => sendWebPushNotification({
      subscription: {
        endpoint: String(row.endpoint ?? ""),
        p256dh: String(row.p256dh ?? ""),
        auth: String(row.auth ?? "")
      },
      message: {
        title: input.title,
        body: input.body,
        url: input.url ?? "/admin/notifications",
        tag: input.tag
      }
    })));
    const expiredEndpoints = pushRows.filter((_, index) => [404, 410].includes(pushResults[index]?.status ?? 0)).map((row) => String(row.endpoint ?? ""));
    if (expiredEndpoints.length > 0) {
      await sql`delete from push_subscriptions where endpoint = any(${expiredEndpoints}::text[])`;
    }
  } catch (error) {
    console.error("Failed to send super admin push alerts", error);
  }
}
async function createDepletedStockNotificationsForOrder(input) {
  const soldItems = (input.items ?? []).map((item) => ({
    productId: String(item?.id ?? "").trim(),
    title: String(item?.title ?? "").trim() || "Product",
    serialNumber: String(item?.serial_number ?? "").trim()
  })).filter((item) => item.productId && item.serialNumber);
  const productIds = Array.from(new Set(soldItems.map((item) => item.productId)));
  const notifications = [];
  for (const productId of productIds) {
    const serialNumbers = soldItems.filter((item) => item.productId === productId).map((item) => item.serialNumber);
    const productTitle = soldItems.find((item) => item.productId === productId)?.title ?? "Product";
    const [stockRow] = await input.sql`
      with sold_serials as (
        select distinct item ->> 'serial_number' as serial_code
        from orders o
        cross join lateral jsonb_array_elements(coalesce(o.items, '[]'::jsonb)) item
        where coalesce(item ->> 'serial_number', '') <> ''
          and coalesce(item ->> 'id', '') = ${productId}
          and o.status <> 'cancelled'
      ),
      returned_serials as (
        select distinct serial_code
        from stock_return_records
        where status = 'completed'
      ),
      takeout_serials as (
        select distinct serial_code
        from stock_takeout_records
        where product_id::text = ${productId}
          and returned_at is null
      )
      select count(*)::int as remaining_count
      from stock_intake_records r
      where r.product_id::text = ${productId}
        and r.deleted_at is null
        and not exists (select 1 from sold_serials ss where trim(lower(ss.serial_code)) = trim(lower(r.serial_code)))
        and not exists (select 1 from returned_serials rs where trim(lower(rs.serial_code)) = trim(lower(r.serial_code)))
        and not exists (select 1 from takeout_serials ts where trim(lower(ts.serial_code)) = trim(lower(r.serial_code)))
    `;
    if (Number(stockRow?.remaining_count ?? 0) > 0) {
      continue;
    }
    const description = `${productTitle} stock is depleted after sale of serial ${serialNumbers.join(", ")}.`;
    const insertedRows = await input.sql`
      insert into super_admin_notifications (type, entity_type, entity_id, title, description, status)
      select
        'stock_depleted',
        'product',
        ${productId},
        'Stock depleted',
        ${description},
        'new'
      where not exists (
        select 1
        from super_admin_notifications
        where type = 'stock_depleted'
          and entity_id = ${productId}
          and created_at >= current_date
      )
      returning id
    `;
    if (insertedRows.length > 0) {
      notifications.push({
        id: insertedRows[0]?.id ? String(insertedRows[0].id) : null,
        title: "Stock depleted",
        description
      });
    }
  }
  return notifications;
}
const createStockIntakeBatchServer_createServerFn_handler = createServerRpc({
  id: "b949d6ba5e0d649ce677817888c4a813bdb503c6d11dfa13d59fc095741535cd",
  name: "createStockIntakeBatchServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => createStockIntakeBatchServer.__executeServer(opts));
const createStockIntakeBatchServer = createServerFn({
  method: "POST"
}).handler(createStockIntakeBatchServer_createServerFn_handler, async ({
  data
}) => {
  const input = data;
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await ensureOperationsTables();
  const submittedSerialCodes = (input.serial_codes ?? []).map((value) => String(value).trim()).filter(Boolean);
  const normalizedSerialKeys = submittedSerialCodes.map((serialCode) => serialCode.toLowerCase());
  const duplicateSubmittedSerial = normalizedSerialKeys.find((serialCode, index) => normalizedSerialKeys.indexOf(serialCode) !== index);
  if (duplicateSubmittedSerial) {
    throw new Error(`Serial number ${submittedSerialCodes[normalizedSerialKeys.indexOf(duplicateSubmittedSerial)]} was entered more than once.`);
  }
  const serialCodes = submittedSerialCodes;
  if (serialCodes.length === 0) {
    throw new Error("At least one serial code is required.");
  }
  if (!Number.isFinite(input.quantity) || input.quantity <= 0) {
    throw new Error("Quantity must be greater than zero.");
  }
  if (serialCodes.length !== input.quantity) {
    throw new Error("Quantity must match the number of serial codes entered.");
  }
  const existingRows = await sql`
    select serial_code
    from stock_intake_records
    where lower(serial_code) = any(${serialCodes.map((serialCode) => serialCode.toLowerCase())}::text[])
    limit 5
  `;
  if (existingRows.length > 0) {
    throw new Error(`Serial number ${String(existingRows[0].serial_code)} already exists.`);
  }
  const productId = await resolveInventoryProductId({
    product_id: input.product_id,
    catalogue_id: input.catalogue_id,
    product_name: input.product_name,
    stock_status: input.stock_status
  });
  for (const serialCode of serialCodes) {
    await sql`
      insert into stock_intake_records (
        product_id, supplier_id, serial_code, quantity, unit_cost, stock_price, due_date, received_at, stock_status, notes,
        created_by_email, created_by_name, created_by_role
      )
      values (
        ${productId},
        ${input.supplier_id ?? null},
        ${serialCode},
        1,
        ${input.unit_cost ?? null},
        ${input.stock_price ?? null},
        ${input.due_date ?? null},
        ${input.received_at},
        ${input.stock_status},
        ${input.notes ?? null},
        ${input.actor.email},
        ${input.actor.name},
        ${input.actor.role}
      )
    `;
  }
  await sql`update products set stock_status = ${input.stock_status}, updated_at = now() where id = ${productId}`;
  await logActivity({
    actor: input.actor,
    action: "created_batch",
    entityType: "stock_intake",
    entityLabel: `${serialCodes.length} serials`,
    details: {
      quantity: input.quantity,
      stock_status: input.stock_status,
      stock_price: input.stock_price ?? null,
      due_date: input.due_date ?? null,
      serial_codes: serialCodes
    }
  });
  return {
    ok: true,
    count: input.quantity
  };
});
const upsertStockReturnServer_createServerFn_handler = createServerRpc({
  id: "ee3d9752ca2edfe7acdf7c010f31afe5f3f4f1afb229831dd7003240c65c9621",
  name: "upsertStockReturnServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => upsertStockReturnServer.__executeServer(opts));
const upsertStockReturnServer = createServerFn({
  method: "POST"
}).handler(upsertStockReturnServer_createServerFn_handler, async ({
  data
}) => {
  const input = data;
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await ensureOperationsTables();
  if (input.id) {
    await sql`
      update stock_return_records
      set
        product_id = ${input.product_id},
        supplier_id = ${input.supplier_id ?? null},
        serial_code = ${input.serial_code},
        quantity = ${input.quantity},
        return_date = ${input.return_date},
        reason = ${input.reason},
        status = ${input.status},
        notes = ${input.notes ?? null},
        created_by_email = ${input.actor.email},
        created_by_name = ${input.actor.name},
        created_by_role = ${input.actor.role},
        updated_at = now()
      where id = ${input.id}
    `;
    await logActivity({
      actor: input.actor,
      action: "updated",
      entityType: "stock_return",
      entityId: input.id,
      entityLabel: input.serial_code,
      details: {
        quantity: input.quantity,
        status: input.status
      }
    });
    return {
      ok: true
    };
  }
  await sql`
    insert into stock_return_records (
      product_id, supplier_id, serial_code, quantity, return_date, reason, status, notes,
      created_by_email, created_by_name, created_by_role
    )
    values (
      ${input.product_id},
      ${input.supplier_id ?? null},
      ${input.serial_code},
      ${input.quantity},
      ${input.return_date},
      ${input.reason},
      ${input.status},
      ${input.notes ?? null},
      ${input.actor.email},
      ${input.actor.name},
      ${input.actor.role}
    )
  `;
  await logActivity({
    actor: input.actor,
    action: "created",
    entityType: "stock_return",
    entityLabel: input.serial_code,
    details: {
      quantity: input.quantity,
      status: input.status
    }
  });
  return {
    ok: true
  };
});
const createStockReturnBatchServer_createServerFn_handler = createServerRpc({
  id: "04dc553de7c9a291dce1662aed5c6d48bd66ad6f991e7b311a28679f6629e69f",
  name: "createStockReturnBatchServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => createStockReturnBatchServer.__executeServer(opts));
const createStockReturnBatchServer = createServerFn({
  method: "POST"
}).handler(createStockReturnBatchServer_createServerFn_handler, async ({
  data
}) => {
  const input = data;
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await ensureOperationsTables();
  const serialCodes = Array.from(new Set((input.serial_codes ?? []).map((value) => String(value).trim()).filter(Boolean)));
  if (serialCodes.length === 0) {
    throw new Error("At least one serial code is required.");
  }
  for (const serialCode of serialCodes) {
    const [availableStock] = await sql`
      select r.id
      from stock_intake_records r
      where r.product_id = ${input.product_id}
        and r.supplier_id = ${input.supplier_id ?? null}
        and lower(r.serial_code) = lower(${serialCode})
        and r.deleted_at is null
        and not exists (
          select 1
          from orders o
          cross join lateral jsonb_array_elements(coalesce(o.items, '[]'::jsonb)) item
          where coalesce(item ->> 'serial_number', '') <> ''
            and o.status <> 'cancelled'
            and item ->> 'serial_number' = r.serial_code
            and item ->> 'id' = r.product_id::text
        )
        and not exists (
          select 1
          from stock_return_records returned
          where returned.status = 'completed'
            and lower(returned.serial_code) = lower(r.serial_code)
        )
        and not exists (
          select 1
          from stock_takeout_records takeout
          where takeout.returned_at is null
            and takeout.product_id = r.product_id
            and lower(takeout.serial_code) = lower(r.serial_code)
        )
      limit 1
    `;
    if (!availableStock) {
      throw new Error(`Serial ${serialCode} is not currently in stock for the selected supplier and product.`);
    }
    await sql`
      insert into stock_return_records (
        product_id, supplier_id, serial_code, quantity, return_date, reason, status, notes,
        created_by_email, created_by_name, created_by_role
      )
      values (
        ${input.product_id},
        ${input.supplier_id ?? null},
        ${serialCode},
        1,
        ${input.return_date},
        ${input.reason},
        ${input.status},
        ${input.notes ?? null},
        ${input.actor.email},
        ${input.actor.name},
        ${input.actor.role}
      )
    `;
  }
  const [takeoutContext] = await sql`
    select
      p.title as product_title,
      r.name as reseller_name
    from products p
    left join resellers r on r.id = ${input.reseller_id}
    where p.id = ${input.product_id}
    limit 1
  `;
  const productTitle = String(takeoutContext?.product_title ?? "Product");
  const resellerName = String(takeoutContext?.reseller_name ?? "reseller");
  const notificationTitle = "Stock taken out";
  const notificationDescription = `${productTitle} (${serialCodes.length} serial${serialCodes.length === 1 ? "" : "s"}) was taken out by ${resellerName}.`;
  const notificationRows = await sql`
    insert into super_admin_notifications (type, entity_type, entity_id, title, description, status)
    values (
      'stock_takeout',
      'stock_takeout',
      ${input.product_id},
      ${notificationTitle},
      ${notificationDescription},
      'new'
    )
    returning id
  `;
  await sendSuperAdminPushAlerts({
    title: notificationTitle,
    body: notificationDescription,
    tag: notificationRows[0]?.id ? `takeout-${String(notificationRows[0].id)}` : "stock-takeout"
  });
  await logActivity({
    actor: input.actor,
    action: "created_batch",
    entityType: "stock_return",
    entityLabel: `${serialCodes.length} serials`,
    details: {
      quantity: serialCodes.length,
      status: input.status,
      serial_codes: serialCodes
    }
  });
  return {
    ok: true,
    count: serialCodes.length
  };
});
const createStockTakeoutBatchServer_createServerFn_handler = createServerRpc({
  id: "123ed2d49f44fb5af8aded0c8bd9d2c1c321e47777cec0b0b4ae16725e9bebd2",
  name: "createStockTakeoutBatchServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => createStockTakeoutBatchServer.__executeServer(opts));
const createStockTakeoutBatchServer = createServerFn({
  method: "POST"
}).handler(createStockTakeoutBatchServer_createServerFn_handler, async ({
  data
}) => {
  const input = data;
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await ensureOperationsTables();
  const serialCodes = Array.from(new Set((input.serial_codes ?? []).map((value) => String(value).trim()).filter(Boolean)));
  if (!input.reseller_id) {
    throw new Error("Reseller is required.");
  }
  if (serialCodes.length === 0) {
    throw new Error("At least one serial code is required.");
  }
  for (const serialCode of serialCodes) {
    await sql`
      insert into stock_takeout_records (
        product_id, reseller_id, serial_code, quantity, takeout_date, notes,
        created_by_email, created_by_name, created_by_role
      )
      values (
        ${input.product_id},
        ${input.reseller_id},
        ${serialCode},
        1,
        ${input.takeout_date},
        ${input.notes ?? null},
        ${input.actor.email},
        ${input.actor.name},
        ${input.actor.role}
      )
    `;
  }
  await logActivity({
    actor: input.actor,
    action: "created_batch",
    entityType: "stock_takeout",
    entityLabel: `${serialCodes.length} serials`,
    details: {
      product_id: input.product_id,
      reseller_id: input.reseller_id,
      quantity: serialCodes.length,
      takeout_date: input.takeout_date,
      serial_codes: serialCodes
    }
  });
  return {
    ok: true,
    count: serialCodes.length
  };
});
const markStockTakeoutReturnedServer_createServerFn_handler = createServerRpc({
  id: "f8217170279a10b3b70f339f76f0c0f9a284366e1dbbeaaf3cf771e81624a378",
  name: "markStockTakeoutReturnedServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => markStockTakeoutReturnedServer.__executeServer(opts));
const markStockTakeoutReturnedServer = createServerFn({
  method: "POST"
}).handler(markStockTakeoutReturnedServer_createServerFn_handler, async ({
  data
}) => {
  const input = data;
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await ensureOperationsTables();
  const [row] = await sql`
    update stock_takeout_records
    set
      returned_at = coalesce(returned_at, now()),
      return_notes = coalesce(${input.notes ?? null}, return_notes),
      returned_by_email = coalesce(returned_by_email, ${input.actor.email}),
      returned_by_name = coalesce(returned_by_name, ${input.actor.name}),
      returned_by_role = coalesce(returned_by_role, ${input.actor.role}),
      updated_at = now()
    where id = ${input.id}
    returning id, product_id, reseller_id, serial_code, returned_at
  `;
  if (!row) {
    throw new Error("Take-out record was not found.");
  }
  await logActivity({
    actor: input.actor,
    action: "returned",
    entityType: "stock_takeout",
    entityId: String(row.id),
    entityLabel: String(row.serial_code ?? ""),
    details: {
      product_id: row.product_id ? String(row.product_id) : null,
      reseller_id: row.reseller_id ? String(row.reseller_id) : null,
      serial_code: String(row.serial_code ?? ""),
      returned_at: String(row.returned_at)
    }
  });
  return {
    ok: true
  };
});
const listProductSerialOptionsServer_createServerFn_handler = createServerRpc({
  id: "6507614eda51dae4f7340b140351a2230d39b62ee5dfcbac910d98ab5084905e",
  name: "listProductSerialOptionsServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => listProductSerialOptionsServer.__executeServer(opts));
const listProductSerialOptionsServer = createServerFn({
  method: "POST"
}).handler(listProductSerialOptionsServer_createServerFn_handler, async ({
  data
}) => {
  const input = data ?? {};
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await ensureOperationsTables();
  if (!input.product_id) return [];
  const rows = await sql`
    select r.serial_code, r.received_at, r.stock_status
    from stock_intake_records r
    where r.product_id = ${input.product_id}
      and r.deleted_at is null
      and not exists (
        select 1
        from stock_return_records sr
        where sr.product_id = r.product_id
          and sr.serial_code = r.serial_code
          and sr.status = 'completed'
      )
      and not exists (
        select 1
        from orders o
        cross join lateral jsonb_array_elements(o.items) as item
        where coalesce(item ->> 'serial_number', '') = r.serial_code
          and coalesce(item ->> 'id', '') = r.product_id::text
          and o.status <> 'cancelled'
      )
      and not exists (
        select 1
        from stock_takeout_records sto
        where sto.product_id = r.product_id
          and sto.serial_code = r.serial_code
          and sto.returned_at is null
      )
    order by r.received_at desc, r.created_at desc
    limit 500
  `;
  return rows.map((row) => ({
    serial_code: String(row.serial_code ?? ""),
    received_at: String(row.received_at),
    stock_status: String(row.stock_status ?? "in_stock")
  }));
});
const upsertStockCountServer_createServerFn_handler = createServerRpc({
  id: "13ca22499e99ed6d4f220fee826d18e45d1c13375b062884fef7e6c69fe9a097",
  name: "upsertStockCountServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => upsertStockCountServer.__executeServer(opts));
const upsertStockCountServer = createServerFn({
  method: "POST"
}).handler(upsertStockCountServer_createServerFn_handler, async ({
  data
}) => {
  const input = data;
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await ensureOperationsTables();
  if (input.id) {
    await sql`
      update stock_count_records
      set
        product_id = ${input.product_id},
        count_date = ${input.count_date},
        counted_quantity = ${input.counted_quantity},
        notes = ${input.notes ?? null},
        created_by_email = ${input.actor.email},
        created_by_name = ${input.actor.name},
        created_by_role = ${input.actor.role},
        updated_at = now()
      where id = ${input.id}
    `;
    await logActivity({
      actor: input.actor,
      action: "updated",
      entityType: "stock_count",
      entityId: input.id,
      details: {
        count_date: input.count_date,
        counted_quantity: input.counted_quantity
      }
    });
    return {
      ok: true
    };
  }
  await sql`
    insert into stock_count_records (
      product_id, count_date, counted_quantity, notes, created_by_email, created_by_name, created_by_role
    )
    values (
      ${input.product_id},
      ${input.count_date},
      ${input.counted_quantity},
      ${input.notes ?? null},
      ${input.actor.email},
      ${input.actor.name},
      ${input.actor.role}
    )
  `;
  await logActivity({
    actor: input.actor,
    action: "created",
    entityType: "stock_count",
    details: {
      count_date: input.count_date,
      counted_quantity: input.counted_quantity
    }
  });
  return {
    ok: true
  };
});
const listActivityLogsServer_createServerFn_handler = createServerRpc({
  id: "a9a51b39555f7a9d26e4d7a5481a713a6a8a54cce10c0699136cf82e68bd88fb",
  name: "listActivityLogsServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => listActivityLogsServer.__executeServer(opts));
const listActivityLogsServer = createServerFn({
  method: "POST"
}).handler(listActivityLogsServer_createServerFn_handler, async () => {
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await ensureOperationsTables();
  const rows = await sql`
    select id, actor_email, actor_name, actor_role, action, entity_type, entity_id, entity_label, details, created_at
    from activity_logs
    order by created_at desc
    limit 100
  `;
  return rows.map((row) => ({
    id: String(row.id),
    actor_email: row.actor_email ?? null,
    actor_name: row.actor_name ?? null,
    actor_role: row.actor_role ?? null,
    action: String(row.action ?? ""),
    entity_type: String(row.entity_type ?? ""),
    entity_id: row.entity_id ?? null,
    entity_label: row.entity_label ?? null,
    details: row.details && typeof row.details === "object" ? row.details : {},
    created_at: String(row.created_at)
  }));
});
const listSuperAdminNotificationsServer_createServerFn_handler = createServerRpc({
  id: "fcf4e61979b0d5b2b679e56429a1b368250dfa9be12e246a741e29c0f4070529",
  name: "listSuperAdminNotificationsServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => listSuperAdminNotificationsServer.__executeServer(opts));
const listSuperAdminNotificationsServer = createServerFn({
  method: "POST"
}).handler(listSuperAdminNotificationsServer_createServerFn_handler, async () => {
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await ensureOperationsTables();
  const readRows = await sql`
    select value
    from settings
    where key = 'super_admin_notification_reads'
    limit 1
  `;
  const readValue = readRows[0]?.value;
  const readIds = new Set(Array.isArray(readValue) ? readValue.map((value) => String(value)).filter(Boolean) : []);
  const billRows = await sql`
    select
      b.id,
      b.bill_number,
      b.due_date,
      b.amount,
      b.status,
      s.name as supplier_name
    from supplier_bills b
    left join suppliers s on s.id = b.supplier_id
    where b.status <> 'paid'
      and b.due_date is not null
      and b.due_date between current_date and current_date + interval '7 days'
    order by b.due_date asc, b.created_at asc
    limit 20
  `;
  const intakeDueRows = await sql`
    select
      r.id,
      r.serial_code,
      r.stock_price,
      r.due_date,
      p.title as product_title
    from stock_intake_records r
    left join products p on p.id = r.product_id
    where r.due_date is not null
      and r.deleted_at is null
      and r.stock_price is not null
      and r.due_date in (current_date + interval '1 day', current_date + interval '3 days')
    order by r.due_date asc, r.created_at asc
    limit 30
  `;
  const orderNotificationRows = await sql`
    select id, type, entity_id, title, description, status, created_at
    from super_admin_notifications
    where type in ('order_created', 'stock_takeout', 'stock_depleted')
    order by created_at desc
    limit 40
  `;
  const overdueTakeoutRows = await sql`
    select
      r.id,
      r.serial_code,
      r.takeout_date,
      r.created_at,
      p.title as product_title,
      rs.name as reseller_name
    from stock_takeout_records r
    left join products p on p.id = r.product_id
    left join resellers rs on rs.id = r.reseller_id
    where r.returned_at is null
      and r.created_at <= now() - interval '24 hours'
      and not exists (
        select 1
        from orders o
        cross join lateral jsonb_array_elements(coalesce(o.items, '[]'::jsonb)) item
        where trim(lower(item->>'serial_number')) = trim(lower(r.serial_code))
          and coalesce(item ->> 'id', '') = r.product_id::text
      )
    order by r.created_at asc
    limit 40
  `;
  const billNotifications = billRows.map((row) => {
    const dueDate = row.due_date ? String(row.due_date) : null;
    const daysUntilDue = dueDate == null ? null : Math.round(((/* @__PURE__ */ new Date(`${dueDate}T00:00:00`)).getTime() - (/* @__PURE__ */ new Date((/* @__PURE__ */ new Date()).toISOString().slice(0, 10) + "T00:00:00")).getTime()) / 864e5);
    return {
      id: `bill-${row.id}`,
      type: "supplier_bill",
      title: `${row.supplier_name ?? "Supplier"} bill due soon`,
      description: `Bill ${row.bill_number} for ${Number(row.amount ?? 0).toLocaleString("en-KE")} is due on ${formatNotificationDate(dueDate)}.`,
      due_date: dueDate,
      created_at: null,
      days_until_due: daysUntilDue,
      status: String(row.status ?? "pending"),
      is_read: readIds.has(`bill-${row.id}`)
    };
  });
  const inventoryNotifications = intakeDueRows.map((row) => {
    const dueDate = row.due_date ? String(row.due_date) : null;
    const daysUntilDue = dueDate == null ? null : Math.round(((/* @__PURE__ */ new Date(`${dueDate}T00:00:00`)).getTime() - (/* @__PURE__ */ new Date((/* @__PURE__ */ new Date()).toISOString().slice(0, 10) + "T00:00:00")).getTime()) / 864e5);
    return {
      id: `inventory-${row.id}`,
      type: "inventory_due",
      title: daysUntilDue === 1 ? "1-day inventory due reminder" : "3-day inventory due reminder",
      description: `${row.product_title ?? "Product"} (${row.serial_code}) has a stock payment due on ${formatNotificationDate(dueDate)}.`,
      due_date: dueDate,
      created_at: null,
      days_until_due: daysUntilDue,
      status: "due_soon",
      is_read: readIds.has(`inventory-${row.id}`)
    };
  });
  const storedNotifications = orderNotificationRows.map((row) => {
    const type = String(row.type ?? "order_created");
    const id = type === "order_created" ? `order-${String(row.id)}` : type === "stock_depleted" ? `stock_depleted-${String(row.id)}` : `stock_takeout-${String(row.id)}`;
    return {
      id,
      type,
      title: String(row.title ?? (type === "stock_takeout" ? "Stock taken out" : type === "stock_depleted" ? "Stock depleted" : "New order received")),
      description: String(row.description ?? (type === "stock_takeout" ? "Stock was taken out." : type === "stock_depleted" ? "A product has no in-stock serials remaining." : "A new order was recorded.")),
      due_date: null,
      created_at: String(row.created_at),
      days_until_due: null,
      status: String(row.status ?? "new"),
      is_read: readIds.has(id)
    };
  });
  const overdueTakeoutNotifications = overdueTakeoutRows.map((row) => ({
    id: `takeout-overdue-${String(row.id)}`,
    type: "stock_takeout_overdue",
    title: "Take-out status reminder",
    description: `${row.product_title ?? "Product"} (${row.serial_code}) taken out by ${row.reseller_name ?? "reseller"} has not been marked returned or sold within 24 hours.`,
    due_date: null,
    created_at: String(row.created_at),
    days_until_due: null,
    status: "needs_update",
    is_read: readIds.has(`takeout-overdue-${String(row.id)}`)
  }));
  return [...storedNotifications, ...overdueTakeoutNotifications, ...inventoryNotifications, ...billNotifications].sort((a, b) => {
    const aTimestamp = a.created_at ?? a.due_date ?? "";
    const bTimestamp = b.created_at ?? b.due_date ?? "";
    return bTimestamp.localeCompare(aTimestamp);
  });
});
const listExpensesServer_createServerFn_handler = createServerRpc({
  id: "7dd5dc24d45ce12286adf49d16356af52c34c26c1e5c709f02a4c9cf66de16f9",
  name: "listExpensesServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => listExpensesServer.__executeServer(opts));
const listExpensesServer = createServerFn({
  method: "POST"
}).handler(listExpensesServer_createServerFn_handler, async () => {
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await ensureOperationsTables();
  const rows = await sql`
    select id, title, category, amount, expense_date, notes, created_by_name, created_by_role, created_at
    from expenses
    order by expense_date desc, created_at desc
    limit 100
  `;
  return rows.map((row) => ({
    id: String(row.id),
    title: String(row.title ?? ""),
    category: String(row.category ?? ""),
    amount: Number(row.amount ?? 0),
    expense_date: String(row.expense_date),
    notes: row.notes ?? null,
    created_by_name: row.created_by_name ?? null,
    created_by_role: row.created_by_role ?? null,
    created_at: String(row.created_at)
  }));
});
const upsertExpenseServer_createServerFn_handler = createServerRpc({
  id: "4d917f6a3399b603b0b37cb3666bdfcbff1d112da697381bf5716320b3640ce2",
  name: "upsertExpenseServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => upsertExpenseServer.__executeServer(opts));
const upsertExpenseServer = createServerFn({
  method: "POST"
}).handler(upsertExpenseServer_createServerFn_handler, async ({
  data
}) => {
  const input = data;
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await ensureOperationsTables();
  if (input.id) {
    await sql`
      update expenses
      set
        title = ${input.title},
        category = ${input.category},
        amount = ${input.amount},
        expense_date = ${input.expense_date},
        notes = ${input.notes ?? null},
        created_by_email = ${input.actor.email},
        created_by_name = ${input.actor.name},
        created_by_role = ${input.actor.role},
        updated_at = now()
      where id = ${input.id}
    `;
    await logActivity({
      actor: input.actor,
      action: "updated",
      entityType: "expense",
      entityId: input.id,
      entityLabel: input.title,
      details: {
        amount: input.amount,
        category: input.category,
        expense_date: input.expense_date
      }
    });
    return {
      ok: true
    };
  }
  await sql`
    insert into expenses (
      title, category, amount, expense_date, notes, created_by_email, created_by_name, created_by_role
    )
    values (
      ${input.title},
      ${input.category},
      ${input.amount},
      ${input.expense_date},
      ${input.notes ?? null},
      ${input.actor.email},
      ${input.actor.name},
      ${input.actor.role}
    )
  `;
  await logActivity({
    actor: input.actor,
    action: "created",
    entityType: "expense",
    entityLabel: input.title,
    details: {
      amount: input.amount,
      category: input.category,
      expense_date: input.expense_date
    }
  });
  return {
    ok: true
  };
});
const fetchFinanceReportServer_createServerFn_handler = createServerRpc({
  id: "eff4b7a54d83c3e7c1934fe1f53231a44f28f8646eb2ffcf745cf9b7d8b63607",
  name: "fetchFinanceReportServer",
  filename: "src/lib/admin-data.ts"
}, (opts) => fetchFinanceReportServer.__executeServer(opts));
const fetchFinanceReportServer = createServerFn({
  method: "POST"
}).handler(fetchFinanceReportServer_createServerFn_handler, async ({
  data
}) => {
  const input = data ?? {};
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await ensureOperationsTables();
  if (input.actor?.role !== "super_admin") {
    throw new Error("Only super admin can view the finance report.");
  }
  const period = input.period ?? "month";
  const startDate = getReportStartDate(period);
  const orderRows = await sql`
    select id, total, source, status, created_at
    from orders
    where (${startDate}::date is null or created_at::date >= ${startDate}::date)
      and coalesce(status, '') <> 'cancelled'
    order by created_at asc
  `;
  const expenseRows = await sql`
    select id, title, category, amount, expense_date, created_at
    from expenses
    where (${startDate}::date is null or expense_date >= ${startDate}::date)
    order by expense_date asc, created_at asc
  `;
  const soldCostRows = await sql`
    with order_items as (
      select
        o.id as order_id,
        o.created_at,
        item ->> 'serial_number' as serial_code
      from orders o
      cross join lateral jsonb_array_elements(coalesce(o.items, '[]'::jsonb)) item
      where (${startDate}::date is null or o.created_at::date >= ${startDate}::date)
        and coalesce(o.status, '') <> 'cancelled'
        and coalesce(item ->> 'serial_number', '') <> ''
    )
    select
      oi.order_id,
      oi.created_at,
      oi.serial_code,
      coalesce(r.stock_price, 0)::numeric as set_price
    from order_items oi
    left join stock_intake_records r
      on lower(r.serial_code) = lower(oi.serial_code)
    order by oi.created_at asc
  `;
  const soldUnpaidRows = await sql`
    with order_items as (
      select distinct
        item ->> 'serial_number' as serial_code
      from orders o
      cross join lateral jsonb_array_elements(coalesce(o.items, '[]'::jsonb)) item
      where (${startDate}::date is null or o.created_at::date >= ${startDate}::date)
        and coalesce(o.status, '') <> 'cancelled'
        and coalesce(item ->> 'serial_number', '') <> ''
    ),
    allocation_agg as (
      select
        stock_intake_id,
        sum(amount)::numeric(12,2) as amount_paid
      from supplier_bill_serial_payments
      group by stock_intake_id
    ),
    fallback_bill_agg as (
      select
        b.stock_intake_id,
        sum(b.amount)::numeric(12,2) as amount_paid
      from supplier_bills b
      where b.stock_intake_id is not null
        and not exists (
          select 1
          from supplier_bill_serial_payments a
          where a.bill_id = b.id
        )
      group by b.stock_intake_id
    ),
    payment_agg as (
      select stock_intake_id, sum(amount_paid)::numeric(12,2) as amount_paid
      from (
        select * from allocation_agg
        union all
        select * from fallback_bill_agg
      ) payments
      group by stock_intake_id
    )
    select
      r.id,
      r.serial_code,
      coalesce(r.stock_price, 0)::numeric as stock_price,
      coalesce(pa.amount_paid, 0)::numeric as amount_paid,
      greatest(coalesce(r.stock_price, 0) - coalesce(pa.amount_paid, 0), 0)::numeric as amount_unpaid
    from order_items oi
    join stock_intake_records r
      on lower(r.serial_code) = lower(oi.serial_code)
    left join payment_agg pa on pa.stock_intake_id = r.id
    where r.deleted_at is null
      and greatest(coalesce(r.stock_price, 0) - coalesce(pa.amount_paid, 0), 0) > 0
  `;
  const shouldGroupMonthly = shouldUseMonthlyReportBuckets(period, startDate);
  const seriesByKey = /* @__PURE__ */ new Map();
  for (const row of orderRows) {
    const date = new Date(row.created_at);
    const key = getReportBucketKey(date, shouldGroupMonthly);
    const point = getReportPoint(seriesByKey, key, date, shouldGroupMonthly);
    point.revenue += Number(row.total ?? 0);
  }
  for (const row of expenseRows) {
    const date = new Date(row.expense_date);
    const key = getReportBucketKey(date, shouldGroupMonthly);
    const point = getReportPoint(seriesByKey, key, date, shouldGroupMonthly);
    point.expenses += Number(row.amount ?? 0);
  }
  for (const row of soldCostRows) {
    const date = new Date(row.created_at);
    const key = getReportBucketKey(date, shouldGroupMonthly);
    const point = getReportPoint(seriesByKey, key, date, shouldGroupMonthly);
    point.set_prices += Number(row.set_price ?? 0);
  }
  const series = Array.from(seriesByKey.values()).sort((left, right) => left.key.localeCompare(right.key)).map((point) => ({
    ...point,
    revenue: Math.round(point.revenue),
    expenses: Math.round(point.expenses),
    set_prices: Math.round(point.set_prices),
    profit: Math.round(point.revenue - point.expenses - point.set_prices)
  }));
  const revenue = orderRows.reduce((sum, row) => sum + Number(row.total ?? 0), 0);
  const expenses = expenseRows.reduce((sum, row) => sum + Number(row.amount ?? 0), 0);
  const setPrices = soldCostRows.reduce((sum, row) => sum + Number(row.set_price ?? 0), 0);
  const soldUnpaidAmount = soldUnpaidRows.reduce((sum, row) => sum + Number(row.amount_unpaid ?? 0), 0);
  const profit = revenue - expenses - setPrices;
  const expensesByCategory = aggregateReportRows(expenseRows, (row) => String(row.category ?? "Other"), (row) => Number(row.amount ?? 0));
  const revenueBySource = aggregateReportRows(orderRows, (row) => formatReportSource(row.source), (row) => Number(row.total ?? 0));
  return {
    period,
    summary: {
      revenue: Math.round(revenue),
      expenses: Math.round(expenses),
      set_prices: Math.round(setPrices),
      profit: Math.round(profit),
      sold_unpaid_amount: Math.round(soldUnpaidAmount),
      order_count: orderRows.length,
      expense_count: expenseRows.length,
      sold_item_count: soldCostRows.length,
      sold_unpaid_count: soldUnpaidRows.length,
      margin: revenue > 0 ? Math.round(profit / revenue * 100) : 0
    },
    series,
    expensesByCategory,
    revenueBySource,
    recentExpenses: expenseRows.slice(-6).reverse().map((row) => ({
      id: String(row.id),
      title: String(row.title ?? ""),
      category: String(row.category ?? "Other"),
      amount: Number(row.amount ?? 0),
      expense_date: String(row.expense_date)
    }))
  };
});
function getReportStartDate(period) {
  if (!period || period === "all") return null;
  const now = /* @__PURE__ */ new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  if (period === "month") {
    start.setDate(1);
    return start.toISOString().slice(0, 10);
  }
  const days = Number(period);
  if (!Number.isFinite(days) || days <= 0) return null;
  start.setDate(start.getDate() - (days - 1));
  return start.toISOString().slice(0, 10);
}
function shouldUseMonthlyReportBuckets(period, startDate) {
  if (period === "all" || period === "365") return true;
  if (!startDate) return true;
  const days = Math.ceil((Date.now() - new Date(startDate).getTime()) / 864e5);
  return days > 120;
}
function getReportBucketKey(date, monthly) {
  if (monthly) return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  return date.toISOString().slice(0, 10);
}
function getReportPoint(map, key, date, monthly) {
  const existing = map.get(key);
  if (existing) return existing;
  const point = {
    key,
    label: monthly ? date.toLocaleDateString("en-KE", {
      month: "short",
      year: "2-digit"
    }) : date.toLocaleDateString("en-KE", {
      month: "short",
      day: "numeric"
    }),
    revenue: 0,
    expenses: 0,
    set_prices: 0,
    profit: 0
  };
  map.set(key, point);
  return point;
}
function aggregateReportRows(rows, getLabel, getValue) {
  const map = /* @__PURE__ */ new Map();
  for (const row of rows) {
    const label = getLabel(row) || "Other";
    map.set(label, (map.get(label) ?? 0) + getValue(row));
  }
  return Array.from(map.entries()).map(([label, value]) => ({
    label,
    value: Math.round(value)
  })).sort((left, right) => right.value - left.value);
}
function formatReportSource(value) {
  return String(value ?? "walkin").replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
}
function buildOrderNotificationDescription(input) {
  const customerName = input.customerName?.trim() || "Walk-in customer";
  const soldItems = (input.items ?? []).map((item) => {
    const title = String(item?.title ?? "").trim();
    const serialNumber = String(item?.serial_number ?? "").trim();
    if (!title && !serialNumber) return "";
    return serialNumber ? `${title || "Product"} sold, serial ${serialNumber}` : `${title} sold`;
  }).filter(Boolean);
  const soldSummary = soldItems.length > 0 ? ` Product sold: ${soldItems.join("; ")}.` : "";
  return `${customerName} placed an order worth KES ${Number(input.total ?? 0).toLocaleString("en-KE")}.${soldSummary}`;
}
function formatNotificationDate(value) {
  if (!value) return "an upcoming date";
  return (/* @__PURE__ */ new Date(`${value}T00:00:00`)).toLocaleDateString("en-KE", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
export {
  createAdminOrderServer_createServerFn_handler,
  createProductCatalogueBatchServer_createServerFn_handler,
  createStockIntakeBatchServer_createServerFn_handler,
  createStockReturnBatchServer_createServerFn_handler,
  createStockTakeoutBatchServer_createServerFn_handler,
  deleteAdminCategoryServer_createServerFn_handler,
  deleteAdminOrderServer_createServerFn_handler,
  deleteAdminProductServer_createServerFn_handler,
  deleteInventoryProductServer_createServerFn_handler,
  deleteProductCatalogueItemServer_createServerFn_handler,
  deleteResellerServer_createServerFn_handler,
  deleteStockIntakeServer_createServerFn_handler,
  deleteSupplierServer_createServerFn_handler,
  exportAdminOrdersServer_createServerFn_handler,
  exportInventoryRecordsServer_createServerFn_handler,
  fetchAdminAnalyticsServer_createServerFn_handler,
  fetchAdminBestDealProductSlugsServer_createServerFn_handler,
  fetchAdminCatalogMetaServer_createServerFn_handler,
  fetchAdminDashboardServer_createServerFn_handler,
  fetchAdminHomepageBannersServer_createServerFn_handler,
  fetchAdminWhatsAppSettingServer_createServerFn_handler,
  fetchFinanceReportServer_createServerFn_handler,
  fetchWebPushPublicKeyServer_createServerFn_handler,
  listActivityLogsServer_createServerFn_handler,
  listAdminCategoriesServer_createServerFn_handler,
  listAdminCustomersServer_createServerFn_handler,
  listAdminInquiriesServer_createServerFn_handler,
  listAdminOrdersServer_createServerFn_handler,
  listAdminProductsServer_createServerFn_handler,
  listExpensesServer_createServerFn_handler,
  listInventoryProductsServer_createServerFn_handler,
  listInventoryRecordsServer_createServerFn_handler,
  listProductCatalogueServer_createServerFn_handler,
  listProductSerialOptionsServer_createServerFn_handler,
  listResellersServer_createServerFn_handler,
  listSuperAdminNotificationsServer_createServerFn_handler,
  listSupplierBillStockOptionsServer_createServerFn_handler,
  listSupplierBillsServer_createServerFn_handler,
  listSupplierFinanceRecordsServer_createServerFn_handler,
  listSuppliersServer_createServerFn_handler,
  markStockTakeoutReturnedServer_createServerFn_handler,
  markSuperAdminNotificationReadServer_createServerFn_handler,
  removeSuperAdminPushSubscriptionServer_createServerFn_handler,
  saveAdminBestDealProductSlugsServer_createServerFn_handler,
  saveAdminCatalogMetaServer_createServerFn_handler,
  saveAdminHomepageBannersServer_createServerFn_handler,
  saveAdminWhatsAppSettingServer_createServerFn_handler,
  saveSuperAdminPushSubscriptionServer_createServerFn_handler,
  storeAdminBannerImagesServer_createServerFn_handler,
  storeAdminProductImagesServer_createServerFn_handler,
  updateAdminInquiryStatusServer_createServerFn_handler,
  updateAdminOrderStatusServer_createServerFn_handler,
  updateAdminProductCategoryPriorityServer_createServerFn_handler,
  updateAdminProductFeaturedServer_createServerFn_handler,
  updateProductCatalogueItemServer_createServerFn_handler,
  updateStockIntakeMetaServer_createServerFn_handler,
  upsertAdminCategoryServer_createServerFn_handler,
  upsertAdminProductServer_createServerFn_handler,
  upsertExpenseServer_createServerFn_handler,
  upsertInventoryProductServer_createServerFn_handler,
  upsertResellerServer_createServerFn_handler,
  upsertStockCountServer_createServerFn_handler,
  upsertStockIntakeServer_createServerFn_handler,
  upsertStockReturnServer_createServerFn_handler,
  upsertSupplierBillServer_createServerFn_handler,
  upsertSupplierServer_createServerFn_handler
};
