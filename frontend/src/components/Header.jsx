import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, Heart, LogOut, LayoutDashboard, User, Building2, HelpCircle, Sparkles, Calculator, Scale, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { to: "/", label: "Search cars" },
  { to: "/why-caro", label: "Why Caro" },
  { to: "/driver-guide", label: "How it works" },
  { to: "/list-your-fleet", label: "List your fleet" },
];

export default function Header() {
  const { user, logout, saved } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const portalLink = user && user.role === "operator" ? "/operator-dashboard"
    : user && user.role === "admin" ? "/admin" : "/portal";

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-slate-200/70">
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
          <button onClick={() => navigate("/saved")} className="hidden sm:inline-flex items-center gap-1.5 text-sm text-[#475569] hover:text-[#047857] transition-colors" data-testid="saved-count">
            <Heart className="w-4 h-4" /> {saved.length}
          </button>

          {/* Account / Menu dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button data-testid="account-menu-btn"
                className="hidden md:inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white pl-3 pr-2 py-1.5 hover:shadow-md transition-shadow">
                <Menu className="w-4 h-4 text-[#475569]" />
                <span className="w-7 h-7 rounded-full bg-[#047857] text-white flex items-center justify-center text-xs font-semibold">
                  {user ? (user.name ? user.name[0].toUpperCase() : "U") : <User className="w-4 h-4" />}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-white shadow-xl border-slate-200">
              {user ? (
                <>
                  <DropdownMenuLabel className="text-xs text-[#64748B] font-normal">Signed in as {user.email}</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => navigate(portalLink)} data-testid="menu-dashboard" className="cursor-pointer py-2.5"><LayoutDashboard className="w-4 h-4 mr-2 text-[#047857]" /> My dashboard</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/saved")} className="cursor-pointer py-2.5"><Heart className="w-4 h-4 mr-2 text-[#047857]" /> Saved cars</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} data-testid="menu-logout" className="cursor-pointer py-2.5"><LogOut className="w-4 h-4 mr-2" /> Sign out</DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => navigate("/register")} data-testid="menu-signup-driver" className="cursor-pointer py-2.5 font-semibold"><User className="w-4 h-4 mr-2 text-[#047857]" /> Sign up as a driver</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/login")} data-testid="menu-login" className="cursor-pointer py-2.5"><LayoutDashboard className="w-4 h-4 mr-2 text-[#047857]" /> Log in as a customer</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/list-your-fleet")} data-testid="menu-operator" className="cursor-pointer py-2.5"><Building2 className="w-4 h-4 mr-2 text-[#047857]" /> Log in / register as operator</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/why-caro")} className="cursor-pointer py-2.5"><Sparkles className="w-4 h-4 mr-2 text-[#64748B]" /> Why choose Caro</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/calculator")} className="cursor-pointer py-2.5"><Calculator className="w-4 h-4 mr-2 text-[#64748B]" /> Cost calculator</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/help")} className="cursor-pointer py-2.5"><HelpCircle className="w-4 h-4 mr-2 text-[#64748B]" /> Get help</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/legal")} className="cursor-pointer py-2.5"><Scale className="w-4 h-4 mr-2 text-[#64748B]" /> Legal & privacy</DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {!user && (
            <Button onClick={() => navigate("/register")} data-testid="header-signup-btn"
              className="hidden md:inline-flex rounded-full bg-[#047857] hover:bg-[#065F46] text-white">
              Get started
            </Button>
          )}

          {/* Mobile */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="md:hidden p-2" data-testid="mobile-menu-btn"><Menu className="w-6 h-6" /></button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-white overflow-y-auto">
              <div className="caro-wordmark text-3xl text-[#1A2E25] mt-2 mb-6">caro<span className="text-[#047857]">.</span></div>
              <div className="flex flex-col gap-1">
                {navLinks.map((l) => (
                  <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="py-3 px-2 text-base font-medium text-[#1A2E25] hover:bg-[#F3F1EC] rounded-lg">{l.label}</Link>
                ))}
                <div className="border-t border-slate-200 my-3" />
                {user ? (
                  <>
                    <Link to={portalLink} onClick={() => setOpen(false)} className="py-3 px-2 font-medium flex items-center gap-2"><LayoutDashboard className="w-4 h-4" /> My dashboard</Link>
                    <Link to="/saved" onClick={() => setOpen(false)} className="py-3 px-2 font-medium flex items-center gap-2"><Heart className="w-4 h-4" /> Saved cars</Link>
                    <button onClick={() => { logout(); setOpen(false); }} className="py-3 px-2 text-left font-medium flex items-center gap-2"><LogOut className="w-4 h-4" /> Sign out</button>
                  </>
                ) : (
                  <>
                    <Link to="/register" onClick={() => setOpen(false)} className="py-3 px-2 font-semibold text-[#047857]">Sign up as a driver</Link>
                    <Link to="/login" onClick={() => setOpen(false)} className="py-3 px-2 font-medium">Log in as a customer</Link>
                    <Link to="/list-your-fleet" onClick={() => setOpen(false)} className="py-3 px-2 font-medium">Register as operator</Link>
                    <div className="border-t border-slate-200 my-3" />
                    <Link to="/why-caro" onClick={() => setOpen(false)} className="py-3 px-2 text-[#475569]">Why choose Caro</Link>
                    <Link to="/calculator" onClick={() => setOpen(false)} className="py-3 px-2 text-[#475569]">Cost calculator</Link>
                    <Link to="/help" onClick={() => setOpen(false)} className="py-3 px-2 text-[#475569]">Get help</Link>
                    <Link to="/legal" onClick={() => setOpen(false)} className="py-3 px-2 text-[#475569]">Legal & privacy</Link>
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
