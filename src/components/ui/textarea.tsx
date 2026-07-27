import * as React from 'react'

import { cn } from '@/lib/utils'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'dark:bg-input/30 focus-visible:ring-ring/50 focus-visible:ring-inset aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 disabled:bg-input/50 dark:disabled:bg-input/80 rounded-[var(--duckit-radius-md)] bg-transparent px-2.5 py-2 text-base transition-colors focus-visible:ring-3 focus-visible:ring-inset aria-invalid:ring-3 aria-invalid:ring-inset md:text-sm placeholder:text-muted-foreground flex field-sizing-content min-h-16 w-full outline-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
