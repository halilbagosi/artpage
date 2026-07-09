import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PortfolioMode = 'painting' | 'photography' | 'videography';

interface ModeState {
  mode: PortfolioMode;
  setMode: (mode: PortfolioMode) => void;
  isTransitioning: boolean;
  setIsTransitioning: (isTransitioning: boolean) => void;
}

export const useModeStore = create<ModeState>()(
  persist(
    (set) => ({
      mode: 'painting', // default mode
      setMode: (mode) => set({ mode }),
      isTransitioning: false,
      setIsTransitioning: (isTransitioning) => set({ isTransitioning }),
    }),
    {
      name: 'portfolio-mode',
      // Only persist the selected mode — transient UI flags stay in memory.
      partialize: (state) => ({ mode: state.mode }),
    }
  )
);
