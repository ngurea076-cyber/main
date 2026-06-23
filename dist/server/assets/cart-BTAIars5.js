import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { ShoppingBag, Minus, Plus, Trash2, MessageCircle } from "lucide-react";
import { a as useStore, b as useWhatsAppNumber, D as DEFAULT_WHATSAPP_NUMBER, B as Button, f as formatKES, e as buildWaMessage, o as openWhatsAppConversation, w as waLink } from "./router-B4G_FXaH.js";
import { useState } from "react";
import { submitInquiry } from "./products-DQc7b5GA.js";
import { toast } from "sonner";
import "@tanstack/react-query";
import "clsx";
import "tailwind-merge";
import "./category-tree-BmC-Sh6N.js";
import "./tanstack-vendor-DM2N0uEF.js";
import "seroval";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router/ssr/server";
import "zod";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-dialog";
const SESSION_KEY = "shopict_analytics_session";
const SESSION_TTL_MS = 1e3 * 60 * 60 * 12;
function safeParseSession(raw) {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
function safeReadSessionStorage(key) {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}
function safeWriteSessionStorage(key, value) {
  if (typeof window === "undefined") return false;
  try {
    window.sessionStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}
function classifyReferrer(referrer, utmSource) {
  if (utmSource) return utmSource;
  if (!referrer) return "Direct";
  try {
    const hostname = new URL(referrer).hostname.toLowerCase().replace(/^www\./, "");
    if (hostname.includes("google.")) return "Google";
    if (hostname.includes("bing.") || hostname.includes("yahoo.")) return "Search";
    if (hostname.includes("facebook.") || hostname.includes("instagram.") || hostname.includes("tiktok.") || hostname.includes("x.com") || hostname.includes("twitter.")) {
      return "Social";
    }
    if (hostname.includes("whatsapp.")) return "WhatsApp";
    return "Referral";
  } catch {
    return "Referral";
  }
}
function detectDeviceType(userAgent) {
  const agent = userAgent.toLowerCase();
  if (/ipad|tablet/.test(agent)) return "Tablet";
  if (/mobi|android|iphone/.test(agent)) return "Mobile";
  return "Desktop";
}
function getAnalyticsSession() {
  if (typeof window === "undefined") return null;
  const current = safeParseSession(safeReadSessionStorage(SESSION_KEY));
  const currentAge = current ? Date.now() - new Date(current.started_at).getTime() : Infinity;
  if (current && currentAge < SESSION_TTL_MS) {
    return current;
  }
  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get("utm_source")?.trim() || null;
  const referrer = document.referrer || null;
  const source = classifyReferrer(referrer ?? "", utmSource);
  const session = {
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}`,
    source,
    referrer,
    started_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  if (!safeWriteSessionStorage(SESSION_KEY, JSON.stringify(session))) {
    return null;
  }
  return session;
}
function buildClientAnalyticsPayload(pathname) {
  if (typeof window === "undefined" || typeof navigator === "undefined") return null;
  const session = getAnalyticsSession();
  if (!session) return null;
  return {
    pathname,
    session_id: session.id,
    source: session.source,
    referrer: session.referrer,
    device_type: detectDeviceType(navigator.userAgent || ""),
    user_agent: navigator.userAgent || "",
    metadata: {
      href: window.location.href,
      search: window.location.search
    }
  };
}
function CartPage() {
  const {
    cart,
    setQty,
    removeFromCart,
    cartTotal,
    clearCart
  } = useStore();
  const {
    data: wa = DEFAULT_WHATSAPP_NUMBER
  } = useWhatsAppNumber();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const handleOrder = async () => {
    if (cart.length === 0) return;
    const message = buildWaMessage(cart.map((c) => ({
      title: c.title,
      quantity: c.quantity,
      price: c.price
    })), name ? `From: ${name}${phone ? ` (${phone})` : ""}` : void 0);
    try {
      await submitInquiry({
        customer_name: name || null,
        customer_phone: phone || null,
        items: cart.map((c) => ({
          id: c.id,
          title: c.title,
          qty: c.quantity,
          price: c.price
        })),
        total: cartTotal,
        message,
        analytics: buildClientAnalyticsPayload("/cart")
      });
    } catch (e) {
      console.error(e);
    }
    openWhatsAppConversation(waLink(wa, message));
    toast.success("Opening WhatsApp...");
  };
  if (cart.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-2xl px-6 py-24 text-center", children: [
      /* @__PURE__ */ jsx(ShoppingBag, { className: "mx-auto h-12 w-12 text-muted-foreground" }),
      /* @__PURE__ */ jsx("h1", { className: "mt-4 text-3xl font-bold", children: "Your cart is empty" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-muted-foreground", children: "Discover gadgets you'll love." }),
      /* @__PURE__ */ jsx(Button, { asChild: true, className: "mt-6 rounded-full", children: /* @__PURE__ */ jsx(Link, { to: "/shop", children: "Start shopping" }) })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "site-desktop-width mx-auto px-4 py-10 md:px-6", children: [
    /* @__PURE__ */ jsx("h1", { className: "mb-8 text-4xl font-bold tracking-tight", children: "Cart" }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-8 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-3 lg:col-span-2", children: [
        cart.map((item) => /* @__PURE__ */ jsxs("div", { className: "flex gap-3 rounded-xl border bg-card p-3", children: [
          /* @__PURE__ */ jsx(Link, { to: "/products/$slug", params: {
            slug: item.slug
          }, className: "h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-white", children: item.image && /* @__PURE__ */ jsx("img", { src: item.image, alt: item.title, className: "h-full w-full object-contain object-center" }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Link, { to: "/products/$slug", params: {
                slug: item.slug
              }, className: "line-clamp-2 text-[13px] font-medium leading-[1.35] hover:text-primary", children: item.title }),
              /* @__PURE__ */ jsx("div", { className: "mt-1 text-[12px] font-medium text-muted-foreground", children: formatKES(item.price) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-auto flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-0.5 rounded-full border p-0.5", children: [
                /* @__PURE__ */ jsx("button", { onClick: () => setQty(item.id, item.quantity - 1), className: "grid h-6 w-6 place-items-center rounded-full hover:bg-surface", children: /* @__PURE__ */ jsx(Minus, { className: "h-3 w-3" }) }),
                /* @__PURE__ */ jsx("span", { className: "w-5 text-center text-[12px] font-medium", children: item.quantity }),
                /* @__PURE__ */ jsx("button", { onClick: () => setQty(item.id, item.quantity + 1), className: "grid h-6 w-6 place-items-center rounded-full hover:bg-surface", children: /* @__PURE__ */ jsx(Plus, { className: "h-3 w-3" }) })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx("button", { onClick: () => removeFromCart(item.id), className: "text-muted-foreground hover:text-primary", children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" }) }) })
            ] })
          ] })
        ] }, item.id)),
        /* @__PURE__ */ jsx("button", { onClick: clearCart, className: "text-sm text-muted-foreground hover:text-primary", children: "Clear cart" })
      ] }),
      /* @__PURE__ */ jsxs("aside", { className: "h-fit rounded-2xl border bg-card p-4 shadow-soft", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-base font-semibold", children: "Order summary" }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 space-y-1.5 text-[13px]", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Subtotal" }),
            /* @__PURE__ */ jsx("span", { children: formatKES(cartTotal) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Delivery" }),
            /* @__PURE__ */ jsx("span", { children: "Calculated on WhatsApp" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 flex justify-between border-t pt-3 text-base font-semibold", children: [
          /* @__PURE__ */ jsx("span", { children: "Total" }),
          /* @__PURE__ */ jsx("span", { children: formatKES(cartTotal) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-2", children: [
          /* @__PURE__ */ jsx("input", { value: name, onChange: (e) => setName(e.target.value), placeholder: "Your name (optional)", className: "w-full rounded-full border bg-background px-3.5 py-2 text-[13px] outline-none focus:ring-2 focus:ring-primary/30" }),
          /* @__PURE__ */ jsx("input", { value: phone, onChange: (e) => setPhone(e.target.value), placeholder: "Phone (optional)", className: "w-full rounded-full border bg-background px-3.5 py-2 text-[13px] outline-none focus:ring-2 focus:ring-primary/30" })
        ] }),
        /* @__PURE__ */ jsxs(Button, { onClick: handleOrder, size: "lg", className: "mt-4 h-10 w-full rounded-full bg-whatsapp px-3 text-[13px] text-whatsapp-foreground hover:bg-whatsapp/90", children: [
          /* @__PURE__ */ jsx(MessageCircle, { className: "h-3.5 w-3.5" }),
          " Proceed to WhatsApp Order"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-2.5 text-center text-[11px] text-muted-foreground", children: "No online payment — confirm your order on WhatsApp." })
      ] })
    ] })
  ] });
}
export {
  CartPage as component
};
