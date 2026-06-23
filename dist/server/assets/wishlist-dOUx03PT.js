import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import { a as useStore, b as useWhatsAppNumber, D as DEFAULT_WHATSAPP_NUMBER, B as Button, f as formatKES, h as handleWhatsAppLinkClick, i as inquireSingle } from "./router-B4G_FXaH.js";
import { toast } from "sonner";
import "@tanstack/react-query";
import "react";
import "clsx";
import "tailwind-merge";
import "./category-tree-BmC-Sh6N.js";
import "./products-DQc7b5GA.js";
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
function WishlistPage() {
  const {
    wishlist,
    toggleWishlist,
    addToCart
  } = useStore();
  const {
    data: wa = DEFAULT_WHATSAPP_NUMBER
  } = useWhatsAppNumber();
  if (wishlist.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-2xl px-6 py-24 text-center", children: [
      /* @__PURE__ */ jsx(Heart, { className: "mx-auto h-12 w-12 text-muted-foreground" }),
      /* @__PURE__ */ jsx("h1", { className: "mt-4 text-3xl font-bold", children: "No wishlist items" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-muted-foreground", children: "Save products to revisit them later." }),
      /* @__PURE__ */ jsx(Button, { asChild: true, className: "mt-6 rounded-full", children: /* @__PURE__ */ jsx(Link, { to: "/shop", children: "Browse products" }) })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "site-desktop-width mx-auto px-4 py-10 md:px-6", children: [
    /* @__PURE__ */ jsx("h1", { className: "mb-8 text-4xl font-bold tracking-tight", children: "Wishlist" }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-2.5", children: wishlist.map((item) => /* @__PURE__ */ jsxs("div", { className: "relative flex gap-3 rounded-xl border bg-card p-3", children: [
      /* @__PURE__ */ jsx("button", { onClick: () => toggleWishlist({
        id: item.id,
        slug: item.slug,
        title: item.title,
        price: item.price,
        image: item.image
      }), className: "absolute right-2.5 top-2.5 z-10 rounded-full bg-white/95 p-1 text-muted-foreground shadow-sm transition hover:text-primary", "aria-label": "Remove from wishlist", children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" }) }),
      /* @__PURE__ */ jsx(Link, { to: "/products/$slug", params: {
        slug: item.slug
      }, className: "h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-white", children: item.image && /* @__PURE__ */ jsx("img", { src: item.image, alt: item.title, className: "h-full w-full object-contain object-center" }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Link, { to: "/products/$slug", params: {
            slug: item.slug
          }, className: "line-clamp-2 pr-6 text-[13px] font-medium leading-[1.35] hover:text-primary", children: item.title }),
          /* @__PURE__ */ jsx("div", { className: "mt-1 text-[12px] font-medium text-muted-foreground", children: formatKES(item.price) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-2.5 grid grid-cols-2 gap-2 sm:mt-3 sm:flex sm:flex-wrap sm:items-center", children: [
          /* @__PURE__ */ jsx(Button, { asChild: true, size: "sm", className: "h-7 w-full rounded-full bg-[#e92d48] px-2.5 text-[10px] text-white hover:bg-[#d61f3d]", children: /* @__PURE__ */ jsx("a", { href: inquireSingle(wa, item.title, item.price), onClick: (event) => handleWhatsAppLinkClick(event, inquireSingle(wa, item.title, item.price)), children: "Buy now" }) }),
          /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "outline", className: "h-7 w-full rounded-full border-[#d4d4d8] bg-white px-2.5 text-[10px] text-[#3f3f46] hover:bg-[#f4f4f5] hover:text-[#27272a]", onClick: () => {
            addToCart({
              id: item.id,
              slug: item.slug,
              title: item.title,
              price: item.price,
              image: item.image
            });
            toast.success("Added to cart");
          }, children: [
            /* @__PURE__ */ jsx(ShoppingCart, { className: "h-2.5 w-2.5" }),
            " Add to cart"
          ] })
        ] })
      ] })
    ] }, item.id)) })
  ] });
}
export {
  WishlistPage as component
};
