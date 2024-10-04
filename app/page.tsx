"use client";
import CollectiveInfoBox from "@/components/organisms/collective-info-box";
import React, { useState } from "react";

type Step = "setup" | "fund" | "spend";

const page = () => {
  const [currentStep, setCurrentStep] = useState<Step>("setup");
  const [completedOptions, setCompletedOptions] = useState<
    Record<Step, boolean[]>
  >({
    setup: [false, true, false],
    fund: [false, false, false],
    spend: [false, false, false],
  });

  // Function to mark an option as completed
  const markOptionCompleted = (step: Step, optionIndex: number) => {
    setCompletedOptions((prev) => ({
      ...prev,
      [step]: prev[step].map((completed, index) =>
        index === optionIndex ? true : completed
      ),
    }));
  };

  const stepOrder: Step[] = ["setup", "fund", "spend"];

  const handlePrevious = () => {
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  return (
    <div className=" p-8">
      <CollectiveInfoBox
        currentStep={currentStep}
        completedOptions={completedOptions}
      />

      <button
        onClick={handlePrevious}
        disabled={currentStep === "setup"}
        className="bg-white hover:bg-gray-100 text-gray-800 font-bold p-2 rounded-full shadow disabled:opacity-50"
      >
        left
      </button>
      <button
        onClick={handleNext}
        disabled={currentStep === "spend"}
        className="bg-white hover:bg-gray-100 text-gray-800 font-bold p-2 rounded-full shadow disabled:opacity-50"
      >
        right
      </button>

      {/* Add buttons or logic to change steps and mark options as completed */}
    </div>
  );
};

export default page;
