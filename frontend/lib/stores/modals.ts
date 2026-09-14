import { create } from 'zustand'

type Modal = 'login'

interface ModalStore {
  openModals: Record<Modal, boolean>
  openModal: (name: Modal) => void
  closeModal: (name: Modal) => void
  isOpen: (name: Modal) => boolean
}

export const useModalStore = create<ModalStore>((set, get) => {
  return {
    openModals: {
      login: false,
    },
    openModal: (name: Modal) => set((state) => ({
      openModals: { ...state.openModals, [name]: true }
    })),
    closeModal: (name: Modal) => set((state) => ({
      openModals: { ...state.openModals, [name]: false }
    })),
    isOpen: (name: Modal) => get().openModals[name],
  }
})
