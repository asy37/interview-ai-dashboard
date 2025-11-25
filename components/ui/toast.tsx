"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

export const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 rounded-md border p-4 shadow-lg transition-all",
  {
    variants: {
      variant: {
        default: "bg-white border",
        destructive:
          "border-red-500 bg-red-500 text-white group-[.toaster]:bg-red-500",
        success:
          "border-emerald-500 bg-emerald-500 text-white group-[.toaster]:bg-emerald-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {}

export function Toast({ children, className, variant, ...props }: ToastProps) {
  return (
    <div {...props} className={cn(toastVariants({ variant }), className)}>
      {children}
    </div>
  )
}

type ToastTitleProps = React.HTMLAttributes<HTMLDivElement>

export function ToastTitle({ className, ...props }: ToastTitleProps) {
  return <div className={cn("font-semibold", className)} {...props} />
}

type ToastDescriptionProps = React.HTMLAttributes<HTMLDivElement>

export function ToastDescription({
  className,
  ...props
}: ToastDescriptionProps) {
  return (
    <div
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

type ToastActionProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  altText?: string
}

export function ToastAction({ altText: _altText, ...props }: ToastActionProps) {
  return <button {...props} />
}

type ToastCloseProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export function ToastClose({ className, ...props }: ToastCloseProps) {
  return (
    <button className={cn("absolute right-3 top-3", className)} {...props}>
      <X className="h-4 w-4" />
    </button>
  )
}
