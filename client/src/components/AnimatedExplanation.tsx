import { useState, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, FileText, Lightbulb, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";

interface AnimatedExplanationProps {
  summary: string;
  keyPoints: string[];
  actionItems: string[];
  images: string[];
  isPlaying: boolean;
  onPlayingChange: (playing: boolean) => void;
}

const SLIDE_DURATION = 12000; // 12 seconds per slide

export function AnimatedExplanation({
  summary,
  keyPoints,
  images,
  isPlaying,
  onPlayingChange,
}: AnimatedExplanationProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideProgress, setSlideProgress] = useState(0);
  const { t, isRTL } = useLanguage();

  const slides = [
    { type: "summary" as const, content: summary, title: t("summary"), icon: FileText, image: null as string | null, number: 0 },
    ...keyPoints.map((point, i) => ({
      type: "keypoint" as const,
      content: point,
      title: `${t("keyPoints")} ${i + 1}`,
      image: images[i] || null,
      icon: Lightbulb,
      number: i + 1,
    })),
  ];

  const totalSlides = slides.length;

  // Slide progress timer
  useEffect(() => {
    if (!isPlaying) return;

    const startTime = Date.now();
    
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      setSlideProgress(progress);
      
      if (elapsed >= SLIDE_DURATION) {
        setSlideProgress(0);
        setCurrentSlide((prev) => {
          if (prev >= totalSlides - 1) {
            onPlayingChange(false);
            return prev;
          }
          return prev + 1;
        });
      }
    }, 50);

    return () => clearInterval(progressInterval);
  }, [isPlaying, currentSlide, totalSlides, onPlayingChange]);

  // Reset progress when slide changes manually
  useEffect(() => {
    setSlideProgress(0);
  }, [currentSlide]);

  const goToSlide = (index: number) => {
    setCurrentSlide(Math.max(0, Math.min(index, totalSlides - 1)));
    setSlideProgress(0);
  };

  const currentSlideData = slides[currentSlide];
  const overallProgress = ((currentSlide) / totalSlides) * 100 + (slideProgress / totalSlides);
  const SlideIcon = currentSlideData.icon || FileText;

  return (
    <div className="space-y-6">
      {/* Main video area */}
      <div className="relative bg-gradient-to-br from-primary/5 via-background to-accent/10 rounded-2xl overflow-hidden border-2 border-border shadow-lg">
        {/* Top bar with slide info */}
        <div className="flex items-center justify-between p-4 border-b border-border/50 bg-background/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentSlideData.type === "summary" 
                ? "bg-primary/10 text-primary" 
                : "bg-accent/20 text-accent-foreground"
            }`}>
              {currentSlideData.type === "keypoint" && "number" in currentSlideData ? (
                <span className="text-lg font-bold">{currentSlideData.number}</span>
              ) : (
                <SlideIcon className="w-5 h-5" />
              )}
            </div>
            <div>
              <p className="font-semibold text-foreground text-lg">{currentSlideData.title}</p>
              <p className="text-sm text-muted-foreground">
                {currentSlide + 1} / {totalSlides}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isPlaying && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <motion.div
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-red-500"
                />
                <Clock className="w-4 h-4" />
                <span>{Math.ceil((SLIDE_DURATION - (slideProgress / 100 * SLIDE_DURATION)) / 1000)}</span>
              </motion.div>
            )}
            <Badge variant="outline" className="text-sm px-3 py-1">
              {currentSlideData.type === "summary" ? t("summary") : t("keyPoints")}
            </Badge>
          </div>
        </div>

        {/* Slide content */}
        <div className="min-h-[300px] md:min-h-[400px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRTL ? 30 : -30 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-10 text-center"
            >
              {currentSlideData.image && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="mb-6 w-36 h-36 md:w-48 md:h-48 rounded-2xl overflow-hidden shadow-xl border-4 border-background"
                >
                  <img
                    src={currentSlideData.image}
                    alt={`Illustration for ${currentSlideData.title}`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              )}

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="text-xl md:text-2xl lg:text-3xl font-medium text-foreground leading-relaxed max-w-3xl break-words"
              >
                {currentSlideData.content}
              </motion.p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress bars */}
        <div className="p-4 border-t border-border/50 bg-background/80 backdrop-blur-sm space-y-3">
          {/* Slide progress */}
          {isPlaying && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground min-w-[60px]">{t("currentSlide") || "Slide"}</span>
              <Progress value={slideProgress} className="h-2 flex-1" />
            </div>
          )}
          
          {/* Overall progress */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground min-w-[60px]">{t("total") || "Total"}</span>
            <div className="flex-1 flex gap-1">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 flex-1 rounded-full transition-all ${
                    index < currentSlide
                      ? "bg-primary"
                      : index === currentSlide
                      ? "bg-primary/60"
                      : "bg-muted hover:bg-muted-foreground/30"
                  }`}
                  aria-label={`${t("goToSlide") || "Go to slide"} ${index + 1}`}
                  data-testid={`progress-segment-${index}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Controls - Large and easy to tap */}
      <div className="flex items-center justify-center gap-4 md:gap-6">
        <Button
          variant="outline"
          size="lg"
          onClick={() => goToSlide(currentSlide - 1)}
          disabled={currentSlide === 0}
          aria-label={t("previous")}
          data-testid="button-prev-slide"
          className="gap-3 px-6 md:px-8 py-6 text-lg font-semibold min-w-[140px] md:min-w-[160px]"
        >
          {isRTL ? (
            <SkipForward className="w-6 h-6" aria-hidden="true" />
          ) : (
            <SkipBack className="w-6 h-6" aria-hidden="true" />
          )}
          <span>{t("previous")}</span>
        </Button>

        <Button
          variant="default"
          size="lg"
          onClick={() => onPlayingChange(!isPlaying)}
          aria-label={isPlaying ? t("pause") : t("play")}
          data-testid="button-play-pause"
          className="gap-3 px-8 md:px-10 py-6 text-lg font-semibold min-w-[140px] md:min-w-[160px] shadow-lg"
        >
          {isPlaying ? (
            <>
              <Pause className="w-6 h-6" aria-hidden="true" />
              <span>{t("pause")}</span>
            </>
          ) : (
            <>
              <Play className="w-6 h-6" aria-hidden="true" />
              <span>{t("play")}</span>
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={() => goToSlide(currentSlide + 1)}
          disabled={currentSlide === totalSlides - 1}
          aria-label={t("next")}
          data-testid="button-next-slide"
          className="gap-3 px-6 md:px-8 py-6 text-lg font-semibold min-w-[140px] md:min-w-[160px]"
        >
          <span>{t("next")}</span>
          {isRTL ? (
            <SkipBack className="w-6 h-6" aria-hidden="true" />
          ) : (
            <SkipForward className="w-6 h-6" aria-hidden="true" />
          )}
        </Button>
      </div>

      {/* Dot navigation - Larger dots */}
      <div className="flex justify-center gap-4">
        {slides.map((slide, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all rounded-full ${
              index === currentSlide
                ? "w-14 h-5 bg-primary shadow-md"
                : "w-5 h-5 bg-muted hover:bg-muted-foreground/40 hover:scale-110"
            }`}
            aria-label={`${t("goToSlide") || "Go to slide"} ${index + 1}: ${slide.title}`}
            data-testid={`slide-dot-${index}`}
          />
        ))}
      </div>
    </div>
  );
}
