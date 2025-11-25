import { create } from 'zustand'
import type { MockInterview } from '@/lib/mock-data'

type InterviewUpdate = Partial<Omit<MockInterview, 'id'>>

interface InterviewState {
  interviews: MockInterview[]
  selectedInterview: MockInterview | null
  setInterviews: (interviews: MockInterview[]) => void
  setSelectedInterview: (interview: MockInterview | null) => void
  addInterview: (interview: MockInterview) => void
  updateInterview: (id: number, data: InterviewUpdate) => void
  deleteInterview: (id: number) => void
}

export const useInterviewStore = create<InterviewState>((set) => ({
  interviews: [],
  selectedInterview: null,
  setInterviews: (interviews) => set({ interviews }),
  setSelectedInterview: (interview) => set({ selectedInterview: interview }),
  addInterview: (interview) =>
    set((state) => ({ interviews: [...state.interviews, interview] })),
  updateInterview: (id, data) =>
    set((state) => ({
      interviews: state.interviews.map((interview) =>
        interview.id === id ? { ...interview, ...data } : interview
      ),
    })),
  deleteInterview: (id) =>
    set((state) => ({
      interviews: state.interviews.filter((interview) => interview.id !== id),
    })),
}))
