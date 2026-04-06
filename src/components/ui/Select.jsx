import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(({ className, error, label, children, placeholder, ...props }, ref) => {
  return (
    <div className="w-full flex flex-col gap-1.5 focus-within:z-10">
      {label && <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>}
      <div className="relative">
        <select
          className={cn(
            "flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-primary transition-all appearance-none",
            error && "border-red-500 focus:ring-red-500 dark:border-red-500 dark:focus:ring-red-500",
            !props.value && "text-slate-400 dark:text-slate-500",
            className
          )}
          ref={ref}
          {...props}
        >
          {placeholder && (
            <option value="" disabled hidden>{placeholder}</option>
          )}
          {children}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
          <ChevronDown size={16} />
        </div>
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
