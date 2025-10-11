import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Link, useLocation } from "react-router-dom"

export type NavItem = {
  to: string
  label: string
  icon?: React.ReactNode
}

type SmartNavProps = {
  items: NavItem[]
  className?: string
  // approximate space reserved at the visual end for profile dropdown (px)
  reserveEnd?: number
}

export default function SmartNav({ items, className, reserveEnd = 92 }: SmartNavProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const listRef = React.useRef<HTMLUListElement | null>(null)
  const [visibleCount, setVisibleCount] = React.useState(items.length)
  const location = useLocation()

  const isRtl = typeof document !== "undefined" ? document.documentElement.dir === "rtl" : true

  const ordered = React.useMemo(() => {
    // In RTL we want logical-first item on the right
    return isRtl ? [...items].reverse() : items
  }, [items, isRtl])

  React.useEffect(() => {
    const el = containerRef.current
    const ro = new (window as any).ResizeObserver(calc)
    if (el) ro.observe(el)
    window.addEventListener("resize", calc)
    calc()
    return () => {
      if (el) ro.unobserve(el)
      window.removeEventListener("resize", calc)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ordered.length])

  function calc() {
    const root = containerRef.current
    const list = listRef.current
    if (!root || !list) return
    // Restore all items visible to measure true widths
    setVisibleCount(ordered.length)
    // next frame after state applies
    requestAnimationFrame(() => {
      const rootWidth = root.clientWidth - reserveEnd // leave space for profile
      let used = 0
      const lis = Array.from(list.children) as HTMLElement[]
      // items are visually right-to-left in RTL because of flex-row-reverse
      for (let i = 0; i < lis.length; i++) {
        const li = lis[i]
        used += li.offsetWidth
        if (used > rootWidth) {
          setVisibleCount(Math.max(0, i - 1)) // keep previous item as last visible
          return
        }
      }
      setVisibleCount(lis.length)
    })
  }

  const visible = ordered.slice(0, visibleCount)
  const overflow = ordered.slice(visibleCount)

  return (
    <div ref={containerRef} className={cn("relative w-full")}>
      <ul
        ref={listRef}
        className={cn(
          // Note: we *do not* row-reverse the container; we visually place items from right by using justify-end and rtl direction
          "flex items-center justify-end gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 rtl:flex-row-reverse",
          "whitespace-nowrap",
          className
        )}
        dir="rtl"
        {visible.map((item) => (
          <li key={item.to}>
            <NavPill to={item.to} active={location.pathname === item.to}>
              {item.icon && <span className="rtl:ml-2 ltr:mr-2">{item.icon}</span>}
              <span className="max-w-[14ch] overflow-hidden text-ellipsis">{item.label}</span>
            </NavPill>
          </li>
        ))}

        {overflow.length > 0 && (
          <li>
            <OverflowMenu items={overflow} />
          </li>
        )}
      </ul>
    </div>
  )
}

function NavPill({ to, active, children }: { to: string; active?: boolean; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center rounded-full px-3 py-2 text-sm md:text-[0.95rem] transition-colors",
        "bg-transparent hover:bg-accent/50",
        active ? "text-primary-foreground bg-primary" : "text-foreground"
      )}
      {children}
    </Link>
  )
}

function OverflowMenu({ items }: { items: NavItem[] }) {
  const location = useLocation()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center rounded-full bg-muted/40 px-3 py-2 text-sm hover:bg-muted/60">
        <span className="ml-1">بیشتر</span>
        <ChevronDown className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="min-w-[12rem]" dir="rtl">
        {items.map((item) => (
          <DropdownMenuItem key={item.to} asChild>
            <Link
              to={item.to}
              className={cn(
                "flex items-center gap-2 py-2",
                location.pathname === item.to ? "text-primary" : "text-muted-foreground"
              )}
              {item.icon && <span className="ml-2">{item.icon}</span>}
              <span className="truncate">{item.label}</span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}