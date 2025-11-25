import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
})

export const createInterviewSchema = z.object({
  candidateName: z.string().min(2, 'Name must be at least 2 characters'),
  candidateEmail: z.string().email('Invalid email address'),
  position: z.string().min(1, 'Please select a position'),
  date: z.date({ required_error: 'Please select a date' }),
  type: z.enum(['assessment', 'video', 'combo']),
  templateId: z.string().optional(),
  notes: z.string().optional(),
  calendarSync: z.enum(['google', 'outlook', 'none']).optional(),
})

export const createTemplateSchema = z.object({
  name: z.string().min(3, 'Template name must be at least 3 characters'),
  questions: z
    .array(
      z.object({
        text: z.string().min(5, 'Question must be at least 5 characters'),
        category: z.enum(['technical', 'culture', 'behavioral', 'leadership']),
        difficulty: z.enum(['easy', 'medium', 'hard']),
        evaluationCriteria: z.array(z.string()),
      })
    )
    .min(1, 'At least one question is required'),
})

export type LoginSchema = z.infer<typeof loginSchema>
export type CreateInterviewSchema = z.infer<typeof createInterviewSchema>
export type CreateTemplateSchema = z.infer<typeof createTemplateSchema>
