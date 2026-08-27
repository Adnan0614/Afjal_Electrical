import { useRef, useState } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { logError } from "@/lib/logger";

interface Props {
  /** Called with the transcribed text; the recording itself is never stored. */
  onTranscript: (text: string) => void;
  testId?: string;
}

interface TranscriptionResponse {
  text: string;
}

/** Tap-to-talk mic: records in the browser, sends the clip to Whisper, returns text. */
export default function VoiceInputButton({ onTranscript, testId = "voice-input-button" }: Props): React.JSX.Element {
  const { t } = useI18n();
  const [state, setState] = useState<"idle" | "recording" | "transcribing">("idle");
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const upload = async (blob: Blob): Promise<void> => {
    setState("transcribing");
    try {
      const form = new FormData();
      form.append("audio", blob, "sos_recording.webm");
      // FormData must not go through the JSON helper in lib/api.ts.
      const res = await fetch("/api/speech/transcribe", { method: "POST", body: form });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { detail?: string } | null;
        throw new Error(body?.detail || `status ${res.status}`);
      }
      const data = (await res.json()) as TranscriptionResponse;
      onTranscript(data.text);
      toast.success(t("voice.done"));
    } catch (err) {
      logError("VoiceInputButton.upload", err);
      toast.error(t("voice.failed"));
    } finally {
      setState("idle");
    }
  };

  const start = async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        chunksRef.current = [];
        if (blob.size > 0) void upload(blob);
        else setState("idle");
      };
      recorderRef.current = recorder;
      recorder.start();
      setState("recording");
      toast.info(t("voice.listening"));
    } catch (err) {
      logError("VoiceInputButton.start", err);
      toast.error(t("voice.micDenied"));
      setState("idle");
    }
  };

  const stop = (): void => {
    recorderRef.current?.stop();
    recorderRef.current = null;
  };

  const label =
    state === "recording" ? t("voice.stop") : state === "transcribing" ? t("voice.transcribing") : t("voice.speak");

  return (
    <button
      type="button"
      onClick={() => {
        if (state === "recording") stop();
        else if (state === "idle") void start();
      }}
      disabled={state === "transcribing"}
      className={`inline-flex items-center gap-1.5 text-[11px] font-mono uppercase px-2.5 py-1.5 rounded border transition-colors ${
        state === "recording"
          ? "bg-red-600 border-red-600 text-white animate-pulse cursor-pointer"
          : "bg-[#181818] border-amber-500/40 text-amber-300 hover:border-amber-400 cursor-pointer disabled:opacity-60"
      }`}
      data-testid={testId}
      aria-label={label}
    >
      {state === "recording" && <Square className="w-3.5 h-3.5 fill-current" />}
      {state === "transcribing" && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
      {state === "idle" && <Mic className="w-3.5 h-3.5" />}
      {label}
    </button>
  );
}
