import { create } from 'zustand';

export interface LightboxItem {
  image: string;
  title?: string;
  meta?: string;
}

interface LightboxState {
  item: LightboxItem | null;
  open: (item: LightboxItem) => void;
  close: () => void;
}

export const useLightboxStore = create<LightboxState>((set) => ({
  item: null,
  open: (item) => set({ item }),
  close: () => set({ item: null }),
}));
