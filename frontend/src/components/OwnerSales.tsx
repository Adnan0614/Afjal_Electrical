import { useQuery } from "@tanstack/react-query";
import { TrendingUp } from "lucide-react";
import { apiGet } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import { inr } from "@/lib/invoice";
import type { MonthlySales } from "@/types";

const monthLabel = (month: string): string => {
  const [y, m] = month.split("-");
  const date = new Date(Number(y), Number(m) - 1, 1);
  return date.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
};

/** Month-by-month conversion view: quotes received, jobs won, rupees won. */
export default function OwnerSales(): React.JSX.Element {
  const { t } = useI18n();

  const { data: rows = [], isLoading } = useQuery<MonthlySales[]>({
    queryKey: ["sales-monthly"],
    queryFn: () => apiGet<MonthlySales[]>("/sales/monthly"),
  });

  const totalQuotes = rows.reduce((s, r) => s + r.quotes, 0);
  const totalWon = rows.reduce((s, r) => s + r.won, 0);
  const totalWonValue = rows.reduce((s, r) => s + r.won_value, 0);
  const conversion = totalQuotes ? Math.round((totalWon / totalQuotes) * 100) : 0;
  const peak = Math.max(1, ...rows.map((r) => r.quotes));

  return (
    <div className="space-y-5 text-left" data-testid="owner-sales-panel">
      <div className="bg-[#141414] border border-white/10 rounded-md p-6 space-y-1">
        <h3 className="font-heading font-black text-xl text-white uppercase flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-lime-400" />
          {t("own.tabSales")}
        </h3>
        <p className="text-xs font-sans text-zinc-400 max-w-3xl">{t("sales.desc")}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { id: "quotes", label: t("sales.totalQuotes"), value: String(totalQuotes), color: "text-amber-400" },
          { id: "won", label: t("sales.totalWon"), value: String(totalWon), color: "text-lime-400" },
          { id: "value", label: t("sales.wonValue"), value: inr(Math.round(totalWonValue)), color: "text-emerald-400" },
          { id: "conversion", label: t("sales.conversion"), value: `${conversion}%`, color: "text-cyan-400" },
        ].map((c) => (
          <div key={c.id} className="bg-[#141414] border border-white/10 rounded-md p-4" data-testid={`sales-stat-${c.id}`}>
            <div className={`font-heading font-black text-2xl ${c.color}`}>{c.value}</div>
            <div className="text-[11px] font-sans text-zinc-400">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-[#141414] border border-white/10 rounded-md overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-5 py-3 border-b border-white/10 text-[10px] font-mono uppercase text-zinc-500">
          <div className="col-span-3">{t("sales.month")}</div>
          <div className="col-span-4">{t("sales.quotesCol")}</div>
          <div className="col-span-2 text-right">{t("sales.wonCol")}</div>
          <div className="col-span-3 text-right">{t("sales.valueCol")}</div>
        </div>

        {isLoading && (
          <div className="px-5 py-8 text-center text-xs font-mono text-zinc-500">…</div>
        )}

        {!isLoading && rows.length === 0 && (
          <div className="px-5 py-8 text-center text-xs font-mono text-zinc-500" data-testid="sales-empty">
            {t("sales.empty")}
          </div>
        )}

        {rows.map((r) => (
          <div
            key={r.month}
            className="grid grid-cols-12 gap-2 items-center px-5 py-3.5 border-b border-white/5 hover:bg-white/[0.03] transition-colors"
            data-testid={`sales-row-${r.month}`}
          >
            <div className="col-span-3 font-heading font-black text-sm uppercase text-white">{monthLabel(r.month)}</div>
            <div className="col-span-4 flex items-center gap-2">
              <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-[#FF7B00] transition-all duration-500"
                  style={{ width: `${Math.round((r.quotes / peak) * 100)}%` }}
                />
              </div>
              <span className="font-mono text-xs text-amber-400 w-6 text-right">{r.quotes}</span>
            </div>
            <div className="col-span-2 text-right font-mono text-sm text-lime-400">{r.won}</div>
            <div className="col-span-3 text-right font-mono text-sm text-emerald-400">{inr(Math.round(r.won_value))}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
