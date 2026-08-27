import { useState, useMemo } from "react";
import { Calculator, Check, Zap, Sparkles, Send, ShieldCheck, Clock, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { apiPost } from "@/lib/api";
import { toast } from "sonner";
import type { Lead, LeadCreate } from "@/types";

interface EquipmentOption {
  id: string;
  name: string;
  description: string;
  type: "hp" | "sqft" | "panel";
  hpOptions: number[];
  basePerHp: number;
}

const EQUIPMENT_TYPES: EquipmentOption[] = [
  {
    id: "3phase_motor",
    name: "3-Phase AC Induction Motor",
    description: "Industrial squirrel-cage or slip-ring motors for mills, factories & cranes",
    type: "hp",
    hpOptions: [1, 2, 3, 5, 7.5, 10, 15, 20, 25, 30, 40, 50, 75, 100, 150, 200],
    basePerHp: 380,
  },
  {
    id: "submersible_pump",
    name: "Submersible / Borewell Pump",
    description: "Water-tight poly-winding for agricultural & industrial water pumps",
    type: "hp",
    hpOptions: [3, 5, 7.5, 10, 12.5, 15, 20, 25, 30, 40, 50],
    basePerHp: 440,
  },
  {
    id: "single_phase",
    name: "Single Phase Motor / Monoblock",
    description: "Domestic, shop, flour mill & workshop single-phase equipment",
    type: "hp",
    hpOptions: [0.5, 1, 1.5, 2, 3, 5],
    basePerHp: 650,
  },
  {
    id: "lt_panel",
    name: "LT Distribution Panel / Star-Delta",
    description: "Busbar overhaul, MCCB wiring, APFC capacitor bank servicing",
    type: "panel",
    hpOptions: [1, 2, 3, 4, 5], // represented as complexity levels
    basePerHp: 3500,
  },
  {
    id: "commercial_wiring",
    name: "Commercial & Factory Plant Wiring",
    description: "Licensed Class-B wiring, cable laying, earthing, load extension",
    type: "sqft",
    hpOptions: [500, 1000, 2500, 5000, 10000, 20000], // sqft
    basePerHp: 22, // per sqft
  },
];

export default function CostEstimator() {
  const [selectedType, setSelectedType] = useState<string>("3phase_motor");
  const [selectedHp, setSelectedHp] = useState<number>(25);
  const [wireGrade, setWireGrade] = useState<"class_h" | "class_f">("class_h");
  const [includeSkfBearings, setIncludeSkfBearings] = useState<boolean>(true);
  const [includeDynamicBalancing, setIncludeDynamicBalancing] = useState<boolean>(true);
  const [includeVpiBaking, setIncludeVpiBaking] = useState<boolean>(true);
  const [expressTurnaround, setExpressTurnaround] = useState<boolean>(false);

  // Customer lead details
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [customerLocation, setCustomerLocation] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [generatedLead, setGeneratedLead] = useState<Lead | null>(null);

  const currentEquipment = useMemo(() => {
    return EQUIPMENT_TYPES.find((e) => e.id === selectedType) || EQUIPMENT_TYPES[0];
  }, [selectedType]);

  // Handle default capacity when equipment changes
  const handleTypeChange = (typeId: string) => {
    setSelectedType(typeId);
    const equip = EQUIPMENT_TYPES.find((e) => e.id === typeId);
    if (equip && !equip.hpOptions.includes(selectedHp)) {
      setSelectedHp(equip.hpOptions[Math.floor(equip.hpOptions.length / 2)] || equip.hpOptions[0]);
    }
  };

  // Calculation logic
  const estimate = useMemo(() => {
    let base = 0;
    if (currentEquipment.type === "hp") {
      base = selectedHp * currentEquipment.basePerHp + 650; // base material & labor
    } else if (currentEquipment.type === "sqft") {
      base = selectedHp * currentEquipment.basePerHp;
    } else {
      // Panel
      base = selectedHp * currentEquipment.basePerHp + 2000;
    }

    // Wire grade multiplier
    const wireMultiplier = wireGrade === "class_h" ? 1.15 : 1.0;
    let total = base * wireMultiplier;

    // Add-ons
    let bearingsCost = 0;
    if (includeSkfBearings && currentEquipment.type === "hp") {
      bearingsCost = selectedHp <= 10 ? 800 : selectedHp <= 50 ? 1800 : 3500;
      total += bearingsCost;
    }

    let balancingCost = 0;
    if (includeDynamicBalancing && currentEquipment.type === "hp") {
      balancingCost = selectedHp <= 20 ? 600 : 1200;
      total += balancingCost;
    }

    let vpiCost = 0;
    if (includeVpiBaking) {
      vpiCost = selectedHp <= 20 ? 500 : 1100;
      total += vpiCost;
    }

    if (expressTurnaround) {
      total *= 1.15; // 15% express charge
    }

    const roundedTotal = Math.round(total / 50) * 50;
    const minEstimate = Math.round((roundedTotal * 0.95) / 50) * 50;
    const maxEstimate = Math.round((roundedTotal * 1.08) / 50) * 50;

    let turnaround = "24 - 48 Hours";
    if (expressTurnaround) turnaround = "Same-Day / 12-18 Hours Express";
    else if (selectedHp >= 100) turnaround = "3 - 5 Working Days";

    return {
      minEstimate,
      maxEstimate,
      median: roundedTotal,
      turnaround,
      bearingsCost,
      balancingCost,
      vpiCost,
    };
  }, [
    currentEquipment,
    selectedHp,
    wireGrade,
    includeSkfBearings,
    includeDynamicBalancing,
    includeVpiBaking,
    expressTurnaround,
  ]);

  const handleLeadSubmit = async (sendWhatsapp = false) => {
    if (!customerPhone || customerPhone.length < 10) {
      toast.error("Please enter a valid 10-digit phone number so we can send the estimate.");
      return;
    }

    setIsSubmitting(true);
    try {
      const leadPayload: LeadCreate = {
        name: customerName || "Prospective Client",
        phone: customerPhone,
        service_type: currentEquipment.name,
        equipment_type: currentEquipment.name,
        capacity_hp: currentEquipment.type === "sqft" ? `${selectedHp} Sq. Ft.` : `${selectedHp} HP`,
        wire_grade: wireGrade === "class_h" ? "Dual-Coated Class-H (180°C)" : "Standard Class-F (155°C)",
        estimated_cost: estimate.median,
        location: customerLocation || "Raipur / Chhattisgarh",
        details: `Addons: SKF=${includeSkfBearings}, Balancing=${includeDynamicBalancing}, VPI=${includeVpiBaking}, Express=${expressTurnaround}. Range: ₹${estimate.minEstimate} - ₹${estimate.maxEstimate}`,
        source: "quote_calculator",
        meta_data: {
          estimate_min: estimate.minEstimate,
          estimate_max: estimate.maxEstimate,
          turnaround: estimate.turnaround,
        },
      };

      const res = await apiPost<Lead>("/leads", leadPayload);
      setGeneratedLead(res);
      toast.success(`Quote generated! Reference ID: ${res.id}`);

      if (sendWhatsapp) {
        const message = `Hello Mohammad Afjal bhai,%0A%0AI used the Cost Estimator on your website for *${currentEquipment.name}*.%0A%0A*Quote Details:*%0A• Equipment: ${currentEquipment.name}%0A• Capacity: ${currentEquipment.type === "sqft" ? `${selectedHp} Sq. Ft.` : `${selectedHp} HP`}%0A• Wire: ${wireGrade === "class_h" ? "100% Dual-Coated Class-H (180°C)" : "Class-F (155°C)"}%0A• Estimated Cost: ₹${estimate.minEstimate.toLocaleString()} - ₹${estimate.maxEstimate.toLocaleString()}%0A• Expected Turnaround: ${estimate.turnaround}%0A• Reference ID: ${res.id}%0A%0A*My Contact:*%0A• Name: ${customerName || "Customer"}%0A• Phone: ${customerPhone}%0A• Location: ${customerLocation || "Raipur"}%0A%0APlease confirm availability and pickup.`;
        window.open(`https://wa.me/919669718100?text=${message}`, "_blank");
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not register quote request. Please call +91 9669718100 directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="estimator" className="py-16 sm:py-24 bg-[#0A0A0A] border-b border-white/10" data-testid="cost-estimator-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-left max-w-3xl mb-12">
          <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 font-mono text-xs uppercase mb-3">
            <Calculator className="w-3.5 h-3.5 mr-1.5" />
            Transparent Pricing Engine
          </Badge>
          <h2 className="font-heading font-black text-3xl sm:text-5xl uppercase text-white tracking-tight">
            Interactive Rewinding & Wiring Cost Estimator
          </h2>
          <p className="text-zinc-300 text-sm sm:text-base font-sans mt-2">
            Calculate estimated rewinding and service costs in real-time. No hidden surcharges — 100% genuine copper and factory-grade insulation guaranteed.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Input Selection Column */}
          <div className="lg:col-span-7 bg-[#121212] border border-white/10 rounded-md p-6 sm:p-8 space-y-8">
            
            {/* Step 1: Equipment Type */}
            <div className="space-y-3">
              <Label className="text-xs font-mono uppercase text-zinc-400 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-black font-bold flex items-center justify-center text-xs">1</span>
                Select Equipment / Service Type
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
                    <div className="font-heading font-black uppercase text-base text-white flex items-center justify-between">
                      {eq.name}
                      {selectedType === eq.id && <Check className="w-4 h-4 text-amber-400" />}
                    </div>
                    <div className="text-[11px] text-zinc-400 font-sans mt-1 line-clamp-2">
                      {eq.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Capacity / HP / Size */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-mono uppercase text-zinc-400 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-black font-bold flex items-center justify-center text-xs">2</span>
                  Select Capacity / Horsepower (HP)
                </Label>
                <span className="font-mono text-base font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/30">
                  {currentEquipment.type === "sqft" ? `${selectedHp} Sq. Ft.` : currentEquipment.type === "panel" ? `Level ${selectedHp} Switchgear` : `${selectedHp} HP`}
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

            {/* Step 3: Wire & Insulation Grade */}
            <div className="space-y-3">
              <Label className="text-xs font-mono uppercase text-zinc-400 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-black font-bold flex items-center justify-center text-xs">3</span>
                Copper Wire & Thermal Insulation Grade
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setWireGrade("class_h")}
                  className={`text-left p-3.5 rounded border transition-all cursor-pointer ${
                    wireGrade === "class_h"
                      ? "bg-amber-500/15 border-amber-500 text-white"
                      : "bg-[#181818] border-white/10 text-zinc-300"
                  }`}
                  data-testid="wire-grade-class-h"
                >
                  <div className="flex items-center justify-between font-heading font-black uppercase text-sm text-amber-400">
                    Dual-Coated Class-H (180°C)
                    <Badge className="bg-emerald-500/20 text-emerald-300 text-[10px]">Recommended</Badge>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-sans mt-1">
                    100% Electrolytic Pure Copper. Maximum thermal endurance against voltage fluctuations and overload.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setWireGrade("class_f")}
                  className={`text-left p-3.5 rounded border transition-all cursor-pointer ${
                    wireGrade === "class_f"
                      ? "bg-amber-500/15 border-amber-500 text-white"
                      : "bg-[#181818] border-white/10 text-zinc-300"
                  }`}
                  data-testid="wire-grade-class-f"
                >
                  <div className="flex items-center justify-between font-heading font-black uppercase text-sm text-zinc-200">
                    Standard Class-F (155°C)
                  </div>
                  <p className="text-[11px] text-zinc-400 font-sans mt-1">
                    Standard industrial duty grade. Suitable for light-to-medium regular continuous duty.
                  </p>
                </button>
              </div>
            </div>

            {/* Step 4: Add-on Enhancements */}
            <div className="space-y-3">
              <Label className="text-xs font-mono uppercase text-zinc-400 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-black font-bold flex items-center justify-center text-xs">4</span>
                Workshop Overhaul & Testing Add-ons
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-sans text-xs">
                
                <label className="flex items-start gap-2.5 p-3 rounded bg-[#181818] border border-white/10 cursor-pointer hover:border-white/20">
                  <input
                    type="checkbox"
                    checked={includeDynamicBalancing}
                    onChange={(e) => setIncludeDynamicBalancing(e.target.checked)}
                    className="mt-0.5 rounded border-white/20 accent-[#FF7B00]"
                    data-testid="addon-dynamic-balancing"
                  />
                  <div>
                    <span className="font-semibold text-zinc-200 block">Dynamic Rotor Balancing</span>
                    <span className="text-zinc-400 text-[11px]">Vibration reduction to &lt;1.2 mm/s RMS for silent, smooth running.</span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-3 rounded bg-[#181818] border border-white/10 cursor-pointer hover:border-white/20">
                  <input
                    type="checkbox"
                    checked={includeSkfBearings}
                    onChange={(e) => setIncludeSkfBearings(e.target.checked)}
                    className="mt-0.5 rounded border-white/20 accent-[#FF7B00]"
                    data-testid="addon-skf-bearings"
                  />
                  <div>
                    <span className="font-semibold text-zinc-200 block">SKF / NBC C3 Bearing Pair</span>
                    <span className="text-zinc-400 text-[11px]">High-temp deep groove ball bearings fitted with grease seal.</span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-3 rounded bg-[#181818] border border-white/10 cursor-pointer hover:border-white/20">
                  <input
                    type="checkbox"
                    checked={includeVpiBaking}
                    onChange={(e) => setIncludeVpiBaking(e.target.checked)}
                    className="mt-0.5 rounded border-white/20 accent-[#FF7B00]"
                    data-testid="addon-vpi-baking"
                  />
                  <div>
                    <span className="font-semibold text-zinc-200 block">VPI Varnish & 135°C Oven Bake</span>
                    <span className="text-zinc-400 text-[11px]">8-hour curing for moisture, dust, and acid fume protection.</span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-3 rounded bg-[#181818] border border-white/10 cursor-pointer hover:border-white/20">
                  <input
                    type="checkbox"
                    checked={expressTurnaround}
                    onChange={(e) => setExpressTurnaround(e.target.checked)}
                    className="mt-0.5 rounded border-white/20 accent-[#FF7B00]"
                    data-testid="addon-express-turnaround"
                  />
                  <div>
                    <span className="font-semibold text-amber-400 block flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Priority Express Turnaround
                    </span>
                    <span className="text-zinc-400 text-[11px]">Dedicated technician allocation for same-day/urgent restoration.</span>
                  </div>
                </label>

              </div>
            </div>

          </div>

          {/* Right: Live Calculation & Instant Lead Action */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Live Pricing Breakdown Card */}
            <div className="bg-gradient-to-b from-[#1E1E1E] to-[#141414] border-2 border-amber-500/50 rounded-md p-6 electric-glow space-y-5 text-left">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono text-xs text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  Estimated Workshop Quote
                </span>
                <Badge variant="outline" className="text-[10px] font-mono border-emerald-500 text-emerald-400 bg-emerald-950/40">
                  6-Month Warranty
                </Badge>
              </div>

              {/* Price range */}
              <div>
                <div className="text-xs font-mono text-zinc-400">Estimated Total Investment</div>
                <div className="text-3xl sm:text-4xl font-mono font-bold text-white tracking-tight mt-1" data-testid="estimator-total-price">
                  ₹{estimate.minEstimate.toLocaleString("en-IN")} <span className="text-xl text-zinc-400 font-normal">to</span> ₹{estimate.maxEstimate.toLocaleString("en-IN")}
                </div>
                <p className="text-xs font-sans text-emerald-400 mt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Includes 100% pure copper, slot insulation, test certificate & labor
                </p>
              </div>

              {/* Scope Summary Box */}
              <div className="bg-[#0A0A0A] border border-white/10 rounded p-3.5 space-y-2 font-mono text-xs">
                <div className="flex justify-between text-zinc-300">
                  <span>Equipment:</span>
                  <strong className="text-white">{currentEquipment.name}</strong>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>Capacity:</span>
                  <strong className="text-amber-400">{currentEquipment.type === "sqft" ? `${selectedHp} Sq. Ft.` : `${selectedHp} HP`}</strong>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>Wire Grade:</span>
                  <span className="text-zinc-200">{wireGrade === "class_h" ? "Class-H (180°C)" : "Class-F"}</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>Turnaround Time:</span>
                  <strong className="text-cyan-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {estimate.turnaround}
                  </strong>
                </div>
              </div>

              {/* Lead Capture form */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <div className="text-xs font-mono uppercase text-zinc-300">
                  Lock Estimate & Connect With Mohammad Afjal
                </div>

                <div className="space-y-2">
                  <Input
                    placeholder="Your Name / Factory Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="bg-[#0A0A0A] border-white/15 text-sm h-10 text-white font-sans"
                    data-testid="estimator-name-input"
                  />
                  <Input
                    placeholder="Phone Number (10 digits) *"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="bg-[#0A0A0A] border-white/15 text-sm h-10 text-white font-mono"
                    data-testid="estimator-phone-input"
                  />
                  <Input
                    placeholder="Location / Plant Area (e.g., Tilda, Urla, Siltara)"
                    value={customerLocation}
                    onChange={(e) => setCustomerLocation(e.target.value)}
                    className="bg-[#0A0A0A] border-white/15 text-sm h-10 text-white font-sans"
                    data-testid="estimator-location-input"
                  />
                </div>

                {/* Primary WhatsApp Action */}
                <Button
                  onClick={() => handleLeadSubmit(true)}
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-black text-base uppercase py-5 rounded-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
                  data-testid="estimator-whatsapp-submit-btn"
                >
                  <Send className="w-4 h-4" />
                  Send to WhatsApp & Get Official Quote
                </Button>

                {/* Secondary Inward Booking */}
                <Button
                  onClick={() => handleLeadSubmit(false)}
                  disabled={isSubmitting}
                  variant="outline"
                  className="w-full border-white/20 text-zinc-200 hover:text-white bg-[#141414] font-mono text-xs py-4 cursor-pointer"
                  data-testid="estimator-register-slot-btn"
                >
                  <FileCheck className="w-4 h-4 text-amber-400 mr-1.5" />
                  Save Quote & Register Workshop Slot
                </Button>

              </div>

              {generatedLead && (
                <div className="bg-amber-500/10 border border-amber-500/40 p-3 rounded text-xs font-mono text-amber-300">
                  ✓ Quote saved with reference: <strong className="text-white">{generatedLead.id}</strong>. Our team will verify technical details shortly.
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
