import { useState, useEffect } from "react";
import { Loader2, FileText, Sparkles, Image } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";

interface ProcessingStateProps {
  step: "simplifying" | "generating" | "complete";
}

function useAsymptoticProgress(durationSeconds: number = 30) {
  const [progress, setProgress] = useState(0);
  const [startTime] = useState(() => Date.now());

  useEffect(() => {
    const updateProgress = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const t = elapsed / durationSeconds;
      
      if (elapsed >= durationSeconds) {
        setProgress(95);
        return;
      }

      // Asymptotic ease-out: fast start, gradually approaching but never reaching 100
      // Uses 1 - e^(-kt) curve for natural deceleration
      const k = 3.5;
      const asymptotic = 1 - Math.exp(-k * t);
      
      // Scale to max 95% and add subtle micro-fluctuations for organic feel
      const baseProgress = asymptotic * 95;
      const microVariation = Math.sin(elapsed * 0.8) * 0.3;
      
      setProgress(Math.min(baseProgress + microVariation, 95));
    };

    const intervalId = setInterval(updateProgress, 60);
    updateProgress();

    return () => clearInterval(intervalId);
  }, [startTime, durationSeconds]);

  return progress;
}

export function ProcessingState({ step }: ProcessingStateProps) {
  const { t } = useLanguage();
  const progress = useAsymptoticProgress(30);

  const steps = [
    { id: "simplifying", label: t("stepReading"), icon: FileText },
    { id: "generating", label: t("stepGenerating"), icon: Image },
    { id: "complete", label: t("stepAlmostReady"), icon: Sparkles },
  ];

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
              {t("processingTitle")}
            </h2>

            <p className="text-lg text-muted-foreground mb-8 max-w-md">
              {t("processingSubtitle")}
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

            <div className="w-full max-w-md mt-8 space-y-3">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Progress 
                  value={progress} 
                  className="h-3"
                  data-testid="progress-bar"
                />
              </motion.div>
              <motion.p 
                className="text-sm text-muted-foreground text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                {t("usuallyTakes")}
              </motion.p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
