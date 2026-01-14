import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
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
  const { t, language } = useLanguage();

  const startProcessingUI = () => {
    setAppState("processing");
    setProcessingStep("simplifying");
    
    setTimeout(() => {
      setProcessingStep("generating");
    }, 3000);
    
    setTimeout(() => {
      setProcessingStep("complete");
    }, 6000);
  };

  const handleSuccess = (data: SimplifyResponse) => {
    setProcessingStep("complete");
    setTimeout(() => {
      setResult(data.result);
      setGeneratedImages(data.images);
      setAppState("results");
    }, 500);
  };

  const handleError = (error: Error) => {
    toast({
      title: t("somethingWentWrong"),
      description: error instanceof Error ? error.message : t("failedToProcess"),
      variant: "destructive",
    });
    setAppState("input");
    setProcessingStep("simplifying");
  };

  const simplifyMutation = useMutation({
    mutationFn: async ({ text, language }: { text: string; language: string }): Promise<SimplifyResponse> => {
      const response = await apiRequest("POST", "/api/simplify", { text, language });
      return response.json();
    },
    onMutate: startProcessingUI,
    onSuccess: handleSuccess,
    onError: handleError,
  });

  const simplifyImageMutation = useMutation({
    mutationFn: async ({ file, language }: { file: File; language: string }): Promise<SimplifyResponse> => {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("language", language);
      
      const response = await fetch("/api/simplify-image", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to process image");
      }
      
      return response.json();
    },
    onMutate: startProcessingUI,
    onSuccess: handleSuccess,
    onError: handleError,
  });

  const handleSubmit = (text: string) => {
    setOriginalText(text);
    simplifyMutation.mutate({ text, language });
  };

  const handleSubmitImage = (file: File) => {
    setOriginalText("");
    simplifyImageMutation.mutate({ file, language });
  };

  const handleTryAgain = () => {
    if (originalText) {
      simplifyMutation.mutate({ text: originalText, language });
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
            <LetterInput 
              onSubmit={handleSubmit} 
              onSubmitImage={handleSubmitImage}
              isLoading={simplifyMutation.isPending || simplifyImageMutation.isPending} 
            />
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
