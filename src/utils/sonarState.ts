
import { create } from 'zustand'
import { useToast } from "@/hooks/use-toast";

interface SonarState {
  showSafetyWarning: boolean
  setShowSafetyWarning: (show: boolean) => void
  isDeactivating: boolean
  setIsDeactivating: (isDeactivating: boolean) => void
  isSonarActive: boolean
  toggleSonar: (value: boolean) => Promise<void>
}

const useSonarStore = create<SonarState>((set) => ({
  showSafetyWarning: true,
  setShowSafetyWarning: (show) => set({ showSafetyWarning: show }),
  isDeactivating: false,
  setIsDeactivating: (isDeactivating) => set({ isDeactivating }),
  isSonarActive: false,
  toggleSonar: async (value) => {
    if (value) {
      set({ isSonarActive: true })
    } else {
      set({ isDeactivating: true })
      await new Promise(resolve => setTimeout(resolve, 2000))
      set({ isSonarActive: false, isDeactivating: false })
    }
  },
}))

export default useSonarStore
