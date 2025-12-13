import { Megaphone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function PromoBanner() {
  const { t } = useLanguage();

  return (
    <div
      className="rounded-lg p-2 sm:p-3 overflow-hidden flex items-center gap-2 sm:gap-3"
      style={{ backgroundColor: "#1f1f1f" }}
    >
      <Megaphone className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
      <div className="flex-1 overflow-hidden">
        <div className="animate-scroll whitespace-nowrap">
          <span className="text-xs sm:text-sm text-foreground inline-block px-2 sm:px-4">
            {t("promoBannerText")}
          </span>
        </div>
      </div>
    </div>
  );
}
