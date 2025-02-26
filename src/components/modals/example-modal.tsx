"use client";

import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useExampleModal } from "@/hooks/use-example-modal";

export const ExampleModal = () => {
  const { isOpen, onClose, content } = useExampleModal();

  if (!content) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-4 bg-white border border-gray-300 rounded-lg">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Example Modal</h2>
          <p>{content}</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExampleModal;
