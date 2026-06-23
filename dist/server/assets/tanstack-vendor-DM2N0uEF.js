import { jsx } from "react/jsx-runtime";
import { toCrossJSONStream, fromJSON, toCrossJSONAsync } from "seroval";
import { AsyncLocalStorage } from "node:async_hooks";
import { H3Event, toResponse } from "h3-v2";
import { rootRouteId, parseRedirect, isRedirect, defaultSerovalPlugins, makeSerovalPlugin, createRawStreamRPCPlugin, invariant, isNotFound, resolveManifestAssetLink, getStylesheetHref, createSerializationAdapter, isResolvedRedirect, executeRewriteInput } from "@tanstack/router-core";
import { createMemoryHistory } from "@tanstack/history";
import { mergeHeaders } from "@tanstack/router-core/ssr/client";
import { getNormalizedURL, getOrigin, attachRouterServerSsrUtils } from "@tanstack/router-core/ssr/server";
import "react";
import { RouterProvider } from "@tanstack/react-router";
import { defineHandlerCallback, renderRouterToStream } from "@tanstack/react-router/ssr/server";
function StartServer(props) {
  return /* @__PURE__ */ jsx(RouterProvider, { router: props.router });
}
var defaultStreamHandler = defineHandlerCallback(({ request, router, responseHeaders }) => renderRouterToStream({
  request,
  router,
  responseHeaders,
  children: /* @__PURE__ */ jsx(StartServer, { router })
}));
var GLOBAL_EVENT_STORAGE_KEY = /* @__PURE__ */ Symbol.for("tanstack-start:event-storage");
var globalObj$1 = globalThis;
if (!globalObj$1[GLOBAL_EVENT_STORAGE_KEY]) globalObj$1[GLOBAL_EVENT_STORAGE_KEY] = new AsyncLocalStorage();
var eventStorage = globalObj$1[GLOBAL_EVENT_STORAGE_KEY];
function isPromiseLike(value) {
  return typeof value.then === "function";
}
function getSetCookieValues(headers) {
  const headersWithSetCookie = headers;
  if (typeof headersWithSetCookie.getSetCookie === "function") return headersWithSetCookie.getSetCookie();
  const value = headers.get("set-cookie");
  return value ? [value] : [];
}
function mergeEventResponseHeaders(response, event) {
  if (response.ok) return;
  const eventSetCookies = getSetCookieValues(event.res.headers);
  if (eventSetCookies.length === 0) return;
  const responseSetCookies = getSetCookieValues(response.headers);
  response.headers.delete("set-cookie");
  for (const cookie of responseSetCookies) response.headers.append("set-cookie", cookie);
  for (const cookie of eventSetCookies) response.headers.append("set-cookie", cookie);
}
function attachResponseHeaders(value, event) {
  if (isPromiseLike(value)) return value.then((resolved) => {
    if (resolved instanceof Response) mergeEventResponseHeaders(resolved, event);
    return resolved;
  });
  if (value instanceof Response) mergeEventResponseHeaders(value, event);
  return value;
}
function requestHandler(handler) {
  return (request, requestOpts) => {
    let h3Event;
    try {
      h3Event = new H3Event(request);
    } catch (error) {
      if (error instanceof URIError) return new Response(null, {
        status: 400,
        statusText: "Bad Request"
      });
      throw error;
    }
    return toResponse(attachResponseHeaders(eventStorage.run({ h3Event }, () => handler(request, requestOpts)), h3Event), h3Event);
  };
}
function getH3Event() {
  const event = eventStorage.getStore();
  if (!event) throw new Error(`No StartEvent found in AsyncLocalStorage. Make sure you are using the function within the server runtime.`);
  return event.h3Event;
}
function getResponse() {
  return getH3Event().res;
}
var HEADERS = { TSS_SHELL: "X-TSS_SHELL" };
async function getStartManifest(matchedRoutes) {
  const { tsrStartManifest } = await import("./_tanstack-start-manifest_v-DC-ohHJP.js");
  const startManifest = tsrStartManifest();
  const rootRoute = startManifest.routes[rootRouteId] = startManifest.routes[rootRouteId] || {};
  rootRoute.assets = rootRoute.assets || [];
  let injectedHeadScripts;
  return {
    manifest: {
      inlineCss: startManifest.inlineCss,
      routes: Object.fromEntries(Object.entries(startManifest.routes).flatMap(([k, v]) => {
        const result = {};
        let hasData = false;
        if (v.preloads && v.preloads.length > 0) {
          result["preloads"] = v.preloads;
          hasData = true;
        }
        if (v.assets && v.assets.length > 0) {
          result["assets"] = v.assets;
          hasData = true;
        }
        if (!hasData) return [];
        return [[k, result]];
      }))
    },
    clientEntry: startManifest.clientEntry,
    injectedHeadScripts
  };
}
const manifest = {
  "005f6fb3ea34129e7297d1c41305ab14fa00bd4dee65915b065b13a9d4116f7f": {
    functionName: "upsertAdminProductServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "04dc553de7c9a291dce1662aed5c6d48bd66ad6f991e7b311a28679f6629e69f": {
    functionName: "createStockReturnBatchServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "06fff0253b77e893725bc29b5c03c6cb9684864bb5be9dc2b0014bd26740e8f2": {
    functionName: "fetchAdminWhatsAppSettingServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "123ed2d49f44fb5af8aded0c8bd9d2c1c321e47777cec0b0b4ae16725e9bebd2": {
    functionName: "createStockTakeoutBatchServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "13c63a631b2006afe398972d5236327969b1bd9bc2d4139098a4f13e925625fd": {
    functionName: "fetchWebPushPublicKeyServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "13ca22499e99ed6d4f220fee826d18e45d1c13375b062884fef7e6c69fe9a097": {
    functionName: "upsertStockCountServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "1b60ca7604afdcd3d0f03df2b10ebaca423e4d5caa49f81a9b802bfcb0f4c58f": {
    functionName: "deleteAdminCategoryServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "1cbfcd8b593dcbe072fe46cbb3a2d34050caf7ffefc6ec0329e24759ba469fd5": {
    functionName: "getAdminAccessConfigServer_createServerFn_handler",
    importer: () => import("./admin-auth-CPkjyok9.js")
  },
  "1d41e017c96da896a9676473069a560785ccb808d8b57bad761ba024d119000b": {
    functionName: "deleteAdminOrderServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "1da38ae56f491bdc5a5b0fe59b286182b0bd4e8ee5616bd97f25387c2de337f1": {
    functionName: "deleteAdminUserServer_createServerFn_handler",
    importer: () => import("./admin-auth-CPkjyok9.js")
  },
  "246f149975ba7649055bed37d4935c42d035566fdd7cabe2b81dd8e929c30d05": {
    functionName: "listAdminUsersServer_createServerFn_handler",
    importer: () => import("./admin-auth-CPkjyok9.js")
  },
  "28220fa7396bfcef9cd3e07df2c76cf0a71883526f3cb8388ca04350c35eb740": {
    functionName: "markSuperAdminNotificationReadServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "2853c28e223598ae58e9e898f7746bd698ef845c07dae2a089c7cb6571cc60ca": {
    functionName: "fetchProductPageDataServer_createServerFn_handler",
    importer: () => import("./products-D3x2rE3T.js")
  },
  "381f2b8a981bad7d369275e826ec075b46bd805d231d9bb62372b4a05241bf1d": {
    functionName: "listAdminProductsServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "39f33562f1653f20d5626a1bbf669a31084bf0b73ac8668aef0266761f426768": {
    functionName: "fetchAdminDashboardServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "3d07a6c2d92cada322e7e4735125878f4073555f1a5df726e4b3db645f0da4b5": {
    functionName: "listAdminCategoriesServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "3ec8b3dc4d1ad2d84f57214aac84716e892da33aaf7f53a57353c42a4ba88cc8": {
    functionName: "fetchHomepageDataServer_createServerFn_handler",
    importer: () => import("./products-D3x2rE3T.js")
  },
  "41631b48ff1aa46466dbc64ac962de62cd77528843ffc7acf2d58c31a7b99e7a": {
    functionName: "deleteStockIntakeServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "41fee207645975e817f77250d12bf848ae694b5d97c870d3429bb85a7609680e": {
    functionName: "verifyAdminLoginServer_createServerFn_handler",
    importer: () => import("./admin-auth-CPkjyok9.js")
  },
  "44926c1813e5b977d9ae91b68ecf2338deec706a2a7c0ed359f75e12fe006c2e": {
    functionName: "fetchCategoriesServer_createServerFn_handler",
    importer: () => import("./products-D3x2rE3T.js")
  },
  "46e0a2f4be3b2f7d345cccb9c0110d14059e3b0e14dc708e3f52660d3c3496bd": {
    functionName: "createAdminOrderServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "4808e1fff4e219310584aae57903bf1418330c51898bbc00abd2e486129c2523": {
    functionName: "listSupplierBillStockOptionsServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "495091737ff47754458269b2e45f4384529da7319a817dede8e07e66c07b99e7": {
    functionName: "upsertAdminCategoryServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "4ae54b3340f5ba37dc8ddab31e0d6551030d942800c1a78bf74823ca9d93e32f": {
    functionName: "exportAdminOrdersServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "4d917f6a3399b603b0b37cb3666bdfcbff1d112da697381bf5716320b3640ce2": {
    functionName: "upsertExpenseServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "51d5029ca1538f24cd107114d4c2805e9bb4ff8de337dc6a228e7b1ecaf16616": {
    functionName: "upsertResellerServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "57a73a0169c72143daf3c05a57bfaeac45c4f33b9ad116310b045bc408320a9f": {
    functionName: "listSupplierBillsServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "5930ecacf08b66fc5b123ed5e63cc7176ee93d74dc5e1c15cb535607b8620b6f": {
    functionName: "upsertAdminUserServer_createServerFn_handler",
    importer: () => import("./admin-auth-CPkjyok9.js")
  },
  "5c3987d8e7901633584fb96d130b1a643777d1d286cb5a44cb8723c2101d7cc5": {
    functionName: "updateAdminInquiryStatusServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "5fff447da62f1c30a9d4795a770d66220de9295bbccc24148e4b0b10372fb839": {
    functionName: "listAdminOrdersServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "609bcbee46fb6275a2e90408476d70fe94f78b2f345414a077dcd211c16f05a0": {
    functionName: "listInventoryRecordsServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "6507614eda51dae4f7340b140351a2230d39b62ee5dfcbac910d98ab5084905e": {
    functionName: "listProductSerialOptionsServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "663132f5d1169f71d457139a82fd9abf35dcffa44d73bc77ad1b645b5932a5bf": {
    functionName: "deleteResellerServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "68afc5cfdac8ff673aa9758b06215c5f0c3823fab63a6f1af433d5275d1d3fe7": {
    functionName: "updateProductCatalogueItemServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "6f28a91d1019b2dc159d1b1b58090c10c4aac43b6c6b228a87bccd0ab2a18438": {
    functionName: "createProductCatalogueBatchServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "72410f6112840824c39f6bc513b6d31314c6c2b3e865c12b5310474486aa9667": {
    functionName: "verifyAdminAccessCodeServer_createServerFn_handler",
    importer: () => import("./admin-auth-CPkjyok9.js")
  },
  "752df7f0ea50413528d2a1fba195a11c948b58d326b1f67129d9594323913321": {
    functionName: "listInventoryProductsServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "779eb388b4c399f9742cfb55b5f22783852cf9be32cc0b87cdb35e5552b0af21": {
    functionName: "saveAdminWhatsAppSettingServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "7dd5dc24d45ce12286adf49d16356af52c34c26c1e5c709f02a4c9cf66de16f9": {
    functionName: "listExpensesServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "7f891dd29f543427073502d9d39dd2fa75b3561e1475f1a37d526c66d53f7421": {
    functionName: "listProductCatalogueServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "87473ab7b0417a82621c25b8671b9ef3b1c803f9f64fdd3330499839907bf641": {
    functionName: "updateAdminProductFeaturedServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "8e08f7efdeea017fa2ad0cb6afe730106dde3162172a2e614d2d56bb1bf3fc63": {
    functionName: "deleteProductCatalogueItemServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "8ec3286791a97abc95abfe9780ab80279e0b861ddea4c9eea9d9e762456b3620": {
    functionName: "deleteInventoryProductServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "910f6db21b8a74c28465c1e2166031c40b41f99904e7c549ecc9229e874ebe26": {
    functionName: "fetchWhatsAppNumberServer_createServerFn_handler",
    importer: () => import("./products-D3x2rE3T.js")
  },
  "95b929ade8e0597ee79a8894b0a689af5f98e998085e14d8377cbfe436664588": {
    functionName: "saveAdminHomepageBannersServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "98e8b9625e40ae7505b7eef6f02f4fa174b21b7ae0eff4bd8b88a9e5d82306b1": {
    functionName: "deleteAdminProductServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "99f2b5e8fbfddf4e33a241d82216df21c81db4ca925a8f04cba6ccdcd429bea0": {
    functionName: "updateAdminOrderStatusServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "9c8df41c5ba113082c1b26b8edb5b4d2ebf445d7411f13535dbea23fee78197a": {
    functionName: "upsertSupplierBillServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "9d03eb21d0cc975d7cc9dd523242c3543e543f40b44ebd5efd516340392ce19d": {
    functionName: "storeAdminProductImagesServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "a02170316cb5ace4a2d07cd42c534d7af2968a42a53340046a6decff7c270d08": {
    functionName: "listAdminInquiriesServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "a775a32ed79ca9f9cc55efc650fda8d6d39f1763cc216578cb3f8fbcf3a75ae6": {
    functionName: "saveSuperAdminPushSubscriptionServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "a84786533017f079a09bd65590bcc4fe1dfd6338dab767541759749030e094cb": {
    functionName: "fetchAdminHomepageBannersServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "a9a30835048636d3635808fa17edc8a3c5b7d2ba7f19d42b8ca3858fc30554dd": {
    functionName: "deleteSupplierServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "a9a51b39555f7a9d26e4d7a5481a713a6a8a54cce10c0699136cf82e68bd88fb": {
    functionName: "listActivityLogsServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "ac1d73e36988d23adbad1aa4d05a092cd4f8faec7e750a3602125734cb8b1e2c": {
    functionName: "updateAdminProductCategoryPriorityServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "af539b64737c1a34034ce05b978a1d73754d4d0c38788f3faa046b706416cb55": {
    functionName: "upsertInventoryProductServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "aff9461e65d90734eeb8667f27b59dacabaf71860f9ee4cded97dde1e77d2a8f": {
    functionName: "listSupplierFinanceRecordsServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "b06f3d0e8806cf0361d567ca3b36cd774c2872230483651989e47207e07a7dd6": {
    functionName: "fetchHomepageBannersServer_createServerFn_handler",
    importer: () => import("./products-D3x2rE3T.js")
  },
  "b0b2efd8a2b645b9d7af0e8769ae7824cdff974d4c2935e1865dea6bf755d02e": {
    functionName: "fetchAdminAnalyticsServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "b949d6ba5e0d649ce677817888c4a813bdb503c6d11dfa13d59fc095741535cd": {
    functionName: "createStockIntakeBatchServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "b9757ac35b1e515ca7adb225af2c17006388439aa3b5c206f98459c40f1740f8": {
    functionName: "saveAdminBestDealProductSlugsServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "c02ea354e8ab72a90f0e6a548e94024ba9c38d4800cd63c17dcbbbc2c8e33d4c": {
    functionName: "fetchShopProductsServer_createServerFn_handler",
    importer: () => import("./products-D3x2rE3T.js")
  },
  "c1c1eb6ffecf9d3b97775164cde2438fd4c7f0bcdbc289c6be1eef5931f2e954": {
    functionName: "upsertStockIntakeServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "c5fc592b6d2082c6999be4952dc58f54c27c69fa201827458f7bb4b27850935e": {
    functionName: "fetchAdminCatalogMetaServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "c95ed22a0d63222711af281a51b3f1ca4bb2a98c374f9abecbb53a88158b998f": {
    functionName: "listResellersServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "ca7e35aef4695f41c198c410305f7899dd24fdf7c3114de3d27179e6feb5cbcf": {
    functionName: "fetchAdminBestDealProductSlugsServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "d0901fb1e807fe3a786fd91f9b82a9e1d84c9d692ba18ca9b20cb797bf6a0e9e": {
    functionName: "fetchProductsServer_createServerFn_handler",
    importer: () => import("./products-D3x2rE3T.js")
  },
  "d38f058322f691b5ad61a7db1020e107d30c25484a24216c48f7983e19c26c22": {
    functionName: "listSuppliersServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "d666562cb9a5731f16e9873418281fff6eafafe310d86fa753c1b75cedd56581": {
    functionName: "listAdminCustomersServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "d6e0c2f49f127a01cbee1133a1f0098fc84c89322ef8e6d8f47a9c64cbf34af0": {
    functionName: "setAdminUserActiveServer_createServerFn_handler",
    importer: () => import("./admin-auth-CPkjyok9.js")
  },
  "da0eb663a1343a0abe68a72607fcfc9dcf89983239ffd87c3e95042395595d48": {
    functionName: "exportInventoryRecordsServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "dbcf1fe52e309bac299a49c1e6c6ad5c276ade75f8f23d2ea5b077aafd3e6e73": {
    functionName: "upsertSupplierServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "dbe3494fd4ce367e8e629f35dfd6892c67536da52d2644e846de224b604f8c1f": {
    functionName: "fetchShopPageDataServer_createServerFn_handler",
    importer: () => import("./products-D3x2rE3T.js")
  },
  "dccc22e809a9866ef021d443acd0a6eba36d772f44c9674b206b7fd5a37b7ac6": {
    functionName: "removeSuperAdminPushSubscriptionServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "ddbe094c6fc761c99d716bbd1fe9bf631df2403231dddc7f9cac721574decb0b": {
    functionName: "storeAdminBannerImagesServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "e5bfd208b3432ae558a6a1d60ee749644cfb1f860446aceacce44e6b6dbb1731": {
    functionName: "fetchProductBySlugServer_createServerFn_handler",
    importer: () => import("./products-D3x2rE3T.js")
  },
  "e8396ba8aef3e5fbe1535673ca4939dfac06d42fa4e996758fa5b8633bc626a5": {
    functionName: "submitInquiryServer_createServerFn_handler",
    importer: () => import("./products-D3x2rE3T.js")
  },
  "e94b50899b02899e55e5708d7ab6faa6ccd67680bfdb3cab3a5199a5bdae495d": {
    functionName: "saveAdminCatalogMetaServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "ee3d9752ca2edfe7acdf7c010f31afe5f3f4f1afb229831dd7003240c65c9621": {
    functionName: "upsertStockReturnServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "eff4b7a54d83c3e7c1934fe1f53231a44f28f8646eb2ffcf745cf9b7d8b63607": {
    functionName: "fetchFinanceReportServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "f8217170279a10b3b70f339f76f0c0f9a284366e1dbbeaaf3cf771e81624a378": {
    functionName: "markStockTakeoutReturnedServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "fcf4e61979b0d5b2b679e56429a1b368250dfa9be12e246a741e29c0f4070529": {
    functionName: "listSuperAdminNotificationsServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  },
  "ffc34b9508ad6ceae46127cacf4eefa09e162dabcc0268561855932d6e58c954": {
    functionName: "updateStockIntakeMetaServer_createServerFn_handler",
    importer: () => import("./admin-data-CRPIPnkh.js")
  }
};
async function getServerFnById(id, access) {
  const serverFnInfo = manifest[id];
  if (!serverFnInfo) {
    throw new Error("Server function info not found for " + id);
  }
  const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
  if (!fnModule) {
    throw new Error("Server function module not resolved for " + id);
  }
  const action = fnModule[serverFnInfo.functionName];
  if (!action) {
    throw new Error("Server function module export not resolved for serverFn ID: " + id);
  }
  return action;
}
var TSS_FORMDATA_CONTEXT = "__TSS_CONTEXT";
var TSS_SERVER_FUNCTION = /* @__PURE__ */ Symbol.for("TSS_SERVER_FUNCTION");
var TSS_SERVER_FUNCTION_FACTORY = /* @__PURE__ */ Symbol.for("TSS_SERVER_FUNCTION_FACTORY");
var X_TSS_SERIALIZED = "x-tss-serialized";
var X_TSS_RAW_RESPONSE = "x-tss-raw";
var TSS_CONTENT_TYPE_FRAMED = "application/x-tss-framed";
var FrameType = {
  JSON: 0,
  CHUNK: 1,
  END: 2,
  ERROR: 3
};
var FRAME_HEADER_SIZE = 9;
var TSS_CONTENT_TYPE_FRAMED_VERSIONED = `${TSS_CONTENT_TYPE_FRAMED}; v=1`;
function isSafeKey(key) {
  return key !== "__proto__" && key !== "constructor" && key !== "prototype";
}
function safeObjectMerge(target, source) {
  const result = /* @__PURE__ */ Object.create(null);
  if (target) {
    for (const key of Object.keys(target)) if (isSafeKey(key)) result[key] = target[key];
  }
  if (source && typeof source === "object") {
    for (const key of Object.keys(source)) if (isSafeKey(key)) result[key] = source[key];
  }
  return result;
}
function createNullProtoObject(source) {
  if (!source) return /* @__PURE__ */ Object.create(null);
  const obj = /* @__PURE__ */ Object.create(null);
  for (const key of Object.keys(source)) if (isSafeKey(key)) obj[key] = source[key];
  return obj;
}
var GLOBAL_STORAGE_KEY = /* @__PURE__ */ Symbol.for("tanstack-start:start-storage-context");
var globalObj = globalThis;
if (!globalObj[GLOBAL_STORAGE_KEY]) globalObj[GLOBAL_STORAGE_KEY] = new AsyncLocalStorage();
var startStorage = globalObj[GLOBAL_STORAGE_KEY];
async function runWithStartContext(context, fn) {
  return startStorage.run(context, fn);
}
function getStartContext(opts) {
  const context = startStorage.getStore();
  if (!context && opts?.throwIfNotFound !== false) throw new Error(`No Start context found in AsyncLocalStorage. Make sure you are using the function within the server runtime.`);
  return context;
}
var getStartOptions = () => getStartContext().startOptions;
var getStartContextServerOnly = getStartContext;
var createServerFn = (options, __opts) => {
  const resolvedOptions = __opts || options || {};
  if (typeof resolvedOptions.method === "undefined") resolvedOptions.method = "GET";
  const res = {
    options: resolvedOptions,
    middleware: (middleware) => {
      const newMiddleware = [...resolvedOptions.middleware || []];
      middleware.map((m) => {
        if (TSS_SERVER_FUNCTION_FACTORY in m) {
          if (m.options.middleware) newMiddleware.push(...m.options.middleware);
        } else newMiddleware.push(m);
      });
      const res2 = createServerFn(void 0, {
        ...resolvedOptions,
        middleware: newMiddleware
      });
      res2[TSS_SERVER_FUNCTION_FACTORY] = true;
      return res2;
    },
    inputValidator: (inputValidator) => {
      return createServerFn(void 0, {
        ...resolvedOptions,
        inputValidator
      });
    },
    handler: (...args) => {
      const [extractedFn, serverFn] = args;
      const newOptions = {
        ...resolvedOptions,
        extractedFn,
        serverFn
      };
      const resolvedMiddleware = [...newOptions.middleware || [], serverFnBaseToMiddleware(newOptions)];
      extractedFn.method = resolvedOptions.method;
      return Object.assign(async (opts) => {
        const result = await executeMiddleware$1(resolvedMiddleware, "client", {
          ...extractedFn,
          ...newOptions,
          data: opts?.data,
          headers: opts?.headers,
          signal: opts?.signal,
          fetch: opts?.fetch,
          context: createNullProtoObject()
        });
        const redirect = parseRedirect(result.error);
        if (redirect) throw redirect;
        if (result.error) throw result.error;
        return result.result;
      }, {
        ...extractedFn,
        method: resolvedOptions.method,
        __executeServer: async (opts) => {
          const startContext = getStartContextServerOnly();
          const serverContextAfterGlobalMiddlewares = startContext.contextAfterGlobalMiddlewares;
          return await executeMiddleware$1(resolvedMiddleware, "server", {
            ...extractedFn,
            ...opts,
            serverFnMeta: extractedFn.serverFnMeta,
            context: safeObjectMerge(opts.context, serverContextAfterGlobalMiddlewares),
            request: startContext.request
          }).then((d) => ({
            result: d.result,
            error: d.error,
            context: d.sendContext
          }));
        }
      });
    }
  };
  const fun = (options2) => {
    return createServerFn(void 0, {
      ...resolvedOptions,
      ...options2
    });
  };
  return Object.assign(fun, res);
};
async function executeMiddleware$1(middlewares, env, opts) {
  let flattenedMiddlewares = flattenMiddlewares([...getStartOptions()?.functionMiddleware || [], ...middlewares]);
  if (env === "server") {
    const startContext = getStartContextServerOnly({ throwIfNotFound: false });
    if (startContext?.executedRequestMiddlewares) flattenedMiddlewares = flattenedMiddlewares.filter((m) => !startContext.executedRequestMiddlewares.has(m));
  }
  const callNextMiddleware = async (ctx) => {
    const nextMiddleware = flattenedMiddlewares.shift();
    if (!nextMiddleware) return ctx;
    try {
      if ("inputValidator" in nextMiddleware.options && nextMiddleware.options.inputValidator && env === "server") ctx.data = await execValidator(nextMiddleware.options.inputValidator, ctx.data);
      let middlewareFn = void 0;
      if (env === "client") {
        if ("client" in nextMiddleware.options) middlewareFn = nextMiddleware.options.client;
      } else if ("server" in nextMiddleware.options) middlewareFn = nextMiddleware.options.server;
      if (middlewareFn) {
        const userNext = async (userCtx = {}) => {
          const result2 = await callNextMiddleware({
            ...ctx,
            ...userCtx,
            context: safeObjectMerge(ctx.context, userCtx.context),
            sendContext: safeObjectMerge(ctx.sendContext, userCtx.sendContext),
            headers: mergeHeaders(ctx.headers, userCtx.headers),
            _callSiteFetch: ctx._callSiteFetch,
            fetch: ctx._callSiteFetch ?? userCtx.fetch ?? ctx.fetch,
            result: userCtx.result !== void 0 ? userCtx.result : userCtx instanceof Response ? userCtx : ctx.result,
            error: userCtx.error ?? ctx.error
          });
          if (result2.error) throw result2.error;
          return result2;
        };
        const result = await middlewareFn({
          ...ctx,
          next: userNext
        });
        if (isRedirect(result)) return {
          ...ctx,
          error: result
        };
        if (result instanceof Response) return {
          ...ctx,
          result
        };
        if (!result) throw new Error("User middleware returned undefined. You must call next() or return a result in your middlewares.");
        return result;
      }
      return callNextMiddleware(ctx);
    } catch (error) {
      return {
        ...ctx,
        error
      };
    }
  };
  return callNextMiddleware({
    ...opts,
    headers: opts.headers || {},
    sendContext: opts.sendContext || {},
    context: opts.context || createNullProtoObject(),
    _callSiteFetch: opts.fetch
  });
}
function flattenMiddlewares(middlewares, maxDepth = 100) {
  const seen = /* @__PURE__ */ new Set();
  const flattened = [];
  const recurse = (middleware, depth) => {
    if (depth > maxDepth) throw new Error(`Middleware nesting depth exceeded maximum of ${maxDepth}. Check for circular references.`);
    middleware.forEach((m) => {
      if (m.options.middleware) recurse(m.options.middleware, depth + 1);
      if (!seen.has(m)) {
        seen.add(m);
        flattened.push(m);
      }
    });
  };
  recurse(middlewares, 0);
  return flattened;
}
async function execValidator(validator, input) {
  if (validator == null) return {};
  if ("~standard" in validator) {
    const result = await validator["~standard"].validate(input);
    if (result.issues) throw new Error(JSON.stringify(result.issues, void 0, 2));
    return result.value;
  }
  if ("parse" in validator) return validator.parse(input);
  if (typeof validator === "function") return validator(input);
  throw new Error("Invalid validator type!");
}
function serverFnBaseToMiddleware(options) {
  return {
    "~types": void 0,
    options: {
      inputValidator: options.inputValidator,
      client: async ({ next, sendContext, fetch: fetch2, ...ctx }) => {
        const payload = {
          ...ctx,
          context: sendContext,
          fetch: fetch2
        };
        return next(await options.extractedFn?.(payload));
      },
      server: async ({ next, ...ctx }) => {
        const result = await options.serverFn?.(ctx);
        return next({
          ...ctx,
          result
        });
      }
    }
  };
}
var createMiddleware = (options, __opts) => {
  const resolvedOptions = {
    type: "request",
    ...__opts || options
  };
  return {
    options: resolvedOptions,
    middleware: (middleware) => {
      return createMiddleware({}, Object.assign(resolvedOptions, { middleware }));
    },
    inputValidator: (inputValidator) => {
      return createMiddleware({}, Object.assign(resolvedOptions, { inputValidator }));
    },
    client: (client) => {
      return createMiddleware({}, Object.assign(resolvedOptions, { client }));
    },
    server: (server2) => {
      return createMiddleware({}, Object.assign(resolvedOptions, { server: server2 }));
    }
  };
};
function dedupeSerializationAdapters(deduped, serializationAdapters) {
  for (let i = 0, len = serializationAdapters.length; i < len; i++) {
    const current = serializationAdapters[i];
    if (!deduped.has(current)) {
      deduped.add(current);
      if (current.extends) dedupeSerializationAdapters(deduped, current.extends);
    }
  }
}
var createStart = (getOptions) => {
  return {
    getOptions: async () => {
      const options = await getOptions();
      if (options.serializationAdapters) {
        const deduped = /* @__PURE__ */ new Set();
        dedupeSerializationAdapters(deduped, options.serializationAdapters);
        options.serializationAdapters = Array.from(deduped);
      }
      return options;
    },
    createMiddleware
  };
};
function getDefaultSerovalPlugins() {
  return [...getStartOptions()?.serializationAdapters?.map(makeSerovalPlugin) ?? [], ...defaultSerovalPlugins];
}
var textEncoder = new TextEncoder();
var EMPTY_PAYLOAD = new Uint8Array(0);
function encodeFrame(type, streamId, payload) {
  const frame = new Uint8Array(FRAME_HEADER_SIZE + payload.length);
  frame[0] = type;
  frame[1] = streamId >>> 24 & 255;
  frame[2] = streamId >>> 16 & 255;
  frame[3] = streamId >>> 8 & 255;
  frame[4] = streamId & 255;
  frame[5] = payload.length >>> 24 & 255;
  frame[6] = payload.length >>> 16 & 255;
  frame[7] = payload.length >>> 8 & 255;
  frame[8] = payload.length & 255;
  frame.set(payload, FRAME_HEADER_SIZE);
  return frame;
}
function encodeJSONFrame(json) {
  return encodeFrame(FrameType.JSON, 0, textEncoder.encode(json));
}
function encodeChunkFrame(streamId, chunk) {
  return encodeFrame(FrameType.CHUNK, streamId, chunk);
}
function encodeEndFrame(streamId) {
  return encodeFrame(FrameType.END, streamId, EMPTY_PAYLOAD);
}
function encodeErrorFrame(streamId, error) {
  const message = error instanceof Error ? error.message : String(error ?? "Unknown error");
  return encodeFrame(FrameType.ERROR, streamId, textEncoder.encode(message));
}
function createMultiplexedStream(jsonStream, rawStreams, lateStreamSource) {
  let controller;
  let cancelled = false;
  const readers = [];
  const enqueue = (frame) => {
    if (cancelled) return false;
    try {
      controller.enqueue(frame);
      return true;
    } catch {
      return false;
    }
  };
  const errorOutput = (error) => {
    if (cancelled) return;
    cancelled = true;
    try {
      controller.error(error);
    } catch {
    }
    for (const reader of readers) reader.cancel().catch(() => {
    });
  };
  async function pumpRawStream(streamId, stream) {
    const reader = stream.getReader();
    readers.push(reader);
    try {
      while (!cancelled) {
        const { done, value } = await reader.read();
        if (done) {
          enqueue(encodeEndFrame(streamId));
          return;
        }
        if (!enqueue(encodeChunkFrame(streamId, value))) return;
      }
    } catch (error) {
      enqueue(encodeErrorFrame(streamId, error));
    } finally {
      reader.releaseLock();
    }
  }
  async function pumpJSON() {
    const reader = jsonStream.getReader();
    readers.push(reader);
    try {
      while (!cancelled) {
        const { done, value } = await reader.read();
        if (done) return;
        if (!enqueue(encodeJSONFrame(value))) return;
      }
    } catch (error) {
      errorOutput(error);
      throw error;
    } finally {
      reader.releaseLock();
    }
  }
  async function pumpLateStreams() {
    if (!lateStreamSource) return [];
    const lateStreamPumps = [];
    const reader = lateStreamSource.getReader();
    readers.push(reader);
    try {
      while (!cancelled) {
        const { done, value } = await reader.read();
        if (done) break;
        lateStreamPumps.push(pumpRawStream(value.id, value.stream));
      }
    } finally {
      reader.releaseLock();
    }
    return lateStreamPumps;
  }
  return new ReadableStream({
    async start(ctrl) {
      controller = ctrl;
      const pumps = [pumpJSON()];
      for (const [streamId, stream] of rawStreams) pumps.push(pumpRawStream(streamId, stream));
      if (lateStreamSource) pumps.push(pumpLateStreams());
      try {
        const latePumps = (await Promise.all(pumps)).find(Array.isArray);
        if (latePumps && latePumps.length > 0) await Promise.all(latePumps);
        if (!cancelled) try {
          controller.close();
        } catch {
        }
      } catch {
      }
    },
    cancel() {
      cancelled = true;
      for (const reader of readers) reader.cancel().catch(() => {
      });
      readers.length = 0;
    }
  });
}
var serovalPlugins = void 0;
var FORM_DATA_CONTENT_TYPES = ["multipart/form-data", "application/x-www-form-urlencoded"];
var MAX_PAYLOAD_SIZE = 1e6;
var handleServerAction = async ({ request, context, serverFnId }) => {
  const methodUpper = request.method.toUpperCase();
  const url = new URL(request.url);
  const action = await getServerFnById(serverFnId);
  if (action.method && methodUpper !== action.method) return new Response(`expected ${action.method} method. Got ${methodUpper}`, {
    status: 405,
    headers: { Allow: action.method }
  });
  const isServerFn = request.headers.get("x-tsr-serverFn") === "true";
  if (!serovalPlugins) serovalPlugins = getDefaultSerovalPlugins();
  const contentType = request.headers.get("Content-Type");
  function parsePayload(payload) {
    return fromJSON(payload, { plugins: serovalPlugins });
  }
  return await (async () => {
    try {
      let serializeResult = function(res2) {
        let nonStreamingBody = void 0;
        const alsResponse = getResponse();
        if (res2 !== void 0) {
          const rawStreams = /* @__PURE__ */ new Map();
          let initialPhase = true;
          let lateStreamWriter;
          let lateStreamReadable = void 0;
          const pendingLateStreams = [];
          const plugins = [createRawStreamRPCPlugin((id, stream) => {
            if (initialPhase) {
              rawStreams.set(id, stream);
              return;
            }
            if (lateStreamWriter) {
              lateStreamWriter.write({
                id,
                stream
              }).catch(() => {
              });
              return;
            }
            pendingLateStreams.push({
              id,
              stream
            });
          }), ...serovalPlugins || []];
          let done = false;
          const callbacks = {
            onParse: (value) => {
              nonStreamingBody = value;
            },
            onDone: () => {
              done = true;
            },
            onError: (error) => {
              throw error;
            }
          };
          toCrossJSONStream(res2, {
            refs: /* @__PURE__ */ new Map(),
            plugins,
            onParse(value) {
              callbacks.onParse(value);
            },
            onDone() {
              callbacks.onDone();
            },
            onError: (error) => {
              callbacks.onError(error);
            }
          });
          initialPhase = false;
          if (done && rawStreams.size === 0) return new Response(nonStreamingBody ? JSON.stringify(nonStreamingBody) : void 0, {
            status: alsResponse.status,
            statusText: alsResponse.statusText,
            headers: {
              "Content-Type": "application/json",
              [X_TSS_SERIALIZED]: "true"
            }
          });
          const { readable, writable } = new TransformStream();
          lateStreamReadable = readable;
          lateStreamWriter = writable.getWriter();
          for (const registration of pendingLateStreams) lateStreamWriter.write(registration).catch(() => {
          });
          pendingLateStreams.length = 0;
          const multiplexedStream = createMultiplexedStream(new ReadableStream({
            start(controller) {
              callbacks.onParse = (value) => {
                controller.enqueue(JSON.stringify(value) + "\n");
              };
              callbacks.onDone = () => {
                try {
                  controller.close();
                } catch {
                }
                lateStreamWriter?.close().catch(() => {
                }).finally(() => {
                  lateStreamWriter = void 0;
                });
              };
              callbacks.onError = (error) => {
                controller.error(error);
                lateStreamWriter?.abort(error).catch(() => {
                }).finally(() => {
                  lateStreamWriter = void 0;
                });
              };
              if (nonStreamingBody !== void 0) callbacks.onParse(nonStreamingBody);
              if (done) callbacks.onDone();
            },
            cancel() {
              lateStreamWriter?.abort().catch(() => {
              });
              lateStreamWriter = void 0;
            }
          }), rawStreams, lateStreamReadable);
          return new Response(multiplexedStream, {
            status: alsResponse.status,
            statusText: alsResponse.statusText,
            headers: {
              "Content-Type": TSS_CONTENT_TYPE_FRAMED_VERSIONED,
              [X_TSS_SERIALIZED]: "true"
            }
          });
        }
        return new Response(void 0, {
          status: alsResponse.status,
          statusText: alsResponse.statusText
        });
      };
      let res = await (async () => {
        if (FORM_DATA_CONTENT_TYPES.some((type) => contentType && contentType.includes(type))) {
          if (methodUpper === "GET") {
            if (false) ;
            invariant();
          }
          const formData = await request.formData();
          const serializedContext = formData.get(TSS_FORMDATA_CONTEXT);
          formData.delete(TSS_FORMDATA_CONTEXT);
          const params = {
            context,
            data: formData,
            method: methodUpper
          };
          if (typeof serializedContext === "string") try {
            const deserializedContext = fromJSON(JSON.parse(serializedContext), { plugins: serovalPlugins });
            if (typeof deserializedContext === "object" && deserializedContext) params.context = safeObjectMerge(deserializedContext, context);
          } catch (e) {
            if (false) ;
          }
          return await action(params);
        }
        if (methodUpper === "GET") {
          const payloadParam = url.searchParams.get("payload");
          if (payloadParam && payloadParam.length > MAX_PAYLOAD_SIZE) throw new Error("Payload too large");
          const payload2 = payloadParam ? parsePayload(JSON.parse(payloadParam)) : {};
          payload2.context = safeObjectMerge(payload2.context, context);
          payload2.method = methodUpper;
          return await action(payload2);
        }
        let jsonPayload;
        if (contentType?.includes("application/json")) jsonPayload = await request.json();
        const payload = jsonPayload ? parsePayload(jsonPayload) : {};
        payload.context = safeObjectMerge(payload.context, context);
        payload.method = methodUpper;
        return await action(payload);
      })();
      const unwrapped = res.result || res.error;
      if (isNotFound(res)) res = isNotFoundResponse(res);
      if (!isServerFn) return unwrapped;
      if (unwrapped instanceof Response) {
        if (isRedirect(unwrapped)) return unwrapped;
        unwrapped.headers.set(X_TSS_RAW_RESPONSE, "true");
        return unwrapped;
      }
      return serializeResult(res);
    } catch (error) {
      if (error instanceof Response) return error;
      if (isNotFound(error)) return isNotFoundResponse(error);
      console.info();
      console.info("Server Fn Error!");
      console.info();
      console.error(error);
      console.info();
      const serializedError = JSON.stringify(await Promise.resolve(toCrossJSONAsync(error, {
        refs: /* @__PURE__ */ new Map(),
        plugins: serovalPlugins
      })));
      const response = getResponse();
      return new Response(serializedError, {
        status: response.status ?? 500,
        statusText: response.statusText,
        headers: {
          "Content-Type": "application/json",
          [X_TSS_SERIALIZED]: "true"
        }
      });
    }
  })();
};
function isNotFoundResponse(error) {
  const { headers, ...rest } = error;
  return new Response(JSON.stringify(rest), {
    status: 404,
    headers: {
      "Content-Type": "application/json",
      ...headers || {}
    }
  });
}
function normalizeTransformAssetResult(result) {
  if (typeof result === "string") return { href: result };
  return result;
}
function resolveTransformAssetsCrossOrigin(config, kind) {
  if (!config) return void 0;
  if (typeof config === "string") return config;
  return config[kind];
}
function isObjectShorthand(transform) {
  return "prefix" in transform;
}
function resolveTransformAssetsConfig(transform) {
  if (typeof transform === "string") {
    const prefix = transform;
    return {
      type: "transform",
      transformFn: ({ url }) => ({ href: `${prefix}${url}` }),
      cache: true
    };
  }
  if (typeof transform === "function") return {
    type: "transform",
    transformFn: transform,
    cache: true
  };
  if (isObjectShorthand(transform)) {
    const { prefix, crossOrigin } = transform;
    return {
      type: "transform",
      transformFn: ({ url, kind }) => {
        const href = `${prefix}${url}`;
        if (kind === "clientEntry") return { href };
        const co = resolveTransformAssetsCrossOrigin(crossOrigin, kind);
        return co ? {
          href,
          crossOrigin: co
        } : { href };
      },
      cache: true
    };
  }
  if ("createTransform" in transform && transform.createTransform) return {
    type: "createTransform",
    createTransform: transform.createTransform,
    cache: transform.cache !== false
  };
  return {
    type: "transform",
    transformFn: typeof transform.transform === "string" ? (({ url }) => ({ href: `${transform.transform}${url}` })) : transform.transform,
    cache: transform.cache !== false
  };
}
function adaptTransformAssetUrlsToTransformAssets(transformFn) {
  return async ({ url, kind }) => ({ href: await transformFn({
    url,
    type: kind
  }) });
}
function adaptTransformAssetUrlsConfigToTransformAssets(transform) {
  if (typeof transform === "string") return transform;
  if (typeof transform === "function") return adaptTransformAssetUrlsToTransformAssets(transform);
  if ("createTransform" in transform && transform.createTransform) return {
    createTransform: async (ctx) => adaptTransformAssetUrlsToTransformAssets(await transform.createTransform(ctx)),
    cache: transform.cache,
    warmup: transform.warmup
  };
  return {
    transform: typeof transform.transform === "string" ? transform.transform : adaptTransformAssetUrlsToTransformAssets(transform.transform),
    cache: transform.cache,
    warmup: transform.warmup
  };
}
function buildClientEntryScriptTag(clientEntry, injectedHeadScripts) {
  let script = `import(${JSON.stringify(clientEntry)})`;
  if (injectedHeadScripts) script = `${injectedHeadScripts};${script}`;
  return {
    tag: "script",
    attrs: {
      type: "module",
      async: true
    },
    children: script
  };
}
function assignManifestAssetLink(link, next) {
  if (typeof link === "string") return next.crossOrigin ? next : next.href;
  return next.crossOrigin ? next : { href: next.href };
}
async function transformManifestAssets(source, transformFn, _opts) {
  const manifest2 = structuredClone(source.manifest);
  for (const route of Object.values(manifest2.routes)) {
    if (route.preloads) route.preloads = await Promise.all(route.preloads.map(async (link) => {
      const result = normalizeTransformAssetResult(await transformFn({
        url: resolveManifestAssetLink(link).href,
        kind: "modulepreload"
      }));
      return assignManifestAssetLink(link, {
        href: result.href,
        crossOrigin: result.crossOrigin
      });
    }));
    if (route.assets && !source.manifest.inlineCss) {
      for (const asset of route.assets) if (asset.tag === "link" && asset.attrs?.href) {
        const rel = asset.attrs.rel;
        if (!(typeof rel === "string" ? rel.split(/\s+/) : []).includes("stylesheet")) continue;
        const result = normalizeTransformAssetResult(await transformFn({
          url: asset.attrs.href,
          kind: "stylesheet"
        }));
        asset.attrs.href = result.href;
        if (result.crossOrigin) asset.attrs.crossOrigin = result.crossOrigin;
        else delete asset.attrs.crossOrigin;
      }
    }
  }
  const transformedClientEntry = normalizeTransformAssetResult(await transformFn({
    url: source.clientEntry,
    kind: "clientEntry"
  }));
  const rootRoute = manifest2.routes[rootRouteId] = manifest2.routes[rootRouteId] || {};
  rootRoute.assets = rootRoute.assets || [];
  rootRoute.assets.push(buildClientEntryScriptTag(transformedClientEntry.href, source.injectedHeadScripts));
  return manifest2;
}
function buildManifestWithClientEntry(source) {
  const scriptTag = buildClientEntryScriptTag(source.clientEntry, source.injectedHeadScripts);
  const baseRootRoute = source.manifest.routes[rootRouteId];
  const routes = {
    ...source.manifest.routes,
    [rootRouteId]: {
      ...baseRootRoute,
      assets: [...baseRootRoute?.assets || [], scriptTag]
    }
  };
  return {
    inlineCss: source.manifest.inlineCss,
    routes
  };
}
var LINK_PARAM_TOKEN_RE = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;
var PRELOAD_AS_VALUES = /* @__PURE__ */ new Set([
  "fetch",
  "font",
  "image",
  "script",
  "style",
  "track"
]);
function buildLinkParam(name, value) {
  if (value === void 0) return name;
  if (LINK_PARAM_TOKEN_RE.test(value)) return `${name}=${value}`;
  return `${name}=${JSON.stringify(value)}`;
}
function serializeEarlyHint(hint) {
  const parts = [`<${hint.href}>`, buildLinkParam("rel", hint.rel)];
  if (hint.as) parts.push(buildLinkParam("as", hint.as));
  if (hint.crossOrigin !== void 0) parts.push(buildLinkParam("crossorigin", hint.crossOrigin || void 0));
  if (hint.type) parts.push(buildLinkParam("type", hint.type));
  if (hint.integrity) parts.push(buildLinkParam("integrity", hint.integrity));
  if (hint.referrerPolicy) parts.push(buildLinkParam("referrerpolicy", hint.referrerPolicy));
  if (hint.fetchPriority) parts.push(buildLinkParam("fetchpriority", hint.fetchPriority));
  return parts.join("; ");
}
function getStringAttr(attrs, name, fallbackName) {
  const value = attrs?.[name] ?? (fallbackName ? attrs?.[fallbackName] : void 0);
  return typeof value === "string" ? value : void 0;
}
function getPreloadAs(attrs) {
  const as = getStringAttr(attrs, "as");
  return as && PRELOAD_AS_VALUES.has(as) ? as : void 0;
}
function addEarlyHintFetchAttrs(hint, attrs) {
  const crossOrigin = getStringAttr(attrs, "crossOrigin", "crossorigin");
  const type = getStringAttr(attrs, "type");
  const integrity = getStringAttr(attrs, "integrity");
  const referrerPolicy = getStringAttr(attrs, "referrerPolicy", "referrerpolicy");
  const fetchPriority = getStringAttr(attrs, "fetchPriority", "fetchpriority");
  if (crossOrigin !== void 0) hint.crossOrigin = crossOrigin;
  if (type) hint.type = type;
  if (integrity) hint.integrity = integrity;
  if (referrerPolicy) hint.referrerPolicy = referrerPolicy;
  if (fetchPriority) hint.fetchPriority = fetchPriority;
}
function linkAttrsToEarlyHint(attrs) {
  const href = getStringAttr(attrs, "href");
  const rel = getStringAttr(attrs, "rel");
  if (!href || !rel) return void 0;
  const relTokens = rel.split(/\s+/);
  let hintRel;
  let hintAs;
  if (relTokens.includes("modulepreload")) {
    hintRel = "modulepreload";
    hintAs = "script";
  } else if (relTokens.includes("stylesheet")) {
    hintRel = "preload";
    hintAs = "style";
  } else if (relTokens.includes("preload")) {
    hintAs = getPreloadAs(attrs);
    if (!hintAs) return void 0;
    hintRel = "preload";
  } else if (relTokens.includes("preconnect")) {
    hintRel = "preconnect";
    hintAs = void 0;
  } else if (relTokens.includes("dns-prefetch")) {
    hintRel = "dns-prefetch";
    hintAs = void 0;
  }
  if (!hintRel) return void 0;
  const hint = {
    href,
    rel: hintRel
  };
  if (hintAs) hint.as = hintAs;
  addEarlyHintFetchAttrs(hint, attrs);
  return hint;
}
function collectStaticHintsFromManifest(manifest2, matchedRoutes) {
  const hints = [];
  for (const route of matchedRoutes) {
    const routeManifest = manifest2.routes[route.id];
    if (!routeManifest) continue;
    for (const link of routeManifest.preloads ?? []) {
      const { href, crossOrigin } = resolveManifestAssetLink(link);
      const hint = {
        href,
        rel: "modulepreload",
        as: "script"
      };
      if (crossOrigin !== void 0) hint.crossOrigin = crossOrigin;
      hints.push(hint);
    }
    for (const asset of routeManifest.assets ?? []) {
      if (asset.tag !== "link") continue;
      const stylesheetHref = getStylesheetHref(asset);
      if (stylesheetHref) {
        if (manifest2.inlineCss?.styles[stylesheetHref] !== void 0) continue;
        const hint2 = {
          href: stylesheetHref,
          rel: "preload",
          as: "style"
        };
        addEarlyHintFetchAttrs(hint2, asset.attrs);
        hints.push(hint2);
        continue;
      }
      const hint = linkAttrsToEarlyHint(asset.attrs);
      if (hint) hints.push(hint);
    }
  }
  return hints;
}
function collectDynamicHintsFromMatches(matches) {
  const hints = [];
  for (const match of matches) {
    const links = match.links;
    if (!Array.isArray(links)) continue;
    for (const link of links) {
      const hint = linkAttrsToEarlyHint(link);
      if (hint) hints.push(hint);
    }
  }
  return hints;
}
function createEarlyHintsEvent(opts) {
  const nextHints = [];
  const nextLinks = [];
  for (const hint of opts.hints) {
    const link = serializeEarlyHint(hint);
    if (opts.sentLinks.has(link)) continue;
    opts.sentLinks.add(link);
    opts.sentHints.push(hint);
    nextHints.push(hint);
    nextLinks.push(link);
  }
  if (!nextHints.length && opts.phase !== "dynamic") return void 0;
  return {
    phase: opts.phase,
    hints: nextHints,
    links: nextLinks,
    allHints: opts.sentHints.slice(),
    allLinks: Array.from(opts.sentLinks)
  };
}
function createResponseLinkHeaderEntries(opts) {
  for (const hint of opts.hints) {
    const link = serializeEarlyHint(hint);
    if (opts.sentLinks.has(link)) continue;
    opts.sentLinks.add(link);
    opts.entries.push({
      phase: opts.phase,
      hint,
      link
    });
  }
}
function getResponseLinkHeaderEntries(opts) {
  if (!opts.filter) return opts.entries.map((entry) => entry.link);
  try {
    const links = [];
    for (const entry of opts.entries) if (opts.filter(entry)) links.push(entry.link);
    return links;
  } catch (err) {
    console.error("Error filtering response Link headers:", err);
    return [];
  }
}
var ServerFunctionSerializationAdapter = createSerializationAdapter({
  key: "$TSS/serverfn",
  test: (v) => {
    if (typeof v !== "function") return false;
    if (!(TSS_SERVER_FUNCTION in v)) return false;
    return !!v[TSS_SERVER_FUNCTION];
  },
  toSerializable: ({ serverFnMeta }) => ({ functionId: serverFnMeta.id }),
  fromSerializable: ({ functionId }) => {
    const fn = async (opts, signal) => {
      return (await (await getServerFnById(functionId))(opts ?? {}, signal)).result;
    };
    return fn;
  }
});
function getStartResponseHeaders(opts) {
  return mergeHeaders({ "Content-Type": "text/html; charset=utf-8" }, ...opts.router.stores.matches.get().map((match) => {
    return match.headers;
  }));
}
function notifyEarlyHints(phase, event, onEarlyHints) {
  try {
    const result = onEarlyHints(event);
    if (result) Promise.resolve(result).catch((err) => {
      console.error(`Error sending ${phase} early hints:`, err);
    });
  } catch (err) {
    console.error(`Error sending ${phase} early hints:`, err);
  }
}
function getResponseLinkHeaderFilter(responseLinkHeader) {
  if (typeof responseLinkHeader !== "object") return;
  return responseLinkHeader.filter;
}
function appendResponseLinkHeaders(opts) {
  if (!opts.filter) {
    for (const entry of opts.entries) opts.responseHeaders.append("Link", entry.link);
    return;
  }
  const links = getResponseLinkHeaderEntries(opts);
  for (const link of links) opts.responseHeaders.append("Link", link);
}
function collectResponseLinkHeaderEntries(opts) {
  for (let index = 0; index < opts.event.hints.length; index++) opts.entries.push({
    phase: opts.phase,
    hint: opts.event.hints[index],
    link: opts.event.links[index]
  });
}
function handleCollectedEarlyHints(opts) {
  const event = opts.onEarlyHints ? createEarlyHintsEvent({
    phase: opts.phase,
    hints: opts.hints,
    sentLinks: opts.sentLinks,
    sentHints: opts.sentHints
  }) : void 0;
  if (event) notifyEarlyHints(opts.phase, event, opts.onEarlyHints);
  if (!opts.responseLinkHeaderEntries) return;
  if (event) {
    collectResponseLinkHeaderEntries({
      phase: opts.phase,
      event,
      entries: opts.responseLinkHeaderEntries
    });
    return;
  }
  createResponseLinkHeaderEntries({
    phase: opts.phase,
    hints: opts.hints,
    sentLinks: opts.sentLinks,
    entries: opts.responseLinkHeaderEntries
  });
}
var entriesPromise;
var baseManifestPromise;
var cachedFinalManifestPromise;
async function loadEntries() {
  const [routerEntry, startEntry, pluginAdapters] = await Promise.all([
    import("./router-B4G_FXaH.js").then((n) => n.I),
    import("./start-H7M3fhUi.js"),
    import("./__23tanstack-start-plugin-adapters-Cwee5PKy.js")
  ]);
  return {
    routerEntry,
    startEntry,
    pluginAdapters
  };
}
function getEntries() {
  if (!entriesPromise) entriesPromise = loadEntries();
  return entriesPromise;
}
function getBaseManifest(matchedRoutes) {
  if (!baseManifestPromise) baseManifestPromise = getStartManifest();
  return baseManifestPromise;
}
async function resolveManifest(matchedRoutes, transformFn, cache) {
  const base = await getBaseManifest();
  const computeFinalManifest = async () => {
    return transformFn ? await transformManifestAssets(base, transformFn) : buildManifestWithClientEntry(base);
  };
  if (!transformFn || cache) {
    if (!cachedFinalManifestPromise) cachedFinalManifestPromise = computeFinalManifest();
    return cachedFinalManifestPromise;
  }
  return computeFinalManifest();
}
var ROUTER_BASEPATH = "/";
var SERVER_FN_BASE = "/_serverFn/";
var IS_PRERENDERING = process.env.TSS_PRERENDERING === "true";
var IS_SHELL_ENV = process.env.TSS_SHELL === "true";
var ERR_NO_RESPONSE = "Internal Server Error";
var ERR_NO_DEFER = "Internal Server Error";
function throwRouteHandlerError() {
  throw new Error(ERR_NO_RESPONSE);
}
function throwIfMayNotDefer() {
  throw new Error(ERR_NO_DEFER);
}
function isSpecialResponse(value) {
  return value instanceof Response || isRedirect(value);
}
function handleCtxResult(result) {
  if (isSpecialResponse(result)) return { response: result };
  return result;
}
function executeMiddleware(middlewares, ctx) {
  let index = -1;
  const next = async (nextCtx) => {
    if (nextCtx) {
      if (nextCtx.context) ctx.context = safeObjectMerge(ctx.context, nextCtx.context);
      for (const key of Object.keys(nextCtx)) if (key !== "context") ctx[key] = nextCtx[key];
    }
    index++;
    const middleware = middlewares[index];
    if (!middleware) return ctx;
    let result;
    try {
      result = await middleware({
        ...ctx,
        next
      });
    } catch (err) {
      if (isSpecialResponse(err)) {
        ctx.response = err;
        return ctx;
      }
      throw err;
    }
    const normalized = handleCtxResult(result);
    if (normalized) {
      if (normalized.response !== void 0) ctx.response = normalized.response;
      if (normalized.context) ctx.context = safeObjectMerge(ctx.context, normalized.context);
    }
    return ctx;
  };
  return next();
}
function handlerToMiddleware(handler, mayDefer = false) {
  if (mayDefer) return handler;
  return async (ctx) => {
    const response = await handler({
      ...ctx,
      next: throwIfMayNotDefer
    });
    if (!response) throwRouteHandlerError();
    return response;
  };
}
function createStartHandler(cbOrOptions) {
  const cb = typeof cbOrOptions === "function" ? cbOrOptions : cbOrOptions.handler;
  const transformAssetsOption = typeof cbOrOptions === "function" ? void 0 : cbOrOptions.transformAssets;
  const transformAssetUrlsOption = typeof cbOrOptions === "function" ? void 0 : cbOrOptions.transformAssetUrls;
  const transformOption = transformAssetsOption !== void 0 ? resolveTransformAssetsConfig(transformAssetsOption) : transformAssetUrlsOption !== void 0 ? resolveTransformAssetsConfig(adaptTransformAssetUrlsConfigToTransformAssets(transformAssetUrlsOption)) : void 0;
  const warmupTransformManifest = !!transformAssetsOption && typeof transformAssetsOption === "object" && "warmup" in transformAssetsOption && transformAssetsOption.warmup === true || !!transformAssetUrlsOption && typeof transformAssetUrlsOption === "object" && transformAssetUrlsOption.warmup === true;
  const resolvedTransformConfig = transformOption;
  const cache = resolvedTransformConfig ? resolvedTransformConfig.cache : true;
  const shouldCacheCreateTransform = cache && true;
  let cachedCreateTransformPromise;
  const getTransformFn = async (opts) => {
    if (!resolvedTransformConfig) return void 0;
    if (resolvedTransformConfig.type === "createTransform") {
      if (shouldCacheCreateTransform) {
        if (!cachedCreateTransformPromise) cachedCreateTransformPromise = Promise.resolve(resolvedTransformConfig.createTransform(opts)).catch((error) => {
          cachedCreateTransformPromise = void 0;
          throw error;
        });
        return cachedCreateTransformPromise;
      }
      return resolvedTransformConfig.createTransform(opts);
    }
    return resolvedTransformConfig.transformFn;
  };
  if (warmupTransformManifest && cache && true && !cachedFinalManifestPromise) {
    const warmupPromise = (async () => {
      const base = await getBaseManifest();
      const transformFn = await getTransformFn({ warmup: true });
      return transformFn ? await transformManifestAssets(base, transformFn) : buildManifestWithClientEntry(base);
    })();
    cachedFinalManifestPromise = warmupPromise;
    warmupPromise.catch(() => {
      if (cachedFinalManifestPromise === warmupPromise) cachedFinalManifestPromise = void 0;
      cachedCreateTransformPromise = void 0;
    });
  }
  const startRequestResolver = async (request, requestOpts) => {
    let router = null;
    let cbWillCleanup = false;
    try {
      const { url, handledProtocolRelativeURL } = getNormalizedURL(request.url);
      const href = url.pathname + url.search + url.hash;
      const origin = getOrigin(request);
      if (handledProtocolRelativeURL) return Response.redirect(url, 308);
      const entries = await getEntries();
      const startOptions = await entries.startEntry.startInstance?.getOptions() || {};
      const { hasPluginAdapters, pluginSerializationAdapters } = entries.pluginAdapters;
      const serializationAdapters = [
        ...startOptions.serializationAdapters || [],
        ...hasPluginAdapters ? pluginSerializationAdapters : [],
        ServerFunctionSerializationAdapter
      ];
      const requestStartOptions = {
        ...startOptions,
        serializationAdapters
      };
      const flattenedRequestMiddlewares = startOptions.requestMiddleware ? flattenMiddlewares(startOptions.requestMiddleware) : [];
      const executedRequestMiddlewares = new Set(flattenedRequestMiddlewares);
      const getRouter = async () => {
        if (router) return router;
        router = await entries.routerEntry.getRouter();
        let isShell = IS_SHELL_ENV;
        if (IS_PRERENDERING && !isShell) isShell = request.headers.get(HEADERS.TSS_SHELL) === "true";
        const history = createMemoryHistory({ initialEntries: [href] });
        router.update({
          history,
          isShell,
          isPrerendering: IS_PRERENDERING,
          origin: router.options.origin ?? origin,
          defaultSsr: requestStartOptions.defaultSsr,
          serializationAdapters: [...requestStartOptions.serializationAdapters, ...router.options.serializationAdapters || []],
          basepath: ROUTER_BASEPATH
        });
        return router;
      };
      if (SERVER_FN_BASE && url.pathname.startsWith(SERVER_FN_BASE)) {
        const serverFnId = url.pathname.slice(SERVER_FN_BASE.length).split("/")[0];
        if (!serverFnId) throw new Error("Invalid server action param for serverFnId");
        const serverFnHandler = async ({ context }) => {
          return runWithStartContext({
            getRouter,
            startOptions: requestStartOptions,
            contextAfterGlobalMiddlewares: context,
            request,
            executedRequestMiddlewares,
            handlerType: "serverFn"
          }, () => handleServerAction({
            request,
            context: requestOpts?.context,
            serverFnId
          }));
        };
        return handleRedirectResponse((await executeMiddleware([...flattenedRequestMiddlewares.map((d) => d.options.server), serverFnHandler], {
          request,
          pathname: url.pathname,
          context: createNullProtoObject(requestOpts?.context)
        })).response, request, getRouter);
      }
      const executeRouter = async (serverContext, matchedRoutes) => {
        const acceptParts = (request.headers.get("Accept") || "*/*").split(",");
        if (!["*/*", "text/html"].some((mimeType) => acceptParts.some((part) => part.trim().startsWith(mimeType)))) return Response.json({ error: "Only HTML requests are supported here" }, { status: 500 });
        const manifest2 = await resolveManifest(matchedRoutes, await getTransformFn({
          warmup: false,
          request
        }), cache);
        const onEarlyHints = requestOpts?.onEarlyHints;
        const responseLinkHeader = requestOpts?.responseLinkHeader;
        const shouldCollectEarlyHints = !!onEarlyHints || !!responseLinkHeader;
        const sentEarlyHintLinks = shouldCollectEarlyHints ? /* @__PURE__ */ new Set() : void 0;
        const sentEarlyHints = onEarlyHints ? new Array() : void 0;
        const responseLinkHeaderEntries = shouldCollectEarlyHints && responseLinkHeader ? new Array() : void 0;
        const responseLinkHeaderFilter = shouldCollectEarlyHints ? getResponseLinkHeaderFilter(responseLinkHeader) : void 0;
        if (shouldCollectEarlyHints && sentEarlyHintLinks && matchedRoutes?.length) handleCollectedEarlyHints({
          phase: "static",
          hints: collectStaticHintsFromManifest(manifest2, matchedRoutes),
          sentLinks: sentEarlyHintLinks,
          sentHints: sentEarlyHints,
          onEarlyHints,
          responseLinkHeaderEntries
        });
        const routerInstance = await getRouter();
        attachRouterServerSsrUtils({
          router: routerInstance,
          manifest: manifest2,
          getRequestAssets: () => getStartContext({ throwIfNotFound: false })?.requestAssets,
          includeUnmatchedRouteAssets: false
        });
        routerInstance.update({ additionalContext: { serverContext } });
        await routerInstance.load();
        if (routerInstance.state.redirect) return routerInstance.state.redirect;
        if (shouldCollectEarlyHints && sentEarlyHintLinks) handleCollectedEarlyHints({
          phase: "dynamic",
          hints: collectDynamicHintsFromMatches(routerInstance.stores.matches.get()),
          sentLinks: sentEarlyHintLinks,
          sentHints: sentEarlyHints,
          onEarlyHints,
          responseLinkHeaderEntries
        });
        const ctx = getStartContext({ throwIfNotFound: false });
        await routerInstance.serverSsr.dehydrate({ requestAssets: ctx?.requestAssets });
        const responseHeaders = getStartResponseHeaders({ router: routerInstance });
        if (responseLinkHeaderEntries?.length) appendResponseLinkHeaders({
          responseHeaders,
          entries: responseLinkHeaderEntries,
          filter: responseLinkHeaderFilter
        });
        cbWillCleanup = true;
        return cb({
          request,
          router: routerInstance,
          responseHeaders
        });
      };
      const requestHandlerMiddleware = async ({ context }) => {
        return runWithStartContext({
          getRouter,
          startOptions: requestStartOptions,
          contextAfterGlobalMiddlewares: context,
          request,
          executedRequestMiddlewares,
          handlerType: "router"
        }, async () => {
          try {
            return await handleServerRoutes({
              getRouter,
              request,
              url,
              executeRouter,
              context,
              executedRequestMiddlewares
            });
          } catch (err) {
            if (err instanceof Response) return err;
            throw err;
          }
        });
      };
      return handleRedirectResponse((await executeMiddleware([...flattenedRequestMiddlewares.map((d) => d.options.server), requestHandlerMiddleware], {
        request,
        pathname: url.pathname,
        context: createNullProtoObject(requestOpts?.context)
      })).response, request, getRouter);
    } finally {
      if (router && !cbWillCleanup) router.serverSsr?.cleanup();
      router = null;
    }
  };
  return requestHandler(startRequestResolver);
}
async function handleRedirectResponse(response, request, getRouter) {
  if (!isRedirect(response)) return response;
  if (isResolvedRedirect(response)) {
    if (request.headers.get("x-tsr-serverFn") === "true") return Response.json({
      ...response.options,
      isSerializedRedirect: true
    }, { headers: response.headers });
    return response;
  }
  const opts = response.options;
  if (opts.to && typeof opts.to === "string" && !opts.to.startsWith("/")) throw new Error(`Server side redirects must use absolute paths via the 'href' or 'to' options. The redirect() method's "to" property accepts an internal path only. Use the "href" property to provide an external URL. Received: ${JSON.stringify(opts)}`);
  if ([
    "params",
    "search",
    "hash"
  ].some((d) => typeof opts[d] === "function")) throw new Error(`Server side redirects must use static search, params, and hash values and do not support functional values. Received functional values for: ${Object.keys(opts).filter((d) => typeof opts[d] === "function").map((d) => `"${d}"`).join(", ")}`);
  const redirect = (await getRouter()).resolveRedirect(response);
  if (request.headers.get("x-tsr-serverFn") === "true") return Response.json({
    ...response.options,
    isSerializedRedirect: true
  }, { headers: response.headers });
  return redirect;
}
async function handleServerRoutes({ getRouter, request, url, executeRouter, context, executedRequestMiddlewares }) {
  const router = await getRouter();
  const pathname = executeRewriteInput(router.rewrite, url).pathname;
  const { matchedRoutes, foundRoute, routeParams } = router.getMatchedRoutes(pathname);
  const isExactMatch = foundRoute && routeParams["**"] === void 0;
  const routeMiddlewares = [];
  for (const route of matchedRoutes) {
    const serverMiddleware = route.options.server?.middleware;
    if (serverMiddleware) {
      const flattened = flattenMiddlewares(serverMiddleware);
      for (const m of flattened) if (!executedRequestMiddlewares.has(m)) routeMiddlewares.push(m.options.server);
    }
  }
  const server2 = foundRoute?.options.server;
  let isHeadFallback = false;
  if (server2?.handlers && isExactMatch) {
    const handlers = typeof server2.handlers === "function" ? server2.handlers({ createHandlers: (d) => d }) : server2.handlers;
    const requestMethod = request.method.toUpperCase();
    const handler = requestMethod === "HEAD" ? handlers["HEAD"] ?? handlers["GET"] ?? handlers["ANY"] : handlers[requestMethod] ?? handlers["ANY"];
    isHeadFallback = requestMethod === "HEAD" && handler !== void 0 && !handlers["HEAD"];
    if (handler) {
      const mayDefer = !!foundRoute.options.component;
      if (typeof handler === "function") routeMiddlewares.push(handlerToMiddleware(handler, mayDefer));
      else {
        if (handler.middleware?.length) {
          const handlerMiddlewares = flattenMiddlewares(handler.middleware);
          for (const m of handlerMiddlewares) routeMiddlewares.push(m.options.server);
        }
        if (handler.handler) routeMiddlewares.push(handlerToMiddleware(handler.handler, mayDefer));
      }
    }
  }
  routeMiddlewares.push((ctx2) => executeRouter(ctx2.context, matchedRoutes));
  const ctx = await executeMiddleware(routeMiddlewares, {
    request,
    context,
    params: routeParams,
    pathname
  });
  if (isHeadFallback) {
    if (!ctx.response) throwRouteHandlerError();
    const resolved = await handleRedirectResponse(ctx.response, request, getRouter);
    return new Response(null, resolved);
  }
  return ctx.response;
}
var fetch = createStartHandler(defaultStreamHandler);
function createServerEntry(entry) {
  return { async fetch(...args) {
    return await entry.fetch(...args);
  } };
}
var server_default = createServerEntry({ fetch });
const server = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createServerEntry,
  default: server_default
}, Symbol.toStringTag, { value: "Module" }));
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
export {
  createSsrRpc as a,
  createStart as b,
  createServerFn as c,
  createMiddleware as d,
  createServerRpc as e,
  server as s
};
