import * as React from "react"

import { cn } from "@/utils/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-lavender-100 selection:text-foreground flex h-11 w-full min-w-0 rounded-lg bg-secondary px-4 py-1 text-base transition-[color,box-shadow,background-color] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:bg-card focus-visible:ring-ring/45 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/25 aria-invalid:ring-[3px]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
