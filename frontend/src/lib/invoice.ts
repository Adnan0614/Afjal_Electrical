import type { Lead } from "@/types";

export const GST_RATE = 0.18; // 18% intra-state: CGST 9% + SGST 9%
export const FOLLOW_UP_DAYS = 3;

export interface InvoiceTotals {
  taxable: number;
  cgst: number;
  sgst: number;
  total: number;
}

/** Treats the entered rupee figure as the taxable value and adds CGST 9% + SGST 9%. */
export function computeTotals(taxableAmount: number): InvoiceTotals {
  const taxable = Math.max(0, Math.round(taxableAmount));
  const half = Math.round((taxable * GST_RATE) / 2);
  return { taxable, cgst: half, sgst: half, total: taxable + half * 2 };
}

export const inr = (n: number): string => `₹${n.toLocaleString("en-IN")}`;

export function invoiceNumberFor(lead: Lead): string {
  return `AE/${new Date().getFullYear()}/${lead.id.replace("LEAD-", "")}`;
}

/** Days since the quote was last touched (status change, else creation). */
export function idleDays(lead: Lead): number {
  const stamp = lead.updated_at || lead.created_at;
  const then = new Date(stamp).getTime();
  if (Number.isNaN(then)) return 0;
  return Math.floor((Date.now() - then) / 86_400_000);
}

/** A "called" quote gone quiet for 3+ days needs a nudge. */
export function needsFollowUp(lead: Lead, status: string): boolean {
  return status === "called" && idleDays(lead) >= FOLLOW_UP_DAYS;
}

interface InvoiceInput {
  lead: Lead;
  description: string;
  amount: number;
}

/** Self-contained printable invoice document — opened in a new window and printed. */
export function buildInvoiceHtml({ lead, description, amount }: InvoiceInput): string {
  const t = computeTotals(amount);
  const row = (label: string, value: string, strong = false) =>
    `<tr><td class="lbl">${label}</td><td class="val${strong ? " strong" : ""}">${value}</td></tr>`;

  return `<!doctype html><html><head><meta charset="utf-8" />
<title>Tax Invoice ${invoiceNumberFor(lead)}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: "Helvetica Neue", Arial, sans-serif; color:#111; margin:0; padding:32px; }
  h1 { font-size:20px; margin:0; letter-spacing:.5px; text-transform:uppercase; }
  .top { display:flex; justify-content:space-between; gap:24px; border-bottom:3px solid #FF7B00; padding-bottom:14px; }
  .muted { color:#555; font-size:11px; line-height:1.6; }
  .tag { display:inline-block; background:#111; color:#fff; font-size:11px; padding:4px 10px; letter-spacing:1px; }
  table { width:100%; border-collapse:collapse; margin-top:18px; font-size:12px; }
  td, th { border:1px solid #ddd; padding:8px 10px; text-align:left; }
  th { background:#f3f3f3; text-transform:uppercase; font-size:10px; letter-spacing:.6px; }
  .totals { width:320px; margin-left:auto; }
  .totals .lbl { border:none; color:#444; }
  .totals .val { border:none; text-align:right; }
  .totals .strong { font-size:16px; font-weight:bold; border-top:2px solid #111; }
  .foot { margin-top:28px; display:flex; justify-content:space-between; font-size:11px; color:#444; }
  @media print { body { padding:12px; } }
</style></head><body>
  <div class="top">
    <div>
      <h1>Afjal Electrical and Rewinding Works</h1>
      <div class="muted">
        Nagar Palika Road, Tilda Neora, Raipur, Chhattisgarh - 493114<br/>
        Phone: +91 9669718100 &nbsp;|&nbsp; GSTIN: 22BDBPM9804K2ZH<br/>
        Class-B Contractor Lic 08/626/B &nbsp;|&nbsp; Wireman Lic NR/10464
      </div>
    </div>
    <div style="text-align:right">
      <span class="tag">TAX INVOICE</span>
      <div class="muted" style="margin-top:8px">
        Invoice No: <strong>${invoiceNumberFor(lead)}</strong><br/>
        Date: <strong>${new Date().toLocaleDateString("en-IN")}</strong><br/>
        Quote Ref: ${lead.id}
      </div>
    </div>
  </div>

  <table>
    <tr><th style="width:50%">Billed To</th><th>Equipment / Service</th></tr>
    <tr>
      <td>
        <strong>${lead.name}</strong><br/>
        ${lead.location || "Raipur, Chhattisgarh"}<br/>
        Phone: ${lead.phone}
      </td>
      <td>
        ${lead.service_type || "Electrical Service"}<br/>
        ${lead.capacity_hp ? `Capacity: ${lead.capacity_hp}<br/>` : ""}
        ${lead.wire_grade ? `Wire: ${lead.wire_grade}` : ""}
      </td>
    </tr>
  </table>

  <table>
    <tr><th>#</th><th>Description of Work</th><th style="width:140px;text-align:right">Amount</th></tr>
    <tr><td>1</td><td>${description}</td><td style="text-align:right">${inr(t.taxable)}</td></tr>
  </table>

  <table class="totals">
    ${row("Taxable Value", inr(t.taxable))}
    ${row("CGST @ 9%", inr(t.cgst))}
    ${row("SGST @ 9%", inr(t.sgst))}
    ${row("Total Payable", inr(t.total), true)}
  </table>

  <div class="foot">
    <div>
      6-month written warranty on rewinding workmanship.<br/>
      100% dual-coated electrolytic copper used.
    </div>
    <div style="text-align:right">
      For Afjal Electrical and Rewinding Works<br/><br/><br/>
      <strong>Mohammad Afjal</strong><br/>Proprietor
    </div>
  </div>
</body></html>`;
}
