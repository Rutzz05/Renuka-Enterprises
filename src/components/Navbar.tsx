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

const PHONE = "+919823021804";

/**
 * Navbar - Unified navigation with:
 * - Consistent styling across all pages
 * - Active page highlighting
 * - Mobile responsive menu
 * - Auth integration
 */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border shadow-sm">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105 flex-shrink-0">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-heading font-extrabold text-lg shadow-sm">
            R
          </div>
          <span className="font-heading font-bold text-lg text-foreground hidden sm:inline">
            Renuka
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(link.to)
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
          
          {user && (
            <Link
              to={user.role === 'admin' ? '/admin' : '/dashboard'}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(user.role === 'admin' ? '/admin' : '/dashboard')
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {user.role === 'admin' ? 'Admin' : 'Dashboard'}
            </Link>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">
                {user.name}
              </span>
              <Button size="sm" variant="outline" onClick={handleLogout} className="gap-1.5">
                <LogOut className="w-4 h-4" />
                <span className="hidden lg:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login">
                <Button size="sm" variant="outline" className="gap-1.5">
                  <User className="w-4 h-4" />
                  <span className="hidden lg:inline">Login</span>
                </Button>
              </Link>
            </div>
          )}
          
          <a href={`tel:${PHONE}`} className="hidden sm:inline">
            <Button size="sm" className="gap-1.5 bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Phone className="w-4 h-4" />
              <span className="hidden lg:inline">Call</span>
            </Button>
          </a>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-muted text-foreground transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <nav className="md:hidden bg-background border-t border-border px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.to)
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
          
          {user && (
            <Link
              to={user.role === 'admin' ? '/admin' : '/dashboard'}
              onClick={() => setOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive(user.role === 'admin' ? '/admin' : '/dashboard')
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {user.role === 'admin' ? 'Admin Dashboard' : 'Customer Dashboard'}
            </Link>
          )}

          {user ? (
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              Login
            </Link>
          )}

          <a
            href={`tel:${PHONE}`}
            onClick={() => setOpen(false)}
            className="block px-4 py-3 rounded-lg text-sm font-medium text-secondary hover:bg-secondary/10 transition-colors"
          >
            Call +91 98230 21804
          </a>
        </nav>
      )}
    </header>
  );
}

    </header>
  );
}
