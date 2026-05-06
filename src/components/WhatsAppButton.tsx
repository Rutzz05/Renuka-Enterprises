import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "919823021804";
const MESSAGE = "Hi, I need service from Renuka Enterprises.";

export default function WhatsAppButton() {
  const url = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(MESSAGE)}`;

  const openWhatsApp = () => {
    window.location.href = url;
  };

  return (
    <a
      href={url}
      onClick={(event) => {
        event.preventDefault();
        openWhatsApp();
      }}
      className="fixed bottom-5 right-5 z-[60] flex min-h-12 touch-manipulation items-center gap-2 rounded-full bg-whatsapp px-4 py-3 text-sm font-semibold text-white shadow-lg ring-1 ring-border/10 transition-transform hover:scale-105 hover:shadow-2xl active:translate-y-[1px] focus-visible:ring-2 focus-visible:ring-offset-2 sm:bottom-6 sm:right-6"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-5 h-5" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
