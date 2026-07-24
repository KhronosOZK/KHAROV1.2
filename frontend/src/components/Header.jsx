import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, Heart, User, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { to: "/", label: "Search" },
  { to: "/driver-guide", label: "How renting works" },
  { to: "/list-your-fleet", label: "List your fleet" },
];

export default function Header() {
  const { user, logout, saved } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const portalLink = user && user.role === "operator" ? "/operator-dashboard"
    : user && user.role === "admin" ? "/admin" : "/portal";

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="caro-wordmark text-3xl text-[#1A2E25]" data-testid="logo-link">
          caro<span className="text-[#047857]">.</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} data-testid={`nav-${l.label.split(" ")[0].toLowerCase()}`}
              className="text-sm font-medium text-[#475569] hover:text-[#047857] transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden sm:inline-flex items-center gap-1 text-sm text-[#475569]" data-testid="saved-count">
            <Heart className="w-4 h-4" /> {saved.length}
          </span>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button data-testid="account-menu-btn"
                  className="w-9 h-9 rounded-full bg-[#047857] text-white flex items-center justify-center font-semibold text-sm">
                  {user.name ? user.name[0].toUpperCase() : "U"}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate(portalLink)} data-testid="menu-dashboard">
                  <LayoutDashboard className="w-4 h-4 mr-2" /> My account
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} data-testid="menu-logout">
                  <LogOut className="w-4 h-4 mr-2" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => navigate("/register")} data-testid="header-signup-btn"
              className="hidden sm:inline-flex rounded-full bg-[#047857] hover:bg-[#065F46] text-white">
              Sign up
            </Button>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="md:hidden p-2" data-testid="mobile-menu-btn"><Menu className="w-6 h-6" /></button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-1 mt-8">
                {navLinks.map((l) => (
                  <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
                    className="py-3 px-2 text-base font-medium text-[#1A2E25] hover:bg-[#F3F1EC] rounded-lg">
                    {l.label}
                  </Link>
                ))}
                <div className="border-t border-slate-200 my-3" />
                {user ? (
                  <>
                    <Link to={portalLink} onClick={() => setOpen(false)} className="py-3 px-2 font-medium flex items-center gap-2"><User className="w-4 h-4" /> My account</Link>
                    <button onClick={() => { logout(); setOpen(false); }} className="py-3 px-2 text-left font-medium flex items-center gap-2"><LogOut className="w-4 h-4" /> Sign out</button>
                  </>
                ) : (
                  <>
                    <Link to="/register" onClick={() => setOpen(false)} className="py-3 px-2 font-medium">Sign up</Link>
                    <Link to="/login" onClick={() => setOpen(false)} className="py-3 px-2 font-medium">Sign in</Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
