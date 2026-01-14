import { useState, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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

export function AnimatedExplanation({
  summary,
  keyPoints,
  images,
  isPlaying,
  onPlayingChange,
}: AnimatedExplanationProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t, isRTL } = useLanguage();

  const slides = [
    { type: "summary", content: summary, title: t("summary") },
    ...keyPoints.map((point, i) => ({
      type: "keypoint",
      content: point,
      title: `${t("keyPoints")} ${i + 1}`,
      image: images[i] || null,
    })),
  ];

  const totalSlides = slides.length;

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        if (prev >= totalSlides - 1) {
          onPlayingChange(false);
          return prev;
        }
        return prev + 1;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [isPlaying, totalSlides, onPlayingChange]);

  const goToSlide = (index: number) => {
    setCurrentSlide(Math.max(0, Math.min(index, totalSlides - 1)));
  };

  const currentSlideData = slides[currentSlide];
  const progress = ((currentSlide + 1) / totalSlides) * 100;

  return (
    <div className="space-y-6">
      <div className="relative aspect-video bg-gradient-to-br from-primary/5 to-accent/10 rounded-xl overflow-hidden border border-border">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
          >
            {currentSlideData.image && (
              <div className="mb-4 w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden shadow-lg">
                <img
                  src={currentSlideData.image}
                  alt={`Illustration for ${currentSlideData.title}`}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <span className="text-sm font-medium text-primary mb-3 uppercase tracking-wide">
              {currentSlideData.title}
            </span>

            <p className="text-xl md:text-2xl lg:text-3xl font-medium text-foreground leading-relaxed max-w-2xl">
              {currentSlideData.content}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-4 left-4 right-4">
          <Progress value={progress} className="h-1" />
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => goToSlide(currentSlide - 1)}
          disabled={currentSlide === 0}
          aria-label={t("previous")}
          data-testid="button-prev-slide"
        >
          {isRTL ? (
            <SkipForward className="w-4 h-4" aria-hidden="true" />
          ) : (
            <SkipBack className="w-4 h-4" aria-hidden="true" />
          )}
        </Button>

        <Button
          variant="default"
          size="icon"
          onClick={() => onPlayingChange(!isPlaying)}
          aria-label={isPlaying ? t("pause") : t("play")}
          data-testid="button-play-pause"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" aria-hidden="true" />
          ) : (
            <Play className="w-4 h-4" aria-hidden="true" />
          )}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => goToSlide(currentSlide + 1)}
          disabled={currentSlide === totalSlides - 1}
          aria-label={t("next")}
          data-testid="button-next-slide"
        >
          {isRTL ? (
            <SkipBack className="w-4 h-4" aria-hidden="true" />
          ) : (
            <SkipForward className="w-4 h-4" aria-hidden="true" />
          )}
        </Button>

        <span className="text-sm text-muted-foreground ms-4">
          {currentSlide + 1} / {totalSlides}
        </span>
      </div>

      <div className="flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? "bg-primary scale-110"
                : "bg-muted hover:bg-muted-foreground/30"
            }`}
            aria-label={t("slideOf", { current: index + 1, total: totalSlides })}
            data-testid={`slide-dot-${index}`}
          />
        ))}
      </div>
    </div>
  );
}
