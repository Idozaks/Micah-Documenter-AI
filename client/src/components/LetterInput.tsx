import { useState, useRef } from "react";
import { Sparkles, FileText, Trash2, Upload, Camera, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
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
    <section id="input-section" className="py-8 md:py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Quick Action Cards - Upload & Camera */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          {/* Upload Image Card */}
          <motion.button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative overflow-hidden rounded-2xl border-3 border-dashed border-blue-300 dark:border-blue-700 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-6 md:p-8 text-start transition-all hover:border-blue-400 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="button-upload-image"
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8 md:w-10 md:h-10" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold text-blue-700 dark:text-blue-300 mb-1">
                  {t("uploadImage")}
                </p>
                <p className="text-base text-blue-600/70 dark:text-blue-400/70">
                  {t("uploadImageDesc")}
                </p>
              </div>
            </div>
          </motion.button>

          {/* Take Photo Card */}
          <motion.button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative overflow-hidden rounded-2xl border-3 border-dashed border-green-300 dark:border-green-700 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 p-6 md:p-8 text-start transition-all hover:border-green-400 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="button-take-photo"
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Camera className="w-8 h-8 md:w-10 md:h-10" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold text-green-700 dark:text-green-300 mb-1">
                  {t("takePhoto")}
                </p>
                <p className="text-base text-green-600/70 dark:text-green-400/70">
                  {t("takePhotoDesc")}
                </p>
              </div>
            </div>
          </motion.button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-lg font-medium text-muted-foreground px-4">{t("orPasteText")}</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Text Input Card */}
        <Card className="p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-foreground">
                  {t("pasteYourLetter")}
                </h2>
                <p className="text-base text-muted-foreground">{t("letterLabel")}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-end gap-2 flex-wrap">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={loadSample}
                  className="gap-2 text-base"
                  data-testid="button-load-sample"
                >
                  <ImageIcon className="w-5 h-5" aria-hidden="true" />
                  {t("trySample")}
                </Button>
                {text.length > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="lg"
                    onClick={clearText}
                    className="gap-2 text-base text-muted-foreground"
                    data-testid="button-clear-text"
                  >
                    <Trash2 className="w-5 h-5" aria-hidden="true" />
                    {t("clear")}
                  </Button>
                )}
              </div>

              <Textarea
                id="letter-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t("placeholder")}
                className="min-h-48 md:min-h-56 text-lg md:text-xl leading-relaxed resize-y"
                disabled={isLoading}
                data-testid="input-letter-text"
              />

              <p className="text-base text-muted-foreground">
                {t("secureProcessing")}
              </p>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
              <Button
                type="submit"
                size="lg"
                disabled={text.trim().length < 10 || isLoading}
                className="w-full sm:w-auto text-xl px-10 py-7 rounded-full font-bold gap-3 shadow-lg"
                data-testid="button-simplify"
              >
                <Sparkles className="w-6 h-6" aria-hidden="true" />
                {t("simplifyAndExplain")}
              </Button>

              {text.trim().length > 0 && text.trim().length < 10 && (
                <p className="text-base text-muted-foreground">
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
