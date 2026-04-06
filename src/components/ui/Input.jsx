import { forwardRef, useState } from 'react';
import { cn } from '../../utils/cn';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';

const Input = forwardRef(({ className, type = "text", error, success, label, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const currentType = isPassword && showPassword ? "text" : type;

  return (
    <div className="w-full flex flex-col gap-1.5 focus-within:z-10">
      {label && <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>}
      <div className="relative">
        <input
          type={currentType}
          className={cn(
            "flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-primary transition-all",
            error && "border-red-500 focus:ring-red-500 dark:border-red-500 dark:focus:ring-red-500",
            success && "border-green-500 focus:ring-green-500 dark:border-green-500 dark:focus:ring-green-500",
            (isPassword || success) && "pr-10",
            className
          )}
          ref={ref}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
        {success && !isPassword && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 animate-in fade-in zoom-in duration-300">
            <CheckCircle2 size={18} strokeWidth={2.5} />
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
