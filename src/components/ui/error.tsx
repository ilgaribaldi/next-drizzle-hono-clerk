import React from "react";
import { AlertTriangle } from "lucide-react";

interface ErrorProps {
  message: string;
  className?: string;
}

const Error: React.FC<ErrorProps> = ({ message, className }) => {
  return (
    <div
      className={`flex flex-col justify-center items-center text-red-500 ${
        className || ""
      }`}
    >
      <AlertTriangle size={32} />
      <p className="mt-4 text-sm">{message}</p>
    </div>
  );
};

export default Error;
