"use client";

import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const steps = [
  { id: "personal", title: "Über euch" },
  { id: "project", title: "Projekt" },
  { id: "goals", title: "Ziele" },
  { id: "design", title: "Design" },
  { id: "budget", title: "Budget" },
  { id: "requirements", title: "Details" },
];

interface FormData {
  name: string;
  email: string;
  company: string;
  projectType: string;
  industry: string;
  primaryGoal: string;
  targetAudience: string;
  stylePreference: string;
  inspirations: string;
  budget: string;
  timeline: string;
  features: string[];
  additionalInfo: string;
  privacy: boolean;
}

const PROJECT_TYPES = ["Neue Website", "Relaunch", "Landingpage", "Online-Shop", "Etwas anderes"];
const INDUSTRIES = ["Handwerk & Dienstleistung", "Gastronomie & Hotel", "Gesundheit & Beauty", "Handel & E-Commerce", "Beratung & Agentur", "Kunst & Kreatives", "Verein & Organisation", "Andere"];
const GOALS = ["Arbeiten / Portfolio zeigen", "Produkte oder Leistungen verkaufen", "Anfragen & neue Kunden gewinnen", "Informieren", "Blog / Inhalte veröffentlichen"];
const STYLES = ["Modern & klar", "Minimalistisch", "Mutig & kreativ", "Seriös & professionell"];
const BUDGETS = ["Unter 1.000 €", "1.000 – 3.000 €", "3.000 – 5.000 €", "5.000 – 10.000 €", "Über 10.000 €", "Noch offen"];
const TIMELINES = ["So schnell wie möglich", "Innerhalb eines Monats", "In 1–3 Monaten", "Flexibel"];
const FEATURES = ["Kontaktformular", "Blog / News", "Online-Shop", "Terminbuchung", "Mehrsprachigkeit", "Social-Media-Einbindung", "Newsletter", "SEO-Optimierung"];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const contentVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -50, transition: { duration: 0.2 } },
};

const fieldCls = "transition-all duration-300 focus:ring-2 focus:ring-accent/25 focus:border-accent";

/** Ganze Kachel anklickbar; ausgewählt = blauer Rahmen */
function OptionTile({ selected, delay, children }: { selected: boolean; delay: number; children: ReactNode }) {
  return (
    <motion.div
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0, transition: { delay, duration: 0.3 } }}
    >
      <Label
        className={cn(
          "flex w-full cursor-pointer items-center gap-3 rounded-xl border p-3 font-normal transition-colors",
          selected ? "border-accent bg-accent/10 text-foreground" : "border-border text-foreground/80 hover:border-accent/50 hover:bg-accent/5",
        )}
      >
        {children}
      </Label>
    </motion.div>
  );
}

export interface OnboardingFormProps {
  /** Empfänger-Adresse; ohne Server öffnet „Absenden“ das Mailprogramm */
  email: string;
  className?: string;
}

const OnboardingForm = ({ email, className }: OnboardingFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    projectType: "",
    industry: "",
    primaryGoal: "",
    targetAudience: "",
    stylePreference: "",
    inspirations: "",
    budget: "",
    timeline: "",
    features: [],
    additionalInfo: "",
    privacy: false,
  });

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleFeature = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature) ? prev.features.filter((f) => f !== feature) : [...prev.features, feature],
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  // Ohne Server: fertige Mail im Mailprogramm öffnen
  const handleSubmit = () => {
    setIsSubmitting(true);
    const d = formData;
    const body = [
      `Name: ${d.name}`,
      `E-Mail: ${d.email}`,
      `Firma: ${d.company || "–"}`,
      "",
      `Projekt: ${d.projectType}`,
      `Branche: ${d.industry}`,
      `Hauptziel: ${d.primaryGoal}`,
      `Zielgruppe: ${d.targetAudience || "–"}`,
      `Stil: ${d.stylePreference}`,
      `Inspiration: ${d.inspirations || "–"}`,
      `Budget: ${d.budget}`,
      `Zeitplan: ${d.timeline}`,
      `Funktionen: ${d.features.length ? d.features.join(", ") : "–"}`,
      "",
      d.additionalInfo,
    ].join("\n");
    const subject = `Projektanfrage: ${d.projectType}${d.company ? ` – ${d.company}` : ""}`;
    setTimeout(() => {
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      toast.success("Fast geschafft!", {
        description: `Euer Mailprogramm öffnet sich mit der fertigen Anfrage. Nur noch absenden. Falls nicht: ${email}`,
      });
      setIsSubmitting(false);
    }, 600);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.name.trim() !== "" && /\S+@\S+\.\S+/.test(formData.email);
      case 1:
        return formData.projectType !== "" && formData.industry !== "";
      case 2:
        return formData.primaryGoal !== "";
      case 3:
        return formData.stylePreference !== "";
      case 4:
        return formData.budget !== "" && formData.timeline !== "";
      case 5:
        return formData.privacy;
      default:
        return true;
    }
  };

  return (
    <div className={cn("mx-auto w-full max-w-2xl", className)}>
      {/* Fortschritt */}
      <motion.div className="mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-2 flex justify-between">
          {steps.map((step, index) => (
            <motion.div key={step.id} className="flex flex-col items-center" whileHover={{ scale: 1.1 }}>
              <motion.button
                type="button"
                aria-label={`Schritt ${index + 1}: ${step.title}`}
                className={cn(
                  "h-4 w-4 rounded-full transition-colors duration-300",
                  index < currentStep
                    ? "cursor-pointer bg-accent"
                    : index === currentStep
                      ? "bg-accent ring-4 ring-accent/25"
                      : "cursor-default bg-muted",
                )}
                onClick={() => {
                  // nur zurück oder zu erledigten Schritten
                  if (index <= currentStep) setCurrentStep(index);
                }}
                whileTap={{ scale: 0.95 }}
              />
              <span
                className={cn(
                  "mt-1.5 hidden text-xs sm:block",
                  index === currentStep ? "font-medium text-foreground" : "text-muted-foreground",
                )}
              >
                {step.title}
              </span>
            </motion.div>
          ))}
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full bg-accent"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>

      {/* Formular */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <Card className="overflow-hidden rounded-3xl border border-border bg-card shadow-md">
          <AnimatePresence mode="wait">
            <motion.div key={currentStep} initial="hidden" animate="visible" exit="exit" variants={contentVariants}>
              {currentStep === 0 && (
                <>
                  <CardHeader>
                    <CardTitle>Erzählt uns von euch</CardTitle>
                    <CardDescription>Ein paar Basics, damit wir wissen, mit wem wir sprechen.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <motion.div variants={fadeInUp} className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input id="name" autoComplete="name" placeholder="Max Mustermann" value={formData.name} onChange={(e) => updateFormData("name", e.target.value)} className={fieldCls} />
                    </motion.div>
                    <motion.div variants={fadeInUp} className="space-y-2">
                      <Label htmlFor="email">E-Mail *</Label>
                      <Input id="email" type="email" autoComplete="email" placeholder="max@firma.de" value={formData.email} onChange={(e) => updateFormData("email", e.target.value)} className={fieldCls} />
                    </motion.div>
                    <motion.div variants={fadeInUp} className="space-y-2">
                      <Label htmlFor="company">Firma / Organisation (optional)</Label>
                      <Input id="company" autoComplete="organization" placeholder="Eure Firma" value={formData.company} onChange={(e) => updateFormData("company", e.target.value)} className={fieldCls} />
                    </motion.div>
                  </CardContent>
                </>
              )}

              {currentStep === 1 && (
                <>
                  <CardHeader>
                    <CardTitle>Euer Projekt</CardTitle>
                    <CardDescription>Worum geht es und in welcher Branche seid ihr?</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <motion.div variants={fadeInUp} className="space-y-2">
                      <Label>Was braucht ihr? *</Label>
                      <RadioGroup value={formData.projectType} onValueChange={(v) => updateFormData("projectType", v)} className="grid gap-2 sm:grid-cols-2">
                        {PROJECT_TYPES.map((t, i) => (
                          <OptionTile key={t} selected={formData.projectType === t} delay={0.05 * i}>
                            <RadioGroupItem value={t} className="border-accent text-accent" />
                            {t}
                          </OptionTile>
                        ))}
                      </RadioGroup>
                    </motion.div>
                    <motion.div variants={fadeInUp} className="space-y-2">
                      <Label htmlFor="industry">Branche *</Label>
                      <Select value={formData.industry} onValueChange={(v) => updateFormData("industry", v)}>
                        <SelectTrigger id="industry" className={fieldCls}>
                          <SelectValue placeholder="Branche wählen" />
                        </SelectTrigger>
                        <SelectContent>
                          {INDUSTRIES.map((x) => (
                            <SelectItem key={x} value={x}>
                              {x}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </motion.div>
                  </CardContent>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <CardHeader>
                    <CardTitle>Ziele der Website</CardTitle>
                    <CardDescription>Was soll die Seite für euch erreichen?</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <motion.div variants={fadeInUp} className="space-y-2">
                      <Label>Hauptziel *</Label>
                      <RadioGroup value={formData.primaryGoal} onValueChange={(v) => updateFormData("primaryGoal", v)} className="space-y-2">
                        {GOALS.map((g, i) => (
                          <OptionTile key={g} selected={formData.primaryGoal === g} delay={0.08 * i}>
                            <RadioGroupItem value={g} className="border-accent text-accent" />
                            {g}
                          </OptionTile>
                        ))}
                      </RadioGroup>
                    </motion.div>
                    <motion.div variants={fadeInUp} className="space-y-2">
                      <Label htmlFor="targetAudience">Wer ist eure Zielgruppe?</Label>
                      <Textarea id="targetAudience" placeholder="Beschreibt eure idealen Besucher bzw. Kunden" value={formData.targetAudience} onChange={(e) => updateFormData("targetAudience", e.target.value)} className={cn("min-h-[80px]", fieldCls)} />
                    </motion.div>
                  </CardContent>
                </>
              )}

              {currentStep === 3 && (
                <>
                  <CardHeader>
                    <CardTitle>Design</CardTitle>
                    <CardDescription>Welcher Look passt zu euch?</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <motion.div variants={fadeInUp} className="space-y-2">
                      <Label>Stil *</Label>
                      <RadioGroup value={formData.stylePreference} onValueChange={(v) => updateFormData("stylePreference", v)} className="grid gap-2 sm:grid-cols-2">
                        {STYLES.map((s, i) => (
                          <OptionTile key={s} selected={formData.stylePreference === s} delay={0.08 * i}>
                            <RadioGroupItem value={s} className="border-accent text-accent" />
                            {s}
                          </OptionTile>
                        ))}
                      </RadioGroup>
                    </motion.div>
                    <motion.div variants={fadeInUp} className="space-y-2">
                      <Label htmlFor="inspirations">Websites, die euch gefallen?</Label>
                      <Textarea id="inspirations" placeholder="Links oder Namen von Seiten, die ihr mögt" value={formData.inspirations} onChange={(e) => updateFormData("inspirations", e.target.value)} className={cn("min-h-[80px]", fieldCls)} />
                    </motion.div>
                  </CardContent>
                </>
              )}

              {currentStep === 4 && (
                <>
                  <CardHeader>
                    <CardTitle>Budget & Zeitplan</CardTitle>
                    <CardDescription>Damit wir ein passendes Angebot machen können.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <motion.div variants={fadeInUp} className="space-y-2">
                      <Label htmlFor="budget">Budget *</Label>
                      <Select value={formData.budget} onValueChange={(v) => updateFormData("budget", v)}>
                        <SelectTrigger id="budget" className={fieldCls}>
                          <SelectValue placeholder="Budget wählen" />
                        </SelectTrigger>
                        <SelectContent>
                          {BUDGETS.map((b) => (
                            <SelectItem key={b} value={b}>
                              {b}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </motion.div>
                    <motion.div variants={fadeInUp} className="space-y-2">
                      <Label>Wann soll die Seite online sein? *</Label>
                      <RadioGroup value={formData.timeline} onValueChange={(v) => updateFormData("timeline", v)} className="grid gap-2 sm:grid-cols-2">
                        {TIMELINES.map((t, i) => (
                          <OptionTile key={t} selected={formData.timeline === t} delay={0.08 * i}>
                            <RadioGroupItem value={t} className="border-accent text-accent" />
                            {t}
                          </OptionTile>
                        ))}
                      </RadioGroup>
                    </motion.div>
                  </CardContent>
                </>
              )}

              {currentStep === 5 && (
                <>
                  <CardHeader>
                    <CardTitle>Noch ein paar Details</CardTitle>
                    <CardDescription>Welche Funktionen braucht ihr? (Mehrfachauswahl)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <motion.div variants={fadeInUp} className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      {FEATURES.map((f, i) => (
                        <OptionTile key={f} selected={formData.features.includes(f)} delay={0.04 * i}>
                          <Checkbox
                            checked={formData.features.includes(f)}
                            onCheckedChange={() => toggleFeature(f)}
                            className="border-accent data-[state=checked]:bg-accent data-[state=checked]:text-white"
                          />
                          {f}
                        </OptionTile>
                      ))}
                    </motion.div>
                    <motion.div variants={fadeInUp} className="space-y-2">
                      <Label htmlFor="additionalInfo">Sonst noch etwas?</Label>
                      <Textarea id="additionalInfo" placeholder="Weitere Wünsche oder Infos zum Projekt" value={formData.additionalInfo} onChange={(e) => updateFormData("additionalInfo", e.target.value)} className={cn("min-h-[80px]", fieldCls)} />
                    </motion.div>
                    <motion.div variants={fadeInUp}>
                      <Label className="flex cursor-pointer items-start gap-3 text-xs font-normal leading-relaxed text-muted-foreground">
                        <Checkbox
                          checked={formData.privacy}
                          onCheckedChange={(v) => setFormData((p) => ({ ...p, privacy: v === true }))}
                          className="mt-0.5 border-accent data-[state=checked]:bg-accent data-[state=checked]:text-white"
                        />
                        <span>
                          Ich bin einverstanden, dass meine Angaben zur Bearbeitung der Anfrage verwendet werden (siehe{" "}
                          <a href="#datenschutz" className="underline underline-offset-2 hover:text-foreground">
                            Datenschutz
                          </a>
                          ). *
                        </span>
                      </Label>
                    </motion.div>
                  </CardContent>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          <CardFooter className="flex justify-between pb-6 pt-6">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-1 rounded-2xl border-border bg-transparent text-foreground hover:bg-white/5 hover:text-foreground"
              >
                <ChevronLeft className="h-4 w-4" /> Zurück
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="button"
                onClick={currentStep === steps.length - 1 ? handleSubmit : nextStep}
                disabled={!isStepValid() || isSubmitting}
                className="flex items-center gap-1 rounded-2xl bg-accent text-white hover:bg-accent-deep"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Wird vorbereitet …
                  </>
                ) : (
                  <>
                    {currentStep === steps.length - 1 ? "Anfrage senden" : "Weiter"}
                    {currentStep === steps.length - 1 ? <Check className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </>
                )}
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>

      <motion.div className="mt-4 text-center text-sm text-muted-foreground" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
        Schritt {currentStep + 1} von {steps.length}: {steps[currentStep].title}
      </motion.div>
    </div>
  );
};

export default OnboardingForm;
