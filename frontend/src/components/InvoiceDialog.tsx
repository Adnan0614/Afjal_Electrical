import { useState } from "react";
import { Printer, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { buildInvoiceHtml, computeTotals, inr, invoiceNumberFor } from "@/lib/invoice";
import type { Lead } from "@/types";

interface Props {
  lead: Lead;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** GST invoice for a won quote: amount and work description stay editable before printing. */
export default function InvoiceDialog({ lead, open, onOpenChange }: Props): React.JSX.Element {
  const { t } = useI18n();
  const [amount, setAmount] = useState<string>(String(Math.round(lead.estimated_cost || 0)));
  const [description, setDescription] = useState<string>(
    `${lead.service_type || "Motor Rewinding"}${lead.capacity_hp ? ` — ${lead.capacity_hp}` : ""}${
      lead.wire_grade ? ` — ${lead.wire_grade}` : ""
    }`
  );

  const totals = computeTotals(Number(amount) || 0);

  const print = () => {
    // Rendered into a sandboxed hidden iframe via srcdoc — no document.write, no
    // script execution, and nothing injected into the dashboard's own DOM.
    const html = buildInvoiceHtml({ lead, description, amount: Number(amount) || 0 });
    const frame = document.createElement("iframe");
    frame.setAttribute("aria-hidden", "true");
    frame.setAttribute("sandbox", "allow-modals allow-same-origin");
    frame.style.position = "fixed";
    frame.style.width = "0";
    frame.style.height = "0";
    frame.style.border = "0";
    frame.style.opacity = "0";
    frame.srcdoc = html;

    frame.onload = () => {
      try {
        frame.contentWindow?.focus();
        frame.contentWindow?.print();
      } catch {
        toast.error(t("inv.printFailed"));
      }
      // Give the print dialog time to take ownership of the document.
      window.setTimeout(() => frame.remove(), 60_000);
    };

    document.body.appendChild(frame);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-[#141414] border border-white/20 text-white w-full max-w-[calc(100%-1.5rem)] sm:max-w-lg p-5 sm:p-7 max-h-[90vh] overflow-y-auto"
        data-testid="invoice-dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-heading font-black text-2xl uppercase tracking-tight text-left flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-amber-400" />
            {t("inv.title")}
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-400 font-sans text-left">
            {t("inv.desc")} • {invoiceNumberFor(lead)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-1 text-left">
          <div className="bg-[#0A0A0A] border border-white/10 rounded p-3 text-xs font-mono text-zinc-300 space-y-1">
            <div className="font-heading font-black text-base text-white uppercase">{lead.name}</div>
            <div>📞 {lead.phone} • 📍 {lead.location || "Raipur"}</div>
            <div className="text-zinc-500">{t("inv.quoteRef")}: {lead.id}</div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-mono text-zinc-300">{t("inv.work")}</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-[#0A0A0A] border-white/15 text-white font-sans text-sm"
              data-testid="invoice-description-input"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-mono text-zinc-300">{t("inv.amount")}</Label>
            <Input
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ""))}
              className="bg-[#0A0A0A] border-white/15 text-white font-mono text-base"
              data-testid="invoice-amount-input"
            />
          </div>

          <div className="bg-[#0A0A0A] border border-amber-500/30 rounded p-3.5 space-y-1.5 font-mono text-xs">
            <div className="flex justify-between text-zinc-300">
              <span>{t("inv.taxable")}</span>
              <span data-testid="invoice-taxable">{inr(totals.taxable)}</span>
            </div>
            <div className="flex justify-between text-zinc-300">
              <span>{t("inv.cgst")}</span>
              <span data-testid="invoice-cgst">{inr(totals.cgst)}</span>
            </div>
            <div className="flex justify-between text-zinc-300">
              <span>{t("inv.sgst")}</span>
              <span data-testid="invoice-sgst">{inr(totals.sgst)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-white/10 text-emerald-400 font-bold text-base">
              <span>{t("inv.total")}</span>
              <span data-testid="invoice-total">{inr(totals.total)}</span>
            </div>
          </div>

          <Button
            onClick={print}
            className="w-full bg-[#FF7B00] hover:bg-[#E66A00] text-black font-heading font-black text-base uppercase py-5 rounded-sm cursor-pointer"
            data-testid="invoice-print-button"
          >
            <Printer className="w-4 h-4 mr-2" />
            {t("inv.print")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
