import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { Package, ShoppingBag, MessageCircleMore, DollarSign, ChartColumn, Search, Plus, Boxes, Monitor, ArrowRight, BellRing, CircleAlert, Users, BadgeCheck, RefreshCw } from "lucide-react";
import * as RechartsPrimitive from "recharts";
import { LineChart, CartesianGrid, XAxis, YAxis, Line, PieChart, Pie, Cell } from "recharts";
import { c as cn, u as useAuth, k as fetchAdminDashboard, l as listProductCatalogue, f as formatKES } from "./router-B4G_FXaH.js";
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
const THEMES = { light: "", dark: ".dark" };
const ChartContext = React.createContext(null);
function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return context;
}
const ChartContainer = React.forwardRef(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;
  return /* @__PURE__ */ jsx(ChartContext.Provider, { value: { config }, children: /* @__PURE__ */ jsxs(
    "div",
    {
      "data-chart": chartId,
      ref,
      className: cn(
        "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx(ChartStyle, { id: chartId, config }),
        /* @__PURE__ */ jsx(RechartsPrimitive.ResponsiveContainer, { children })
      ]
    }
  ) });
});
ChartContainer.displayName = "Chart";
const ChartStyle = ({ id, config }) => {
  const colorConfig = Object.entries(config).filter(([, config2]) => config2.theme || config2.color);
  if (!colorConfig.length) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    "style",
    {
      dangerouslySetInnerHTML: {
        __html: Object.entries(THEMES).map(
          ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig.map(([key, itemConfig]) => {
            const color = itemConfig.theme?.[theme] || itemConfig.color;
            return color ? `  --color-${key}: ${color};` : null;
          }).join("\n")}
}
`
        ).join("\n")
      }
    }
  );
};
const ChartTooltip = RechartsPrimitive.Tooltip;
const ChartTooltipContent = React.forwardRef(
  ({
    active,
    payload,
    className,
    indicator = "dot",
    hideLabel = false,
    hideIndicator = false,
    label,
    labelFormatter,
    labelClassName,
    formatter,
    color,
    nameKey,
    labelKey
  }, ref) => {
    const { config } = useChart();
    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null;
      }
      const [item] = payload;
      const key = `${labelKey || item?.dataKey || item?.name || "value"}`;
      const itemConfig = getPayloadConfigFromPayload(config, item, key);
      const value = !labelKey && typeof label === "string" ? config[label]?.label || label : itemConfig?.label;
      if (labelFormatter) {
        return /* @__PURE__ */ jsx("div", { className: cn("font-medium", labelClassName), children: labelFormatter(value, payload) });
      }
      if (!value) {
        return null;
      }
      return /* @__PURE__ */ jsx("div", { className: cn("font-medium", labelClassName), children: value });
    }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey]);
    if (!active || !payload?.length) {
      return null;
    }
    const nestLabel = payload.length === 1 && indicator !== "dot";
    return /* @__PURE__ */ jsxs(
      "div",
      {
        ref,
        className: cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        ),
        children: [
          !nestLabel ? tooltipLabel : null,
          /* @__PURE__ */ jsx("div", { className: "grid gap-1.5", children: payload.filter((item) => item.type !== "none").map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const indicatorColor = color || item.payload.fill || item.color;
            return /* @__PURE__ */ jsx(
              "div",
              {
                className: cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center"
                ),
                children: formatter && item?.value !== void 0 && item.name ? formatter(item.value, item.name, item, index, item.payload) : /* @__PURE__ */ jsxs(Fragment, { children: [
                  itemConfig?.icon ? /* @__PURE__ */ jsx(itemConfig.icon, {}) : !hideIndicator && /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: cn(
                        "shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)",
                        {
                          "h-2.5 w-2.5": indicator === "dot",
                          "w-1": indicator === "line",
                          "w-0 border-[1.5px] border-dashed bg-transparent": indicator === "dashed",
                          "my-0.5": nestLabel && indicator === "dashed"
                        }
                      ),
                      style: {
                        "--color-bg": indicatorColor,
                        "--color-border": indicatorColor
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: cn(
                        "flex flex-1 justify-between leading-none",
                        nestLabel ? "items-end" : "items-center"
                      ),
                      children: [
                        /* @__PURE__ */ jsxs("div", { className: "grid gap-1.5", children: [
                          nestLabel ? tooltipLabel : null,
                          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: itemConfig?.label || item.name })
                        ] }),
                        item.value && /* @__PURE__ */ jsx("span", { className: "font-mono font-medium tabular-nums text-foreground", children: item.value.toLocaleString() })
                      ]
                    }
                  )
                ] })
              },
              item.dataKey
            );
          }) })
        ]
      }
    );
  }
);
ChartTooltipContent.displayName = "ChartTooltip";
const ChartLegendContent = React.forwardRef(({ className, hideIcon = false, payload, verticalAlign = "bottom", nameKey }, ref) => {
  const { config } = useChart();
  if (!payload?.length) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      className: cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      ),
      children: payload.filter((item) => item.type !== "none").map((item) => {
        const key = `${nameKey || item.dataKey || "value"}`;
        const itemConfig = getPayloadConfigFromPayload(config, item, key);
        return /* @__PURE__ */ jsxs(
          "div",
          {
            className: cn(
              "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
            ),
            children: [
              itemConfig?.icon && !hideIcon ? /* @__PURE__ */ jsx(itemConfig.icon, {}) : /* @__PURE__ */ jsx(
                "div",
                {
                  className: "h-2 w-2 shrink-0 rounded-[2px]",
                  style: {
                    backgroundColor: item.color
                  }
                }
              ),
              itemConfig?.label
            ]
          },
          item.value
        );
      })
    }
  );
});
ChartLegendContent.displayName = "ChartLegend";
function getPayloadConfigFromPayload(config, payload, key) {
  if (typeof payload !== "object" || payload === null) {
    return void 0;
  }
  const payloadPayload = "payload" in payload && typeof payload.payload === "object" && payload.payload !== null ? payload.payload : void 0;
  let configLabelKey = key;
  if (key in payload && typeof payload[key] === "string") {
    configLabelKey = payload[key];
  } else if (payloadPayload && key in payloadPayload && typeof payloadPayload[key] === "string") {
    configLabelKey = payloadPayload[key];
  }
  return configLabelKey in config ? config[configLabelKey] : config[key];
}
const RANGE_OPTIONS = [{
  label: "7 Days",
  value: 7
}, {
  label: "30 Days",
  value: 30
}, {
  label: "90 Days",
  value: 90
}];
const STATUS_STYLES = {
  pending: "bg-[#FFF7ED] text-[#B45309]",
  contacted: "bg-[#EFF6FF] text-[#1D4ED8]",
  completed: "bg-[#ECFDF3] text-[#15803D]",
  cancelled: "bg-[#FEF2F2] text-[#B91C1C]"
};
const TRAFFIC_COLORS = ["#111111", "#E30613", "#6B7280", "#F87171", "#D1D5DB"];
function AdminDashboard() {
  const [range, setRange] = useState(30);
  const [catalogueSearch, setCatalogueSearch] = useState("");
  const {
    role
  } = useAuth();
  const queryClient = useQueryClient();
  const {
    data,
    isFetching
  } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => fetchAdminDashboard(),
    enabled: role !== "attendant"
  });
  const {
    data: catalogue = []
  } = useQuery({
    queryKey: ["product-catalogue"],
    queryFn: () => listProductCatalogue(),
    enabled: role === "attendant"
  });
  const [manualRefreshPending, setManualRefreshPending] = useState(false);
  const refreshDashboard = async () => {
    setManualRefreshPending(true);
    try {
      await Promise.all([role === "attendant" ? Promise.resolve() : queryClient.invalidateQueries({
        queryKey: ["admin-dashboard"]
      }), role === "super_admin" ? queryClient.invalidateQueries({
        queryKey: ["super-admin-notifications"]
      }) : Promise.resolve()]);
    } finally {
      setManualRefreshPending(false);
    }
  };
  const refreshBusy = manualRefreshPending || isFetching;
  const stats = data?.stats;
  const chartData = useMemo(() => data?.analytics.series.slice(-range) ?? [], [data?.analytics.series, range]);
  const trafficSources = useMemo(() => (data?.analytics.trafficSources ?? []).map((source, index) => ({
    ...source,
    color: TRAFFIC_COLORS[index % TRAFFIC_COLORS.length]
  })), [data?.analytics.trafficSources]);
  const totalTraffic = useMemo(() => trafficSources.reduce((sum, source) => sum + Number(source.value ?? 0), 0), [trafficSources]);
  const deviceAnalytics = useMemo(() => data?.analytics.deviceAnalytics ?? [], [data?.analytics.deviceAnalytics]);
  const totalDevices = useMemo(() => deviceAnalytics.reduce((sum, device) => sum + Number(device.users ?? 0), 0), [deviceAnalytics]);
  const notifications = useMemo(() => buildNotifications({
    role,
    pending: stats?.pending ?? 0,
    completed: stats?.completed ?? 0,
    lowStock: data?.products.lowStock.length ?? 0,
    upcomingBills: data?.products.upcomingBills ?? [],
    overdueTakeouts: data?.products.overdueTakeouts ?? [],
    recent: data?.recent ?? []
  }), [data?.products.lowStock.length, data?.products.overdueTakeouts, data?.products.upcomingBills, data?.recent, role, stats?.completed, stats?.pending]);
  const topCards = [{
    label: "Total Products",
    value: formatNumber(stats?.products ?? 0),
    trend: "+8.4%",
    icon: Package,
    spark: buildSparkData(stats?.products ?? 0, 4)
  }, {
    label: "Total Orders",
    value: formatNumber(stats?.orders ?? 0),
    trend: "+12.6%",
    icon: ShoppingBag,
    spark: buildSparkData(stats?.orders ?? 0, 6)
  }, {
    label: "WhatsApp Inquiries",
    value: formatNumber(stats?.inquiries ?? 0),
    trend: "+15.2%",
    icon: MessageCircleMore,
    spark: buildSparkData(stats?.inquiries ?? 0, 7)
  }, {
    label: "Estimated Revenue",
    value: formatKES(stats?.revenue ?? 0),
    trend: "+10.9%",
    icon: DollarSign,
    spark: buildSparkData(Math.round((stats?.revenue ?? 0) / 1e3), 9)
  }, {
    label: "Monthly Expenses",
    value: formatKES(stats?.monthlyExpenses ?? 0),
    trend: "Tracked",
    icon: ChartColumn,
    spark: buildSparkData(Math.round((stats?.monthlyExpenses ?? 0) / 1e3), 5)
  }];
  const rightMetrics = [{
    label: "Conversion Rate",
    value: `${stats?.conversionRate ?? 0}%`,
    caption: "Inquiry to completed order"
  }, {
    label: "Total Customers",
    value: formatNumber(stats?.customers ?? 0),
    caption: "Unique shoppers captured"
  }, {
    label: "Returning Customers",
    value: formatNumber(stats?.returningCustomers ?? 0),
    caption: "Customers with repeat orders"
  }, {
    label: "Average Order Value",
    value: formatKES(stats?.averageOrderValue ?? 0),
    caption: "Average cart estimate"
  }];
  const catalogueMatches = useMemo(() => {
    const query = catalogueSearch.trim().toLowerCase();
    if (query.length < 2) return [];
    return catalogue.filter((entry) => [entry.product_name, entry.title, entry.item, ...Object.values(entry.specs ?? {})].filter(Boolean).some((value) => String(value).toLowerCase().includes(query))).slice(0, 6);
  }, [catalogue, catalogueSearch]);
  if (role === "attendant") {
    return /* @__PURE__ */ jsxs("div", { className: "grid max-w-5xl gap-4 xl:grid-cols-[minmax(0,1fr)_360px]", children: [
      /* @__PURE__ */ jsxs("section", { className: "rounded-[1.5rem] border border-border bg-white p-5 shadow-soft", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-[#111111]", children: "Catalogue Search" }),
          /* @__PURE__ */ jsx(Search, { className: "h-4 w-4 text-[#E30613]" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative mt-4", children: [
          /* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
          /* @__PURE__ */ jsx("input", { value: catalogueSearch, onChange: (event) => setCatalogueSearch(event.target.value), className: "w-full rounded-xl border bg-background py-3 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/30", placeholder: "Search catalogue before listing" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-4 overflow-hidden rounded-2xl border", children: catalogueSearch.trim().length < 2 ? /* @__PURE__ */ jsx("div", { className: "px-4 py-6 text-sm text-muted-foreground", children: "Type at least 2 letters to check existing catalogue products." }) : catalogueMatches.length > 0 ? /* @__PURE__ */ jsx("div", { className: "divide-y", children: catalogueMatches.map((entry) => /* @__PURE__ */ jsx("div", { className: "px-4 py-3", children: /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-semibold text-[#111111]", children: entry.product_name }),
          /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
            entry.item || "Catalogue",
            " - ",
            entry.product_id ? "Listed on website" : "Not listed on website"
          ] })
        ] }) }, entry.id)) }) : /* @__PURE__ */ jsx("div", { className: "px-4 py-6 text-sm text-muted-foreground", children: "No matching catalogue product found." }) })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "rounded-[1.5rem] border border-border bg-white p-5 shadow-soft", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-[#111111]", children: "Quick Actions" }),
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 text-[#E30613]" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 grid gap-2.5", children: [
          /* @__PURE__ */ jsx(QuickAction, { label: "Add Product", icon: Package, to: "/admin/products/add", primary: true }),
          /* @__PURE__ */ jsx(QuickAction, { label: "Products List", icon: ShoppingBag, to: "/admin/products/list" }),
          /* @__PURE__ */ jsx(QuickAction, { label: "Add Catalogue", icon: Boxes, to: "/admin/catalogue/add" }),
          /* @__PURE__ */ jsx(QuickAction, { label: "Catalogue List", icon: Monitor, to: "/admin/catalogue/list" })
        ] })
      ] })
    ] });
  }
  if (role === "admin") {
    return /* @__PURE__ */ jsxs("div", { className: "w-full max-w-[360px] space-y-4", children: [
      /* @__PURE__ */ jsx(DashboardRefreshButton, { onRefresh: refreshDashboard, busy: refreshBusy }),
      /* @__PURE__ */ jsxs("section", { className: "rounded-[1.5rem] border border-border bg-white p-5 shadow-soft", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-[#111111]", children: "Quick Actions" }),
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 text-[#E30613]" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 grid gap-2.5", children: [
          /* @__PURE__ */ jsx(QuickAction, { label: "New Order", icon: ShoppingBag, to: "/admin/orders/create", primary: true }),
          /* @__PURE__ */ jsx(QuickAction, { label: "Inventory Products", icon: Package, to: "/admin/inventory/products" }),
          /* @__PURE__ */ jsx(QuickAction, { label: "Stock Intake", icon: Boxes, to: "/admin/inventory/stock-intake" }),
          /* @__PURE__ */ jsx(QuickAction, { label: "Take-out Stock", icon: ArrowRight, to: "/admin/inventory/take-out" }),
          /* @__PURE__ */ jsx(QuickAction, { label: "Returns", icon: ArrowRight, to: "/admin/inventory/returns" }),
          /* @__PURE__ */ jsx(QuickAction, { label: "Inventory Records", icon: Monitor, to: "/admin/inventory/records" }),
          /* @__PURE__ */ jsx(QuickAction, { label: "Record Expense", icon: ChartColumn, to: "/admin/expenses" })
        ] })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-w-0 space-y-4 overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx(DashboardRefreshButton, { onRefresh: refreshDashboard, busy: refreshBusy }) }),
    /* @__PURE__ */ jsx("section", { className: "grid min-w-0 gap-3 sm:grid-cols-2 2xl:grid-cols-5", children: topCards.map((card) => /* @__PURE__ */ jsx(MetricCard, { ...card }, card.label)) }),
    /* @__PURE__ */ jsxs("section", { className: "grid min-w-0 gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,320px)]", children: [
      /* @__PURE__ */ jsxs("div", { className: "min-w-0 rounded-[1.5rem] border border-border bg-white p-5 shadow-soft", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-[#111111]", children: "Sales & Inquiry Analytics" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-[#4B5563]", children: "Track order momentum, revenue movement, and inquiry volume trends." })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "inline-flex rounded-xl border border-border bg-[#F5F5F7] p-1", children: RANGE_OPTIONS.map((option) => /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setRange(option.value), className: cn("rounded-lg px-3 py-1.5 text-xs font-medium transition-all", range === option.value ? "bg-white text-[#111111] shadow-sm" : "text-[#4B5563] hover:text-[#111111]"), children: option.label }, option.value)) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx(ChartContainer, { config: {
          revenue: {
            label: "Revenue",
            color: "#E30613"
          },
          inquiries: {
            label: "Inquiries",
            color: "#9CA3AF"
          }
        }, className: "h-[260px] w-full", children: /* @__PURE__ */ jsxs(LineChart, { data: chartData, margin: {
          top: 12,
          right: 8,
          left: 0,
          bottom: 0
        }, children: [
          /* @__PURE__ */ jsx(CartesianGrid, { vertical: false, strokeDasharray: "4 4" }),
          /* @__PURE__ */ jsx(XAxis, { dataKey: "label", tickLine: false, axisLine: false, minTickGap: 24 }),
          /* @__PURE__ */ jsx(YAxis, { yAxisId: "left", tickLine: false, axisLine: false, tickFormatter: (value) => `${Math.round(Number(value) / 1e3)}k` }),
          /* @__PURE__ */ jsx(YAxis, { yAxisId: "right", orientation: "right", tickLine: false, axisLine: false, allowDecimals: false }),
          /* @__PURE__ */ jsx(ChartTooltip, { content: /* @__PURE__ */ jsx(ChartTooltipContent, { formatter: (value, name) => /* @__PURE__ */ jsxs("div", { className: "flex w-full items-center justify-between gap-4", children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: name }),
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-[#111111]", children: name === "Revenue" ? formatKES(Number(value)) : Number(value).toLocaleString() })
          ] }) }) }),
          /* @__PURE__ */ jsx(Line, { yAxisId: "left", type: "monotone", dataKey: "revenue", stroke: "var(--color-revenue)", strokeWidth: 3, dot: false, activeDot: {
            r: 5,
            fill: "#E30613"
          } }),
          /* @__PURE__ */ jsx(Line, { yAxisId: "right", type: "monotone", dataKey: "inquiries", stroke: "var(--color-inquiries)", strokeWidth: 2.25, dot: false })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-1", children: rightMetrics.map((metric) => /* @__PURE__ */ jsxs("div", { className: "min-w-0 rounded-[1.25rem] border border-border bg-white p-4 shadow-soft", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-medium uppercase tracking-[0.12em] text-[#4B5563]", children: metric.label }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-2xl font-bold text-[#111111]", children: metric.value }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: metric.caption })
      ] }, metric.label)) })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "grid min-w-0 gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,320px)]", children: [
      /* @__PURE__ */ jsxs("div", { className: "min-w-0 rounded-[1.5rem] border border-border bg-white p-5 shadow-soft", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-[#111111]", children: "Recent Orders" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-[#4B5563]", children: "Showing the latest 5 recorded orders. Open orders for the full list." })
          ] }),
          /* @__PURE__ */ jsxs(Link, { to: "/admin/orders", className: "hidden items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-[#111111] transition-colors hover:bg-[#F5F5F7] sm:inline-flex", children: [
            "View Orders",
            /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-4 overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full text-xs sm:text-sm", children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-border text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground", children: [
            /* @__PURE__ */ jsx("th", { className: "pb-3 pr-3", children: "Customer" }),
            /* @__PURE__ */ jsx("th", { className: "pb-3 pr-3", children: "Products" }),
            /* @__PURE__ */ jsx("th", { className: "pb-3 pr-3", children: "Amount" }),
            /* @__PURE__ */ jsx("th", { className: "pb-3 pr-3", children: "Status" }),
            /* @__PURE__ */ jsx("th", { className: "pb-3 pr-3", children: "Date" }),
            /* @__PURE__ */ jsx("th", { className: "pb-3", children: "Action" })
          ] }) }),
          /* @__PURE__ */ jsxs("tbody", { children: [
            (data?.recent ?? []).map((order) => /* @__PURE__ */ jsxs("tr", { className: "border-b border-border/70 transition-colors hover:bg-[#FAFAFA]", children: [
              /* @__PURE__ */ jsxs("td", { className: "py-3 pr-3", children: [
                /* @__PURE__ */ jsx("div", { className: "font-semibold text-[#111111]", children: order.customer_name || "Walk-in customer" }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: order.customer_phone || "Phone not captured" })
              ] }),
              /* @__PURE__ */ jsx("td", { className: "py-3 pr-3 text-[#4B5563]", children: summarizeItems(order.items) }),
              /* @__PURE__ */ jsx("td", { className: "py-3 pr-3 font-semibold text-[#111111]", children: formatKES(Number(order.total ?? 0)) }),
              /* @__PURE__ */ jsx("td", { className: "py-3 pr-3", children: /* @__PURE__ */ jsx("span", { className: cn("inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize", STATUS_STYLES[String(order.status ?? "pending")] ?? "bg-[#F5F5F7] text-[#4B5563]"), children: String(order.status ?? "pending") }) }),
              /* @__PURE__ */ jsx("td", { className: "py-3 pr-3 text-[#4B5563]", children: new Date(order.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
              }) }),
              /* @__PURE__ */ jsx("td", { className: "py-3", children: /* @__PURE__ */ jsx(Link, { to: "/admin/orders", className: "inline-flex items-center gap-2 rounded-full border border-border px-2.5 py-1.5 text-[11px] font-semibold text-[#111111] transition-colors hover:bg-[#F5F5F7]", children: "Open" }) })
            ] }, order.id)),
            (data?.recent ?? []).length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 6, className: "py-12 text-center text-sm text-muted-foreground", children: "No orders recorded yet." }) })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "min-w-0 space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 rounded-[1.5rem] border border-border bg-white p-5 shadow-soft", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-[#111111]", children: "Quick Actions" }),
            /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4 text-[#E30613]" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 grid gap-2.5", children: [
            /* @__PURE__ */ jsx(QuickAction, { label: "Add Expense", icon: ChartColumn, to: "/admin/expenses", primary: true }),
            /* @__PURE__ */ jsx(QuickAction, { label: "View Orders", icon: ShoppingBag, to: "/admin/orders" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 rounded-[1.5rem] border border-border bg-white p-5 shadow-soft", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-[#111111]", children: "Notifications" }),
            /* @__PURE__ */ jsx(BellRing, { className: "h-4 w-4 text-[#E30613]" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-4 space-y-3", children: notifications.map((notification) => /* @__PURE__ */ jsxs("div", { className: "flex gap-3 rounded-[1.25rem] border border-border p-3", children: [
            /* @__PURE__ */ jsx("span", { className: "mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#FFF1F2] text-[#E30613]", children: /* @__PURE__ */ jsx(notification.icon, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-[#111111]", children: notification.title }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs leading-5 text-[#4B5563]", children: notification.description }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs font-medium text-muted-foreground", children: notification.time })
            ] })
          ] }, notification.title)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "grid min-w-0 gap-4 2xl:grid-cols-[minmax(0,1.6fr)_minmax(0,360px)]", children: [
      /* @__PURE__ */ jsxs("div", { className: "min-w-0 rounded-[1.5rem] border border-border bg-white p-5 shadow-soft", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-[#111111]", children: "Top Performing Products" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-[#4B5563]", children: "Showing the top 5 products by actual inquiry volume and revenue from orders." })
          ] }),
          /* @__PURE__ */ jsxs(Link, { to: "/shop", className: "inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-[#111111] transition-colors hover:bg-[#F5F5F7]", children: [
            "View Storefront",
            /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-3", children: [
          (data?.products.top ?? []).map((product) => /* @__PURE__ */ jsxs("div", { className: "grid min-w-0 gap-3 rounded-[1.25rem] border border-border p-3 transition-all hover:-translate-y-0.5 hover:shadow-md sm:grid-cols-[60px_minmax(0,1fr)_minmax(0,120px)_minmax(0,132px)]", children: [
            /* @__PURE__ */ jsx(ProductThumb, { title: product.title, image: product.image }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-semibold text-[#111111]", children: product.title }),
              /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
                product.inquiries,
                " inquiries captured"
              ] })
            ] }),
            /* @__PURE__ */ jsx(MetricPill, { label: "Inquiries", value: formatNumber(product.inquiries) }),
            /* @__PURE__ */ jsx(MetricPill, { label: "Revenue", value: formatKES(product.revenue), strong: true })
          ] }, product.slug)),
          (data?.products.top ?? []).length === 0 && /* @__PURE__ */ jsx("div", { className: "rounded-[1.5rem] border border-dashed border-border p-8 text-center text-sm text-muted-foreground", children: "Product performance will appear here once inquiries start coming in." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "min-w-0 rounded-[1.5rem] border border-border bg-white p-5 shadow-soft", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-[#111111]", children: "Low Stock Alerts" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-[#4B5563]", children: "Prioritize fast-moving items that need replenishment." })
          ] }),
          /* @__PURE__ */ jsx(CircleAlert, { className: "h-5 w-5 text-[#E30613]" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-3", children: [
          (data?.products.lowStock ?? []).map((product) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 rounded-[1.25rem] border border-border p-3", children: [
            /* @__PURE__ */ jsx(ProductThumb, { title: product.title, image: product.image, small: true }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-semibold text-[#111111]", children: product.title }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-muted-foreground capitalize", children: product.stock_status.replaceAll("_", " ") })
            ] }),
            /* @__PURE__ */ jsx("button", { type: "button", className: "rounded-full border border-[#F6C9CD] bg-[#FFF1F2] px-3 py-1.5 text-[11px] font-semibold text-[#E30613] transition-colors hover:bg-[#FFE4E7]", children: "Restock" })
          ] }, product.id)),
          (data?.products.lowStock ?? []).length === 0 && /* @__PURE__ */ jsx("div", { className: "rounded-[1.5rem] border border-dashed border-border p-8 text-center text-sm text-muted-foreground", children: "No low stock products right now." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "min-w-0 rounded-[1.5rem] border border-border bg-white p-5 shadow-soft", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-[#111111]", children: "Recent Expenses" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-[#4B5563]", children: "Latest recorded operating expenses across the business." })
        ] }),
        /* @__PURE__ */ jsxs(Link, { to: "/admin/expenses", className: "inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-[#111111] transition-colors hover:bg-[#F5F5F7]", children: [
          "View Expenses",
          /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 grid min-w-0 gap-3 md:grid-cols-3", children: [
        (data?.expenses ?? []).slice(0, 3).map((expense) => /* @__PURE__ */ jsxs("div", { className: "min-w-0 rounded-[1.25rem] border border-border p-4", children: [
          /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-semibold text-[#111111]", children: expense.title }),
          /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
            expense.category,
            " • ",
            new Date(expense.expense_date).toLocaleDateString("en-KE", {
              month: "short",
              day: "numeric"
            })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-3 text-lg font-bold text-[#111111]", children: formatKES(expense.amount) })
        ] }, expense.id)),
        (data?.expenses ?? []).length === 0 && /* @__PURE__ */ jsx("div", { className: "rounded-[1.25rem] border border-dashed border-border p-8 text-center text-sm text-muted-foreground md:col-span-3", children: "No expenses recorded yet." })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]", children: [
      /* @__PURE__ */ jsxs("div", { className: "min-w-0 rounded-[1.5rem] border border-border bg-white p-5 shadow-soft", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-[#111111]", children: "Traffic Sources" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-[#4B5563]", children: "Actual storefront traffic captured in the last 30 days." })
          ] }),
          /* @__PURE__ */ jsxs(Link, { to: "/admin/analytics", className: "inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-[#111111] transition-colors hover:bg-[#F5F5F7]", children: [
            "Analytics Page",
            /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
          ] })
        ] }),
        trafficSources.length > 0 ? /* @__PURE__ */ jsxs("div", { className: "mt-4 grid min-w-0 items-center gap-4 lg:grid-cols-[minmax(0,200px)_minmax(0,1fr)]", children: [
          /* @__PURE__ */ jsx(ChartContainer, { config: Object.fromEntries(trafficSources.map((source) => [source.name, {
            label: source.name,
            color: source.color
          }])), className: "mx-auto h-[180px] w-[180px]", children: /* @__PURE__ */ jsxs(PieChart, { children: [
            /* @__PURE__ */ jsx(Pie, { data: trafficSources, dataKey: "value", nameKey: "name", innerRadius: 48, outerRadius: 72, paddingAngle: 2, strokeWidth: 0, children: trafficSources.map((entry) => /* @__PURE__ */ jsx(Cell, { fill: entry.color }, entry.name)) }),
            /* @__PURE__ */ jsx(ChartTooltip, { content: /* @__PURE__ */ jsx(ChartTooltipContent, { formatter: (value, name) => /* @__PURE__ */ jsxs("div", { className: "flex w-full items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: name }),
              /* @__PURE__ */ jsxs("span", { className: "font-semibold text-[#111111]", children: [
                Number(value).toLocaleString(),
                " visits"
              ] })
            ] }) }) })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "min-w-0 space-y-2.5", children: trafficSources.map((source) => /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 items-center justify-between gap-3 rounded-[1rem] border border-border px-3 py-2.5", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 items-center gap-3", children: [
              /* @__PURE__ */ jsx("span", { className: "h-3 w-3 shrink-0 rounded-full", style: {
                backgroundColor: source.color
              } }),
              /* @__PURE__ */ jsx("span", { className: "truncate text-sm font-medium text-[#111111]", children: source.name })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "shrink-0 text-right", children: [
              /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold text-[#4B5563]", children: Number(source.value).toLocaleString() }),
              /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-muted-foreground", children: [
                totalTraffic ? Math.round(Number(source.value) / totalTraffic * 100) : 0,
                "%"
              ] })
            ] })
          ] }, source.name)) })
        ] }) : /* @__PURE__ */ jsxs("div", { className: "mt-4 rounded-[1.25rem] border border-dashed border-border bg-[#FAFAFA] p-5", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-[#111111]", children: "No traffic events recorded yet" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs leading-5 text-[#4B5563]", children: "Traffic-source analytics will start appearing here after new storefront visits are recorded." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "min-w-0 rounded-[1.5rem] border border-border bg-white p-5 shadow-soft", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-[#111111]", children: "Device Analytics" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-[#4B5563]", children: "Actual device mix from storefront visits captured in the last 30 days." })
          ] }),
          /* @__PURE__ */ jsx(Monitor, { className: "h-5 w-5 shrink-0 text-[#E30613]" })
        ] }),
        deviceAnalytics.length > 0 ? /* @__PURE__ */ jsx("div", { className: "mt-4 space-y-3", children: deviceAnalytics.map((device) => {
          const share = totalDevices ? Math.round(Number(device.users ?? 0) / totalDevices * 100) : 0;
          return /* @__PURE__ */ jsxs("div", { className: "min-w-0 rounded-[1.25rem] border border-border p-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsx("p", { className: "truncate text-sm font-semibold text-[#111111]", children: device.label }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  Number(device.users ?? 0).toLocaleString(),
                  " visits"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "shrink-0 text-base font-bold text-[#111111]", children: [
                share,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-3 h-2 rounded-full bg-[#F5F5F7]", children: /* @__PURE__ */ jsx("div", { className: "h-2 rounded-full bg-[#E30613]", style: {
              width: `${share}%`
            } }) })
          ] }, device.label);
        }) }) : /* @__PURE__ */ jsxs("div", { className: "mt-4 rounded-[1.25rem] border border-dashed border-border bg-[#FAFAFA] p-5", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-[#111111]", children: "No device events recorded yet" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs leading-5 text-[#4B5563]", children: "Device analytics will start appearing here after new storefront visits are recorded." })
        ] })
      ] })
    ] })
  ] });
}
function DashboardRefreshButton({
  onRefresh,
  busy
}) {
  return /* @__PURE__ */ jsxs("button", { type: "button", onClick: onRefresh, disabled: busy, className: "inline-flex h-10 items-center gap-2 rounded-full border border-border bg-white px-3 text-xs font-semibold text-[#111111] shadow-sm transition-colors hover:bg-[#F5F5F7] disabled:cursor-not-allowed disabled:opacity-60", children: [
    /* @__PURE__ */ jsx(RefreshCw, { className: cn("h-4 w-4 text-[#E30613]", busy && "animate-spin") }),
    busy ? "Refreshing" : "Refresh"
  ] });
}
function MetricCard({
  label,
  value,
  trend,
  icon: Icon,
  spark
}) {
  return /* @__PURE__ */ jsxs("div", { className: "min-w-0 rounded-[1.25rem] border border-border bg-white p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(17,17,17,0.06)]", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-medium uppercase tracking-[0.12em] text-[#4B5563]", children: label }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 truncate text-2xl font-bold text-[#111111]", children: value })
      ] }),
      /* @__PURE__ */ jsx("span", { className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#FFF1F2] text-[#E30613]", children: /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-end justify-between gap-3", children: [
      /* @__PURE__ */ jsx("span", { className: "rounded-full bg-[#FFF1F2] px-2.5 py-1 text-[11px] font-semibold text-[#E30613]", children: trend }),
      /* @__PURE__ */ jsx(ChartContainer, { config: {
        value: {
          label: "Value",
          color: "#E30613"
        }
      }, className: "h-10 w-20", children: /* @__PURE__ */ jsx(LineChart, { data: spark, margin: {
        top: 4,
        right: 0,
        left: 0,
        bottom: 0
      }, children: /* @__PURE__ */ jsx(Line, { type: "monotone", dataKey: "value", stroke: "var(--color-value)", strokeWidth: 2.5, dot: false }) }) })
    ] })
  ] });
}
function QuickAction({
  label,
  icon: Icon,
  to,
  primary
}) {
  const content = /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("span", { className: cn("grid h-8 w-8 place-items-center rounded-xl", primary ? "bg-white/20 text-white" : "bg-[#F5F5F7] text-[#111111]"), children: /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsx("span", { children: label }),
    /* @__PURE__ */ jsx(ArrowRight, { className: "ml-auto h-4 w-4" })
  ] });
  const className = cn("flex items-center gap-3 rounded-[1rem] px-3 py-2.5 text-xs font-semibold transition-all hover:-translate-y-0.5", primary ? "bg-[#E30613] text-white shadow-[0_12px_24px_rgba(227,6,19,0.18)]" : "border border-border bg-white text-[#111111] hover:bg-[#F5F5F7]");
  if (to) {
    return /* @__PURE__ */ jsx(Link, { to, className, children: content });
  }
  return /* @__PURE__ */ jsx("button", { type: "button", className, children: content });
}
function ProductThumb({
  title,
  image,
  small
}) {
  return image ? /* @__PURE__ */ jsx("img", { src: image, alt: title, className: cn("rounded-[1rem] border border-border bg-white object-contain object-center", small ? "h-12 w-12" : "h-[60px] w-[60px]") }) : /* @__PURE__ */ jsx("div", { className: cn("grid place-items-center rounded-[1rem] border border-border bg-[#F5F5F7] text-[#9CA3AF]", small ? "h-12 w-12" : "h-[60px] w-[60px]"), children: /* @__PURE__ */ jsx(Package, { className: "h-4 w-4" }) });
}
function MetricPill({
  label,
  value,
  strong
}) {
  return /* @__PURE__ */ jsxs("div", { className: "min-w-0 rounded-[1rem] bg-[#FAFAFA] px-3 py-2.5", children: [
    /* @__PURE__ */ jsx("p", { className: "text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground", children: label }),
    /* @__PURE__ */ jsx("p", { className: cn("mt-1.5 truncate text-xs font-semibold", strong ? "text-[#111111]" : "text-[#4B5563]"), children: value })
  ] });
}
function formatNumber(value) {
  return value.toLocaleString();
}
function summarizeItems(items) {
  if (!Array.isArray(items) || items.length === 0) return "No products listed";
  const titles = items.map((item) => item?.title).filter(Boolean);
  if (titles.length === 0) return "Custom inquiry";
  if (titles.length === 1) return titles[0];
  return `${titles[0]} +${titles.length - 1} more`;
}
function buildSparkData(seed, offset) {
  const base = Math.max(8, seed || 12);
  return Array.from({
    length: 7
  }, (_, index) => ({
    value: Math.max(4, Math.round(base * (0.62 + (index + offset) % 5 * 0.11)))
  }));
}
function buildNotifications({
  role,
  pending,
  completed,
  lowStock,
  upcomingBills,
  overdueTakeouts,
  recent
}) {
  const notifications = [];
  if (overdueTakeouts.length > 0) {
    const firstTakeout = overdueTakeouts[0];
    notifications.push({
      title: `${overdueTakeouts.length} take-out product${overdueTakeouts.length > 1 ? "s" : ""} need status update`,
      description: `${firstTakeout.product_title ?? "Product"} (${firstTakeout.serial_code ?? "serial"}) has not been marked returned or sold within 24 hours.`,
      time: "Take-out",
      icon: ArrowRight
    });
  }
  if (role === "super_admin" && upcomingBills.length > 0) {
    const nextBill = upcomingBills[0];
    notifications.push({
      title: `${upcomingBills.length} supplier bill${upcomingBills.length > 1 ? "s" : ""} due soon`,
      description: `${nextBill.supplier_name} bill ${nextBill.bill_number} is due on ${new Date(nextBill.due_date).toLocaleDateString("en-KE", {
        month: "short",
        day: "numeric",
        year: "numeric"
      })}.`,
      time: "Finance",
      icon: DollarSign
    });
  }
  if (pending > 0) {
    notifications.push({
      title: `${pending} enquir${pending === 1 ? "y" : "ies"} awaiting follow-up`,
      description: pending === 1 ? "There is 1 enquiry in the queue that still needs a response." : `There are ${pending} enquiries in the queue that still need responses.`,
      time: "Enquiries",
      icon: MessageCircleMore
    });
  }
  if (lowStock > 0) {
    notifications.push({
      title: `${lowStock} low-stock product${lowStock > 1 ? "s" : ""}`,
      description: lowStock === 1 ? "1 product is running low and may need restocking soon." : `${lowStock} products are running low and may need restocking soon.`,
      time: "Inventory",
      icon: CircleAlert
    });
  }
  if (recent[0]) {
    const latestOrder = recent[0];
    const customerName = latestOrder.customer_name || "Walk-in customer";
    notifications.push({
      title: `Latest order from ${customerName}`,
      description: `${summarizeItems(latestOrder.items)} recorded at ${formatKES(Number(latestOrder.total ?? 0))}.`,
      time: new Date(latestOrder.created_at).toLocaleDateString("en-KE", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }),
      icon: Users
    });
  }
  if (completed > 0) {
    notifications.push({
      title: `${completed} completed order${completed > 1 ? "s" : ""}`,
      description: completed === 1 ? "1 order has been marked as completed." : `${completed} orders have been marked as completed.`,
      time: "Orders",
      icon: BadgeCheck
    });
  }
  if (notifications.length === 0) {
    notifications.push({
      title: "No new operational alerts",
      description: "New enquiry, inventory, billing, and order updates will appear here as activity is recorded.",
      time: "Overview",
      icon: BellRing
    });
  }
  return notifications.slice(0, 4);
}
export {
  AdminDashboard as component
};
