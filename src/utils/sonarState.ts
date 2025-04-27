
import { create } from 'zustand'

interface SonarState {
  showSafetyWarning: boolean
  setShowSafetyWarning: (show: boolean) => void
  isDeactivating: boolean
  setIsDeactivating: (isDeactivating: boolean) => void
  isSonarActive: boolean
  isInitializing: boolean
  toggleSonar: (value: boolean) => Promise<void>
}

const useSonarStore = create<SonarState>((set) => ({
  showSafetyWarning: true,
  setShowSafetyWarning: (show) => set({ showSafetyWarning: show }),
  isDeactivating: false,
  isInitializing: false,
  setIsDeactivating: (isDeactivating) => set({ isDeactivating }),
  isSonarActive: false,
  toggleSonar: async (value) => {
    if (value) {
      set({ isInitializing: true })
      await new Promise(resolve => setTimeout(resolve, 2000))
      set({ isSonarActive: true, isInitializing: false })
    } else {
      set({ isDeactivating: true })
      await new Promise(resolve => setTimeout(resolve, 2000))
      set({ isSonarActive: false, isDeactivating: false })
    }
  },
}))

export default useSonarStore
