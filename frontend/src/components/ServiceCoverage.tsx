import { useState } from "react";
import { MapPin, Navigation, Truck, CheckCircle2, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export default function ServiceCoverage() {
  const { t } = useI18n();
  const [pincodeQuery, setPincodeQuery] = useState("");
  const [coverageResult, setCoverageResult] = useState<{ zoneKey: string; eta: string; typeKey: string } | null>(null);

  const localZones = [
    { nameKey: "cov.z1", typeKey: "cov.z1t", eta: "15 - 25", highlight: true },
    { nameKey: "cov.z2", typeKey: "cov.z2t", eta: "35 - 50", highlight: true },
    { nameKey: "cov.z3", typeKey: "cov.z3t", eta: "40 - 55", highlight: false },
    { nameKey: "cov.z4", typeKey: "cov.z4t", eta: "30 - 45", highlight: false },
    { nameKey: "cov.z5", typeKey: "cov.z5t", eta: "35 - 50", highlight: false },
    { nameKey: "cov.z6", typeKey: "cov.z6t", eta: "60 - 90", highlight: false },
  ];

  const checkCoverage = () => {
    const q = pincodeQuery.trim().toLowerCase();
    if (!q) return;

    if (q.includes("tilda") || q.includes("neora") || q.includes("तिल्दा") || q === "493114") {
      setCoverageResult({ zoneKey: "cov.zoneBase", eta: `15 - 20 ${t("cov.mins")}`, typeKey: "cov.resultLocal" });
    } else if (q.includes("urla") || q.includes("siltara") || q.includes("raipur") || q.includes("रायपुर") || q.startsWith("492") || q.startsWith("493")) {
      setCoverageResult({ zoneKey: "cov.zoneBelt", eta: `35 - 50 ${t("cov.mins")}`, typeKey: "cov.resultCity" });
    } else {
      setCoverageResult({ zoneKey: "cov.zoneNational", eta: t("cov.transit"), typeKey: "cov.resultNational" });
    }
  };

  return (
    <section id="coverage" className="py-16 sm:py-24 bg-[#0A0A0A] border-b border-white/10" data-testid="service-coverage-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-left max-w-3xl mb-12">
          <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 font-mono text-xs uppercase mb-3">
            <Navigation className="w-3.5 h-3.5 mr-1.5" />
            {t("cov.badge")}
          </Badge>
          <h2 className="font-heading font-black text-3xl sm:text-5xl uppercase text-white tracking-tight">{t("cov.heading")}</h2>
          <p className="text-zinc-300 text-sm sm:text-base font-sans mt-2">{t("cov.sub")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          <div className="lg:col-span-7 bg-[#121212] border border-white/10 rounded-md p-6 sm:p-8 space-y-6 text-left">
            <h3 className="font-heading font-black text-2xl text-white uppercase flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-400" />
              {t("cov.zonesTitle")}
            </h3>

            <div className="bg-[#181818] border border-white/10 rounded p-4 space-y-3">
              <span className="text-xs font-mono text-zinc-300 uppercase block">{t("cov.checkTitle")}</span>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  placeholder={t("cov.placeholder")}
                  value={pincodeQuery}
                  onChange={(e) => setPincodeQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && checkCoverage()}
                  className="bg-[#0A0A0A] border-white/15 text-white font-mono text-xs sm:text-sm h-10"
                  data-testid="coverage-pincode-input"
                />
                <Button
                  onClick={checkCoverage}
                  className="bg-[#FF7B00] hover:bg-[#E66A00] text-black font-heading font-black text-xs uppercase px-4 cursor-pointer shrink-0"
                  data-testid="coverage-check-btn"
                >
                  <Search className="w-3.5 h-3.5 mr-1" />
                  {t("cov.checkBtn")}
                </Button>
              </div>

              {coverageResult && (
                <div className="bg-emerald-950/30 border border-emerald-500/40 p-3 rounded text-xs font-mono text-emerald-300 flex flex-wrap items-center justify-between gap-2" data-testid="coverage-result">
                  <div>
                    <strong>{t(coverageResult.zoneKey)}</strong>: {t(coverageResult.typeKey)}
                  </div>
                  <Badge className="bg-emerald-500 text-black font-bold text-[10px]">
                    {t("cov.eta")} {coverageResult.eta}
                  </Badge>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {localZones.map((zone, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded border transition-all ${
                    zone.highlight ? "bg-amber-950/20 border-amber-500/40 text-white" : "bg-[#161616] border-white/5 text-zinc-300"
                  }`}
                >
                  <div className="font-mono text-xs font-semibold text-white">{t(zone.nameKey)}</div>
                  <div className="flex items-center justify-between mt-2 text-[11px] font-mono gap-2">
                    <span className="text-zinc-400">{t(zone.typeKey)}</span>
                    <strong className="text-amber-400 shrink-0">{zone.eta} {t("cov.mins")}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 bg-gradient-to-b from-[#181818] to-[#121212] border-2 border-cyan-500/40 rounded-md p-6 sm:p-8 space-y-6 text-left electric-glow-cyan">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="w-4 h-4" />
                {t("cov.freightDesk")}
              </span>
              <Badge variant="outline" className="text-[10px] font-mono border-cyan-500 text-cyan-300">
                {t("cov.insured")}
              </Badge>
            </div>

            <h3 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase">{t("cov.freightTitle")}</h3>
            <p className="text-xs sm:text-sm font-sans text-zinc-300 leading-relaxed">{t("cov.freightDesc")}</p>

            <div className="space-y-2.5 font-mono text-xs text-zinc-300 pt-2">
              {["cov.f1", "cov.f2", "cov.f3", "cov.f4"].map((k) => (
                <div key={k} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{t(k)}</span>
                </div>
              ))}
            </div>

            <div className="bg-[#0A0A0A] border border-white/10 rounded p-4 font-mono text-xs space-y-1 text-zinc-400">
              <div className="text-white font-bold uppercase">{t("cov.inwardTitle")}</div>
              <div>{t("common.brandName")}</div>
              <div>{t("common.address")}</div>
              <div className="text-amber-400 pt-1">{t("cov.inwardContact")} +91 9669718100</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
