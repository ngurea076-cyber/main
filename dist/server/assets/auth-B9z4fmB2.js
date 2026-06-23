import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { u as useAuth, B as Button, g as getAdminAccessConfig, v as verifyAdminAccessCode } from "./router-B4G_FXaH.js";
import { toast } from "sonner";
import "@tanstack/react-query";
import "lucide-react";
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
const ACCESS_STORAGE_KEY = "shopict_admin_access_granted";
const ACCESS_TTL_MS = 5 * 24 * 60 * 60 * 1e3;
function readStoredAccess(key) {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key) ?? window.sessionStorage.getItem(key);
    if (!raw) return null;
    if (raw === "1") return "1";
    const parsed = JSON.parse(raw);
    if (parsed.granted && typeof parsed.expiresAt === "number" && parsed.expiresAt > Date.now()) {
      return "1";
    }
    window.localStorage.removeItem(key);
    window.sessionStorage.removeItem(key);
    return null;
  } catch {
    return null;
  }
}
function writeStoredAccess(key) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify({
      granted: true,
      expiresAt: Date.now() + ACCESS_TTL_MS
    }));
  } catch {
  }
}
function AuthPage() {
  const navigate = useNavigate();
  const {
    user,
    signIn
  } = useAuth();
  const [accessCode, setAccessCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [accessLoading, setAccessLoading] = useState(true);
  const [accessGateEnabled, setAccessGateEnabled] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  if (user) {
    setTimeout(() => navigate({
      to: "/admin"
    }), 0);
  }
  useEffect(() => {
    let cancelled = false;
    const loadAccessConfig = async () => {
      try {
        const config = await getAdminAccessConfig();
        if (cancelled) return;
        const alreadyGranted = readStoredAccess(ACCESS_STORAGE_KEY) === "1";
        setAccessGateEnabled(Boolean(config.enabled));
        setAccessGranted(!config.enabled || alreadyGranted);
      } catch {
        if (cancelled) return;
        setAccessGateEnabled(false);
        setAccessGranted(true);
      } finally {
        if (!cancelled) setAccessLoading(false);
      }
    };
    void loadAccessConfig();
    return () => {
      cancelled = true;
    };
  }, []);
  const submitAccessCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await verifyAdminAccessCode(accessCode);
      if (!result.valid) {
        throw new Error("Invalid private access code");
      }
      writeStoredAccess(ACCESS_STORAGE_KEY);
      setAccessGranted(true);
      setAccessCode("");
      toast.success("Private access unlocked");
    } catch (err) {
      toast.error(err.message || "Private access denied");
    } finally {
      setLoading(false);
    }
  };
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      toast.success("Admin access granted");
      navigate({
        to: "/admin"
      });
    } catch (err) {
      toast.error(err.message || "Invalid admin credentials");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "grid min-h-screen lg:grid-cols-2", children: [
    /* @__PURE__ */ jsxs("aside", { className: "relative hidden overflow-hidden gradient-dark p-12 text-white lg:flex lg:flex-col", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/", className: "flex items-center gap-2 font-semibold", children: [
        /* @__PURE__ */ jsx("span", { className: "grid h-9 w-9 place-items-center rounded-xl gradient-primary text-primary-foreground font-bold", children: "S" }),
        "Shop ICT Gadgets"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "my-auto", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-4xl font-bold leading-tight", children: "Store admin access." }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 max-w-md text-white/70", children: "Sign in with your dashboard credentials to manage the sections assigned to your role." })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center px-6 py-12", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/", className: "mb-8 inline-flex items-center gap-2 font-semibold lg:hidden", children: [
        /* @__PURE__ */ jsx("span", { className: "grid h-9 w-9 place-items-center rounded-xl gradient-primary text-primary-foreground font-bold", children: "S" }),
        "Shop ICT Gadgets"
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold", children: "Admin login" }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: accessGateEnabled && !accessGranted ? "Enter your private access code first." : "Use your configured dashboard email and password." }),
      accessLoading ? /* @__PURE__ */ jsx("div", { className: "mt-8 rounded-2xl border bg-card px-4 py-5 text-sm text-muted-foreground", children: "Loading secure access..." }) : accessGateEnabled && !accessGranted ? /* @__PURE__ */ jsxs("form", { onSubmit: submitAccessCode, className: "mt-8 space-y-4", children: [
        /* @__PURE__ */ jsx("input", { type: "password", required: true, value: accessCode, onChange: (e) => setAccessCode(e.target.value), placeholder: "Private access code", className: "w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" }),
        /* @__PURE__ */ jsx(Button, { disabled: loading, type: "submit", size: "lg", className: "w-full rounded-full", children: loading ? "Checking..." : "Continue" })
      ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "mt-8 space-y-4", children: [
        /* @__PURE__ */ jsx("input", { type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), placeholder: "Admin email", className: "w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" }),
        /* @__PURE__ */ jsx("input", { type: "password", required: true, value: password, onChange: (e) => setPassword(e.target.value), placeholder: "Password", className: "w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" }),
        /* @__PURE__ */ jsx(Button, { disabled: loading, type: "submit", size: "lg", className: "w-full rounded-full", children: loading ? "Please wait..." : "Sign in" })
      ] })
    ] }) })
  ] });
}
export {
  AuthPage as component
};
