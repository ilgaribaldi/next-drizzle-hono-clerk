"use client";

import React from "react";
import { BarLoader } from "react-spinners";
import { PRIMARY_COLOR } from "@/types";

interface LoaderProps {
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ className }) => {
  return (
    <div className={`flex justify-center items-center  ${className || ""}`}>
      <BarLoader color={PRIMARY_COLOR} />
    </div>
  );
};

export default Loader;
