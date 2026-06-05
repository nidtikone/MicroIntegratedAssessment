import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';

interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  id?: string;
}

/** Styled checkbox built on Radix Checkbox. */
export default function Checkbox({ checked, onCheckedChange, label, id }: CheckboxProps) {
  return (
    <label className="inline-flex cursor-pointer select-none items-center gap-2 text-sm text-slate-600">
      <CheckboxPrimitive.Root
        id={id}
        checked={checked}
        onCheckedChange={(c) => onCheckedChange(c === true)}
        className="flex h-4 w-4 items-center justify-center rounded border border-slate-300 bg-white transition-colors data-[state=checked]:border-brand-600 data-[state=checked]:bg-brand-600"
      >
        <CheckboxPrimitive.Indicator>
          <Check size={12} className="text-white" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {label && <span>{label}</span>}
    </label>
  );
}
