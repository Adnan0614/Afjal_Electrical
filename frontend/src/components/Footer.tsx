import { Zap, Phone, Mail, MapPin, Clock, ArrowUp, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

interface FooterProps {
  onOpenEmergency: () => void;
  onOpenTracker: () => void;
  onOpenBrochure: () => void;
  onOpenLicenses: () => void;
}

export default function Footer({
  onOpenEmergency,
  onOpenTracker,
  onOpenBrochure,
  onOpenLicenses,
}: FooterProps) {
  const { t } = useI18n();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const scrollToSection = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer className="bg-[#070707] border-t border-white/10 text-zinc-400 font-sans text-xs pb-24 sm:pb-12" data-testid="site-footer">
      <div className="bg-gradient-to-r from-amber-950/40 via-[#141414] to-[#101010] border-b border-white/10 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-left">
          <div className="space-y-1">
            <span className="font-mono text-xs text-amber-400 uppercase font-bold tracking-wider">{t("foot.ctaKicker")}</span>
            <h3 className="font-heading font-black text-2xl sm:text-3xl uppercase text-white tracking-tight">{t("foot.ctaTitle")}</h3>
            <p className="text-zinc-300 text-xs sm:text-sm">{t("foot.ctaDesc")}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="tel:+919669718100"
              className="bg-[#FF7B00] hover:bg-[#E66A00] text-black font-heading font-black text-sm sm:text-base uppercase px-6 py-3 rounded flex items-center gap-2 shadow-lg shadow-amber-500/20"
              data-testid="footer-call-hotline-btn"
            >
              <Phone className="w-4 h-4 fill-current shrink-0" />
              {t("foot.call")}
            </a>
            <Button
              onClick={onOpenEmergency}
              className="bg-red-600 hover:bg-red-700 text-white font-heading font-black text-sm sm:text-base uppercase px-5 py-3 rounded pulse-emergency cursor-pointer"
              data-testid="footer-emergency-btn"
            >
              <Zap className="w-4 h-4 fill-current mr-1 shrink-0" />
              {t("nav.sos")}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-left">

          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-[#FF7B00] flex items-center justify-center text-black shrink-0">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <span className="font-heading font-black text-lg sm:text-xl uppercase tracking-tight text-white">
                {t("common.brandName")}
              </span>
            </div>

            <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">{t("foot.brandDesc")}</p>

            <div className="pt-2 text-[11px] font-mono text-zinc-400 space-y-1">
              <div>• <strong>{t("foot.proprietor")}</strong> {t("common.owner")}</div>
              <div>• <strong>{t("foot.contractorLic")}</strong> 08/626/B</div>
              <div>• <strong>{t("foot.wiremanLic")}</strong> NR/10464</div>
              <div>• <strong>{t("top.gstin")}:</strong> 22BDBPM9804K2ZH</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">{t("foot.servicesTitle")}</h4>
            <ul className="space-y-2 text-xs">
              {["foot.sv1", "foot.sv2", "foot.sv3", "foot.sv4", "foot.sv5", "foot.sv6"].map((k) => (
                <li key={k}>
                  <button onClick={() => scrollToSection("services")} className="hover:text-amber-400 transition-colors text-left">
                    {t(k)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">{t("foot.portalsTitle")}</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => scrollToSection("estimator")} className="text-amber-400 hover:text-amber-300 font-semibold text-left">
                  {t("foot.p1")}
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("roi-calculator")} className="hover:text-amber-400 text-left">{t("foot.p2")}</button>
              </li>
              <li>
                <button onClick={onOpenTracker} className="text-cyan-400 hover:text-cyan-300 font-semibold text-left" data-testid="footer-tracker-link">
                  {t("foot.p3")}
                </button>
              </li>
              <li>
                <button onClick={onOpenLicenses} className="hover:text-amber-400 text-left">{t("foot.p4")}</button>
              </li>
              <li>
                <button onClick={onOpenBrochure} className="hover:text-amber-400 text-left" data-testid="footer-brochure-link">{t("foot.p5")}</button>
              </li>
              <li>
                <button onClick={() => scrollToSection("reviews")} className="hover:text-amber-400 text-left">{t("foot.p6")}</button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">{t("foot.coordsTitle")}</h4>
            <div className="space-y-2 text-xs text-zinc-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{t("common.address")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="tel:+919669718100" className="text-amber-400 hover:underline font-bold">+91 9669718100</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="mailto:afjaleng@gmail.com" className="hover:underline">afjaleng@gmail.com</a>
              </div>
              <div className="flex items-start gap-2 text-zinc-400 pt-1">
                <Clock className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                <span>{t("foot.hours")} <br />{t("foot.hours24")}</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Afjal+Electrical+and+Rewinding+Works+Tilda+Neora+Raipur"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:underline font-mono"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                {t("foot.maps")}
              </a>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-zinc-500">
          <div className="text-center sm:text-left">© {new Date().getFullYear()} {t("foot.rights")}</div>
          <button onClick={scrollToTop} className="hover:text-amber-400 flex items-center gap-1 cursor-pointer transition-colors">
            {t("foot.backToTop")} <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
