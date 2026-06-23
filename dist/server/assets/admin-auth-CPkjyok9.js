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
function getEnvironmentAttendantUser() {
  return {
    name: process.env.ATTENDANT_NAME || "Attendant",
    email: (process.env.ATTENDANT_EMAIL || "attendant@shopictgadgets.co.ke").trim().toLowerCase(),
    password: process.env.ATTENDANT_PASSWORD || "changeme123",
    role: "attendant"
  };
}
function isEnvironmentAttendantLogin(email, password) {
  const attendant = getEnvironmentAttendantUser();
  return email === attendant.email && password === attendant.password;
}
async function ensureAdminUsersTable() {
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await sql`create extension if not exists pgcrypto`;
  await sql`
    create table if not exists admin_users (
      id uuid primary key default gen_random_uuid(),
      name text not null,
      email text not null unique,
      password_hash text not null,
      role text not null,
      is_active boolean not null default true,
      is_protected boolean not null default false,
      source text not null default 'manual',
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `;
}
async function syncBootstrapAdminUsers() {
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await ensureAdminUsersTable();
  await sql`
    delete from admin_users
    where role in ('admin', 'super_admin')
       or lower(email) in (
        lower(${process.env.ADMIN_EMAIL || "admin@shopictgadgets.co.ke"}),
        lower(${process.env.SUPER_ADMIN_EMAIL || "superadmin@shopictgadgets.co.ke"})
      )
  `;
  const bootstrapUsers = [getEnvironmentAttendantUser()];
  for (const user of bootstrapUsers) {
    await sql`
      insert into admin_users (name, email, password_hash, role, is_active, is_protected, source)
      values (
        ${user.name},
        ${user.email.toLowerCase()},
        crypt(${user.password}, gen_salt('bf')),
        ${user.role},
        true,
        true,
        'environment'
      )
      on conflict (email)
      do update set
        name = excluded.name,
        role = excluded.role,
        is_active = true,
        is_protected = true,
        source = 'environment',
        password_hash = case
          when crypt(${user.password}, admin_users.password_hash) = admin_users.password_hash
            then admin_users.password_hash
          else crypt(${user.password}, gen_salt('bf'))
        end,
        updated_at = now()
    `;
  }
}
const verifyAdminLoginServer_createServerFn_handler = createServerRpc({
  id: "41fee207645975e817f77250d12bf848ae694b5d97c870d3429bb85a7609680e",
  name: "verifyAdminLoginServer",
  filename: "src/lib/admin-auth.ts"
}, (opts) => verifyAdminLoginServer.__executeServer(opts));
const verifyAdminLoginServer = createServerFn({
  method: "POST"
}).handler(verifyAdminLoginServer_createServerFn_handler, async ({
  data
}) => {
  const input = data;
  const email = input.email.trim().toLowerCase();
  const password = input.password;
  if (isEnvironmentAttendantLogin(email, password)) {
    const attendant = getEnvironmentAttendantUser();
    return {
      email: attendant.email,
      name: attendant.name,
      role: "attendant",
      isAdmin: true
    };
  }
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await syncBootstrapAdminUsers();
  const rows = await sql`
    select name, email, role
    from admin_users
    where lower(email) = ${email}
      and is_active = true
      and role = 'attendant'
      and crypt(${password}, password_hash) = password_hash
    limit 1
  `;
  const user = rows[0];
  if (user) {
    return {
      email: String(user.email),
      name: String(user.name),
      role: normalizeAdminRole(user.role),
      isAdmin: true
    };
  }
  throw new Error("Invalid admin credentials.");
});
const getAdminAccessConfigServer_createServerFn_handler = createServerRpc({
  id: "1cbfcd8b593dcbe072fe46cbb3a2d34050caf7ffefc6ec0329e24759ba469fd5",
  name: "getAdminAccessConfigServer",
  filename: "src/lib/admin-auth.ts"
}, (opts) => getAdminAccessConfigServer.__executeServer(opts));
const getAdminAccessConfigServer = createServerFn({
  method: "GET"
}).handler(getAdminAccessConfigServer_createServerFn_handler, async () => {
  const configuredCode = process.env.ADMIN_ACCESS_CODE?.trim() ?? "";
  return {
    enabled: configuredCode.length > 0
  };
});
const verifyAdminAccessCodeServer_createServerFn_handler = createServerRpc({
  id: "72410f6112840824c39f6bc513b6d31314c6c2b3e865c12b5310474486aa9667",
  name: "verifyAdminAccessCodeServer",
  filename: "src/lib/admin-auth.ts"
}, (opts) => verifyAdminAccessCodeServer.__executeServer(opts));
const verifyAdminAccessCodeServer = createServerFn({
  method: "POST"
}).handler(verifyAdminAccessCodeServer_createServerFn_handler, async ({
  data
}) => {
  const input = data;
  const configuredCode = process.env.ADMIN_ACCESS_CODE?.trim() ?? "";
  if (!configuredCode) {
    return {
      enabled: false,
      valid: true
    };
  }
  return {
    enabled: true,
    valid: input.code.trim() === configuredCode
  };
});
const listAdminUsersServer_createServerFn_handler = createServerRpc({
  id: "246f149975ba7649055bed37d4935c42d035566fdd7cabe2b81dd8e929c30d05",
  name: "listAdminUsersServer",
  filename: "src/lib/admin-auth.ts"
}, (opts) => listAdminUsersServer.__executeServer(opts));
const listAdminUsersServer = createServerFn({
  method: "POST"
}).handler(listAdminUsersServer_createServerFn_handler, async () => {
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await syncBootstrapAdminUsers();
  const rows = await sql`
    select id, name, email, role, is_active, is_protected, source, created_at, updated_at
    from admin_users
    where role = 'attendant'
    order by
      created_at asc
  `;
  return rows.map((row) => ({
    id: String(row.id),
    name: String(row.name ?? ""),
    email: String(row.email ?? ""),
    role: normalizeAdminRole(row.role),
    is_active: Boolean(row.is_active),
    is_protected: Boolean(row.is_protected),
    source: String(row.source ?? "manual"),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at)
  }));
});
function normalizeAdminRole(value) {
  if (value === "super_admin") return "super_admin";
  if (value === "attendant") return "attendant";
  return "admin";
}
const upsertAdminUserServer_createServerFn_handler = createServerRpc({
  id: "5930ecacf08b66fc5b123ed5e63cc7176ee93d74dc5e1c15cb535607b8620b6f",
  name: "upsertAdminUserServer",
  filename: "src/lib/admin-auth.ts"
}, (opts) => upsertAdminUserServer.__executeServer(opts));
const upsertAdminUserServer = createServerFn({
  method: "POST"
}).handler(upsertAdminUserServer_createServerFn_handler, async ({
  data
}) => {
  const input = data;
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await syncBootstrapAdminUsers();
  const email = input.email.trim().toLowerCase();
  if (!email) throw new Error("Email is required.");
  if (!input.name.trim()) throw new Error("Name is required.");
  if (input.role !== "attendant") throw new Error("Only attendant profiles are supported.");
  if (input.id) {
    const existingRows = await sql`
      select id, is_protected, password_hash
      from admin_users
      where id = ${input.id}
      limit 1
    `;
    const existing = existingRows[0];
    if (!existing) throw new Error("User profile not found.");
    if (input.password?.trim()) {
      await sql`
        update admin_users
        set
          name = ${input.name.trim()},
          email = ${email},
          role = ${input.role},
          is_active = ${input.is_active},
          password_hash = crypt(${input.password}, gen_salt('bf')),
          updated_at = now()
        where id = ${input.id}
      `;
    } else {
      await sql`
        update admin_users
        set
          name = ${input.name.trim()},
          email = ${email},
          role = ${input.role},
          is_active = ${input.is_active},
          updated_at = now()
        where id = ${input.id}
      `;
    }
    return {
      ok: true
    };
  }
  if (!input.password?.trim()) throw new Error("Password is required for a new admin profile.");
  await sql`
    insert into admin_users (name, email, password_hash, role, is_active, is_protected, source)
    values (
      ${input.name.trim()},
      ${email},
      crypt(${input.password}, gen_salt('bf')),
      ${input.role},
      ${input.is_active},
      false,
      'manual'
    )
  `;
  return {
    ok: true
  };
});
const setAdminUserActiveServer_createServerFn_handler = createServerRpc({
  id: "d6e0c2f49f127a01cbee1133a1f0098fc84c89322ef8e6d8f47a9c64cbf34af0",
  name: "setAdminUserActiveServer",
  filename: "src/lib/admin-auth.ts"
}, (opts) => setAdminUserActiveServer.__executeServer(opts));
const setAdminUserActiveServer = createServerFn({
  method: "POST"
}).handler(setAdminUserActiveServer_createServerFn_handler, async ({
  data
}) => {
  const input = data;
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await syncBootstrapAdminUsers();
  const rows = await sql`
    select is_protected
    from admin_users
    where id = ${input.id}
    limit 1
  `;
  const user = rows[0];
  if (!user) throw new Error("User profile not found.");
  if (Boolean(user.is_protected) && !input.is_active) {
    throw new Error("Protected system admins cannot be deactivated.");
  }
  await sql`
    update admin_users
    set is_active = ${input.is_active}, updated_at = now()
    where id = ${input.id}
  `;
  return {
    ok: true
  };
});
const deleteAdminUserServer_createServerFn_handler = createServerRpc({
  id: "1da38ae56f491bdc5a5b0fe59b286182b0bd4e8ee5616bd97f25387c2de337f1",
  name: "deleteAdminUserServer",
  filename: "src/lib/admin-auth.ts"
}, (opts) => deleteAdminUserServer.__executeServer(opts));
const deleteAdminUserServer = createServerFn({
  method: "POST"
}).handler(deleteAdminUserServer_createServerFn_handler, async ({
  data
}) => {
  const input = data;
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await syncBootstrapAdminUsers();
  const rows = await sql`
    select is_protected
    from admin_users
    where id = ${input.id}
    limit 1
  `;
  const user = rows[0];
  if (!user) throw new Error("User profile not found.");
  if (Boolean(user.is_protected)) {
    throw new Error("Protected system admins cannot be deleted.");
  }
  await sql`delete from admin_users where id = ${input.id}`;
  return {
    ok: true
  };
});
export {
  deleteAdminUserServer_createServerFn_handler,
  getAdminAccessConfigServer_createServerFn_handler,
  listAdminUsersServer_createServerFn_handler,
  setAdminUserActiveServer_createServerFn_handler,
  upsertAdminUserServer_createServerFn_handler,
  verifyAdminAccessCodeServer_createServerFn_handler,
  verifyAdminLoginServer_createServerFn_handler
};
