import { ShieldCheck, Award, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";

interface LicensesComplianceProps {
  onOpenBrochure: () => void;
}

export default function LicensesCompliance({ onOpenBrochure }: LicensesComplianceProps) {
  const { t } = useI18n();

  const licenses = [
    { id: "contractor", n: 1, number: "08/626/B", validityKey: "lic.activeRenewed" },
    { id: "wireman", n: 2, number: "NR/10464", validityKey: "lic.active" },
    { id: "gstin", n: 3, number: "22BDBPM9804K2ZH", validityKey: "lic.activeShort" },
    { id: "gumasta", n: 4, number: "000107/RPR/5/2021", validityKey: "lic.activeShort" },
  ];

  return (
    <section id="licenses" className="py-16 sm:py-24 bg-[#0D0D0D] border-b border-white/10" data-testid="licenses-compliance-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-left max-w-3xl mb-12">
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-mono text-xs uppercase mb-3">
            <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
            {t("lic.badge")}
          </Badge>
          <h2 className="font-heading font-black text-3xl sm:text-5xl uppercase text-white tracking-tight">{t("lic.heading")}</h2>
          <p className="text-zinc-300 text-sm sm:text-base font-sans mt-2">{t("lic.sub")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {licenses.map((lic) => (
            <div
              key={lic.id}
              className="bg-[#141414] border border-white/10 hover:border-amber-500/50 rounded-md p-6 flex flex-col justify-between space-y-4 text-left transition-all group"
              data-testid={`license-card-${lic.id}`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-mono text-zinc-400 uppercase">{t(`lic.t${lic.n}`)}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-1"></span>
                </div>

                <div className="font-mono text-lg sm:text-xl font-black text-amber-400 group-hover:text-amber-300 tracking-wider break-all">
                  {lic.number}
                </div>

                <div className="text-xs font-semibold text-white">{t(`lic.c${lic.n}`)}</div>
                <p className="text-[11px] font-sans text-zinc-400 leading-relaxed">{t(`lic.s${lic.n}`)}</p>
              </div>

              <div className="pt-3 border-t border-white/10 space-y-2">
                <div className="flex items-start justify-between gap-2 text-[10px] font-mono text-zinc-500">
                  <span className="shrink-0">{t("lic.authority")}</span>
                  <span className="text-zinc-300 text-right">{t(`lic.a${lic.n}`)}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400">
                  <span>{t("lic.status")}</span>
                  <span className="font-bold">{t(lic.validityKey)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-gradient-to-r from-amber-950/30 via-[#181818] to-[#121212] border border-amber-500/30 rounded-md p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-left">
          <div className="space-y-1">
            <h3 className="font-heading font-black text-xl sm:text-2xl text-white uppercase flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-400 shrink-0" />
              {t("lic.ctaTitle")}
            </h3>
            <p className="text-xs sm:text-sm font-sans text-zinc-300">{t("lic.ctaDesc")}</p>
          </div>

          <Button
            onClick={onOpenBrochure}
            className="bg-[#FF7B00] hover:bg-[#E66A00] text-black font-heading font-black text-sm uppercase px-6 py-5 rounded-sm shrink-0 cursor-pointer"
            data-testid="license-open-brochure-btn"
          >
            <Download className="w-4 h-4 mr-2" />
            {t("lic.ctaBtn")}
          </Button>
        </div>

      </div>
    </section>
  );
}
