import type { QuoteOption, WorkItem, Quotation } from "@/types";
import { inr } from "@/lib/invoice";

export const OPTION_LIMIT = 5;
export const WORK_UNITS = ["Job", "Nos", "Mtr", "Hour", "Trip", "Kg"] as const;
export const QUOTATION_STATUSES = ["draft", "sent", "approved", "ordered", "invoiced"] as const;

export interface LineTotals {
  gross: number;
  discount: number;
  taxable: number;
  tax: number;
  total: number;
}

const round = (n: number): number => Math.round(n * 100) / 100;

function lineTotals(gross: number, discountPercent: number, taxPercent: number): LineTotals {
  const safeGross = Math.max(0, gross);
  const discount = round((safeGross * Math.max(0, discountPercent)) / 100);
  const taxable = round(safeGross - discount);
  const tax = round((taxable * Math.max(0, taxPercent)) / 100);
  return { gross: round(safeGross), discount, taxable, tax, total: round(taxable + tax) };
}

/** Quantity × unit price, then discount, then GST. */
export function optionTotals(option: QuoteOption): LineTotals {
  return lineTotals(option.quantity * option.unit_price, option.discount_percent, option.tax_percent);
}

/** Work line = quantity × rate + material + labour, then discount, then GST. */
export function workItemTotals(item: WorkItem): LineTotals {
  const gross = item.quantity * item.rate + item.material_cost + item.labour_cost;
  return lineTotals(gross, item.discount_percent, item.tax_percent);
}

export interface DocumentTotals extends LineTotals {
  cgst: number;
  sgst: number;
}

/** Invoice roll-up: every work line plus the approved equipment option, if any. */
export function invoiceTotals(quotation: Quotation): DocumentTotals {
  const lines: LineTotals[] = quotation.work_items.map(workItemTotals);
  const selected = quotation.options.find((o) => o.id === quotation.selected_option_id);
  if (selected) lines.push(optionTotals(selected));

  const sum = (pick: (l: LineTotals) => number): number => round(lines.reduce((s, l) => s + pick(l), 0));
  const tax = sum((l) => l.tax);
  return {
    gross: sum((l) => l.gross),
    discount: sum((l) => l.discount),
    taxable: sum((l) => l.taxable),
    tax,
    total: sum((l) => l.total),
    cgst: round(tax / 2),
    sgst: round(tax / 2),
  };
}

export function emptyOption(index: number): Omit<QuoteOption, "id"> & { id: string } {
  return {
    id: `NEW-${Date.now()}-${index}`,
    product_name: "",
    brand: "",
    model: "",
    specifications: "",
    quantity: 1,
    unit_price: 0,
    tax_percent: 18,
    discount_percent: 0,
    supplier: "",
    warranty: "6 months",
    delivery_time: "3-5 days",
    remarks: "",
  };
}

export function emptyWorkItem(index: number): WorkItem {
  return {
    id: `NEW-${Date.now()}-${index}`,
    description: "",
    quantity: 1,
    unit: "Job",
    rate: 0,
    material_cost: 0,
    labour_cost: 0,
    discount_percent: 0,
    tax_percent: 18,
    status: "pending",
    remarks: "",
  };
}

/** Printable multi-line GST invoice for a quotation's work items + approved option. */
export function buildQuotationInvoiceHtml(quotation: Quotation): string {
  const totals = invoiceTotals(quotation);
  const selected = quotation.options.find((o) => o.id === quotation.selected_option_id);

  const rows: string[] = [];
  quotation.work_items.forEach((item, idx) => {
    const t = workItemTotals(item);
    rows.push(`<tr>
      <td>${idx + 1}</td>
      <td>${item.description || "Work item"}${item.remarks ? `<br/><span class="muted">${item.remarks}</span>` : ""}</td>
      <td>${item.quantity} ${item.unit}</td>
      <td class="num">${inr(item.rate)}</td>
      <td class="num">${item.discount_percent}%</td>
      <td class="num">${item.tax_percent}%</td>
      <td class="num">${inr(t.total)}</td>
    </tr>`);
  });

  if (selected) {
    const t = optionTotals(selected);
    rows.push(`<tr>
      <td>${rows.length + 1}</td>
      <td><strong>${selected.product_name}</strong>${
        selected.brand || selected.model ? `<br/><span class="muted">${[selected.brand, selected.model].filter(Boolean).join(" ")}</span>` : ""
      }${selected.specifications ? `<br/><span class="muted">${selected.specifications}</span>` : ""}</td>
      <td>${selected.quantity} Nos</td>
      <td class="num">${inr(selected.unit_price)}</td>
      <td class="num">${selected.discount_percent}%</td>
      <td class="num">${selected.tax_percent}%</td>
      <td class="num">${inr(t.total)}</td>
    </tr>`);
  }

  return `<!doctype html><html><head><meta charset="utf-8" />
<title>Tax Invoice ${quotation.id}</title>
<style>
  * { box-sizing:border-box; }
  body { font-family:"Helvetica Neue", Arial, sans-serif; color:#111; margin:0; padding:30px; }
  h1 { font-size:19px; margin:0; text-transform:uppercase; letter-spacing:.5px; }
  .top { display:flex; justify-content:space-between; gap:24px; border-bottom:3px solid #FF7B00; padding-bottom:14px; }
  .muted { color:#666; font-size:10.5px; line-height:1.55; }
  .tag { display:inline-block; background:#111; color:#fff; font-size:11px; padding:4px 10px; letter-spacing:1px; }
  table { width:100%; border-collapse:collapse; margin-top:16px; font-size:11.5px; }
  td, th { border:1px solid #ddd; padding:7px 9px; text-align:left; vertical-align:top; }
  th { background:#f3f3f3; text-transform:uppercase; font-size:9.5px; letter-spacing:.5px; }
  .num { text-align:right; white-space:nowrap; }
  .totals { width:330px; margin-left:auto; }
  .totals td { border:none; }
  .totals .k { color:#444; }
  .totals .v { text-align:right; }
  .totals .grand td { border-top:2px solid #111; font-size:15px; font-weight:bold; padding-top:9px; }
  .foot { margin-top:26px; display:flex; justify-content:space-between; font-size:10.5px; color:#444; }
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
        Invoice No: <strong>${quotation.id}</strong><br/>
        Date: <strong>${new Date().toLocaleDateString("en-IN")}</strong><br/>
        Status: ${quotation.status.toUpperCase()}
      </div>
    </div>
  </div>

  <table>
    <tr><th style="width:50%">Billed To</th><th>Requirement</th></tr>
    <tr>
      <td><strong>${quotation.customer_name}</strong><br/>${quotation.customer_location || "Raipur, Chhattisgarh"}<br/>Phone: ${quotation.customer_phone}</td>
      <td>${quotation.requirement}${selected?.supplier ? `<br/><span class="muted">Supplier: ${selected.supplier}</span>` : ""}${
        selected?.warranty ? `<br/><span class="muted">Warranty: ${selected.warranty}</span>` : ""
      }</td>
    </tr>
  </table>

  <table>
    <tr>
      <th>#</th><th>Description of Work / Equipment</th><th>Qty</th>
      <th class="num">Rate</th><th class="num">Disc</th><th class="num">GST</th><th class="num">Line Total</th>
    </tr>
    ${rows.join("") || `<tr><td colspan="7" class="muted">No items added.</td></tr>`}
  </table>

  <table class="totals">
    <tr><td class="k">Subtotal</td><td class="v">${inr(totals.gross)}</td></tr>
    <tr><td class="k">Discount</td><td class="v">- ${inr(totals.discount)}</td></tr>
    <tr><td class="k">Taxable Value</td><td class="v">${inr(totals.taxable)}</td></tr>
    <tr><td class="k">CGST</td><td class="v">${inr(totals.cgst)}</td></tr>
    <tr><td class="k">SGST</td><td class="v">${inr(totals.sgst)}</td></tr>
    <tr class="grand"><td>Grand Total</td><td class="v">${inr(totals.total)}</td></tr>
  </table>

  ${quotation.notes ? `<p class="muted" style="margin-top:18px"><strong>Notes:</strong> ${quotation.notes}</p>` : ""}

  <div class="foot">
    <div>6-month written warranty on rewinding workmanship.<br/>100% dual-coated electrolytic copper used.</div>
    <div style="text-align:right">For Afjal Electrical and Rewinding Works<br/><br/><br/><strong>Mohammad Afjal</strong><br/>Proprietor</div>
  </div>
</body></html>`;
}

/** Renders any invoice HTML into a sandboxed hidden iframe and prints it. */
export function printHtml(html: string, onError?: () => void): void {
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
      onError?.();
    }
    window.setTimeout(() => frame.remove(), 60_000);
  };
  document.body.appendChild(frame);
}
