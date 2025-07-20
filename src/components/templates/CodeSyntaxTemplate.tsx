
'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import type { ResumeData } from '@/lib/types';
import { motion } from 'framer-motion';
import { Photo } from './Photo';

// --- Pong Game Constants ---
const PADDLE_HEIGHT = 80;
const PADDLE_WIDTH = 10;
const BALL_SIZE = 10;
const PADDLE_OUTSIDE_OFFSET = 24; // Corresponds to p-6 padding

// --- Pong Game Component ---
const PongGame = ({ contentRef, isPaused }: { contentRef: React.RefObject<HTMLDivElement>; isPaused?: boolean }) => {
    // These states are for triggering re-renders to show the game elements on screen
    const [ballPos, setBallPos] = useState({ x: -100, y: -100 });
    const [leftPaddleY, setLeftPaddleY] = useState(0);
    const [rightPaddleY, setRightPaddleY] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    // This ref holds all the actual game logic state, to prevent re-renders from interfering with the game loop
    const gameState = useRef({
        bounds: null as DOMRect | null,
        ballRelativePos: { x: 0, y: 0 },
        ballVel: { x: 0, y: 0 },
        playerPaddleY: 0,
        aiPaddleY: 0,
        status: 'paused' as 'playing' | 'paused',
        lastTime: 0,
    });

    const resetBall = useCallback(() => {
        const { bounds } = gameState.current;
        if (!bounds) return;

        gameState.current.ballRelativePos = { 
            x: bounds.width * (Math.random() * 0.6 + 0.2), // Start at a random horizontal position
            y: bounds.height * 0.1 // Start 10% from the top of the content box
        };
        let newVelX = (Math.random() > 0.5 ? 1 : -1) * 4;
        let newVelY = Math.random() * 3 + 2; // Always start with a downward velocity
        gameState.current.ballVel = { x: newVelX, y: newVelY };
        gameState.current.status = 'paused';
        setTimeout(() => {
            if (gameState.current && !isPaused) gameState.current.status = 'playing';
        }, 1000);
    }, [isPaused]);

    useEffect(() => {
        let animationFrameId: number;

        const gameLoop = (currentTime: number) => {
            const { current: state } = gameState;
            if (!state.bounds) {
                animationFrameId = requestAnimationFrame(gameLoop);
                return;
            }

            if (state.lastTime === 0) {
              state.lastTime = currentTime;
            }
            // Cap deltaTime to prevent huge jumps on tab resume
            const deltaTime = Math.min(5, (currentTime - state.lastTime) / 16.67);
            state.lastTime = currentTime;

            // Pause game when modal is open
            if (isPaused) {
                state.status = 'paused';
            }

            if (state.status === 'playing') {
                // --- Ball Movement ---
                state.ballRelativePos.x += state.ballVel.x * deltaTime;
                state.ballRelativePos.y += state.ballVel.y * deltaTime;

                // --- Vertical Wall Collision (Top/Bottom, viewport-based) ---
                const ballAbsoluteY = state.bounds.top + state.ballRelativePos.y;
                const topWall = 0;
                const bottomWall = window.innerHeight - BALL_SIZE;
                if (ballAbsoluteY < topWall) {
                    const overshoot = topWall - ballAbsoluteY;
                    state.ballRelativePos.y += overshoot;
                    state.ballVel.y *= -1;
                } else if (ballAbsoluteY > bottomWall) {
                    const overshoot = ballAbsoluteY - bottomWall;
                    state.ballRelativePos.y -= overshoot;
                    state.ballVel.y *= -1;
                }

                // --- AI Paddle Logic ---
                const aiPaddleCenter = state.aiPaddleY + PADDLE_HEIGHT / 2;
                const ballCenterAbsoluteY = ballAbsoluteY + (BALL_SIZE / 2);
                const diff = ballCenterAbsoluteY - aiPaddleCenter;
                state.aiPaddleY = Math.max(0, Math.min(state.aiPaddleY + diff * 0.12 * deltaTime, window.innerHeight - PADDLE_HEIGHT));


                // --- Paddle Collisions ---
                const leftPaddleEdge = -PADDLE_OUTSIDE_OFFSET;
                const rightPaddleEdge = state.bounds.width + PADDLE_OUTSIDE_OFFSET;
                const paddleHitboxWidth = PADDLE_WIDTH + 5;

                // Left (Player) Paddle Collision
                if (state.ballVel.x < 0 && state.ballRelativePos.x <= leftPaddleEdge && state.ballRelativePos.x > leftPaddleEdge - paddleHitboxWidth) {
                     if (ballAbsoluteY + BALL_SIZE >= state.playerPaddleY && ballAbsoluteY <= state.playerPaddleY + PADDLE_HEIGHT) {
                        state.ballVel.x *= -1.05;
                        state.ballVel.y += (ballAbsoluteY - (state.playerPaddleY + PADDLE_HEIGHT / 2)) * 0.1;
                        state.ballVel.y = Math.max(-10, Math.min(10, state.ballVel.y)); // Clamp vertical velocity
                    }
                }

                // Right (AI) Paddle Collision
                if (state.ballVel.x > 0 && state.ballRelativePos.x + BALL_SIZE >= rightPaddleEdge && state.ballRelativePos.x < rightPaddleEdge + paddleHitboxWidth) {
                     if (ballAbsoluteY + BALL_SIZE >= state.aiPaddleY && ballAbsoluteY <= state.aiPaddleY + PADDLE_HEIGHT) {
                        state.ballVel.x *= -1.05;
                        state.ballVel.y += (ballAbsoluteY - (state.aiPaddleY + PADDLE_HEIGHT / 2)) * 0.1;
                        state.ballVel.y = Math.max(-10, Math.min(10, state.ballVel.y)); // Clamp vertical velocity
                    }
                }

                // --- Horizontal Wall Collision (Point Scored) ---
                if (state.ballRelativePos.x < leftPaddleEdge - PADDLE_WIDTH * 2 || state.ballRelativePos.x > rightPaddleEdge + PADDLE_WIDTH * 2) {
                    resetBall();
                }
            }

            // --- Update Visuals ---
            setBallPos({
                x: state.bounds.left + state.ballRelativePos.x,
                y: state.bounds.top + state.ballRelativePos.y,
            });
            setLeftPaddleY(state.playerPaddleY);
            setRightPaddleY(state.aiPaddleY);

            animationFrameId = requestAnimationFrame(gameLoop);
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!isPaused) {
                gameState.current.playerPaddleY = Math.max(0, Math.min(e.clientY - PADDLE_HEIGHT / 2, window.innerHeight - PADDLE_HEIGHT));
            }
        };

        const measureAndStart = () => {
            if (contentRef.current) {
                const bounds = contentRef.current.getBoundingClientRect();
                gameState.current.bounds = bounds;
                const initialY = window.innerHeight / 2 - PADDLE_HEIGHT / 2;
                gameState.current.playerPaddleY = initialY;
                gameState.current.aiPaddleY = initialY;
                gameState.current.lastTime = performance.now();
                setLeftPaddleY(initialY);
                setRightPaddleY(initialY);
                resetBall();
                setIsVisible(true);
            }
        };

        const timeoutId = setTimeout(measureAndStart, 100);
        
        window.addEventListener('resize', measureAndStart);
        window.addEventListener('mousemove', handleMouseMove);
        
        animationFrameId = requestAnimationFrame(gameLoop);

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', measureAndStart);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [contentRef, resetBall, isPaused]);

    if (!isVisible || !gameState.current.bounds) return null;

    return (
        <div className="fixed inset-0 z-20 pointer-events-none">
            {/* Left Paddle */}
            <div
                className="bg-white pointer-events-auto"
                style={{
                    position: 'fixed',
                    left: `${gameState.current.bounds.left - PADDLE_OUTSIDE_OFFSET - PADDLE_WIDTH}px`,
                    top: `${leftPaddleY}px`,
                    width: `${PADDLE_WIDTH}px`,
                    height: `${PADDLE_HEIGHT}px`,
                }}
            />
            {/* Right Paddle */}
            <div
                className="bg-white"
                style={{
                    position: 'fixed',
                    left: `${gameState.current.bounds.right + PADDLE_OUTSIDE_OFFSET}px`,
                    top: `${rightPaddleY}px`,
                    width: `${PADDLE_WIDTH}px`,
                    height: `${PADDLE_HEIGHT}px`,
                }}
            />
            {/* Ball */}
            <div
                className="bg-white rounded-full"
                style={{
                    position: 'fixed',
                    left: `${ballPos.x}px`,
                    top: `${ballPos.y}px`,
                    width: `${BALL_SIZE}px`,
                    height: `${BALL_SIZE}px`,
                }}
            />
        </div>
    );
};

interface TemplateProps {
  data: ResumeData;
}

export function CodeSyntaxTemplate({ data }: TemplateProps) {
  const { about, contact, experience, education, skills, portfolio, references, custom, coverLetter } = data;
  const contentRef = useRef<HTMLDivElement>(null);
  const lineCounter = useRef(1);
  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const [modalPosition, setModalPosition] = useState({ left: 0, width: '100vw' });

  // Auto-open cover letter modal on mount if cover letter exists
  useEffect(() => {
    if (coverLetter && coverLetter.trim() !== '') {
      setShowCoverLetter(true);
    }
  }, []);

  useEffect(() => {
    if (showCoverLetter && contentRef.current) {
      const rect = contentRef.current.getBoundingClientRect();
      setModalPosition({
        left: rect.left,
        width: `${rect.width}px`
      });
    }
  }, [showCoverLetter]);

  const renderLine = (content: React.ReactNode) => {
    const lineNum = lineCounter.current;
    lineCounter.current += 1;
    return (
        <motion.div 
            key={lineNum} 
            className="flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: lineNum * 0.02, duration: 0.3 }}
        >
            <span className="w-8 select-none text-right text-gray-500">{lineNum}</span>
            <div className="pl-4 flex-1 break-words whitespace-pre-wrap">{content}</div>
        </motion.div>
    );
  };

  const codeContent = () => {
    lineCounter.current = 1;
    const lines = [];
    
    lines.push(renderLine(<><span className="text-purple-400">const</span> <span className="text-blue-400">candidate</span> = {'{'}</>));
    
    // About & Contact
    lines.push(renderLine(<><span className="text-green-400 pl-4">about:</span> {'{'}</>));
    lines.push(renderLine(<><span className="text-red-400 pl-8">name:</span> <span className="text-orange-400">'{about.name}'</span>,</>));
    lines.push(renderLine(<><span className="text-red-400 pl-8">title:</span> <span className="text-orange-400">'{about.jobTitle}'</span>,</>));
    lines.push(renderLine(<span className="pl-4">{'},'}</span>));
    
    lines.push(renderLine(<><span className="text-green-400 pl-4">contact:</span> {'{'}</>));
    lines.push(renderLine(<><span className="text-red-400 pl-8">email:</span> <a href={`mailto:${contact.email}`} className="text-orange-400 hover:underline">'{contact.email}'</a>,</>));
    lines.push(renderLine(<><span className="text-red-400 pl-8">website:</span> <a href={contact.website} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline">'{contact.website}'</a>,</>));
    lines.push(renderLine(<span className="pl-4">{'},'}</span>));
    
    // Summary as a block comment
    lines.push(renderLine(<span className="text-gray-500 pl-4">/**</span>));
    about.summary.split('\n').forEach(line => {
      lines.push(renderLine(<span className="text-gray-500 pl-4"> * {line}</span>));
    });
    lines.push(renderLine(<span className="text-gray-500 pl-4"> */</span>));

    // Experience
    if (experience.length > 0) {
      lines.push(renderLine(<><span className="text-green-400 pl-4">getExperience() {'{'}</span></>));
      lines.push(renderLine(<><span className="text-purple-400 pl-8">{'return'}</span> {'['}</>));
      experience.forEach(job => {
        lines.push(renderLine(<span className="pl-12">{'{'}</span>));
        lines.push(renderLine(<><span className="text-red-400 pl-16">company:</span> <span className="text-orange-400">'{job.company}'</span>,</>));
        lines.push(renderLine(<><span className="text-red-400 pl-16">role:</span> <span className="text-orange-400">'{job.role}'</span>,</>));
        lines.push(renderLine(<><span className="text-red-400 pl-16">duration:</span> <span className="text-orange-400">'{job.startDate} - {job.endDate}'</span>,</>));
        lines.push(renderLine(<><span className="text-red-400 pl-16">description:</span> <span className="text-gray-500">/*</span></>));
        job.description.split('\n').forEach(line => {
            lines.push(renderLine(<span className="text-gray-500 pl-20">{line}</span>));
        });
        lines.push(renderLine(<><span className="text-gray-500 pl-16">*/</span></>));
        lines.push(renderLine(<span className="pl-12">{'},'}</span>));
      });
      lines.push(renderLine(<span className="pl-8">{']'}</span>));
      lines.push(renderLine(<span className="pl-4">{'}'},</span>));
    }

    // Skills
    if (skills.length > 0) {
      lines.push(renderLine(<><span className="text-green-400 pl-4">skills:</span> {'['}</>));
      skills.forEach(skill => {
         lines.push(renderLine(<span className="pl-8 text-orange-400">'{skill.name}', <span className="text-gray-500">// {skill.level}% proficiency</span></span>));
      });
      lines.push(renderLine(<span className="pl-4">{'],'}</span>));
    }

    // Education
    if (education.length > 0) {
        lines.push(renderLine(<><span className="text-green-400 pl-4">getEducation() {'{'}</span></>));
        lines.push(renderLine(<><span className="text-purple-400 pl-8">{'return'}</span> {'['}</>));
        education.forEach(edu => {
            lines.push(renderLine(<span className="pl-12">{'{'}</span>));
            lines.push(renderLine(<><span className="text-red-400 pl-16">degree:</span> <span className="text-orange-400">'{edu.degree}'</span>,</>));
            lines.push(renderLine(<><span className="text-red-400 pl-16">institution:</span> <span className="text-orange-400">'{edu.institution}'</span>,</>));
            lines.push(renderLine(<span className="pl-12">{'},'}</span>));
        });
        lines.push(renderLine(<span className="pl-8">{']'}</span>));
        lines.push(renderLine(<span className="pl-4">{'}'},</span>));
    }

    // Portfolio
    if (portfolio.length > 0) {
      lines.push(renderLine(<span className="text-gray-500 pl-4">// Portfolio Projects</span>));
      lines.push(renderLine(<><span className="text-green-400 pl-4">portfolio:</span> {'['}</>));
      portfolio.forEach(item => {
        lines.push(renderLine(<a href={item.url} target="_blank" rel="noopener noreferrer" className="pl-8 text-orange-400 hover:underline">'{item.title}'</a>));
      });
      lines.push(renderLine(<span className="pl-4">{'],'}</span>));
    }

    // Custom Section
    if (custom.title && custom.items.length > 0) {
       lines.push(renderLine(<span className="text-gray-500 pl-4">// {custom.title}</span>));
       lines.push(renderLine(<><span className="text-green-400 pl-4">getCustomSection() {'{'}</span></>));
       lines.push(renderLine(<><span className="text-purple-400 pl-8">{'return'}</span> <span className="text-orange-400">{'`'}</span></>));
       custom.items.forEach(item => {
         lines.push(renderLine(<span className="pl-12 text-orange-400">{item.description}</span>));
       });
       lines.push(renderLine(<span className="pl-8 text-orange-400">{'`'}</span>));
       lines.push(renderLine(<span className="pl-4">{'}'},</span>));
    }

    // References
    if (references.length > 0) {
      lines.push(renderLine(<span className="text-gray-500 pl-4">// References available upon request</span>));
      lines.push(renderLine(<><span className="text-green-400 pl-4">references:</span> {'['}</>));
      references.forEach(ref => {
        lines.push(renderLine(<span className="pl-8 text-orange-400">{`'{${ref.name} - ${ref.relation}}'`}</span>));
      });
      lines.push(renderLine(<span className="pl-4">{'],'}</span>));
    }
    
    lines.push(renderLine(<span className="text-purple-400">{'}'};</span>));
    return lines;
  };
  
  const renderCoverLetterLines = () => {
    if (!coverLetter || coverLetter.trim() === '') {
      return (
        <div className="flex">
          <span className="w-8 select-none text-right text-gray-500">2</span>
          <span className="pl-4 flex-1 text-gray-500">// No cover letter available</span>
        </div>
      );
    }

    const lines = coverLetter.split('\n');
    return lines.map((line, index) => (
      <div key={index} className="flex">
        <span className="w-8 select-none text-right text-gray-500">{index + 2}</span>
        <span className="pl-4 flex-1 text-white whitespace-pre-wrap">{line || ' '}</span>
      </div>
    ));
  };



  return (
    <div className="font-code bg-[#1E1E1E] text-white min-h-screen p-4 sm:p-8 relative overflow-hidden">
      {/* Cover Letter Button */}
      <button
        onClick={() => setShowCoverLetter(true)}
        className="fixed top-4 right-16 z-50 bg-[#252526] border border-gray-700 rounded-lg p-3 hover:bg-[#2d2d30] transition-all duration-200 shadow-lg"
        title="View Cover Letter"
      >
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className="text-green-400"
        >
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
        </svg>
      </button>

      {/* Download Button */}
      <button
        onClick={async () => {
          const res = await fetch('/api/resumes/code-syntax-pdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ resumeData: data }),
          });
          if (!res.ok) return;
          const blob = await res.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'resume-code.pdf';
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
        }}
        className="fixed top-4 right-4 z-50 bg-[#252526] border border-gray-700 rounded-lg p-3 hover:bg-[#2d2d30] transition-all duration-200 shadow-lg"
        title="Download Resume PDF"
      >
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className="text-green-400"
        >
          <path d="M12 16l-5-5h3V4h4v7h3l-5 5zm-5 4h10v-2H7v2z"/>
        </svg>
      </button>

      <PongGame contentRef={contentRef} isPaused={showCoverLetter} />



      <div ref={contentRef} className="relative z-10 max-w-4xl mx-auto bg-[#252526] p-6 rounded-lg shadow-2xl border border-gray-700">
        <div className="text-center mb-8 border-b border-gray-700 pb-4">
          <div className="flex flex-col items-center gap-4">
            <Photo photo={about.photo} name={about.name} size="lg" className="border-4 border-green-400/30" />
            <div>
              <h1 
                className="font-pixelify text-5xl md:text-7xl text-green-400 cursor-pointer hover:text-green-300 transition-colors" 
                style={{ textShadow: '0 0 8px rgba(52, 211, 153, 0.5)'}}
                onClick={() => setShowCoverLetter(true)}
              >
                Hello, World!
              </h1>
              <p className="text-gray-400 mt-2">// My name is {about.name}, and this is my resume.</p>
            </div>
          </div>
        </div>

        <div>
            {codeContent()}
        </div>
      </div>

      {/* Cover Letter Modal */}
      {showCoverLetter && (
        <div 
          className="fixed z-50 flex items-start justify-center bg-black/90 p-4"
          style={{
            top: 0,
            left: modalPosition.left,
            width: modalPosition.width,
            height: '100vh'
          }}
        >
          <div className="relative max-w-4xl w-full max-h-[60vh] bg-[#252526] border border-gray-700 rounded-lg shadow-2xl overflow-hidden font-code flex flex-col mt-4">
            {/* Modal header as code line */}
            <div className="flex items-center border-b border-gray-700 px-6 py-4 flex-shrink-0">
              <span className="w-8 select-none text-right text-gray-500">1</span>
              <span className="pl-4 flex-1 text-purple-400">// Cover Letter for {about.name}</span>
              <button
                className="ml-4 px-2 py-1 rounded bg-[#18181b] border border-gray-700 text-gray-400 font-code text-sm hover:text-red-400 hover:bg-[#232324] transition-colors"
                onClick={() => setShowCoverLetter(false)}
                aria-label="Close"
              >
                {'// close'}
              </button>
            </div>
            {/* Modal content as code lines */}
            <div className="px-6 py-6 overflow-y-auto flex-1">
              {/* Cover letter header */}
              <div className="flex">
                <span className="w-8 select-none text-right text-gray-500">1</span>
                <span className="pl-4 flex-1 text-gray-500">// Cover Letter for {about.name}</span>
              </div>
              {/* Actual cover letter content */}
              {renderCoverLetterLines()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
