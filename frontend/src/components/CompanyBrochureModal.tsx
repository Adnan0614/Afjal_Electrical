import { Printer } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";

interface CompanyBrochureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CompanyBrochureModal({ isOpen, onClose }: CompanyBrochureModalProps) {
  const { t } = useI18n();
  const handlePrint = () => window.print();

  const machines = [1, 2, 3, 4];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="bg-[#121212] border border-white/20 text-white w-full max-w-[calc(100%-1.5rem)] sm:max-w-3xl p-5 sm:p-10 max-h-[90vh] overflow-y-auto overflow-x-hidden [&>*]:min-w-0 print:bg-white print:text-black print:max-w-none print:border-none"
        data-testid="brochure-modal"
      >
        <DialogHeader className="text-left border-b border-white/10 pb-6 print:border-zinc-300">
          <div className="flex flex-wrap justify-between items-start gap-3">
            <div>
              <Badge className="bg-amber-500/15 border-amber-500/40 text-amber-400 font-mono text-[11px] mb-2">
                {t("bro.badge")}
              </Badge>
              <DialogTitle className="font-heading font-black text-2xl sm:text-4xl uppercase tracking-tight text-white print:text-black">
                {t("common.brandName")}
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-zinc-400 print:text-zinc-600 font-sans mt-1">
                {t("bro.subtitle")}
              </DialogDescription>
            </div>
            <div className="hidden sm:flex gap-2 print:hidden shrink-0">
              <Button
                size="sm"
                variant="outline"
                onClick={handlePrint}
                className="border-white/20 text-zinc-300 hover:text-white"
                data-testid="brochure-print-btn"
              >
                <Printer className="w-4 h-4 mr-1.5" />
                {t("bro.print")}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4 text-left font-sans text-xs sm:text-sm">

          <div className="space-y-2">
            <h4 className="font-heading font-black text-lg text-amber-400 print:text-black uppercase">{t("bro.s1")}</h4>
            <p className="text-zinc-300 print:text-zinc-800 leading-relaxed">
              {t("bro.estBy")} <strong>{t("common.brandName")}</strong> {t("bro.s1desc")}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-heading font-black text-lg text-amber-400 print:text-black uppercase">{t("bro.s2")}</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-[11px] sm:text-xs border border-white/10 print:border-zinc-300">
                <thead className="bg-[#1C1C1C] print:bg-zinc-100 text-zinc-300 print:text-black">
                  <tr>
                    <th className="p-2.5 border-b border-white/10 print:border-zinc-300">{t("bro.th1")}</th>
                    <th className="p-2.5 border-b border-white/10 print:border-zinc-300">{t("bro.th2")}</th>
                    <th className="p-2.5 border-b border-white/10 print:border-zinc-300">{t("bro.th3")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 print:divide-zinc-200">
                  {[
                    { t: "lic.t1", num: "08/626/B (Class-B)", a: "lic.a1", accent: true },
                    { t: "lic.t2", num: "NR/10464", a: "lic.a2", accent: true },
                    { t: "lic.t3", num: "22BDBPM9804K2ZH", a: "lic.a3", accent: false },
                    { t: "lic.t4", num: "000107/RPR/5/2021", a: "lic.a4", accent: false },
                  ].map((row, i) => (
                    <tr key={i}>
                      <td className="p-2.5 font-semibold text-white print:text-black">{t(row.t)}</td>
                      <td className={`p-2.5 font-bold print:text-black ${row.accent ? "text-amber-400" : "text-zinc-200"}`}>{row.num}</td>
                      <td className="p-2.5 text-zinc-400 print:text-zinc-600">{t(row.a)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-heading font-black text-lg text-amber-400 print:text-black uppercase">{t("bro.s3")}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {machines.map((n) => (
                <div key={n} className="bg-[#181818] print:bg-zinc-50 border border-white/10 print:border-zinc-300 p-3 rounded">
                  <strong className="text-white print:text-black block font-mono">{t(`bro.m${n}`)}</strong>
                  <span className="text-zinc-400 print:text-zinc-600">{t(`bro.m${n}d`)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#181818] print:bg-zinc-100 border border-white/10 print:border-zinc-300 p-4 rounded-md space-y-2 font-mono text-[11px] sm:text-xs">
            <div className="text-amber-400 print:text-black font-bold uppercase">{t("bro.contactTitle")}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-300 print:text-zinc-800">
              <div>📍 <strong>{t("bro.address")}</strong> {t("bro.addressValue")}</div>
              <div>📞 <strong>{t("bro.phone")}</strong> +91 9669718100</div>
              <div>✉️ <strong>{t("bro.email")}</strong> afjaleng@gmail.com</div>
              <div>👤 <strong>{t("bro.proprietor")}</strong> {t("common.owner")}</div>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap justify-end gap-3 print:hidden">
            <Button variant="outline" onClick={onClose} className="border-white/20 text-zinc-300">
              {t("bro.close")}
            </Button>
            <Button
              onClick={handlePrint}
              className="bg-[#FF7B00] hover:bg-[#E66A00] text-black font-heading font-black text-sm uppercase px-5"
              data-testid="brochure-print-btn-footer"
            >
              <Printer className="w-4 h-4 mr-1.5" />
              {t("bro.print")}
            </Button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
