'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { createInterviewSchema } from '@/lib/schemas'
import apiClient from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { CalendarIcon, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import Link from 'next/link'

export default function CreateInterviewPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [selectedDate, setSelectedDate] = useState()

  const { data: positions = [] } = useQuery({
    queryKey: ['positions'],
    queryFn: async () => {
      const response = await apiClient.get('/positions')
      return response.data
    },
  })

  const { data: templates = [] } = useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      const response = await apiClient.get('/templates')
      return response.data
    },
  })

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(createInterviewSchema),
    defaultValues: {
      type: 'assessment',
      calendarSync: 'none',
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.post('/interviews', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] })
      toast.success('Interview created successfully!')
      router.push('/interviews')
    },
    onError: () => {
      toast.error('Failed to create interview')
    },
  })

  const onSubmit = (data) => {
    createMutation.mutate(data)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/interviews">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{t('createInterview')}</h1>
          <p className="text-muted-foreground">
            Schedule a new interview or assessment
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Candidate Information</CardTitle>
            <CardDescription>
              Basic details about the candidate and position
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="candidateName">{t('candidateName')} *</Label>
                <Input
                  id="candidateName"
                  placeholder="John Doe"
                  {...register('candidateName')}
                />
                {errors.candidateName && (
                  <p className="text-sm text-destructive">
                    {errors.candidateName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="candidateEmail">{t('email')} *</Label>
                <Input
                  id="candidateEmail"
                  type="email"
                  placeholder="john@example.com"
                  {...register('candidateEmail')}
                />
                {errors.candidateEmail && (
                  <p className="text-sm text-destructive">
                    {errors.candidateEmail.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">{t('position')} *</Label>
              <Controller
                name="position"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map((pos) => (
                        <SelectItem key={pos} value={pos}>
                          {pos}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.position && (
                <p className="text-sm text-destructive">
                  {errors.position.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Interview Details</CardTitle>
            <CardDescription>
              Configure the interview type and schedule
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t('interviewType')} *</Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="grid grid-cols-3 gap-4"
                  >
                    <div>
                      <RadioGroupItem
                        value="assessment"
                        id="assessment"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="assessment"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span className="text-sm font-medium">
                          {t('assessment')}
                        </span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value="video"
                        id="video"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="video"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span className="text-sm font-medium">
                          {t('videoInterview')}
                        </span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value="combo"
                        id="combo"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="combo"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span className="text-sm font-medium text-center">
                          {t('combo')}
                        </span>
                      </Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>{t('interviewDate')} *</Label>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.date && (
                <p className="text-sm text-destructive">
                  {errors.date.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="templateId">Question Template (Optional)</Label>
              <Controller
                name="templateId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name} ({template.questionCount} questions)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="calendarSync">Calendar Integration</Label>
              <Controller
                name="calendarSync"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No sync</SelectItem>
                      <SelectItem value="google">Google Calendar</SelectItem>
                      <SelectItem value="outlook">Outlook Calendar</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">{t('notes')}</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes or instructions..."
                {...register('notes')}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Link href="/interviews">
            <Button variant="outline" type="button">
              {t('cancel')}
            </Button>
          </Link>
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? t('loading') : t('createInterview')}
          </Button>
        </div>
      </form>
    </div>
  )
}
