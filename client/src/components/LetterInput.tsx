import { useState, useRef } from "react";
import { Sparkles, FileText, Trash2, Upload, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/hooks/useLanguage";

interface LetterInputProps {
  onSubmit: (text: string) => void;
  onSubmitImage: (file: File) => void;
  isLoading: boolean;
}

export function LetterInput({ onSubmit, onSubmitImage, isLoading }: LetterInputProps) {
  const [text, setText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length >= 10) {
      onSubmit(text.trim());
    }
  };

  const loadSample = () => {
    setText(t("sampleLetter"));
  };

  const clearText = () => {
    setText("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSubmitImage(file);
    }
    e.target.value = "";
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSubmitImage(file);
    }
    e.target.value = "";
  };

  return (
    <section id="input-section" className="py-12 px-6 md:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold text-lg">
                1
              </div>
              <h2 className="text-2xl font-semibold text-foreground">
                {t("pasteYourLetter")}
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <Label htmlFor="letter-input" className="text-lg text-foreground">
                  {t("letterLabel")}
                </Label>
                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    data-testid="input-file-upload"
                  />
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleCameraCapture}
                    className="hidden"
                    data-testid="input-camera-capture"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="gap-2"
                    data-testid="button-upload-image"
                  >
                    <Upload className="w-4 h-4" aria-hidden="true" />
                    {t("uploadImage")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => cameraInputRef.current?.click()}
                    disabled={isLoading}
                    className="gap-2"
                    data-testid="button-take-photo"
                  >
                    <Camera className="w-4 h-4" aria-hidden="true" />
                    {t("takePhoto")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={loadSample}
                    className="gap-2"
                    data-testid="button-load-sample"
                  >
                    <FileText className="w-4 h-4" aria-hidden="true" />
                    {t("trySample")}
                  </Button>
                  {text.length > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearText}
                      className="gap-2 text-muted-foreground"
                      data-testid="button-clear-text"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                      {t("clear")}
                    </Button>
                  )}
                </div>
              </div>

              <Textarea
                id="letter-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t("placeholder")}
                className="min-h-48 md:min-h-64 text-lg leading-relaxed resize-y"
                disabled={isLoading}
                data-testid="input-letter-text"
              />

              <p className="text-sm text-muted-foreground">
                {t("secureProcessing")}
              </p>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
              <Button
                type="submit"
                size="lg"
                disabled={text.trim().length < 10 || isLoading}
                className="w-full sm:w-auto text-lg px-8 py-6 rounded-full font-semibold gap-2"
                data-testid="button-simplify"
              >
                <Sparkles className="w-5 h-5" aria-hidden="true" />
                {t("simplifyAndExplain")}
              </Button>

              {text.trim().length > 0 && text.trim().length < 10 && (
                <p className="text-sm text-muted-foreground">
                  {t("minCharsRequired")}
                </p>
              )}
            </div>
          </form>
        </Card>
      </div>
    </section>
  );
}
