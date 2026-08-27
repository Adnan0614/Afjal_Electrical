import { Wrench, CheckCircle2, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

interface ServicesBentoProps {
  onSelectService: (serviceName: string) => void;
}

export default function ServicesBento({ onSelectService }: ServicesBentoProps) {
  const { t } = useI18n();

  const services = [
    { id: "motor_rewinding", number: "01", n: 1, colSpan: "lg:col-span-8" },
    { id: "panel_switchgear", number: "02", n: 2, colSpan: "lg:col-span-4" },
    { id: "contracting", number: "03", n: 3, colSpan: "lg:col-span-4" },
    { id: "transformer", number: "04", n: 4, colSpan: "lg:col-span-4" },
    { id: "breakdown_amc", number: "05", n: 5, colSpan: "lg:col-span-4" },
  ];

  return (
    <section id="services" className="py-16 sm:py-24 bg-[#0A0A0A] border-b border-white/10" data-testid="services-bento-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-left max-w-3xl mb-12">
          <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 font-mono text-xs uppercase mb-3">
            <Wrench className="w-3.5 h-3.5 mr-1.5" />
            {t("svc.badge")}
          </Badge>
          <h2 className="font-heading font-black text-3xl sm:text-5xl uppercase text-white tracking-tight">
            {t("svc.heading")}
          </h2>
          <p className="text-zinc-300 text-sm sm:text-base font-sans mt-2">{t("svc.sub")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {services.map((srv) => (
            <div
              key={srv.id}
              className={`${srv.colSpan} bg-gradient-to-b from-[#161616] to-[#101010] border border-white/10 rounded-md overflow-hidden flex flex-col justify-between group hover:border-amber-500/50 transition-all duration-300 text-left`}
              data-testid={`service-card-${srv.id}`}
            >
              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xl font-black text-amber-500/40 group-hover:text-amber-400 transition-colors">
                    {srv.number}
                  </span>
                  <Badge variant="outline" className="font-mono text-[11px] border-amber-500/40 text-amber-400 bg-amber-500/10">
                    {t(`svc${srv.n}.tag`)}
                  </Badge>
                </div>

                <h3 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-tight group-hover:text-amber-300 transition-colors">
                  {t(`svc${srv.n}.title`)}
                </h3>

                <p className="font-sans text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {t(`svc${srv.n}.desc`)}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {[1, 2, 3, 4].map((si) => (
                    <div key={si} className="flex items-center gap-2 text-xs font-mono text-zinc-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{t(`svc${srv.n}.s${si}`)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 sm:px-8 sm:pb-8 pt-0 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 mt-4">
                <Button
                  onClick={() => onSelectService(t(`svc${srv.n}.title`))}
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-zinc-200 group-hover:border-amber-400 group-hover:text-white bg-[#0A0A0A] font-mono text-xs cursor-pointer"
                  data-testid={`service-quote-btn-${srv.id}`}
                >
                  {t("svc.estimateBtn")}
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </Button>

                <a href="tel:+919669718100" className="text-xs font-mono text-zinc-400 hover:text-amber-400">
                  {t("svc.callUs")}
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
