import React from 'react';
import { motion } from 'framer-motion';

export function Loader() {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-primary/20 bg-primary/5 shadow-[0_0_30px_rgba(200,155,44,0.15)]">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "100%" }}
            transition={{ duration: 1.2, ease: "circInOut" }}
            className="absolute bottom-0 w-full rounded-full bg-primary/10"
          />
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="font-serif text-3xl font-bold tracking-[-0.02em] text-primary relative z-10"
          >
            FU
          </motion.span>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "100px" }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-8 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"
        />
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-4 font-serif text-xs uppercase tracking-[0.3em] text-muted-foreground"
        >
          Frames by Ushani
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
