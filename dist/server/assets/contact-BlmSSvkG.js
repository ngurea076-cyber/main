import { jsxs, jsx } from "react/jsx-runtime";
import { MessageCircle, Phone, Mail, MapPin, Clock } from "lucide-react";
import { b as useWhatsAppNumber, D as DEFAULT_WHATSAPP_NUMBER, w as waLink, B as Button, h as handleWhatsAppLinkClick, o as openWhatsAppConversation } from "./router-B4G_FXaH.js";
import { useState } from "react";
import { toast } from "sonner";
import "@tanstack/react-query";
import "@tanstack/react-router";
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
function ContactPage() {
  const {
    data: wa = DEFAULT_WHATSAPP_NUMBER
  } = useWhatsAppNumber();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });
  const submit = (e) => {
    e.preventDefault();
    const text = `Hello Shop ICT Gadgets, my name is ${form.name} (${form.email}).

${form.message}`;
    openWhatsAppConversation(waLink(wa, text));
    toast.success("Opening WhatsApp...");
  };
  const supportHref = waLink(wa, "Hello Shop ICT Gadgets!");
  return /* @__PURE__ */ jsxs("div", { className: "site-desktop-width mx-auto px-6 py-12", children: [
    /* @__PURE__ */ jsxs("header", { className: "mb-10 max-w-2xl", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold tracking-tight md:text-5xl", children: "Talk to us." }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 text-muted-foreground", children: "We respond within minutes during business hours. Prefer chat? Tap WhatsApp." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-8 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-4 rounded-3xl border bg-card p-6 md:p-8 shadow-soft", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "mb-1.5 block text-sm font-medium", children: "Name" }),
          /* @__PURE__ */ jsx("input", { required: true, value: form.name, onChange: (e) => setForm({
            ...form,
            name: e.target.value
          }), className: "w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "mb-1.5 block text-sm font-medium", children: "Email" }),
          /* @__PURE__ */ jsx("input", { type: "email", required: true, value: form.email, onChange: (e) => setForm({
            ...form,
            email: e.target.value
          }), className: "w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "mb-1.5 block text-sm font-medium", children: "Message" }),
          /* @__PURE__ */ jsx("textarea", { required: true, rows: 5, value: form.message, onChange: (e) => setForm({
            ...form,
            message: e.target.value
          }), className: "w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" })
        ] }),
        /* @__PURE__ */ jsxs(Button, { type: "submit", size: "lg", className: "w-full rounded-full bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90", children: [
          /* @__PURE__ */ jsx(MessageCircle, { className: "h-4 w-4" }),
          " Send via WhatsApp"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("a", { href: supportHref, onClick: (event) => handleWhatsAppLinkClick(event, supportHref), className: "block overflow-hidden rounded-3xl gradient-primary p-8 text-primary-foreground hover-lift", children: [
          /* @__PURE__ */ jsx(MessageCircle, { className: "h-8 w-8" }),
          /* @__PURE__ */ jsx("h3", { className: "mt-4 text-2xl font-bold", children: "WhatsApp support" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 opacity-90", children: "Fast replies, real humans. Tap to chat now." }),
          /* @__PURE__ */ jsx("div", { className: "mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm", children: wa })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border bg-card p-5", children: [
            /* @__PURE__ */ jsx(Phone, { className: "h-5 w-5 text-primary" }),
            /* @__PURE__ */ jsx("div", { className: "mt-3 text-sm font-semibold", children: "Call us" }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "+254 713 869 018" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border bg-card p-5", children: [
            /* @__PURE__ */ jsx(Mail, { className: "h-5 w-5 text-primary" }),
            /* @__PURE__ */ jsx("div", { className: "mt-3 text-sm font-semibold", children: "Email" }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "hello@shopict.co.ke" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border bg-card p-5", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "h-5 w-5 text-primary" }),
            /* @__PURE__ */ jsx("div", { className: "mt-3 text-sm font-semibold", children: "Visit" }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Nairobi, Kenya" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border bg-card p-5", children: [
            /* @__PURE__ */ jsx(Clock, { className: "h-5 w-5 text-primary" }),
            /* @__PURE__ */ jsx("div", { className: "mt-3 text-sm font-semibold", children: "Hours" }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Mon–Sat 9am–6pm" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-3xl border", children: /* @__PURE__ */ jsx("iframe", { title: "Map", src: "https://www.google.com/maps?q=Nairobi&output=embed", className: "h-64 w-full" }) })
      ] })
    ] })
  ] });
}
export {
  ContactPage as component
};
