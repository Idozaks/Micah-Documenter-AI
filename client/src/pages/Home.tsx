import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { LetterInput } from "@/components/LetterInput";
import { ProcessingState } from "@/components/ProcessingState";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { HowItWorks } from "@/components/HowItWorks";
import type { SimplifiedResult } from "@shared/schema";

type AppState = "input" | "processing" | "results";
type ProcessingStep = "simplifying" | "generating" | "complete";

interface SimplifyResponse {
  result: SimplifiedResult;
  images: string[];
}

export default function Home() {
  const [appState, setAppState] = useState<AppState>("input");
  const [processingStep, setProcessingStep] = useState<ProcessingStep>("simplifying");
  const [result, setResult] = useState<SimplifiedResult | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [originalText, setOriginalText] = useState("");
  const { toast } = useToast();

  const simplifyMutation = useMutation({
    mutationFn: async (text: string): Promise<SimplifyResponse> => {
      const response = await apiRequest("POST", "/api/simplify", { text });
      return response.json();
    },
    onMutate: () => {
      setAppState("processing");
      setProcessingStep("simplifying");
      
      setTimeout(() => {
        setProcessingStep("generating");
      }, 3000);
      
      setTimeout(() => {
        setProcessingStep("complete");
      }, 6000);
    },
    onSuccess: (data) => {
      setProcessingStep("complete");
      setTimeout(() => {
        setResult(data.result);
        setGeneratedImages(data.images);
        setAppState("results");
      }, 500);
    },
    onError: (error) => {
      toast({
        title: "Something went wrong",
        description: error instanceof Error ? error.message : "Failed to process your letter. Please try again.",
        variant: "destructive",
      });
      setAppState("input");
      setProcessingStep("simplifying");
    },
  });

  const handleSubmit = (text: string) => {
    setOriginalText(text);
    simplifyMutation.mutate(text);
  };

  const handleTryAgain = () => {
    if (originalText) {
      simplifyMutation.mutate(originalText);
    }
  };

  const handleReset = () => {
    setAppState("input");
    setResult(null);
    setGeneratedImages([]);
    setOriginalText("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main id="main-content" className="flex-1">
        {appState === "input" && (
          <>
            <HeroSection />
            <LetterInput onSubmit={handleSubmit} isLoading={simplifyMutation.isPending} />
          </>
        )}

        {appState === "processing" && <ProcessingState step={processingStep} />}

        {appState === "results" && result && (
          <ResultsDisplay
            result={result}
            generatedImages={generatedImages}
            onTryAgain={handleTryAgain}
            onReset={handleReset}
          />
        )}

        <HowItWorks />
      </main>

      <Footer />
    </div>
  );
}
