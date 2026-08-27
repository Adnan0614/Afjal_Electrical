import { Shield, Zap, CheckCircle, Award, Activity, Truck, Cpu } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function TrustMarquee() {
  const { t } = useI18n();

  const items = [
    { icon: Shield, key: "trust.classB" },
    { icon: Zap, key: "trust.wireman" },
    { icon: Cpu, key: "trust.copper" },
    { icon: Activity, key: "trust.megger" },
    { icon: Award, key: "trust.balancing" },
    { icon: CheckCircle, key: "trust.warranty" },
    { icon: Truck, key: "trust.freight" },
    { icon: Zap, key: "trust.sos" },
  ];

  return (
    <div className="w-full bg-[#121212] border-y border-white/10 py-3.5 overflow-hidden font-mono text-xs text-zinc-300" data-testid="trust-marquee">
      <div className="flex w-max animate-marquee space-x-8">
        {[...items, ...items].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center space-x-2.5 shrink-0 px-3 py-1 rounded bg-white/5 border border-white/5">
              <Icon className="w-3.5 h-3.5 text-amber-400" />
              <span className="tracking-wide uppercase font-semibold">{t(item.key)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
