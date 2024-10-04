"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Step = "setup" | "fund" | "spend";

interface SetupFlowComponentProps {
  currentStep: Step;
  completedOptions: Record<Step, boolean[]>;
}
const CollectiveInfoBox: React.FC<SetupFlowComponentProps> = ({
  currentStep,
  completedOptions,
}) => {
  const steps: Record<Step, { title: string; options: string[] }> = {
    setup: {
      title: "Set Up Demo",
      options: [
        "Create a Collective",
        "Generate Recipients",
        "Generate Collectors",
      ],
    },
    fund: {
      title: "Fund a Flow",
      options: [
        "Start Collective Fund",
        "Add Demo Recipients",
        "Review Recipients",
      ],
    },
    spend: {
      title: "Spend Flow",
      options: [
        "View Recipient Flows",
        "Connect a Recipient",
        "Spend on a Collector",
      ],
    },
  };

  const stepOrder: Step[] = ["setup", "fund", "spend"];

  return (
    <div className="bg-gray-200 p-6 rounded-3xl  flex-1 max-w-[400px]">
      <div className="flex justify-between mb-4">
        {stepOrder.map((step, index) => (
          <div
            key={step}
            className={`h-1 w-full rounded-[2px] ${
              stepOrder.indexOf(currentStep) >= index
                ? "bg-gray-600"
                : "bg-gray-400"
            } ${index > 0 ? "ml-1" : ""}`}
          />
        ))}
      </div>
      <h2 className="text-2xl font-semibold mb-4 w-1/3 text-gray-800">
        {steps[currentStep].title}
      </h2>
      <div className="space-y-3">
        {steps[currentStep].options.map((option, index) => (
          <div
            key={index}
            className="w-full bg-gray-400 text-gray-700 font-light p-1 flex items-center gap-2 rounded-full"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                completedOptions[currentStep][index]
                  ? "border-2 border-gray-50"
                  : "bg-gray-50"
              }`}
            ></div>
            <p>{option}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default CollectiveInfoBox;
