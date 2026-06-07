"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  Bot,
  CheckCircle2,
  ChevronDown,
  Headphones,
  LoaderCircle,
  MessageCircle,
  Mic,
  PackageSearch,
  Phone,
  ShoppingBag,
  Sparkles,
  UserRound,
  X
} from "lucide-react";
import { useStore } from "@/components/store-provider";
import { languageNames } from "@/lib/customer-assistant/knowledge";
import type { AssistantLanguage, AssistantReply } from "@/lib/customer-assistant/types";
import type { Product } from "@/lib/types";

type ChatMessage = {
  id: string;
  role: "assistant" | "customer";
  text: string;
  reply?: AssistantReply;
};

const welcome =
  "Namaste. I am Dakshin AI Assistant. I can help you find products, understand delivery and returns, track an order securely, or connect you with our team.";

export function CustomerAssistantWidget() {
  const { cart, wishlist, addToCart } = useStore();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<AssistantLanguage>("en");
  const [conversationId, setConversationId] = useState<string>();
  const [mode, setMode] = useState<"CHAT" | "ORDER" | "LEAD">("CHAT");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "assistant", text: welcome }
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, loading, mode]);

  async function send(command = input) {
    const message = command.trim();
    if (!message || loading) return;
    setInput("");
    setMessages((current) => [...current, { id: `customer-${Date.now()}`, role: "customer", text: message }]);
    setLoading(true);
    try {
      const response = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          conversationId,
          visitorId: getVisitorId(),
          channel: "WEBSITE",
          language,
          page: window.location.pathname,
          cart: cart.map((item) => ({ name: item.product.name, quantity: item.quantity, price: item.product.price })),
          wishlist: wishlist.map((item) => ({ name: item.name, price: item.price }))
        })
      });
      const reply = (await response.json()) as AssistantReply;
      if (!response.ok) throw new Error("Assistant unavailable");
      setConversationId(reply.conversationId);
      setLanguage(reply.language);
      setMessages((current) => [...current, { id: `assistant-${Date.now()}`, role: "assistant", text: reply.reply, reply }]);
      if (reply.requiresVerification) setMode("ORDER");
      if (reply.intent === "LEAD_CAPTURE") setMode("LEAD");
    } catch {
      setMessages((current) => [...current, { id: `error-${Date.now()}`, role: "assistant", text: "I could not answer safely. Please use WhatsApp or ask for human support." }]);
    } finally {
      setLoading(false);
    }
  }

  function startVoice() {
    const SpeechRecognition = (
      window as unknown as {
        webkitSpeechRecognition?: new () => {
          lang: string;
          start: () => void;
          onresult: (event: { results: ArrayLike<{ 0: { transcript: string } }> }) => void;
        };
      }
    ).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMessages((current) => [...current, { id: `voice-${Date.now()}`, role: "assistant", text: "Voice input is not supported in this browser. You can type your message instead." }]);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = language === "en" ? "en-IN" : `${language}-IN`;
    recognition.onresult = (event) => setInput(event.results[0][0].transcript);
    recognition.start();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 z-40 flex items-center gap-2 rounded-full bg-[#173c2c] px-4 py-3 text-xs font-bold text-white shadow-luxe transition hover:-translate-y-1 lg:bottom-6 lg:right-24"
        aria-label="Open Dakshin AI Assistant"
      >
        <Sparkles className="h-4 w-4 text-sandal" />
        <span className="hidden sm:inline">Ask Dakshin AI</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] bg-ink/30 backdrop-blur-sm sm:flex sm:items-end sm:justify-end sm:p-5" onClick={() => setOpen(false)}>
          <section
            onClick={(event) => event.stopPropagation()}
            className="flex h-full w-full flex-col overflow-hidden bg-cream shadow-2xl dark:bg-[#101713] sm:h-[min(760px,calc(100vh-40px))] sm:max-w-[430px] sm:rounded-[28px] sm:border sm:border-ink/10 dark:sm:border-white/10"
          >
            <header className="bg-[#173c2c] p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-sandal"><Bot className="h-5 w-5" /></span>
                  <div><p className="text-sm font-bold">Dakshin AI Assistant</p><p className="mt-0.5 text-[9px] text-white/60">Online · Human support available</p></div>
                </div>
                <button onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-white/10" aria-label="Close chat"><X className="h-5 w-5" /></button>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <select value={language} onChange={(event) => setLanguage(event.target.value as AssistantLanguage)} className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[9px] outline-none">
                  {Object.entries(languageNames).map(([code, name]) => <option className="text-ink" key={code} value={code}>{name}</option>)}
                </select>
                <a href="https://wa.me/919871877072" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-[9px]"><Phone className="h-3 w-3" /> WhatsApp</a>
                <button onClick={() => send("I need a human support agent")} className="flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-[9px]"><Headphones className="h-3 w-3" /> Human</button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto px-4 py-5">
              {messages.map((message) => (
                <div key={message.id} className={`mb-5 flex gap-2.5 ${message.role === "customer" ? "justify-end" : ""}`}>
                  {message.role === "assistant" && <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#173c2c] text-sandal"><Bot className="h-3.5 w-3.5" /></span>}
                  <div className={`max-w-[85%] ${message.role === "customer" ? "rounded-2xl rounded-br-md bg-[#173c2c] px-3.5 py-2.5 text-white" : ""}`}>
                    <p className="text-[11px] leading-5">{message.text}</p>
                    {message.reply?.products && <ProductSuggestions products={message.reply.products} addToCart={addToCart} />}
                    {message.reply?.articles && message.reply.articles.length > 0 && <div className="mt-3 space-y-1">{message.reply.articles.map((article) => <Link className="block text-[9px] font-bold text-brass underline" key={article.href} href={article.href}>{article.title}</Link>)}</div>}
                    {message.reply?.quickReplies && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {message.reply.quickReplies.map((reply) => <button key={reply} onClick={() => send(reply)} className="rounded-full border border-ink/10 px-2.5 py-1.5 text-[8px] font-bold dark:border-white/10">{reply}</button>)}
                      </div>
                    )}
                    {message.reply?.escalated && <p className="mt-2 flex items-center gap-1 text-[8px] font-bold text-emerald-700"><CheckCircle2 className="h-3 w-3" /> Human takeover requested</p>}
                  </div>
                  {message.role === "customer" && <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-mist dark:bg-white/10"><UserRound className="h-3.5 w-3.5" /></span>}
                </div>
              ))}
              {loading && <div className="flex items-center gap-2 text-[10px] text-ink/45 dark:text-white/45"><LoaderCircle className="h-4 w-4 animate-spin" /> Dakshin AI is checking verified information...</div>}
              {mode === "ORDER" && <OrderVerification onDone={(text) => { setMode("CHAT"); setMessages((current) => [...current, { id: `order-${Date.now()}`, role: "assistant", text }]); }} />}
              {mode === "LEAD" && <LeadCapture conversationId={conversationId} onDone={() => { setMode("CHAT"); setMessages((current) => [...current, { id: `lead-${Date.now()}`, role: "assistant", text: "Your enquiry is saved in our CRM. A sales specialist can follow up with a verified recommendation and quotation." }]); }} />}
              <div ref={endRef} />
            </div>

            <form onSubmit={(event) => { event.preventDefault(); void send(); }} className="border-t border-ink/10 bg-white p-3 dark:border-white/10 dark:bg-white/[0.03]">
              <div className="flex items-end gap-2 rounded-2xl border border-ink/10 p-2 focus-within:border-brass dark:border-white/10">
                <button type="button" onClick={startVoice} className="rounded-xl p-2 text-ink/45 hover:bg-mist dark:text-white/45 dark:hover:bg-white/10" aria-label="Use voice input"><Mic className="h-4 w-4" /></button>
                <textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void send(); } }} className="max-h-24 min-h-9 flex-1 resize-none bg-transparent py-2 text-[11px] outline-none" placeholder="Ask about products, orders or delivery..." />
                <button disabled={!input.trim() || loading} className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#173c2c] text-white disabled:opacity-40"><ArrowUp className="h-4 w-4" /></button>
              </div>
              <p className="mt-2 text-center text-[7px] text-ink/35 dark:text-white/35">AI may make mistakes. Private order information requires verification.</p>
            </form>
          </section>
        </div>
      )}
    </>
  );
}

function ProductSuggestions({ products, addToCart }: { products: Product[]; addToCart: (product: Product) => void }) {
  return <div className="mt-3 space-y-2">{products.map((product) => <div key={product.id} className="flex gap-2 rounded-xl border border-ink/10 bg-white p-2 dark:border-white/10 dark:bg-white/5">
    <Image src={product.image} alt={product.name} width={56} height={64} className="h-16 w-14 rounded-lg object-cover" />
    <div className="min-w-0 flex-1"><Link href={`/products/${product.slug}`} className="line-clamp-1 text-[9px] font-bold">{product.name}</Link><p className="mt-1 text-[8px] text-ink/45 dark:text-white/45">{product.weight} · {product.stock > 0 ? "In stock" : "Out of stock"}</p><p className="mt-1 text-[9px] font-bold">₹{product.price.toLocaleString("en-IN")}</p></div>
    <button onClick={() => addToCart(product)} disabled={product.stock < 1} className="self-end rounded-lg bg-[#173c2c] p-2 text-white disabled:opacity-40" aria-label={`Add ${product.name} to cart`}><ShoppingBag className="h-3.5 w-3.5" /></button>
  </div>)}</div>;
}

function OrderVerification({ onDone }: { onDone: (message: string) => void }) {
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    const data = new FormData(event.currentTarget);
    const response = await fetch("/api/assistant/order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderNumber: data.get("orderNumber"), contact: data.get("contact") }) });
    const result = await response.json();
    setBusy(false);
    if (!response.ok) return onDone(result.error ?? "Order could not be verified.");
    const order = result.order;
    const estimated = order.shipments?.[0]?.estimatedAt ?? order.shipments?.[0]?.estimatedDelivery;
    onDone(`Order ${order.orderNumber} is ${String(order.status).replaceAll("_", " ")}. Payment is ${order.paymentStatus}. ${estimated ? `Estimated delivery: ${new Date(estimated).toLocaleDateString("en-IN")}.` : ""}`);
  }
  return <form onSubmit={submit} className="mb-5 rounded-2xl border border-brass/30 bg-sandal/10 p-4"><p className="flex items-center gap-2 text-[10px] font-bold"><PackageSearch className="h-4 w-4" /> Secure order lookup</p><input name="orderNumber" required className="field mt-3 !h-10 !text-[10px]" placeholder="Order number" /><input name="contact" required className="field mt-2 !h-10 !text-[10px]" placeholder="Order email or phone" /><button disabled={busy} className="button-primary mt-3 !px-4 !py-2 !text-[9px]">{busy ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : "Verify and track"}</button><p className="mt-2 text-[7px] text-ink/40">Demo: SA260605 / demo@southaura.in</p></form>;
}

function LeadCapture({ conversationId, onDone }: { conversationId?: string; onDone: () => void }) {
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    const form = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch("/api/assistant/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, conversationId }) });
    setBusy(false);
    if (response.ok) onDone();
  }
  return <form onSubmit={submit} className="mb-5 rounded-2xl border border-brass/30 bg-sandal/10 p-4"><p className="text-[10px] font-bold">Quotation and sales enquiry</p><div className="mt-3 grid grid-cols-2 gap-2"><input name="name" required className="field !h-9 !rounded-xl !text-[9px]" placeholder="Name" /><input name="companyName" className="field !h-9 !rounded-xl !text-[9px]" placeholder="Company" /><input name="phone" required className="field !h-9 !rounded-xl !text-[9px]" placeholder="Mobile" /><input name="email" type="email" className="field !h-9 !rounded-xl !text-[9px]" placeholder="Email" /><input name="city" className="field !h-9 !rounded-xl !text-[9px]" placeholder="City" /><input name="productInterest" required className="field !h-9 !rounded-xl !text-[9px]" placeholder="Product interest" /></div><button disabled={busy} className="button-primary mt-3 !px-4 !py-2 !text-[9px]">{busy ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : "Save enquiry"}</button></form>;
}

function getVisitorId() {
  const key = "southaura-assistant-visitor";
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const id = crypto.randomUUID();
  localStorage.setItem(key, id);
  return id;
}
