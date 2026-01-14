import { FileText, Sparkles, Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

const steps = [
  {
    icon: FileText,
    title: "Paste Your Letter",
    description:
      "Copy any official document - from municipalities, government agencies, medical institutions, or legal notices.",
  },
  {
    icon: Sparkles,
    title: "AI Simplifies It",
    description:
      "Our AI reads the complex language and rewrites it in simple, friendly terms anyone can understand.",
  },
  {
    icon: Play,
    title: "Watch & Understand",
    description:
      "See your letter explained with clear visuals and key action items highlighted for easy follow-up.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 px-6 md:px-8 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="text-how-it-works-title">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to understand any official letter
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <Card className="p-6 h-full text-center hover-elevate">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                      <Icon className="w-8 h-8" aria-hidden="true" />
                    </div>

                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-semibold flex items-center justify-center mb-4">
                      {index + 1}
                    </div>

                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {step.title}
                    </h3>

                    <p className="text-base text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
