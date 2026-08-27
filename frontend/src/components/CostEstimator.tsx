import { useState, useMemo } from "react";
import { Calculator, Check, Zap, Sparkles, Send, ShieldCheck, Clock, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { apiPost } from "@/lib/api";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import type { Lead, LeadCreate } from "@/types";

interface EquipmentOption {
  id: string;
  nameKey: string;
  descKey: string;
  type: "hp" | "sqft" | "panel";
  hpOptions: number[];
  basePerHp: number;
}

const EQUIPMENT_TYPES: EquipmentOption[] = [
  { id: "3phase_motor", nameKey: "eq.3phase", descKey: "eq.3phaseDesc", type: "hp", hpOptions: [1, 2, 3, 5, 7.5, 10, 15, 20, 25, 30, 40, 50, 75, 100, 150, 200], basePerHp: 380 },
  { id: "submersible_pump", nameKey: "eq.pump", descKey: "eq.pumpDesc", type: "hp", hpOptions: [3, 5, 7.5, 10, 12.5, 15, 20, 25, 30, 40, 50], basePerHp: 440 },
  { id: "single_phase", nameKey: "eq.single", descKey: "eq.singleDesc", type: "hp", hpOptions: [0.5, 1, 1.5, 2, 3, 5], basePerHp: 650 },
  { id: "lt_panel", nameKey: "eq.panel", descKey: "eq.panelDesc", type: "panel", hpOptions: [1, 2, 3, 4, 5], basePerHp: 3500 },
  { id: "commercial_wiring", nameKey: "eq.wiring", descKey: "eq.wiringDesc", type: "sqft", hpOptions: [500, 1000, 2500, 5000, 10000, 20000], basePerHp: 22 },
];

export default function CostEstimator() {
  const { t } = useI18n();
  const [selectedType, setSelectedType] = useState<string>("3phase_motor");
  const [selectedHp, setSelectedHp] = useState<number>(25);
  const [wireGrade, setWireGrade] = useState<"class_h" | "class_f">("class_h");
  const [includeSkfBearings, setIncludeSkfBearings] = useState(true);
  const [includeDynamicBalancing, setIncludeDynamicBalancing] = useState(true);
  const [includeVpiBaking, setIncludeVpiBaking] = useState(true);
  const [expressTurnaround, setExpressTurnaround] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerLocation, setCustomerLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedLead, setGeneratedLead] = useState<Lead | null>(null);

  const currentEquipment = useMemo(
    () => EQUIPMENT_TYPES.find((e) => e.id === selectedType) || EQUIPMENT_TYPES[0],
    [selectedType]
  );

  const handleTypeChange = (typeId: string) => {
    setSelectedType(typeId);
    const equip = EQUIPMENT_TYPES.find((e) => e.id === typeId);
    if (equip && !equip.hpOptions.includes(selectedHp)) {
      setSelectedHp(equip.hpOptions[Math.floor(equip.hpOptions.length / 2)] || equip.hpOptions[0]);
    }
  };

  const estimate = useMemo(() => {
    let base = 0;
    if (currentEquipment.type === "hp") base = selectedHp * currentEquipment.basePerHp + 650;
    else if (currentEquipment.type === "sqft") base = selectedHp * currentEquipment.basePerHp;
    else base = selectedHp * currentEquipment.basePerHp + 2000;

    let total = base * (wireGrade === "class_h" ? 1.15 : 1.0);

    if (includeSkfBearings && currentEquipment.type === "hp") {
      total += selectedHp <= 10 ? 800 : selectedHp <= 50 ? 1800 : 3500;
    }
    if (includeDynamicBalancing && currentEquipment.type === "hp") {
      total += selectedHp <= 20 ? 600 : 1200;
    }
    if (includeVpiBaking) total += selectedHp <= 20 ? 500 : 1100;
    if (expressTurnaround) total *= 1.15;

    const roundedTotal = Math.round(total / 50) * 50;
    let turnaroundKey = "est.turnaround1";
    if (expressTurnaround) turnaroundKey = "est.turnaround2";
    else if (selectedHp >= 100) turnaroundKey = "est.turnaround3";

    return {
      minEstimate: Math.round((roundedTotal * 0.95) / 50) * 50,
      maxEstimate: Math.round((roundedTotal * 1.08) / 50) * 50,
      median: roundedTotal,
      turnaroundKey,
    };
  }, [currentEquipment, selectedHp, wireGrade, includeSkfBearings, includeDynamicBalancing, includeVpiBaking, expressTurnaround]);

  const capacityLabel = currentEquipment.type === "sqft"
    ? `${selectedHp} Sq. Ft.`
    : currentEquipment.type === "panel" ? `Level ${selectedHp}` : `${selectedHp} HP`;

  const handleLeadSubmit = async (sendWhatsapp = false) => {
    if (!customerPhone || customerPhone.replace(/\D/g, "").length < 10) {
      toast.error(t("est.phoneError"));
      return;
    }

    setIsSubmitting(true);
    try {
      const equipName = t(currentEquipment.nameKey);
      const payload: LeadCreate = {
        name: customerName || "Prospective Client",
        phone: customerPhone,
        service_type: equipName,
        equipment_type: equipName,
        capacity_hp: capacityLabel,
        wire_grade: wireGrade === "class_h" ? "Dual-Coated Class-H (180°C)" : "Standard Class-F (155°C)",
        estimated_cost: estimate.median,
        location: customerLocation || "Raipur / Chhattisgarh",
        details: `Addons: SKF=${includeSkfBearings}, Balancing=${includeDynamicBalancing}, VPI=${includeVpiBaking}, Express=${expressTurnaround}. Range: ₹${estimate.minEstimate} - ₹${estimate.maxEstimate}`,
        source: "quote_calculator",
        meta_data: { estimate_min: estimate.minEstimate, estimate_max: estimate.maxEstimate },
      };

      const res = await apiPost<Lead>("/leads", payload);
      setGeneratedLead(res);
      toast.success(`${t("est.savedPrefix")} ${res.id}`);

      if (sendWhatsapp) {
        const message = `Hello Mohammad Afjal bhai,%0A%0AI used the Cost Estimator for *${equipName}*.%0A%0A*Quote Details:*%0A• Capacity: ${capacityLabel}%0A• Wire: ${wireGrade === "class_h" ? "100% Dual-Coated Class-H (180°C)" : "Class-F (155°C)"}%0A• Estimated Cost: ₹${estimate.minEstimate.toLocaleString()} - ₹${estimate.maxEstimate.toLocaleString()}%0A• Reference ID: ${res.id}%0A%0A*My Contact:*%0A• Name: ${customerName || "Customer"}%0A• Phone: ${customerPhone}%0A• Location: ${customerLocation || "Raipur"}%0A%0APlease confirm availability and pickup.`;
        window.open(`https://wa.me/919669718100?text=${message}`, "_blank");
      }
    } catch (err) {
      console.error(err);
      toast.error(t("est.saveError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepBadge = (n: number) => (
    <span className="w-5 h-5 rounded-full bg-amber-500 text-black font-bold flex items-center justify-center text-xs shrink-0">{n}</span>
  );

  return (
    <section id="estimator" className="py-16 sm:py-24 bg-[#0A0A0A] border-b border-white/10" data-testid="cost-estimator-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-left max-w-3xl mb-12">
          <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 font-mono text-xs uppercase mb-3">
            <Calculator className="w-3.5 h-3.5 mr-1.5" />
            {t("est.badge")}
          </Badge>
          <h2 className="font-heading font-black text-3xl sm:text-5xl uppercase text-white tracking-tight">{t("est.heading")}</h2>
          <p className="text-zinc-300 text-sm sm:text-base font-sans mt-2">{t("est.sub")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Inputs */}
          <div className="lg:col-span-7 bg-[#121212] border border-white/10 rounded-md p-6 sm:p-8 space-y-8 text-left">

            <div className="space-y-3">
              <Label className="text-xs font-mono uppercase text-zinc-400 flex items-center gap-2">
                {stepBadge(1)} {t("est.step1")}
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {EQUIPMENT_TYPES.map((eq) => (
                  <button
                    key={eq.id}
                    type="button"
                    onClick={() => handleTypeChange(eq.id)}
                    className={`text-left p-3.5 rounded border transition-all cursor-pointer ${
                      selectedType === eq.id
                        ? "bg-amber-500/15 border-amber-500 text-white shadow-md shadow-amber-500/10"
                        : "bg-[#181818] border-white/10 text-zinc-300 hover:border-white/20 hover:bg-[#202020]"
                    }`}
                    data-testid={`estimator-type-${eq.id}`}
                  >
                    <div className="font-heading font-black uppercase text-base text-white flex items-center justify-between gap-2">
                      {t(eq.nameKey)}
                      {selectedType === eq.id && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                    </div>
                    <div className="text-[11px] text-zinc-400 font-sans mt-1">{t(eq.descKey)}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap justify-between items-center gap-2">
                <Label className="text-xs font-mono uppercase text-zinc-400 flex items-center gap-2">
                  {stepBadge(2)} {t("est.step2")}
                </Label>
                <span className="font-mono text-base font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/30">
                  {capacityLabel}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {currentEquipment.hpOptions.map((hp) => (
                  <button
                    key={hp}
                    type="button"
                    onClick={() => setSelectedHp(hp)}
                    className={`font-mono text-xs px-3 py-2 rounded border transition-all cursor-pointer ${
                      selectedHp === hp
                        ? "bg-[#FF7B00] text-black font-bold border-[#FF7B00]"
                        : "bg-[#181818] border-white/10 text-zinc-300 hover:border-amber-400/40"
                    }`}
                    data-testid={`estimator-hp-${hp}`}
                  >
                    {currentEquipment.type === "sqft" ? `${hp} sqft` : currentEquipment.type === "panel" ? `L${hp}` : `${hp} HP`}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-mono uppercase text-zinc-400 flex items-center gap-2">
                {stepBadge(3)} {t("est.step3")}
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setWireGrade("class_h")}
                  className={`text-left p-3.5 rounded border transition-all cursor-pointer ${
                    wireGrade === "class_h" ? "bg-amber-500/15 border-amber-500 text-white" : "bg-[#181818] border-white/10 text-zinc-300"
                  }`}
                  data-testid="wire-grade-class-h"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 font-heading font-black uppercase text-sm text-amber-400">
                    {t("est.classH")}
                    <Badge className="bg-emerald-500/20 text-emerald-300 text-[10px]">{t("est.recommended")}</Badge>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-sans mt-1">{t("est.classHDesc")}</p>
                </button>

                <button
                  type="button"
                  onClick={() => setWireGrade("class_f")}
                  className={`text-left p-3.5 rounded border transition-all cursor-pointer ${
                    wireGrade === "class_f" ? "bg-amber-500/15 border-amber-500 text-white" : "bg-[#181818] border-white/10 text-zinc-300"
                  }`}
                  data-testid="wire-grade-class-f"
                >
                  <div className="font-heading font-black uppercase text-sm text-zinc-200">{t("est.classF")}</div>
                  <p className="text-[11px] text-zinc-400 font-sans mt-1">{t("est.classFDesc")}</p>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-mono uppercase text-zinc-400 flex items-center gap-2">
                {stepBadge(4)} {t("est.step4")}
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-sans text-xs">
                {[
                  { checked: includeDynamicBalancing, set: setIncludeDynamicBalancing, tk: "est.balancing", dk: "est.balancingDesc", tid: "addon-dynamic-balancing", accent: false },
                  { checked: includeSkfBearings, set: setIncludeSkfBearings, tk: "est.bearings", dk: "est.bearingsDesc", tid: "addon-skf-bearings", accent: false },
                  { checked: includeVpiBaking, set: setIncludeVpiBaking, tk: "est.vpi", dk: "est.vpiDesc", tid: "addon-vpi-baking", accent: false },
                  { checked: expressTurnaround, set: setExpressTurnaround, tk: "est.express", dk: "est.expressDesc", tid: "addon-express-turnaround", accent: true },
                ].map((ad) => (
                  <label key={ad.tid} className="flex items-start gap-2.5 p-3 rounded bg-[#181818] border border-white/10 cursor-pointer hover:border-white/20">
                    <input
                      type="checkbox"
                      checked={ad.checked}
                      onChange={(e) => ad.set(e.target.checked)}
                      className="mt-0.5 rounded border-white/20 accent-[#FF7B00]"
                      data-testid={ad.tid}
                    />
                    <div>
                      <span className={`font-semibold block ${ad.accent ? "text-amber-400 flex items-center gap-1" : "text-zinc-200"}`}>
                        {ad.accent && <Sparkles className="w-3.5 h-3.5" />}
                        {t(ad.tk)}
                      </span>
                      <span className="text-zinc-400 text-[11px]">{t(ad.dk)}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Live quote */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-b from-[#1E1E1E] to-[#141414] border-2 border-amber-500/50 rounded-md p-6 electric-glow space-y-5 text-left">

              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                <span className="font-mono text-xs text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  {t("est.quoteTitle")}
                </span>
                <Badge variant="outline" className="text-[10px] font-mono border-emerald-500 text-emerald-400 bg-emerald-950/40">
                  {t("est.warrantyBadge")}
                </Badge>
              </div>

              <div>
                <div className="text-xs font-mono text-zinc-400">{t("est.totalLabel")}</div>
                <div className="text-3xl sm:text-4xl font-mono font-bold text-white tracking-tight mt-1" data-testid="estimator-total-price">
                  ₹{estimate.minEstimate.toLocaleString("en-IN")} <span className="text-xl text-zinc-400 font-normal">{t("est.to")}</span> ₹{estimate.maxEstimate.toLocaleString("en-IN")}
                </div>
                <p className="text-xs font-sans text-emerald-400 mt-1 flex items-start gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  {t("est.includes")}
                </p>
              </div>

              <div className="bg-[#0A0A0A] border border-white/10 rounded p-3.5 space-y-2 font-mono text-xs">
                <div className="flex justify-between gap-2 text-zinc-300">
                  <span>{t("est.equipment")}</span>
                  <strong className="text-white text-right">{t(currentEquipment.nameKey)}</strong>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>{t("est.capacity")}</span>
                  <strong className="text-amber-400">{capacityLabel}</strong>
                </div>
                <div className="flex justify-between gap-2 text-zinc-300">
                  <span>{t("est.wireGrade")}</span>
                  <span className="text-zinc-200 text-right">{wireGrade === "class_h" ? t("est.classH") : t("est.classF")}</span>
                </div>
                <div className="flex justify-between gap-2 text-zinc-300">
                  <span>{t("est.turnaround")}</span>
                  <strong className="text-cyan-400 flex items-center gap-1 text-right">
                    <Clock className="w-3 h-3 shrink-0" />
                    {t(estimate.turnaroundKey)}
                  </strong>
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-white/10">
                <div className="text-xs font-mono uppercase text-zinc-300">{t("est.lockTitle")}</div>

                <div className="space-y-2">
                  <Input
                    placeholder={t("est.namePlaceholder")}
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="bg-[#0A0A0A] border-white/15 text-sm h-10 text-white font-sans"
                    data-testid="estimator-name-input"
                  />
                  <Input
                    placeholder={t("est.phonePlaceholder")}
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="bg-[#0A0A0A] border-white/15 text-sm h-10 text-white font-mono"
                    data-testid="estimator-phone-input"
                  />
                  <Input
                    placeholder={t("est.locationPlaceholder")}
                    value={customerLocation}
                    onChange={(e) => setCustomerLocation(e.target.value)}
                    className="bg-[#0A0A0A] border-white/15 text-sm h-10 text-white font-sans"
                    data-testid="estimator-location-input"
                  />
                </div>

                <Button
                  onClick={() => handleLeadSubmit(true)}
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-black text-base uppercase py-5 rounded-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
                  data-testid="estimator-whatsapp-submit-btn"
                >
                  <Send className="w-4 h-4 shrink-0" />
                  {t("est.whatsappBtn")}
                </Button>

                <Button
                  onClick={() => handleLeadSubmit(false)}
                  disabled={isSubmitting}
                  variant="outline"
                  className="w-full border-white/20 text-zinc-200 hover:text-white bg-[#141414] font-mono text-xs py-4 cursor-pointer"
                  data-testid="estimator-register-slot-btn"
                >
                  <FileCheck className="w-4 h-4 text-amber-400 mr-1.5 shrink-0" />
                  {t("est.saveBtn")}
                </Button>
              </div>

              {generatedLead && (
                <div className="bg-amber-500/10 border border-amber-500/40 p-3 rounded text-xs font-mono text-amber-300">
                  ✓ {t("est.savedPrefix")} <strong className="text-white">{generatedLead.id}</strong>. {t("est.savedSuffix")}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
