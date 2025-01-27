import { create } from "zustand";

interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  nextPage: number | null;
  setCurrentPage: (page: number) => void;
  setPaginationInfo: (
    info: Omit<PaginationState, "setCurrentPage" | "setPaginationInfo">
  ) => void;
}

export const usePaginationStore = create<PaginationState>((set) => ({
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
  nextPage: null,
  setCurrentPage: (page) => set({ currentPage: page }),
  setPaginationInfo: (info) => set(info),
}));
