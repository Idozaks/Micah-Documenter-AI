import { Loader2, FileText, Sparkles, Image } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface ProcessingStateProps {
  step: "simplifying" | "generating" | "complete";
}

const steps = [
  { id: "simplifying", label: "Reading your letter...", icon: FileText },
  { id: "generating", label: "Creating visual explanation...", icon: Image },
  { id: "complete", label: "Almost ready!", icon: Sparkles },
];

export function ProcessingState({ step }: ProcessingStateProps) {
  const currentStepIndex = steps.findIndex((s) => s.id === step);

  return (
    <section className="py-12 px-6 md:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="p-8 md:p-12">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative mb-8"
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" aria-hidden="true" />
              </div>
            </motion.div>

            <h2 className="text-2xl font-semibold text-foreground mb-4" data-testid="text-processing-title">
              Processing Your Letter
            </h2>

            <p className="text-lg text-muted-foreground mb-8 max-w-md">
              Our AI is analyzing the document and preparing a clear explanation for you.
            </p>

            <div className="w-full max-w-sm space-y-4">
              {steps.map((s, index) => {
                const Icon = s.icon;
                const isActive = index === currentStepIndex;
                const isComplete = index < currentStepIndex;

                return (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : isComplete
                        ? "bg-green-500/10 text-green-600 dark:text-green-400"
                        : "bg-muted/50 text-muted-foreground"
                    }`}
                    data-testid={`step-${s.id}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isActive ? "bg-primary text-primary-foreground" : 
                      isComplete ? "bg-green-500 text-white" : "bg-muted"
                    }`}>
                      {isActive ? (
                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                      ) : isComplete ? (
                        <span className="text-sm font-medium" aria-hidden="true">&#10003;</span>
                      ) : (
                        <Icon className="w-4 h-4" aria-hidden="true" />
                      )}
                    </div>
                    <span className="font-medium">{s.label}</span>
                  </motion.div>
                );
              })}
            </div>

            <p className="mt-8 text-sm text-muted-foreground">
              This usually takes 10-30 seconds
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}
