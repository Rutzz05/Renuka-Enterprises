import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Phone, Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Products", to: "/products" },
  { label: "Contact", to: "/contact" },
];

const PHONE = "+919876543210";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b shadow-sm">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 transition-smooth hover:scale-[1.02]">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-heading font-extrabold text-lg shadow-sm">
            R
          </div>
          <span className="font-heading font-bold text-lg text-foreground hidden sm:inline">
            Renuka Enterprises
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-smooth ${
                pathname === l.to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {l.label}
            </Link>
          ))}
          {user && (
            <Link
              to={user.role === 'admin' ? '/admin' : '/dashboard'}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-smooth ${
                pathname === (user.role === 'admin' ? '/admin' : '/dashboard')
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {user.role === 'admin' ? 'Admin' : 'Dashboard'}
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">Welcome, {user.name}</span>
              <Button size="sm" variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login">
                <Button size="sm" variant="outline">
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
            </div>
          )}
          <a href={`tel:${PHONE}`}>
            <Button size="sm" className="gap-1.5 bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">Call for Service</span>
            </Button>
          </a>
          <button
            className="md:hidden p-2 rounded-md hover:bg-muted text-foreground"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="md:hidden border-t bg-card pb-3">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`block px-6 py-3 text-sm font-medium transition-colors ${
                pathname === l.to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
          {user && (
            <Link
              to={user.role === 'admin' ? '/admin' : '/dashboard'}
              onClick={() => setOpen(false)}
              className={`block px-6 py-3 text-sm font-medium transition-colors ${
                pathname === (user.role === 'admin' ? '/admin' : '/dashboard')
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {user.role === 'admin' ? 'Admin Dashboard' : 'Customer Dashboard'}
            </Link>
          )}
          {user ? (
            <button
              onClick={handleLogout}
              className="block w-full text-left px-6 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="block px-6 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Login
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
