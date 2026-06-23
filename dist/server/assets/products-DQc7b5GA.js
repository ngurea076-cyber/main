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
const SUBCATEGORY_SEPARATOR = " || ";
function parseSubcategories(value) {
  return String(value ?? "").split(SUBCATEGORY_SEPARATOR).map((item) => item.trim()).filter(Boolean);
}
function stringifySubcategories(values) {
  const normalized = Array.from(new Set(values.map((item) => item.trim()).filter(Boolean)));
  return normalized.length > 0 ? normalized.join(SUBCATEGORY_SEPARATOR) : null;
}
const fetchProductsServer = createServerFn({
  method: "POST"
}).handler(createSsrRpc("d0901fb1e807fe3a786fd91f9b82a9e1d84c9d692ba18ca9b20cb797bf6a0e9e"));
const fetchShopProductsServer = createServerFn({
  method: "POST"
}).handler(createSsrRpc("c02ea354e8ab72a90f0e6a548e94024ba9c38d4800cd63c17dcbbbc2c8e33d4c"));
const fetchHomepageDataServer = createServerFn({
  method: "GET"
}).handler(createSsrRpc("3ec8b3dc4d1ad2d84f57214aac84716e892da33aaf7f53a57353c42a4ba88cc8"));
const fetchShopPageDataServer = createServerFn({
  method: "POST"
}).handler(createSsrRpc("dbe3494fd4ce367e8e629f35dfd6892c67536da52d2644e846de224b604f8c1f"));
createServerFn({
  method: "GET"
}).handler(createSsrRpc("e5bfd208b3432ae558a6a1d60ee749644cfb1f860446aceacce44e6b6dbb1731"));
const fetchProductPageDataServer = createServerFn({
  method: "GET"
}).handler(createSsrRpc("2853c28e223598ae58e9e898f7746bd698ef845c07dae2a089c7cb6571cc60ca"));
createServerFn({
  method: "GET"
}).handler(createSsrRpc("44926c1813e5b977d9ae91b68ecf2338deec706a2a7c0ed359f75e12fe006c2e"));
const fetchWhatsAppNumberServer = createServerFn({
  method: "GET"
}).handler(createSsrRpc("910f6db21b8a74c28465c1e2166031c40b41f99904e7c549ecc9229e874ebe26"));
createServerFn({
  method: "GET"
}).handler(createSsrRpc("b06f3d0e8806cf0361d567ca3b36cd774c2872230483651989e47207e07a7dd6"));
const submitInquiryServer = createServerFn({
  method: "POST"
}).handler(createSsrRpc("e8396ba8aef3e5fbe1535673ca4939dfac06d42fa4e996758fa5b8633bc626a5"));
async function fetchProducts(opts) {
  return fetchProductsServer({
    data: opts ?? {}
  });
}
async function fetchShopProducts(opts) {
  return fetchShopProductsServer({
    data: opts ?? {}
  });
}
async function fetchProductPageData(slug) {
  return fetchProductPageDataServer({
    data: {
      slug
    }
  });
}
async function fetchWhatsAppNumber() {
  return fetchWhatsAppNumberServer();
}
async function fetchHomepageData() {
  return fetchHomepageDataServer();
}
async function fetchShopPageData(input) {
  return fetchShopPageDataServer({
    data: input
  });
}
async function submitInquiry(input) {
  return submitInquiryServer({
    data: input
  });
}
export {
  fetchHomepageData,
  fetchProductPageData,
  fetchProducts,
  fetchShopPageData,
  fetchShopProducts,
  fetchWhatsAppNumber,
  parseSubcategories,
  stringifySubcategories,
  submitInquiry
};
