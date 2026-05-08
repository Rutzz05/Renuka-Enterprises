import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Menu, Phone, Shield, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const PHONE = "9823021804";

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

  const dashboardLink = user?.role === "admin" ? "/admin" : "/dashboard";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
      <div className="container flex h-20 items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-blue-700 to-emerald-600 text-lg font-black text-white shadow-md ring-1 ring-slate-900/10">
            R
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary/70">Renuka</p>
            <p className="text-base font-semibold text-slate-900">Enterprises</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                pathname === link.to ? "bg-primary text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <Link
              to={dashboardLink}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                pathname === dashboardLink ? "bg-primary text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
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

          <Button asChild className="rounded-full">
            <a href={`tel:${PHONE}`} aria-label="Call Renuka Enterprises">
              <Phone className="mr-2 h-4 w-4" />
              Call now
            </a>
          </Button>
        </div>

        <button className="rounded-xl p-2 text-slate-700 lg:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
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
                href={`tel:${PHONE}`}
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white"
                aria-label="Call Renuka Enterprises"
              >
                <Phone className="h-4 w-4" />
                Call +91 98230 21804
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
