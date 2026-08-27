import { useState } from "react";
import { MessageSquarePlus, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost } from "@/lib/api";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { logError } from "@/lib/logger";
import type { Review, ReviewCreate } from "@/types";

export default function ReviewsSection(): React.JSX.Element {
  const { t } = useI18n();
  const [filter, setFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [rating, setRating] = useState(5);
  const [equipment, setEquipment] = useState("");
  const [reviewText, setReviewText] = useState("");

  const queryClient = useQueryClient();

  const { data: reviews = [] } = useQuery<Review[]>({
    queryKey: ["reviews"],
    queryFn: () => apiGet<Review[]>("/reviews"),
  });

  const mutation = useMutation({
    mutationFn: (newRev: ReviewCreate) => apiPost<Review>("/reviews", newRev),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success(t("rev.thanks"));
      setIsModalOpen(false);
      setName("");
      setCompany("");
      setEquipment("");
      setReviewText("");
    },
    onError: (err) => {
      logError("ReviewsSection.submit", err);
      toast.error(t("rev.error"));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !reviewText.trim()) {
      toast.error(t("rev.validation"));
      return;
    }
    mutation.mutate({
      author_name: name,
      company_or_location: company || "Raipur / CG",
      rating,
      equipment_serviced: equipment || "Electrical Service",
      review_text: reviewText,
      verified_customer: true,
    });
  };

  const filteredReviews = reviews.filter((r) => {
    if (filter === "all") return true;
    if (filter === "photos") return Boolean(r.photo_url);
    const text = (r.equipment_serviced + " " + r.company_or_location).toLowerCase();
    if (filter === "mills") return text.includes("mill") || text.includes("rice");
    if (filter === "industrial") return text.includes("rolling") || text.includes("steel") || text.includes("urla") || text.includes("siltara");
    if (filter === "pumps") return text.includes("pump") || text.includes("submersible") || text.includes("irrigation");
    return true;
  });

  return (
    <section id="reviews" className="py-16 sm:py-24 bg-[#0D0D0D] border-b border-white/10" data-testid="reviews-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 text-left">
          <div className="max-w-2xl">
            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 font-mono text-xs uppercase mb-3">
              <Star className="w-3.5 h-3.5 mr-1.5 fill-current" />
              {t("rev.badge")}
            </Badge>
            <h2 className="font-heading font-black text-3xl sm:text-5xl uppercase text-white tracking-tight">{t("rev.heading")}</h2>
            <p className="text-zinc-300 text-sm sm:text-base font-sans mt-2">{t("rev.sub")}</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="bg-[#141414] border border-white/10 rounded-md p-3.5 flex items-center gap-3">
              <div className="text-3xl font-heading font-black text-amber-400">4.9</div>
              <div>
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={`summary-star-${i}`} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <div className="text-[11px] font-mono text-zinc-400">{t("rev.ratings")}</div>
              </div>
            </div>

            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#FF7B00] hover:bg-[#E66A00] text-black font-heading font-black text-sm uppercase px-5 py-5 rounded-sm cursor-pointer"
              data-testid="write-review-open-btn"
            >
              <MessageSquarePlus className="w-4 h-4 mr-1.5" />
              {t("rev.writeBtn")}
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8 text-left">
          {[
            { id: "all", labelKey: "rev.filterAll" },
            { id: "mills", labelKey: "rev.filterMills" },
            { id: "industrial", labelKey: "rev.filterIndustrial" },
            { id: "pumps", labelKey: "rev.filterPumps" },
            { id: "photos", labelKey: "rev.photosOnly" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`font-mono text-xs px-3.5 py-1.5 rounded border transition-all cursor-pointer ${
                filter === tab.id ? "bg-[#FF7B00] text-black font-bold border-[#FF7B00]" : "bg-[#141414] border-white/10 text-zinc-300 hover:border-amber-400/40"
              }`}
              data-testid={`reviews-filter-${tab.id}`}
            >
              {t(tab.labelKey)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className={`bg-[#141414] border rounded-md overflow-hidden flex flex-col justify-between transition-all hover:-translate-y-0.5 hover:border-amber-500/40 ${
                rev.featured ? "border-amber-500/50 shadow-lg shadow-amber-900/20" : "border-white/10"
              }`}
              data-testid={`review-card-${rev.id}`}
            >
              {rev.photo_url && (
                <div className="relative">
                  <img
                    src={rev.photo_url}
                    alt={`${rev.equipment_serviced} — ${rev.author_name}`}
                    loading="lazy"
                    className="w-full h-44 object-cover"
                    data-testid={`review-photo-${rev.id}`}
                  />
                  <span className="absolute bottom-2 left-2 text-[10px] font-mono uppercase bg-black/75 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded">
                    {t("rev.withPhoto")}
                  </span>
                </div>
              )}
              <div className="p-6 flex flex-col justify-between space-y-4 flex-1">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex text-amber-400">
                    {Array.from({ length: rev.rating }, (_, i) => (
                      <Star key={`star-${rev.id}-${i}`} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  {rev.verified_customer && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5" /> {t("rev.verifiedWork")}
                    </span>
                  )}
                </div>

                <div className="text-xs font-mono text-amber-300 bg-amber-950/30 border border-amber-500/20 px-2.5 py-1 rounded inline-block">
                  {rev.equipment_serviced}
                </div>

                <p className="font-sans text-xs sm:text-sm text-zinc-300 leading-relaxed italic">"{rev.review_text}"</p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs shrink-0">
                  {rev.author_name.charAt(0)}
                </div>
                <div>
                  <div className="font-heading font-black text-sm uppercase text-white">{rev.author_name}</div>
                  <div className="text-[11px] font-sans text-zinc-400">{rev.company_or_location}</div>
                </div>
              </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-[#141414] border border-white/20 text-white w-full max-w-[calc(100%-1.5rem)] sm:max-w-lg p-5 sm:p-8 max-h-[90vh] overflow-y-auto overflow-x-hidden [&>*]:min-w-0">
          <DialogHeader>
            <DialogTitle className="font-heading font-black text-2xl uppercase tracking-tight text-white text-left">
              {t("rev.modalTitle")}
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400 font-sans text-left">
              {t("rev.modalDesc")}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-left">
            <div className="space-y-1.5">
              <Label className="text-xs font-mono text-zinc-300">{t("rev.name")}</Label>
              <Input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("rev.namePh")}
                className="bg-[#0A0A0A] border-white/15 text-white font-sans text-sm"
                data-testid="review-input-name"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-mono text-zinc-300">{t("rev.company")}</Label>
              <Input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder={t("rev.companyPh")}
                className="bg-[#0A0A0A] border-white/15 text-white font-sans text-sm"
                data-testid="review-input-company"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-mono text-zinc-300">{t("rev.equipment")}</Label>
              <Input
                value={equipment}
                onChange={(e) => setEquipment(e.target.value)}
                placeholder={t("rev.equipmentPh")}
                className="bg-[#0A0A0A] border-white/15 text-white font-sans text-sm"
                data-testid="review-input-equipment"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-mono text-zinc-300">{t("rev.rating")}</Label>
              <div className="flex flex-wrap gap-2">
                {[5, 4, 3, 2, 1].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setRating(num)}
                    className={`px-2.5 py-1.5 rounded border text-xs font-mono flex items-center gap-1 shrink-0 cursor-pointer ${
                      rating === num ? "bg-amber-500 text-black font-bold border-amber-500" : "bg-[#0A0A0A] border-white/15 text-zinc-300"
                    }`}
                    data-testid={`review-rating-${num}`}
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-mono text-zinc-300">{t("rev.text")}</Label>
              <Textarea
                required
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder={t("rev.textPh")}
                className="bg-[#0A0A0A] border-white/15 text-white font-sans text-sm"
                data-testid="review-input-text"
              />
            </div>

            <div className="pt-2 flex flex-wrap justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="border-white/20 text-zinc-300"
              >
                {t("rev.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="bg-[#FF7B00] hover:bg-[#E66A00] text-black font-heading font-black text-sm uppercase px-6"
                data-testid="review-submit-button"
              >
                {mutation.isPending ? t("rev.submitting") : t("rev.submit")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
