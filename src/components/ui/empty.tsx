"use client";

import React from "react";
import { ClimbingBoxLoader } from "react-spinners";
import { PRIMARY_COLOR } from "@/types";

interface EmptyProps {
  message?: string;
  className?: string;
}

const Empty: React.FC<EmptyProps> = ({
  message = "Nothing here...",
  className,
}) => {
  return (
    <div
      className={`flex flex-col justify-center items-center ${className || ""}`}
    >
      <ClimbingBoxLoader color={PRIMARY_COLOR} />
      <p className="mt-4 text-gray-400">{message}</p>
    </div>
  );
};

export default Empty;
