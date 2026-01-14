import { useState } from "react";
import { RefreshCw, ChevronDown, ChevronUp, AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import type { SimplifiedResult } from "@shared/schema";
import { AnimatedExplanation } from "./AnimatedExplanation";
import { useLanguage } from "@/hooks/useLanguage";

interface ResultsDisplayProps {
  result: SimplifiedResult;
  generatedImages: string[];
  onTryAgain: () => void;
  onReset: () => void;
}

export function ResultsDisplay({ result, generatedImages, onTryAgain, onReset }: ResultsDisplayProps) {
  const [showOriginalComparison, setShowOriginalComparison] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const { t } = useLanguage();

  const toneConfig = {
    urgent: { 
      icon: AlertCircle, 
      color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800",
      label: t("requiresAction")
    },
    informational: { 
      icon: Info, 
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
      label: t("forYourInformation")
    },
    positive: { 
      icon: CheckCircle2, 
      color: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800",
      label: t("goodNews")
    },
    neutral: { 
      icon: Info, 
      color: "bg-muted text-muted-foreground border-border",
      label: t("generalNotice")
    },
  };

  const toneInfo = toneConfig[result.tone] || toneConfig.neutral;
  const ToneIcon = toneInfo.icon;

  return (
    <section className="py-12 px-6 md:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 font-semibold text-lg">
              2
            </div>
            <h2 className="text-2xl font-semibold text-foreground">
              {t("yourExplanation")}
            </h2>
          </div>

          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <Badge variant="outline" className={`${toneInfo.color} px-3 py-1`}>
              <ToneIcon className="w-4 h-4 me-2" aria-hidden="true" />
              {toneInfo.label}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {t("simplifiedFrom", { from: result.originalLength, to: result.simplifiedLength })}
            </span>
          </div>

          <AnimatedExplanation
            summary={result.summary}
            keyPoints={result.keyPoints}
            actionItems={result.actionItems}
            images={generatedImages}
            isPlaying={isPlaying}
            onPlayingChange={setIsPlaying}
          />
        </Card>

        {result.actionItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 md:p-8 border-s-4 border-s-primary">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-primary" aria-hidden="true" />
                <h3 className="text-xl font-semibold text-foreground">
                  {t("whatYouNeedToDo")}
                </h3>
              </div>
              <ul className="space-y-3">
                {result.actionItems.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-start gap-3 text-lg text-foreground"
                    data-testid={`action-item-${index}`}
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center mt-0.5">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </Card>
          </motion.div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={onTryAgain}
            className="gap-2"
            data-testid="button-try-again"
          >
            <RefreshCw className="w-5 h-5" aria-hidden="true" />
            {t("explainDifferently")}
          </Button>
          <Button
            size="lg"
            onClick={onReset}
            className="gap-2"
            data-testid="button-new-letter"
          >
            {t("simplifyAnotherLetter")}
          </Button>
        </div>

        <div className="mt-8">
          <Button
            variant="ghost"
            onClick={() => setShowOriginalComparison(!showOriginalComparison)}
            className="w-full justify-between text-muted-foreground"
            data-testid="button-toggle-comparison"
          >
            <span>{t("viewDetailedExplanation")}</span>
            {showOriginalComparison ? (
              <ChevronUp className="w-5 h-5" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-5 h-5" aria-hidden="true" />
            )}
          </Button>

          <AnimatePresence>
            {showOriginalComparison && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <Card className="mt-4 p-6">
                  <h4 className="text-lg font-medium text-foreground mb-4">
                    {t("fullSimplifiedVersion")}
                  </h4>
                  <p className="text-lg leading-relaxed text-foreground whitespace-pre-wrap">
                    {result.simplifiedText}
                  </p>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
