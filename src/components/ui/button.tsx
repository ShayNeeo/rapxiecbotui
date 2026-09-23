import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-3 focus-visible:ring-amber-500/50 active:scale-95 disabled:pointer-events-none disabled:opacity-50 cursor-pointer shadow-xs [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-600/20 active:bg-red-800 border-red-700",
        carnival:
          "bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white font-bold tracking-wide shadow-md shadow-orange-500/30 hover:brightness-110 active:brightness-95 border border-amber-300/40",
        outline:
          "border-neutral-300 bg-white hover:bg-amber-50 hover:text-amber-900 hover:border-amber-300 text-neutral-800",
        secondary:
          "bg-amber-100 text-amber-950 hover:bg-amber-200 border-amber-200",
        ghost:
          "hover:bg-neutral-100 text-neutral-700 hover:text-neutral-900 border-transparent shadow-none",
        destructive:
          "bg-red-100 text-red-700 hover:bg-red-200 border-red-200",
        link: "text-red-600 underline-offset-4 hover:underline shadow-none border-transparent",
        gold: "bg-amber-400 text-amber-950 font-bold hover:bg-amber-300 border-amber-500 shadow-sm shadow-amber-400/30",
      },
      size: {
        default: "h-9 gap-2 px-4 text-sm",
        xs: "h-6 gap-1 rounded-lg px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1.5 rounded-lg px-3 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-11 gap-2.5 rounded-xl px-5 text-base font-semibold",
        icon: "size-9",
        "icon-xs": "size-6 rounded-lg",
        "icon-sm": "size-7 rounded-lg",
        "icon-lg": "size-11 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
