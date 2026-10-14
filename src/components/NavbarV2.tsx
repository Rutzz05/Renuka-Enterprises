import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Menu, Phone, Shield, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const PHONE = "+919823021804";

const links = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Products", to: "/products" },
  { label: "Contact", to: "/contact" },
];

export default function NavbarV2() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  const handleMobileLogin = () => {
    setOpen(false);
    navigate("/login");
  };

  const handleCall = () => {
    window.location.href = `tel:${PHONE}`;
  };

  const dashboardLink = user?.role === "admin" ? "/admin" : "/dashboard";

  return (
    <header className="home-nav sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
      <div className="container flex h-20 items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-3" aria-label="Renuka Enterprises home">
          <div className="home-nav-brand-mark" aria-hidden="true">
            RE
          </div>
          <div className="leading-tight">
            <p className="home-nav-brand-name">Renuka Enterprises</p>
            <p className="home-nav-brand-sub">HOME & POWER</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              aria-current={pathname === link.to ? "page" : undefined}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                pathname === link.to ? "home-nav-active" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <Link
              to={dashboardLink}
              aria-current={pathname === dashboardLink ? "page" : undefined}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                pathname === dashboardLink ? "home-nav-active" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {user.role === "admin" ? "Admin" : "Dashboard"}
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <>
              <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                Welcome, {user.name}
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button variant="outline">
                <User className="mr-2 h-4 w-4" />
                Login
              </Button>
            </Link>
          )}

          <Button asChild className="home-nav-call rounded-full">
            <a href={`tel:${PHONE}`} onClick={handleCall} aria-label="Call Renuka Enterprises">
              <Phone className="mr-2 h-4 w-4" />
              Call now
            </a>
          </Button>
        </div>

        <button className="rounded-xl p-2 text-slate-700 lg:hidden" onClick={() => setOpen((value) => !value)} aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="mobile-navigation">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div id="mobile-navigation" className="border-t border-slate-200 bg-white lg:hidden">
          <div className="container py-4">
            <div className="grid gap-2">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={`rounded-2xl px-4 py-3 text-sm font-medium ${
                    pathname === link.to ? "bg-primary text-white" : "bg-slate-50 text-slate-700"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user && (
                <Link
                  to={dashboardLink}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
                >
                  {user.role === "admin" ? (
                    <span className="inline-flex items-center gap-2"><Shield className="h-4 w-4" /> Admin dashboard</span>
                  ) : (
                    "Customer dashboard"
                  )}
                </Link>
              )}
              {user ? (
                <button onClick={handleLogout} className="rounded-2xl bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700">
                  Logout
                </button>
              ) : (
                <button onClick={handleMobileLogin} className="rounded-2xl bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700">
                  Login
                </button>
              )}
              <a 
                href={`tel:+919823021804`}
                className="rounded-2xl bg-primary px-4 py-3 text-left text-sm font-medium text-white flex items-center gap-2 transition-transform active:scale-95"
              >
                <Phone className="h-4 w-4" />
                Call now
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
