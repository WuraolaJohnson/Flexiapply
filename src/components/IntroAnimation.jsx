import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function IntroAnimation({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');
    
    if (hasSeenIntro) {
      setLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(false);
      sessionStorage.setItem('hasSeenIntro', 'true');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            key="intro"
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950"
            initial={{ y: 0 }}
            exit={{ 
              y: '-100%', 
              transition: { 
                duration: 0.8, 
                ease: [0.76, 0, 0.24, 1] // Snappy garage-door ease out
              } 
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center text-primary"
            >
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 uppercase">
                FlexiApply
              </h1>
              <p className="text-slate-500 font-medium tracking-widest text-xs uppercase mb-8">
                Your Future Starts Here
              </p>
              <div className="flex gap-3 justify-center mt-4">
                <motion.div 
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                />
                <motion.div 
                  className="w-3 h-3 rounded-full bg-slate-800"
                  animate={{ y: [0, -10, 0], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div 
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={{ y: [0, -10, 0], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main Content Fade-In */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="min-h-screen"
        >
          {children}
        </motion.div>
      )}
    </>
  );
}
