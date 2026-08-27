import { useState } from "react";
import { Sparkles, ShieldCheck, Check, AlertTriangle, ArrowLeftRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import React from "react";
import { useI18n } from "@/lib/i18n";
import type { SiteMedia } from "@/types";

const FALLBACK: SiteMedia = {
  before_image_url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
  after_image_url: "https://images.unsplash.com/photo-1692719094491-2746e82a8595?auto=format&fit=crop&w=1200&q=80",
  before_caption: "BEFORE: Burnt / Shorted Stator (0.1 MΩ)",
  after_caption: "AFTER: 100% Pure Copper Rewound (250 MΩ)",
  gallery: [],
};

export default function BeforeAfterShowcase(): React.JSX.Element {
  const { t } = useI18n();
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [activeTab, setActiveTab] = useState<"slider" | "breakdown">("slider");

  const { data: media = FALLBACK } = useQuery<SiteMedia>({
    queryKey: ["site-media"],
    queryFn: () => apiGet<SiteMedia>("/settings/media"),
    staleTime: 30_000,
  });

  const comparisons = [1, 2, 3, 4];

  return (
    <section id="before-after" className="py-16 sm:py-24 bg-[#0D0D0D] border-b border-white/10" data-testid="before-after-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-left max-w-3xl mb-12">
          <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 font-mono text-xs uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            {t("ba.badge")}
          </Badge>
          <h2 className="font-heading font-black text-3xl sm:text-5xl uppercase text-white tracking-tight">{t("ba.heading")}</h2>
          <p className="text-zinc-300 text-sm sm:text-base font-sans mt-2">{t("ba.sub")}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab("slider")}
            className={`font-mono text-xs px-4 py-2 rounded border transition-all cursor-pointer ${
              activeTab === "slider" ? "bg-[#FF7B00] text-black font-bold border-[#FF7B00]" : "bg-[#181818] border-white/10 text-zinc-300"
            }`}
            data-testid="showcase-tab-slider"
          >
            {t("ba.tabSlider")}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("breakdown")}
            className={`font-mono text-xs px-4 py-2 rounded border transition-all cursor-pointer ${
              activeTab === "breakdown" ? "bg-[#FF7B00] text-black font-bold border-[#FF7B00]" : "bg-[#181818] border-white/10 text-zinc-300"
            }`}
            data-testid="showcase-tab-breakdown"
          >
            {t("ba.tabSpecs")}
          </button>
        </div>

        {activeTab === "slider" && (
          <div className="relative w-full h-[380px] sm:h-[500px] rounded-lg overflow-hidden border-2 border-white/15 select-none electric-glow" data-testid="before-after-slider-container">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${media.after_image_url})` }}>
              <div className="absolute top-4 right-4 bg-emerald-950/80 border border-emerald-500/50 backdrop-blur-md px-3.5 py-1.5 rounded-sm font-mono text-[11px] sm:text-xs text-emerald-300 flex items-center gap-1.5 shadow-lg max-w-[60%]">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                {media.after_caption}
              </div>
            </div>

            <div
              className="absolute inset-0 bg-cover bg-center overflow-hidden"
              style={{ backgroundImage: `url(${media.before_image_url})`, width: `${sliderPosition}%` }}
            >
              <div className="absolute inset-0 bg-black/40 backdrop-grayscale" />
              <div className="absolute top-4 left-4 bg-red-950/80 border border-red-500/50 backdrop-blur-md px-3.5 py-1.5 rounded-sm font-mono text-[11px] sm:text-xs text-red-300 flex items-center gap-1.5 shadow-lg max-w-[85%]">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                {media.before_caption}
              </div>
            </div>

            <div className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl cursor-ew-resize z-20 flex items-center justify-center" style={{ left: `${sliderPosition}%` }}>
              <div className="w-10 h-10 rounded-full bg-[#FF7B00] border-2 border-white text-black flex items-center justify-center shadow-2xl shadow-black font-bold">
                <ArrowLeftRight className="w-5 h-5 text-black" />
              </div>
            </div>

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

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/75 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full font-mono text-[10px] sm:text-[11px] text-zinc-300 pointer-events-none z-10 flex items-center gap-2 text-center">
              <ArrowLeftRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              {t("ba.dragHint")}
            </div>
          </div>
        )}

        {/* Workshop gallery */}
        {media.gallery && media.gallery.length > 0 && (
          <div className="mt-8 space-y-3">
            <h3 className="font-heading font-black text-xl text-white uppercase text-left">{t("ba.gallery")}</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {media.gallery.map((g, idx) => (
                <div key={`${g.label}-${g.image_url}`} className="relative rounded-md overflow-hidden border border-white/10 group" data-testid={`gallery-item-${idx}`}>
                  <img
                    src={g.image_url}
                    alt={g.label}
                    loading="lazy"
                    className="w-full h-36 sm:h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3">
                    <span className="font-mono text-xs text-amber-300 uppercase font-bold">{g.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technical comparison */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          {comparisons.map((n) => (
            <div key={n} className="bg-[#141414] border border-white/10 rounded-md p-5 space-y-3">
              <h4 className="font-heading font-black text-lg text-white uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
                {t(`ba.c${n}`)}
              </h4>
              <div className="space-y-2 text-xs font-sans">
                <div className="flex items-start gap-2 text-red-300 bg-red-950/20 p-2.5 rounded border border-red-500/20">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-mono text-[11px] text-red-400 uppercase">{t("ba.incomingFault")}</strong>
                    {t(`ba.c${n}b`)}
                  </div>
                </div>
                <div className="flex items-start gap-2 text-emerald-300 bg-emerald-950/20 p-2.5 rounded border border-emerald-500/20">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-mono text-[11px] text-emerald-400 uppercase">{t("ba.afjalStandard")}</strong>
                    {t(`ba.c${n}a`)}
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
