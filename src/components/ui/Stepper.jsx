import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';

export default function Stepper({ steps, currentStep }) {
  return (
    <div className="flex w-full justify-between items-center mb-8 relative">
      <div className="absolute top-[28px] left-0 w-full h-[2px] bg-slate-200 dark:bg-slate-700 -z-10" />
      {steps.map((step, index) => {
        const isActive = currentStep === index;
        const isCompleted = currentStep > index;

        return (
          <div key={step.title} className="flex flex-col items-center justify-center gap-2 bg-surface-light dark:bg-surface-dark px-4 py-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 z-10">
            <motion.div
              initial={false}
              animate={{
                backgroundColor: (isActive || isCompleted) ? '#FFC6A3' : 'transparent',
                borderColor: (isActive || isCompleted) ? '#FFC6A3' : (document.documentElement.classList.contains('dark') ? '#475569' : '#cbd5e1')
              }}
              transition={{ duration: 0.3 }}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-300 border-2",
                (isActive || isCompleted) ? "text-slate-900" : "text-slate-500 dark:text-slate-400"
              )}
            >
              {isCompleted ? <Check size={16} /> : index + 1}
            </motion.div>
            <span
              className={cn(
                "hidden sm:block text-xs font-medium uppercase tracking-wider",
                (isActive || isCompleted) ? "text-slate-900 dark:text-slate-100" : "text-slate-500 dark:text-slate-400"
              )}
            >
              {step.title}
            </span>
          </div>
        );
      })}
    </div>
  );
}
