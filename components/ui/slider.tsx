import * as React from 'react';

import { cn } from '@/lib/utils';

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  ...props
}: Omit<React.ComponentProps<'input'>, 'value' | 'defaultValue' | 'onChange'> & {
  value?: number | number[];
  defaultValue?: number | number[];
  onValueChange?: (value: number[]) => void;
}) {
  const currentValue = Array.isArray(value) ? value[0] : value;
  const initialValue = Array.isArray(defaultValue) ? defaultValue[0] : defaultValue;

  return (
    <div
      className={cn('w-full', className)}
      data-slot="slider"
    >
      <input
        type="range"
        data-slot="slider-input"
        min={min}
        max={max}
        step={step}
        value={currentValue}
        defaultValue={currentValue === undefined ? initialValue : undefined}
        onChange={(event) => onValueChange?.([Number(event.currentTarget.value)])}
        {...props}
      />
    </div>
  );
}

export { Slider };
