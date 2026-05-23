import * as React from "react"
import { X } from "lucide-react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-4 left-[50%] z-[100] flex max-h-screen w-full translate-x-[-50%] flex-col gap-2 p-4 sm:right-4 sm:left-auto sm:translate-x-0 sm:flex-col md:max-w-[400px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  [
    // base shape & layout
    "group pointer-events-auto relative flex w-full items-start justify-between gap-3 overflow-hidden",
    "rounded-2xl border px-4 py-3 pr-9",
    // glass base
    "backdrop-blur-[20px] backdrop-saturate-[180%]",
    // shadow
    "shadow-[0_8px_32px_rgba(0,0,0,0.28),0_1px_0_rgba(255,255,255,0.06)_inset]",
    // animation
    "transition-all",
    "data-[swipe=cancel]:translate-x-0",
    "data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]",
    "data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full",
    "data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-zinc-900/70 border-white/[0.12] text-zinc-100",
          "shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.10)]",
        ].join(" "),

        success: [
          // green-tinted glass
          "bg-emerald-950/60 border-emerald-400/25 text-emerald-50",
          "shadow-[0_8px_32px_rgba(0,0,0,0.30),0_0_0_1px_rgba(52,211,153,0.12),inset_0_1px_0_rgba(52,211,153,0.18)]",
          // subtle inner glow
          "before:absolute before:inset-0 before:rounded-2xl before:bg-emerald-400/[0.06] before:pointer-events-none",
        ].join(" "),

        destructive: [
          // red-tinted glass
          "bg-red-950/60 border-red-400/25 text-red-50",
          "shadow-[0_8px_32px_rgba(0,0,0,0.30),0_0_0_1px_rgba(248,113,113,0.12),inset_0_1px_0_rgba(248,113,113,0.18)]",
          "before:absolute before:inset-0 before:rounded-2xl before:bg-red-400/[0.06] before:pointer-events-none",
        ].join(" "),

        error: [
          "bg-red-950/60 border-red-400/25 text-red-50",
          "shadow-[0_8px_32px_rgba(0,0,0,0.30),0_0_0_1px_rgba(248,113,113,0.12),inset_0_1px_0_rgba(248,113,113,0.18)]",
          "before:absolute before:inset-0 before:rounded-2xl before:bg-red-400/[0.06] before:pointer-events-none",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-7 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 px-3 text-xs font-medium transition-colors",
      "hover:bg-white/20 focus:outline-none focus:ring-1 focus:ring-white/30",
      "disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-lg p-1",
      "text-white/40 opacity-0 transition-all",
      "hover:text-white/90 hover:bg-white/10",
      "focus:opacity-100 focus:outline-none focus:ring-1 focus:ring-white/20",
      "group-hover:opacity-100",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-3.5 w-3.5" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold leading-snug [&+div]:text-xs", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-xs leading-relaxed opacity-75", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
