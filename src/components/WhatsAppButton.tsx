import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "919823021804";
const MESSAGE = "Hi, I need service from Renuka Enterprises.";

export default function WhatsAppButton() {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGE)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-whatsapp px-4 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-2xl active:translate-y-[1px] hover:scale-105 transition-transform ring-1 ring-border/10 focus-visible:ring-2 focus-visible:ring-offset-2"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-5 h-5" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
