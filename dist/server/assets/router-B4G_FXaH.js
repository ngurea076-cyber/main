import { useQuery, QueryClientProvider, useQueryClient, QueryClient, hydrate, dehydrate } from "@tanstack/react-query";
import { useNavigate, useRouterState, Link, createRootRouteWithContext, useRouter, Outlet, HeadContent, Scripts, createFileRoute, lazyRouteComponent, createRouter } from "@tanstack/react-router";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { Toaster as Toaster$1, toast } from "sonner";
import { Search, Heart, ShoppingBag, ChevronDown, Menu, X, Facebook, Instagram, Phone, Mail, MapPin, ShoppingCart, MessageCircle, Bot, Laptop, Monitor, Smartphone, Printer, SlidersHorizontal, Download, Share, Boxes, Plus, Pencil, Trash2 } from "lucide-react";
import * as React from "react";
import { useState, useEffect, useCallback, createContext, useContext, useRef, useMemo } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { C as CATEGORY_TREE, g as getCategoryGroupBySearchParam, i as isSubcategoryForMainCategory } from "./category-tree-BmC-Sh6N.js";
import { fetchWhatsAppNumber, fetchProducts, fetchProductPageData } from "./products-DQc7b5GA.js";
import { c as createServerFn, a as createSsrRpc } from "./tanstack-vendor-DM2N0uEF.js";
import { z } from "zod";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import * as DialogPrimitive from "@radix-ui/react-dialog";
const appCss = "/assets/styles-lIcuQCyl.css";
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
const Ctx$1 = createContext(null);
const read = (k, fb) => {
  if (typeof window === "undefined") return fb;
  try {
    return JSON.parse(localStorage.getItem(k) || "");
  } catch {
    return fb;
  }
};
const write = (key, value) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
  }
};
function StoreProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setCart(read("sig_cart", []));
    setWishlist(read("sig_wishlist", []));
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (hydrated) write("sig_cart", cart);
  }, [cart, hydrated]);
  useEffect(() => {
    if (hydrated) write("sig_wishlist", wishlist);
  }, [wishlist, hydrated]);
  const addToCart = useCallback((item, qty = 1) => {
    setCart((prev) => {
      const found = prev.find((p) => p.id === item.id);
      if (found) return prev.map((p) => p.id === item.id ? { ...p, quantity: p.quantity + qty } : p);
      return [...prev, { ...item, quantity: qty }];
    });
  }, []);
  const removeFromCart = useCallback((id) => setCart((p) => p.filter((i) => i.id !== id)), []);
  const setQty = useCallback((id, qty) => setCart((p) => p.map((i) => i.id === id ? { ...i, quantity: Math.max(1, qty) } : i)), []);
  const clearCart = useCallback(() => setCart([]), []);
  const toggleWishlist = useCallback((item) => {
    setWishlist((prev) => prev.find((p) => p.id === item.id) ? prev.filter((p) => p.id !== item.id) : [...prev, { ...item, quantity: 1 }]);
  }, []);
  const inWishlist = useCallback((id) => wishlist.some((p) => p.id === id), [wishlist]);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  return /* @__PURE__ */ jsx(Ctx$1.Provider, { value: { cart, wishlist, addToCart, removeFromCart, setQty, clearCart, toggleWishlist, inWishlist, cartCount, cartTotal }, children });
}
function useStore() {
  const ctx = useContext(Ctx$1);
  if (!ctx) throw new Error("useStore outside StoreProvider");
  return ctx;
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const NAV = CATEGORY_TREE;
function buildMegaColumns(item) {
  const submenuItems = item.items.map((label) => ({ label }));
  const groups = [
    { heading: item.label, items: submenuItems.slice(0, 3) },
    { heading: item.label, items: submenuItems.slice(3, 6) },
    { heading: item.label, items: submenuItems.slice(6, 8) }
  ];
  return groups.map((group) => ({
    heading: group.heading,
    items: group.items.length > 0 ? group.items : [{ label: item.label }]
  }));
}
function Header() {
  const { cartCount, wishlist } = useStore();
  const wishlistCount = wishlist.length;
  const [scrolled, setScrolled] = useState(false);
  const [desktopNavPinned, setDesktopNavPinned] = useState(false);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [mobileOpenMenu, setMobileOpenMenu] = useState(null);
  const [desktopOpenMenu, setDesktopOpenMenu] = useState(null);
  const navigate = useNavigate();
  const routeSearch = useRouterState({ select: (state) => state.location.search });
  const searchPlaceholders = ["Laptops", "Printers", "Monitors", "Smartphones", "Accessories", "Audio"];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const adminShortcutTimerRef = useRef(null);
  const adminShortcutTriggeredRef = useRef(false);
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      setDesktopNavPinned(window.innerWidth >= 1024 && window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  useEffect(() => {
    const interval = window.setInterval(() => {
      setPlaceholderIndex((current) => (current + 1) % searchPlaceholders.length);
    }, 2200);
    return () => window.clearInterval(interval);
  }, [searchPlaceholders.length]);
  useEffect(() => {
    return () => {
      if (adminShortcutTimerRef.current !== null) {
        window.clearTimeout(adminShortcutTimerRef.current);
      }
    };
  }, []);
  const onSearch = (e) => {
    e.preventDefault();
    navigate({ to: "/shop", search: { q: search } });
  };
  const clearAdminShortcutTimer = () => {
    if (typeof window === "undefined") return;
    if (adminShortcutTimerRef.current !== null) {
      window.clearTimeout(adminShortcutTimerRef.current);
      adminShortcutTimerRef.current = null;
    }
  };
  const startAdminShortcutPress = (_event) => {
    if (typeof window === "undefined") return;
    clearAdminShortcutTimer();
    adminShortcutTriggeredRef.current = false;
    adminShortcutTimerRef.current = window.setTimeout(() => {
      adminShortcutTimerRef.current = null;
      adminShortcutTriggeredRef.current = true;
      setOpen(false);
      navigate({ to: "/auth" });
    }, 3e3);
  };
  const cancelAdminShortcutPress = () => {
    if (adminShortcutTriggeredRef.current) return;
    clearAdminShortcutTimer();
  };
  const handleHeaderLogoClick = (event) => {
    if (adminShortcutTriggeredRef.current) {
      event.preventDefault();
      event.stopPropagation();
      adminShortcutTriggeredRef.current = false;
    }
  };
  const handleDrawerLogoClick = (event) => {
    if (adminShortcutTriggeredRef.current) {
      event.preventDefault();
      event.stopPropagation();
      adminShortcutTriggeredRef.current = false;
      return;
    }
    setOpen(false);
    navigate({ to: "/" });
  };
  return /* @__PURE__ */ jsxs(
    "header",
    {
      className: cn(
        "sticky top-0 z-40 w-full border-b border-[#eeeeee] bg-white transition-shadow",
        open && "z-[70]",
        scrolled && "shadow-[0_10px_35px_-20px_rgba(17,24,39,0.28)] lg:shadow-none"
      ),
      children: [
        desktopNavPinned ? /* @__PURE__ */ jsx("div", { className: "hidden h-[148px] lg:block", "aria-hidden": "true" }) : null,
        /* @__PURE__ */ jsx(
          "div",
          {
            className: cn(
              "hidden h-[66px] border-b border-[#eeeeee] bg-[#f4f4f4] lg:block",
              desktopNavPinned && "fixed left-0 right-0 top-0 z-50"
            ),
            children: /* @__PURE__ */ jsxs("div", { className: "site-desktop-width mx-auto flex h-full w-full items-center gap-4 px-10 text-[13px] text-[#111827]", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 items-center gap-4", children: [
                /* @__PURE__ */ jsx("a", { href: "tel:+254713869018", className: "whitespace-nowrap font-medium hover:text-[#ef2b10]", children: "+254713869018" }),
                /* @__PURE__ */ jsx("span", { className: "h-4 w-px bg-[#d9d9d9]", "aria-hidden": "true" }),
                /* @__PURE__ */ jsx("span", { className: "truncate", children: "Nairobi, Laxmi Plaza, 3rd Flr, Room No 5" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "ml-auto whitespace-nowrap text-sm font-medium text-[#111827]", children: "Open Mon-Sat 8am-6pm" })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: cn(
              "hidden h-[130px] bg-white lg:block",
              desktopNavPinned && "lg:hidden"
            ),
            children: /* @__PURE__ */ jsxs("div", { className: "site-desktop-width mx-auto flex h-full w-full items-center gap-10 px-10", children: [
              /* @__PURE__ */ jsx(Link, { to: "/", className: "min-w-[220px] text-[#111827]", children: /* @__PURE__ */ jsx("img", { src: "/logo.png", alt: "Shop ICT Kenya", className: "h-16 w-auto object-contain" }) }),
              /* @__PURE__ */ jsx("form", { onSubmit: onSearch, className: "mx-auto flex w-full max-w-[560px]", children: /* @__PURE__ */ jsxs("div", { className: "flex h-[52px] w-full items-center rounded-[4px] border border-[#eeeeee] bg-white pl-5 pr-3", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    value: search,
                    onChange: (e) => setSearch(e.target.value),
                    placeholder: "Search our store",
                    className: "h-full flex-1 bg-transparent text-[15px] text-[#111827] outline-none placeholder:text-[#9ca3af]"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "submit",
                    className: "grid h-10 w-10 place-items-center rounded-[4px] text-[#ef2b10]",
                    "aria-label": "Search",
                    children: /* @__PURE__ */ jsx(Search, { className: "h-5 w-5", strokeWidth: 1.9 })
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsxs("div", { className: "ml-auto flex items-center gap-3 text-[#111827]", children: [
                /* @__PURE__ */ jsxs(
                  Link,
                  {
                    to: "/wishlist",
                    className: "relative inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-[#f5f5f5]",
                    "aria-label": "Wishlist",
                    children: [
                      /* @__PURE__ */ jsx(Heart, { className: "h-5 w-5", strokeWidth: 1.8 }),
                      /* @__PURE__ */ jsx("span", { className: "absolute right-0.5 top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-[#ef2b10] px-1 text-[10px] font-semibold text-white", children: wishlistCount })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  Link,
                  {
                    to: "/cart",
                    className: "relative inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-[#f5f5f5]",
                    "aria-label": "Cart",
                    children: [
                      /* @__PURE__ */ jsx(ShoppingBag, { className: "h-5 w-5", strokeWidth: 1.8 }),
                      /* @__PURE__ */ jsx("span", { className: "absolute right-0.5 top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-[#ef2b10] px-1 text-[10px] font-semibold text-white", children: cartCount })
                    ]
                  }
                )
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: cn(
              "hidden h-[82px] border-t border-[#eeeeee] bg-white lg:block",
              desktopNavPinned && "fixed left-0 right-0 top-[66px] z-50 shadow-[0_10px_35px_-20px_rgba(17,24,39,0.28)]"
            ),
            children: /* @__PURE__ */ jsxs(
              "div",
              {
                className: "site-desktop-width relative mx-auto flex h-full w-full items-center px-10",
                onMouseLeave: () => setDesktopOpenMenu(null),
                children: [
                  desktopNavPinned ? /* @__PURE__ */ jsx(Link, { to: "/", className: "mr-8 shrink-0 text-[#111827]", children: /* @__PURE__ */ jsx("img", { src: "/logo.png", alt: "Shop ICT Kenya", className: "h-11 w-auto object-contain" }) }) : null,
                  /* @__PURE__ */ jsx("nav", { className: "mx-auto flex items-center gap-10", children: NAV.map((item, index) => /* @__PURE__ */ jsxs("div", { onMouseEnter: () => setDesktopOpenMenu(item.label), children: [
                    /* @__PURE__ */ jsxs(
                      Link,
                      {
                        to: "/shop",
                        search: { category: item.label },
                        className: "relative inline-flex h-[82px] items-center gap-2 text-[15px] font-medium text-[#111827] transition-colors hover:text-[#ef2b10]",
                        children: [
                          /* @__PURE__ */ jsx("span", { children: item.label }),
                          /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4", strokeWidth: 1.8 })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: cn(
                          "pointer-events-none absolute left-1/2 top-full z-50 h-[200px] w-[1120px] -translate-x-1/2 rounded-[4px] bg-white px-[30px] pb-0 pt-[20px] opacity-0 shadow-[0_12px_30px_rgba(0,0,0,0.08)] transition-all duration-300",
                          desktopOpenMenu === item.label && "pointer-events-auto translate-y-0 opacity-100",
                          desktopOpenMenu !== item.label && "translate-y-4"
                        ),
                        onMouseEnter: () => setDesktopOpenMenu(item.label),
                        children: /* @__PURE__ */ jsx("div", { className: "grid h-full grid-cols-3 gap-10", children: buildMegaColumns(item).map((column) => /* @__PURE__ */ jsx("div", { className: "flex flex-col", children: /* @__PURE__ */ jsx("div", { className: "space-y-[18px] pt-1", children: column.items.map((menuItem) => /* @__PURE__ */ jsxs(
                          Link,
                          {
                            to: "/shop",
                            search: { category: item.label, subcategory: menuItem.label },
                            className: "flex items-center gap-2 text-[17px] text-[#777777] transition-colors hover:text-[#ef2b10]",
                            children: [
                              /* @__PURE__ */ jsx("span", { children: menuItem.label }),
                              menuItem.badge ? /* @__PURE__ */ jsx(
                                "span",
                                {
                                  className: cn(
                                    "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white",
                                    menuItem.badge.tone === "dark" ? "bg-black" : "bg-[#ef2b10]"
                                  ),
                                  children: menuItem.badge.label
                                }
                              ) : null
                            ]
                          },
                          menuItem.label
                        )) }) }, column.heading)) })
                      }
                    )
                  ] }, item.label)) }),
                  desktopNavPinned ? /* @__PURE__ */ jsxs("div", { className: "ml-8 flex shrink-0 items-center gap-3 text-[#111827]", children: [
                    /* @__PURE__ */ jsxs(
                      Link,
                      {
                        to: "/wishlist",
                        className: "relative inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-[#f5f5f5]",
                        "aria-label": "Wishlist",
                        children: [
                          /* @__PURE__ */ jsx(Heart, { className: "h-5 w-5", strokeWidth: 1.8 }),
                          /* @__PURE__ */ jsx("span", { className: "absolute right-0.5 top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-[#ef2b10] px-1 text-[10px] font-semibold text-white", children: wishlistCount })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxs(
                      Link,
                      {
                        to: "/cart",
                        className: "relative inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-[#f5f5f5]",
                        "aria-label": "Cart",
                        children: [
                          /* @__PURE__ */ jsx(ShoppingBag, { className: "h-5 w-5", strokeWidth: 1.8 }),
                          /* @__PURE__ */ jsx("span", { className: "absolute right-0.5 top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-[#ef2b10] px-1 text-[10px] font-semibold text-white", children: cartCount })
                        ]
                      }
                    )
                  ] }) : null
                ]
              }
            )
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "lg:hidden", children: [
          /* @__PURE__ */ jsx("div", { className: "flex h-[28px] items-center overflow-hidden border-b border-[#eeeeee] bg-[#f8f8f8]", children: /* @__PURE__ */ jsx("div", { className: "mobile-location-marquee whitespace-nowrap px-4 text-[11px] font-medium text-[#4b5563]", children: "Nairobi, Laxmi Plaza, 3rd Flr, Room No 5 | +254713869018" }) }),
          /* @__PURE__ */ jsxs("div", { className: "mx-auto grid h-[84px] w-full max-w-[1270px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 sm:px-6", children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                to: "/",
                className: "justify-self-start text-[#111827]",
                onClick: handleHeaderLogoClick,
                onPointerDown: startAdminShortcutPress,
                onPointerUp: cancelAdminShortcutPress,
                onPointerLeave: cancelAdminShortcutPress,
                onPointerCancel: cancelAdminShortcutPress,
                children: /* @__PURE__ */ jsx("img", { src: "/logo.png", alt: "Shop ICT Kenya", className: "h-11 w-auto object-contain" })
              }
            ),
            /* @__PURE__ */ jsx("form", { onSubmit: onSearch, className: "mx-auto min-w-0 w-full max-w-[180px] sm:max-w-[220px]", children: /* @__PURE__ */ jsxs("div", { className: "flex h-10 items-center rounded-full border border-[#eeeeee] bg-white pl-3 pr-2", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  value: search,
                  onChange: (e) => setSearch(e.target.value),
                  placeholder: `Search ${searchPlaceholders[placeholderIndex]}`,
                  className: "h-full min-w-0 flex-1 bg-transparent text-[13px] text-[#111827] outline-none placeholder:text-[#9ca3af]"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "submit",
                  className: "grid h-8 w-8 shrink-0 place-items-center rounded-full text-[#ef2b10]",
                  "aria-label": "Search",
                  children: /* @__PURE__ */ jsx(Search, { className: "h-4 w-4", strokeWidth: 1.9 })
                }
              )
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "justify-self-end text-[#111827]", children: /* @__PURE__ */ jsx(
              "button",
              {
                className: "inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[#f5f5f5]",
                onClick: () => setOpen(true),
                "aria-label": "Menu",
                children: /* @__PURE__ */ jsx(Menu, { className: "h-5 w-5", strokeWidth: 1.9 })
              }
            ) })
          ] })
        ] }),
        open ? /* @__PURE__ */ jsx(
          "div",
          {
            className: "fixed inset-0 z-[80] bg-black/30 backdrop-blur-[2px] lg:hidden",
            onClick: () => setOpen(false),
            children: /* @__PURE__ */ jsxs(
              "div",
              {
                className: "absolute right-0 top-0 h-full w-[86vw] max-w-sm overflow-y-auto bg-white px-6 pb-8 pt-6 shadow-[0_24px_60px_-24px_rgba(17,24,39,0.35)]",
                onClick: (e) => e.stopPropagation(),
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "mb-8 flex items-center justify-between", children: [
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        className: "rounded-md",
                        onClick: handleDrawerLogoClick,
                        onPointerDown: startAdminShortcutPress,
                        onPointerUp: cancelAdminShortcutPress,
                        onPointerLeave: cancelAdminShortcutPress,
                        onPointerCancel: cancelAdminShortcutPress,
                        children: /* @__PURE__ */ jsx("img", { src: "/logo.png", alt: "Shop ICT Kenya", className: "h-12 w-auto object-contain" })
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        className: "inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#f5f5f5]",
                        onClick: () => setOpen(false),
                        children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5 text-[#111827]", strokeWidth: 1.9 })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-[3px] border border-[#dddddd] bg-white", children: [
                    /* @__PURE__ */ jsx("div", { className: "border-b border-[#dddddd] bg-[#f7f7f7] px-4 py-3", children: /* @__PURE__ */ jsx("h2", { className: "text-sm font-bold text-[#222222]", children: "Categories" }) }),
                    /* @__PURE__ */ jsx("nav", { children: NAV.map((item) => /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", { className: "border-b border-[#dddddd]", children: [
                      (() => {
                        const isActiveCategory = routeSearch.category === item.label;
                        const isOpen = mobileOpenMenu === item.label;
                        return /* @__PURE__ */ jsxs(
                          "button",
                          {
                            type: "button",
                            onClick: () => setMobileOpenMenu((current) => current === item.label ? null : item.label),
                            className: cn(
                              "flex h-[38px] w-full items-center justify-between px-3 text-left text-sm font-medium transition-colors",
                              isActiveCategory || isOpen ? "bg-[#e92d48] text-white" : "text-[#4b5563] hover:bg-[#fafafa]"
                            ),
                            children: [
                              /* @__PURE__ */ jsx("span", { children: item.label }),
                              /* @__PURE__ */ jsx(
                                ChevronDown,
                                {
                                  className: cn(
                                    "h-4 w-4 transition-transform duration-300",
                                    isOpen && "rotate-180"
                                  ),
                                  strokeWidth: 1.8
                                }
                              )
                            ]
                          }
                        );
                      })(),
                      /* @__PURE__ */ jsx(
                        "div",
                        {
                          className: cn(
                            "grid overflow-hidden transition-all duration-300",
                            mobileOpenMenu === item.label ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                          ),
                          children: /* @__PURE__ */ jsx("div", { className: "min-h-0 bg-white", children: /* @__PURE__ */ jsx("div", { children: item.items.map((subLabel) => /* @__PURE__ */ jsx(
                            Link,
                            {
                              to: "/shop",
                              search: { category: item.label, subcategory: subLabel },
                              onClick: () => setOpen(false),
                              className: "flex h-[38px] items-center border-t border-[#dddddd] px-3 pl-6 text-left text-sm text-[#4b5563] transition-colors hover:bg-[#fafafa] hover:text-[#ef2b10]",
                              children: /* @__PURE__ */ jsx("span", { children: subLabel })
                            },
                            subLabel
                          )) }) })
                        }
                      )
                    ] }) }, item.label)) })
                  ] }),
                  /* @__PURE__ */ jsx("nav", { className: "mt-4 border-t border-[#eeeeee] pt-3", children: /* @__PURE__ */ jsx(
                    Link,
                    {
                      to: "/wishlist",
                      onClick: () => setOpen(false),
                      className: "block rounded-[4px] px-3 py-3 text-[15px] font-medium text-[#111827] hover:bg-[#f5f5f5]",
                      children: "Wishlist"
                    }
                  ) })
                ]
              }
            )
          }
        ) : null
      ]
    }
  );
}
const TRUSTED_DISTRIBUTORS = [
  { name: "hp", brandColor: "group-hover:text-[#0096D6]", markClassName: "text-lg font-bold" },
  { name: "Lenovo", brandColor: "group-hover:text-[#E2231A]", markClassName: "text-sm font-bold" },
  { name: "DELL", brandColor: "group-hover:text-[#0672CE]", markClassName: "text-sm font-bold" },
  { name: "SAMSUNG", brandColor: "group-hover:text-[#1428A0]", markClassName: "text-[11px] font-bold" },
  { name: "EPSON", brandColor: "group-hover:text-[#003399]", markClassName: "text-xs font-bold" },
  { name: "Canon", brandColor: "group-hover:text-[#CC0000]", markClassName: "text-base font-bold" },
  { name: "acer", brandColor: "group-hover:text-[#80C41C]", markClassName: "text-base font-bold" },
  { name: "Apple", brandColor: "group-hover:text-[#111111]", markClassName: "text-sm font-semibold" },
  { name: "Logitech", brandColor: "group-hover:text-[#00B8FC]", markClassName: "text-[11px] font-bold" }
];
function TikTokIcon({ className }) {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      "aria-hidden": "true",
      viewBox: "0 0 24 24",
      fill: "currentColor",
      className,
      children: /* @__PURE__ */ jsx("path", { d: "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.12v12.42a2.62 2.62 0 1 1-2.62-2.62c.23 0 .45.03.67.08V8.72a5.76 5.76 0 0 0-.67-.04A5.74 5.74 0 1 0 15.82 14V8.73a7.92 7.92 0 0 0 4.63 1.48V7.13c-.3 0-.59-.15-.86-.44Z" })
    }
  );
}
function Footer() {
  const path = useRouterState({ select: (state) => state.location.pathname });
  const findUsSpacingClass = /^\/products\/[^/]+$/.test(path) ? "mt-[20px]" : "mt-20";
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("section", { className: `${findUsSpacingClass} border-t bg-background`, children: /* @__PURE__ */ jsxs("div", { className: "site-desktop-width mx-auto px-6 py-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold tracking-tight", children: "Find Us" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Visit our location or open directions in Google Maps." })
        ] }),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "https://maps.app.goo.gl/7A3d34gMimEMCx6u6",
            target: "_blank",
            rel: "noreferrer",
            className: "inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
            children: "Get Direction"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "https://maps.app.goo.gl/7A3d34gMimEMCx6u6",
          target: "_blank",
          rel: "noreferrer",
          className: "block overflow-hidden rounded-3xl border shadow-soft",
          children: /* @__PURE__ */ jsx(
            "iframe",
            {
              title: "Shop ICT Gadgets location",
              src: "https://www.google.com/maps?q=Laxmi%20Plaza%20Nairobi&z=16&output=embed",
              className: "h-[360px] w-full",
              loading: "lazy",
              referrerPolicy: "no-referrer-when-downgrade"
            }
          )
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxs("footer", { className: "border-t bg-surface", children: [
      /* @__PURE__ */ jsxs("div", { className: "site-desktop-width mx-auto grid gap-10 px-6 py-14 md:grid-cols-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Dealers in IT products, Electronics, Accessories, Phones, Homewear, Servers, Networking Accessories, etc." }),
          /* @__PURE__ */ jsx("div", { className: "mt-4 flex gap-2", children: [
            { Icon: Facebook, href: "https://www.facebook.com/Shopictgadgets", label: "Facebook" },
            { Icon: Instagram, href: "https://www.instagram.com/jamesndiba_/", label: "Instagram" },
            { Icon: TikTokIcon, href: "https://www.tiktok.com/@shop.ict.gadgets", label: "TikTok" }
          ].map(({ Icon, href, label }) => /* @__PURE__ */ jsx(
            "a",
            {
              href,
              target: "_blank",
              rel: "noreferrer",
              "aria-label": label,
              className: "grid h-9 w-9 place-items-center rounded-full border hover:bg-background",
              children: /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" })
            },
            label
          )) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h4", { className: "mb-3 text-sm font-semibold", children: "Shop" }),
          /* @__PURE__ */ jsxs("ul", { className: "space-y-2 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/shop", children: "All Products" }) }),
            CATEGORY_TREE.map((category) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/shop", search: { category: category.label }, children: category.label }) }, category.label))
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h4", { className: "mb-3 text-sm font-semibold", children: "Reach Us" }),
          /* @__PURE__ */ jsxs("ul", { className: "space-y-2 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Phone, { className: "h-3.5 w-3.5" }),
              " +254713869018"
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Mail, { className: "h-3.5 w-3.5" }),
              " ictgadgetsshop@gmail.com"
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(MapPin, { className: "h-3.5 w-3.5" }),
              " Nairobi, Kenya"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h4", { className: "mb-3 text-sm font-semibold", children: "Trusted Distributor For" }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-x-3 gap-y-3", "aria-label": "Trusted distributor brands", children: TRUSTED_DISTRIBUTORS.map(({ name, brandColor, markClassName }) => /* @__PURE__ */ jsx(
            "div",
            {
              className: "group flex h-7 min-w-0 items-center justify-start",
              children: /* @__PURE__ */ jsx("span", { className: `${markClassName} text-[#9CA3AF] transition-colors duration-200 ${brandColor}`, children: name })
            },
            name
          )) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "border-t py-5 text-center text-xs text-muted-foreground", children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Shop ICT Gadgets. All rights reserved."
      ] })
    ] })
  ] });
}
const DEFAULT_WHATSAPP_NUMBER = "+254713869018";
function useWhatsAppNumber() {
  return useQuery({
    queryKey: ["whatsapp-number"],
    queryFn: () => fetchWhatsAppNumber(),
    staleTime: 1e3 * 60 * 30,
    gcTime: 1e3 * 60 * 60,
    refetchOnWindowFocus: false
  });
}
const formatKES = (n) => "KES " + new Intl.NumberFormat("en-KE", { maximumFractionDigits: 0 }).format(n);
const LAST_VISITED_ROUTE_KEY = "shop-ict:last-route:v1";
const PENDING_RETURN_ROUTE_KEY = "shop-ict:pending-return:v1";
const PENDING_RETURN_TTL = 1e3 * 60 * 30;
function buildWaMessage(items, extra) {
  const lines = items.map((i) => `• ${i.title} x${i.quantity} — ${formatKES(i.price * i.quantity)}`);
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  return [
    "Hello Shop ICT Gadgets, I would like to order:",
    "",
    ...lines,
    "",
    `Total: ${formatKES(total)}`,
    extra ? "" : void 0,
    extra
  ].filter(Boolean).join("\n");
}
function waLink(number, message) {
  const num = number.replace(/[^\d]/g, "");
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
}
function inquireSingle(number, title, price) {
  return waLink(number, buildWaMessage([{ title, quantity: 1, price }]));
}
function getCurrentAppUrl() {
  if (typeof window === "undefined") return "/";
  return `${window.location.pathname}${window.location.search}${window.location.hash}` || "/";
}
function safeReadLocalStorage$1(key) {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}
function safeRemoveLocalStorage$1(key) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
  }
}
function writePersistedRoute(key, url) {
  if (typeof window === "undefined") return;
  try {
    const value = {
      url,
      timestamp: Date.now()
    };
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
  }
}
function readPersistedRoute(key) {
  if (typeof window === "undefined") return null;
  try {
    const raw = safeReadLocalStorage$1(key);
    if (!raw) return null;
    const value = JSON.parse(raw);
    if (!value?.url || !value?.timestamp) return null;
    return value;
  } catch {
    safeRemoveLocalStorage$1(key);
    return null;
  }
}
function isStandalonePwa() {
  if (typeof window === "undefined") return false;
  const iosStandalone = "standalone" in window.navigator && Boolean(window.navigator.standalone);
  const displayModeStandalone = typeof window.matchMedia === "function" && window.matchMedia("(display-mode: standalone)").matches;
  return iosStandalone || displayModeStandalone;
}
function persistLastVisitedRoute(url = getCurrentAppUrl()) {
  writePersistedRoute(LAST_VISITED_ROUTE_KEY, url);
}
function markPendingExternalReturn(url = getCurrentAppUrl()) {
  persistLastVisitedRoute(url);
  writePersistedRoute(PENDING_RETURN_ROUTE_KEY, url);
}
function consumePendingExternalReturn(currentUrl = getCurrentAppUrl()) {
  if (typeof window === "undefined") return null;
  const pending = readPersistedRoute(PENDING_RETURN_ROUTE_KEY);
  if (!pending) return null;
  safeRemoveLocalStorage$1(PENDING_RETURN_ROUTE_KEY);
  if (!isStandalonePwa()) return null;
  if (currentUrl !== "/" && currentUrl !== "/index.html") return null;
  if (Date.now() - pending.timestamp > PENDING_RETURN_TTL) return null;
  if (!pending.url || pending.url === "/" || pending.url === currentUrl) return null;
  return pending.url;
}
function openWhatsAppConversation(url) {
  if (typeof window === "undefined") return;
  markPendingExternalReturn();
  if (isStandalonePwa()) {
    window.location.assign(url);
    return;
  }
  const popup = window.open(url, "_blank", "noopener,noreferrer");
  if (!popup) {
    window.location.assign(url);
  }
}
function handleWhatsAppLinkClick(event, url) {
  if (event.defaultPrevented) return;
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  openWhatsAppConversation(url);
}
function MobileBottomNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { cartCount, wishlist } = useStore();
  const { data: wa = DEFAULT_WHATSAPP_NUMBER } = useWhatsAppNumber();
  const [showWhatsAppPrompt, setShowWhatsAppPrompt] = useState(false);
  useEffect(() => {
    let seenPrompt = "1";
    if (typeof window !== "undefined") {
      try {
        seenPrompt = window.sessionStorage.getItem("wa-prompt-dismissed") ?? "";
      } catch {
        seenPrompt = "1";
      }
    }
    if (seenPrompt) return;
    const showTimer = window.setTimeout(() => {
      setShowWhatsAppPrompt(true);
    }, 3e3);
    return () => {
      window.clearTimeout(showTimer);
    };
  }, []);
  if (path.startsWith("/admin")) return null;
  const items = [
    { to: "/wishlist", icon: Heart, label: "Wishlist", badge: wishlist.length, badgeClassName: "right-1 top-1" },
    { to: "/cart", icon: ShoppingCart, label: "Cart", badge: cartCount },
    { href: waLink(wa, "Hello Shop ICT Gadgets, I have a question."), icon: MessageCircle, label: "WhatsApp" }
  ];
  return /* @__PURE__ */ jsx("nav", { className: "fixed inset-x-0 bottom-3 z-40 mx-auto w-[calc(100%-2.75rem)] max-w-[21rem] lg:hidden", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-around rounded-full border border-[#ececec] bg-white px-1.5 py-1.5 shadow-elegant", children: items.map((it, idx) => {
    const active = it.to && (it.to === "/" ? path === "/" : path.startsWith(it.to));
    const Icon = it.icon;
    const inner = /* @__PURE__ */ jsxs("span", { className: cn("relative grid place-items-center rounded-full px-2.5 py-1.5 transition", active && "text-primary"), children: [
      /* @__PURE__ */ jsx(Icon, { className: cn("h-4.5 w-4.5", active && "fill-primary text-primary") }),
      it.badge ? /* @__PURE__ */ jsx("span", { className: cn("absolute -right-0.5 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground", it.badgeClassName), children: it.badge }) : null,
      /* @__PURE__ */ jsx("span", { className: "mt-0.5 text-[9px] font-medium", children: it.label })
    ] });
    return /* @__PURE__ */ jsxs("div", { className: "relative flex flex-1 justify-center", children: [
      it.href && showWhatsAppPrompt ? /* @__PURE__ */ jsxs("div", { className: "absolute bottom-full mb-3 w-[190px] rounded-2xl bg-white px-3 py-2 text-center text-[11px] font-medium text-[#111827] shadow-[0_18px_40px_-20px_rgba(17,24,39,0.35)]", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            "aria-label": "Close WhatsApp prompt",
            className: "absolute right-2 top-2 inline-flex h-5 w-5 items-center justify-center rounded-full text-[#9ca3af] transition-colors hover:bg-[#f5f5f5] hover:text-[#111827]",
            onClick: () => {
              setShowWhatsAppPrompt(false);
              try {
                window.sessionStorage.setItem("wa-prompt-dismissed", "true");
              } catch {
              }
            },
            children: /* @__PURE__ */ jsx(X, { className: "h-3.5 w-3.5" })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "pr-4", children: "Need help? Chat with us on WhatsApp." }),
        /* @__PURE__ */ jsx("span", { className: "absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 rotate-45 bg-white", "aria-hidden": "true" })
      ] }) : null,
      it.href ? /* @__PURE__ */ jsx(
        "a",
        {
          href: it.href,
          onClick: (event) => {
            setShowWhatsAppPrompt(false);
            handleWhatsAppLinkClick(event, it.href);
          },
          children: inner
        }
      ) : /* @__PURE__ */ jsx(Link, { to: it.to, onClick: () => setShowWhatsAppPrompt(false), children: inner })
    ] }, idx);
  }) }) });
}
function DesktopWhatsAppFloat() {
  const { data: wa = DEFAULT_WHATSAPP_NUMBER } = useWhatsAppNumber();
  const href = waLink(wa, "Hello Shop ICT Gadgets, I need help with a product.");
  return /* @__PURE__ */ jsxs("div", { className: "fixed bottom-6 right-6 z-40 hidden items-end gap-3 lg:flex", children: [
    /* @__PURE__ */ jsx("div", { className: "rounded-full bg-white px-4 py-2 text-sm font-medium text-[#111827] shadow-[0_20px_45px_-20px_rgba(17,24,39,0.28)]", children: "Need help?" }),
    /* @__PURE__ */ jsx(
      "a",
      {
        href,
        onClick: (event) => handleWhatsAppLinkClick(event, href),
        "aria-label": "Message us on WhatsApp",
        className: "grid h-14 w-14 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_20px_45px_-18px_rgba(37,211,102,0.7)] transition-transform duration-200 hover:scale-[1.03] hover:bg-[#1fb95a]",
        children: /* @__PURE__ */ jsx("img", { src: "/whatsapp.svg", alt: "", "aria-hidden": "true", className: "h-7 w-7" })
      }
    )
  ] });
}
const CATEGORIES = [
  { label: "Laptop", value: "laptops", icon: Laptop },
  { label: "Monitor", value: "monitors", icon: Monitor },
  { label: "Smartphone", value: "smartphones", icon: Smartphone },
  { label: "Printer", value: "printers", icon: Printer }
];
const BRANDS_BY_CATEGORY = {
  laptops: ["HP", "Dell", "Lenovo", "Apple", "Acer", "Asus", "Microsoft"],
  monitors: ["HP", "Dell", "Lenovo", "Samsung", "LG", "Acer", "Asus"],
  smartphones: ["Apple", "Samsung", "Xiaomi", "Oppo", "Tecno", "Infinix", "Huawei"],
  printers: ["HP", "Epson", "Canon", "Brother", "Kyocera", "Rongta", "Zebra"]
};
const CATEGORY_LABEL_BY_VALUE = {
  laptops: "Laptops",
  monitors: "Monitors",
  smartphones: "Smartphones",
  printers: "Printers"
};
const LAPTOP_SPEC_OPTIONS = {
  ram: ["4GB RAM", "8GB RAM", "16GB RAM", "32GB RAM", "64GB RAM"],
  storage: ["256GB SSD", "512GB SSD", "1TB SSD", "2TB SSD"]
};
const SPEC_OPTIONS = {
  laptops: [
    { key: "ram", label: "RAM", options: LAPTOP_SPEC_OPTIONS.ram },
    { key: "storage", label: "Storage", options: LAPTOP_SPEC_OPTIONS.storage }
  ],
  monitors: [
    { key: "size", label: "Size", options: ["19 inch", "22 inch", "24 inch", "27 inch", "32 inch"] },
    { key: "resolution", label: "Resolution", options: ["HD", "Full HD", "2K", "4K UHD"] }
  ],
  smartphones: [
    { key: "ram", label: "RAM", options: ["3GB RAM", "4GB RAM", "6GB RAM", "8GB RAM", "12GB RAM"] },
    { key: "storage", label: "Storage", options: ["64GB", "128GB", "256GB", "512GB", "1TB"] }
  ],
  printers: [
    { key: "printType", label: "Print type", options: ["Laser", "Inkjet"] },
    { key: "printFunction", label: "Function", options: ["Print only", "Print scan copy"] }
  ]
};
function ProductFinderFloat() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("laptops");
  const [brands, setBrands] = useState([]);
  const [specs, setSpecs] = useState({});
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const brandOptions = useMemo(() => BRANDS_BY_CATEGORY[category], [category]);
  const panelWidthClass = category === "printers" ? "max-w-[330px]" : category === "monitors" ? "max-w-[350px]" : category === "smartphones" ? "max-w-[360px]" : "max-w-[370px]";
  const toggleBrand = (brand) => {
    setBrands(
      (current) => current.includes(brand) ? current.filter((item) => item !== brand) : [...current, brand]
    );
  };
  const selectCategory = (nextCategory) => {
    setCategory(nextCategory);
    setBrands((current) => current.filter((brand) => BRANDS_BY_CATEGORY[nextCategory].includes(brand)));
    setSpecs({});
  };
  const searchProducts = () => {
    const specTerms = Object.values(specs).filter(Boolean).join(" ");
    navigate({
      to: "/shop",
      search: {
        category: CATEGORY_LABEL_BY_VALUE[category],
        q: specTerms || void 0,
        brands: brands.length > 0 ? brands.join(",") : void 0,
        minPrice: minAmount.trim() || void 0,
        maxPrice: maxAmount.trim() || void 0
      }
    });
    setOpen(false);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    open ? /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 z-[65] bg-black/35 px-3 pb-24 pt-4 backdrop-blur-[2px] lg:flex lg:items-end lg:justify-end lg:bg-transparent lg:p-6",
        onClick: () => setOpen(false),
        children: /* @__PURE__ */ jsxs(
          "div",
          {
            className: `mx-auto w-fit min-w-[300px] max-w-[calc(100vw-1.5rem)] rounded-[16px] border border-[#ececec] bg-white p-3 shadow-[0_24px_80px_-28px_rgba(17,24,39,0.45)] transition-[max-width] duration-200 lg:mx-0 lg:mb-20 ${panelWidthClass}`,
            onClick: (event) => event.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-center justify-between gap-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "grid h-8 w-8 place-items-center rounded-full bg-[#E30613] text-white", children: /* @__PURE__ */ jsx(Bot, { className: "h-4 w-4" }) }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-[#111827]", children: "Product finder" }),
                    /* @__PURE__ */ jsx("p", { className: "text-[11px] text-[#6b7280]", children: "Choose what you need and search." })
                  ] })
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setOpen(false),
                    className: "grid h-8 w-8 place-items-center rounded-full text-[#6b7280] hover:bg-[#f5f5f5] hover:text-[#111827]",
                    "aria-label": "Close product finder",
                    children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "mb-1.5 block text-[11px] font-semibold text-[#374151]", children: "Item" }),
                  /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 gap-1.5", children: CATEGORIES.map((item) => {
                    const Icon = item.icon;
                    const active = item.value === category;
                    return /* @__PURE__ */ jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => selectCategory(item.value),
                        className: `flex min-w-0 flex-col items-center gap-1 rounded-[9px] border px-1.5 py-1.5 text-center text-[10px] font-medium transition ${active ? "border-[#E30613] bg-[#fff1f2] text-[#E30613]" : "border-[#e5e7eb] bg-white text-[#374151] hover:bg-[#f9fafb]"}`,
                        children: [
                          /* @__PURE__ */ jsx(Icon, { className: "h-3.5 w-3.5" }),
                          /* @__PURE__ */ jsx("span", { className: "leading-tight", children: item.label })
                        ]
                      },
                      item.value
                    );
                  }) })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "mb-1.5 block text-[11px] font-semibold text-[#374151]", children: "Brand" }),
                  /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: brandOptions.map((brand) => {
                    const active = brands.includes(brand);
                    return /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => toggleBrand(brand),
                        className: `rounded-full border px-2.5 py-1 text-[11px] font-medium transition ${active ? "border-[#E30613] bg-[#E30613] text-white" : "border-[#e5e7eb] bg-white text-[#374151] hover:bg-[#f9fafb]"}`,
                        children: brand
                      },
                      brand
                    );
                  }) })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "mb-1.5 block text-[11px] font-semibold text-[#374151]", children: "Specs" }),
                  /* @__PURE__ */ jsx("div", { className: "space-y-2", children: SPEC_OPTIONS[category].map((spec) => /* @__PURE__ */ jsx(
                    FinderOptionChips,
                    {
                      label: spec.label,
                      value: specs[spec.key] ?? "",
                      options: spec.options,
                      onChange: (value) => setSpecs((current) => ({
                        ...current,
                        [spec.key]: value
                      }))
                    },
                    spec.key
                  )) })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "mb-1.5 block text-[11px] font-semibold text-[#374151]", children: "Amount range" }),
                  /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-1.5", children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        value: minAmount,
                        onChange: (event) => setMinAmount(event.target.value.replace(/[^\d]/g, "")),
                        inputMode: "numeric",
                        placeholder: "Min",
                        className: "h-9 rounded-[9px] border border-[#e5e7eb] px-2.5 text-sm outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/15"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        value: maxAmount,
                        onChange: (event) => setMaxAmount(event.target.value.replace(/[^\d]/g, "")),
                        inputMode: "numeric",
                        placeholder: "Max",
                        className: "h-9 rounded-[9px] border border-[#e5e7eb] px-2.5 text-sm outline-none focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/15"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: searchProducts,
                    className: "inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-[#E30613] px-4 text-sm font-semibold text-white transition hover:bg-[#c70511]",
                    children: [
                      /* @__PURE__ */ jsx(Search, { className: "h-4 w-4" }),
                      "Search"
                    ]
                  }
                )
              ] })
            ]
          }
        )
      }
    ) : null,
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => setOpen(true),
        className: "fixed bottom-[10.5rem] right-4 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#E30613] text-white transition hover:bg-[#c70511] lg:bottom-24 lg:right-6",
        "aria-label": "Open product finder",
        children: /* @__PURE__ */ jsx(SlidersHorizontal, { className: "h-5.5 w-5.5" })
      }
    )
  ] });
}
function FinderOptionChips({
  label,
  value,
  options,
  onChange
}) {
  return /* @__PURE__ */ jsxs("div", { className: "grid gap-1", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsx("span", { className: "text-[11px] font-medium text-[#6b7280]", children: label }),
      value ? /* @__PURE__ */ jsx("button", { type: "button", onClick: () => onChange(""), className: "text-[11px] font-medium text-[#E30613]", children: "Any" }) : null
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: options.map((option) => /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => onChange(value === option ? "" : option),
        className: `rounded-full border px-2.5 py-1 text-[11px] font-medium transition ${value === option ? "border-[#E30613] bg-[#E30613] text-white" : "border-[#e5e7eb] bg-white text-[#374151] hover:bg-[#f9fafb]"}`,
        children: option
      },
      option
    )) })
  ] });
}
const INSTALL_STORAGE_KEY = "shop-ict-pwa-installed";
const AUTO_HIDE_MS = 5e3;
function isMobileDevice() {
  return window.matchMedia("(max-width: 767px)").matches || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}
function isIosSafari() {
  const ua = navigator.userAgent;
  const isIos = /iPad|iPhone|iPod/i.test(ua) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  const isSafari = /Safari/i.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/i.test(ua);
  return isIos && isSafari;
}
function isStandalone() {
  const navigatorWithStandalone = navigator;
  return window.matchMedia("(display-mode: standalone)").matches || navigatorWithStandalone.standalone === true;
}
function PwaInstallPrompt() {
  const [installEvent, setInstallEvent] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [hiddenByScroll, setHiddenByScroll] = useState(false);
  const iosSafari = typeof window !== "undefined" && isIosSafari();
  useEffect(() => {
    if (!isMobileDevice() || isStandalone()) return;
    try {
      if (window.localStorage.getItem(INSTALL_STORAGE_KEY) === "true") return;
    } catch {
    }
    const showTimer = window.setTimeout(() => {
      setHiddenByScroll(false);
      setShowPrompt(true);
    }, 400);
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setHiddenByScroll(false);
      setShowPrompt(true);
      setInstallEvent(event);
    };
    const handleInstalled = () => {
      setInstallEvent(null);
      setShowPrompt(false);
      try {
        window.localStorage.setItem(INSTALL_STORAGE_KEY, "true");
      } catch {
      }
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.clearTimeout(showTimer);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);
  useEffect(() => {
    if (!showPrompt || hiddenByScroll) return;
    const autoHideTimer = window.setTimeout(() => {
      setShowPrompt(false);
    }, AUTO_HIDE_MS);
    const hideOnScroll = () => {
      window.clearTimeout(autoHideTimer);
      setHiddenByScroll(true);
    };
    window.addEventListener("scroll", hideOnScroll, { passive: true, once: true });
    return () => {
      window.clearTimeout(autoHideTimer);
      window.removeEventListener("scroll", hideOnScroll);
    };
  }, [hiddenByScroll, showPrompt]);
  const dismiss = () => {
    setInstallEvent(null);
    setShowPrompt(false);
  };
  const install = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    setInstallEvent(null);
    setShowPrompt(false);
    if (choice.outcome !== "accepted") {
      dismiss();
    }
  };
  if (!showPrompt || hiddenByScroll) return null;
  return /* @__PURE__ */ jsxs(
    "aside",
    {
      role: "dialog",
      "aria-label": "Install Shop ICT Gadgets app",
      className: "fixed right-3 top-[calc(env(safe-area-inset-top)+0.75rem)] z-50 w-[calc(100%-1.5rem)] max-w-[320px] overflow-hidden rounded-[8px] border border-[#e5e7eb] bg-white p-2.5 shadow-[0_10px_28px_rgba(15,23,42,0.18)] md:hidden",
      children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: dismiss,
            className: "absolute right-1.5 top-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-[#6b7280] hover:bg-[#f3f4f6]",
            "aria-label": "Dismiss install prompt",
            children: /* @__PURE__ */ jsx(X, { className: "h-3.5 w-3.5" })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2.5 pr-7", children: [
          /* @__PURE__ */ jsx("img", { src: "/icon-192.png", alt: "", className: "h-9 w-9 shrink-0 rounded-[7px]" }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsx("p", { className: "text-[13px] font-semibold leading-5 text-[#111827]", children: "Install Shop ICT Gadgets" }),
            installEvent ? /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => void install(),
                className: "mt-1.5 inline-flex h-8 items-center gap-1.5 rounded-[6px] bg-[#e30613] px-3 text-xs font-semibold text-white transition-colors hover:bg-[#c70511]",
                children: [
                  /* @__PURE__ */ jsx(Download, { className: "h-3.5 w-3.5" }),
                  "Install app"
                ]
              }
            ) : /* @__PURE__ */ jsx("p", { className: "mt-1 flex items-center gap-1 text-[11px] leading-4 text-[#4b5563]", children: iosSafari ? /* @__PURE__ */ jsxs(Fragment, { children: [
              "Tap ",
              /* @__PURE__ */ jsx(Share, { className: "inline h-3.5 w-3.5 shrink-0" }),
              " then Add to Home Screen."
            ] }) : /* @__PURE__ */ jsx(Fragment, { children: "Use your browser menu to add this app to your home screen." }) })
          ] })
        ] })
      ]
    }
  );
}
const verifyAdminLoginServer = createServerFn({
  method: "POST"
}).handler(createSsrRpc("41fee207645975e817f77250d12bf848ae694b5d97c870d3429bb85a7609680e"));
const getAdminAccessConfigServer = createServerFn({
  method: "GET"
}).handler(createSsrRpc("1cbfcd8b593dcbe072fe46cbb3a2d34050caf7ffefc6ec0329e24759ba469fd5"));
const verifyAdminAccessCodeServer = createServerFn({
  method: "POST"
}).handler(createSsrRpc("72410f6112840824c39f6bc513b6d31314c6c2b3e865c12b5310474486aa9667"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("246f149975ba7649055bed37d4935c42d035566fdd7cabe2b81dd8e929c30d05"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("5930ecacf08b66fc5b123ed5e63cc7176ee93d74dc5e1c15cb535607b8620b6f"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("d6e0c2f49f127a01cbee1133a1f0098fc84c89322ef8e6d8f47a9c64cbf34af0"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("1da38ae56f491bdc5a5b0fe59b286182b0bd4e8ee5616bd97f25387c2de337f1"));
async function verifyAdminLogin(email, password) {
  return verifyAdminLoginServer({
    data: {
      email,
      password
    }
  });
}
async function getAdminAccessConfig() {
  return getAdminAccessConfigServer();
}
async function verifyAdminAccessCode(code) {
  return verifyAdminAccessCodeServer({
    data: {
      code
    }
  });
}
const STORAGE_KEY = "shopict_admin_session";
const SESSION_TTL_MS = 5 * 24 * 60 * 60 * 1e3;
function readStoredValue(key) {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key) ?? window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}
function writeStoredValue(key, value) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
  }
}
function removeStoredValue(key) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
    window.sessionStorage.removeItem(key);
  } catch {
  }
}
const Ctx = createContext({
  user: null,
  loading: true,
  isAdmin: false,
  role: null,
  isSuperAdmin: false,
  signIn: async () => {
  },
  signOut: async () => {
  }
});
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [sessionExpiresAt, setSessionExpiresAt] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = readStoredValue(STORAGE_KEY);
      if (raw) {
        const parsed = normalizeStoredSession(JSON.parse(raw));
        if (parsed) {
          setUser(parsed.user);
          setSessionExpiresAt(parsed.expiresAt);
          writeStoredValue(STORAGE_KEY, JSON.stringify(parsed));
        } else {
          removeStoredValue(STORAGE_KEY);
        }
      }
    } catch {
      removeStoredValue(STORAGE_KEY);
    } finally {
      setLoading(false);
    }
    const onStorage = (event) => {
      if (event.key !== STORAGE_KEY) return;
      if (!event.newValue) {
        setUser(null);
        setSessionExpiresAt(null);
        return;
      }
      try {
        const parsed = normalizeStoredSession(JSON.parse(event.newValue));
        setUser(parsed?.user ?? null);
        setSessionExpiresAt(parsed?.expiresAt ?? null);
      } catch {
        setUser(null);
        setSessionExpiresAt(null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  useEffect(() => {
    if (!sessionExpiresAt) return;
    const remainingMs = sessionExpiresAt - Date.now();
    if (remainingMs <= 0) {
      setUser(null);
      setSessionExpiresAt(null);
      removeStoredValue(STORAGE_KEY);
      return;
    }
    const timeout = window.setTimeout(() => {
      setUser(null);
      setSessionExpiresAt(null);
      removeStoredValue(STORAGE_KEY);
    }, remainingMs);
    return () => window.clearTimeout(timeout);
  }, [sessionExpiresAt]);
  const value = useMemo(
    () => ({
      user,
      loading,
      isAdmin: Boolean(user),
      role: user?.role ?? null,
      isSuperAdmin: user?.role === "super_admin",
      signIn: async (email, password) => {
        const adminUser = await verifyAdminLogin(email, password);
        const session = createStoredSession(adminUser);
        setUser(adminUser);
        setSessionExpiresAt(session.expiresAt);
        writeStoredValue(STORAGE_KEY, JSON.stringify(session));
      },
      signOut: async () => {
        setUser(null);
        setSessionExpiresAt(null);
        removeStoredValue(STORAGE_KEY);
      }
    }),
    [loading, user]
  );
  return /* @__PURE__ */ jsx(Ctx.Provider, { value, children });
}
const useAuth = () => useContext(Ctx);
function createStoredSession(user) {
  return {
    user,
    expiresAt: Date.now() + SESSION_TTL_MS
  };
}
function normalizeStoredSession(value) {
  if (!value || typeof value !== "object") return null;
  const maybeSession = value;
  if ("user" in maybeSession || "expiresAt" in maybeSession) {
    if (typeof maybeSession.expiresAt !== "number" || maybeSession.expiresAt <= Date.now()) {
      return null;
    }
    const user = normalizeStoredUser(maybeSession.user);
    return user ? { user, expiresAt: maybeSession.expiresAt } : null;
  }
  const legacyUser = normalizeStoredUser(value);
  return legacyUser ? createStoredSession(legacyUser) : null;
}
function normalizeStoredUser(value) {
  if (!value || typeof value !== "object") return null;
  const candidate = value;
  const email = typeof candidate.email === "string" ? candidate.email : "";
  const name = typeof candidate.name === "string" ? candidate.name : "Administrator";
  if (candidate.role !== "attendant") return null;
  if (!email) return null;
  return {
    email,
    name,
    role: "attendant",
    isAdmin: true
  };
}
const RAW_SITE_URL = process.env.PUBLIC_SITE_URL?.trim() || process.env.SITE_URL?.trim() || "https://shopictgadgets.co.ke";
const SITE_URL = RAW_SITE_URL.replace(/\/+$/, "");
function absoluteUrl(path = "/") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}
function buildTitle(value) {
  return `${value} - Shop ICT Gadgets`;
}
function cleanText(value) {
  return String(value ?? "").replace(/\s+/g, " ").replace(/\u00a0/g, " ").trim();
}
function buildMetaDescription(value, fallback, maxLength = 160) {
  const source = cleanText(value) || fallback;
  if (source.length <= maxLength) return source;
  return `${source.slice(0, maxLength - 3).trim()}...`;
}
const QUERY_CACHE_STORAGE_KEY$1 = "shop-ict-query-cache-v3";
function NotFoundComponent() {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            if (typeof window !== "undefined") {
              try {
                window.localStorage.removeItem(QUERY_CACHE_STORAGE_KEY$1);
              } catch {
              }
            }
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$k = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#E30613" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "mobile-web-app-capable", content: "yes" },
      { title: "Shop ICT Gadgets — Premium Electronics in Kenya" },
      {
        name: "description",
        content: "Laptops, smartphones, networking, CCTV and gaming gear. Order instantly via WhatsApp."
      },
      { property: "og:title", content: "Shop ICT Gadgets" },
      {
        property: "og:description",
        content: "Premium electronics in Kenya, ordered via WhatsApp."
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/") },
      { property: "og:image", content: absoluteUrl("/logo.png") },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Shop ICT Gadgets" },
      {
        name: "twitter:description",
        content: "Premium electronics in Kenya, ordered via WhatsApp."
      },
      { name: "twitter:image", content: absoluteUrl("/logo.png") }
    ],
    links: [
      { rel: "canonical", href: absoluteUrl("/") },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous"
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
      },
      { rel: "icon", href: "/app-icon.jpg", type: "image/jpeg" },
      { rel: "shortcut icon", href: "/app-icon.jpg", type: "image/jpeg" },
      { rel: "apple-touch-icon", href: "/app-icon.jpg" },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "stylesheet", href: appCss }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx(
        "script",
        {
          dangerouslySetInnerHTML: {
            __html: `
              try {
                if (window.history && "scrollRestoration" in window.history) {
                  window.history.scrollRestoration = "manual";
                }
                window.scrollTo(0, 0);
              } catch (error) {}
            `
          }
        }
      ),
      children,
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$k.useRouteContext();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = path.startsWith("/admin");
  const isAuth = path.startsWith("/auth");
  useEffect(() => {
    if (isAdmin || isAuth || typeof window === "undefined") return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [isAdmin, isAuth, path]);
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    const hostname = window.location.hostname;
    const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
    if (isLocalhost) {
      void navigator.serviceWorker.getRegistrations().then(
        (registrations) => Promise.all(registrations.map((registration) => registration.unregister()))
      );
      if ("caches" in window) {
        void caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key))));
      }
      return;
    }
    void navigator.serviceWorker.register("/sw.js").catch((error) => {
      console.error("Failed to register service worker", error);
    });
  }, []);
  useEffect(() => {
    if (typeof window === "undefined" || isAdmin || isAuth) return;
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}` || "/";
    const restoreUrl = consumePendingExternalReturn(currentUrl);
    if (restoreUrl && restoreUrl !== currentUrl) {
      window.location.replace(restoreUrl);
      return;
    }
    persistLastVisitedRoute(currentUrl);
  }, [path, isAdmin, isAuth]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleContextMenu = (event) => {
      event.preventDefault();
    };
    window.addEventListener("contextmenu", handleContextMenu);
    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);
  return /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsx(AuthProvider, { children: /* @__PURE__ */ jsxs(StoreProvider, { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col", children: [
      !isAdmin && !isAuth && /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsx("main", { className: "flex-1 pb-24 lg:pb-0", children: /* @__PURE__ */ jsx(Outlet, {}) }),
      !isAdmin && !isAuth && /* @__PURE__ */ jsx(Footer, {}),
      !isAdmin && !isAuth && /* @__PURE__ */ jsx(DesktopWhatsAppFloat, {}),
      !isAdmin && !isAuth && /* @__PURE__ */ jsx(ProductFinderFloat, {}),
      !isAdmin && !isAuth && /* @__PURE__ */ jsx(MobileBottomNav, {}),
      !isAdmin && !isAuth && /* @__PURE__ */ jsx(PwaInstallPrompt, {})
    ] }),
    /* @__PURE__ */ jsx(Toaster, { position: "top-center", richColors: true })
  ] }) }) });
}
const $$splitComponentImporter$b = () => import("./wishlist-dOUx03PT.js");
const Route$j = createFileRoute("/wishlist")({
  head: () => ({
    meta: [{
      title: "Wishlist - Shop ICT Gadgets"
    }, {
      name: "robots",
      content: "noindex, follow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
function escapeXml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
}
function toIsoDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}
function xmlResponse(body) {
  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
}
function buildUrlSet(entries) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(
    (entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>${entry.lastmod ? `
    <lastmod>${entry.lastmod}</lastmod>` : ""}
  </url>`
  ).join("\n")}
</urlset>`;
}
function buildSitemapIndex(paths) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map(
    (path) => `  <sitemap>
    <loc>${escapeXml(absoluteUrl(path))}</loc>
  </sitemap>`
  ).join("\n")}
</sitemapindex>`;
}
const Route$i = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        return xmlResponse(
          buildSitemapIndex(["/sitemap-pages.xml", "/sitemap-categories.xml", "/sitemap-products.xml"])
        );
      }
    }
  }
});
const Route$h = createFileRoute("/sitemap-products.xml")({
  server: {
    handlers: {
      GET: async () => {
        const products = await fetchProducts({ limit: 5e3 });
        const entries = products.map((product) => ({
          loc: absoluteUrl(`/products/${encodeURIComponent(product.slug)}`),
          lastmod: toIsoDate(product.updated_at ?? product.created_at ?? null)
        }));
        return xmlResponse(buildUrlSet(entries));
      }
    }
  }
});
const Route$g = createFileRoute("/sitemap-pages.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries = [
          { loc: absoluteUrl("/") },
          { loc: absoluteUrl("/shop") },
          { loc: absoluteUrl("/contact") }
        ];
        return xmlResponse(buildUrlSet(entries));
      }
    }
  }
});
const Route$f = createFileRoute("/sitemap-categories.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries = CATEGORY_TREE.flatMap((category) => [
          { loc: absoluteUrl(`/shop?category=${encodeURIComponent(category.query)}`) },
          ...category.items.map((subcategory) => ({
            loc: absoluteUrl(
              `/shop?category=${encodeURIComponent(category.query)}&subcategory=${encodeURIComponent(subcategory)}`
            )
          }))
        ]);
        return xmlResponse(buildUrlSet(entries));
      }
    }
  }
});
const $$splitComponentImporter$a = () => import("./shop-CIKNkHOu.js");
const Route$e = createFileRoute("/shop")({
  validateSearch: z.object({
    category: z.string().optional(),
    subcategory: z.string().optional(),
    q: z.string().optional(),
    brands: z.string().optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional()
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component"),
  head: ({
    match
  }) => {
    const search = match.search;
    const categoryGroup = getCategoryGroupBySearchParam(search.category);
    const subcategory = categoryGroup && isSubcategoryForMainCategory(categoryGroup.label, search.subcategory) ? search.subcategory : null;
    const isSearchResultsPage = Boolean(search.q?.trim());
    const pageLabel = subcategory ?? categoryGroup?.label ?? "Shop Electronics Online";
    const canonicalSearch = new URLSearchParams();
    if (categoryGroup) canonicalSearch.set("category", categoryGroup.query);
    if (subcategory) canonicalSearch.set("subcategory", subcategory);
    const canonicalPath = canonicalSearch.size > 0 ? `/shop?${canonicalSearch.toString()}` : "/shop";
    const description = subcategory ? `Shop ${subcategory.toLowerCase()} in Kenya from Shop ICT Gadgets. Browse prices, specs and availability.` : categoryGroup ? `Shop ${categoryGroup.label.toLowerCase()} in Kenya from Shop ICT Gadgets. Browse prices, specs and availability.` : "Browse our full catalog of laptops, smartphones, monitors, printers, audio gear and accessories at Shop ICT Gadgets.";
    const title = buildTitle(pageLabel);
    return {
      meta: [{
        title
      }, {
        name: "description",
        content: buildMetaDescription(description, "Browse our full electronics catalog.")
      }, {
        name: "robots",
        content: isSearchResultsPage ? "noindex, follow" : "index, follow"
      }, {
        property: "og:title",
        content: title
      }, {
        property: "og:description",
        content: description
      }, {
        property: "og:type",
        content: "website"
      }, {
        property: "og:url",
        content: absoluteUrl(canonicalPath)
      }, {
        property: "og:image",
        content: absoluteUrl("/logo.png")
      }, {
        name: "twitter:card",
        content: "summary_large_image"
      }, {
        name: "twitter:title",
        content: title
      }, {
        name: "twitter:description",
        content: description
      }, {
        name: "twitter:image",
        content: absoluteUrl("/logo.png")
      }],
      links: [{
        rel: "canonical",
        href: absoluteUrl(canonicalPath)
      }]
    };
  }
});
const Route$d = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async () => {
        const body = [
          "User-agent: *",
          "Allow: /",
          "",
          "Disallow: /admin",
          "Disallow: /auth",
          "",
          `Sitemap: ${absoluteUrl("/sitemap.xml")}`
        ].join("\n");
        return new Response(body, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8"
          }
        });
      }
    }
  }
});
const $$splitComponentImporter$9 = () => import("./contact-BlmSSvkG.js");
const Route$c = createFileRoute("/contact")({
  component: lazyRouteComponent($$splitComponentImporter$9, "component"),
  head: () => {
    const title = buildTitle("Contact");
    const description = buildMetaDescription("Reach Shop ICT Gadgets in Kenya. Visit our store, call, email, or chat with us on WhatsApp for fast electronics support.", "Reach Shop ICT Gadgets.");
    return {
      meta: [{
        title
      }, {
        name: "description",
        content: description
      }, {
        name: "robots",
        content: "index, follow"
      }, {
        property: "og:title",
        content: title
      }, {
        property: "og:description",
        content: description
      }, {
        property: "og:type",
        content: "website"
      }, {
        property: "og:url",
        content: absoluteUrl("/contact")
      }, {
        property: "og:image",
        content: absoluteUrl("/logo.png")
      }, {
        name: "twitter:card",
        content: "summary_large_image"
      }, {
        name: "twitter:title",
        content: title
      }, {
        name: "twitter:description",
        content: description
      }, {
        name: "twitter:image",
        content: absoluteUrl("/logo.png")
      }],
      links: [{
        rel: "canonical",
        href: absoluteUrl("/contact")
      }]
    };
  }
});
const $$splitComponentImporter$8 = () => import("./cart-BTAIars5.js");
const Route$b = createFileRoute("/cart")({
  head: () => ({
    meta: [{
      title: "Cart - Shop ICT Gadgets"
    }, {
      name: "robots",
      content: "noindex, follow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./auth-B9z4fmB2.js");
const Route$a = createFileRoute("/auth")({
  head: () => ({
    meta: [{
      title: "Admin Login - Shop ICT Gadgets"
    }, {
      name: "robots",
      content: "noindex, nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const Route$9 = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin - Shop ICT Gadgets" },
      { name: "robots", content: "noindex, nofollow" }
    ]
  })
});
const $$splitComponentImporter$6 = () => import("./index-CxBdNn8u.js");
const Route$8 = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: buildTitle("Premium Electronics in Kenya")
    }, {
      name: "description",
      content: buildMetaDescription("Shop laptops, smartphones, monitors, printers, networking gear, CCTV and accessories from Shop ICT Gadgets in Kenya.", "Shop premium electronics in Kenya.")
    }, {
      property: "og:title",
      content: buildTitle("Premium Electronics in Kenya")
    }, {
      property: "og:description",
      content: "Shop laptops, smartphones, monitors, printers, networking gear, CCTV and accessories from Shop ICT Gadgets in Kenya."
    }, {
      property: "og:type",
      content: "website"
    }, {
      property: "og:url",
      content: absoluteUrl("/")
    }, {
      property: "og:image",
      content: absoluteUrl("/logo.png")
    }, {
      name: "twitter:card",
      content: "summary_large_image"
    }, {
      name: "twitter:title",
      content: buildTitle("Premium Electronics in Kenya")
    }, {
      name: "twitter:description",
      content: "Shop laptops, smartphones, monitors, printers, networking gear, CCTV and accessories from Shop ICT Gadgets in Kenya."
    }, {
      name: "twitter:image",
      content: absoluteUrl("/logo.png")
    }],
    links: [{
      rel: "canonical",
      href: absoluteUrl("/")
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./admin.index-B-YGx8ns.js");
const Route$7 = createFileRoute("/admin/")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
function isCloudinaryUrl(src) {
  return /^https:\/\/res\.cloudinary\.com\//i.test(src);
}
function buildCloudinaryTransformations(options) {
  return [
    "f_auto",
    options.quality ?? "q_auto",
    "dpr_auto",
    options.mode === "fit" ? "c_fit" : "c_fill",
    options.width ? `w_${Math.round(options.width)}` : null,
    options.height ? `h_${Math.round(options.height)}` : null
  ].filter(Boolean).join(",");
}
function optimizeImageUrl(src, options = {}) {
  const value = String(src ?? "").trim();
  if (!value || !isCloudinaryUrl(value)) return value;
  const marker = "/upload/";
  const markerIndex = value.indexOf(marker);
  if (markerIndex === -1) return value;
  const prefix = value.slice(0, markerIndex + marker.length);
  const suffix = value.slice(markerIndex + marker.length);
  if (/^(?:f_|q_|c_|w_|h_|dpr_)/.test(suffix)) {
    return value;
  }
  const transformations = buildCloudinaryTransformations(options);
  return `${prefix}${transformations}/${suffix}`;
}
function buildResponsiveImageAttrs(src, options) {
  const value = String(src ?? "").trim();
  if (!value) {
    return { src: "", sizes: options.sizes };
  }
  const uniqueWidths = Array.from(
    new Set(options.widths.map((width) => Math.max(1, Math.round(width))))
  ).sort((left, right) => left - right);
  if (uniqueWidths.length === 0) {
    return {
      src: optimizeImageUrl(value, {
        width: options.width,
        height: options.height,
        mode: options.mode,
        quality: options.quality
      }),
      sizes: options.sizes
    };
  }
  const baseWidth = options.width ?? uniqueWidths[uniqueWidths.length - 1];
  const baseHeight = options.height;
  const baseOptions = {
    mode: options.mode,
    quality: options.quality
  };
  const srcSet = isCloudinaryUrl(value) ? uniqueWidths.map((width) => {
    const scaledHeight = baseHeight && baseWidth ? Math.max(1, Math.round(baseHeight * width / baseWidth)) : void 0;
    return `${optimizeImageUrl(value, {
      ...baseOptions,
      width,
      height: scaledHeight
    })} ${width}w`;
  }).join(", ") : void 0;
  return {
    src: optimizeImageUrl(value, {
      ...baseOptions,
      width: uniqueWidths[uniqueWidths.length - 1],
      height: baseHeight && baseWidth ? Math.max(
        1,
        Math.round(baseHeight * uniqueWidths[uniqueWidths.length - 1] / baseWidth)
      ) : options.height
    }),
    srcSet,
    sizes: options.sizes
  };
}
function readBlobAsDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error("Could not process the selected image."));
    reader.readAsDataURL(blob);
  });
}
function loadFileImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Could not load ${file.name}.`));
    };
    image.src = url;
  });
}
async function prepareUploadedImage(file, options) {
  if (file.type === "image/gif") {
    return readBlobAsDataUrl(file);
  }
  const image = await loadFileImage(file);
  const scale = Math.min(1, options.maxWidth / image.width, options.maxHeight / image.height);
  const targetWidth = Math.max(1, Math.round(image.width * scale));
  const targetHeight = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const context = canvas.getContext("2d");
  if (!context) {
    return readBlobAsDataUrl(file);
  }
  context.drawImage(image, 0, 0, targetWidth, targetHeight);
  const blob = await new Promise((resolve) => {
    canvas.toBlob(resolve, options.mimeType ?? "image/webp", options.quality ?? 0.82);
  });
  if (!blob) {
    return readBlobAsDataUrl(file);
  }
  if (blob.size >= file.size && scale === 1) {
    return readBlobAsDataUrl(file);
  }
  return readBlobAsDataUrl(blob);
}
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(
        "animate-pulse rounded-md bg-[linear-gradient(90deg,#fafafa_0%,#f1f1f1_50%,#fafafa_100%)]",
        className
      ),
      ...props
    }
  );
}
const $$splitComponentImporter$4 = () => import("./products._slug-CtNUyWAG.js");
const Route$6 = createFileRoute("/products/$slug")({
  loader: async ({
    params
  }) => fetchProductPageData(params.slug),
  pendingComponent: ProductPendingPage,
  pendingMs: 0,
  pendingMinMs: 0,
  head: ({
    loaderData,
    params
  }) => {
    const product = loaderData.product;
    const title = product ? buildTitle(product.title) : buildTitle("Product");
    const description = buildMetaDescription(product?.description ?? `${product?.title ?? "Product"} at Shop ICT Gadgets. View price, availability and specifications.`, "View product details, price and availability at Shop ICT Gadgets.");
    const image = product?.images?.[0] ? absoluteUrl(optimizeImageUrl(product.images[0], {
      width: 1200,
      height: 1200,
      mode: "fit"
    })) : absoluteUrl("/logo.png");
    const url = absoluteUrl(`/products/${params.slug}`);
    return {
      meta: [{
        title
      }, {
        name: "description",
        content: description
      }, {
        property: "og:title",
        content: title
      }, {
        property: "og:description",
        content: description
      }, {
        property: "og:type",
        content: "product"
      }, {
        property: "og:url",
        content: url
      }, {
        property: "og:image",
        content: image
      }, {
        name: "twitter:card",
        content: "summary_large_image"
      }, {
        name: "twitter:title",
        content: title
      }, {
        name: "twitter:description",
        content: description
      }, {
        name: "twitter:image",
        content: image
      }],
      links: [{
        rel: "canonical",
        href: url
      }]
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
function ProductPendingPage() {
  return /* @__PURE__ */ jsx("div", { className: "site-desktop-width mx-auto px-6 py-20", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-y-6 lg:grid-cols-[460px_minmax(0,1fr)] lg:gap-x-6", children: [
    /* @__PURE__ */ jsx(Skeleton, { className: "aspect-square w-full rounded-[8px] sm:max-w-[500px] lg:max-w-[460px]" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4 lg:pl-[50px]", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-48" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-24" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-40" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-20" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-7 w-28" }),
      /* @__PURE__ */ jsxs("div", { className: "grid max-w-[280px] grid-cols-[minmax(0,0.7fr)_minmax(0,0.66fr)] gap-2", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-10 rounded-[5px]" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-10 rounded-[5px]" })
      ] })
    ] })
  ] }) });
}
const Route$5 = createFileRoute("/admin/products")({});
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, disabled, onClick, ...props }, ref) => {
    const [autoDisabled, setAutoDisabled] = React.useState(false);
    const clickInFlightRef = React.useRef(false);
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || autoDisabled;
    const handleClick = (event) => {
      if (clickInFlightRef.current || disabled) {
        event.preventDefault();
        return;
      }
      const result = onClick?.(event);
      if (result && typeof result.then === "function") {
        clickInFlightRef.current = true;
        setAutoDisabled(true);
        Promise.resolve(result).finally(() => {
          clickInFlightRef.current = false;
          setAutoDisabled(false);
        });
      }
    };
    return /* @__PURE__ */ jsx(
      Comp,
      {
        ...props,
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        disabled: asChild ? void 0 : isDisabled,
        "aria-disabled": asChild && isDisabled ? true : props["aria-disabled"],
        onClick: onClick ? handleClick : void 0
      }
    );
  }
);
Button.displayName = "Button";
const Dialog = DialogPrimitive.Root;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxs(
    DialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = DialogPrimitive.Content.displayName;
const DialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsx("div", { className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className), ...props });
DialogHeader.displayName = "DialogHeader";
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold leading-none tracking-tight", className),
    ...props
  }
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
const listAdminCategoriesServer = createServerFn({
  method: "POST"
}).handler(createSsrRpc("3d07a6c2d92cada322e7e4735125878f4073555f1a5df726e4b3db645f0da4b5"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("495091737ff47754458269b2e45f4384529da7319a817dede8e07e66c07b99e7"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("1b60ca7604afdcd3d0f03df2b10ebaca423e4d5caa49f81a9b802bfcb0f4c58f"));
const listAdminProductsServer = createServerFn({
  method: "POST"
}).handler(createSsrRpc("381f2b8a981bad7d369275e826ec075b46bd805d231d9bb62372b4a05241bf1d"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("752df7f0ea50413528d2a1fba195a11c948b58d326b1f67129d9594323913321"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("af539b64737c1a34034ce05b978a1d73754d4d0c38788f3faa046b706416cb55"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("8ec3286791a97abc95abfe9780ab80279e0b861ddea4c9eea9d9e762456b3620"));
const listProductCatalogueServer = createServerFn({
  method: "POST"
}).handler(createSsrRpc("7f891dd29f543427073502d9d39dd2fa75b3561e1475f1a37d526c66d53f7421"));
const createProductCatalogueBatchServer = createServerFn({
  method: "POST"
}).handler(createSsrRpc("6f28a91d1019b2dc159d1b1b58090c10c4aac43b6c6b228a87bccd0ab2a18438"));
const updateProductCatalogueItemServer = createServerFn({
  method: "POST"
}).handler(createSsrRpc("68afc5cfdac8ff673aa9758b06215c5f0c3823fab63a6f1af433d5275d1d3fe7"));
const deleteProductCatalogueItemServer = createServerFn({
  method: "POST"
}).handler(createSsrRpc("8e08f7efdeea017fa2ad0cb6afe730106dde3162172a2e614d2d56bb1bf3fc63"));
const upsertAdminProductServer = createServerFn({
  method: "POST"
}).handler(createSsrRpc("005f6fb3ea34129e7297d1c41305ab14fa00bd4dee65915b065b13a9d4116f7f"));
const storeAdminProductImagesServer = createServerFn({
  method: "POST"
}).handler(createSsrRpc("9d03eb21d0cc975d7cc9dd523242c3543e543f40b44ebd5efd516340392ce19d"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("ddbe094c6fc761c99d716bbd1fe9bf631df2403231dddc7f9cac721574decb0b"));
const deleteAdminProductServer = createServerFn({
  method: "POST"
}).handler(createSsrRpc("98e8b9625e40ae7505b7eef6f02f4fa174b21b7ae0eff4bd8b88a9e5d82306b1"));
const fetchAdminDashboardServer = createServerFn({
  method: "POST"
}).handler(createSsrRpc("39f33562f1653f20d5626a1bbf669a31084bf0b73ac8668aef0266761f426768"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("5fff447da62f1c30a9d4795a770d66220de9295bbccc24148e4b0b10372fb839"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("4ae54b3340f5ba37dc8ddab31e0d6551030d942800c1a78bf74823ca9d93e32f"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("46e0a2f4be3b2f7d345cccb9c0110d14059e3b0e14dc708e3f52660d3c3496bd"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("1d41e017c96da896a9676473069a560785ccb808d8b57bad761ba024d119000b"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("99f2b5e8fbfddf4e33a241d82216df21c81db4ca925a8f04cba6ccdcd429bea0"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("a02170316cb5ace4a2d07cd42c534d7af2968a42a53340046a6decff7c270d08"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("5c3987d8e7901633584fb96d130b1a643777d1d286cb5a44cb8723c2101d7cc5"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("b0b2efd8a2b645b9d7af0e8769ae7824cdff974d4c2935e1865dea6bf755d02e"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("06fff0253b77e893725bc29b5c03c6cb9684864bb5be9dc2b0014bd26740e8f2"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("779eb388b4c399f9742cfb55b5f22783852cf9be32cc0b87cdb35e5552b0af21"));
const fetchAdminCatalogMetaServer = createServerFn({
  method: "POST"
}).handler(createSsrRpc("c5fc592b6d2082c6999be4952dc58f54c27c69fa201827458f7bb4b27850935e"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("e94b50899b02899e55e5708d7ab6faa6ccd67680bfdb3cab3a5199a5bdae495d"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("a84786533017f079a09bd65590bcc4fe1dfd6338dab767541759749030e094cb"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("95b929ade8e0597ee79a8894b0a689af5f98e998085e14d8377cbfe436664588"));
const fetchAdminBestDealProductSlugsServer = createServerFn({
  method: "POST"
}).handler(createSsrRpc("ca7e35aef4695f41c198c410305f7899dd24fdf7c3114de3d27179e6feb5cbcf"));
const saveAdminBestDealProductSlugsServer = createServerFn({
  method: "POST"
}).handler(createSsrRpc("b9757ac35b1e515ca7adb225af2c17006388439aa3b5c206f98459c40f1740f8"));
const updateAdminProductFeaturedServer = createServerFn({
  method: "POST"
}).handler(createSsrRpc("87473ab7b0417a82621c25b8671b9ef3b1c803f9f64fdd3330499839907bf641"));
const updateAdminProductCategoryPriorityServer = createServerFn({
  method: "POST"
}).handler(createSsrRpc("ac1d73e36988d23adbad1aa4d05a092cd4f8faec7e750a3602125734cb8b1e2c"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("13c63a631b2006afe398972d5236327969b1bd9bc2d4139098a4f13e925625fd"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("a775a32ed79ca9f9cc55efc650fda8d6d39f1763cc216578cb3f8fbcf3a75ae6"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("dccc22e809a9866ef021d443acd0a6eba36d772f44c9674b206b7fd5a37b7ac6"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("28220fa7396bfcef9cd3e07df2c76cf0a71883526f3cb8388ca04350c35eb740"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("d666562cb9a5731f16e9873418281fff6eafafe310d86fa753c1b75cedd56581"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("d38f058322f691b5ad61a7db1020e107d30c25484a24216c48f7983e19c26c22"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("dbcf1fe52e309bac299a49c1e6c6ad5c276ade75f8f23d2ea5b077aafd3e6e73"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("a9a30835048636d3635808fa17edc8a3c5b7d2ba7f19d42b8ca3858fc30554dd"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("c95ed22a0d63222711af281a51b3f1ca4bb2a98c374f9abecbb53a88158b998f"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("51d5029ca1538f24cd107114d4c2805e9bb4ff8de337dc6a228e7b1ecaf16616"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("663132f5d1169f71d457139a82fd9abf35dcffa44d73bc77ad1b645b5932a5bf"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("57a73a0169c72143daf3c05a57bfaeac45c4f33b9ad116310b045bc408320a9f"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("4808e1fff4e219310584aae57903bf1418330c51898bbc00abd2e486129c2523"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("aff9461e65d90734eeb8667f27b59dacabaf71860f9ee4cded97dde1e77d2a8f"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("9c8df41c5ba113082c1b26b8edb5b4d2ebf445d7411f13535dbea23fee78197a"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("609bcbee46fb6275a2e90408476d70fe94f78b2f345414a077dcd211c16f05a0"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("da0eb663a1343a0abe68a72607fcfc9dcf89983239ffd87c3e95042395595d48"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("c1c1eb6ffecf9d3b97775164cde2438fd4c7f0bcdbc289c6be1eef5931f2e954"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("ffc34b9508ad6ceae46127cacf4eefa09e162dabcc0268561855932d6e58c954"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("41631b48ff1aa46466dbc64ac962de62cd77528843ffc7acf2d58c31a7b99e7a"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("b949d6ba5e0d649ce677817888c4a813bdb503c6d11dfa13d59fc095741535cd"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("ee3d9752ca2edfe7acdf7c010f31afe5f3f4f1afb229831dd7003240c65c9621"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("04dc553de7c9a291dce1662aed5c6d48bd66ad6f991e7b311a28679f6629e69f"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("123ed2d49f44fb5af8aded0c8bd9d2c1c321e47777cec0b0b4ae16725e9bebd2"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("f8217170279a10b3b70f339f76f0c0f9a284366e1dbbeaaf3cf771e81624a378"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("6507614eda51dae4f7340b140351a2230d39b62ee5dfcbac910d98ab5084905e"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("13ca22499e99ed6d4f220fee826d18e45d1c13375b062884fef7e6c69fe9a097"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("a9a51b39555f7a9d26e4d7a5481a713a6a8a54cce10c0699136cf82e68bd88fb"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("fcf4e61979b0d5b2b679e56429a1b368250dfa9be12e246a741e29c0f4070529"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("7dd5dc24d45ce12286adf49d16356af52c34c26c1e5c709f02a4c9cf66de16f9"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("4d917f6a3399b603b0b37cb3666bdfcbff1d112da697381bf5716320b3640ce2"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("eff4b7a54d83c3e7c1934fe1f53231a44f28f8646eb2ffcf745cf9b7d8b63607"));
async function listAdminCategories() {
  return listAdminCategoriesServer();
}
async function listAdminProducts() {
  return listAdminProductsServer();
}
async function listProductCatalogue() {
  return listProductCatalogueServer();
}
async function createProductCatalogueBatch(input) {
  return createProductCatalogueBatchServer({
    data: input
  });
}
async function updateProductCatalogueItem(input) {
  return updateProductCatalogueItemServer({
    data: input
  });
}
async function deleteProductCatalogueItem(id) {
  return deleteProductCatalogueItemServer({
    data: {
      id
    }
  });
}
async function upsertAdminProduct(input) {
  return upsertAdminProductServer({
    data: input
  });
}
async function storeAdminProductImages(images) {
  return storeAdminProductImagesServer({
    data: {
      images
    }
  });
}
async function deleteAdminProduct(id) {
  return deleteAdminProductServer({
    data: {
      id
    }
  });
}
async function updateAdminProductCategoryPriority(input) {
  return updateAdminProductCategoryPriorityServer({
    data: input
  });
}
async function fetchAdminDashboard() {
  return fetchAdminDashboardServer();
}
async function fetchAdminBestDealProductSlugs() {
  return fetchAdminBestDealProductSlugsServer();
}
async function saveAdminBestDealProductSlugs(slugs) {
  return saveAdminBestDealProductSlugsServer({
    data: {
      slugs
    }
  });
}
async function updateAdminProductFeatured(input) {
  return updateAdminProductFeaturedServer({
    data: input
  });
}
async function fetchAdminCatalogMeta() {
  return fetchAdminCatalogMetaServer();
}
const Route$4 = createFileRoute("/admin/catalogue")({ component: AdminCataloguePage });
const ITEM_OPTIONS = ["Laptop", "Monitor", "Printer", "Desktop", "Phone", "Accessory", "Other"];
const PROCESSOR_OPTIONS = ["Core i3", "Core i5", "Core i7", "Core i9", "Ultra 5", "Ultra 7", "Ultra 9", "Ryzen 3", "Ryzen 5", "Ryzen 7", "M1", "M2", "M3", "M4", "M5"];
const GENERATION_OPTIONS = ["6th Gen", "7th Gen", "8th Gen", "9th Gen", "10th Gen", "11th Gen", "12th Gen", "13th Gen", "14th Gen", "15th Gen", "16th Gen"];
const RAM_OPTIONS = ["4GB", "8GB", "16GB", "24GB", "32GB", "36GB", "48GB", "64GB"];
const STORAGE_OPTIONS = ["128GB SSD", "256GB SSD", "512GB SSD", "1TB SSD", "2TB", "2TB SSD", "500GB HDD", "1TB HDD"];
const MONITOR_SIZE_OPTIONS = ["19 inch", "22 inch", "24 inch", "27 inch", "32 inch", "34 inch"];
const GENERIC_SPEC_OPTIONS = ["Standard", "Pro", "Max", "Refurbished", "Brand new"];
function AdminCataloguePage() {
  const path = useRouterState({ select: (state) => state.location.pathname });
  const showAddOnly = path === "/admin/catalogue/add";
  const showListOnly = path === "/admin/catalogue/list";
  const showAdd = !showListOnly;
  const showList = !showAddOnly;
  const qc = useQueryClient();
  const { user } = useAuth();
  const actor = user ? { email: user.email, name: user.name, role: user.role } : null;
  const [title, setTitle] = useState("");
  const [item, setItem] = useState("Laptop");
  const [customItem, setCustomItem] = useState("");
  const [variantRows, setVariantRows] = useState([
    createVariantRow({ processor: "Core i7", ram: "4GB" }),
    createVariantRow({ processor: "Core i7", ram: "8GB" })
  ]);
  const [search, setSearch] = useState("");
  const [websiteFilter, setWebsiteFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const { data: catalogue = [] } = useQuery({
    queryKey: ["product-catalogue"],
    queryFn: () => listProductCatalogue()
  });
  const addVariantRow = () => setVariantRows((current) => [...current, createVariantRow()]);
  const filteredCatalogue = useMemo(() => {
    const query = search.trim().toLowerCase();
    return catalogue.filter(
      (entry) => (websiteFilter === "all" || websiteFilter === "listed" && Boolean(entry.product_id) || websiteFilter === "unlisted" && !entry.product_id) && (!query || [entry.product_name, entry.title, entry.item, ...Object.values(entry.specs)].filter(Boolean).some((value) => String(value).toLowerCase().includes(query)))
    );
  }, [catalogue, search, websiteFilter]);
  const pageSize = 20;
  const totalPages = Math.max(1, Math.ceil(filteredCatalogue.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedCatalogue = filteredCatalogue.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const save = async () => {
    if (!actor) return;
    const resolvedItem = item === "Other" ? customItem.trim() : item;
    const requiresSpecs = catalogueItemUsesSpecs(item);
    const parsedVariants = variantRows.map((row) => ({ specs: buildSpecsFromVariantRow(resolvedItem, row) })).filter((variant) => Object.keys(variant.specs).length > 0);
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!resolvedItem) {
      toast.error("Item is required");
      return;
    }
    if (requiresSpecs && parsedVariants.length === 0) {
      toast.error("Add at least one spec variant");
      return;
    }
    try {
      const result = await createProductCatalogueBatch({
        title: title.trim(),
        item: resolvedItem,
        variants: requiresSpecs ? parsedVariants : [{ specs: { Name: title.trim() } }],
        actor
      });
      toast.success(`${result.count} catalogue product(s) saved`);
      setTitle("");
      setVariantRows([createVariantRow()]);
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["product-catalogue"] }),
        qc.invalidateQueries({ queryKey: ["admin-products"] })
      ]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save catalogue products");
    }
  };
  const remove = async (id) => {
    if (!confirm("Delete this catalogue item? Existing website or inventory products will stay.")) return;
    await deleteProductCatalogueItem(id);
    toast.success("Catalogue item deleted");
    await qc.invalidateQueries({ queryKey: ["product-catalogue"] });
  };
  const startEdit = (entry) => {
    setEditing({
      id: entry.id,
      title: entry.title,
      item: entry.item,
      product_name: entry.product_name,
      specs: variantRowFromSpecs(entry.item, entry.specs)
    });
  };
  const saveEdit = async () => {
    if (!actor || !editing) return;
    const requiresSpecs = catalogueItemUsesSpecs(editing.item);
    const parsedSpecs = buildSpecsFromVariantRow(editing.item, editing.specs);
    if (!editing.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!editing.item.trim()) {
      toast.error("Item is required");
      return;
    }
    if (requiresSpecs && Object.keys(parsedSpecs).length === 0) {
      toast.error("Specs are required");
      return;
    }
    try {
      await updateProductCatalogueItem({
        id: editing.id,
        title: editing.title.trim(),
        item: editing.item.trim(),
        product_name: editing.product_name.trim(),
        specs: requiresSpecs ? parsedSpecs : { Name: editing.title.trim() },
        actor
      });
      toast.success("Catalogue product updated");
      setEditing(null);
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["product-catalogue"] }),
        qc.invalidateQueries({ queryKey: ["admin-products"] })
      ]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update catalogue product");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    showAdd ? /* @__PURE__ */ jsxs("section", { className: "rounded-2xl border bg-card p-5 shadow-soft", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "grid h-10 w-10 place-items-center rounded-2xl bg-[#FFF1F2] text-[#E30613]", children: /* @__PURE__ */ jsx(Boxes, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold", children: "Add catalogue variants" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Each spec line becomes a separate product name using title plus spec values." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]", children: [
        /* @__PURE__ */ jsx(Field, { label: "Title", children: /* @__PURE__ */ jsx("input", { value: title, onChange: (e) => setTitle(e.target.value), className: inputCls, placeholder: "Lenovo or Samsung" }) }),
        /* @__PURE__ */ jsx(Field, { label: "Item", children: /* @__PURE__ */ jsx(
          "select",
          {
            value: item,
            onChange: (e) => {
              setItem(e.target.value);
              setVariantRows([createVariantRow()]);
            },
            className: inputCls,
            children: ITEM_OPTIONS.map((option) => /* @__PURE__ */ jsx("option", { value: option, children: option }, option))
          }
        ) }),
        item === "Other" ? /* @__PURE__ */ jsx(Field, { label: "Custom item", className: "lg:col-span-2", children: /* @__PURE__ */ jsx("input", { value: customItem, onChange: (e) => setCustomItem(e.target.value), className: inputCls, placeholder: "Projector" }) }) : null,
        catalogueItemUsesSpecs(item) ? /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-2 flex items-center justify-between gap-3", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: "Spec variants" }),
            /* @__PURE__ */ jsxs(Button, { type: "button", variant: "outline", className: "h-9 rounded-full", onClick: addVariantRow, children: [
              /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
              " Add row"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-3", children: variantRows.map((row, index) => /* @__PURE__ */ jsx(
            SpecDropdownRow,
            {
              item: item === "Other" ? customItem : item,
              row,
              onChange: (nextRow) => setVariantRows((current) => current.map((currentRow) => currentRow.id === row.id ? nextRow : currentRow)),
              onRemove: () => setVariantRows((current) => current.filter((currentRow) => currentRow.id !== row.id)),
              canRemove: variantRows.length > 1,
              label: `Variant ${index + 1}`
            },
            row.id
          )) })
        ] }) : null
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-4 flex justify-end", children: /* @__PURE__ */ jsxs(Button, { onClick: save, className: "rounded-full", children: [
        /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
        " Save variants"
      ] }) }),
      showAdd && catalogueItemUsesSpecs(item) ? /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: addVariantRow,
          className: "fixed bottom-6 right-5 z-[60] grid h-14 w-14 place-items-center rounded-full bg-[#E30613] text-white shadow-lg transition hover:bg-[#c70511] md:hidden",
          "aria-label": "Add catalogue variant row",
          children: /* @__PURE__ */ jsx(Plus, { className: "h-6 w-6" })
        }
      ) : null
    ] }) : null,
    showList ? /* @__PURE__ */ jsxs("section", { className: "rounded-2xl border bg-card shadow-soft", children: [
      /* @__PURE__ */ jsxs("div", { className: "border-b p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold", children: "Catalogue products" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "All existing products and catalogue variants appear here." })
          ] }),
          /* @__PURE__ */ jsx(Button, { asChild: true, className: "rounded-full", children: /* @__PURE__ */ jsxs(Link, { to: "/admin/catalogue/add", children: [
            /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
            " Add"
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                value: search,
                onChange: (e) => {
                  setSearch(e.target.value);
                  setPage(1);
                },
                className: "w-full rounded-xl border bg-background py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/30",
                placeholder: "Search catalogue products"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: websiteFilter,
              onChange: (e) => {
                setWebsiteFilter(e.target.value);
                setPage(1);
              },
              className: inputCls,
              children: [
                /* @__PURE__ */ jsx("option", { value: "all", children: "All website statuses" }),
                /* @__PURE__ */ jsx("option", { value: "listed", children: "Listed on website" }),
                /* @__PURE__ */ jsx("option", { value: "unlisted", children: "Not listed on website" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "overflow-hidden", children: /* @__PURE__ */ jsxs("table", { className: "w-full table-fixed text-sm", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-[#F5F5F7] text-left text-xs uppercase tracking-wide text-muted-foreground", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "px-3 py-3 font-medium sm:px-5", children: "Product name" }),
          /* @__PURE__ */ jsx("th", { className: "w-24 px-3 py-3 text-right font-medium sm:w-28 sm:px-5", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: paginatedCatalogue.length > 0 ? paginatedCatalogue.map((entry) => /* @__PURE__ */ jsxs("tr", { className: "border-t", children: [
          /* @__PURE__ */ jsx("td", { className: "min-w-0 px-3 py-4 font-semibold text-foreground sm:px-5", children: /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 items-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: "truncate", title: entry.product_name, children: entry.product_name }),
            /* @__PURE__ */ jsx(
              "span",
              {
                className: `shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${entry.product_id ? "bg-[#ECFDF3] text-[#15803D]" : "bg-[#FFF7ED] text-[#C2410C]"}`,
                children: entry.product_id ? "Listed" : "Unlisted"
              }
            )
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-3 py-4 sm:px-5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-1", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => startEdit(entry),
                className: "rounded-full p-2 text-muted-foreground transition hover:bg-[#F5F5F7] hover:text-foreground",
                "aria-label": "Edit catalogue item",
                children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => remove(entry.id),
                className: "rounded-full p-2 text-muted-foreground transition hover:bg-[#FFF1F2] hover:text-[#E30613]",
                "aria-label": "Delete catalogue item",
                children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
              }
            )
          ] }) })
        ] }, entry.id)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 2, className: "px-5 py-12 text-center text-sm text-muted-foreground", children: "No catalogue products found." }) }) })
      ] }) }),
      filteredCatalogue.length > 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 border-t px-5 py-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between", children: [
        /* @__PURE__ */ jsxs("span", { children: [
          "Showing ",
          (currentPage - 1) * pageSize + 1,
          " to ",
          Math.min(currentPage * pageSize, filteredCatalogue.length),
          " of ",
          filteredCatalogue.length
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              className: "h-9 rounded-full",
              disabled: currentPage <= 1,
              onClick: () => setPage((value) => Math.max(1, value - 1)),
              children: "Previous"
            }
          ),
          /* @__PURE__ */ jsxs("span", { className: "min-w-20 text-center text-xs font-semibold text-foreground", children: [
            currentPage,
            " / ",
            totalPages
          ] }),
          /* @__PURE__ */ jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              className: "h-9 rounded-full",
              disabled: currentPage >= totalPages,
              onClick: () => setPage((value) => Math.min(totalPages, value + 1)),
              children: "Next"
            }
          )
        ] })
      ] }) : null
    ] }) : null,
    /* @__PURE__ */ jsx(Dialog, { open: Boolean(editing), onOpenChange: (open) => !open && setEditing(null), children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-h-[90vh] max-w-3xl overflow-y-auto rounded-2xl", children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Edit catalogue product" }) }),
      editing ? /* @__PURE__ */ jsxs("div", { className: "grid gap-3 lg:grid-cols-2", children: [
        /* @__PURE__ */ jsx(Field, { label: "Title", children: /* @__PURE__ */ jsx(
          "input",
          {
            value: editing.title,
            onChange: (event) => setEditing({ ...editing, title: event.target.value }),
            className: inputCls
          }
        ) }),
        /* @__PURE__ */ jsx(Field, { label: "Item", children: /* @__PURE__ */ jsx(
          "select",
          {
            value: editing.item,
            onChange: (event) => setEditing({ ...editing, item: event.target.value, specs: createVariantRow() }),
            className: inputCls,
            children: ITEM_OPTIONS.map((option) => /* @__PURE__ */ jsx("option", { value: option, children: option }, option))
          }
        ) }),
        /* @__PURE__ */ jsx(Field, { label: "Product name", className: "lg:col-span-2", children: /* @__PURE__ */ jsx(
          "input",
          {
            value: editing.product_name,
            onChange: (event) => setEditing({ ...editing, product_name: event.target.value }),
            className: inputCls
          }
        ) }),
        catalogueItemUsesSpecs(editing.item) ? /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2", children: [
          /* @__PURE__ */ jsx("span", { className: "mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: "Specs" }),
          /* @__PURE__ */ jsx(
            SpecDropdownRow,
            {
              item: editing.item,
              row: editing.specs,
              onChange: (nextRow) => setEditing({ ...editing, specs: nextRow }),
              label: "Selected specs"
            }
          )
        ] }) : null,
        /* @__PURE__ */ jsx("div", { className: "flex justify-end lg:col-span-2", children: /* @__PURE__ */ jsx(Button, { onClick: saveEdit, className: "rounded-full", children: "Save changes" }) })
      ] }) : null
    ] }) })
  ] });
}
function SpecDropdownRow({
  item,
  row,
  label,
  onChange,
  onRemove,
  canRemove = false
}) {
  const normalizedItem = String(item ?? "").trim().toLowerCase();
  const isMonitor = normalizedItem.includes("monitor");
  const isLaptop = normalizedItem.includes("laptop") || normalizedItem.includes("desktop");
  return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border bg-[#F8FAFC] p-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-foreground", children: label }),
      canRemove && onRemove ? /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: onRemove,
          className: "rounded-full p-1.5 text-muted-foreground transition hover:bg-white hover:text-[#E30613]",
          "aria-label": "Remove spec row",
          children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
        }
      ) : null
    ] }),
    isMonitor ? /* @__PURE__ */ jsx("div", { className: "grid gap-3 sm:grid-cols-2", children: /* @__PURE__ */ jsx(SelectField, { label: "Size", value: row.size, options: MONITOR_SIZE_OPTIONS, onChange: (size) => onChange({ ...row, size }) }) }) : isLaptop ? /* @__PURE__ */ jsxs("div", { className: "grid gap-3 md:grid-cols-4", children: [
      /* @__PURE__ */ jsx(SelectField, { label: "Processor", value: row.processor, options: PROCESSOR_OPTIONS, onChange: (processor) => onChange({ ...row, processor }) }),
      /* @__PURE__ */ jsx(SelectField, { label: "Generation", value: row.generation, options: GENERATION_OPTIONS, onChange: (generation) => onChange({ ...row, generation }) }),
      /* @__PURE__ */ jsx(SelectField, { label: "RAM", value: row.ram, options: RAM_OPTIONS, onChange: (ram) => onChange({ ...row, ram }) }),
      /* @__PURE__ */ jsx(SelectField, { label: "Storage", value: row.storage, options: STORAGE_OPTIONS, onChange: (storage) => onChange({ ...row, storage }) })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
      /* @__PURE__ */ jsx(SelectField, { label: "Model", value: row.model, options: GENERIC_SPEC_OPTIONS, onChange: (model) => onChange({ ...row, model }) }),
      /* @__PURE__ */ jsx(SelectField, { label: "Size", value: row.size, options: MONITOR_SIZE_OPTIONS, onChange: (size) => onChange({ ...row, size }) })
    ] })
  ] });
}
function SelectField({
  label,
  value,
  options,
  onChange
}) {
  return /* @__PURE__ */ jsxs("label", { className: "block space-y-1.5", children: [
    /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxs("select", { value, onChange: (event) => onChange(event.target.value), className: inputCls, children: [
      /* @__PURE__ */ jsxs("option", { value: "", children: [
        "Select ",
        label.toLowerCase()
      ] }),
      options.map((option) => /* @__PURE__ */ jsx("option", { value: option, children: option }, option))
    ] })
  ] });
}
function createVariantRow(input = {}) {
  return {
    id: `variant-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    processor: input.processor ?? "",
    generation: input.generation ?? "",
    ram: input.ram ?? "",
    storage: input.storage ?? "",
    size: input.size ?? "",
    model: input.model ?? ""
  };
}
function buildSpecsFromVariantRow(item, row) {
  const normalizedItem = String(item ?? "").trim().toLowerCase();
  const specs = {};
  if ((normalizedItem.includes("laptop") || normalizedItem.includes("desktop")) && row.processor) {
    specs.Processor = row.processor;
  }
  if ((normalizedItem.includes("laptop") || normalizedItem.includes("desktop")) && row.generation) {
    specs.Generation = row.generation;
  }
  if ((normalizedItem.includes("laptop") || normalizedItem.includes("desktop")) && row.ram) {
    specs.RAM = row.ram;
  }
  if ((normalizedItem.includes("laptop") || normalizedItem.includes("desktop")) && row.storage) {
    specs.Storage = row.storage;
  }
  if (normalizedItem.includes("monitor") && row.size) {
    specs.Size = row.size;
  }
  if (!normalizedItem.includes("laptop") && !normalizedItem.includes("desktop") && !normalizedItem.includes("monitor")) {
    if (normalizedItem === "other") return specs;
    if (row.model) specs.Model = row.model;
    if (row.size) specs.Size = row.size;
  }
  return specs;
}
function variantRowFromSpecs(item, specs) {
  const normalizedSpecs = Object.fromEntries(
    Object.entries(specs ?? {}).map(([key, value]) => [key.toLowerCase(), String(value)])
  );
  return createVariantRow({
    processor: normalizedSpecs.processor ?? "",
    generation: normalizedSpecs.generation ?? normalizedSpecs.gen ?? "",
    ram: normalizedSpecs.ram ?? normalizedSpecs["ram (gb)"] ?? "",
    storage: normalizedSpecs.storage ?? "",
    size: normalizedSpecs.size ?? normalizedSpecs["screen size (in)"] ?? "",
    model: normalizedSpecs.model ?? normalizedSpecs.condition ?? ""
  });
}
function catalogueItemUsesSpecs(item) {
  const normalizedItem = String(item ?? "").trim().toLowerCase();
  return normalizedItem.includes("laptop") || normalizedItem.includes("desktop") || normalizedItem.includes("monitor");
}
function Field({ label, className = "", children }) {
  return /* @__PURE__ */ jsxs("label", { className: `block space-y-1.5 ${className}`, children: [
    /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: label }),
    children
  ] });
}
const inputCls = "w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30";
const $$splitComponentImporter$3 = () => import("./admin.products.list-Bwo9L0Jk.js");
const Route$3 = createFileRoute("/admin/products/list")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./admin.products.add-Bwo9L0Jk.js");
const Route$2 = createFileRoute("/admin/products/add")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./admin.catalogue.list-BO6wI8ih.js");
const Route$1 = createFileRoute("/admin/catalogue/list")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./admin.catalogue.add-BO6wI8ih.js");
const Route = createFileRoute("/admin/catalogue/add")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const WishlistRoute = Route$j.update({
  id: "/wishlist",
  path: "/wishlist",
  getParentRoute: () => Route$k
});
const SitemapDotxmlRoute = Route$i.update({
  id: "/sitemap.xml",
  path: "/sitemap.xml",
  getParentRoute: () => Route$k
});
const SitemapProductsDotxmlRoute = Route$h.update({
  id: "/sitemap-products.xml",
  path: "/sitemap-products.xml",
  getParentRoute: () => Route$k
});
const SitemapPagesDotxmlRoute = Route$g.update({
  id: "/sitemap-pages.xml",
  path: "/sitemap-pages.xml",
  getParentRoute: () => Route$k
});
const SitemapCategoriesDotxmlRoute = Route$f.update({
  id: "/sitemap-categories.xml",
  path: "/sitemap-categories.xml",
  getParentRoute: () => Route$k
});
const ShopRoute = Route$e.update({
  id: "/shop",
  path: "/shop",
  getParentRoute: () => Route$k
});
const RobotsDottxtRoute = Route$d.update({
  id: "/robots.txt",
  path: "/robots.txt",
  getParentRoute: () => Route$k
});
const ContactRoute = Route$c.update({
  id: "/contact",
  path: "/contact",
  getParentRoute: () => Route$k
});
const CartRoute = Route$b.update({
  id: "/cart",
  path: "/cart",
  getParentRoute: () => Route$k
});
const AuthRoute = Route$a.update({
  id: "/auth",
  path: "/auth",
  getParentRoute: () => Route$k
});
const AdminRoute = Route$9.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => Route$k
}).lazy(() => import("./admin.lazy-B8uIj4zF.js").then((d) => d.Route));
const IndexRoute = Route$8.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$k
});
const AdminIndexRoute = Route$7.update({
  id: "/",
  path: "/",
  getParentRoute: () => AdminRoute
});
const ProductsSlugRoute = Route$6.update({
  id: "/products/$slug",
  path: "/products/$slug",
  getParentRoute: () => Route$k
});
const AdminProductsRoute = Route$5.update({
  id: "/products",
  path: "/products",
  getParentRoute: () => AdminRoute
}).lazy(
  () => import("./admin.products.lazy-DVxcXHU2.js").then((d) => d.Route)
);
const AdminCatalogueRoute = Route$4.update({
  id: "/catalogue",
  path: "/catalogue",
  getParentRoute: () => AdminRoute
});
const AdminProductsListRoute = Route$3.update({
  id: "/list",
  path: "/list",
  getParentRoute: () => AdminProductsRoute
});
const AdminProductsAddRoute = Route$2.update({
  id: "/add",
  path: "/add",
  getParentRoute: () => AdminProductsRoute
});
const AdminCatalogueListRoute = Route$1.update({
  id: "/list",
  path: "/list",
  getParentRoute: () => AdminCatalogueRoute
});
const AdminCatalogueAddRoute = Route.update({
  id: "/add",
  path: "/add",
  getParentRoute: () => AdminCatalogueRoute
});
const AdminCatalogueRouteChildren = {
  AdminCatalogueAddRoute,
  AdminCatalogueListRoute
};
const AdminCatalogueRouteWithChildren = AdminCatalogueRoute._addFileChildren(
  AdminCatalogueRouteChildren
);
const AdminProductsRouteChildren = {
  AdminProductsAddRoute,
  AdminProductsListRoute
};
const AdminProductsRouteWithChildren = AdminProductsRoute._addFileChildren(
  AdminProductsRouteChildren
);
const AdminRouteChildren = {
  AdminCatalogueRoute: AdminCatalogueRouteWithChildren,
  AdminProductsRoute: AdminProductsRouteWithChildren,
  AdminIndexRoute
};
const AdminRouteWithChildren = AdminRoute._addFileChildren(AdminRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  AdminRoute: AdminRouteWithChildren,
  AuthRoute,
  CartRoute,
  ContactRoute,
  RobotsDottxtRoute,
  ShopRoute,
  SitemapCategoriesDotxmlRoute,
  SitemapPagesDotxmlRoute,
  SitemapProductsDotxmlRoute,
  SitemapDotxmlRoute,
  WishlistRoute,
  ProductsSlugRoute
};
const routeTree = Route$k._addFileChildren(rootRouteChildren)._addFileTypes();
const QUERY_STALE_TIME = 1e3 * 60 * 10;
const QUERY_GC_TIME = 1e3 * 60 * 60;
const QUERY_CACHE_STORAGE_KEY = "shop-ict-query-cache-v3";
const QUERY_CACHE_MAX_AGE = 1e3 * 60 * 60;
function safeReadLocalStorage(key) {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}
function safeRemoveLocalStorage(key) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
  }
}
function safeWriteLocalStorage(key, value) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
  }
}
function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: QUERY_STALE_TIME,
        gcTime: QUERY_GC_TIME,
        refetchOnWindowFocus: false
      }
    }
  });
}
function restorePersistedQueryCache(queryClient) {
  if (typeof window === "undefined") return;
  try {
    const raw = safeReadLocalStorage(QUERY_CACHE_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (!parsed.timestamp || !parsed.clientState) return;
    if (Date.now() - parsed.timestamp > QUERY_CACHE_MAX_AGE) {
      safeRemoveLocalStorage(QUERY_CACHE_STORAGE_KEY);
      return;
    }
    hydrate(queryClient, parsed.clientState);
  } catch {
    safeRemoveLocalStorage(QUERY_CACHE_STORAGE_KEY);
  }
}
function persistQueryCache(queryClient) {
  if (typeof window === "undefined") return;
  const persist = () => {
    try {
      const clientState = dehydrate(queryClient, {
        shouldDehydrateQuery: (query) => query.state.status === "success"
      });
      safeWriteLocalStorage(
        QUERY_CACHE_STORAGE_KEY,
        JSON.stringify({
          timestamp: Date.now(),
          clientState
        })
      );
    } catch {
    }
  };
  persist();
  queryClient.getQueryCache().subscribe(persist);
}
const getRouter = () => {
  const queryClient = createQueryClient();
  restorePersistedQueryCache(queryClient);
  persistQueryCache(queryClient);
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  updateAdminProductCategoryPriority as A,
  Button as B,
  deleteAdminProduct as C,
  DEFAULT_WHATSAPP_NUMBER as D,
  storeAdminProductImages as E,
  upsertAdminProduct as F,
  prepareUploadedImage as G,
  AdminCataloguePage as H,
  router as I,
  Route$e as R,
  Skeleton as S,
  useStore as a,
  useWhatsAppNumber as b,
  cn as c,
  buildResponsiveImageAttrs as d,
  buildWaMessage as e,
  formatKES as f,
  getAdminAccessConfig as g,
  handleWhatsAppLinkClick as h,
  inquireSingle as i,
  optimizeImageUrl as j,
  fetchAdminDashboard as k,
  listProductCatalogue as l,
  Route$6 as m,
  absoluteUrl as n,
  openWhatsAppConversation as o,
  buildMetaDescription as p,
  cleanText as q,
  listAdminProducts as r,
  listAdminCategories as s,
  fetchAdminBestDealProductSlugs as t,
  useAuth as u,
  verifyAdminAccessCode as v,
  waLink as w,
  fetchAdminCatalogMeta as x,
  updateAdminProductFeatured as y,
  saveAdminBestDealProductSlugs as z
};
