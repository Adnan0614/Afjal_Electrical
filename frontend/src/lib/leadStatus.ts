/** Lead pipeline vocabulary shared by the owner dashboard UI. */
export const LEAD_STATUSES = ["new", "called", "quoted", "won", "lost"] as const;

export type LeadStatusValue = (typeof LEAD_STATUSES)[number];

export const LEAD_STATUS_LABEL_KEY: Record<LeadStatusValue, string> = {
  new: "pipe.new",
  called: "pipe.called",
  quoted: "pipe.quoted",
  won: "pipe.won",
  lost: "pipe.lost",
};

/** Tailwind classes per stage — amber for open work, emerald for won, zinc for lost. */
export const LEAD_STATUS_CLASS: Record<LeadStatusValue, string> = {
  new: "bg-amber-500/15 text-amber-300 border-amber-500/40",
  called: "bg-cyan-500/15 text-cyan-300 border-cyan-500/40",
  quoted: "bg-violet-500/15 text-violet-300 border-violet-500/40",
  won: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
  lost: "bg-zinc-600/25 text-zinc-400 border-white/15",
};

export function normalizeStatus(status: string): LeadStatusValue {
  const found = LEAD_STATUSES.find((s) => s === status);
  // Legacy rows used "contacted"/"in_progress"; fold them into the closest stage.
  if (found) return found;
  if (status === "contacted") return "called";
  if (status === "in_progress") return "quoted";
  if (status === "completed") return "won";
  return "new";
}
