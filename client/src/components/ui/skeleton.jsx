import { cn } from "@/lib/utils"

function Skeleton({ className = "", variant = "rect", ...props }) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading..."
      className={cn(
        "animate-pulse bg-accent",
        variant === "text" && "h-4 w-3/4 rounded",
        variant === "circle" && "rounded-full",
        variant === "rect" && "rounded-md",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
