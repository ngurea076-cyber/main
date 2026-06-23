import { c as createServerFn, a as createSsrRpc } from "./tanstack-vendor-DM2N0uEF.js";
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
async function ensureAnalyticsTables() {
  const {
    getNeonSql
  } = await import("./neon.server-CrlN4fYY.js");
  const sql = getNeonSql();
  await sql`
    create table if not exists analytics_events (
      id bigserial primary key,
      event_type text not null,
      pathname text not null,
      session_id text null,
      source text not null default 'Direct',
      referrer text null,
      device_type text not null default 'Unknown',
      user_agent text null,
      metadata jsonb not null default '{}'::jsonb,
      created_at timestamptz not null default now()
    )
  `;
  await sql`create index if not exists analytics_events_event_type_idx on analytics_events (event_type)`;
  await sql`create index if not exists analytics_events_created_at_idx on analytics_events (created_at desc)`;
  await sql`create index if not exists analytics_events_source_idx on analytics_events (source)`;
  await sql`create index if not exists analytics_events_device_type_idx on analytics_events (device_type)`;
}
const trackAnalyticsEventServer = createServerFn({
  method: "POST"
}).handler(createSsrRpc("de5028c62ed281541def6eaaef6efcd6c02ee4fcec19942dae17c0a94ea646be"));
async function trackAnalyticsEvent(input) {
  return trackAnalyticsEventServer({
    data: input
  });
}
export {
  ensureAnalyticsTables,
  trackAnalyticsEvent
};
