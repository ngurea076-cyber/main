import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useNavigate } from "@tanstack/react-router";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { fetchShopPageData } from "./products-DQc7b5GA.js";
import { P as ProductCard } from "./product-card-DpFCsTsf.js";
import { R as Route, b as useWhatsAppNumber, D as DEFAULT_WHATSAPP_NUMBER, c as cn, S as Skeleton, d as buildResponsiveImageAttrs } from "./router-B4G_FXaH.js";
import { g as getCategoryGroupBySearchParam, A as ALL_CATEGORIES_LABEL, i as isSubcategoryForMainCategory, C as CATEGORY_TREE } from "./category-tree-BmC-Sh6N.js";
import "./tanstack-vendor-DM2N0uEF.js";
import "seroval";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router/ssr/server";
import "sonner";
import "clsx";
import "tailwind-merge";
import "zod";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-dialog";
const SORT_OPTIONS = [{
  label: "Most popular",
  value: "popular"
}, {
  label: "Price: Low to High",
  value: "price-asc"
}, {
  label: "Price: High to Low",
  value: "price-desc"
}, {
  label: "Newest",
  value: "newest"
}];
function resolveBannerUrl(url) {
  const value = String(url ?? "").trim();
  if (!value) return "/shop";
  if (/^https?:\/\//i.test(value)) return value;
  return value.startsWith("/") ? value : `/${value}`;
}
function ShopPage() {
  const navigate = useNavigate({
    from: "/shop"
  });
  const search = Route.useSearch();
  const {
    data: waNumber = DEFAULT_WHATSAPP_NUMBER
  } = useWhatsAppNumber();
  const initialScrollResetDone = useRef(false);
  const productListTopRef = useRef(null);
  const paginationScrollReadyRef = useRef(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [page, setPage] = useState(1);
  const [mobilePromoEmblaRef, mobilePromoEmblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    loop: true,
    slidesToScroll: 1
  });
  const [activeMobilePromoSlide, setActiveMobilePromoSlide] = useState(0);
  const selectedCategoryGroup = getCategoryGroupBySearchParam(search.category);
  const selectedMainCategory = selectedCategoryGroup?.label ?? ALL_CATEGORIES_LABEL;
  const selectedSubcategory = selectedCategoryGroup && isSubcategoryForMainCategory(selectedCategoryGroup.label, search.subcategory) ? search.subcategory : null;
  const selectedCategoryQuery = selectedMainCategory === ALL_CATEGORIES_LABEL ? void 0 : selectedCategoryGroup?.query;
  const selectedBrands = String(search.brands ?? "").split(",").map((brand) => brand.trim()).filter(Boolean);
  const minPrice = search.minPrice ? Number(search.minPrice) : null;
  const maxPrice = search.maxPrice ? Number(search.maxPrice) : null;
  const normalizedSearchQuery = search.q?.trim() ?? "";
  const shopProductsRequest = {
    categorySlug: selectedCategoryQuery,
    subcategory: selectedSubcategory ?? void 0,
    brands: selectedBrands,
    minPrice,
    maxPrice,
    search: search.q,
    sortBy,
    page,
    pageSize: 20
  };
  const searchSuggestionsRequest = normalizedSearchQuery.length > 0 ? {
    search: normalizedSearchQuery,
    sortBy: "popular",
    pageSize: 8
  } : null;
  const categorySearchSuggestionsRequest = selectedCategoryQuery && normalizedSearchQuery.length > 0 ? {
    categorySlug: selectedCategoryQuery,
    search: normalizedSearchQuery,
    sortBy: "popular",
    pageSize: 8
  } : null;
  const categorySuggestionsRequest = selectedCategoryQuery ? {
    categorySlug: selectedCategoryQuery,
    sortBy: "popular",
    pageSize: 8
  } : null;
  const {
    data: shopPageData,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ["shop-products", selectedCategoryQuery, selectedSubcategory, search.q, search.brands, search.minPrice, search.maxPrice, sortBy, page],
    queryFn: () => fetchShopPageData({
      products: shopProductsRequest,
      searchSuggestions: searchSuggestionsRequest,
      categorySearchSuggestions: categorySearchSuggestionsRequest,
      categorySuggestions: categorySuggestionsRequest
    }),
    staleTime: 1e3 * 60 * 10,
    gcTime: 1e3 * 60 * 60,
    placeholderData: keepPreviousData
  });
  const shopResult = shopPageData?.products;
  const searchSuggestionResult = shopPageData?.searchSuggestions;
  const categorySearchSuggestionResult = shopPageData?.categorySearchSuggestions;
  const categorySuggestionResult = shopPageData?.categorySuggestions;
  const homepageBanners = shopPageData?.homepageBanners;
  const searchSuggestionsLoading = isLoading && normalizedSearchQuery.length > 0;
  const products = shopResult?.products ?? [];
  const totalProducts = shopResult?.total ?? 0;
  const pageSize = shopResult?.pageSize ?? 20;
  const totalPages = Math.max(1, Math.ceil(totalProducts / pageSize));
  const currentPage = Math.min(page, totalPages);
  const resultStart = totalProducts === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const resultEnd = Math.min(currentPage * pageSize, totalProducts);
  const pageTitle = normalizedSearchQuery ? `Search results for "${normalizedSearchQuery}"` : selectedSubcategory ?? selectedMainCategory;
  const hasActiveFilters = selectedMainCategory !== ALL_CATEGORIES_LABEL || Boolean(selectedSubcategory) || selectedBrands.length > 0 || Boolean(search.minPrice) || Boolean(search.maxPrice) || normalizedSearchQuery.length > 0;
  const categorySearchSuggestions = categorySearchSuggestionResult?.products ?? [];
  const categorySuggestions = categorySuggestionResult?.products ?? [];
  const searchSuggestions = searchSuggestionResult?.products ?? [];
  const suggestedProducts = categorySearchSuggestions.length > 0 ? categorySearchSuggestions : categorySuggestions.length > 0 ? categorySuggestions : searchSuggestions;
  const legacyMobilePromoBanners = [homepageBanners?.rightBanner, ...homepageBanners?.popularBanners ?? []].filter((banner) => Boolean(banner?.image));
  const mobilePromoBanners = homepageBanners?.shopMobileBanners.length ? homepageBanners.shopMobileBanners : legacyMobilePromoBanners.slice(0, 3);
  const getMobilePromoImageAttrs = (image) => buildResponsiveImageAttrs(image, {
    width: 1200,
    height: 450,
    widths: [360, 540, 720, 960],
    sizes: "92vw",
    quality: "q_auto:eco"
  });
  const visiblePagination = Array.from({
    length: Math.min(5, totalPages)
  }, (_, index) => {
    const start = Math.max(1, Math.min(totalPages - 4, currentPage - 2));
    return start + index;
  });
  const handleSelectAllCategories = () => {
    navigate({
      search: (current) => ({
        ...current,
        category: void 0,
        subcategory: void 0
      })
    });
    setPage(1);
    if (window.innerWidth < 1024) setMobileFiltersOpen(false);
  };
  const handleClearFilters = () => {
    navigate({
      search: (current) => ({
        ...current,
        category: void 0,
        subcategory: void 0,
        q: void 0,
        brands: void 0,
        minPrice: void 0,
        maxPrice: void 0
      })
    });
    setPage(1);
    if (typeof window !== "undefined" && window.innerWidth < 1024) setMobileFiltersOpen(false);
  };
  const handleSelectMainCategory = (label) => {
    const category = CATEGORY_TREE.find((item) => item.label === label);
    navigate({
      search: (current) => ({
        ...current,
        category: category?.query ?? label,
        subcategory: void 0
      })
    });
    setOpenCategory(label);
    setPage(1);
    if (window.innerWidth < 1024) setMobileFiltersOpen(false);
  };
  const handleSelectSubcategory = (mainCategory, subcategory) => {
    const category = CATEGORY_TREE.find((item) => item.label === mainCategory);
    navigate({
      search: (current) => ({
        ...current,
        category: category?.query ?? mainCategory,
        subcategory
      })
    });
    setOpenCategory(mainCategory);
    setPage(1);
    if (window.innerWidth < 1024) setMobileFiltersOpen(false);
  };
  useEffect(() => {
    if (selectedMainCategory === ALL_CATEGORIES_LABEL) {
      setOpenCategory("");
      return;
    }
    if (selectedSubcategory && selectedMainCategory !== ALL_CATEGORIES_LABEL) {
      setOpenCategory(selectedMainCategory);
      return;
    }
    if (selectedMainCategory !== ALL_CATEGORIES_LABEL) {
      setOpenCategory(selectedMainCategory);
    }
  }, [selectedMainCategory, selectedSubcategory]);
  useEffect(() => {
    if (initialScrollResetDone.current || isLoading || typeof window === "undefined") return;
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto"
    });
    initialScrollResetDone.current = true;
  }, [isLoading]);
  useEffect(() => {
    if (!paginationScrollReadyRef.current) {
      paginationScrollReadyRef.current = true;
      return;
    }
    productListTopRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }, [page]);
  useEffect(() => {
    if (!mobilePromoEmblaApi) return;
    const syncSelected = () => {
      setActiveMobilePromoSlide(mobilePromoEmblaApi.selectedScrollSnap());
    };
    syncSelected();
    mobilePromoEmblaApi.on("select", syncSelected);
    mobilePromoEmblaApi.on("reInit", syncSelected);
    return () => {
      mobilePromoEmblaApi.off("select", syncSelected);
      mobilePromoEmblaApi.off("reInit", syncSelected);
    };
  }, [mobilePromoEmblaApi]);
  useEffect(() => {
    if (!mobilePromoEmblaApi) return;
    if (mobilePromoBanners.length <= 1) {
      mobilePromoEmblaApi.scrollTo(0, true);
      setActiveMobilePromoSlide(0);
      return;
    }
    const autoplay = window.setInterval(() => {
      mobilePromoEmblaApi.scrollNext();
    }, 5e3);
    return () => window.clearInterval(autoplay);
  }, [mobilePromoEmblaApi, mobilePromoBanners.length]);
  return /* @__PURE__ */ jsx("div", { className: "bg-white", children: /* @__PURE__ */ jsxs("div", { className: "site-desktop-width mx-auto px-1 py-8 md:px-6", children: [
    mobilePromoBanners.length > 0 ? /* @__PURE__ */ jsx("section", { className: "mb-5 px-2 lg:hidden", children: /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden rounded-[12px]", ref: mobilePromoEmblaRef, children: [
      /* @__PURE__ */ jsx("div", { className: "flex", children: mobilePromoBanners.map((banner, index) => /* @__PURE__ */ jsx("div", { className: "min-w-0 flex-[0_0_100%]", children: (() => {
        const imageAttrs = getMobilePromoImageAttrs(banner.image);
        return /* @__PURE__ */ jsx("a", { href: resolveBannerUrl(banner.url), className: "group relative block aspect-[16/6] overflow-hidden rounded-[12px] bg-[#111827]", children: /* @__PURE__ */ jsx("img", { src: imageAttrs.src, srcSet: imageAttrs.srcSet, sizes: imageAttrs.sizes, alt: `Shop promo banner ${index + 1}`, loading: index === 0 ? "eager" : "lazy", decoding: "async", className: "h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" }) });
      })() }, `shop-mobile-promo-${index}`)) }),
      mobilePromoBanners.length > 1 ? /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-x-0 bottom-3 flex justify-center", children: /* @__PURE__ */ jsx("div", { className: "pointer-events-auto flex items-center gap-2 rounded-full bg-black/25 px-3 py-1.5 backdrop-blur-sm", children: mobilePromoBanners.map((_, index) => /* @__PURE__ */ jsx("button", { type: "button", "aria-label": `Show shop promo banner ${index + 1}`, onClick: () => mobilePromoEmblaApi?.scrollTo(index), className: cn("rounded-full transition-all", activeMobilePromoSlide === index ? "h-2 w-5 bg-[#e92d48]" : "h-2 w-2 bg-[#cbd5e1]") }, `shop-mobile-promo-dot-${index}`)) }) }) : null
    ] }) }) }) : null,
    /* @__PURE__ */ jsxs("div", { className: "mb-5 flex items-center justify-between gap-4 lg:hidden", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-[34px] font-normal leading-none text-[#222222]", children: pageTitle }),
      /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => setMobileFiltersOpen(true), className: "inline-flex items-center gap-2 rounded-[3px] border border-[#dddddd] px-4 py-2 text-sm text-[#222222]", children: [
        /* @__PURE__ */ jsx(SlidersHorizontal, { className: "h-4 w-4" }),
        "Filters"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-[30px] lg:grid-cols-[250px_minmax(0,1fr)]", children: [
      /* @__PURE__ */ jsx(CategorySidebar, { mobileOpen: mobileFiltersOpen, onClose: () => setMobileFiltersOpen(false), openCategory, onToggleCategory: (label) => setOpenCategory((current) => current === label ? "" : label), selectedMainCategory, selectedSubcategory, onSelectAllCategories: handleSelectAllCategories, onSelectMainCategory: handleSelectMainCategory, onSelectSubcategory: handleSelectSubcategory }),
      /* @__PURE__ */ jsxs("main", { children: [
        /* @__PURE__ */ jsx("h1", { className: "hidden text-[34px] font-normal leading-none text-[#222222] lg:block", children: pageTitle }),
        isError ? /* @__PURE__ */ jsxs("div", { className: "mt-4 rounded-[6px] border border-[#f2b7c1] bg-[#fff4f6] px-4 py-3 text-sm text-[#c42544]", children: [
          "Could not load products. ",
          error instanceof Error ? error.message : "Please check the database connection and try again."
        ] }) : null,
        /* @__PURE__ */ jsx("div", { ref: productListTopRef, className: "scroll-mt-24" }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 hidden border-b border-[#dddddd] pb-4 md:flex md:flex-row md:items-center md:justify-between", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-[13px] text-[#222222]", children: [
            "Showing ",
            resultStart,
            " to ",
            resultEnd,
            " of ",
            totalProducts,
            " results."
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end", children: /* @__PURE__ */ jsx(ControlSelect, { label: "Sort by", value: sortBy, options: SORT_OPTIONS.map((option) => ({
            label: option.label,
            value: option.value
          })), onChange: (value) => {
            setSortBy(value);
            setPage(1);
          } }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 grid grid-cols-2 gap-1 md:grid-cols-4 md:gap-3 2xl:grid-cols-6 2xl:gap-3", children: [
          isLoading ? Array.from({
            length: 8
          }).map((_, index) => /* @__PURE__ */ jsxs("div", { className: "mb-3 flex h-full w-full flex-col overflow-hidden rounded-[8px] border border-black/5 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)] sm:mb-0 sm:rounded-xl sm:border sm:bg-card sm:p-[4px] sm:shadow-none", children: [
            /* @__PURE__ */ jsx(Skeleton, { className: "h-[220px] w-full sm:aspect-square sm:h-auto sm:rounded-[calc(theme(borderRadius.xl)-4px)]" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2 px-[4px] pb-[10px] pt-2 sm:mt-1.5 sm:px-[1px] sm:pb-[1px] sm:pt-0", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-24" }),
                /* @__PURE__ */ jsx(Skeleton, { className: "h-3 w-16" })
              ] }),
              /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-full" }),
              /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-5/6" })
            ] })
          ] }, `shop-skeleton-${index}`)) : null,
          products.map((product) => /* @__PURE__ */ jsx(ProductCard, { product, whatsAppNumber: waNumber }, product.id)),
          !isLoading && !isError && products.length === 0 ? /* @__PURE__ */ jsx(ShopEmptyState, { hasActiveFilters, searchQuery: normalizedSearchQuery, suggestions: suggestedProducts, suggestionsLoading: searchSuggestionsLoading, whatsAppNumber: waNumber, onClearFilters: handleClearFilters }) : null
        ] }),
        totalProducts > 0 ? /* @__PURE__ */ jsxs("div", { className: "mt-10 flex flex-wrap items-center justify-center gap-2", children: [
          visiblePagination.map((item) => /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setPage(item), className: cn("inline-flex h-8 min-w-8 items-center justify-center rounded-[3px] border px-3 text-sm", currentPage === item ? "border-[#e92d48] bg-[#e92d48] text-white" : "border-[#dddddd] bg-white text-[#e92d48]"), children: item }, item)),
          totalPages > visiblePagination.length ? /* @__PURE__ */ jsx("span", { className: "inline-flex h-8 min-w-8 items-center justify-center rounded-[3px] border border-[#dddddd] bg-white px-3 text-sm text-[#e92d48]", children: "..." }) : null,
          totalPages > visiblePagination.length ? /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setPage(totalPages), className: "inline-flex h-8 min-w-8 items-center justify-center rounded-[3px] border border-[#dddddd] bg-white px-3 text-sm text-[#e92d48]", children: totalPages }) : null,
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setPage((current) => Math.min(totalPages, current + 1)), className: "inline-flex h-8 items-center justify-center rounded-[3px] border border-[#dddddd] bg-white px-3 text-sm text-[#e92d48]", children: "Next" })
        ] }) : null
      ] })
    ] })
  ] }) });
}
function ShopEmptyState({
  hasActiveFilters,
  searchQuery,
  suggestions,
  suggestionsLoading,
  whatsAppNumber,
  onClearFilters
}) {
  return /* @__PURE__ */ jsxs("div", { className: "col-span-full rounded-[8px] border border-[#eeeeee] bg-[#fafafa] px-4 py-8 text-center", children: [
    /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-[#222222]", children: searchQuery ? `${searchQuery} not found.` : "Product not found." }),
    /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-[#6b7280]", children: suggestions.length > 0 || suggestionsLoading ? "Here are similar products you may like." : "Try clearing the filter or searching another keyword." }),
    hasActiveFilters ? /* @__PURE__ */ jsx("button", { type: "button", onClick: onClearFilters, className: "mt-4 inline-flex h-9 items-center justify-center rounded-[3px] border border-[#e92d48] bg-white px-4 text-sm font-medium text-[#e92d48]", children: "Clear filter" }) : null,
    suggestionsLoading ? /* @__PURE__ */ jsx("p", { className: "mt-6 text-sm text-[#6b7280]", children: "Finding similar products..." }) : suggestions.length > 0 ? /* @__PURE__ */ jsxs("div", { className: "mt-7 text-left", children: [
      /* @__PURE__ */ jsx("h2", { className: "mb-3 text-sm font-semibold text-[#222222]", children: "Similar products" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-1 md:grid-cols-4 md:gap-3", children: suggestions.map((product) => /* @__PURE__ */ jsx(ProductCard, { product, whatsAppNumber }, product.id)) })
    ] }) : null
  ] });
}
function CategorySidebar({
  mobileOpen,
  onClose,
  openCategory,
  onToggleCategory,
  selectedMainCategory,
  selectedSubcategory,
  onSelectAllCategories,
  onSelectMainCategory,
  onSelectSubcategory
}) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    mobileOpen ? /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 bg-black/35 lg:hidden", onClick: onClose }) : null,
    /* @__PURE__ */ jsxs("aside", { className: cn("border border-[#dddddd] bg-white lg:relative lg:block", "lg:h-fit lg:w-[250px]", mobileOpen ? "fixed right-0 top-0 z-50 h-full w-[86vw] max-w-[320px] overflow-y-auto" : "hidden lg:block"), children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-[#dddddd] bg-[#f7f7f7] px-4 py-3", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-sm font-bold text-[#222222]", children: "Categories" }),
        /* @__PURE__ */ jsx("button", { type: "button", onClick: onClose, className: "lg:hidden", "aria-label": "Close filters", children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4 text-[#4b5563]" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("button", { type: "button", onClick: onSelectAllCategories, className: cn("flex h-[38px] w-full items-center border-b border-[#dddddd] px-3 text-left text-sm transition-colors", selectedMainCategory === ALL_CATEGORIES_LABEL && !selectedSubcategory ? "bg-[#e92d48] text-white" : "text-[#4b5563] hover:bg-[#fafafa]"), children: "All Categories" }),
        CATEGORY_TREE.map((item) => {
          const isOpen = openCategory === item.label;
          const isActiveMain = selectedMainCategory === item.label && !selectedSubcategory;
          return /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex border-b border-[#dddddd]", children: [
              /* @__PURE__ */ jsx("button", { type: "button", onClick: () => onSelectMainCategory(item.label), className: cn("flex h-[38px] flex-1 items-center px-3 text-left text-sm transition-colors", isActiveMain ? "bg-[#e92d48] text-white" : "text-[#4b5563] hover:bg-[#fafafa]"), children: /* @__PURE__ */ jsx("span", { className: "truncate pr-2", children: item.label }) }),
              /* @__PURE__ */ jsx("button", { type: "button", onClick: () => onToggleCategory(item.label), className: "inline-flex h-[38px] w-10 items-center justify-center text-[#4b5563]", "aria-label": `${isOpen ? "Hide" : "Show"} ${item.label} subcategories`, children: /* @__PURE__ */ jsx(ChevronDown, { className: cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-180") }) })
            ] }),
            isOpen ? /* @__PURE__ */ jsx("div", { className: "bg-white", children: item.items.map((subItem) => {
              const isActiveSub = selectedMainCategory === item.label && selectedSubcategory === subItem;
              return /* @__PURE__ */ jsx("button", { type: "button", onClick: () => onSelectSubcategory(item.label, subItem), className: cn("flex h-[38px] w-full items-center border-b border-[#dddddd] px-3 pl-6 text-left text-sm transition-colors", isActiveSub ? "bg-[#e92d48] text-white" : "text-[#4b5563] hover:bg-[#fafafa]"), children: /* @__PURE__ */ jsx("span", { className: "truncate pr-2", children: subItem }) }, subItem);
            }) }) : null
          ] }, item.label);
        })
      ] })
    ] })
  ] });
}
function ControlSelect({
  label,
  value,
  options,
  onChange
}) {
  return /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-[13px] text-[#222222]", children: [
    /* @__PURE__ */ jsx("span", { children: label }),
    /* @__PURE__ */ jsxs("span", { className: "relative inline-flex min-w-[132px] items-center rounded-[3px] border border-[#dddddd] bg-white", children: [
      /* @__PURE__ */ jsx("select", { value, onChange: (e) => onChange(e.target.value), className: "h-full w-full appearance-none bg-transparent px-3 py-2 pr-8 text-[13px] text-[#222222] outline-none", children: options.map((option) => /* @__PURE__ */ jsx("option", { value: option.value, children: option.label }, option.value)) }),
      /* @__PURE__ */ jsx(ChevronDown, { className: "pointer-events-none absolute right-2 h-4 w-4 text-[#6b7280]" })
    ] })
  ] });
}
export {
  ShopPage as component
};
