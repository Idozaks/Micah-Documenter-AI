import { useState } from "react";
import { Sparkles, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface LetterInputProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

const SAMPLE_LETTER = `Dear Resident,

Re: Notice of Assessment Review - Property Tax Reassessment FY 2024-2025

Pursuant to Section 34.7(a) of the Municipal Property Assessment Act, this correspondence serves to notify you that your property, located at the aforementioned address, has been subject to a comprehensive reassessment review as mandated by the triennial valuation schedule.

Following this reassessment, the assessed value of your property has been adjusted to reflect current market conditions. The revised assessment may result in modifications to your annual property tax liability, effective from the commencement of the next fiscal year.

You are hereby advised that you retain the right to file an appeal against this assessment within thirty (30) calendar days from the date of this notice. Failure to submit a written objection within the prescribed timeframe shall constitute acceptance of the revised assessment.

Should you wish to contest this determination, please submit Form PA-31B (Notice of Appeal) to the Assessment Review Board, accompanied by supporting documentation establishing grounds for reconsideration.

For inquiries regarding payment options or to request an installment arrangement, contact our Revenue Services Department during regular business hours.

Respectfully,
Office of Property Assessment
City of Metropolitan`;

export function LetterInput({ onSubmit, isLoading }: LetterInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length >= 10) {
      onSubmit(text.trim());
    }
  };

  const loadSample = () => {
    setText(SAMPLE_LETTER);
  };

  const clearText = () => {
    setText("");
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
                Paste Your Letter
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <Label htmlFor="letter-input" className="text-lg text-foreground">
                  Official letter or document text
                </Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={loadSample}
                    className="gap-2"
                    data-testid="button-load-sample"
                  >
                    <FileText className="w-4 h-4" aria-hidden="true" />
                    Try Sample
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
                      Clear
                    </Button>
                  )}
                </div>
              </div>

              <Textarea
                id="letter-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Copy and paste the official letter text here..."
                className="min-h-48 md:min-h-64 text-lg leading-relaxed resize-y"
                disabled={isLoading}
                data-testid="input-letter-text"
              />

              <p className="text-sm text-muted-foreground">
                Your text is processed securely and never stored permanently.
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
                Simplify & Explain
              </Button>

              {text.trim().length > 0 && text.trim().length < 10 && (
                <p className="text-sm text-muted-foreground">
                  Please provide at least 10 characters of text.
                </p>
              )}
            </div>
          </form>
        </Card>
      </div>
    </section>
  );
}
