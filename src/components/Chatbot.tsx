import React, { useState } from "react";
import { MessageSquare, X, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleBookNow = () => {
    setOpen(false);
    // navigate to contact page and scroll to booking form (ContactPage contains `#service-booking-form`)
    navigate("/contact#booking");
    setTimeout(() => {
      document.getElementById("service-booking-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 text-sm">
      {/* Chat window */}
      <div className={`mb-3 w-80 card-elevated rounded-lg bg-card shadow-xl ring-1 ring-border/10 transition-all ${open ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none translate-y-2"}`}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-muted">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold">Renuka Assistant</p>
              <p className="text-xs text-muted-foreground">Quick help & bookings</p>
            </div>
          </div>
          <button aria-label="Close chat" onClick={() => setOpen(false)} className="rounded-md p-2 hover:bg-accent/50">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-3 rounded-md bg-muted p-3 text-xs">
            Hi! I can help you book a service or answer quick questions. What would you like to do?
          </div>

          <div className="flex flex-col gap-2">
            <Button variant="outline" onClick={handleBookNow} className="justify-start">
              Book a Service
            </Button>
            <Button variant="ghost" onClick={() => { window.open('https://wa.me/919876543210', '_blank'); }} className="justify-start">
              Chat on WhatsApp
            </Button>
            <Button variant="ghost" onClick={() => { window.location.href = '/contact'; }} className="justify-start">
              Contact Page
            </Button>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <input placeholder="Type a short message (demo)" className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none" />
            <button className="rounded-md bg-primary px-3 py-2 text-white">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating button */}
      <button
        onClick={() => setOpen((s) => !s)}
        className="flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-2xl active:translate-y-[1px] hover:scale-105 transition-transform focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring"
        aria-label="Open chat assistant"
      >
        <MessageSquare className="w-5 h-5" />
        <span className="hidden sm:inline">Help</span>
      </button>
    </div>
  );
}
