import * as React from "react"
import { cn } from "@/lib/utils"

export type ChartConfig = {
<<<<<<< HEAD
  [k: string]: { label?: string; color?: string }
=======
  [k: string]: {
    label?: string
    color?: string
  }
>>>>>>> af232987d5fee2c20011d4a03b53699889e9f792
}

type ChartContextType = { config: ChartConfig }
export const ChartContext = React.createContext<ChartContextType>({ config: {} })
<<<<<<< HEAD
export const useChart = () => React.useContext(ChartContext)

export const ChartContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { config?: ChartConfig; id?: string }>(
  ({ id, className, children, config = {}, ...props }, ref) => {
    const uid = React.useId()
    const chartId = `chart-${id || uid.replace(/:/g, "")}`
=======

export function useChart() {
  return React.useContext(ChartContext)
}

/**
 * Generic chart container that applies theme-friendly defaults,
 * rounded corners, and removes focus outlines from Recharts nodes.
 */
export const ChartContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { config?: ChartConfig; id?: string }>(
  ({ id, className, children, config = {}, ...props }, ref) => {
    const uniqueId = React.useId()
    const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`
>>>>>>> af232987d5fee2c20011d4a03b53699889e9f792
    return (
      <ChartContext.Provider value={{ config }}>
        <div
          data-chart={chartId}
          ref={ref}
          className={cn(
            "flex aspect-video justify-center rounded-xl border bg-card/50 p-3 text-xs",
            "[&_.recharts-surface]:outline-none [&_.recharts-sector]:outline-none [&_.recharts-curve]:outline-none",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </ChartContext.Provider>
    )
  }
)
ChartContainer.displayName = "ChartContainer"

export function ChartTooltipContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
<<<<<<< HEAD
      className={cn("rounded-lg border bg-popover px-3 py-2 text-popover-foreground shadow-lg rtl:text-right", className)}
=======
      className={cn(
        "rounded-lg border bg-popover px-3 py-2 text-popover-foreground shadow-lg",
        "rtl:text-right",
        className
      )}
>>>>>>> af232987d5fee2c20011d4a03b53699889e9f792
      {...props}
    />
  )
}
