"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import Header from "@/components/store/Header";
import Footer from "@/components/store/Footer";
import WhatsAppButton from "@/components/store/WhatsAppButton";
import { Toaster } from "sonner";

export default function StoreLayout({ children }) {
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const res = await fetch("/api/store/settings");
      if (!res.ok) throw new Error("Failed to load settings");
      return res.json();
    },
  });

  useEffect(() => {
    if (settings?.primary_color) {
      document.documentElement.style.setProperty(
        "--primary",
        settings.primary_color,
      );
    }
  }, [settings]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-black font-inter">
      <Header settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      <WhatsAppButton settings={settings} />
      <Toaster position="top-center" />
      <style jsx global>{`
        :root {
          --primary: ${settings?.primary_color || "#000000"};
        }
        .bg-primary { background-color: var(--primary); }
        .text-primary { color: var(--primary); }
        .border-primary { border-color: var(--primary); }
        .ring-primary { --tw-ring-color: var(--primary); }
      `}</style>
    </div>
  );
}
