import { Wrench, CheckCircle2, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ServicesBentoProps {
  onSelectService: (serviceName: string) => void;
}

export default function ServicesBento({ onSelectService }: ServicesBentoProps) {
  const services = [
    {
      id: "motor_rewinding",
      number: "01",
      title: "Industrial Motor & Pump Rewinding",
      tag: "Core Speciality",
      description: "Complete strip, rebuild and dual-coat Class-H copper rewinding for 3-phase induction motors, slip-ring crane motors, submersible borewell pumps, and DC motors up to 250 HP.",
      specs: ["0.5 HP to 250 HP Capacity", "100% Dual-Coated Copper", "Nomex Class-H Slot Paper", "6-Month Written Warranty"],
      highlight: true,
      colSpan: "lg:col-span-8",
      image: "https://images.unsplash.com/photo-1692719094491-2746e82a8595?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "panel_switchgear",
      number: "02",
      title: "HT / LT Panel & Switchgear Work",
      tag: "Class-B Certified",
      description: "Distribution boards, Star-Delta & Soft Starters, VFD drive panels, APFC capacitor banks, and relay calibration for industrial plants.",
      specs: ["415V LT Distribution Boards", "APFC Power Factor Panels", "Motor Control Centers (MCC)", "Busbar Fabrication"],
      highlight: false,
      colSpan: "lg:col-span-4",
      image: "https://images.pexels.com/photos/28265032/pexels-photo-28265032.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      id: "contracting",
      number: "03",
      title: "Licensed Class-B Electrical Contracting",
      tag: "Govt License 08/626/B",
      description: "End-to-end electrical contracting for new factories, rice mills, commercial buildings, HT substation lines, and official load extensions in Chhattisgarh.",
      specs: ["Class-B Contractor Lic: 08/626/B", "Licensed Wireman NR/10464", "Electrical Inspector Clearance", "Heavy Armored Cable Laying"],
      highlight: false,
      colSpan: "lg:col-span-4",
      image: "https://images.pexels.com/photos/34194564/pexels-photo-34194564.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      id: "transformer",
      number: "04",
      title: "Transformer Servicing & Oil Filtration",
      tag: "High Voltage HT",
      description: "Distribution transformer testing, BDV oil filtration, silica gel breather servicing, and high voltage coil rewinding up to 500 kVA.",
      specs: ["BDV Dielectric Oil Testing", "Bushing & Gasket Overhaul", "Winding Insulation Megger", "HT/LT Ratio Testing"],
      highlight: false,
      colSpan: "lg:col-span-4",
      image: "https://images.pexels.com/photos/13287446/pexels-photo-13287446.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      id: "breakdown_amc",
      number: "05",
      title: "24/7 Breakdown Repair & Annual AMC",
      tag: "Rapid 45-Min SOS",
      description: "On-call mobile field response unit equipped with 5000V Meggers, clamp meters, and emergency spare contactors to restore plant operations rapidly.",
      specs: ["45-Min Raipur & Tilda Response", "Scheduled Maintenance AMC", "Thermal Hotspot Scanning", "Dedicated Senior Technicians"],
      highlight: true,
      colSpan: "lg:col-span-4",
      image: "https://images.pexels.com/photos/33531832/pexels-photo-33531832.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
  ];

  return (
    <section id="services" className="py-16 sm:py-24 bg-[#0A0A0A] border-b border-white/10" data-testid="services-bento-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-left max-w-3xl mb-12">
          <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 font-mono text-xs uppercase mb-3">
            <Wrench className="w-3.5 h-3.5 mr-1.5" />
            Comprehensive Capabilities
          </Badge>
          <h2 className="font-heading font-black text-3xl sm:text-5xl uppercase text-white tracking-tight">
            Rewinding, Wiring & Everything In Between
          </h2>
          <p className="text-zinc-300 text-sm sm:text-base font-sans mt-2">
            Licensed Class-B contractor and Master Wireman under one roof. Whether you need a 200 HP heavy mill motor rewound or an entire industrial facility wired to code, we execute to exact standards.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {services.map((srv) => (
            <div
              key={srv.id}
              className={`${srv.colSpan} bg-gradient-to-b from-[#161616] to-[#101010] border border-white/10 rounded-md overflow-hidden flex flex-col justify-between group hover:border-amber-500/50 transition-all duration-300 text-left`}
              data-testid={`service-card-${srv.id}`}
            >
              <div className="p-6 sm:p-8 space-y-4">
                
                {/* Header line */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xl font-black text-amber-500/40 group-hover:text-amber-400 transition-colors">
                    {srv.number}
                  </span>
                  <Badge variant="outline" className="font-mono text-[11px] border-amber-500/40 text-amber-400 bg-amber-500/10">
                    {srv.tag}
                  </Badge>
                </div>

                {/* Title */}
                <h3 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-tight group-hover:text-amber-300 transition-colors">
                  {srv.title}
                </h3>

                {/* Description */}
                <p className="font-sans text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {srv.description}
                </p>

                {/* Specs list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {srv.specs.map((spec, sidx) => (
                    <div key={sidx} className="flex items-center gap-2 text-xs font-mono text-zinc-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>

              </div>

              {/* Card Footer Action */}
              <div className="p-6 sm:px-8 sm:pb-8 pt-0 flex items-center justify-between border-t border-white/5 mt-4">
                <Button
                  onClick={() => onSelectService(srv.title)}
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-zinc-200 group-hover:border-amber-400 group-hover:text-white bg-[#0A0A0A] font-mono text-xs cursor-pointer"
                  data-testid={`service-quote-btn-${srv.id}`}
                >
                  Estimate Cost for This
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </Button>

                <a
                  href="tel:+919669718100"
                  className="text-xs font-mono text-zinc-400 hover:text-amber-400 flex items-center gap-1"
                >
                  Call: 9669718100
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
