"use client";

import { useState } from "react";
import Step1General from "./_components/Step1General";
import Step2Requisitos from "./_components/Step2Requisitos";
import Step3Preview from "./_components/Step3Preview";
import { VacanteFormData, INITIAL_FORM_DATA } from "./types";

export default function PublicarVacantePage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<VacanteFormData>(INITIAL_FORM_DATA);

  const goNext = (partial: Partial<VacanteFormData>) => {
    setFormData((prev) => ({ ...prev, ...partial }));
    setStep((prev) => (Math.min(prev + 1, 3) as 1 | 2 | 3));
  };

  const goBack = () => {
    setStep((prev) => (Math.max(prev - 1, 1) as 1 | 2 | 3));
  };

  return (
    <>
      {step === 1 && <Step1General data={formData} onNext={goNext} />}
      {step === 2 && <Step2Requisitos data={formData} onNext={goNext} onBack={goBack} />}
      {step === 3 && <Step3Preview data={formData} onBack={goBack} />}
    </>
  );
}
