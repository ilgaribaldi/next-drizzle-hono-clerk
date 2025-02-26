import { create } from "zustand";

type ExampleModalState = {
  isOpen: boolean;
  content: string | null;
  onOpen: (content: string) => void;
  onClose: () => void;
};

export const useExampleModal = create<ExampleModalState>((set) => ({
  isOpen: false,
  content: null,
  onOpen: (content) => set({ isOpen: true, content }),
  onClose: () => set({ isOpen: false, content: null }),
}));
