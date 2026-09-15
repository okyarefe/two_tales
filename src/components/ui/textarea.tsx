import * as React from "react"

import { cn } from "@/utils/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "placeholder:text-muted-foreground focus-visible:bg-card focus-visible:ring-ring/45 aria-invalid:ring-destructive/25 flex field-sizing-content min-h-16 w-full rounded-lg bg-secondary px-4 py-3 text-base transition-[color,box-shadow,background-color] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
