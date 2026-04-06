import { cn } from '../../utils/cn';

export function Card({ className, ...props }) {
  return (
    <div 
      className={cn("rounded-xl border border-slate-200 bg-surface-light text-slate-900 shadow-sm dark:border-slate-800 dark:bg-surface-dark dark:text-slate-100", className)} 
      {...props} 
    />
  );
}

export function CardHeader({ className, ...props }) {
  return <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return <h3 className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }) {
  return <div className={cn("flex items-center p-6 pt-0", className)} {...props} />;
}
