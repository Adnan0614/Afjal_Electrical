import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FileStack, Plus, Trash2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { apiDelete, apiGet, apiPost } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import { logError } from "@/lib/logger";
import { inr } from "@/lib/invoice";
import { invoiceTotals } from "@/lib/quotation";
import QuotationEditor from "@/components/QuotationEditor";
import type { Quotation, QuotationCreate } from "@/types";

const STATUS_CLASS: Record<Quotation["status"], string> = {
  draft: "bg-zinc-600/25 text-zinc-300 border-white/15",
  sent: "bg-cyan-500/15 text-cyan-300 border-cyan-500/40",
  approved: "bg-violet-500/15 text-violet-300 border-violet-500/40",
  ordered: "bg-amber-500/15 text-amber-300 border-amber-500/40",
  invoiced: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
};

/** Requirement list + creation. Selecting one opens the option/work-item editor. */
export default function OwnerQuotations(): React.JSX.Element {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [openId, setOpenId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<QuotationCreate>({
    customer_name: "",
    customer_phone: "",
    customer_location: "",
    requirement: "",
  });

  const { data: quotations = [] } = useQuery<Quotation[]>({
    queryKey: ["quotations"],
    queryFn: () => apiGet<Quotation[]>("/quotations"),
  });

  const createMutation = useMutation<Quotation, Error, QuotationCreate>({
    mutationFn: (payload) => apiPost<Quotation>("/quotations", payload),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
      toast.success(`${t("qt.created")} ${created.id}`);
      setForm({ customer_name: "", customer_phone: "", customer_location: "", requirement: "" });
      setShowForm(false);
      setOpenId(created.id);
    },
    onError: (err) => {
      logError("OwnerQuotations.create", err);
      toast.error(t("qt.createError"));
    },
  });

  const deleteMutation = useMutation<Quotation, Error, string>({
    mutationFn: (id) => apiDelete<Quotation>(`/quotations/${id}`),
    onSuccess: (deleted) => {
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
      if (openId === deleted.id) setOpenId(null);
      toast.success(t("qt.deleted"));
    },
    onError: (err) => {
      logError("OwnerQuotations.delete", err);
      toast.error(t("qt.deleteError"));
    },
  });

  const openQuotation = quotations.find((q) => q.id === openId);
  if (openQuotation) {
    return <QuotationEditor quotation={openQuotation} onClose={() => setOpenId(null)} />;
  }

  return (
    <div className="space-y-5 text-left" data-testid="owner-quotations-panel">
      <div className="bg-[#141414] border border-white/10 rounded-md p-6 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <h3 className="font-heading font-black text-xl text-white uppercase flex items-center gap-2">
              <FileStack className="w-5 h-5 text-amber-400" />
              {t("qt.title")}
            </h3>
            <p className="text-xs font-sans text-zinc-400 max-w-3xl">{t("qt.desc")}</p>
          </div>
          <Button
            onClick={() => setShowForm((v) => !v)}
            className="bg-[#FF7B00] hover:bg-[#E66A00] text-black font-heading font-black text-sm uppercase px-5 py-4 rounded-sm cursor-pointer"
            data-testid="quotation-new-toggle"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            {t("qt.new")}
          </Button>
        </div>

        {showForm && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!form.customer_name.trim() || !form.customer_phone.trim() || !form.requirement.trim()) {
                toast.error(t("qt.validation"));
                return;
              }
              createMutation.mutate(form);
            }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10"
            data-testid="quotation-create-form"
          >
            <div className="space-y-1.5">
              <Label className="text-xs font-mono text-zinc-300">{t("qt.customer")}</Label>
              <Input
                value={form.customer_name}
                onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                className="bg-[#0A0A0A] border-white/15 text-white font-sans text-sm"
                data-testid="quotation-customer-input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-mono text-zinc-300">{t("qt.phone")}</Label>
              <Input
                value={form.customer_phone}
                onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
                className="bg-[#0A0A0A] border-white/15 text-white font-mono text-sm"
                data-testid="quotation-phone-input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-mono text-zinc-300">{t("qt.location")}</Label>
              <Input
                value={form.customer_location || ""}
                onChange={(e) => setForm({ ...form, customer_location: e.target.value })}
                className="bg-[#0A0A0A] border-white/15 text-white font-sans text-sm"
                data-testid="quotation-location-input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-mono text-zinc-300">{t("qt.requirement")}</Label>
              <Textarea
                rows={2}
                value={form.requirement}
                onChange={(e) => setForm({ ...form, requirement: e.target.value })}
                placeholder={t("qt.requirementPh")}
                className="bg-[#0A0A0A] border-white/15 text-white font-sans text-sm"
                data-testid="quotation-requirement-input"
              />
            </div>
            <div className="sm:col-span-2">
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-black text-sm uppercase px-6 py-4 rounded-sm cursor-pointer"
                data-testid="quotation-create-button"
              >
                {createMutation.isPending ? t("own.saving") : t("qt.createBtn")}
              </Button>
            </div>
          </form>
        )}
      </div>

      <div className="space-y-3">
        {quotations.length === 0 && (
          <div className="bg-[#141414] border border-white/10 rounded p-8 text-center text-xs font-mono text-zinc-500" data-testid="quotations-empty">
            {t("qt.empty")}
          </div>
        )}

        {quotations.map((q) => {
          const totals = invoiceTotals(q);
          return (
            <div
              key={q.id}
              className="bg-[#141414] border border-white/10 hover:border-amber-500/40 rounded-md p-5 flex flex-wrap items-start justify-between gap-4 transition-colors"
              data-testid={`quotation-row-${q.id}`}
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                    {q.id}
                  </span>
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${STATUS_CLASS[q.status]}`} data-testid={`quotation-status-${q.id}`}>
                    {t(`qt.status.${q.status}`)}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500">
                    {q.options.length} {t("qt.optionsCount")} • {q.work_items.length} {t("qt.worksCount")}
                  </span>
                </div>
                <div className="font-heading font-black text-xl text-white uppercase">{q.customer_name}</div>
                <div className="text-xs font-sans text-zinc-400 max-w-2xl">{q.requirement}</div>
                <div className="text-[11px] font-mono text-zinc-500">
                  📞 {q.customer_phone} • 📍 {q.customer_location || "—"}
                </div>
              </div>

              <div className="space-y-2 text-right shrink-0">
                <div>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">{t("qt.grandTotal")}</div>
                  <div className="font-mono font-bold text-2xl text-emerald-400">{inr(totals.total)}</div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    onClick={() => setOpenId(q.id)}
                    size="sm"
                    className="bg-[#FF7B00] hover:bg-[#E66A00] text-black font-mono text-[11px] font-bold cursor-pointer"
                    data-testid={`quotation-open-${q.id}`}
                  >
                    {t("qt.open")}
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                  <Button
                    onClick={() => deleteMutation.mutate(q.id)}
                    variant="outline"
                    size="sm"
                    className="border-red-500/40 text-red-300 bg-red-950/30 font-mono text-[11px] cursor-pointer"
                    data-testid={`quotation-delete-${q.id}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
