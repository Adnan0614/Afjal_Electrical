import { Printer } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CompanyBrochureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CompanyBrochureModal({ isOpen, onClose }: CompanyBrochureModalProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#121212] border border-white/20 text-white w-full max-w-[calc(100%-1.5rem)] sm:max-w-3xl p-5 sm:p-10 max-h-[90vh] overflow-y-auto overflow-x-hidden [&>*]:min-w-0 print:bg-white print:text-black print:max-w-none print:border-none" data-testid="brochure-modal">
        <DialogHeader className="text-left border-b border-white/10 pb-6 print:border-zinc-300">
          <div className="flex justify-between items-start">
            <div>
              <Badge className="bg-amber-500/15 border-amber-500/40 text-amber-400 font-mono text-[11px] mb-2">
                OFFICIAL VENDOR CREDENTIALS & CAPABILITY PROFILE
              </Badge>
              <DialogTitle className="font-heading font-black text-3xl sm:text-4xl uppercase tracking-tight text-white print:text-black">
                Afjal Electrical and Rewinding Works
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-zinc-400 print:text-zinc-600 font-sans mt-1">
                Motor & Pump Rewinding • HT/LT Panel Fabrication • Licensed Class-B Contractor
              </DialogDescription>
            </div>
            <div className="hidden sm:flex gap-2 print:hidden">
              <Button
                size="sm"
                variant="outline"
                onClick={handlePrint}
                className="border-white/20 text-zinc-300 hover:text-white"
                data-testid="brochure-print-btn"
              >
                <Printer className="w-4 h-4 mr-1.5" />
                Print / Save PDF
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4 text-left font-sans text-xs sm:text-sm">
          
          {/* Executive Overview */}
          <div className="space-y-2">
            <h4 className="font-heading font-black text-lg text-amber-400 print:text-black uppercase">
              1. Executive Overview & Establishment
            </h4>
            <p className="text-zinc-300 print:text-zinc-800 leading-relaxed">
              Established in 2003 by Mohammad Afjal, <strong>Afjal Electrical and Rewinding Works</strong> is one of Chhattisgarh’s most established heavy electrical service hubs. With over 22 years of continuous technical operation, the firm integrates licensed Class-B electrical contracting with specialized in-house motor, pump, and transformer rewinding facilities.
            </p>
          </div>

          {/* Statutory Registrations Table */}
          <div className="space-y-2">
            <h4 className="font-heading font-black text-lg text-amber-400 print:text-black uppercase">
              2. Statutory Licenses & Tax Registrations
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border border-white/10 print:border-zinc-300">
                <thead className="bg-[#1C1C1C] print:bg-zinc-100 text-zinc-300 print:text-black">
                  <tr>
                    <th className="p-2.5 border-b border-white/10 print:border-zinc-300">Registration / License</th>
                    <th className="p-2.5 border-b border-white/10 print:border-zinc-300">Registration Number</th>
                    <th className="p-2.5 border-b border-white/10 print:border-zinc-300">Issuing Authority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 print:divide-zinc-200">
                  <tr>
                    <td className="p-2.5 font-semibold text-white print:text-black">Electrical Contractor License</td>
                    <td className="p-2.5 text-amber-400 print:text-black font-bold">08/626/B (Class-B)</td>
                    <td className="p-2.5 text-zinc-400 print:text-zinc-600">Govt. of Chhattisgarh Licensing Board</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-white print:text-black">Wireman License</td>
                    <td className="p-2.5 text-amber-400 print:text-black font-bold">NR/10464</td>
                    <td className="p-2.5 text-zinc-400 print:text-zinc-600">Electrical Inspectorate, Raipur</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-white print:text-black">GSTIN (Goods & Services Tax)</td>
                    <td className="p-2.5 text-zinc-200 print:text-black font-bold">22BDBPM9804K2ZH</td>
                    <td className="p-2.5 text-zinc-400 print:text-zinc-600">State & Central Tax Department</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-white print:text-black">Gumasta (Shop & Establishment)</td>
                    <td className="p-2.5 text-zinc-200 print:text-black">000107/RPR/5/2021</td>
                    <td className="p-2.5 text-zinc-400 print:text-zinc-600">Raipur Municipal Authority</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Workshop Machinery & Testing Infrastructure */}
          <div className="space-y-2">
            <h4 className="font-heading font-black text-lg text-amber-400 print:text-black uppercase">
              3. In-House Machinery & Testing Standards
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-[#181818] print:bg-zinc-50 border border-white/10 print:border-zinc-300 p-3 rounded">
                <strong className="text-white print:text-black block font-mono">5000V Digital Megger & Surge Tester</strong>
                <span className="text-zinc-400 print:text-zinc-600">High-voltage dielectric and phase-to-ground insulation verification.</span>
              </div>
              <div className="bg-[#181818] print:bg-zinc-50 border border-white/10 print:border-zinc-300 p-3 rounded">
                <strong className="text-white print:text-black block font-mono">Dynamic Rotor Balancing Rig</strong>
                <span className="text-zinc-400 print:text-zinc-600">ISO 10816 vibration balancing under 1.2 mm/s RMS.</span>
              </div>
              <div className="bg-[#181818] print:bg-zinc-50 border border-white/10 print:border-zinc-300 p-3 rounded">
                <strong className="text-white print:text-black block font-mono">Industrial VPI Baking Oven (135°C)</strong>
                <span className="text-zinc-400 print:text-zinc-600">Vacuum Pressure Impregnation with double-varnish cure.</span>
              </div>
              <div className="bg-[#181818] print:bg-zinc-50 border border-white/10 print:border-zinc-300 p-3 rounded">
                <strong className="text-white print:text-black block font-mono">Precision Coil Winding & Stripping Jigs</strong>
                <span className="text-zinc-400 print:text-zinc-600">Dual-layer slot insulation using Nomex® and Mylar Class-H 180°C.</span>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-[#181818] print:bg-zinc-100 border border-white/10 print:border-zinc-300 p-4 rounded-md space-y-2 font-mono text-xs">
            <div className="text-amber-400 print:text-black font-bold uppercase">Official Workshop & Dispatch Coordinates:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-300 print:text-zinc-800">
              <div>📍 <strong>Address:</strong> Nagar Palika Road, Tilda Neora, Raipur, Chhattisgarh - 493114</div>
              <div>📞 <strong>Phone / Hotline:</strong> +91 9669718100</div>
              <div>✉️ <strong>Email:</strong> afjaleng@gmail.com</div>
              <div>👤 <strong>Proprietor:</strong> Mohammad Afjal</div>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3 print:hidden">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-white/20 text-zinc-300"
            >
              Close
            </Button>
            <Button
              onClick={handlePrint}
              className="bg-[#FF7B00] hover:bg-[#E66A00] text-black font-heading font-black text-sm uppercase px-5"
            >
              <Printer className="w-4 h-4 mr-1.5" />
              Print / Save as PDF
            </Button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
