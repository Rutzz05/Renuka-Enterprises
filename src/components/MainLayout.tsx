import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
import Chatbot from "./Chatbot";

/**
 * MainLayout - Unified layout for all pages
 * Provides consistent Navbar, Footer, and global components
 * Uses LayoutV2 pattern for reliability across the app
 */
export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
      <Chatbot />
    </div>
  );
}
