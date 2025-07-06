"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface WindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  zIndex: number;
  initialX: number;
  initialY: number;
  onClose: () => void;
  onFocus: () => void;
  isMobile?: boolean;
}

export function Window({ id, title, children, zIndex, initialX, initialY, onClose, onFocus, isMobile }: WindowProps) {
  return (
    <motion.div
      drag
      dragHandle=".drag-handle"
      dragMomentum={false}
      initial={{ x: initialX, y: initialY, scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.15 }}
      style={{ zIndex }}
      onPointerDown={onFocus}
      className={cn(
        "absolute top-0 left-0 w-full max-w-lg min-w-[300px] h-auto max-h-[400px] bg-win-gray border-2 border-outset flex flex-col shadow-lg",
        isMobile && "max-w-[calc(100vw-40px)] min-w-0"
      )}
    >
      <div className="drag-handle h-6 bg-win-blue text-white flex items-center justify-between px-1 cursor-move">
        <span className="text-sm font-bold select-none">{title}</span>
        <button onClick={onClose} className="w-4 h-4 bg-win-gray border-2 border-outset flex items-center justify-center text-black font-bold text-xs leading-none active:border-inset">
          X
        </button>
      </div>
      <div className="p-2 overflow-y-auto text-sm">
        {children}
      </div>
    </motion.div>
  );
}
