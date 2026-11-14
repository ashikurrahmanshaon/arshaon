import { create } from 'zustand';
import { CreationCategory, ModalType, WorkspaceFocus } from '@/types/city';

interface WorkspaceStoreState {
  workspaceFocus: WorkspaceFocus;
  hoveredObject: string | null;
  deskLampOn: boolean;
  lightingMode: 'daylight' | 'warm-evening';
  activeModal: ModalType;
  selectedCreationCategory: CreationCategory;
  inspectedProjectId: string | null;
  soundEnabled: boolean;

  setWorkspaceFocus: (focus: WorkspaceFocus) => void;
  setHoveredObject: (label: string | null) => void;
  toggleDeskLamp: () => void;
  toggleLightingMode: () => void;
  setActiveModal: (modal: ModalType) => void;
  setSelectedCreationCategory: (cat: CreationCategory) => void;
  setInspectedProjectId: (id: string | null) => void;
  toggleSound: () => void;
}

export const useCityStore = create<WorkspaceStoreState>((set) => ({
  workspaceFocus: 'overview',
  hoveredObject: null,
  deskLampOn: true,
  lightingMode: 'daylight',
  activeModal: 'none',
  selectedCreationCategory: 'All',
  inspectedProjectId: null,
  soundEnabled: true,

  setWorkspaceFocus: (workspaceFocus) => set({ workspaceFocus }),
  setHoveredObject: (hoveredObject) => set({ hoveredObject }),
  toggleDeskLamp: () => set((s) => ({ deskLampOn: !s.deskLampOn })),
  toggleLightingMode: () =>
    set((s) => ({
      lightingMode: s.lightingMode === 'daylight' ? 'warm-evening' : 'daylight',
    })),
  setActiveModal: (activeModal) => set({ activeModal }),
  setSelectedCreationCategory: (selectedCreationCategory) => set({ selectedCreationCategory }),
  setInspectedProjectId: (inspectedProjectId) => set({ inspectedProjectId }),
  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
}));
