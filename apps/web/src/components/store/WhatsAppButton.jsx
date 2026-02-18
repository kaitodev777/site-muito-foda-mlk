"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppButton({ settings }) {
  if (!settings?.whatsapp_number) return null;

  const message = encodeURIComponent(
    "Olá! Estou vindo do site e gostaria de mais informações.",
  );
  const whatsappUrl = `https://wa.me/${settings.whatsapp_number.replace(/\D/g, "")}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[90] bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all duration-200"
    >
      <MessageCircle size={28} />
    </a>
  );
}
