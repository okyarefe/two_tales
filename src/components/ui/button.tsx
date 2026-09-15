import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 ease-out cursor-pointer disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-ring/45 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive hover:-translate-y-[1px] active:translate-y-[1px] active:shadow-sm",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-action hover:bg-lavender-600 hover:shadow-action-hover",
        accent:
          "bg-accent text-accent-foreground shadow-action hover:bg-lavender-600 hover:shadow-action-hover",
        accentSoft:
          "bg-lavender-100 text-lavender-700 hover:bg-lavender-100/70",
        destructive:
          "bg-blush-100 text-destructive hover:bg-blush-500/35 focus-visible:ring-destructive/25",
        destructiveGhost:
          "text-muted-foreground hover:text-destructive hover:bg-blush-100",
        outline:
          "bg-card text-foreground shadow-sm hover:shadow-md",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-mist-200",
        ghost: "hover:bg-secondary hover:text-secondary-foreground",
        link: "text-accent underline-offset-4 hover:underline hover:text-lavender-700",
      },
      size: {
        default: "h-10 px-5 py-2 has-[>svg]:px-4",
        sm: "h-9 rounded-md gap-1.5 px-3.5 has-[>svg]:px-3",
        lg: "h-12 rounded-xl px-7 text-base has-[>svg]:px-5",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
