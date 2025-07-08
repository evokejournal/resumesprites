
'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import type { ResumeData } from '@/lib/types';
import { motion } from 'framer-motion';

// --- Pong Game Constants ---
const PADDLE_HEIGHT = 80;
const PADDLE_WIDTH = 10;
const BALL_SIZE = 10;
const PADDLE_OUTSIDE_OFFSET = 24; // Corresponds to p-6 padding

// --- Pong Game Component ---
const PongGame = ({ contentRef }: { contentRef: React.RefObject<HTMLDivElement> }) => {
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
            if (gameState.current) gameState.current.status = 'playing';
        }, 1000);
    }, []);

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
            gameState.current.playerPaddleY = Math.max(0, Math.min(e.clientY - PADDLE_HEIGHT / 2, window.innerHeight - PADDLE_HEIGHT));
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
    }, [contentRef, resetBall]);

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
                className="bg-white"
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
  const { about, contact, experience, education, skills, portfolio, references, custom } = data;
  const lineCounter = useRef(1);
  const contentRef = useRef<HTMLDivElement>(null);

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
  
  return (
    <div className="font-code bg-[#1E1E1E] text-white min-h-screen p-4 sm:p-8 relative overflow-hidden">
      <PongGame contentRef={contentRef} />

      <div ref={contentRef} className="relative z-10 max-w-4xl mx-auto bg-[#252526] p-6 rounded-lg shadow-2xl border border-gray-700">
        <div className="text-center mb-8 border-b border-gray-700 pb-4">
          <h1 className="font-pixelify text-5xl md:text-7xl text-green-400" style={{ textShadow: '0 0 8px rgba(52, 211, 153, 0.5)'}}>
            Hello, World!
          </h1>
          <p className="text-gray-400 mt-2">// My name is {about.name}, and this is my resume.</p>
        </div>

        <div>
            {codeContent()}
        </div>
      </div>
    </div>
  );
}
