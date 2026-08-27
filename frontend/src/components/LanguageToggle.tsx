import { Languages } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface LanguageToggleProps {
  compact?: boolean;
}

export default function LanguageToggle({ compact = false }: LanguageToggleProps) {
  const { lang, setLang } = useI18n();

  return (
    <div
      className={`inline-flex items-center rounded-sm border border-white/15 bg-[#141414] overflow-hidden ${compact ? "text-[10px]" : "text-xs"}`}
      data-testid="language-toggle"
    >
      {!compact && (
        <span className="pl-2 pr-1 text-zinc-500">
          <Languages className="w-3.5 h-3.5" />
        </span>
      )}
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`px-2.5 py-1.5 font-mono font-bold transition-colors cursor-pointer ${
          lang === "en" ? "bg-[#FF7B00] text-black" : "text-zinc-300 hover:text-white"
        }`}
        data-testid="lang-btn-en"
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang("hi")}
        className={`px-2.5 py-1.5 font-bold transition-colors cursor-pointer ${
          lang === "hi" ? "bg-[#FF7B00] text-black" : "text-zinc-300 hover:text-white"
        }`}
        data-testid="lang-btn-hi"
      >
        हिंदी
      </button>
    </div>
  );
}
