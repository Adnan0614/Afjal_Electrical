import { ShieldCheck, Award, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface LicensesComplianceProps {
  onOpenBrochure: () => void;
}

export default function LicensesCompliance({ onOpenBrochure }: LicensesComplianceProps) {
  const licenses = [
    {
      id: "contractor",
      type: "Electrical Contractor License",
      number: "08/626/B",
      authority: "Govt. of Chhattisgarh (Electrical Licensing Board)",
      classification: "Class-B Licensed Contractor",
      scope: "Authorized for HT/LT electrical installations, industrial sub-stations, panel fabrication, load sanctions & certifications.",
      validity: "Active & Verified (Renewed)",
    },
    {
      id: "wireman",
      type: "Licensed Electrical Wireman",
      number: "NR/10464",
      authority: "Chief Electrical Inspectorate / Licensing Board",
      classification: "Master Wireman Permit",
      scope: "Certified for domestic, commercial, industrial 3-phase wiring, motor stator winding, and earth electrode testing.",
      validity: "Active & Verified",
    },
    {
      id: "gstin",
      type: "Goods & Services Tax (GSTIN)",
      number: "22BDBPM9804K2ZH",
      authority: "Government of India & Chhattisgarh State Tax",
      classification: "Registered Taxable Entity",
      scope: "Valid GST billing for all industrial equipment repair, AMC contracts, material procurement & contracting with full ITC benefits.",
      validity: "Active",
    },
    {
      id: "gumasta",
      type: "Shop & Establishment (Gumasta)",
      number: "000107/RPR/5/2021",
      authority: "Raipur District Municipal Administration",
      classification: "Registered Engineering Workshop",
      scope: "Authorized commercial repair workshop operation at Nagar Palika Road, Tilda Neora.",
      validity: "Active",
    },
  ];

  return (
    <section id="licenses" className="py-16 sm:py-24 bg-[#0D0D0D] border-b border-white/10" data-testid="licenses-compliance-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-left max-w-3xl mb-12">
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-mono text-xs uppercase mb-3">
            <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
            Statutory Legal Compliance
          </Badge>
          <h2 className="font-heading font-black text-3xl sm:text-5xl uppercase text-white tracking-tight">
            Government Licensed & Fully Compliant
          </h2>
          <p className="text-zinc-300 text-sm sm:text-base font-sans mt-2">
            Never risk untested or unregistered local mechanics for your industrial plant. We operate with full Class-B and Wireman certifications from the Government of Chhattisgarh.
          </p>
        </div>

        {/* License Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {licenses.map((lic) => (
            <div
              key={lic.id}
              className="bg-[#141414] border border-white/10 hover:border-amber-500/50 rounded-md p-6 flex flex-col justify-between space-y-4 text-left transition-all group"
              data-testid={`license-card-${lic.id}`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-zinc-400 uppercase">{lic.type}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </div>

                <div className="font-mono text-xl font-black text-amber-400 group-hover:text-amber-300 tracking-wider">
                  {lic.number}
                </div>

                <div className="text-xs font-semibold text-white">
                  {lic.classification}
                </div>

                <p className="text-[11px] font-sans text-zinc-400 leading-relaxed">
                  {lic.scope}
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                  <span>Authority:</span>
                  <span className="text-zinc-300 truncate max-w-[130px]">{lic.authority}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400">
                  <span>Status:</span>
                  <span className="font-bold">{lic.validity}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Banner for Official Brochure & Credentials */}
        <div className="mt-8 bg-gradient-to-r from-amber-950/30 via-[#181818] to-[#121212] border border-amber-500/30 rounded-md p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
          <div className="space-y-1">
            <h3 className="font-heading font-black text-2xl text-white uppercase flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-400" />
              Need Official Vendor Registration Documents?
            </h3>
            <p className="text-xs sm:text-sm font-sans text-zinc-300">
              Download our complete corporate capability brochure, GST certificate details, and Class-B credentials sheet for your plant procurement audit.
            </p>
          </div>

          <Button
            onClick={onOpenBrochure}
            className="bg-[#FF7B00] hover:bg-[#E66A00] text-black font-heading font-black text-sm uppercase px-6 py-5 rounded-sm shrink-0 cursor-pointer"
            data-testid="license-open-brochure-btn"
          >
            <Download className="w-4 h-4 mr-2" />
            View & Download Profile
          </Button>
        </div>

      </div>
    </section>
  );
}
