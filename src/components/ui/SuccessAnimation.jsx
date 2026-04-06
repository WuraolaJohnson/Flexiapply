import { motion } from 'framer-motion';

export default function SuccessAnimation() {
  return (
    <div className="flex flex-col items-center justify-center py-8 mb-6 border border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10 rounded-xl shadow-sm">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-20 h-20 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mb-4"
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-10 h-10 text-green-600 dark:text-green-400"
        >
          <motion.polyline 
            points="20 6 9 17 4 12" 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          />
        </motion.svg>
      </motion.div>
      <motion.h3 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="text-xl font-bold text-green-800 dark:text-green-300"
      >
        Application Submitted!
      </motion.h3>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-sm text-green-600 dark:text-green-500 mt-2"
      >
        Your application is now under review.
      </motion.p>
    </div>
  );
}
