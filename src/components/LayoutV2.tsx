import { Outlet } from "react-router-dom";
import NavbarV2 from "./NavbarV2";
import FooterV2 from "./FooterV2";
import WhatsAppButton from "./WhatsAppButton";
import Chatbot from "./Chatbot";

export default function LayoutV2() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavbarV2 />
      <main className="flex-1">
        <Outlet />
      </main>
      <FooterV2 />
      <WhatsAppButton />
      <Chatbot />
    </div>
  );
}
