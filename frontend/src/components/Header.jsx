import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, Heart, User, Building2, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { to: "/", label: "Search cars" },
  { to: "/why-caro", label: "Why Kharo" },
  { to: "/driver-guide", label: "How it works" },
  { to: "/operator-guide", label: "For operators" },
  { to: "/for-drivers", label: "For drivers" },
];

export default function Header() {
  const { saved } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-[#FBFAF8]/85 backdrop-blur-xl border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[68px] flex items-center justify-between">
        <Link to="/" className="caro-wordmark text-[30px] text-[#1A2E25]" data-testid="logo-link">
          kharo<span className="text-[#0B6B4F]">.</span>
        </Link>

        <nav className="hidden md:flex items-center gap-9">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} data-testid={`nav-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
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
                <span className="w-7 h-7 rounded-full bg-[#0B6B4F] text-white flex items-center justify-center text-xs font-semibold"><User className="w-4 h-4" /></span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 bg-white shadow-xl border-slate-200 p-1.5">
              <button onClick={() => navigate("/register")} data-testid="menu-driver"
                className="w-full text-left rounded-xl px-3 py-3 hover:bg-[#F1EFE9] transition-colors flex items-start gap-3">
                <User className="w-5 h-5 text-[#0B6B4F] mt-0.5" />
                <span><span className="block font-semibold text-[#1A2E25] text-[14px]">Drivers</span><span className="block text-[12.5px] text-[#7A857F]">Register your interest for launch</span></span>
              </button>
              <button onClick={() => navigate("/list-your-fleet")} data-testid="menu-operator"
                className="w-full text-left rounded-xl px-3 py-3 hover:bg-[#F1EFE9] transition-colors flex items-start gap-3">
                <Building2 className="w-5 h-5 text-[#0B6B4F] mt-0.5" />
                <span><span className="block font-semibold text-[#1A2E25] text-[14px]">Rental operators</span><span className="block text-[12.5px] text-[#7A857F]">List your fleet interest</span></span>
              </button>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/help")} className="cursor-pointer py-2.5 rounded-lg text-[#4A564F]">Get help</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/legal")} className="cursor-pointer py-2.5 rounded-lg text-[#4A564F]">Legal and privacy</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="md:hidden p-2" data-testid="mobile-menu-btn"><Menu className="w-6 h-6" /></button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-white overflow-y-auto">
              <div className="caro-wordmark text-3xl text-[#1A2E25] mt-2 mb-6">kharo<span className="text-[#0B6B4F]">.</span></div>
              <div className="flex flex-col gap-1">
                {navLinks.map((l) => (<Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="py-3 px-2 text-base font-medium text-[#1A2E25] hover:bg-[#F1EFE9] rounded-lg">{l.label}</Link>))}
                <div className="border-t border-slate-200 my-3" />
                <Link to="/register" onClick={() => setOpen(false)} className="py-3 px-2 font-semibold text-[#0B6B4F] flex items-center gap-2">Drivers: register your interest <ArrowRight className="w-4 h-4" /></Link>
                <Link to="/list-your-fleet" onClick={() => setOpen(false)} className="py-3 px-2 font-semibold text-[#0B6B4F] flex items-center gap-2">Operators: list your fleet <ArrowRight className="w-4 h-4" /></Link>
                <div className="border-t border-slate-200 my-3" />
                <Link to="/why-caro" onClick={() => setOpen(false)} className="py-3 px-2 text-[#4A564F]">Why choose Kharo</Link>
                <Link to="/help" onClick={() => setOpen(false)} className="py-3 px-2 text-[#4A564F]">Get help</Link>
                <Link to="/legal" onClick={() => setOpen(false)} className="py-3 px-2 text-[#4A564F]">Legal and privacy</Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
