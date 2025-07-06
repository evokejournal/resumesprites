"use client";

import React, { useState, useEffect, useRef } from 'react';

interface AnimatedTextProps {
  text: string;
  onComplete?: () => void;
}

const CHAR_DELAY = 15;
const COMMA_DELAY = 200;
const PERIOD_DELAY = 400;

export function AnimatedText({ text, onComplete }: AnimatedTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const index = useRef(0);
  const animationFrameId = useRef<number>();
  const lastTime = useRef(0);
  const delay = useRef(CHAR_DELAY);

  useEffect(() => {
    const type = (currentTime: number) => {
      if (lastTime.current === 0) {
        lastTime.current = currentTime;
      }

      const deltaTime = currentTime - lastTime.current;

      if (deltaTime > delay.current) {
        if (index.current < text.length) {
          const char = text[index.current];
          setDisplayedText((prev) => prev + char);

          if (char === ',') {
            delay.current = COMMA_DELAY;
          } else if (char === '.' || char === '!' || char === '?') {
            delay.current = PERIOD_DELAY;
          } else {
            delay.current = CHAR_DELAY;
          }

          index.current++;
          lastTime.current = currentTime;
        } else {
          cancelAnimationFrame(animationFrameId.current!);
          onComplete?.();
          return;
        }
      }
      animationFrameId.current = requestAnimationFrame(type);
    };

    animationFrameId.current = requestAnimationFrame(type);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [text, onComplete]);

  return <>{displayedText}</>;
}
