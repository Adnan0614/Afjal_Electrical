import { useState } from "react";
import { Zap, ShieldCheck, Phone, Search, Menu, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NavbarProps {
  onOpenEmergency: () => void;
  onOpenTracker: () => void;
  onOpenBrochure: () => void;
  onOpenLicenses: () => void;
}

export default function Navbar({
  onOpenEmergency,
  onOpenTracker,
  onOpenBrochure,
  onOpenLicenses,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/10" data-testid="navbar-header">
      {/* Top micro-bar for licenses */}
      <div className="bg-[#121212] border-b border-white/5 py-1 px-4 text-xs font-mono text-zinc-400 hidden md:flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Workshop Open: Tilda Neora, Raipur
          </span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-400">Class-B Lic: <strong className="text-amber-400">08/626/B</strong></span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-400">Wireman Lic: <strong className="text-amber-400">NR/10464</strong></span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-400">GSTIN: <strong className="text-zinc-300">22BDBPM9804K2ZH</strong></span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenLicenses}
            className="hover:text-amber-400 text-zinc-400 transition-colors cursor-pointer flex items-center gap-1"
            data-testid="verify-credentials-topbar"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
            Verify Gov Licenses
          </button>
          <span className="text-zinc-600">|</span>
          <a href="tel:+919669718100" className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1">
            <Phone className="w-3 h-3" />
            +91 9669718100
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand */}
        <a href="#hero" className="flex items-center gap-3 group" data-testid="brand-logo">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-sm bg-gradient-to-br from-amber-500 to-[#D95B18] p-0.5 shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-[#0A0A0A] rounded-[2px] flex items-center justify-center group-hover:bg-amber-950/40 transition-colors">
              <Zap className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-black text-xl sm:text-2xl tracking-tight text-white uppercase group-hover:text-amber-400 transition-colors">
                Afjal Electricals
              </span>
              <Badge variant="outline" className="text-[10px] uppercase font-mono border-amber-500/40 text-amber-400 bg-amber-500/10 py-0 px-1.5 hidden sm:inline-flex">
                Est. 2003
              </Badge>
            </div>
            <p className="text-[11px] font-sans text-zinc-400 tracking-wide">
              Motor Rewinding & Class-B Contractor • Tilda Neora
            </p>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6 font-medium text-sm text-zinc-300">
          <button onClick={() => scrollToSection("services")} className="hover:text-amber-400 transition-colors cursor-pointer" data-testid="nav-services">
            Services
          </button>
          <button onClick={() => scrollToSection("estimator")} className="hover:text-amber-400 transition-colors cursor-pointer" data-testid="nav-estimator">
            Cost Estimator
          </button>
          <button onClick={() => scrollToSection("roi-calculator")} className="hover:text-amber-400 transition-colors cursor-pointer" data-testid="nav-roi">
            Rewind vs Buy ROI
          </button>
          <button onClick={() => scrollToSection("before-after")} className="hover:text-amber-400 transition-colors cursor-pointer" data-testid="nav-before-after">
            Craftsmanship
          </button>
          <button onClick={() => scrollToSection("coverage")} className="hover:text-amber-400 transition-colors cursor-pointer" data-testid="nav-coverage">
            Coverage Area
          </button>
          <button onClick={() => scrollToSection("reviews")} className="hover:text-amber-400 transition-colors cursor-pointer" data-testid="nav-reviews">
            Reviews
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenTracker}
            className="border-white/20 text-zinc-200 hover:text-white hover:border-amber-400/50 bg-[#141414] font-mono text-xs cursor-pointer"
            data-testid="navbar-track-job-button"
          >
            <Search className="w-3.5 h-3.5 text-amber-400 mr-1.5" />
            Track Repair
          </Button>

          <Button
            size="sm"
            onClick={onOpenEmergency}
            className="bg-red-600 hover:bg-red-700 text-white font-heading tracking-wide uppercase text-sm px-3.5 shadow-lg shadow-red-600/30 pulse-emergency cursor-pointer"
            data-testid="navbar-emergency-sos-button"
          >
            <Zap className="w-3.5 h-3.5 fill-current mr-1" />
            24/7 Breakdown SOS
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <Button
            size="sm"
            onClick={onOpenEmergency}
            className="bg-red-600 hover:bg-red-700 text-white font-heading text-xs px-2.5 py-1 pulse-emergency"
            data-testid="mobile-emergency-button"
          >
            SOS
          </Button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-zinc-300 hover:text-white focus:outline-none"
            data-testid="mobile-menu-toggle"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0F0F0F] border-b border-white/10 px-4 py-6 space-y-4 font-sans animate-in slide-in-from-top-4 duration-200" data-testid="mobile-menu">
          <div className="grid grid-cols-2 gap-2 text-sm font-medium">
            <button
              onClick={() => scrollToSection("services")}
              className="text-left p-2.5 rounded bg-white/5 hover:bg-amber-500/10 hover:text-amber-400"
            >
              🛠️ Our Services
            </button>
            <button
              onClick={() => scrollToSection("estimator")}
              className="text-left p-2.5 rounded bg-white/5 hover:bg-amber-500/10 hover:text-amber-400"
            >
              ⚡ Cost Estimator
            </button>
            <button
              onClick={() => scrollToSection("roi-calculator")}
              className="text-left p-2.5 rounded bg-white/5 hover:bg-amber-500/10 hover:text-amber-400"
            >
              📊 Rewind vs Buy ROI
            </button>
            <button
              onClick={() => scrollToSection("before-after")}
              className="text-left p-2.5 rounded bg-white/5 hover:bg-amber-500/10 hover:text-amber-400"
            >
              🔍 Motor Craftsmanship
            </button>
            <button
              onClick={() => scrollToSection("coverage")}
              className="text-left p-2.5 rounded bg-white/5 hover:bg-amber-500/10 hover:text-amber-400"
            >
              📍 Coverage & Freight
            </button>
            <button
              onClick={() => scrollToSection("reviews")}
              className="text-left p-2.5 rounded bg-white/5 hover:bg-amber-500/10 hover:text-amber-400"
            >
              ⭐ 250+ Reviews
            </button>
          </div>

          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <Button
              onClick={() => { setMobileMenuOpen(false); onOpenTracker(); }}
              variant="outline"
              className="w-full justify-center font-mono border-white/20 bg-zinc-900 text-zinc-200"
              data-testid="mobile-track-job-btn"
            >
              <Search className="w-4 h-4 text-amber-400 mr-2" />
              Track Equipment Repair Status
            </Button>

            <Button
              onClick={() => { setMobileMenuOpen(false); onOpenBrochure(); }}
              variant="outline"
              className="w-full justify-center border-white/10 text-zinc-300"
              data-testid="mobile-brochure-btn"
            >
              <FileText className="w-4 h-4 text-zinc-400 mr-2" />
              Company Profile & Spec Sheet
            </Button>

            <Button
              onClick={() => { setMobileMenuOpen(false); onOpenLicenses(); }}
              variant="outline"
              className="w-full justify-center border-amber-500/30 text-amber-400"
              data-testid="mobile-licenses-btn"
            >
              <ShieldCheck className="w-4 h-4 mr-2" />
              Verified Govt Licenses & GSTIN
            </Button>

            <a
              href="tel:+919669718100"
              className="w-full bg-[#FF7B00] hover:bg-[#E66A00] text-black font-heading font-black text-center py-2.5 rounded uppercase tracking-wider flex items-center justify-center gap-2 text-base mt-2"
              data-testid="mobile-call-hotline-btn"
            >
              <Phone className="w-4 h-4 fill-current" />
              Direct Workshop Call: 9669718100
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
