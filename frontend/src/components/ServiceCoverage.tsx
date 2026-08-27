import { useState } from "react";
import { MapPin, Navigation, Truck, CheckCircle2, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ServiceCoverage() {
  const [pincodeQuery, setPincodeQuery] = useState("");
  const [coverageResult, setCoverageResult] = useState<{ zone: string; eta: string; type: string } | null>(null);

  const localZones = [
    { name: "Tilda Neora (Central Workshop)", eta: "15 - 25 Mins", type: "Immediate Response", highlight: true },
    { name: "Raipur City & Industrial Area", eta: "35 - 50 Mins", type: "Rapid Mobile Van", highlight: true },
    { name: "Urla Industrial Complex", eta: "40 - 55 Mins", type: "Heavy Plant Support", highlight: false },
    { name: "Siltara Steel & Re-rolling Belt", eta: "30 - 45 Mins", type: "Emergency Breakdown", highlight: false },
    { name: "Birgaon & Bhanpuri Corridor", eta: "35 - 50 Mins", type: "On-Call Contracting", highlight: false },
    { name: "Bhatapara, Bilaspur & Mahasamund", eta: "60 - 90 Mins", type: "Same-Day Field Unit", highlight: false },
  ];

  const checkCoverage = () => {
    const q = pincodeQuery.trim().toLowerCase();
    if (!q) return;

    if (q.includes("tilda") || q.includes("neora") || q === "493114") {
      setCoverageResult({ zone: "Tilda Neora (Base Hub)", eta: "15 - 20 Mins", type: "Priority Immediate Dispatch" });
    } else if (q.includes("urla") || q.includes("siltara") || q.includes("raipur") || q.startsWith("492") || q.startsWith("493")) {
      setCoverageResult({ zone: "Raipur Industrial Belt", eta: "35 - 50 Mins", type: "Field Van En Route Available" });
    } else {
      setCoverageResult({ zone: "Nationwide Freight Delivery", eta: "24 - 48 Hrs Transit", type: "Accepted via V-Trans, TCI, SafeExpress" });
    }
  };

  return (
    <section id="coverage" className="py-16 sm:py-24 bg-[#0A0A0A] border-b border-white/10" data-testid="service-coverage-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-left max-w-3xl mb-12">
          <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 font-mono text-xs uppercase mb-3">
            <Navigation className="w-3.5 h-3.5 mr-1.5" />
            Logistics & Rapid Response Grid
          </Badge>
          <h2 className="font-heading font-black text-3xl sm:text-5xl uppercase text-white tracking-tight">
            Service Coverage & Nationwide Dispatch
          </h2>
          <p className="text-zinc-300 text-sm sm:text-base font-sans mt-2">
            Headquartered in Tilda Neora, Raipur — providing guaranteed 45-minute emergency technician arrival across Chhattisgarh industrial zones, and receiving freight rewinding orders from all over India.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Interactive Pincode & Local Radius List */}
          <div className="lg:col-span-7 bg-[#121212] border border-white/10 rounded-md p-6 sm:p-8 space-y-6 text-left">
            
            <h3 className="font-heading font-black text-2xl text-white uppercase flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-400" />
              On-Site Industrial Response Zones
            </h3>

            {/* Pincode / Area Checker */}
            <div className="bg-[#181818] border border-white/10 rounded p-4 space-y-3">
              <span className="text-xs font-mono text-zinc-300 uppercase block">Check Response Time for Your Location</span>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter Pincode or City (e.g. 493114, Urla, Raipur, Bilaspur)"
                  value={pincodeQuery}
                  onChange={(e) => setPincodeQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && checkCoverage()}
                  className="bg-[#0A0A0A] border-white/15 text-white font-mono text-xs sm:text-sm h-10"
                  data-testid="coverage-pincode-input"
                />
                <Button
                  onClick={checkCoverage}
                  className="bg-[#FF7B00] hover:bg-[#E66A00] text-black font-heading font-black text-xs uppercase px-4 cursor-pointer"
                  data-testid="coverage-check-btn"
                >
                  <Search className="w-3.5 h-3.5 mr-1" />
                  Check ETA
                </Button>
              </div>

              {coverageResult && (
                <div className="bg-emerald-950/30 border border-emerald-500/40 p-3 rounded text-xs font-mono text-emerald-300 flex items-center justify-between">
                  <div>
                    <strong>{coverageResult.zone}</strong>: {coverageResult.type}
                  </div>
                  <Badge className="bg-emerald-500 text-black font-bold text-[10px]">
                    ETA: {coverageResult.eta}
                  </Badge>
                </div>
              )}
            </div>

            {/* Zone List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {localZones.map((zone, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded border transition-all ${
                    zone.highlight
                      ? "bg-amber-950/20 border-amber-500/40 text-white"
                      : "bg-[#161616] border-white/5 text-zinc-300"
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="font-semibold text-white">{zone.name}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-[11px] font-mono">
                    <span className="text-zinc-400">{zone.type}</span>
                    <strong className="text-amber-400">{zone.eta}</strong>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Right: Nationwide Freight & Logistics Box */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#181818] to-[#121212] border-2 border-cyan-500/40 rounded-md p-6 sm:p-8 space-y-6 text-left electric-glow-cyan">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="w-4 h-4" />
                All India Freight Desk
              </span>
              <Badge variant="outline" className="text-[10px] font-mono border-cyan-500 text-cyan-300">
                Insured Transit
              </Badge>
            </div>

            <h3 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase">
              Accepting Motor Rewinding Orders Across India
            </h3>

            <p className="text-xs sm:text-sm font-sans text-zinc-300 leading-relaxed">
              Industrial plants from Odisha, Madhya Pradesh, Maharashtra, and Jharkhand regularly ship their heavy slip-ring, DC, and mill motors to our Tilda Neora workshop for precision dual-coated copper rewinding.
            </p>

            <div className="space-y-2.5 font-mono text-xs text-zinc-300 pt-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Tie-ups with V-Trans, TCI Freight & SafeExpress</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Heavy crane unloading facility up to 10 Tons</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Video inspection & live surge testing reports shared via WhatsApp</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Moisture-proof shrink wrapping & wooden crate dispatch</span>
              </div>
            </div>

            <div className="bg-[#0A0A0A] border border-white/10 rounded p-4 font-mono text-xs space-y-1 text-zinc-400">
              <div className="text-white font-bold uppercase">Workshop Inward Address:</div>
              <div>Afjal Electrical and Rewinding Works</div>
              <div>Nagar Palika Road, Tilda Neora, Raipur, CG - 493114</div>
              <div className="text-amber-400 pt-1">Transport Inward Contact: +91 9669718100</div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
