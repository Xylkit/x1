"use client";

import { AlertTriangle, Loader } from "lucide-react";
import Image from "next/image";
import { ReactNode } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/atoms/alert";

interface StateScreenProps {
  type: "loading" | "error" | "empty";
  error?: Error;
  hideAlert?: boolean;
  children?: ReactNode;
  emptyStateMessage?: string;
}

const StateScreens: React.FC<StateScreenProps> = ({
  type,
  error,
  hideAlert,
  children,
  emptyStateMessage = "No items to display",
}) => {
  switch (type) {
    case "loading":
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <Loader
            className="animate-spin text-gray-500 -mt-36 mb-4"
            size={24}
          />
          <p className="text-gray-700">Loading...</p>
        </div>
      );
    case "error":
      return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
          {!hideAlert && error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error.message || "An error occurred. Please try again later."}
              </AlertDescription>
            </Alert>
          )}
          <div className="flex flex-col items-center justify-center">
            <Image
              alt="Error occurred"
              src="https://illustrations.popsy.co/red/timed-out-error.svg"
              width={350}
              height={350}
            />
            <h2 className="text-sm text-center sm:text-xl text-black mt-4">
              {error?.message || "An error occurred"}
            </h2>
          </div>
          {children}
        </div>
      );
    case "empty":
      return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <div className="flex flex-col items-center justify-center">
            <Image
              alt="Empty state"
              src="https://illustrations.popsy.co/red/flower.svg"
              width={350}
              height={350}
            />
            <h2 className="text-sm text-center sm:text-xl text-black mt-4">
              {emptyStateMessage}
            </h2>
          </div>
          {children}
        </div>
      );
    default:
      return null;
  }
};

export default StateScreens;
