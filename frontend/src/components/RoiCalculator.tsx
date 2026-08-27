import { useState, useMemo } from "react";
import { TrendingUp, Leaf, ShieldCheck, Share2, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";

export default function RoiCalculator() {
  const { t } = useI18n();
  const [motorHp, setMotorHp] = useState(50);
  const [dailyHours, setDailyHours] = useState(16);
  const [powerTariff, setPowerTariff] = useState(7.5);

  const hpOptions = [5, 10, 20, 30, 50, 75, 100, 150, 200];

  const calc = useMemo(() => {
    const newMotorCost = Math.round(motorHp * 2100 + 12000);
    const rewindCost = Math.round(motorHp * 480 + 3500);
    const instantSavings = newMotorCost - rewindCost;
    const savingsPercent = Math.round((instantSavings / newMotorCost) * 100);
    const kW = motorHp * 0.746;
    const annualUnitsKwh = Math.round(kW * dailyHours * 330);
    const annualPowerBill = Math.round(annualUnitsKwh * powerTariff);
    const paybackMonths = Math.max(0.4, Number(((rewindCost / (annualPowerBill / 12)) * 1.5).toFixed(1)));
    const co2SavedKg = Math.round(motorHp * 14.5);
    return { newMotorCost, rewindCost, instantSavings, savingsPercent, annualUnitsKwh, annualPowerBill, paybackMonths, co2SavedKg };
  }, [motorHp, dailyHours, powerTariff]);

  const handleShare = () => {
    const text = `Afjal Electricals ROI Analysis for ${motorHp} HP Motor:%0A• New Motor Cost: ₹${calc.newMotorCost.toLocaleString()}%0A• Precision Rewind Cost: ₹${calc.rewindCost.toLocaleString()}%0A• Instant Capital Savings: ₹${calc.instantSavings.toLocaleString()} (${calc.savingsPercent}% Saved)%0A• Payback Period: ${calc.paybackMonths} Months%0A• Carbon Saved: ${calc.co2SavedKg} kg CO2%0A%0AGet yours done at Afjal Electrical and Rewinding Works (Raipur): +91 9669718100`;
    window.open(`https://wa.me/919669718100?text=${text}`, "_blank");
  };

  const shifts = [
    { labelKey: "roi.shift8", val: 8 },
    { labelKey: "roi.shift16", val: 16 },
    { labelKey: "roi.shift24", val: 24 },
  ];

  return (
    <section id="roi-calculator" className="py-16 sm:py-24 bg-[#0D0D0D] border-b border-white/10" data-testid="roi-calculator-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-left max-w-3xl mb-12">
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-mono text-xs uppercase mb-3">
            <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
            {t("roi.badge")}
          </Badge>
          <h2 className="font-heading font-black text-3xl sm:text-5xl uppercase text-white tracking-tight">{t("roi.heading")}</h2>
          <p className="text-zinc-300 text-sm sm:text-base font-sans mt-2">{t("roi.sub")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Controls */}
          <div className="lg:col-span-5 bg-[#141414] border border-white/10 rounded-md p-6 sm:p-8 space-y-6 text-left">
            <div className="space-y-2">
              <div className="flex flex-wrap justify-between items-center gap-2">
                <span className="text-xs font-mono uppercase text-zinc-400">{t("roi.rating")}</span>
                <span className="font-mono text-base font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                  {motorHp} HP ({Math.round(motorHp * 0.746)} kW)
                </span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {hpOptions.map((hp) => (
                  <button
                    key={hp}
                    type="button"
                    onClick={() => setMotorHp(hp)}
                    className={`font-mono text-xs px-3 py-1.5 rounded border transition-all cursor-pointer ${
                      motorHp === hp ? "bg-[#FF7B00] text-black font-bold border-[#FF7B00]" : "bg-[#1E1E1E] border-white/10 text-zinc-300 hover:border-amber-400/40"
                    }`}
                    data-testid={`roi-hp-${hp}`}
                  >
                    {hp} HP
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap justify-between items-center gap-2">
                <span className="text-xs font-mono uppercase text-zinc-400">{t("roi.hours")}</span>
                <span className="font-mono text-sm font-bold text-white">{dailyHours} {t("roi.hoursPerDay")}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {shifts.map((shift) => (
                  <button
                    key={shift.val}
                    type="button"
                    onClick={() => setDailyHours(shift.val)}
                    className={`font-mono text-xs p-2 rounded border text-center transition-all cursor-pointer ${
                      dailyHours === shift.val ? "bg-amber-500/20 text-amber-400 border-amber-500 font-bold" : "bg-[#1E1E1E] border-white/10 text-zinc-400 hover:text-white"
                    }`}
                    data-testid={`roi-shift-${shift.val}`}
                  >
                    {t(shift.labelKey)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap justify-between items-center gap-2">
                <span className="text-xs font-mono uppercase text-zinc-400">{t("roi.tariff")}</span>
                <span className="font-mono text-sm font-bold text-cyan-400">₹{powerTariff.toFixed(2)} {t("roi.tariffUnit")}</span>
              </div>
              <input
                type="range"
                min="5"
                max="12"
                step="0.5"
                value={powerTariff}
                onChange={(e) => setPowerTariff(parseFloat(e.target.value))}
                className="w-full accent-[#FF7B00] bg-zinc-800 h-2 rounded cursor-pointer"
                data-testid="roi-tariff-slider"
              />
              <div className="flex justify-between text-[10px] font-mono text-zinc-500 gap-1">
                <span>{t("roi.tariffLow")}</span>
                <span className="hidden sm:inline">{t("roi.tariffMid")}</span>
                <span>{t("roi.tariffHigh")}</span>
              </div>
            </div>

            <div className="bg-amber-950/20 border border-amber-500/20 p-3.5 rounded text-xs font-sans text-zinc-300 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase font-heading text-sm">
                <Award className="w-4 h-4" />
                {t("roi.noTorque")}
              </div>
              <p className="text-[11px] text-zinc-400">{t("roi.noTorqueDesc")}</p>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#141414] border border-white/10 rounded-md p-5 space-y-3 opacity-80">
                <div className="text-xs font-mono text-zinc-400 uppercase">{t("roi.optionA")}</div>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-zinc-300">₹{calc.newMotorCost.toLocaleString("en-IN")}</div>
                <ul className="text-xs font-sans text-zinc-400 space-y-1.5 pt-2 border-t border-white/10">
                  <li>• {t("roi.optionAP1")}</li>
                  <li>• {t("roi.optionAP2")}</li>
                  <li>• {t("roi.optionAP3")}</li>
                </ul>
              </div>

              <div className="bg-gradient-to-b from-amber-950/40 to-[#181818] border-2 border-amber-500 rounded-md p-5 space-y-3 relative electric-glow">
                <Badge className="absolute top-3 right-3 bg-emerald-500 text-black font-bold text-[10px]">
                  {t("roi.save")} {calc.savingsPercent}%
                </Badge>
                <div className="text-xs font-mono text-amber-400 uppercase font-semibold pr-20">{t("roi.optionB")}</div>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-white" data-testid="roi-rewind-cost">
                  ₹{calc.rewindCost.toLocaleString("en-IN")}
                </div>
                <ul className="text-xs font-sans text-zinc-300 space-y-1.5 pt-2 border-t border-amber-500/30">
                  <li className="text-emerald-400 flex items-start gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    {t("roi.optionBP1")}
                  </li>
                  <li>• {t("roi.optionBP2")}</li>
                  <li>• {t("roi.optionBP3")}</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-950/40 via-[#141414] to-[#121212] border border-emerald-500/40 rounded-md p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <span className="text-[11px] font-mono text-zinc-400 uppercase block">{t("roi.instantSaved")}</span>
                  <div className="text-2xl sm:text-3xl font-mono font-black text-emerald-400" data-testid="roi-instant-savings">
                    ₹{calc.instantSavings.toLocaleString("en-IN")}
                  </div>
                  <span className="text-[11px] text-zinc-400 font-sans">{t("roi.instantSavedSub")}</span>
                </div>

                <div>
                  <span className="text-[11px] font-mono text-zinc-400 uppercase block">{t("roi.payback")}</span>
                  <div className="text-2xl sm:text-3xl font-mono font-black text-cyan-400">
                    {calc.paybackMonths} {t("roi.paybackMonths")}
                  </div>
                  <span className="text-[11px] text-zinc-400 font-sans">{t("roi.paybackSub")}</span>
                </div>

                <div>
                  <span className="text-[11px] font-mono text-zinc-400 uppercase block">{t("roi.carbon")}</span>
                  <div className="text-2xl sm:text-3xl font-mono font-black text-emerald-300 flex items-center gap-1">
                    <Leaf className="w-5 h-5 text-emerald-400" />
                    {calc.co2SavedKg} kg
                  </div>
                  <span className="text-[11px] text-zinc-400 font-sans">{t("roi.carbonSub")}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-mono text-zinc-400">
                  {t("roi.annualDraw")} <strong className="text-zinc-200">{calc.annualUnitsKwh.toLocaleString()} kWh</strong> (₹{calc.annualPowerBill.toLocaleString()}/yr)
                </span>

                <Button
                  onClick={handleShare}
                  size="sm"
                  className="bg-[#FF7B00] hover:bg-[#E66A00] text-black font-heading font-black text-sm uppercase px-4 cursor-pointer"
                  data-testid="roi-share-whatsapp-btn"
                >
                  <Share2 className="w-3.5 h-3.5 mr-1.5" />
                  {t("roi.shareBtn")}
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
