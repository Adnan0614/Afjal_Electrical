import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Lock, Zap, LogOut, ArrowLeft, Phone, MessageCircle, CheckCircle2,
  ImageIcon, IndianRupee, Siren, Wrench, FileText,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { apiGet, apiPost, apiPut, apiPatch } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import LanguageToggle from "@/components/LanguageToggle";
import OwnerReviews from "@/components/OwnerReviews";
import OwnerSales from "@/components/OwnerSales";
import InvoiceDialog from "@/components/InvoiceDialog";
import { needsFollowUp, idleDays } from "@/lib/invoice";
import {
  LEAD_STATUSES, LEAD_STATUS_CLASS, LEAD_STATUS_LABEL_KEY, normalizeStatus,
} from "@/lib/leadStatus";
import type { LeadStatusValue } from "@/lib/leadStatus";
import type {
  AuthStatus, Lead, EmergencyDispatch, JobTracker, SiteMedia, GalleryItem, StageAdvanceResult,
} from "@/types";

type Tab = "quotes" | "emergency" | "jobs" | "photos" | "reviews" | "sales";

export default function Owner() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [pin, setPin] = useState("");
  const [tab, setTab] = useState<Tab>("quotes");
  const [statusFilter, setStatusFilter] = useState<LeadStatusValue | "all" | "followup">("all");
  const [invoiceLead, setInvoiceLead] = useState<Lead | null>(null);

  const { data: auth, isLoading: authLoading } = useQuery<AuthStatus>({
    queryKey: ["auth-me"],
    queryFn: () => apiGet<AuthStatus>("/auth/me"),
    retry: false,
  });

  const isOwner = auth?.authenticated === true;

  const loginMutation = useMutation({
    mutationFn: (p: string) => apiPost<AuthStatus>("/auth/owner-login", { pin: p }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-me"] });
      toast.success(t("own.welcome"));
      setPin("");
    },
    onError: () => toast.error(t("own.wrongPin")),
  });

  const logoutMutation = useMutation({
    mutationFn: () => apiPost<AuthStatus>("/auth/logout", {}),
    onSuccess: () => {
      queryClient.clear();
      queryClient.invalidateQueries({ queryKey: ["auth-me"] });
    },
  });

  const { data: leads = [] } = useQuery<Lead[]>({
    queryKey: ["owner-leads"],
    queryFn: () => apiGet<Lead[]>("/leads"),
    enabled: isOwner,
  });

  const { data: tickets = [] } = useQuery<EmergencyDispatch[]>({
    queryKey: ["owner-tickets"],
    queryFn: () => apiGet<EmergencyDispatch[]>("/emergency-dispatch"),
    enabled: isOwner,
  });

  const { data: jobs = [] } = useQuery<JobTracker[]>({
    queryKey: ["owner-jobs"],
    queryFn: () => apiGet<JobTracker[]>("/jobs"),
    enabled: isOwner,
  });

  const { data: media } = useQuery<SiteMedia>({
    queryKey: ["site-media"],
    queryFn: () => apiGet<SiteMedia>("/settings/media"),
  });

  const advanceMutation = useMutation({
    mutationFn: (jobId: string) => apiPost<StageAdvanceResult>(`/jobs/${jobId}/advance`, {}),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["owner-jobs"] });
      toast.success(res.message);
    },
    onError: (err: any) => {
      toast.error(err?.body?.detail || "Could not update the job stage.");
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: LeadStatusValue }) =>
      apiPatch<Lead>(`/leads/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-leads"] });
      toast.success(t("pipe.updated"));
    },
    onError: () => toast.error(t("pipe.updateError")),
  });

  // ---- Login gate ----
  if (!authLoading && !isOwner) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] technical-grid flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#121212] border border-white/15 rounded-md p-6 sm:p-8 space-y-6 electric-glow">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-sm bg-gradient-to-br from-amber-500 to-[#D95B18] flex items-center justify-center">
              <Zap className="w-6 h-6 text-black fill-current" />
            </div>
            <LanguageToggle />
          </div>

          <div className="space-y-1.5 text-left">
            <Badge className="bg-amber-500/15 border border-amber-500/40 text-amber-400 font-mono text-[11px] uppercase">
              <Lock className="w-3 h-3 mr-1" />
              {t("own.loginTitle")}
            </Badge>
            <h1 className="font-heading font-black text-3xl uppercase text-white tracking-tight">
              {t("own.dashTitle")}
            </h1>
            <p className="text-xs text-zinc-400 font-sans">{t("own.loginDesc")}</p>
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); if (pin.trim()) loginMutation.mutate(pin.trim()); }}
            className="space-y-3 text-left"
          >
            <div className="space-y-1.5">
              <Label className="text-xs font-mono text-zinc-300">{t("own.pin")}</Label>
              <Input
                type="password"
                inputMode="numeric"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                className="bg-[#0A0A0A] border-white/15 text-white font-mono text-lg tracking-[0.4em] h-12 text-center"
                data-testid="owner-pin-input"
              />
            </div>
            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-[#FF7B00] hover:bg-[#E66A00] text-black font-heading font-black text-base uppercase py-5 rounded-sm cursor-pointer"
              data-testid="owner-login-button"
            >
              {loginMutation.isPending ? t("own.loggingIn") : t("own.loginBtn")}
            </Button>
          </form>

          <Link to="/" className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-amber-400">
            <ArrowLeft className="w-3.5 h-3.5" />
            {t("own.backToSite")}
          </Link>
        </div>
        <Toaster position="bottom-left" richColors />
      </div>
    );
  }

  const pipelineValue = leads.reduce((sum, l) => sum + (l.estimated_cost || 0), 0);
  const wonValue = leads
    .filter((l) => normalizeStatus(l.status) === "won")
    .reduce((sum, l) => sum + (l.estimated_cost || 0), 0);
  const staleLeads = leads.filter((l) => needsFollowUp(l, normalizeStatus(l.status)));
  const visibleLeads =
    statusFilter === "all"
      ? leads
      : statusFilter === "followup"
        ? staleLeads
        : leads.filter((l) => normalizeStatus(l.status) === statusFilter);

  const waLink = (phone: string, text: string) =>
    `https://wa.me/91${phone.replace(/\D/g, "").slice(-10)}?text=${encodeURIComponent(text)}`;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-amber-500 to-[#D95B18] flex items-center justify-center">
              <Zap className="w-5 h-5 text-black fill-current" />
            </div>
            <div className="text-left">
              <h1 className="font-heading font-black text-xl sm:text-2xl uppercase text-white tracking-tight leading-none">
                {t("own.dashTitle")}
              </h1>
              <p className="text-[11px] font-mono text-amber-400">{t("common.owner")} • Tilda Neora, Raipur</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LanguageToggle compact />
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-300 hover:text-amber-400 border border-white/15 bg-[#141414] px-3 py-2 rounded-sm"
              data-testid="owner-back-to-site"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {t("own.backToSite")}
            </Link>
            <Button
              onClick={() => logoutMutation.mutate()}
              variant="outline"
              size="sm"
              className="border-white/20 text-zinc-200 bg-[#141414] font-mono text-xs cursor-pointer"
              data-testid="owner-logout-button"
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" />
              {t("own.logout")}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          {([
            { label: t("own.statQuotes"), value: leads.length, icon: FileText, color: "text-amber-400", id: "quotes" },
            { label: t("own.statTickets"), value: tickets.length, icon: Siren, color: "text-red-400", id: "tickets" },
            { label: t("own.statJobs"), value: jobs.length, icon: Wrench, color: "text-cyan-400", id: "jobs" },
            { label: t("own.statValue"), value: `₹${pipelineValue.toLocaleString("en-IN")}`, icon: IndianRupee, color: "text-emerald-400", id: "value" },
            { label: t("pipe.wonValue"), value: `₹${wonValue.toLocaleString("en-IN")}`, icon: CheckCircle2, color: "text-lime-400", id: "won-value" },
          ]).map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.id} className="bg-[#141414] border border-white/10 rounded-md p-4" data-testid={`owner-stat-${s.id}`}>
                <Icon className={`w-4 h-4 ${s.color} mb-2`} />
                <div className={`font-heading font-black text-2xl sm:text-3xl ${s.color}`}>{s.value}</div>
                <div className="text-[11px] font-sans text-zinc-400">{s.label}</div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {([
            { id: "quotes", label: t("own.tabQuotes") },
            { id: "emergency", label: t("own.tabEmergency") },
            { id: "jobs", label: t("own.tabJobs") },
            { id: "photos", label: t("own.tabPhotos") },
            { id: "reviews", label: t("own.tabReviews") },
            { id: "sales", label: t("own.tabSales") },
          ] as { id: Tab; label: string }[]).map((tb) => (
            <button
              key={tb.id}
              onClick={() => setTab(tb.id)}
              className={`font-mono text-xs px-4 py-2 rounded border transition-colors cursor-pointer ${
                tab === tb.id
                  ? "bg-[#FF7B00] text-black font-bold border-[#FF7B00]"
                  : "bg-[#141414] border-white/10 text-zinc-300 hover:border-amber-400/40"
              }`}
              data-testid={`owner-tab-${tb.id}`}
            >
              {tb.label}
            </button>
          ))}
        </div>

        {/* ---- Quotes ---- */}
        {tab === "quotes" && (
          <div className="space-y-3 text-left" data-testid="owner-quotes-panel">
            {/* Pipeline filter */}
            <div className="flex flex-wrap gap-2 pb-2">
              {(["all", ...LEAD_STATUSES] as const).map((st) => {
                const count = st === "all" ? leads.length : leads.filter((l) => normalizeStatus(l.status) === st).length;
                return (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`font-mono text-[11px] px-3 py-1.5 rounded border transition-colors cursor-pointer ${
                      statusFilter === st
                        ? "bg-amber-500 text-black font-bold border-amber-500"
                        : "bg-[#181818] border-white/10 text-zinc-300 hover:border-amber-400/40"
                    }`}
                    data-testid={`owner-pipeline-filter-${st}`}
                  >
                    {st === "all" ? t("pipe.filterAll") : t(LEAD_STATUS_LABEL_KEY[st])} ({count})
                  </button>
                );
              })}
              <button
                onClick={() => setStatusFilter("followup")}
                title={t("pipe.followUpHint")}
                className={`font-mono text-[11px] px-3 py-1.5 rounded border transition-colors cursor-pointer ${
                  statusFilter === "followup"
                    ? "bg-red-600 text-white font-bold border-red-600"
                    : "bg-red-950/30 border-red-500/40 text-red-300 hover:border-red-400"
                }`}
                data-testid="owner-pipeline-filter-followup"
              >
                {t("pipe.followUp")} ({staleLeads.length})
              </button>
            </div>
            {visibleLeads.length === 0 && (
              <div className="bg-[#141414] border border-white/10 rounded p-8 text-center text-xs text-zinc-400">
                {statusFilter === "all" ? t("own.noQuotes") : t("pipe.noneInStage")}
              </div>
            )}
            {visibleLeads.map((lead) => (
              <div key={lead.id} className="bg-[#141414] border border-white/10 hover:border-amber-500/40 rounded-md p-5 transition-colors" data-testid={`owner-lead-${lead.id}`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                        {lead.id}
                      </span>
                      <Badge className={`border text-[10px] font-mono uppercase ${LEAD_STATUS_CLASS[normalizeStatus(lead.status)]}`} data-testid={`owner-lead-status-${lead.id}`}>
                        {t(LEAD_STATUS_LABEL_KEY[normalizeStatus(lead.status)])}
                      </Badge>
                      <span className="text-[11px] font-mono text-zinc-500">
                        {t("own.received")}: {new Date(lead.created_at).toLocaleString("en-IN")}
                      </span>
                      {needsFollowUp(lead, normalizeStatus(lead.status)) && (
                        <span
                          className="text-[10px] font-mono uppercase bg-red-600 text-white px-2 py-0.5 rounded animate-pulse"
                          data-testid={`owner-lead-followup-${lead.id}`}
                        >
                          {t("pipe.followUp")} • {t("pipe.idleDays").replace("{d}", String(idleDays(lead)))}
                        </span>
                      )}
                    </div>
                    <div className="font-heading font-black text-xl text-white uppercase">{lead.name}</div>
                    <div className="text-xs font-mono text-zinc-300">
                      {lead.service_type} • {lead.capacity_hp} {lead.wire_grade ? `• ${lead.wire_grade}` : ""}
                    </div>
                    <div className="text-xs font-sans text-zinc-400">
                      📍 {lead.location || "—"} • 📞 {lead.phone}
                    </div>
                    {lead.details && (
                      <div className="text-[11px] font-mono text-zinc-500 max-w-2xl">{lead.details}</div>
                    )}

                    {/* Pipeline stage switcher */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-2">
                      <span className="text-[10px] font-mono uppercase text-zinc-500 mr-1">{t("pipe.moveTo")}</span>
                      {LEAD_STATUSES.map((st) => {
                        const active = normalizeStatus(lead.status) === st;
                        return (
                          <button
                            key={st}
                            onClick={() => statusMutation.mutate({ id: lead.id, status: st })}
                            disabled={active || statusMutation.isPending}
                            className={`font-mono text-[10px] uppercase px-2.5 py-1 rounded border transition-colors ${
                              active
                                ? `${LEAD_STATUS_CLASS[st]} font-bold cursor-default`
                                : "bg-[#181818] border-white/10 text-zinc-400 hover:text-white hover:border-amber-400/50 cursor-pointer"
                            }`}
                            data-testid={`owner-lead-set-${st}-${lead.id}`}
                          >
                            {t(LEAD_STATUS_LABEL_KEY[st])}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2 text-right shrink-0">
                    <div>
                      <div className="text-[10px] font-mono text-zinc-500 uppercase">{t("own.estimated")}</div>
                      <div className="font-mono font-bold text-2xl text-emerald-400">
                        ₹{(lead.estimated_cost || 0).toLocaleString("en-IN")}
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <a
                        href={`tel:+91${lead.phone}`}
                        className="inline-flex items-center gap-1 text-[11px] font-mono bg-[#1C1C1C] border border-white/15 text-zinc-200 px-2.5 py-1.5 rounded hover:border-amber-400/50"
                      >
                        <Phone className="w-3 h-3 text-amber-400" />
                        {t("own.callCustomer")}
                      </a>
                      <a
                        href={waLink(lead.phone, `Hello ${lead.name}, regarding your quote ${lead.id} for ${lead.service_type} (${lead.capacity_hp}) — Afjal Electrical and Rewinding Works.`)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-mono bg-emerald-900/40 border border-emerald-500/40 text-emerald-300 px-2.5 py-1.5 rounded hover:bg-emerald-900/70"
                      >
                        <MessageCircle className="w-3 h-3" />
                        {t("own.whatsappCustomer")}
                      </a>
                      {normalizeStatus(lead.status) === "won" && (
                        <button
                          onClick={() => setInvoiceLead(lead)}
                          className="inline-flex items-center gap-1 text-[11px] font-mono bg-amber-500/15 border border-amber-500/50 text-amber-300 px-2.5 py-1.5 rounded hover:bg-amber-500/25 cursor-pointer"
                          data-testid={`owner-lead-invoice-${lead.id}`}
                        >
                          <FileText className="w-3 h-3" />
                          {t("inv.open")}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ---- Emergency tickets ---- */}
        {tab === "emergency" && (
          <div className="space-y-3 text-left" data-testid="owner-emergency-panel">
            {tickets.length === 0 && (
              <div className="bg-[#141414] border border-white/10 rounded p-8 text-center text-xs text-zinc-400">
                {t("own.noTickets")}
              </div>
            )}
            {tickets.map((tk) => (
              <div key={tk.id} className="bg-[#141414] border border-red-500/30 hover:border-red-500/60 rounded-md p-5 transition-colors" data-testid={`owner-ticket-${tk.id}`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-black text-white bg-red-600 px-2.5 py-0.5 rounded">{tk.id}</span>
                      <Badge className="bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] font-mono uppercase">
                        {tk.urgency_level}
                      </Badge>
                      <span className="text-[11px] font-mono text-zinc-500">
                        {new Date(tk.created_at).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="font-heading font-black text-xl text-white uppercase">
                      {tk.equipment_type}
                    </div>
                    <div className="text-xs font-mono text-zinc-300">
                      {tk.contact_name} • {tk.facility_name || "—"} • 📍 {tk.location_area}
                    </div>
                    <p className="text-xs font-sans text-zinc-400 max-w-2xl">{tk.problem_description}</p>
                  </div>

                  <div className="space-y-2 text-right shrink-0">
                    <div>
                      <div className="text-[10px] font-mono text-zinc-500 uppercase">{t("own.eta")}</div>
                      <div className="font-mono font-bold text-2xl text-amber-400">{tk.eta_minutes} {t("sos.minutes")}</div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <a
                        href={`tel:+91${tk.phone}`}
                        className="inline-flex items-center gap-1 text-[11px] font-mono bg-red-600 text-white px-2.5 py-1.5 rounded font-bold"
                      >
                        <Phone className="w-3 h-3 fill-current" />
                        {t("own.callCustomer")}
                      </a>
                      <a
                        href={waLink(tk.phone, `Hello ${tk.contact_name}, our technician team is responding to your emergency ticket ${tk.id}. — Mohammad Afjal, Afjal Electricals`)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-mono bg-emerald-900/40 border border-emerald-500/40 text-emerald-300 px-2.5 py-1.5 rounded"
                      >
                        <MessageCircle className="w-3 h-3" />
                        {t("own.whatsappCustomer")}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ---- Jobs with stage advance ---- */}
        {tab === "jobs" && (
          <div className="space-y-3 text-left" data-testid="owner-jobs-panel">
            {jobs.map((job) => {
              const doneCount = job.steps.filter((s) => s.completed).length;
              const nextStep = job.steps.find((s) => !s.completed);
              return (
                <div key={job.id} className="bg-[#141414] border border-white/10 rounded-md p-5 space-y-4" data-testid={`owner-job-${job.job_id}`}>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                          {job.job_id}
                        </span>
                        <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono">
                          {job.current_stage}
                        </Badge>
                        <span className="text-[11px] font-mono text-zinc-500">
                          {doneCount}/{job.steps.length} {t("own.stagesDone")}
                        </span>
                      </div>
                      <div className="font-heading font-black text-xl text-white uppercase">{job.equipment_name}</div>
                      <div className="text-xs font-mono text-zinc-400">
                        {job.customer_name} {job.company_name ? `• ${job.company_name}` : ""} • 📞 {job.phone}
                      </div>
                    </div>

                    <div className="shrink-0 space-y-2 w-full sm:w-64">
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className="text-zinc-400">{t("trk.progress")}</span>
                        <span className="text-amber-400 font-bold">{job.status_percentage}%</span>
                      </div>
                      <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-amber-500 to-[#FF7B00] h-full transition-all duration-500"
                          style={{ width: `${job.status_percentage}%` }}
                        />
                      </div>
                      {nextStep ? (
                        <Button
                          onClick={() => advanceMutation.mutate(job.job_id)}
                          disabled={advanceMutation.isPending}
                          className="w-full bg-[#FF7B00] hover:bg-[#E66A00] text-black font-heading font-black text-xs uppercase py-4 rounded-sm cursor-pointer"
                          data-testid={`owner-advance-${job.job_id}`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                          {advanceMutation.isPending ? t("own.advancing") : t("own.advanceStage")}
                        </Button>
                      ) : (
                        <div className="text-center text-[11px] font-mono text-emerald-400 border border-emerald-500/40 bg-emerald-950/30 py-2.5 rounded">
                          ✓ {t("own.jobComplete")}
                        </div>
                      )}
                      {nextStep && (
                        <div className="text-[10px] font-mono text-zinc-500 text-center">
                          {t("trk.stage")} {nextStep.step_number}: {nextStep.title}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ---- Photo manager ---- */}
        {tab === "photos" && media && (
          <PhotoManager media={media} />
        )}

        {/* ---- Reviews wall manager ---- */}
        {tab === "reviews" && <OwnerReviews />}

        {/* ---- Monthly sales ---- */}
        {tab === "sales" && <OwnerSales />}
      </main>

      {invoiceLead && (
        <InvoiceDialog
          lead={invoiceLead}
          open={invoiceLead !== null}
          onOpenChange={(open) => { if (!open) setInvoiceLead(null); }}
        />
      )}

      <Toaster position="bottom-left" richColors />
    </div>
  );
}

// Hoisted out of render per lint rule (react/only-export-components)
function PhotoManager({ media }: { media: SiteMedia }) {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<SiteMedia>(media);

  const saveMutation = useMutation({
    mutationFn: (payload: SiteMedia) => apiPut<SiteMedia>("/settings/media", payload),
    onSuccess: (saved) => {
      // Seed the cache from the server's response so the UI can never show a
      // stale read that races the write, then refresh in the background.
      queryClient.setQueryData(["site-media"], saved);
      setForm(saved);
      queryClient.invalidateQueries({ queryKey: ["site-media"] });
      toast.success(t("own.photosSaved"));
    },
    onError: () => toast.error("Could not save photos. Please check the image links."),
  });

  const setGalleryItem = (idx: number, patch: Partial<GalleryItem>) => {
    setForm((prev) => ({
      ...prev,
      gallery: prev.gallery.map((g, i) => (i === idx ? { ...g, ...patch } : g)),
    }));
  };

  return (
    <div className="space-y-6 text-left" data-testid="owner-photos-panel">
      <div className="bg-[#141414] border border-white/10 rounded-md p-6 space-y-5">
        <div className="space-y-1">
          <h3 className="font-heading font-black text-xl text-white uppercase flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-amber-400" />
            {t("own.photosTitle")}
          </h3>
          <p className="text-xs font-sans text-zinc-400 max-w-3xl">{t("own.photosDesc")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Before */}
          <div className="space-y-2">
            <Label className="text-xs font-mono text-zinc-300">{t("own.beforeImg")}</Label>
            <Input
              value={form.before_image_url}
              onChange={(e) => setForm({ ...form, before_image_url: e.target.value })}
              className="bg-[#0A0A0A] border-white/15 text-white font-mono text-xs"
              data-testid="photo-before-url"
            />
            <Label className="text-xs font-mono text-zinc-300">{t("own.beforeCap")}</Label>
            <Input
              value={form.before_caption}
              onChange={(e) => setForm({ ...form, before_caption: e.target.value })}
              className="bg-[#0A0A0A] border-white/15 text-white font-sans text-xs"
              data-testid="photo-before-caption"
            />
            <div className="text-[10px] font-mono text-zinc-500 pt-1">{t("own.preview")}</div>
            <img
              src={form.before_image_url}
              alt="Before preview"
              className="w-full h-40 object-cover rounded border border-white/10"
            />
          </div>

          {/* After */}
          <div className="space-y-2">
            <Label className="text-xs font-mono text-zinc-300">{t("own.afterImg")}</Label>
            <Input
              value={form.after_image_url}
              onChange={(e) => setForm({ ...form, after_image_url: e.target.value })}
              className="bg-[#0A0A0A] border-white/15 text-white font-mono text-xs"
              data-testid="photo-after-url"
            />
            <Label className="text-xs font-mono text-zinc-300">{t("own.afterCap")}</Label>
            <Input
              value={form.after_caption}
              onChange={(e) => setForm({ ...form, after_caption: e.target.value })}
              className="bg-[#0A0A0A] border-white/15 text-white font-sans text-xs"
              data-testid="photo-after-caption"
            />
            <div className="text-[10px] font-mono text-zinc-500 pt-1">{t("own.preview")}</div>
            <img
              src={form.after_image_url}
              alt="After preview"
              className="w-full h-40 object-cover rounded border border-white/10"
            />
          </div>
        </div>

        {/* Gallery */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          <h4 className="font-heading font-bold text-base text-white uppercase">{t("own.galleryTitle")}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {form.gallery.map((g, idx) => (
              <div key={`gallery-slot-${idx}`} className="bg-[#181818] border border-white/10 rounded p-3.5 space-y-2">
                <Label className="text-[11px] font-mono text-zinc-400">{t("own.galleryLabel")}</Label>
                <Input
                  value={g.label}
                  onChange={(e) => setGalleryItem(idx, { label: e.target.value })}
                  className="bg-[#0A0A0A] border-white/15 text-white font-sans text-xs h-9"
                  data-testid={`photo-gallery-label-${idx}`}
                />
                <Label className="text-[11px] font-mono text-zinc-400">{t("own.galleryUrl")}</Label>
                <Input
                  value={g.image_url}
                  onChange={(e) => setGalleryItem(idx, { image_url: e.target.value })}
                  className="bg-[#0A0A0A] border-white/15 text-white font-mono text-[11px] h-9"
                  data-testid={`photo-gallery-url-${idx}`}
                />
                <img src={g.image_url} alt={g.label} className="w-full h-24 object-cover rounded border border-white/10" />
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={() => saveMutation.mutate(form)}
          disabled={saveMutation.isPending}
          className="bg-[#FF7B00] hover:bg-[#E66A00] text-black font-heading font-black text-base uppercase px-6 py-5 rounded-sm cursor-pointer"
          data-testid="photo-save-button"
        >
          {saveMutation.isPending ? t("own.saving") : t("own.savePhotos")}
        </Button>
      </div>
    </div>
  );
}
