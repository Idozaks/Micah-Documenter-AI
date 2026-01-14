import { Shield, Lock, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border py-8 mt-auto">
      <div className="max-w-4xl mx-auto px-6 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6 flex-wrap justify-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="w-4 h-4" aria-hidden="true" />
              <span className="text-sm">Secure Processing</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Lock className="w-4 h-4" aria-hidden="true" />
              <span className="text-sm">Privacy Protected</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500" aria-hidden="true" />
            <span>for clarity</span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border/50 text-center">
          <p className="text-sm text-muted-foreground">
            Your text is processed securely and never stored permanently.
          </p>
        </div>
      </div>
    </footer>
  );
}
