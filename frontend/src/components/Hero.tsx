import { ArrowRight, ShieldCheck, Zap, Award, CheckCircle2, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";

interface HeroProps {
  onOpenEmergency: () => void;
  onOpenTracker: () => void;
  onOpenLicenses: () => void;
}

export default function Hero({ onOpenEmergency, onOpenTracker, onOpenLicenses }: HeroProps) {
  const { t } = useI18n();

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative technical-grid overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 border-b border-white/10" data-testid="hero-section">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-600/15 via-orange-500/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-red-600/10 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-amber-500/15 border border-amber-500/40 text-amber-400 font-mono text-xs py-1 px-3 flex items-center gap-1.5 uppercase">
                <Zap className="w-3.5 h-3.5 fill-current" />
                {t("hero.badge")}
              </Badge>
              <button
                onClick={onOpenLicenses}
                className="inline-flex items-center gap-1 text-xs font-mono text-zinc-400 hover:text-amber-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded transition-colors cursor-pointer"
                data-testid="hero-verify-lic-btn"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                {t("hero.licBadge")}
              </button>
            </div>

            <h1 className="font-heading font-black text-4xl sm:text-6xl xl:text-7xl uppercase tracking-tight text-white leading-[0.95]">
              {t("hero.title1")} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7B00] via-amber-400 to-[#D95B18]">
                {t("hero.title2")}
              </span> <br />
              {t("hero.title3")}
            </h1>

            <p className="font-sans text-base sm:text-lg text-zinc-300 max-w-2xl leading-relaxed">
              {t("hero.desc")} <strong className="text-white font-semibold">{t("hero.descBold")}</strong>{t("hero.descEnd")}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 font-mono text-xs text-zinc-300">
              <div className="flex items-center gap-2 bg-[#141414] border border-white/10 p-2.5 rounded-sm">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{t("hero.pureCopper")}</span>
              </div>
              <div className="flex items-center gap-2 bg-[#141414] border border-white/10 p-2.5 rounded-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t("hero.warranty")}</span>
              </div>
              <div className="flex items-center gap-2 bg-[#141414] border border-white/10 p-2.5 rounded-sm col-span-2 sm:col-span-1">
                <Flame className="w-4 h-4 text-red-400 shrink-0" />
                <span>{t("hero.sosSpeed")}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Button
                size="lg"
                onClick={() => scrollToSection("estimator")}
                className="bg-[#FF7B00] hover:bg-[#E66A00] text-black font-heading font-black text-lg uppercase tracking-wider px-6 py-6 rounded-sm shadow-xl shadow-amber-500/20 group cursor-pointer"
                data-testid="hero-calculate-quote-btn"
              >
                {t("hero.ctaEstimator")}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                size="lg"
                onClick={onOpenEmergency}
                className="bg-red-600 hover:bg-red-700 text-white font-heading font-black text-lg uppercase tracking-wider px-5 py-6 rounded-sm pulse-emergency cursor-pointer"
                data-testid="hero-emergency-sos-btn"
              >
                <Zap className="w-5 h-5 fill-current mr-1.5" />
                {t("nav.sos")}
              </Button>

              <a
                href="https://wa.me/919669718100?text=Hello%20Mohammad%20Afjal%20bhai,%20I%20need%20a%20consultation%20regarding%20motor%20rewinding%20/%20electrical%20contracting%20work."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 font-mono text-sm text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 bg-emerald-950/30 hover:bg-emerald-950/50 px-4 py-3 rounded-sm transition-all"
                data-testid="hero-whatsapp-consult-btn"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                {t("hero.ctaWhatsapp")}
              </a>
            </div>
          </div>

          {/* Trust card */}
          <div className="lg:col-span-5">
            <div className="relative bg-gradient-to-b from-[#181818] to-[#101010] border border-white/15 rounded-md p-6 sm:p-8 electric-glow space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="text-left">
                  <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block">{t("hero.workshopStatus")}</span>
                  <h3 className="font-heading font-black text-2xl text-white uppercase">{t("hero.hubName")}</h3>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/40 px-2 py-1 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    {t("hero.activeQueue")}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="bg-[#0A0A0A] border border-white/10 p-3.5 rounded-sm">
                  <div className="text-2xl sm:text-3xl font-heading font-black text-amber-400">5,480+</div>
                  <div className="text-xs font-sans text-zinc-400">{t("hero.statMotors")}</div>
                </div>
                <div className="bg-[#0A0A0A] border border-white/10 p-3.5 rounded-sm">
                  <div className="text-2xl sm:text-3xl font-heading font-black text-amber-400">{t("hero.statYears")}</div>
                  <div className="text-xs font-sans text-zinc-400">{t("hero.statYearsLabel")}</div>
                </div>
                <div className="bg-[#0A0A0A] border border-white/10 p-3.5 rounded-sm">
                  <div className="text-2xl sm:text-3xl font-heading font-black text-emerald-400">100%</div>
                  <div className="text-xs font-sans text-zinc-400">{t("hero.statCopperLabel")}</div>
                </div>
                <div className="bg-[#0A0A0A] border border-white/10 p-3.5 rounded-sm">
                  <div className="text-2xl sm:text-3xl font-heading font-black text-cyan-400">{t("hero.statResponse")}</div>
                  <div className="text-xs font-sans text-zinc-400">{t("hero.statResponseLabel")}</div>
                </div>
              </div>

              <div className="bg-amber-950/20 border border-amber-500/30 rounded-sm p-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center font-heading font-bold text-amber-300 text-xl">
                    MA
                  </div>
                  <div>
                    <h4 className="font-heading font-black text-lg text-white uppercase leading-none">
                      {t("common.owner")}
                    </h4>
                    <p className="text-xs font-mono text-amber-400">{t("hero.masterTitle")}</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{t("hero.masterSub")}</p>
                  </div>
                </div>
                <div className="mt-3 pt-2.5 border-t border-amber-500/20 flex items-center justify-between text-xs font-mono text-zinc-300">
                  <span>{t("hero.hotline")}</span>
                  <a href="tel:+919669718100" className="text-amber-400 font-bold hover:underline">+91 9669718100</a>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  onClick={onOpenTracker}
                  variant="outline"
                  className="w-full justify-between border-white/20 bg-[#121212] hover:bg-white/5 hover:border-amber-400/50 text-zinc-200 font-mono text-xs py-5 cursor-pointer"
                  data-testid="hero-quick-track-btn"
                >
                  <span className="flex items-center gap-2 text-left">
                    <Award className="w-4 h-4 text-amber-400 shrink-0" />
                    {t("hero.lookupJob")}
                  </span>
                  <ArrowRight className="w-4 h-4 text-zinc-400 shrink-0" />
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
