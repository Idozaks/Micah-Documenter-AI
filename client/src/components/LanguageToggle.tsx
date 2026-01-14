import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { Globe } from "lucide-react";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "he" ? "en" : "he");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      aria-label={language === "he" ? "Switch to English" : "עבור לעברית"}
      data-testid="button-language-toggle"
    >
      <Globe className="w-5 h-5" aria-hidden="true" />
      <span className="sr-only">{language === "he" ? "EN" : "עב"}</span>
    </Button>
  );
}
