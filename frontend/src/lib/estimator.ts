/**
 * Pricing rules for the workshop cost estimator.
 *
 * Kept out of the component so the arithmetic is independently testable and the
 * UI file stays presentational. All rates are Afjal Electricals' workshop rates —
 * update them here and both the estimate and the WhatsApp quote follow.
 */

export type EquipmentKind = "hp" | "sqft" | "panel";

export interface EquipmentOption {
  id: string;
  nameKey: string;
  descKey: string;
  type: EquipmentKind;
  hpOptions: number[];
  basePerHp: number;
}

export type WireGrade = "class_h" | "class_f";

export interface EstimatorSelection {
  equipment: EquipmentOption;
  capacity: number;
  wireGrade: WireGrade;
  includeSkfBearings: boolean;
  includeDynamicBalancing: boolean;
  includeVpiBaking: boolean;
  expressTurnaround: boolean;
}

export interface EstimateResult {
  minEstimate: number;
  maxEstimate: number;
  median: number;
  turnaroundKey: string;
}

export const EQUIPMENT_TYPES: EquipmentOption[] = [
  { id: "3phase_motor", nameKey: "eq.3phase", descKey: "eq.3phaseDesc", type: "hp", hpOptions: [1, 2, 3, 5, 7.5, 10, 15, 20, 25, 30, 40, 50, 75, 100, 150, 200], basePerHp: 380 },
  { id: "submersible_pump", nameKey: "eq.pump", descKey: "eq.pumpDesc", type: "hp", hpOptions: [3, 5, 7.5, 10, 12.5, 15, 20, 25, 30, 40, 50], basePerHp: 440 },
  { id: "single_phase", nameKey: "eq.single", descKey: "eq.singleDesc", type: "hp", hpOptions: [0.5, 1, 1.5, 2, 3, 5], basePerHp: 650 },
  { id: "lt_panel", nameKey: "eq.panel", descKey: "eq.panelDesc", type: "panel", hpOptions: [1, 2, 3, 4, 5], basePerHp: 3500 },
  { id: "commercial_wiring", nameKey: "eq.wiring", descKey: "eq.wiringDesc", type: "sqft", hpOptions: [500, 1000, 2500, 5000, 10000, 20000], basePerHp: 22 },
];

export const CLASS_H_LABEL = "Dual-Coated Class-H (180°C)";
export const CLASS_F_LABEL = "Standard Class-F (155°C)";

function bearingCost(capacity: number): number {
  if (capacity <= 10) return 800;
  if (capacity <= 50) return 1800;
  return 3500;
}

/** Human-readable capacity, e.g. "50 HP", "2500 Sq. Ft.", "Level 3". */
export function capacityLabelFor(equipment: EquipmentOption, capacity: number): string {
  if (equipment.type === "sqft") return `${capacity} Sq. Ft.`;
  if (equipment.type === "panel") return `Level ${capacity}`;
  return `${capacity} HP`;
}

/** Short label used on the capacity selector chips. */
export function capacityChipLabel(type: EquipmentOption["type"], capacity: number): string {
  if (type === "sqft") return `${capacity} sqft`;
  if (type === "panel") return `L${capacity}`;
  return `${capacity} HP`;
}

export function calculateEstimate(sel: EstimatorSelection): EstimateResult {
  const { equipment, capacity } = sel;

  let base: number;
  if (equipment.type === "hp") base = capacity * equipment.basePerHp + 650;
  else if (equipment.type === "sqft") base = capacity * equipment.basePerHp;
  else base = capacity * equipment.basePerHp + 2000;

  let total = base * (sel.wireGrade === "class_h" ? 1.15 : 1.0);

  // Bearings and rotor balancing only apply to rotating machines.
  if (sel.includeSkfBearings && equipment.type === "hp") total += bearingCost(capacity);
  if (sel.includeDynamicBalancing && equipment.type === "hp") total += capacity <= 20 ? 600 : 1200;
  if (sel.includeVpiBaking) total += capacity <= 20 ? 500 : 1100;
  if (sel.expressTurnaround) total *= 1.15;

  const median = Math.round(total / 50) * 50;

  let turnaroundKey = "est.turnaround1";
  if (sel.expressTurnaround) turnaroundKey = "est.turnaround2";
  else if (capacity >= 100) turnaroundKey = "est.turnaround3";

  return {
    minEstimate: Math.round((median * 0.95) / 50) * 50,
    maxEstimate: Math.round((median * 1.08) / 50) * 50,
    median,
    turnaroundKey,
  };
}
