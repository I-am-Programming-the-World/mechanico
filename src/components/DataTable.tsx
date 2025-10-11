import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface DataTableProps {
  children: ReactNode;
  className?: string;
  /** Tailwind utility string controlling the minimum width of the inner table wrapper. */
  minWidthClass?: string;
}

/**
 * DataTable provides a reusable scroll wrapper for wide tabular layouts so that
 * management views remain usable on mobile without custom utility classes.
 */
export function DataTable({
  children,
  className,
  minWidthClass = 'min-w-[960px]',
}: DataTableProps) {
  return (
    <div className={cn('w-full overflow-x-auto', className)}>
      <div className={cn('inline-block align-middle', minWidthClass)}>{children}</div>
    </div>
  );
}
