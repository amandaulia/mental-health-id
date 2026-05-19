import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

// Routes where the button is also shown on desktop (infinite-scroll pages).
const DESKTOP_ROUTES = ["/professional-counseling"];

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const { pathname } = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showOnDesktop = DESKTOP_ROUTES.some((r) => pathname.startsWith(r));

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label={t('common.scrollToTop')}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(
        "fixed bottom-6 z-50 h-11 w-11 rounded-full bg-primary text-primary-foreground",
        "shadow-[0_8px_24px_-6px_hsl(15_50%_30%/0.45)] items-center justify-center",
        "transition-transform duration-200 hover:scale-105 active:scale-95",
        // Mobile: bottom-right. Desktop (only on infinite-scroll routes): bottom-center.
        showOnDesktop
          ? "right-4 flex md:right-1/2 md:translate-x-1/2"
          : "right-4 flex md:hidden"
      )}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}