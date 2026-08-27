import { useState, useMemo } from "react";
import { TrendingUp, Leaf, ShieldCheck, Share2, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function RoiCalculator() {
  const [motorHp, setMotorHp] = useState<number>(50);
  const [dailyHours, setDailyHours] = useState<number>(16); // 16 hours/day
  const [powerTariff, setPowerTariff] = useState<number>(7.5); // ₹7.5 per kWh in CG/India

  const hpOptions = [5, 10, 20, 30, 50, 75, 100, 150, 200];

  const calculations = useMemo(() => {
    // New motor benchmark cost (Kirloskar / ABB / Siemens standard industrial line)
    // Roughly ₹1,800 - ₹2,400 per HP
    const newMotorCost = Math.round(motorHp * 2100 + 12000);

    // Afjal Electricals precision rewind cost (Dual-Coated Class-H copper, SKF bearings, balancing)
    const rewindCost = Math.round(motorHp * 480 + 3500);

    // Instant CAPEX savings
    const instantSavings = newMotorCost - rewindCost;
    const savingsPercent = Math.round((instantSavings / newMotorCost) * 100);

    // Electrical consumption:
    // kW = HP * 0.746
    const kW = motorHp * 0.746;
    // With 100% pure copper & Class-H winding, efficiency is maintained at ~92.5%
    const annualHours = dailyHours * 330; // 330 working days
    const annualUnitsKwh = Math.round(kW * annualHours);
    const annualPowerBill = Math.round(annualUnitsKwh * powerTariff);

    // Payback period (months) against capital cost
    const paybackMonths = Math.max(0.4, Number(( (rewindCost / (annualPowerBill / 12)) * 1.5 ).toFixed(1)));

    // Carbon reduction (reusing 80% heavy cast iron & electrical steel laminations)
    // ~12 kg CO2 per HP saved in virgin steel/casting smelting
    const co2SavedKg = Math.round(motorHp * 14.5);

    return {
      newMotorCost,
      rewindCost,
      instantSavings,
      savingsPercent,
      annualUnitsKwh,
      annualPowerBill,
      paybackMonths,
      co2SavedKg,
    };
  }, [motorHp, dailyHours, powerTariff]);

  const handleShare = () => {
    const text = `Afjal Electricals ROI Analysis for ${motorHp} HP Motor:%0A• New Motor Cost: ₹${calculations.newMotorCost.toLocaleString()}%0A• Precision Rewind Cost: ₹${calculations.rewindCost.toLocaleString()}%0A• Instant Capital Savings: ₹${calculations.instantSavings.toLocaleString()} (${calculations.savingsPercent}% Saved)%0A• Payback Period: ${calculations.paybackMonths} Months%0A• Carbon Saved: ${calculations.co2SavedKg} kg CO2%0A%0AGet yours done at Afjal Electrical and Rewinding Works (Raipur): +91 9669718100`;
    window.open(`https://wa.me/919669718100?text=${text}`, "_blank");
  };

  return (
    <section id="roi-calculator" className="py-16 sm:py-24 bg-[#0D0D0D] border-b border-white/10" data-testid="roi-calculator-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-left max-w-3xl mb-12">
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-mono text-xs uppercase mb-3">
            <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
            Financial Intelligence & Engineering Economics
          </Badge>
          <h2 className="font-heading font-black text-3xl sm:text-5xl uppercase text-white tracking-tight">
            Motor Rewinding vs. Buy New: ROI & Savings Calculator
          </h2>
          <p className="text-zinc-300 text-sm sm:text-base font-sans mt-2">
            Why replace a heavy-duty industrial motor core when you can restore it to full factory torque with Class-H dual-coated copper wire at a fraction of the cost? See the exact numbers below.
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Column */}
          <div className="lg:col-span-5 bg-[#141414] border border-white/10 rounded-md p-6 sm:p-8 space-y-6 text-left">
            
            {/* Control 1: Motor Rating */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono uppercase text-zinc-400">Motor Power Rating</span>
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
                      motorHp === hp
                        ? "bg-[#FF7B00] text-black font-bold border-[#FF7B00]"
                        : "bg-[#1E1E1E] border-white/10 text-zinc-300 hover:border-amber-400/40"
                    }`}
                    data-testid={`roi-hp-${hp}`}
                  >
                    {hp} HP
                  </button>
                ))}
              </div>
            </div>

            {/* Control 2: Operating Hours */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono uppercase text-zinc-400">Daily Operating Hours</span>
                <span className="font-mono text-sm font-bold text-white">
                  {dailyHours} Hours/Day
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "8 hrs (1 Shift)", val: 8 },
                  { label: "16 hrs (2 Shifts)", val: 16 },
                  { label: "24 hrs (Continuous)", val: 24 },
                ].map((shift) => (
                  <button
                    key={shift.val}
                    type="button"
                    onClick={() => setDailyHours(shift.val)}
                    className={`font-mono text-xs p-2 rounded border text-center transition-all cursor-pointer ${
                      dailyHours === shift.val
                        ? "bg-amber-500/20 text-amber-400 border-amber-500 font-bold"
                        : "bg-[#1E1E1E] border-white/10 text-zinc-400 hover:text-white"
                    }`}
                    data-testid={`roi-shift-${shift.val}`}
                  >
                    {shift.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Control 3: Electricity Tariff */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono uppercase text-zinc-400">Commercial Power Tariff</span>
                <span className="font-mono text-sm font-bold text-cyan-400">
                  ₹{powerTariff.toFixed(2)} / kWh (Unit)
                </span>
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
              <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                <span>₹5.00/kWh (Agro)</span>
                <span>₹7.50/kWh (Avg CG Industrial)</span>
                <span>₹12.00/kWh (Peak HT)</span>
              </div>
            </div>

            {/* Quality Note */}
            <div className="bg-amber-950/20 border border-amber-500/20 p-3.5 rounded text-xs font-sans text-zinc-300 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase font-heading text-sm">
                <Award className="w-4 h-4" />
                No Torque Loss Guarantee
              </div>
              <p className="text-[11px] text-zinc-400">
                With Class-H dual-coat copper wire and precision slot fill factor, our rewound motors retain &gt;98.5% original OEM efficiency and breakdown torque.
              </p>
            </div>

          </div>

          {/* Results Comparison Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Side-by-side Cost Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Card 1: Buy New Motor */}
              <div className="bg-[#141414] border border-white/10 rounded-md p-5 space-y-3 relative opacity-80">
                <div className="text-xs font-mono text-zinc-400 uppercase">Option A: Buy New Motor</div>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-zinc-300">
                  ₹{calculations.newMotorCost.toLocaleString("en-IN")}
                </div>
                <ul className="text-xs font-sans text-zinc-400 space-y-1.5 pt-2 border-t border-white/10">
                  <li>• High initial capital outlay</li>
                  <li>• 7 - 14 days delivery wait time</li>
                  <li>• Frame/shaft mounting mismatch risk</li>
                </ul>
              </div>

              {/* Card 2: Afjal Precision Rewinding */}
              <div className="bg-gradient-to-b from-amber-950/40 to-[#181818] border-2 border-amber-500 rounded-md p-5 space-y-3 relative electric-glow">
                <Badge className="absolute top-3 right-3 bg-emerald-500 text-black font-bold text-[10px]">
                  SAVE {calculations.savingsPercent}%
                </Badge>
                <div className="text-xs font-mono text-amber-400 uppercase font-semibold">Option B: Afjal Precision Rewind</div>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-white" data-testid="roi-rewind-cost">
                  ₹{calculations.rewindCost.toLocaleString("en-IN")}
                </div>
                <ul className="text-xs font-sans text-zinc-300 space-y-1.5 pt-2 border-t border-amber-500/30">
                  <li className="text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    100% Electrolytic Pure Copper (Class-H)
                  </li>
                  <li>• 24 - 48 hours fast turnaround</li>
                  <li>• Exact original frame & base fitment</li>
                </ul>
              </div>

            </div>

            {/* Savings Hero Highlight Box */}
            <div className="bg-gradient-to-r from-emerald-950/40 via-[#141414] to-[#121212] border border-emerald-500/40 rounded-md p-6 space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <span className="text-[11px] font-mono text-zinc-400 uppercase block">Instant Capital Saved</span>
                  <div className="text-2xl sm:text-3xl font-mono font-black text-emerald-400" data-testid="roi-instant-savings">
                    ₹{calculations.instantSavings.toLocaleString("en-IN")}
                  </div>
                  <span className="text-[11px] text-zinc-400 font-sans">Immediate cashflow relief</span>
                </div>

                <div>
                  <span className="text-[11px] font-mono text-zinc-400 uppercase block">Capital Payback Period</span>
                  <div className="text-2xl sm:text-3xl font-mono font-black text-cyan-400">
                    {calculations.paybackMonths} Months
                  </div>
                  <span className="text-[11px] text-zinc-400 font-sans">Rapid investment recovery</span>
                </div>

                <div>
                  <span className="text-[11px] font-mono text-zinc-400 uppercase block">Carbon Saved (Recycling)</span>
                  <div className="text-2xl sm:text-3xl font-mono font-black text-emerald-300 flex items-center gap-1">
                    <Leaf className="w-5 h-5 text-emerald-400" />
                    {calculations.co2SavedKg} kg
                  </div>
                  <span className="text-[11px] text-zinc-400 font-sans">CO2 footprint avoided</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-mono text-zinc-400">
                  Annual Plant Power Draw: <strong className="text-zinc-200">{calculations.annualUnitsKwh.toLocaleString()} kWh</strong> (₹{calculations.annualPowerBill.toLocaleString()}/yr)
                </span>

                <Button
                  onClick={handleShare}
                  size="sm"
                  className="bg-[#FF7B00] hover:bg-[#E66A00] text-black font-heading font-black text-sm uppercase px-4 cursor-pointer"
                  data-testid="roi-share-whatsapp-btn"
                >
                  <Share2 className="w-3.5 h-3.5 mr-1.5" />
                  Discuss ROI on WhatsApp
                </Button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
