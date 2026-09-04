'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

function Progress({
  className,
  value = 0,
  ...props
}: React.ComponentProps<'div'> & { value?: number }) {
  const boundedValue = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={boundedValue}
      data-slot="progress"
      className={cn('flex flex-wrap gap-3', className)}
      {...props}
    >
      <div data-slot="progress-track">
        <div
          data-slot="progress-indicator"
          style={{ width: `${boundedValue}%` }}
        />
      </div>
    </div>
  );
}

export { Progress };
