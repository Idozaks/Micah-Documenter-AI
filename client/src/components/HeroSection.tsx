import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const scrollToInput = () => {
    const element = document.getElementById("input-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-12 md:py-20 px-6 md:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6" data-testid="text-hero-title">
          Transform Complex Letters
          <br />
          <span className="text-primary">into Clear Explanations</span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10" data-testid="text-hero-subtitle">
          Paste any official letter from municipalities, government bodies, or medical institutions. 
          We'll explain it in simple, friendly terms.
        </p>

        <Button
          size="lg"
          onClick={scrollToInput}
          className="text-lg px-8 py-6 rounded-full font-semibold gap-2"
          data-testid="button-get-started"
        >
          Get Started
          <ArrowDown className="w-5 h-5" aria-hidden="true" />
        </Button>

        <div className="mt-12 flex items-center justify-center gap-8 flex-wrap text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" aria-hidden="true" />
            <span className="text-base">No registration needed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" aria-hidden="true" />
            <span className="text-base">Free to use</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" aria-hidden="true" />
            <span className="text-base">Instant results</span>
          </div>
        </div>
      </div>
    </section>
  );
}
