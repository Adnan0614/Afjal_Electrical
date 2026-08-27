import { Shield, Zap, CheckCircle, Award, Activity, Truck, Cpu } from "lucide-react";

export default function TrustMarquee() {
  const items = [
    { icon: Shield, text: "Class-B Govt Contractor (08/626/B)" },
    { icon: Zap, text: "Licensed Wireman (NR/10464)" },
    { icon: Cpu, text: "100% Electrolytic Dual-Coated Copper" },
    { icon: Activity, text: "5000V Megger & Surge Testing" },
    { icon: Award, text: "Dynamic Rotor Balancing (<1.2 mm/s)" },
    { icon: CheckCircle, text: "6-Month Written Workshop Warranty" },
    { icon: Truck, text: "Nationwide Freight Dispatch & Pickup" },
    { icon: Zap, text: "45-Min Raipur Industrial Emergency SOS" },
  ];

  return (
    <div className="w-full bg-[#121212] border-y border-white/10 py-3.5 overflow-hidden font-mono text-xs text-zinc-300" data-testid="trust-marquee">
      <div className="flex w-max animate-marquee space-x-8">
        {[...items, ...items].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center space-x-2.5 shrink-0 px-3 py-1 rounded bg-white/5 border border-white/5">
              <Icon className="w-3.5 h-3.5 text-amber-400" />
              <span className="tracking-wide uppercase font-semibold">{item.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
