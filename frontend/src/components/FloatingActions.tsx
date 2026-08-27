import { useState } from "react";
import { MessageCircle, Zap, X, Calculator, ShieldCheck } from "lucide-react";

interface FloatingActionsProps {
  onOpenEmergency: () => void;
  onOpenLicenses: () => void;
}

export default function FloatingActions({ onOpenEmergency, onOpenLicenses }: FloatingActionsProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const quickWhatsapp = (topic: string) => {
    let text = "";
    if (topic === "emergency") {
      text = "🚨 *EMERGENCY BREAKDOWN:* Mohammad Afjal bhai, our plant/motor broke down and we need urgent technician support.";
    } else if (topic === "quote") {
      text = "Hello Mohammad Afjal bhai, I would like to get an estimated quote for motor rewinding / electrical contracting.";
    } else if (topic === "status") {
      text = "Hello Afjal Electricals, I want to check the repair status of my equipment.";
    } else {
      text = "Hello Mohammad Afjal bhai, I would like to discuss an electrical requirement.";
    }
    window.open(`https://wa.me/919669718100?text=${encodeURIComponent(text)}`, "_blank");
  };



  return (
    <>
      {/* Sticky Bottom Emergency & Quote Bar (Mobile Only) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0E0E0E]/95 backdrop-blur-md border-t border-white/10 p-2 sm:hidden flex items-center gap-2">
        <a
          href="tel:+919669718100"
          className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white font-heading font-black text-xs uppercase py-3 rounded text-center flex items-center justify-center gap-1.5 shadow-lg shadow-red-600/30 pulse-emergency"
          data-testid="mobile-sticky-emergency-btn"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          Emergency: 9669718100
        </a>

        <button
          onClick={() => quickWhatsapp("quote")}
          className="flex-1 bg-emerald-600 text-white font-heading font-black text-xs uppercase py-3 rounded text-center flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/30"
          data-testid="mobile-sticky-whatsapp-btn"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          WhatsApp Quote
        </button>
      </div>

      {/* Floating WhatsApp Hub (Desktop & Tablet) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-3 hidden sm:flex" data-testid="floating-whatsapp-container">
        
        {/* Quick Menu Popover */}
        {menuOpen && (
          <div className="bg-[#141414] border-2 border-emerald-500/50 rounded-lg p-4 shadow-2xl w-72 space-y-3 font-sans text-xs text-white animate-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <strong className="font-heading font-bold text-sm uppercase text-white">
                  Mohammad Afjal (Direct)
                </strong>
              </div>
              <button onClick={() => setMenuOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-zinc-300">
              Welcome! Select a quick option to start a direct WhatsApp conversation:
            </p>

            <div className="space-y-1.5">
              <button
                onClick={() => { setMenuOpen(false); quickWhatsapp("emergency"); }}
                className="w-full text-left p-2 rounded bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-red-400" />
                🚨 Emergency Breakdown Support
              </button>

              <button
                onClick={() => { setMenuOpen(false); quickWhatsapp("quote"); }}
                className="w-full text-left p-2 rounded bg-[#1C1C1C] hover:bg-white/10 text-zinc-200 font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Calculator className="w-3.5 h-3.5 text-amber-400" />
                ⚡ Request Instant Rewinding Quote
              </button>

              <button
                onClick={() => { setMenuOpen(false); quickWhatsapp("status"); }}
                className="w-full text-left p-2 rounded bg-[#1C1C1C] hover:bg-white/10 text-zinc-200 font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                📦 Check Repair Status of Equipment
              </button>
            </div>

            <div className="pt-1 text-[10px] font-mono text-zinc-500 text-center">
              Avg WhatsApp reply time: &lt; 5 mins
            </div>
          </div>
        )}

        {/* Floating Trigger Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="group flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-bold text-sm uppercase px-4 py-3.5 rounded-full shadow-2xl shadow-emerald-600/40 transition-all hover:scale-105 cursor-pointer"
            data-testid="floating-whatsapp-trigger"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>Chat on WhatsApp</span>
          </button>
        </div>

      </div>
    </>
  );
}
