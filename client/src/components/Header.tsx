import { FileText } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="max-w-4xl mx-auto px-6 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
              <FileText className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-semibold text-foreground" data-testid="text-logo">
                ClearLetter
              </span>
              <span className="text-sm text-muted-foreground hidden sm:block">
                Simple explanations for complex letters
              </span>
            </div>
          </div>

          <nav className="flex items-center gap-4" aria-label="Main navigation">
            <a
              href="#how-it-works"
              className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md hover-elevate"
              data-testid="link-how-it-works"
            >
              How It Works
            </a>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
