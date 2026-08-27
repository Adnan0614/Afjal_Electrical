import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, Trash2, Pin, PinOff, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import { logError } from "@/lib/logger";
import type { Review, ReviewCreate } from "@/types";

/** Owner-side manager for the Google-style reviews wall: add with a job photo, pin, delete. */
export default function OwnerReviews(): React.JSX.Element {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  const [author, setAuthor] = useState("");
  const [company, setCompany] = useState("");
  const [equipment, setEquipment] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  const { data: reviews = [] } = useQuery<Review[]>({
    queryKey: ["reviews"],
    queryFn: () => apiGet<Review[]>("/reviews"),
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["reviews"] });

  const addMutation = useMutation<Review, Error, ReviewCreate>({
    mutationFn: (payload) => apiPost<Review>("/reviews", payload),
    onSuccess: () => {
      refresh();
      toast.success(t("own.revAdded"));
      setAuthor("");
      setCompany("");
      setEquipment("");
      setText("");
      setPhotoUrl("");
      setRating(5);
    },
    onError: (err) => {
      logError("OwnerReviews.add", err);
      toast.error(t("own.revAddError"));
    },
  });

  const featureMutation = useMutation<Review, Error, { id: string; featured: boolean }>({
    mutationFn: ({ id, featured }) => apiPatch<Review>(`/reviews/${id}/feature`, { featured }),
    onSuccess: (saved) => {
      refresh();
      toast.success(saved.featured ? t("own.revPinned") : t("own.revUnpinned"));
    },
    onError: (err) => {
      logError("OwnerReviews.feature", err);
      toast.error(t("own.revAddError"));
    },
  });

  const deleteMutation = useMutation<Review, Error, string>({
    mutationFn: (id) => apiDelete<Review>(`/reviews/${id}`),
    onSuccess: () => {
      refresh();
      toast.success(t("own.revDeleted"));
    },
    onError: (err) => {
      logError("OwnerReviews.delete", err);
      toast.error(t("own.revAddError"));
    },
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) {
      toast.error(t("rev.validation"));
      return;
    }
    addMutation.mutate({
      author_name: author.trim(),
      company_or_location: company.trim() || "Raipur / CG",
      rating,
      equipment_serviced: equipment.trim() || "Electrical Service",
      review_text: text.trim(),
      verified_customer: true,
      photo_url: photoUrl.trim() || undefined,
      featured: false,
    });
  };

  return (
    <div className="space-y-6 text-left" data-testid="owner-reviews-panel">
      <form
        onSubmit={submit}
        className="bg-[#141414] border border-white/10 rounded-md p-6 space-y-4"
        data-testid="owner-review-form"
      >
        <div className="space-y-1">
          <h3 className="font-heading font-black text-xl text-white uppercase flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-current" />
            {t("own.revTitle")}
          </h3>
          <p className="text-xs font-sans text-zinc-400 max-w-3xl">{t("own.revDesc")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-mono text-zinc-300">{t("rev.name")}</Label>
            <Input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder={t("rev.namePh")}
              className="bg-[#0A0A0A] border-white/15 text-white font-sans text-sm"
              data-testid="owner-review-author-input"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-mono text-zinc-300">{t("rev.company")}</Label>
            <Input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder={t("rev.companyPh")}
              className="bg-[#0A0A0A] border-white/15 text-white font-sans text-sm"
              data-testid="owner-review-company-input"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-mono text-zinc-300">{t("rev.equipment")}</Label>
            <Input
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
              placeholder={t("rev.equipmentPh")}
              className="bg-[#0A0A0A] border-white/15 text-white font-sans text-sm"
              data-testid="owner-review-equipment-input"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-mono text-zinc-300 flex items-center gap-1.5">
              <ImagePlus className="w-3.5 h-3.5 text-amber-400" />
              {t("own.revPhotoUrl")}
            </Label>
            <Input
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://…"
              className="bg-[#0A0A0A] border-white/15 text-white font-mono text-xs"
              data-testid="owner-review-photo-input"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-mono text-zinc-300">{t("rev.rating")}</Label>
          <div className="flex flex-wrap gap-2">
            {[5, 4, 3, 2, 1].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setRating(num)}
                className={`px-2.5 py-1.5 rounded border text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors ${
                  rating === num
                    ? "bg-amber-500 text-black font-bold border-amber-500"
                    : "bg-[#0A0A0A] border-white/15 text-zinc-300 hover:border-amber-400/50"
                }`}
                data-testid={`owner-review-rating-${num}`}
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
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("rev.textPh")}
            className="bg-[#0A0A0A] border-white/15 text-white font-sans text-sm"
            data-testid="owner-review-text-input"
          />
        </div>

        {photoUrl.trim() && (
          <img
            src={photoUrl}
            alt="Review photo preview"
            className="w-full sm:w-72 h-40 object-cover rounded border border-white/10"
            data-testid="owner-review-photo-preview"
          />
        )}

        <Button
          type="submit"
          disabled={addMutation.isPending}
          className="bg-[#FF7B00] hover:bg-[#E66A00] text-black font-heading font-black text-base uppercase px-6 py-5 rounded-sm cursor-pointer"
          data-testid="owner-review-save-button"
        >
          {addMutation.isPending ? t("rev.submitting") : t("own.revPublish")}
        </Button>
      </form>

      <div className="space-y-3">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-[#141414] border border-white/10 rounded-md p-4 flex flex-wrap items-start gap-4"
            data-testid={`owner-review-row-${rev.id}`}
          >
            {rev.photo_url && (
              <img
                src={rev.photo_url}
                alt={rev.author_name}
                className="w-24 h-20 object-cover rounded border border-white/10 shrink-0"
              />
            )}
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-heading font-black text-base uppercase text-white">{rev.author_name}</span>
                <span className="flex text-amber-400">
                  {Array.from({ length: rev.rating }, (_, i) => (
                    <Star key={`owner-star-${rev.id}-${i}`} className="w-3 h-3 fill-current" />
                  ))}
                </span>
                {rev.featured && (
                  <span className="text-[10px] font-mono uppercase text-emerald-300 border border-emerald-500/40 bg-emerald-950/30 px-2 py-0.5 rounded">
                    {t("own.revFeatured")}
                  </span>
                )}
              </div>
              <div className="text-[11px] font-mono text-zinc-400">
                {rev.company_or_location} • {rev.equipment_serviced}
              </div>
              <p className="text-xs font-sans text-zinc-300 line-clamp-2">{rev.review_text}</p>
            </div>

            <div className="flex gap-2 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => featureMutation.mutate({ id: rev.id, featured: !rev.featured })}
                className="border-white/20 text-zinc-200 bg-[#1C1C1C] font-mono text-[11px] cursor-pointer"
                data-testid={`owner-review-feature-${rev.id}`}
              >
                {rev.featured ? <PinOff className="w-3.5 h-3.5 mr-1" /> : <Pin className="w-3.5 h-3.5 mr-1 text-amber-400" />}
                {rev.featured ? t("own.revUnpin") : t("own.revPin")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => deleteMutation.mutate(rev.id)}
                className="border-red-500/40 text-red-300 bg-red-950/30 font-mono text-[11px] cursor-pointer"
                data-testid={`owner-review-delete-${rev.id}`}
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                {t("own.revDelete")}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
