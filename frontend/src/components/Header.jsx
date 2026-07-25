import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, Heart, LogOut, LayoutDashboard, User, Building2, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { to: "/", label: "Search cars" },
  { to: "/why-caro", label: "Why Caro" },
  { to: "/driver-guide", label: "How it works" },
  { to: "/list-your-fleet", label: "For operators" },
];

export default function Header() {
  const { user, logout, saved } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const portalLink = user && user.role === "operator" ? "/operator-dashboard"
    : user && user.role === "admin" ? "/admin" : "/portal";

  return (
    <header className="sticky top-0 z-50 bg-[#FBFAF8]/85 backdrop-blur-xl border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[68px] flex items-center justify-between">
        <Link to="/" className="caro-wordmark text-[30px] text-[#1A2E25]" data-testid="logo-link">
          caro<span className="text-[#0B6B4F]">.</span>
        </Link>

        <nav className="hidden md:flex items-center gap-9">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} data-testid={`nav-${l.label.split(" ")[0].toLowerCase()}`}
              className="text-[14px] font-medium text-[#4A564F] hover:text-[#0B6B4F] transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <button onClick={() => navigate("/saved")} className="hidden sm:inline-flex items-center gap-1.5 text-[14px] text-[#4A564F] hover:text-[#0B6B4F] transition-colors" data-testid="saved-count">
            <Heart className="w-[18px] h-[18px]" /> {saved.length > 0 && saved.length}
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button data-testid="account-menu-btn"
                className="hidden md:inline-flex items-center gap-2.5 rounded-full border border-slate-300 bg-white pl-3.5 pr-2 py-1.5 hover:shadow-md transition-shadow">
                <Menu className="w-4 h-4 text-[#4A564F]" />
                <span className="w-7 h-7 rounded-full bg-[#0B6B4F] text-white flex items-center justify-center text-xs font-semibold">
                  {user ? (user.name ? user.name[0].toUpperCase() : "U") : <User className="w-4 h-4" />}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 bg-white shadow-xl border-slate-200 p-1.5">
              {user ? (
                <>
                  <DropdownMenuLabel className="text-xs text-[#7A857F] font-normal px-2">Signed in as {user.email}</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => navigate(portalLink)} data-testid="menu-dashboard" className="cursor-pointer py-2.5 rounded-lg"><LayoutDashboard className="w-4 h-4 mr-2.5 text-[#0B6B4F]" /> My dashboard</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/saved")} className="cursor-pointer py-2.5 rounded-lg"><Heart className="w-4 h-4 mr-2.5 text-[#0B6B4F]" /> Saved cars</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} data-testid="menu-logout" className="cursor-pointer py-2.5 rounded-lg"><LogOut className="w-4 h-4 mr-2.5" /> Sign out</DropdownMenuItem>
                </>
              ) : (
                <>
                  <button onClick={() => navigate("/login")} data-testid="menu-driver"
                    className="w-full text-left rounded-xl px-3 py-3 hover:bg-[#F1EFE9] transition-colors flex items-start gap-3">
                    <User className="w-5 h-5 text-[#0B6B4F] mt-0.5" />
                    <span><span className="block font-semibold text-[#1A2E25] text-[14px]">Drivers</span><span className="block text-[12.5px] text-[#7A857F]">Log in or create your account</span></span>
                  </button>
                  <button onClick={() => navigate("/operator-login")} data-testid="menu-operator"
                    className="w-full text-left rounded-xl px-3 py-3 hover:bg-[#F1EFE9] transition-colors flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-[#0B6B4F] mt-0.5" />
                    <span><span className="block font-semibold text-[#1A2E25] text-[14px]">Rental operators</span><span className="block text-[12.5px] text-[#7A857F]">List your fleet or sign in</span></span>
                  </button>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/calculator")} className="cursor-pointer py-2.5 rounded-lg text-[#4A564F]">Cost calculator</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/help")} className="cursor-pointer py-2.5 rounded-lg text-[#4A564F]">Get help</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/legal")} className="cursor-pointer py-2.5 rounded-lg text-[#4A564F]">Legal and privacy</DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="md:hidden p-2" data-testid="mobile-menu-btn"><Menu className="w-6 h-6" /></button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-white overflow-y-auto">
              <div className="caro-wordmark text-3xl text-[#1A2E25] mt-2 mb-6">caro<span className="text-[#0B6B4F]">.</span></div>
              <div className="flex flex-col gap-1">
                {navLinks.map((l) => (<Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="py-3 px-2 text-base font-medium text-[#1A2E25] hover:bg-[#F1EFE9] rounded-lg">{l.label}</Link>))}
                <div className="border-t border-slate-200 my-3" />
                {user ? (
                  <>
                    <Link to={portalLink} onClick={() => setOpen(false)} className="py-3 px-2 font-medium flex items-center gap-2"><LayoutDashboard className="w-4 h-4" /> My dashboard</Link>
                    <Link to="/saved" onClick={() => setOpen(false)} className="py-3 px-2 font-medium flex items-center gap-2"><Heart className="w-4 h-4" /> Saved cars</Link>
                    <button onClick={() => { logout(); setOpen(false); }} className="py-3 px-2 text-left font-medium flex items-center gap-2"><LogOut className="w-4 h-4" /> Sign out</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setOpen(false)} className="py-3 px-2 font-semibold text-[#0B6B4F] flex items-center gap-2">Drivers: log in or sign up <ArrowRight className="w-4 h-4" /></Link>
                    <Link to="/list-your-fleet" onClick={() => setOpen(false)} className="py-3 px-2 font-semibold text-[#0B6B4F] flex items-center gap-2">Operators: list your fleet <ArrowRight className="w-4 h-4" /></Link>
                    <div className="border-t border-slate-200 my-3" />
                    <Link to="/why-caro" onClick={() => setOpen(false)} className="py-3 px-2 text-[#4A564F]">Why choose Caro</Link>
                    <Link to="/calculator" onClick={() => setOpen(false)} className="py-3 px-2 text-[#4A564F]">Cost calculator</Link>
                    <Link to="/help" onClick={() => setOpen(false)} className="py-3 px-2 text-[#4A564F]">Get help</Link>
                    <Link to="/legal" onClick={() => setOpen(false)} className="py-3 px-2 text-[#4A564F]">Legal and privacy</Link>
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
