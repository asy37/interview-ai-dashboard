"use client"

import * as React from "react"
import { useToast } from "@/components/ui/use-toast"
import {
  Toast,
  ToastDescription,
  ToastTitle,
  ToastClose,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <div className="toaster fixed top-4 right-4 z-50 flex flex-col gap-3">
      {toasts.map((toast) => (
        <Toast key={toast.id} variant={toast.variant}>
          <div className="grid gap-1">
            {toast.title && (
              <ToastTitle>{toast.title}</ToastTitle>
            )}
            {toast.description && (
              <ToastDescription>{toast.description}</ToastDescription>
            )}
          </div>

          <ToastClose onClick={() => toast.dismiss?.()} />
        </Toast>
      ))}
    </div>
  )
}