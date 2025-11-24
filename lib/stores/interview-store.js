import { create } from 'zustand'

export const useInterviewStore = create((set) => ({
  interviews: [],
  selectedInterview: null,
  setInterviews: (interviews) => set({ interviews }),
  setSelectedInterview: (interview) => set({ selectedInterview: interview }),
  addInterview: (interview) =>
    set((state) => ({ interviews: [...state.interviews, interview] })),
  updateInterview: (id, data) =>
    set((state) => ({
      interviews: state.interviews.map((i) => (i.id === id ? { ...i, ...data } : i)),
    })),
  deleteInterview: (id) =>
    set((state) => ({
      interviews: state.interviews.filter((i) => i.id !== id),
    })),
}))
