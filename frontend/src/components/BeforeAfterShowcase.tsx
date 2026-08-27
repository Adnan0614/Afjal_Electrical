import { useState } from "react";
import { Sparkles, ShieldCheck, Check, AlertTriangle, ArrowLeftRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function BeforeAfterShowcase() {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [activeTab, setActiveTab] = useState<"slider" | "breakdown">("slider");

  // High quality images from Unsplash / Pexels matching design guidelines
  const beforeImage = "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80"; // Industrial machine breakdown / rusty stator
  const afterImage = "https://images.unsplash.com/photo-1692719094491-2746e82a8595?auto=format&fit=crop&w=1200&q=80"; // Pristine copper spiral core / rewound motor

  const comparisons = [
    {
      title: "Winding Copper Purity & Enamel",
      before: "Burnt, blackened enamel, inter-turn shorts, and localized overheating.",
      after: "100% Electrolytic Dual-Coated Copper Wire (Class-H 180°C) with zero hot spots.",
    },
    {
      title: "Slot & Phase Insulation",
      before: "Brittle, charred paper leading to 0.1 MΩ phase-to-ground leakage.",
      after: "Multi-layered Nomex® & Mylar Class-H slot lining testing >250 MΩ on 5000V Megger.",
    },
    {
      title: "Varnish Impregnation & Curing",
      before: "Air bubbles, dry flaking varnish, moisture ingress.",
      after: "Double-dipped vacuum pressure impregnation & 8-hour oven baking at 135°C.",
    },
    {
      title: "Rotor Dynamics & Bearings",
      before: "Worn race bearings, shaft axial play, vibration >4.5 mm/s.",
      after: "New SKF/NBC C3 deep groove bearings, dynamic rotor balancing <1.15 mm/s RMS.",
    },
  ];

  return (
    <section id="before-after" className="py-16 sm:py-24 bg-[#0D0D0D] border-b border-white/10" data-testid="before-after-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-left max-w-3xl mb-12">
          <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 font-mono text-xs uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            Rewinding Craftsmanship
          </Badge>
          <h2 className="font-heading font-black text-3xl sm:text-5xl uppercase text-white tracking-tight">
            Before & After: The Afjal Engineering Standard
          </h2>
          <p className="text-zinc-300 text-sm sm:text-base font-sans mt-2">
            Drag the interactive slider below to see the transformation from a severely damaged, burnt industrial stator to a precision rewound, high-dielectric motor ready for heavy industrial duty.
          </p>
        </div>

        {/* View Switcher for easy mobile access */}
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab("slider")}
            className={`font-mono text-xs px-4 py-2 rounded border transition-all cursor-pointer ${
              activeTab === "slider"
                ? "bg-[#FF7B00] text-black font-bold border-[#FF7B00]"
                : "bg-[#181818] border-white/10 text-zinc-300"
            }`}
            data-testid="showcase-tab-slider"
          >
            Interactive Split Viewer
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("breakdown")}
            className={`font-mono text-xs px-4 py-2 rounded border transition-all cursor-pointer ${
              activeTab === "breakdown"
                ? "bg-[#FF7B00] text-black font-bold border-[#FF7B00]"
                : "bg-[#181818] border-white/10 text-zinc-300"
            }`}
            data-testid="showcase-tab-breakdown"
          >
            Detailed Technical Specs
          </button>
        </div>

        {/* Interactive Split Image Slider */}
        {activeTab === "slider" ? (
          <div className="relative w-full h-[380px] sm:h-[500px] rounded-lg overflow-hidden border-2 border-white/15 select-none electric-glow" data-testid="before-after-slider-container">
            
            {/* After Image (Background) */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${afterImage})` }}
            >
              <div className="absolute top-4 right-4 bg-emerald-950/80 border border-emerald-500/50 backdrop-blur-md px-3.5 py-1.5 rounded-sm font-mono text-xs text-emerald-300 flex items-center gap-1.5 shadow-lg">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                AFTER: 100% Pure Copper Rewound (250 MΩ)
              </div>
            </div>

            {/* Before Image (Clipped Overlay) */}
            <div
              className="absolute inset-0 bg-cover bg-center overflow-hidden"
              style={{
                backgroundImage: `url(${beforeImage})`,
                width: `${sliderPosition}%`,
              }}
            >
              {/* Grayscale / Dark burn tint for before */}
              <div className="absolute inset-0 bg-black/40 backdrop-grayscale" />
              <div className="absolute top-4 left-4 bg-red-950/80 border border-red-500/50 backdrop-blur-md px-3.5 py-1.5 rounded-sm font-mono text-xs text-red-300 flex items-center gap-1.5 shadow-lg">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                BEFORE: Burnt / Shorted Stator (0.1 MΩ)
              </div>
            </div>

            {/* Slider Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl cursor-ew-resize z-20 flex items-center justify-center"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-10 h-10 rounded-full bg-[#FF7B00] border-2 border-white text-black flex items-center justify-center shadow-2xl shadow-black font-bold">
                <ArrowLeftRight className="w-5 h-5 text-black" />
              </div>
            </div>

            {/* Range Input for drag & mobile touch control */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-30"
              aria-label="Before and After Comparison Slider"
              data-testid="before-after-range-input"
            />

            {/* Bottom helper prompt */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/75 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full font-mono text-[11px] text-zinc-300 pointer-events-none z-10 flex items-center gap-2">
              <ArrowLeftRight className="w-3.5 h-3.5 text-amber-400" />
              Drag slider left or right to inspect winding quality
            </div>

          </div>
        ) : null}

        {/* Technical Comparisons Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          {comparisons.map((item, idx) => (
            <div key={idx} className="bg-[#141414] border border-white/10 rounded-md p-5 space-y-3">
              <h4 className="font-heading font-black text-lg text-white uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                {item.title}
              </h4>
              <div className="space-y-2 text-xs font-sans">
                <div className="flex items-start gap-2 text-red-300 bg-red-950/20 p-2.5 rounded border border-red-500/20">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-mono text-[11px] text-red-400 uppercase">Incoming Fault:</strong>
                    {item.before}
                  </div>
                </div>
                <div className="flex items-start gap-2 text-emerald-300 bg-emerald-950/20 p-2.5 rounded border border-emerald-500/20">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-mono text-[11px] text-emerald-400 uppercase">Afjal Standard:</strong>
                    {item.after}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
