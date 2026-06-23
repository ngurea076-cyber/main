import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { createLazyFileRoute, useNavigate, useRouterState, Outlet, Link } from "@tanstack/react-router";
import { Menu, Search, LayoutDashboard, Package, Store, X, LogOut, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { u as useAuth, S as Skeleton, c as cn } from "./router-B4G_FXaH.js";
import "@tanstack/react-query";
import "sonner";
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
const Route = createLazyFileRoute("/admin")({ component: AdminLayout });
const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  {
    label: "Products",
    icon: Package,
    roles: ["attendant"],
    children: [
      { to: "/admin/products/add", label: "Add New Product" },
      { to: "/admin/products/list", label: "Products List" }
    ]
  },
  {
    label: "Catalogue",
    icon: Store,
    roles: ["attendant"],
    children: [
      { to: "/admin/catalogue/add", label: "Add New" },
      { to: "/admin/catalogue/list", label: "List" }
    ]
  }
];
const PATH_ROLES = [
  { prefix: "/admin/catalogue", roles: ["attendant"] },
  { prefix: "/admin/products", roles: ["attendant"] },
  { prefix: "/admin/orders", roles: [] },
  { prefix: "/admin/inventory", roles: [] },
  { prefix: "/admin/expenses", roles: [] },
  { prefix: "/admin/finance", roles: [] },
  { prefix: "/admin/categories", roles: [] },
  { prefix: "/admin/enquiries", roles: [] },
  { prefix: "/admin/analytics", roles: [] },
  { prefix: "/admin/suppliers", roles: [] },
  { prefix: "/admin/resellers", roles: [] },
  { prefix: "/admin/bills", roles: [] },
  { prefix: "/admin/notifications", roles: [] },
  { prefix: "/admin/activity", roles: [] },
  { prefix: "/admin/settings", roles: [] },
  { prefix: "/admin/users", roles: [] },
  { prefix: "/admin", roles: ["attendant"] }
];
function AdminLayout() {
  const { user, isAdmin, loading, role, signOut } = useAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);
  useEffect(() => {
    setMobileOpen(false);
  }, [path]);
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "grid min-h-screen place-items-center bg-surface px-4", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-[320px] space-y-3", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-40 rounded-xl" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-24 w-full rounded-2xl" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-24 w-full rounded-2xl" })
    ] }) });
  }
  if (!user) return null;
  if (!isAdmin) return /* @__PURE__ */ jsx(NoAccess, {});
  if (!canAccessPath(path, role)) {
    return /* @__PURE__ */ jsx(NoAccess, { title: "Role access required", description: "Your current role does not have permission to open this section." });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen overflow-x-hidden bg-surface text-foreground lg:pl-72", children: [
    /* @__PURE__ */ jsx(
      AdminSidebar,
      {
        path,
        open: mobileOpen,
        onClose: () => setMobileOpen(false),
        onLogout: () => signOut(),
        role,
        notificationCount: 0
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen min-w-0", children: [
      /* @__PURE__ */ jsx("header", { className: "sticky top-0 z-30 border-b border-border bg-white/95 shadow-[0_1px_2px_rgba(17,17,17,0.04)] backdrop-blur-0", children: /* @__PURE__ */ jsxs("div", { className: "flex h-18 items-center gap-3 px-4 sm:px-6 lg:px-8", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setMobileOpen(true),
            className: "inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-white text-foreground transition-colors hover:bg-[#F5F5F7] lg:hidden",
            "aria-label": "Open menu",
            children: /* @__PURE__ */ jsx(Menu, { className: "h-5 w-5" })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "hidden flex-1 justify-center md:flex", children: /* @__PURE__ */ jsxs("label", { className: "flex w-full max-w-xl items-center gap-3 rounded-2xl border border-border bg-[#F5F5F7] px-4 py-3 shadow-sm", children: [
          /* @__PURE__ */ jsx(Search, { className: "h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "search",
              placeholder: "Search products, orders, or enquiries",
              className: "w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "ml-auto flex items-center gap-2 sm:gap-3", children: /* @__PURE__ */ jsxs("div", { className: "hidden items-center gap-3 rounded-2xl border border-border bg-white px-3 py-2 shadow-sm sm:flex", children: [
          /* @__PURE__ */ jsx("div", { className: "grid h-10 w-10 place-items-center rounded-2xl bg-[#111111] text-sm font-semibold text-white", children: getInitial(user.email) }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-semibold text-[#111111]", children: "Admin Profile" }),
            /* @__PURE__ */ jsxs("p", { className: "truncate text-xs text-muted-foreground", children: [
              formatRole(role),
              " • ",
              user.email
            ] })
          ] })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsx("main", { className: "min-w-0 px-4 py-6 sm:px-6 lg:px-8 lg:py-8", children: /* @__PURE__ */ jsx(Outlet, {}) })
    ] })
  ] });
}
function AdminSidebar({
  open,
  onClose,
  onLogout,
  path,
  role,
  notificationCount
}) {
  const [openMenu, setOpenMenu] = useState(null);
  const navItems = NAV_ITEMS.filter((item) => isVisibleToRole(item.roles, role));
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: cn(
          "fixed inset-0 z-40 bg-black/30 transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        ),
        onClick: onClose
      }
    ),
    /* @__PURE__ */ jsxs(
      "aside",
      {
        className: cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-white transition-transform duration-300 lg:z-20 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        ),
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-border px-4 py-4", children: [
            /* @__PURE__ */ jsxs(Link, { to: "/admin", className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ jsx("span", { className: "grid h-10 w-10 place-items-center rounded-2xl bg-[#111111] text-sm font-bold text-white", children: "SI" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-[13px] font-semibold text-[#111111]", children: "Shop ICT Gadgets" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Admin Console" })
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: onClose,
                className: "inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-border text-[#4B5563] transition-colors hover:bg-[#F5F5F7] lg:hidden",
                "aria-label": "Close menu",
                children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto px-3 py-4", children: /* @__PURE__ */ jsx("nav", { className: "space-y-1", children: navItems.map(
            (item) => "children" in item ? /* @__PURE__ */ jsx(
              SidebarSubmenu,
              {
                item,
                path,
                role,
                open: openMenu === item.label,
                onToggle: () => setOpenMenu((current) => current === item.label ? null : item.label)
              },
              item.label
            ) : /* @__PURE__ */ jsx(
              SidebarLink,
              {
                item,
                active: item.exact ? path === item.to : path.startsWith(item.to),
                badgeCount: item.to === "/admin/notifications" ? notificationCount : void 0
              },
              item.to
            )
          ) }) }),
          /* @__PURE__ */ jsxs("div", { className: "border-t border-border p-3", children: [
            /* @__PURE__ */ jsxs(
              Link,
              {
                to: "/",
                className: "mb-2 flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-medium text-[#4B5563] transition-all hover:bg-[#F5F5F7]",
                children: [
                  /* @__PURE__ */ jsx(Store, { className: "h-4 w-4" }),
                  "View storefront"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: onLogout,
                className: "flex w-full items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-medium text-[#4B5563] transition-all hover:bg-[#FFF1F2] hover:text-[#E30613]",
                children: [
                  /* @__PURE__ */ jsx(LogOut, { className: "h-4 w-4" }),
                  "Logout"
                ]
              }
            )
          ] })
        ]
      }
    )
  ] });
}
function SidebarLink({
  item,
  active,
  badgeCount
}) {
  const Icon = item.icon;
  return /* @__PURE__ */ jsxs(
    Link,
    {
      to: item.to,
      className: cn(
        "group flex items-center gap-2.5 rounded-2xl border px-3 py-2.5 text-[13px] font-medium transition-all",
        active ? "border-[#F6C9CD] bg-[#FFF1F2] text-[#E30613] shadow-sm" : "border-transparent text-[#4B5563] hover:border-border hover:bg-[#F5F5F7] hover:text-[#111111]"
      ),
      children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            className: cn(
              "grid h-8 w-8 place-items-center rounded-xl transition-colors",
              active ? "bg-[#E30613] text-white" : "bg-[#F5F5F7] text-[#4B5563] group-hover:bg-white"
            ),
            children: /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsx("span", { children: item.label }),
        badgeCount && badgeCount > 0 ? /* @__PURE__ */ jsx("span", { className: "ml-auto inline-flex min-w-5 items-center justify-center rounded-full bg-[#E30613] px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white", children: badgeCount }) : null
      ]
    }
  );
}
function SidebarSubmenu({
  item,
  path,
  role,
  open,
  onToggle
}) {
  const Icon = item.icon;
  const children = item.children.filter((child) => isVisibleToRole(child.roles, role));
  if (children.length === 0) return null;
  const active = children.some((child) => path.startsWith(child.to));
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: onToggle,
        className: cn(
          "flex w-full items-center gap-2.5 rounded-2xl border px-3 py-2.5 text-left text-[13px] font-medium transition-all",
          active ? "border-[#F6C9CD] bg-[#FFF1F2] text-[#E30613] shadow-sm" : "border-transparent text-[#4B5563] hover:border-border hover:bg-[#F5F5F7] hover:text-[#111111]"
        ),
        children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              className: cn(
                "grid h-8 w-8 place-items-center rounded-xl transition-colors",
                active ? "bg-[#E30613] text-white" : "bg-[#F5F5F7] text-[#4B5563]"
              ),
              children: /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsx("span", { children: item.label }),
          /* @__PURE__ */ jsx(ChevronDown, { className: cn("ml-auto h-4 w-4 transition-transform", open ? "rotate-0" : "-rotate-90") })
        ]
      }
    ),
    open ? /* @__PURE__ */ jsx("div", { className: "mt-2 ml-3 space-y-1 border-l border-border pl-3", children: children.map((child) => /* @__PURE__ */ jsx(
      Link,
      {
        to: child.to,
        className: cn(
          "block rounded-xl px-2.5 py-2 text-[13px] transition-colors",
          path.startsWith(child.to) ? "bg-[#FFF1F2] font-medium text-[#E30613]" : "text-[#4B5563] hover:bg-[#F5F5F7] hover:text-[#111111]"
        ),
        children: child.label
      },
      `${item.label}-${child.label}`
    )) }) : null
  ] });
}
function NoAccess({
  title = "Admin access required",
  description = "Sign in with your admin credentials to access the dashboard."
}) {
  return /* @__PURE__ */ jsx("div", { className: "grid min-h-screen place-items-center bg-surface px-6", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md rounded-[2rem] border border-border bg-white p-8 text-center shadow-soft", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-[#111111]", children: title }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: description }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-col items-center gap-3", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/auth",
          className: "inline-flex items-center justify-center rounded-full bg-[#E30613] px-5 py-2.5 text-sm font-medium text-white",
          children: "Go to admin login"
        }
      ),
      /* @__PURE__ */ jsx(Link, { to: "/", className: "text-sm font-medium text-[#E30613] hover:underline", children: "Back home" })
    ] })
  ] }) });
}
function getInitial(email) {
  return (email?.trim().charAt(0) || "A").toUpperCase();
}
function canAccessPath(path, role) {
  if (!role) return false;
  const match = PATH_ROLES.find((item) => path.startsWith(item.prefix));
  return match ? match.roles.includes(role) : true;
}
function isVisibleToRole(roles, role) {
  if (!roles || roles.length === 0) return true;
  if (!role) return false;
  return roles.includes(role);
}
function formatRole(role) {
  if (role === "super_admin") return "Super Admin";
  if (role === "attendant") return "Attendant";
  return "Admin";
}
export {
  Route
};
