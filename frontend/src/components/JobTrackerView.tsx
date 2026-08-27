import { useState } from "react";
import { Search, CheckCircle2, Clock, Activity, ShieldCheck, AlertCircle, Cpu, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { apiGet } from "@/lib/api";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import type { JobTracker } from "@/types";

interface JobTrackerViewProps {
  initialJobId?: string;
}

export default function JobTrackerView({ initialJobId = "AE-2024-8901" }: JobTrackerViewProps) {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState(initialJobId);
  const [currentJob, setCurrentJob] = useState<JobTracker | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const sampleIds = ["AE-2024-8901", "AE-2024-8902", "AE-2024-8903"];

  const handleLookup = async (idToSearch?: string) => {
    const term = (idToSearch || searchQuery).trim();
    if (!term) {
      toast.error(t("trk.emptyError"));
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    try {
      const data = await apiGet<JobTracker>(`/jobs/${encodeURIComponent(term)}`);
      setCurrentJob(data);
      toast.success(`${t("trk.loaded")} #${data.job_id}`);
    } catch (err) {
      console.error(err);
      setCurrentJob(null);
      toast.error(`${t("trk.noRecord")} "${term}". ${t("trk.trySample")}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="tracker" className="py-16 sm:py-24 bg-[#0A0A0A] border-b border-white/10" data-testid="job-tracker-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-left max-w-3xl mb-10">
          <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 font-mono text-xs uppercase mb-3">
            <Activity className="w-3.5 h-3.5 mr-1.5" />
            {t("trk.badge")}
          </Badge>
          <h2 className="font-heading font-black text-3xl sm:text-5xl uppercase text-white tracking-tight">{t("trk.heading")}</h2>
          <p className="text-zinc-300 text-sm sm:text-base font-sans mt-2">{t("trk.sub")}</p>
        </div>

        <div className="bg-[#141414] border border-white/10 rounded-md p-6 max-w-4xl space-y-4 text-left">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input
                placeholder={t("trk.placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                className="pl-10 bg-[#0A0A0A] border-white/20 text-white font-mono h-12 text-sm"
                data-testid="tracker-search-input"
              />
            </div>
            <Button
              onClick={() => handleLookup()}
              disabled={isLoading}
              className="bg-[#FF7B00] hover:bg-[#E66A00] text-black font-heading font-black text-base uppercase px-8 h-12 rounded-sm cursor-pointer"
              data-testid="tracker-search-button"
            >
              {isLoading ? t("trk.searching") : t("trk.searchBtn")}
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-400 pt-1">
            <span>{t("trk.samples")}</span>
            {sampleIds.map((sid) => (
              <button
                key={sid}
                type="button"
                onClick={() => { setSearchQuery(sid); handleLookup(sid); }}
                className="bg-white/5 hover:bg-amber-500/20 hover:text-amber-300 text-zinc-300 border border-white/10 px-2.5 py-1 rounded transition-colors cursor-pointer"
                data-testid={`tracker-sample-${sid}`}
              >
                {sid}
              </button>
            ))}
          </div>
        </div>

        {currentJob && (
          <div className="mt-8 bg-[#121212] border-2 border-amber-500/40 rounded-md p-6 sm:p-8 space-y-8 electric-glow text-left animate-in fade-in-50 duration-300" data-testid="job-details-container">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 border-b border-white/10 pb-6">
              <div className="lg:col-span-8 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-base font-bold text-amber-400 bg-amber-500/15 border border-amber-500/40 px-2.5 py-0.5 rounded">
                    {t("trk.job")} #{currentJob.job_id}
                  </span>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 text-xs font-mono">
                    {currentJob.current_stage}
                  </Badge>
                  <span className="text-xs font-mono text-zinc-400">
                    {t("trk.warranty")} {currentJob.warranty_months} {t("trk.months")}
                  </span>
                </div>

                <h3 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
                  {currentJob.equipment_name}
                </h3>
                <p className="text-xs sm:text-sm font-mono text-zinc-300">{currentJob.equipment_specs}</p>
                <div className="text-xs text-zinc-400 font-sans pt-1">
                  {t("trk.customer")} <strong className="text-zinc-200">{currentJob.customer_name}</strong>{" "}
                  {currentJob.company_name && `(${currentJob.company_name})`}
                </div>
              </div>

              <div className="lg:col-span-4 bg-[#181818] border border-white/10 rounded p-4 space-y-3">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-zinc-400">{t("trk.progress")}</span>
                  <span className="text-amber-400 font-bold text-base">{currentJob.status_percentage}%</span>
                </div>

                <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-[#FF7B00] h-full transition-all duration-500"
                    style={{ width: `${currentJob.status_percentage}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1 text-zinc-400">
                  <div>
                    <span className="block text-zinc-500">{t("trk.intake")}</span>
                    <strong className="text-zinc-200">{currentJob.intake_date}</strong>
                  </div>
                  <div>
                    <span className="block text-zinc-500">{t("trk.dispatch")}</span>
                    <strong className="text-cyan-400">{currentJob.estimated_delivery}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-heading font-black text-xl text-white uppercase flex items-center gap-2">
                <Wrench className="w-5 h-5 text-amber-400" />
                {t("trk.stagesTitle")}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {currentJob.steps.map((step) => (
                  <div
                    key={step.step_number}
                    className={`p-4 rounded border transition-all ${
                      step.completed
                        ? "bg-emerald-950/20 border-emerald-500/40 text-zinc-200"
                        : "bg-[#161616] border-white/5 text-zinc-500 opacity-60"
                    }`}
                    data-testid={`job-step-${step.step_number}`}
                  >
                    <div className="flex items-center justify-between font-mono text-xs mb-1.5">
                      <span className="text-zinc-400 font-bold">{t("trk.stage")} 0{step.step_number}</span>
                      {step.completed ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px] font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> {t("trk.done")}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-zinc-500 text-[11px]">
                          <Clock className="w-3 h-3" /> {t("trk.queued")}
                        </span>
                      )}
                    </div>
                    <div className="font-heading font-bold text-base text-white uppercase">{step.title}</div>
                    <p className="text-[11px] font-sans text-zinc-400 mt-1">{step.description}</p>
                    {step.completed_at && (
                      <div className="text-[10px] font-mono text-zinc-500 mt-2">
                        {t("trk.completedAt")} {step.completed_at}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {currentJob.test_readings && currentJob.test_readings.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-white/10">
                <h4 className="font-heading font-black text-xl text-white uppercase flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                  {t("trk.readingsTitle")}
                </h4>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs border border-white/10 rounded">
                    <thead className="bg-[#181818] text-zinc-400 uppercase text-[11px]">
                      <tr>
                        <th className="p-3 border-b border-white/10">{t("trk.thParam")}</th>
                        <th className="p-3 border-b border-white/10">{t("trk.thValue")}</th>
                        <th className="p-3 border-b border-white/10">{t("trk.thSpec")}</th>
                        <th className="p-3 border-b border-white/10">{t("trk.thStatus")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-[#0F0F0F]">
                      {currentJob.test_readings.map((reading, idx) => (
                        <tr key={idx} className="hover:bg-white/5">
                          <td className="p-3 text-zinc-200">{reading.parameter}</td>
                          <td className="p-3 font-bold text-amber-400">{reading.value}</td>
                          <td className="p-3 text-zinc-400">{reading.standard_spec}</td>
                          <td className="p-3">
                            <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {reading.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {currentJob.technician_notes && (
              <div className="bg-amber-950/20 border border-amber-500/30 rounded p-4 text-xs font-sans text-zinc-300">
                <div className="flex items-center gap-2 text-amber-400 font-heading font-bold uppercase text-sm mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  {t("trk.notesTitle")}
                </div>
                <p className="text-zinc-300 italic">"{currentJob.technician_notes}"</p>
                <div className="mt-2 text-[11px] font-mono text-zinc-500">
                  {t("trk.wireGrade")} {currentJob.wire_type}
                </div>
              </div>
            )}
          </div>
        )}

        {hasSearched && !currentJob && !isLoading && (
          <div className="mt-8 bg-[#141414] border border-white/10 rounded p-8 text-center max-w-xl mx-auto space-y-3" data-testid="job-not-found">
            <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
            <h4 className="font-heading font-black text-xl text-white uppercase">{t("trk.notFound")}</h4>
            <p className="text-xs text-zinc-400">
              {t("trk.notFoundDesc1")} <code>AE-2024-8901</code>{t("trk.notFoundDesc2")}{" "}
              <a href="tel:+919669718100" className="text-amber-400 font-bold">+91 9669718100</a>.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
