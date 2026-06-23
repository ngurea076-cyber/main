import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { createLazyFileRoute, useRouterState } from "@tanstack/react-router";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import * as React from "react";
import { useState, useRef } from "react";
import { c as cn, r as listAdminProducts, s as listAdminCategories, t as fetchAdminBestDealProductSlugs, x as fetchAdminCatalogMeta, l as listProductCatalogue, B as Button, S as Skeleton, y as updateAdminProductFeatured, z as saveAdminBestDealProductSlugs, A as updateAdminProductCategoryPriority, C as deleteAdminProduct, E as storeAdminProductImages, F as upsertAdminProduct, G as prepareUploadedImage } from "./router-B4G_FXaH.js";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, ChevronDown, ChevronUp, Plus, Search, Sparkles, Star, ArrowUp, Pencil, Trash2, X } from "lucide-react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as SelectPrimitive from "@radix-ui/react-select";
import { C as CATEGORY_TREE } from "./category-tree-BmC-Sh6N.js";
import { stringifySubcategories } from "./products-DQc7b5GA.js";
import { toast } from "sonner";
import "clsx";
import "tailwind-merge";
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
const Checkbox = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  CheckboxPrimitive.Root,
  {
    ref,
    className: cn(
      "grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(CheckboxPrimitive.Indicator, { className: cn("grid place-content-center text-current"), children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) })
  }
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;
const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverContent = React.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(PopoverPrimitive.Portal, { children: /* @__PURE__ */ jsx(
  PopoverPrimitive.Content,
  {
    ref,
    align,
    sideOffset,
    className: cn(
      "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)",
      className
    ),
    ...props
  }
) }));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;
const Select = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;
const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
const SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollUpButton,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4" })
  }
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
const SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollDownButton,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" })
  }
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;
const SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
  SelectPrimitive.Content,
  {
    ref,
    className: cn(
      "relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    ),
    position,
    ...props,
    children: [
      /* @__PURE__ */ jsx(SelectScrollUpButton, {}),
      /* @__PURE__ */ jsx(
        SelectPrimitive.Viewport,
        {
          className: cn(
            "p-1",
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children
        }
      ),
      /* @__PURE__ */ jsx(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = SelectPrimitive.Content.displayName;
const SelectLabel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Label,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", className),
    ...props
  }
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;
const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })
    ]
  }
));
SelectItem.displayName = SelectPrimitive.Item.displayName;
const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
const Route = createLazyFileRoute("/admin/products")({ component: AdminProducts });
const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const DEFAULT_SPECS_TEMPLATE = `{
  "Model Number": "Hp Victus -16 inch core i5 13th gen 16gb ram / 512 ssd Rtx 3050 6gb",
  "Features": "Ex-UK Laptops",
  "Colour": "Not specified",
  "Condition": "Refurbished",
  "Size": "6gb",
  "Operating system": "Windows 11",
  "Processor": "Core i5",
  "RAM (GB)": "16",
  "Screen size (in)": "16"
}`;
function createEmptyForm() {
  return {
    title: "",
    catalogue_id: "",
    description: "",
    brand: "",
    subcategory: "",
    specs: DEFAULT_SPECS_TEMPLATE,
    price: "",
    stock_status: "in_stock",
    category_id: "",
    images: [],
    colors: [],
    featured: false,
    hidden: false,
    badge_type: "none",
    badge_value: ""
  };
}
const DEFAULT_BRANDS = [
  "HP",
  "Lenovo",
  "Dell",
  "Apple",
  "ASUS",
  "Acer",
  "Samsung",
  "LG",
  "Epson",
  "Canon",
  "JBL",
  "Logitech",
  "Anker",
  "UGREEN",
  "Kyocera"
];
const COLOR_OPTIONS = ["Black", "White", "Grey"];
function invalidateStorefrontProductQueries(qc) {
  qc.invalidateQueries({
    predicate: (query) => {
      const key = query.queryKey[0];
      return key === "featured" || key === "cat-laptops" || key === "cat-phones" || key === "cat-monitors" || key === "cat-printers" || key === "shop-products" || key === "product" || key === "related-products";
    }
  });
}
function AdminProductsPage() {
  const path = useRouterState({ select: (state) => state.location.pathname });
  const showFormOnly = path === "/admin/products/add";
  const showListOnly = path === "/admin/products/list";
  const showList = !showFormOnly;
  const pageSize = 20;
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(createEmptyForm());
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [savingBestDealSlug, setSavingBestDealSlug] = useState(null);
  const [savingFeaturedProductId, setSavingFeaturedProductId] = useState(null);
  const [savingPriorityProductId, setSavingPriorityProductId] = useState(null);
  const {
    data: products = [],
    isLoading: productsLoading,
    isError: productsError,
    error: productsErrorDetails
  } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => listAdminProducts()
  });
  const { data: categories = [] } = useQuery({
    queryKey: ["admin-cats"],
    queryFn: () => listAdminCategories()
  });
  const { data: bestDealSlugs = [] } = useQuery({
    queryKey: ["admin-best-deal-product-slugs"],
    queryFn: () => fetchAdminBestDealProductSlugs()
  });
  const { data: catalogMeta } = useQuery({
    queryKey: ["admin-catalog-meta"],
    queryFn: () => fetchAdminCatalogMeta()
  });
  const { data: catalogue = [] } = useQuery({
    queryKey: ["product-catalogue"],
    queryFn: () => listProductCatalogue()
  });
  const bestDealSlugSet = new Set(bestDealSlugs);
  const normalizedSearch = search.trim().toLowerCase();
  const filteredProducts = products.filter((p) => {
    const matchesSearch = !normalizedSearch || [p.title, p.slug, p.brand, p.subcategory, p.categories?.name].filter(Boolean).some((value) => String(value).toLowerCase().includes(normalizedSearch));
    const matchesCategory = categoryFilter === "all" || p.category_id === categoryFilter;
    const matchesFeatured = featuredFilter === "all" || featuredFilter === "featured" && bestDealSlugSet.has(p.slug) || featuredFilter === "regular" && !bestDealSlugSet.has(p.slug);
    return matchesSearch && matchesCategory && matchesFeatured;
  });
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const selectedCategoryName = categories.find((category) => category.id === form.category_id)?.name ?? "";
  const selectedCategoryGroup = CATEGORY_TREE.find((category) => category.label === selectedCategoryName);
  const suggestedSubcategories = (selectedCategoryName && catalogMeta?.subcategoriesByCategory?.[selectedCategoryName]?.length ? catalogMeta.subcategoriesByCategory[selectedCategoryName] : selectedCategoryGroup?.items) ?? [];
  const brandOptions = Array.from(
    new Set(
      [...DEFAULT_BRANDS, ...catalogMeta?.brands ?? [], ...products.map((product) => product.brand).filter(Boolean)].map((brand) => String(brand).trim()).filter(Boolean)
    )
  ).sort((a, b) => a.localeCompare(b));
  const selectedSubcategoryValues = form.subcategory.split(",").map((value) => value.trim()).filter(Boolean);
  const startEdit = (p) => {
    let badge_type = "none";
    let badge_value = "";
    if (p.badge === "New") badge_type = "new";
    else if (p.badge === "Hot") badge_type = "hot";
    else if (p.badge && p.badge.includes("%")) {
      badge_type = "custom";
      const match = p.badge.match(/(\d+)%/);
      badge_value = match ? match[1] : "";
    }
    setForm({
      id: p.id,
      title: p.title,
      description: p.description || "",
      brand: p.brand || "",
      subcategory: (p.subcategories || []).join(", ") || p.subcategory || "",
      specs: JSON.stringify(p.specs || {}, null, 2),
      catalogue_id: p.catalogue_id || "",
      price: String(p.price),
      stock_status: p.stock_status,
      category_id: p.category_id || "",
      images: Array.isArray(p.images) ? p.images.map(String) : [],
      colors: String(p.specs?.["Available colours"] || p.specs?.["Available colors"] || "").split(",").map((value) => value.trim()).filter((value) => COLOR_OPTIONS.includes(value)),
      featured: p.featured,
      hidden: Boolean(p.hidden),
      badge_type,
      badge_value
    });
    setOpen(true);
  };
  const startCreate = () => {
    setForm(createEmptyForm());
    setOpen(true);
  };
  const save = async (draft = form) => {
    const isEditing = Boolean(draft.id);
    const requiredTextFields = [
      { label: "Product", value: draft.title },
      { label: "Brand", value: draft.brand },
      { label: "Subcategory", value: draft.subcategory },
      { label: "Specs JSON", value: draft.specs },
      { label: "Price", value: draft.price },
      { label: "Description", value: draft.description }
    ];
    const missingField = requiredTextFields.find(({ value }) => !value.trim());
    if (missingField) {
      toast.error(`${missingField.label} is required`);
      return;
    }
    if (!isEditing && !draft.catalogue_id) {
      toast.error("Select a product from the catalogue dropdown");
      return;
    }
    if (!draft.category_id) {
      toast.error("Category is required");
      return;
    }
    if (draft.images.length === 0) {
      toast.error("At least one image is required");
      return;
    }
    let parsedSpecs = {};
    try {
      parsedSpecs = draft.specs.trim() ? JSON.parse(draft.specs) : {};
    } catch {
      toast.error("Specs must be valid JSON");
      return;
    }
    const parsedSubcategories = Array.from(
      new Set(
        draft.subcategory.split(",").map((item) => item.trim()).filter(Boolean)
      )
    );
    let badge = null;
    if (draft.badge_type === "new") badge = "New";
    else if (draft.badge_type === "hot") badge = "Hot";
    else if (draft.badge_type === "custom" && draft.badge_value) badge = `${draft.badge_value}% off`;
    let oldPrice = null;
    if (draft.badge_type === "custom" && draft.badge_value && draft.price) {
      const percent = Number(draft.badge_value);
      const price = Number(draft.price);
      if (!isNaN(percent) && !isNaN(price) && percent > 0) {
        oldPrice = Math.round(price / (1 - percent / 100));
      }
    }
    if (draft.colors.length > 0) {
      parsedSpecs["Available colours"] = draft.colors.join(", ");
    } else {
      delete parsedSpecs["Available colours"];
      delete parsedSpecs["Available colors"];
    }
    try {
      const storedImages = await storeAdminProductImages(draft.images);
      await upsertAdminProduct({
        id: draft.id,
        catalogue_id: draft.catalogue_id || null,
        title: draft.title,
        slug: slugify(draft.title),
        description: draft.description || null,
        brand: draft.brand || null,
        subcategory: stringifySubcategories(parsedSubcategories),
        price: Number(draft.price),
        old_price: oldPrice,
        stock_status: draft.stock_status,
        category_id: draft.category_id || null,
        images: storedImages,
        specs: parsedSpecs,
        featured: draft.featured,
        hidden: draft.hidden,
        badge
      });
      toast.success(isEditing ? "Product updated" : "Product created");
      setForm(createEmptyForm());
      if (!showFormOnly) {
        setOpen(false);
      }
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      invalidateStorefrontProductQueries(qc);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not save product";
      toast.error(message);
    }
  };
  const remove = async (id) => {
    if (!confirm("Delete this product?")) return;
    await deleteAdminProduct(id);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["admin-products"] });
    invalidateStorefrontProductQueries(qc);
  };
  const toggleBestDealProduct = async (product) => {
    const slug = String(product.slug ?? "").trim();
    if (!slug) {
      toast.error("This product is missing a slug.");
      return;
    }
    const nextSlugs = bestDealSlugSet.has(slug) ? bestDealSlugs.filter((item) => item !== slug) : [...bestDealSlugs, slug];
    try {
      setSavingBestDealSlug(slug);
      await saveAdminBestDealProductSlugs(nextSlugs);
      toast.success(bestDealSlugSet.has(slug) ? "Removed from Best Deals" : "Added to Best Deals");
      qc.invalidateQueries({ queryKey: ["admin-best-deal-product-slugs"] });
      invalidateStorefrontProductQueries(qc);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not update Best Deals.";
      toast.error(message);
    } finally {
      setSavingBestDealSlug(null);
    }
  };
  const toggleFeaturedProduct = async (product) => {
    const nextFeatured = !Boolean(product.featured);
    try {
      setSavingFeaturedProductId(product.id);
      await updateAdminProductFeatured({
        id: String(product.id),
        title: String(product.title),
        featured: nextFeatured
      });
      toast.success(nextFeatured ? "Featured on homepage" : "Removed from homepage featured products");
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      invalidateStorefrontProductQueries(qc);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not update homepage feature.";
      toast.error(message);
    } finally {
      setSavingFeaturedProductId(null);
    }
  };
  const toggleCategoryPriority = async (product) => {
    const nextPriority = !Boolean(product.category_priority);
    try {
      setSavingPriorityProductId(product.id);
      await updateAdminProductCategoryPriority({
        id: String(product.id),
        title: String(product.title),
        category_priority: nextPriority
      });
      toast.success(nextPriority ? "Product moved to top of category" : "Product removed from category top priority");
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      invalidateStorefrontProductQueries(qc);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not update category priority.";
      toast.error(message);
    } finally {
      setSavingPriorityProductId(null);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold tracking-tight", children: showFormOnly ? "Add New Product" : showListOnly ? "Products List" : "Products" }) }),
      showList ? /* @__PURE__ */ jsxs(Button, { onClick: startCreate, className: "rounded-full", children: [
        /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
        " Add product"
      ] }) : null
    ] }),
    showList ? /* @__PURE__ */ jsx("div", { className: "rounded-2xl border bg-card p-4 shadow-soft", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-3 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)_minmax(0,1fr)]", children: [
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
            placeholder: "Search by product, slug, brand, or subcategory",
            className: "w-full rounded-xl border bg-background py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("select", { value: categoryFilter, onChange: (e) => {
        setCategoryFilter(e.target.value);
        setPage(1);
      }, className: inputCls, children: [
        /* @__PURE__ */ jsx("option", { value: "all", children: "All categories" }),
        categories.map((c) => /* @__PURE__ */ jsx("option", { value: c.id, children: c.name }, c.id))
      ] }),
      /* @__PURE__ */ jsxs("select", { value: featuredFilter, onChange: (e) => {
        setFeaturedFilter(e.target.value);
        setPage(1);
      }, className: inputCls, children: [
        /* @__PURE__ */ jsx("option", { value: "all", children: "All products" }),
        /* @__PURE__ */ jsx("option", { value: "featured", children: "Best Deals only" }),
        /* @__PURE__ */ jsx("option", { value: "regular", children: "Not in Best Deals" })
      ] })
    ] }) }) : null,
    showList && productsError ? /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive", children: [
      "Could not load products. ",
      productsErrorDetails instanceof Error ? productsErrorDetails.message : "Please check the database connection and try again."
    ] }) : null,
    showList ? /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-2xl border bg-card shadow-soft", children: /* @__PURE__ */ jsx("div", { className: "overflow-hidden", children: /* @__PURE__ */ jsxs("table", { className: "w-full table-fixed text-sm", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-surface text-left text-xs uppercase text-muted-foreground", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "px-3 py-3 sm:px-4", children: "Product" }),
        /* @__PURE__ */ jsx("th", { className: "w-28 px-1 py-3 sm:w-72 sm:px-2", children: /* @__PURE__ */ jsx("span", { className: "sr-only sm:not-sr-only", children: "Homepage placement" }) }),
        /* @__PURE__ */ jsx("th", { className: "w-16 px-1 py-3 sm:w-24 sm:px-2" })
      ] }) }),
      /* @__PURE__ */ jsxs("tbody", { children: [
        productsLoading ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 3, className: "px-4 py-6", children: /* @__PURE__ */ jsx("div", { className: "space-y-3", children: Array.from({ length: 5 }).map((_, index) => /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[minmax(0,1.6fr)_0.9fr_80px] items-center gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-10 rounded-lg" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-40" }),
              /* @__PURE__ */ jsx(Skeleton, { className: "h-3 w-28" })
            ] })
          ] }),
          /* @__PURE__ */ jsx(Skeleton, { className: "h-9 w-32 rounded-full" }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
            /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-8 rounded-lg" }),
            /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-8 rounded-lg" })
          ] })
        ] }, index)) }) }) }) : null,
        paginatedProducts.map((p) => {
          const isBestDeal = bestDealSlugSet.has(p.slug);
          const isSavingBestDeal = savingBestDealSlug === p.slug;
          const isSavingFeatured = savingFeaturedProductId === p.id;
          const isSavingPriority = savingPriorityProductId === p.id;
          return /* @__PURE__ */ jsxs("tr", { className: "border-t", children: [
            /* @__PURE__ */ jsx("td", { className: "min-w-0 px-3 py-3 sm:px-4", children: /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "hidden h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white sm:block", children: p.images?.[0] && /* @__PURE__ */ jsx("img", { src: p.images[0], alt: "", className: "h-full w-full object-contain object-center" }) }),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex max-w-full items-center gap-1 font-medium", children: [
                  /* @__PURE__ */ jsx("span", { className: "truncate", title: p.title, children: p.title }),
                  Boolean(p.featured) && /* @__PURE__ */ jsx(Sparkles, { className: "h-3 w-3 shrink-0 fill-primary text-primary" }),
                  isBestDeal && /* @__PURE__ */ jsx(Star, { className: "h-3 w-3 shrink-0 fill-amber-400 text-amber-400" }),
                  Boolean(p.category_priority) && /* @__PURE__ */ jsx(ArrowUp, { className: "h-3 w-3 shrink-0 text-[#15803D]" }),
                  p.hidden ? /* @__PURE__ */ jsx("span", { className: "shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground", children: "Hidden" }) : null
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "hidden max-w-full truncate text-xs text-muted-foreground sm:block", title: `/${p.slug}`, children: [
                  "/",
                  p.slug
                ] })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx("td", { className: "px-1 sm:px-2", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 sm:gap-2", children: [
              /* @__PURE__ */ jsxs(
                Button,
                {
                  type: "button",
                  variant: Boolean(p.featured) ? "default" : "outline",
                  size: "icon",
                  className: "hidden h-7 w-7 rounded-full sm:inline-flex sm:h-9 sm:w-auto sm:px-3",
                  disabled: isSavingFeatured,
                  onClick: () => toggleFeaturedProduct(p),
                  "aria-label": p.featured ? "Remove from homepage featured products" : "Feature on homepage",
                  title: p.featured ? "Remove from homepage featured products" : "Feature on homepage",
                  children: [
                    /* @__PURE__ */ jsx(Sparkles, { className: `h-3.5 w-3.5 sm:h-4 sm:w-4 ${p.featured ? "fill-current" : ""}` }),
                    /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: p.featured ? "Featured" : "Feature" })
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  type: "button",
                  variant: isBestDeal ? "default" : "outline",
                  size: "icon",
                  className: "h-7 w-7 rounded-full sm:h-9 sm:w-9",
                  disabled: isSavingBestDeal,
                  onClick: () => toggleBestDealProduct(p),
                  "aria-label": isBestDeal ? "Remove from Best Deals" : "Add to Best Deals",
                  title: isBestDeal ? "Remove from Best Deals" : "Add to Best Deals",
                  children: /* @__PURE__ */ jsx(Star, { className: `h-3.5 w-3.5 sm:h-4 sm:w-4 ${isBestDeal ? "fill-current" : ""}` })
                }
              ),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  type: "button",
                  variant: Boolean(p.category_priority) ? "default" : "outline",
                  size: "icon",
                  className: "h-7 w-7 rounded-full sm:h-9 sm:w-auto sm:px-3",
                  disabled: isSavingPriority,
                  onClick: () => toggleCategoryPriority(p),
                  "aria-label": p.category_priority ? "Remove from category top priority" : "Show first in category",
                  title: p.category_priority ? "Remove from category top priority" : "Show first in category",
                  children: [
                    /* @__PURE__ */ jsx(ArrowUp, { className: `h-3.5 w-3.5 sm:h-4 sm:w-4 ${p.category_priority ? "stroke-[3]" : ""}` }),
                    /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: p.category_priority ? "Top" : "Make top" })
                  ]
                }
              )
            ] }) }),
            /* @__PURE__ */ jsx("td", { className: "px-1 sm:px-4", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-1", children: [
              /* @__PURE__ */ jsx("button", { onClick: () => startEdit(p), className: "rounded-lg p-1 hover:bg-surface sm:p-2", "aria-label": "Edit product", title: "Edit product", children: /* @__PURE__ */ jsx(Pencil, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4" }) }),
              /* @__PURE__ */ jsx("button", { onClick: () => remove(p.id), className: "rounded-lg p-1 hover:bg-surface sm:p-2", "aria-label": "Delete product", title: "Delete product", children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5 text-primary sm:h-4 sm:w-4" }) })
            ] }) })
          ] }, p.id);
        }),
        !productsLoading && filteredProducts.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 3, className: "py-12 text-center text-muted-foreground", children: "No products match your current search or filters." }) })
      ] })
    ] }) }) }) : null,
    showList && filteredProducts.length > pageSize && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 rounded-2xl border bg-card px-4 py-3 text-sm shadow-soft sm:flex-row sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground", children: [
        "Showing ",
        (currentPage - 1) * pageSize + 1,
        " to ",
        Math.min(currentPage * pageSize, filteredProducts.length),
        " of ",
        filteredProducts.length,
        " products"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "outline",
            className: "rounded-full",
            onClick: () => setPage((prev) => Math.max(1, prev - 1)),
            disabled: currentPage === 1,
            children: "Previous"
          }
        ),
        /* @__PURE__ */ jsxs("span", { className: "min-w-20 text-center text-muted-foreground", children: [
          "Page ",
          currentPage,
          " of ",
          totalPages
        ] }),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "outline",
            className: "rounded-full",
            onClick: () => setPage((prev) => Math.min(totalPages, prev + 1)),
            disabled: currentPage === totalPages,
            children: "Next"
          }
        )
      ] })
    ] }),
    showFormOnly ? /* @__PURE__ */ jsx("div", { className: "rounded-3xl border bg-background p-6 shadow-elegant", children: /* @__PURE__ */ jsx(
      ProductEditor,
      {
        form,
        setForm,
        categories,
        catalogue,
        products,
        selectedSubcategoryValues,
        suggestedSubcategories,
        brandOptions,
        save,
        onEditProduct: startEdit
      }
    ) }) : null,
    open && showList && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-3 md:p-4", onClick: () => setOpen(false), children: /* @__PURE__ */ jsx("div", { className: "max-h-[92vh] w-full max-w-5xl overflow-auto rounded-3xl bg-background p-4 shadow-elegant md:p-5", onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsx(
      ProductEditor,
      {
        form,
        setForm,
        categories,
        catalogue,
        products,
        selectedSubcategoryValues,
        suggestedSubcategories,
        brandOptions,
        save,
        onClose: () => setOpen(false),
        onEditProduct: startEdit
      }
    ) }) })
  ] });
}
function AdminProducts() {
  return /* @__PURE__ */ jsx(AdminProductsPage, {});
}
function ProductEditor({
  form,
  setForm,
  categories,
  catalogue,
  products,
  selectedSubcategoryValues,
  suggestedSubcategories,
  brandOptions,
  save,
  onClose,
  onEditProduct
}) {
  const [brandMenuOpen, setBrandMenuOpen] = useState(false);
  const [productMenuOpen, setProductMenuOpen] = useState(false);
  const [draggedImageIndex, setDraggedImageIndex] = useState(null);
  const draggedImageIndexRef = useRef(null);
  const addImages = async (files) => {
    if (!files || files.length === 0) return;
    const nextImages = await Promise.all(
      Array.from(files).map(
        (file) => prepareUploadedImage(file, {
          maxWidth: 1600,
          maxHeight: 1600,
          quality: 0.82,
          mimeType: "image/webp"
        })
      )
    );
    setForm({
      ...form,
      images: [...form.images, ...nextImages.filter(Boolean)]
    });
  };
  const normalizedBrandSearch = form.brand.trim().toLowerCase();
  const brandSuggestions = brandMenuOpen && normalizedBrandSearch.length > 0 ? brandOptions.filter((brand) => brand.toLowerCase().includes(normalizedBrandSearch)).slice(0, 8) : [];
  const normalizedProductSearch = form.title.trim().toLowerCase();
  const productSuggestions = productMenuOpen && normalizedProductSearch.length > 0 ? catalogue.filter(
    (entry) => [entry.product_name, entry.title, entry.item, ...Object.values(entry.specs ?? {})].filter(Boolean).some((value) => String(value).toLowerCase().includes(normalizedProductSearch))
  ).slice(0, 10) : [];
  const findListedProduct = (entry) => products.find(
    (product) => entry.product_id && String(product.id) === String(entry.product_id) || String(product.catalogue_id ?? "") === String(entry.id) || String(product.title ?? "").toLowerCase() === String(entry.product_name ?? "").toLowerCase()
  );
  const setCoverImage = (index) => {
    if (index <= 0 || index >= form.images.length) return;
    const selectedImage = form.images[index];
    const remainingImages = form.images.filter((_, imageIndex) => imageIndex !== index);
    setForm({
      ...form,
      images: [selectedImage, ...remainingImages]
    });
  };
  const moveImage = (fromIndex, toIndex) => {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= form.images.length || toIndex >= form.images.length) return;
    setForm((current) => {
      const nextImages = [...current.images];
      const [selectedImage] = nextImages.splice(fromIndex, 1);
      nextImages.splice(toIndex, 0, selectedImage);
      return {
        ...current,
        images: nextImages
      };
    });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold", children: form.id ? "Edit product" : "New product" }),
      onClose ? /* @__PURE__ */ jsx("button", { onClick: onClose, className: "rounded-full p-2 hover:bg-surface", children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) }) : null
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-3", children: [
      /* @__PURE__ */ jsx(Field, { label: "Product *", className: "sm:col-span-2 xl:col-span-3", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            required: true,
            value: form.title,
            onChange: (event) => {
              setForm({ ...form, catalogue_id: "", title: event.target.value });
              setProductMenuOpen(true);
            },
            onFocus: () => setProductMenuOpen(true),
            onBlur: () => {
              window.setTimeout(() => setProductMenuOpen(false), 120);
            },
            placeholder: "Start typing and select a catalogue product",
            autoComplete: "off",
            className: inputCls
          }
        ),
        productSuggestions.length > 0 ? /* @__PURE__ */ jsx("div", { className: "absolute z-30 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-border bg-background shadow-lg", children: productSuggestions.map((entry) => {
          const listedProduct = findListedProduct(entry);
          const isListed = Boolean(listedProduct);
          return /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm text-foreground transition hover:bg-[#fff8f9]",
              children: [
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    disabled: isListed,
                    onMouseDown: (event) => {
                      event.preventDefault();
                      if (isListed) return;
                      setForm({
                        ...form,
                        catalogue_id: entry.id,
                        title: entry.product_name,
                        subcategory: entry.item
                      });
                      setProductMenuOpen(false);
                    },
                    className: "min-w-0 flex-1 text-left disabled:cursor-default",
                    children: [
                      /* @__PURE__ */ jsxs("span", { className: "flex min-w-0 items-center gap-2", children: [
                        /* @__PURE__ */ jsx("span", { className: "truncate font-medium", children: entry.product_name }),
                        /* @__PURE__ */ jsx(
                          "span",
                          {
                            className: `shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${isListed ? "bg-[#ECFDF3] text-[#15803D]" : "bg-[#FFF7ED] text-[#C2410C]"}`,
                            children: isListed ? "Listed" : "Unlisted"
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsx("span", { className: "mt-0.5 block truncate text-xs text-muted-foreground", children: entry.item })
                    ]
                  }
                ),
                isListed ? /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onMouseDown: (event) => {
                      event.preventDefault();
                      setProductMenuOpen(false);
                      onEditProduct(listedProduct);
                    },
                    className: "inline-flex h-8 shrink-0 items-center gap-1 rounded-full border border-border px-3 text-xs font-semibold text-foreground transition hover:border-[#e92d48] hover:text-[#e92d48]",
                    children: [
                      /* @__PURE__ */ jsx(Pencil, { className: "h-3.5 w-3.5" }),
                      " Edit"
                    ]
                  }
                ) : /* @__PURE__ */ jsx("span", { className: "shrink-0 rounded-full bg-[#e92d48] px-3 py-1.5 text-xs font-semibold text-white", children: "List" })
              ]
            },
            entry.id
          );
        }) }) : productMenuOpen && normalizedProductSearch.length > 0 ? /* @__PURE__ */ jsx("div", { className: "absolute z-30 mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-muted-foreground shadow-lg", children: "No catalogue product found." }) : null
      ] }) }),
      /* @__PURE__ */ jsx(Field, { label: "Brand / Company *", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            required: true,
            value: form.brand,
            onChange: (e) => {
              setForm({ ...form, brand: e.target.value });
              setBrandMenuOpen(true);
            },
            onFocus: () => setBrandMenuOpen(true),
            onBlur: () => {
              window.setTimeout(() => setBrandMenuOpen(false), 120);
            },
            placeholder: "Type brand name",
            autoComplete: "off",
            className: inputCls
          }
        ),
        brandSuggestions.length > 0 ? /* @__PURE__ */ jsx("div", { className: "absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-border bg-background shadow-lg", children: brandSuggestions.map((brand) => /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onMouseDown: (event) => {
              event.preventDefault();
              setForm((current) => ({ ...current, brand }));
              setBrandMenuOpen(false);
            },
            className: "block w-full px-3 py-2 text-left text-sm text-foreground transition hover:bg-[#fff8f9]",
            children: brand
          },
          brand
        )) }) : null
      ] }) }),
      /* @__PURE__ */ jsx(Field, { label: "Category *", children: /* @__PURE__ */ jsxs(Select, { value: form.category_id || "none", onValueChange: (value) => setForm({ ...form, category_id: value === "none" ? "" : value }), children: [
        /* @__PURE__ */ jsx(SelectTrigger, { className: "h-[42px] rounded-xl border-border bg-background px-3 text-foreground", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select category" }) }),
        /* @__PURE__ */ jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsx(SelectItem, { value: "none", className: "focus:bg-[#fff1f4] focus:text-[#e92d48]", children: "No category" }),
          categories.map((c) => /* @__PURE__ */ jsx(SelectItem, { value: c.id, className: "focus:bg-[#fff1f4] focus:text-[#e92d48] data-[state=checked]:bg-[#e92d48] data-[state=checked]:text-white", children: c.name }, c.id))
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(Field, { label: "Subcategory *", children: /* @__PURE__ */ jsxs(Popover, { children: [
        /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs("button", { type: "button", className: "flex h-[42px] w-full items-center justify-between rounded-xl border border-border bg-background px-3 text-sm text-foreground transition", children: [
          /* @__PURE__ */ jsx("span", { className: "truncate text-left", children: selectedSubcategoryValues.length > 0 ? selectedSubcategoryValues.join(", ") : "Select subcategories" }),
          /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 shrink-0" })
        ] }) }),
        /* @__PURE__ */ jsx(PopoverContent, { align: "start", className: "w-[var(--radix-popover-trigger-width)] p-3", children: /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-foreground", children: "Subcategories" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "You can select more than one." })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "max-h-60 space-y-2 overflow-y-auto", children: suggestedSubcategories.length > 0 ? suggestedSubcategories.map((item) => /* @__PURE__ */ jsxs("label", { className: "flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2 text-sm transition hover:border-primary/40 hover:bg-[#fff8f9]", children: [
            /* @__PURE__ */ jsx(Checkbox, { checked: selectedSubcategoryValues.includes(item), onCheckedChange: (checked) => {
              const next = checked ? [...selectedSubcategoryValues, item] : selectedSubcategoryValues.filter((value) => value !== item);
              setForm({ ...form, subcategory: Array.from(new Set(next)).join(", ") });
            } }),
            /* @__PURE__ */ jsx("span", { className: "leading-5", children: item })
          ] }, item)) : /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Choose a category first to load subcategories." }) })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsx(Field, { label: "Price (KES) *", children: /* @__PURE__ */ jsx("input", { required: true, type: "number", value: form.price, onChange: (e) => setForm({ ...form, price: e.target.value }), className: inputCls }) }),
      /* @__PURE__ */ jsx(Field, { label: "Stock *", children: /* @__PURE__ */ jsxs("select", { value: form.stock_status, onChange: (e) => setForm({ ...form, stock_status: e.target.value }), className: inputCls, children: [
        /* @__PURE__ */ jsx("option", { value: "in_stock", children: "In stock" }),
        /* @__PURE__ */ jsx("option", { value: "low_stock", children: "Low stock" }),
        /* @__PURE__ */ jsx("option", { value: "out_of_stock", children: "Out of stock" })
      ] }) }),
      /* @__PURE__ */ jsx(Field, { label: "Available colours", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-2", children: COLOR_OPTIONS.map((color) => {
        const checked = form.colors.includes(color);
        return /* @__PURE__ */ jsxs(
          "label",
          {
            className: `flex cursor-pointer items-center justify-center rounded-xl border px-3 py-2 text-sm transition ${checked ? "border-[#e92d48] bg-[#fff1f4] text-[#e92d48]" : "border-border bg-background text-foreground hover:bg-[#fff8f9]"}`,
            children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked,
                  onChange: (event) => setForm((current) => ({
                    ...current,
                    colors: event.target.checked ? [...current.colors, color] : current.colors.filter((value) => value !== color)
                  })),
                  className: "sr-only"
                }
              ),
              color
            ]
          },
          color
        );
      }) }) }),
      /* @__PURE__ */ jsxs(Field, { label: "Badge *", children: [
        /* @__PURE__ */ jsxs(Select, { value: form.badge_type, onValueChange: (value) => setForm({ ...form, badge_type: value }), children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "h-[42px] rounded-xl px-3", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select badge" }) }),
          /* @__PURE__ */ jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsx(SelectItem, { value: "none", children: "None" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "new", children: "New" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "hot", children: "Hot" }),
            /* @__PURE__ */ jsx(SelectItem, { value: "custom", children: "Custom (% off)" })
          ] })
        ] }),
        form.badge_type === "custom" ? /* @__PURE__ */ jsx("input", { type: "number", placeholder: "Enter % off", value: form.badge_value, onChange: (e) => setForm({ ...form, badge_value: e.target.value }), className: `${inputCls} mt-2` }) : null
      ] }),
      /* @__PURE__ */ jsx(Field, { label: "Specs JSON *", className: "sm:col-span-2 xl:col-span-1", children: /* @__PURE__ */ jsx("textarea", { required: true, rows: 5, value: form.specs, onChange: (e) => setForm({ ...form, specs: e.target.value }), placeholder: DEFAULT_SPECS_TEMPLATE, className: `${inputCls} min-h-[132px]` }) }),
      /* @__PURE__ */ jsx(Field, { label: "Description *", className: "sm:col-span-2 xl:col-span-1", children: /* @__PURE__ */ jsx("textarea", { required: true, rows: 5, value: form.description, onChange: (e) => setForm({ ...form, description: e.target.value }), className: `${inputCls} min-h-[132px]` }) }),
      /* @__PURE__ */ jsx(Field, { label: "Images *", className: "sm:col-span-2 xl:col-span-3", children: /* @__PURE__ */ jsx("div", { className: "space-y-3 rounded-xl border border-dashed border-border p-3", children: form.images.length > 0 ? /* @__PURE__ */ jsxs("div", { className: "relative space-y-2", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Drag images to reorder them. The first image is the cover." }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5", children: [
          form.images.map((image, index) => /* @__PURE__ */ jsxs(
            "div",
            {
              draggable: true,
              onDragStart: (event) => {
                draggedImageIndexRef.current = index;
                setDraggedImageIndex(index);
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text/plain", String(index));
              },
              onDragOver: (event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
              },
              onDragEnter: (event) => {
                event.preventDefault();
                const fromIndex = draggedImageIndexRef.current;
                if (fromIndex == null || fromIndex === index) return;
                moveImage(fromIndex, index);
                draggedImageIndexRef.current = index;
                setDraggedImageIndex(index);
              },
              onDrop: (event) => {
                event.preventDefault();
                draggedImageIndexRef.current = null;
                setDraggedImageIndex(null);
              },
              onDragEnd: () => {
                draggedImageIndexRef.current = null;
                setDraggedImageIndex(null);
              },
              className: `cursor-grab overflow-hidden rounded-2xl border bg-background active:cursor-grabbing ${draggedImageIndex === index ? "border-[#e92d48] ring-2 ring-[#e92d48]/20" : ""}`,
              children: [
                /* @__PURE__ */ jsxs("div", { className: "relative aspect-square w-full overflow-hidden bg-white", children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: image,
                      alt: `Product upload ${index + 1}`,
                      draggable: false,
                      className: "pointer-events-none h-full w-full select-none object-contain object-center"
                    }
                  ),
                  index === 0 ? /* @__PURE__ */ jsx("span", { className: "absolute left-3 top-3 rounded-full bg-[#e92d48] px-2.5 py-1 text-[10px] font-semibold text-white", children: "Cover" }) : null,
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setForm({
                        ...form,
                        images: form.images.filter((_, imageIndex) => imageIndex !== index)
                      }),
                      className: "absolute right-3 top-3 rounded-full bg-black/70 p-1.5 text-white transition hover:bg-black",
                      "aria-label": `Remove image ${index + 1}`,
                      children: /* @__PURE__ */ jsx(X, { className: "h-3.5 w-3.5" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2 p-3", children: [
                  /* @__PURE__ */ jsxs("span", { className: "truncate text-[11px] text-muted-foreground", children: [
                    "Image ",
                    index + 1,
                    " of ",
                    form.images.length
                  ] }),
                  index === 0 ? /* @__PURE__ */ jsx("span", { className: "text-[11px] font-medium text-[#e92d48]", children: "Main image" }) : /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setCoverImage(index),
                      className: "rounded-full border border-border px-2.5 py-1 text-[11px] font-medium text-foreground transition hover:border-[#e92d48] hover:text-[#e92d48]",
                      children: "Set as cover"
                    }
                  )
                ] })
              ]
            },
            `${index}-${image.slice(0, 24)}`
          )),
          /* @__PURE__ */ jsxs("label", { className: "flex aspect-square min-w-0 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface px-2 text-center transition hover:bg-[#fff8f9]", children: [
            /* @__PURE__ */ jsx("span", { className: "grid h-10 w-10 place-items-center rounded-full bg-white text-xl font-semibold text-[#e92d48] shadow-sm", children: "+" }),
            /* @__PURE__ */ jsx("span", { className: "mt-2 text-xs font-medium text-foreground", children: "Add images" }),
            /* @__PURE__ */ jsx("span", { className: "mt-1 text-[11px] text-muted-foreground", children: "Upload more" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "file",
                accept: "image/*",
                multiple: true,
                className: "sr-only",
                onChange: async (e) => {
                  try {
                    await addImages(e.target.files);
                    e.target.value = "";
                  } catch {
                    toast.error("Could not load one or more images");
                  }
                }
              }
            )
          ] })
        ] })
      ] }) : /* @__PURE__ */ jsxs("label", { className: "flex min-h-[132px] cursor-pointer flex-col items-center justify-center rounded-xl bg-surface px-4 py-5 text-center transition hover:bg-[#fff8f9]", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground", children: "Choose images from this device" }),
        /* @__PURE__ */ jsx("span", { className: "mt-1 text-xs text-muted-foreground", children: "Upload one or many images. The first image will be used as the cover." }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "file",
            accept: "image/*",
            multiple: true,
            className: "sr-only",
            onChange: async (e) => {
              try {
                await addImages(e.target.files);
                e.target.value = "";
              } catch {
                toast.error("Could not load one or more images");
              }
            }
          }
        )
      ] }) }) }),
      /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-sm sm:col-span-2 xl:col-span-1 xl:self-end", children: [
        /* @__PURE__ */ jsx("input", { type: "checkbox", checked: form.featured, onChange: (e) => setForm({ ...form, featured: e.target.checked }) }),
        " Featured on homepage"
      ] }),
      /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-sm sm:col-span-2 xl:col-span-1 xl:self-end", children: [
        /* @__PURE__ */ jsx("input", { type: "checkbox", checked: form.hidden, onChange: (e) => setForm({ ...form, hidden: e.target.checked }) }),
        " Hide from store"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-5 flex justify-end gap-2", children: [
      onClose ? /* @__PURE__ */ jsx(Button, { variant: "outline", className: "rounded-full", onClick: onClose, children: "Cancel" }) : null,
      /* @__PURE__ */ jsx(Button, { className: "rounded-full", onClick: () => save(form), children: form.id ? "Save" : "Create" })
    ] })
  ] });
}
const inputCls = "w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30";
function Field({ label, children, className }) {
  return /* @__PURE__ */ jsxs("div", { className, children: [
    /* @__PURE__ */ jsx("label", { className: "mb-1 block text-[11px] font-medium text-muted-foreground", children: label }),
    children
  ] });
}
export {
  AdminProductsPage,
  Route
};
