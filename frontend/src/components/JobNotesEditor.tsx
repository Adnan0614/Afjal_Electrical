import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NotebookPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { apiPatch } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import { logError } from "@/lib/logger";
import VoiceInputButton from "@/components/VoiceInputButton";
import type { JobTracker } from "@/types";

/** Technician notes for one repair job — typed or dictated, saved to the customer tracker. */
export default function JobNotesEditor({ job }: { job: JobTracker }): React.JSX.Element {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [notes, setNotes] = useState<string>(job.technician_notes || "");

  const saveMutation = useMutation<JobTracker, Error, string>({
    mutationFn: (value) => apiPatch<JobTracker>(`/jobs/${job.job_id}/notes`, { technician_notes: value }),
    onSuccess: (saved) => {
      setNotes(saved.technician_notes || "");
      queryClient.invalidateQueries({ queryKey: ["owner-jobs"] });
      toast.success(t("own.notesSaved"));
    },
    onError: (err) => {
      logError("JobNotesEditor.save", err);
      toast.error(t("own.notesError"));
    },
  });

  return (
    <div className="space-y-2 pt-3 border-t border-white/5" data-testid={`job-notes-editor-${job.job_id}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] font-mono uppercase text-zinc-400 flex items-center gap-1.5">
          <NotebookPen className="w-3.5 h-3.5 text-amber-400" />
          {t("own.notesLabel")}
        </span>
        <VoiceInputButton
          testId={`job-notes-voice-${job.job_id}`}
          onTranscript={(text) => setNotes((prev) => (prev ? `${prev} ${text}` : text))}
        />
      </div>

      <Textarea
        rows={2}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder={t("own.notesPlaceholder")}
        className="bg-[#0A0A0A] border-white/15 text-white font-sans text-xs"
        data-testid={`job-notes-input-${job.job_id}`}
      />

      <Button
        onClick={() => saveMutation.mutate(notes)}
        disabled={saveMutation.isPending}
        variant="outline"
        size="sm"
        className="border-amber-500/40 text-amber-300 bg-[#1C1C1C] font-mono text-[11px] cursor-pointer"
        data-testid={`job-notes-save-${job.job_id}`}
      >
        {saveMutation.isPending ? t("own.saving") : t("own.saveNotes")}
      </Button>
    </div>
  );
}
