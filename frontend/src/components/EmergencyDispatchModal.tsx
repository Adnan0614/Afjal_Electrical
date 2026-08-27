import { useState } from "react";
import { Zap, Phone, Send } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import VoiceInputButton from "@/components/VoiceInputButton";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { apiPost } from "@/lib/api";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { logError } from "@/lib/logger";
import type { EmergencyDispatch, EmergencyDispatchCreate } from "@/types";

interface EmergencyDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EQUIPMENT_OPTIONS = [
  { value: "Main Induction Motor Breakdown", key: "sos.eq1" },
  { value: "HT / LT Panel & Switchgear Flashover", key: "sos.eq2" },
  { value: "Submersible Borewell Pump Failure", key: "sos.eq3" },
  { value: "Transformer Sparking or Low Oil", key: "sos.eq4" },
  { value: "Crane Slip-Ring Motor Stuck", key: "sos.eq5" },
  { value: "Plant Main Feeder / Cable Short", key: "sos.eq6" },
];

const URGENCY_OPTIONS = [
  { value: "immediate_2hr", key: "sos.u1" },
  { value: "same_day", key: "sos.u2" },
  { value: "first_thing_tomorrow", key: "sos.u3" },
];

export default function EmergencyDispatchModal({ isOpen, onClose }: EmergencyDispatchModalProps) {
  const { t } = useI18n();
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [facilityName, setFacilityName] = useState("");
  const [locationArea, setLocationArea] = useState("Tilda Neora / Raipur");
  const [equipmentType, setEquipmentType] = useState(EQUIPMENT_OPTIONS[0].value);
  const [urgencyLevel, setUrgencyLevel] = useState("immediate_2hr");
  const [problemDescription, setProblemDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dispatchedTicket, setDispatchedTicket] = useState<EmergencyDispatch | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.replace(/\D/g, "").length < 10) {
      toast.error(t("sos.phoneError"));
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: EmergencyDispatchCreate = {
        contact_name: contactName || "Plant Engineer",
        phone,
        facility_name: facilityName,
        location_area: locationArea,
        equipment_type: equipmentType,
        urgency_level: urgencyLevel,
        problem_description: problemDescription || "Critical electrical / motor failure requiring immediate field technician.",
      };

      const result = await apiPost<EmergencyDispatch>("/emergency-dispatch", payload);
      setDispatchedTicket(result);
      toast.success(`${t("sos.ticketToast")} #${result.id}`);

      const msg = `🚨 *EMERGENCY BREAKDOWN DISPATCH SOS* 🚨%0A%0A• Ticket ID: ${result.id}%0A• Contact: ${contactName} (${phone})%0A• Facility: ${facilityName || "Factory"}%0A• Area: ${locationArea}%0A• Equipment: ${equipmentType}%0A• Issue: ${problemDescription}%0A• Priority: ${urgencyLevel}%0A%0APlease dispatch technician immediately!`;
      window.open(`https://wa.me/919669718100?text=${msg}`, "_blank");
    } catch (err) {
      logError("EmergencyDispatch.submit", err);
      toast.error(t("sos.sendError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setDispatchedTicket(null);
    setProblemDescription("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="bg-[#121212] border-2 border-red-500/60 text-white w-full max-w-[calc(100%-1.5rem)] sm:max-w-xl p-5 sm:p-8 max-h-[90vh] overflow-y-auto overflow-x-hidden [&>*]:min-w-0"
        data-testid="emergency-dispatch-modal"
      >
        <DialogHeader className="text-left space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
            <Badge className="bg-red-500/20 text-red-400 border border-red-500/50 font-mono text-xs uppercase">
              {t("sos.unit")}
            </Badge>
          </div>
          <DialogTitle className="font-heading font-black text-2xl sm:text-3xl uppercase tracking-tight text-white flex items-center gap-2">
            <Zap className="w-6 h-6 text-red-500 fill-current shrink-0" />
            {t("sos.title")}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-zinc-300 font-sans">
            {t("sos.desc")}
          </DialogDescription>
        </DialogHeader>

        {dispatchedTicket ? (
          <div className="space-y-6 pt-2 text-left animate-in fade-in-50">
            <div className="bg-gradient-to-b from-red-950/40 to-[#181818] border-2 border-red-500 rounded-md p-5 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-red-500/30 pb-3">
                <span className="font-mono text-xs text-red-400 uppercase font-bold">{t("sos.ticketLabel")}</span>
                <span className="font-mono text-xl font-black text-white bg-red-600 px-3 py-0.5 rounded">
                  {dispatchedTicket.id}
                </span>
              </div>

              <div className="space-y-2 font-mono text-xs text-zinc-300">
                <div className="flex justify-between gap-2">
                  <span>{t("sos.assigned")}</span>
                  <strong className="text-white text-right">{dispatchedTicket.assigned_technician}</strong>
                </div>
                <div className="flex justify-between gap-2">
                  <span>{t("sos.eta")}</span>
                  <strong className="text-amber-400 font-bold">{dispatchedTicket.eta_minutes} {t("sos.minutes")}</strong>
                </div>
                <div className="flex justify-between gap-2">
                  <span>{t("sos.status")}</span>
                  <span className="text-emerald-400 font-bold uppercase">{dispatchedTicket.status}</span>
                </div>
              </div>

              <div className="bg-red-950/50 border border-red-500/40 p-3.5 rounded text-xs text-red-200">
                ⚠️ <strong className="text-white">{t("sos.alerted")}</strong> {t("sos.alertedDesc")}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href="tel:+919669718100"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-heading font-black text-sm sm:text-base uppercase py-3 rounded text-center flex items-center justify-center gap-2 shadow-lg shadow-red-600/30"
                  data-testid="sos-call-hotline"
                >
                  <Phone className="w-4 h-4 fill-current shrink-0" />
                  {t("sos.callHotline")}
                </a>
                <Button onClick={handleReset} variant="outline" className="border-white/20 text-zinc-300">
                  {t("sos.close")}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-left">
            <div className="bg-[#1C1C1C] border border-white/10 p-3 rounded flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs text-zinc-300">{t("sos.speakNow")}</div>
              <a href="tel:+919669718100" className="text-amber-400 hover:underline font-mono text-xs font-bold flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                +91 9669718100
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-mono text-zinc-300">{t("sos.contact")}</Label>
                <Input
                  required
                  placeholder={t("sos.contactPh")}
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="bg-[#0A0A0A] border-white/15 text-white font-sans text-xs sm:text-sm"
                  data-testid="emergency-input-name"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-mono text-zinc-300">{t("sos.phone")}</Label>
                <Input
                  required
                  placeholder="9826012345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-[#0A0A0A] border-white/15 text-white font-mono text-xs sm:text-sm"
                  data-testid="emergency-input-phone"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-mono text-zinc-300">{t("sos.facility")}</Label>
                <Input
                  placeholder={t("sos.facilityPh")}
                  value={facilityName}
                  onChange={(e) => setFacilityName(e.target.value)}
                  className="bg-[#0A0A0A] border-white/15 text-white font-sans text-xs sm:text-sm"
                  data-testid="emergency-input-facility"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-mono text-zinc-300">{t("sos.location")}</Label>
                <Input
                  required
                  placeholder={t("sos.locationPh")}
                  value={locationArea}
                  onChange={(e) => setLocationArea(e.target.value)}
                  className="bg-[#0A0A0A] border-white/15 text-white font-sans text-xs sm:text-sm"
                  data-testid="emergency-input-location"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-mono text-zinc-300">{t("sos.equipment")}</Label>
                <select
                  value={equipmentType}
                  onChange={(e) => setEquipmentType(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-white/15 rounded p-2 text-xs sm:text-sm text-white font-sans"
                  data-testid="emergency-select-equipment"
                >
                  {EQUIPMENT_OPTIONS.map((op) => (
                    <option key={op.value} value={op.value}>{t(op.key)}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-mono text-zinc-300">{t("sos.urgency")}</Label>
                <select
                  value={urgencyLevel}
                  onChange={(e) => setUrgencyLevel(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-white/15 rounded p-2 text-xs sm:text-sm text-white font-sans"
                  data-testid="emergency-select-urgency"
                >
                  {URGENCY_OPTIONS.map((op) => (
                    <option key={op.value} value={op.value}>{t(op.key)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Label className="text-xs font-mono text-zinc-300">{t("sos.describe")}</Label>
                <VoiceInputButton
                  testId="emergency-voice-button"
                  onTranscript={(text) =>
                    setProblemDescription((prev) => (prev ? `${prev} ${text}` : text))
                  }
                />
              </div>
              <Textarea
                rows={3}
                placeholder={t("sos.describePh")}
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                className="bg-[#0A0A0A] border-white/15 text-white font-sans text-xs sm:text-sm"
                data-testid="emergency-input-description"
              />
              <p className="text-[10px] font-mono text-zinc-500">{t("voice.hint")}</p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-heading font-black text-sm sm:text-base uppercase py-5 rounded-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 cursor-pointer"
                data-testid="emergency-submit-btn"
              >
                <Send className="w-4 h-4 shrink-0" />
                {isSubmitting ? t("sos.submitting") : t("sos.submit")}
              </Button>

              <Button type="button" variant="outline" onClick={onClose} className="border-white/20 text-zinc-300">
                {t("sos.cancel")}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
