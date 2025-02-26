"use client";

import { ExampleModal } from "./example-modal";

import { useState, useEffect } from "react";

export const ModalsProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // Add more modals here
  return (
    <>
      <ExampleModal />
    </>
  );
};
