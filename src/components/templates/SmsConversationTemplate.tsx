
'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ResumeData } from '@/lib/types';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
  pdfMode?: boolean;
  showcaseMode?: boolean;
}

const TypingIndicator = ({ name }: { name: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="flex items-center space-x-2 p-4"
  >
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    </div>
    <span className="text-sm text-gray-500">{name} is typing...</span>
  </motion.div>
);

const MessageBubble = ({ sender, children }: { sender: 'recruiter' | 'candidate', children: React.ReactNode }) => {
  const isCandidate = sender === 'candidate';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex mb-4",
        isCandidate ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
          isCandidate ? "bg-blue-500 text-white rounded-br-none" : "bg-gray-200 text-gray-800 rounded-bl-none"
        )}
      >
        {children}
      </div>
    </motion.div>
  );
};

const CoverLetterMessageBubble = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex mb-4 justify-end"
    >
      <div className="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm bg-blue-500 text-white rounded-br-none">
        {children}
      </div>
    </motion.div>
  );
};

export function SmsConversationTemplate({ data, pdfMode, showcaseMode }: TemplateProps) {
  const [messages, setMessages] = useState<React.ReactElement[]>([]);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [showCoverLetter, setShowCoverLetter] = useState(false);
  // --- New state for animated cover letter ---
  const [coverLetterStep, setCoverLetterStep] = useState(0); // 0 = first paragraph
  const [showTyping, setShowTyping] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const coverLetterTimeouts = useRef<NodeJS.Timeout[]>([]);
  const { about, experience, skills, education, portfolio, custom, references, coverLetter } = data;

  // Render cover letter content as SMS messages
  const renderCoverLetterContent = () => {
    if (!coverLetter || coverLetter.trim() === '') {
      return [
        <CoverLetterMessageBubble key="no-cover">
          <div className="text-center text-gray-300">
            No cover letter available
          </div>
        </CoverLetterMessageBubble>
      ];
    }

    const paragraphs = coverLetter.split('\n\n').filter(p => p.trim());
    return paragraphs.map((paragraph, index) => (
      <CoverLetterMessageBubble key={index}>
        <div className="whitespace-pre-line">{paragraph.trim()}</div>
      </CoverLetterMessageBubble>
    ));
  };

  // --- Refactored: Animated cover letter with typing indicator ---
  const coverLetterParagraphs = useMemo(() => {
    if (!coverLetter || coverLetter.trim() === '') return [];
    return coverLetter.split('\n\n').filter(p => p.trim());
  }, [coverLetter]);

  useEffect(() => {
    if (!showCoverLetter) return;
    // Reset animation state when opening cover letter
    setCoverLetterStep(0);
    setShowTyping(false);
    coverLetterTimeouts.current.forEach(clearTimeout);
    coverLetterTimeouts.current = [];
    if (coverLetterParagraphs.length === 0) return;
    
    // Speed multiplier for showcase mode
    const speedMultiplier = showcaseMode ? 0.2 : 1; // 5x faster in showcase
    
    // Start with typing indicator before first paragraph
    setShowTyping(true);
    const initialTypingTimeout = setTimeout(() => {
      setShowTyping(false);
      setCoverLetterStep(1);
      
      // Continue with remaining paragraphs
      const animateStep = (step: number) => {
        if (step >= coverLetterParagraphs.length) return;
        
        // Show typing indicator after current paragraph
        const showTypingTimeout = setTimeout(() => {
          setShowTyping(true);
          // After typing indicator, show next paragraph
          const nextStepTimeout = setTimeout(() => {
            setShowTyping(false);
            setCoverLetterStep(step + 1);
            animateStep(step + 1);
          }, (1200 + Math.random() * 600) * speedMultiplier); // Typing indicator duration
          coverLetterTimeouts.current.push(nextStepTimeout);
        }, (1500 + Math.random() * 800) * speedMultiplier); // Paragraph visible duration
        coverLetterTimeouts.current.push(showTypingTimeout);
      };
      
      animateStep(1);
    }, (1200 + Math.random() * 600) * speedMultiplier); // Initial typing duration
    coverLetterTimeouts.current.push(initialTypingTimeout);
    
    return () => {
      coverLetterTimeouts.current.forEach(clearTimeout);
    };
  }, [showCoverLetter, coverLetterParagraphs.length]);

  // Speed multiplier for showcase mode
  const speedMultiplier = showcaseMode ? 0.2 : 1; // 5x faster in showcase
  
  const conversationFlow = useMemo(() => [
    { type: 'typing', who: 'recruiter', delay: 2000 * speedMultiplier },
    { type: 'recruiter', content: `Hi there! I came across your profile. I'm looking for a top-tier ${about.jobTitle}. Is that you?` },
    
    { type: 'typing', who: 'candidate', delay: 2000 * speedMultiplier },
    { type: 'candidate', content: `Hello! Yes, that's me. I'm ${about.name}, a passionate ${about.jobTitle}. It's great to connect!` },
    
    { type: 'typing', who: 'candidate', delay: 2500 * speedMultiplier },
    { type: 'candidate', content: about.summary },

    { type: 'typing', who: 'recruiter', delay: 2200 * speedMultiplier },
    { type: 'recruiter', content: "Impressive summary. Can you walk me through your experience?" },

    { type: 'typing', who: 'candidate', delay: 3000 * speedMultiplier },
    ...experience.map(job => ({ type: 'candidate', content: <div><h4 className="font-bold">{job.role} at {job.company}</h4><p className="text-xs opacity-80">{job.startDate} - {job.endDate}</p><p className="whitespace-pre-line mt-1">{job.description}</p></div> })),

    { type: 'typing', who: 'recruiter', delay: 2000 * speedMultiplier },
    { type: 'recruiter', content: "Solid background. What are your core skills?" },
    
    { type: 'typing', who: 'candidate', delay: 2500 * speedMultiplier },
    { type: 'candidate', content: <div className="flex flex-wrap gap-2">{skills.map(s => <span key={s.id} className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">{s.name}</span>)}</div> },

    { type: 'typing', who: 'recruiter', delay: 1800 * speedMultiplier },
    { type: 'recruiter', content: "Great skillset. What about your education?" },

    { type: 'typing', who: 'candidate', delay: 2000 * speedMultiplier },
    ...education.map(edu => ({ type: 'candidate', content: <div><h4 className="font-bold">{edu.degree}</h4><p>{edu.institution}</p><p className="text-xs opacity-80">{edu.startDate} - {edu.endDate}</p></div>})),
    
    { type: 'typing', who: 'recruiter', delay: 2200 * speedMultiplier },
    { type: 'recruiter', content: "Looks good. Anything else I should know?" },

    { type: 'typing', who: 'candidate', delay: 2800 * speedMultiplier },
    ...(custom.title && custom.items.length > 0 ? [{ type: 'candidate', content: <div><h4 className="font-bold">{custom.title}</h4>{custom.items.map(i => <p key={i.id} className="whitespace-pre-line text-sm">- {i.description}</p>)}</div> }] : []),
    { type: 'candidate', content: "I have portfolio pieces and references available as well. Let me know if you'd like to see them." },
    
    { type: 'typing', who: 'recruiter', delay: 2000 * speedMultiplier },
    { type: 'recruiter', content: "Yes, please! Send over your portfolio." },

    { type: 'typing', who: 'candidate', delay: 2500 * speedMultiplier },
    ...portfolio.map(p => ({ type: 'candidate', content: <div><h4 className="font-bold">{p.title}</h4><a href={p.url} target="_blank" rel="noopener noreferrer" className="text-white underline">{p.url}</a><p className="whitespace-pre-line mt-1">{p.description}</p></div> })),

    { type: 'typing', who: 'recruiter', delay: 2200 * speedMultiplier },
    { type: 'recruiter', content: "Excellent work. And references?" },

    { type: 'typing', who: 'candidate', delay: 2000 * speedMultiplier },
    ...references.map(r => ({ type: 'candidate', content: <div><h4 className="font-bold">{r.name}</h4><p>{r.relation}</p><p className="text-xs opacity-80">{r.contact}</p></div> })),

    { type: 'typing', who: 'recruiter', delay: 2500 * speedMultiplier },
    { type: 'recruiter', content: "This is all great. I'm very interested. Let's schedule a call for next week." },
  ].filter(item => item.content || item.type === 'typing'), [about, experience, skills, education, custom, portfolio, references]);

  useEffect(() => {
    if (showCoverLetter) return; // Pause conversation when cover letter is open
    
    setMessages([]);
    let currentMessageIndex = 0;
    const timeouts: NodeJS.Timeout[] = [];

    const processNextMessage = () => {
      if (currentMessageIndex >= conversationFlow.length) {
        setTypingUser(null);
        return;
      }

      const item = conversationFlow[currentMessageIndex];
      
      if (item.type === 'typing') {
        const randomDelay = Math.random() * 1500 * speedMultiplier; // 0-1.5 seconds (scaled)
        const delayTimeout = setTimeout(() => {
            const typerName = (item as any).who === 'candidate' ? data.about.name.split(' ')[0] : 'Recruiter';
            setTypingUser(typerName);
            
            // This is how long the typing indicator is visible
            const typingDurationTimeout = setTimeout(() => {
                setTypingUser(null);
                currentMessageIndex++;
                processNextMessage();
            }, (item as any).delay);
            timeouts.push(typingDurationTimeout);
        }, randomDelay);
        timeouts.push(delayTimeout);
      } else {
        const baseMessageDelay = item.type === 'recruiter' ? 1200 : 800;
        const messageDelay = baseMessageDelay * speedMultiplier;
        const timeoutId = setTimeout(() => {
          setMessages(prev => [...prev, <MessageBubble key={prev.length} sender={item.type as 'recruiter' | 'candidate'}>{item.content}</MessageBubble>]);
          currentMessageIndex++;
          processNextMessage();
        }, messageDelay);
        timeouts.push(timeoutId);
      }
    };
    
    // A slight delay to let the page settle before starting the conversation
    const startTimeout = setTimeout(processNextMessage, 1000 * speedMultiplier);
    timeouts.push(startTimeout);

    return () => timeouts.forEach(clearTimeout);
  }, [conversationFlow, data.about.name, showCoverLetter]);

  useEffect(() => {
    if (messages.length > 0 && !showCoverLetter) {
      // A short delay to allow the new element to render before scrolling
      setTimeout(() => {
          window.scrollTo({
              top: document.body.scrollHeight,
              behavior: 'smooth'
          });
      }, 100);
    }
  }, [messages, showCoverLetter]);

  // Apply scrollbar-hide to html and body elements
  useEffect(() => {
    document.documentElement.classList.add('scrollbar-hide');
    document.body.classList.add('scrollbar-hide');
    
    return () => {
      document.documentElement.classList.remove('scrollbar-hide');
      document.body.classList.remove('scrollbar-hide');
    };
  }, []);

  return (
    <div className="bg-white min-h-screen p-4 font-sans overflow-y-auto scrollbar-hide">
        {/* Cover Letter Button */}
        <button
          onClick={() => setShowCoverLetter(true)}
          className="fixed top-4 right-16 z-50 bg-blue-500 text-white rounded-full p-3 hover:bg-blue-600 transition-all duration-200 shadow-lg"
          title="View Cover Letter"
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
        </button>

        {/* Download Button */}
        <button
          onClick={async () => {
            setIsDownloading(true);
            const res = await fetch('/api/resumes/generic-pdf', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ resumeData: data }),
            });
            if (!res.ok) {
              setIsDownloading(false);
              return;
            }
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'resume.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            setIsDownloading(false);
          }}
          className="fixed top-4 right-4 z-50 bg-blue-500 text-white rounded-full p-3 hover:bg-blue-600 transition-all duration-200 shadow-lg"
          title="Download Resume PDF"
          disabled={isDownloading}
        >
          {isDownloading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M12 16l-5-5h3V4h4v7h3l-5 5zm-5 4h10v-2H7v2z"/>
            </svg>
          )}
        </button>

        <div className="w-full max-w-lg mx-auto">
            <div className="flex items-center justify-center mb-8 p-4 bg-gray-50 rounded-lg">
                <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-600" />
                    </div>
                    <span className="absolute bottom-0 right-0 block h-4 w-4 rounded-full bg-green-500 border-2 border-gray-50"></span>
                </div>
                <div className="ml-4">
                    <h2 
                      className="text-xl font-bold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => setShowCoverLetter(true)}
                    >
                      {data.about.name}
                    </h2>
                    <p className="text-sm text-gray-500">Online</p>
                </div>
            </div>
            
            <div>
                {showCoverLetter ? (
                  // Cover Letter Modal Content
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-sm text-gray-600 font-medium">Cover Letter</span>
                      <button
                        onClick={() => setShowCoverLetter(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                    <AnimatePresence>
                      {/* If no cover letter, show message */}
                      {coverLetterParagraphs.length === 0 && (
                        <motion.div
                          key="no-cover"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <CoverLetterMessageBubble>
                            <div className="text-center text-gray-300">
                              No cover letter available
                            </div>
                          </CoverLetterMessageBubble>
                        </motion.div>
                      )}
                      {/* Show paragraphs up to current step */}
                      {coverLetterParagraphs.slice(0, coverLetterStep).map((paragraph, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.2 }}
                        >
                          <CoverLetterMessageBubble>
                            <div className="whitespace-pre-line">{paragraph.trim()}</div>
                          </CoverLetterMessageBubble>
                        </motion.div>
                      ))}
                      {/* Typing indicator appears below all visible paragraphs */}
                      {showTyping && (
                        <TypingIndicator name={data.about.name.split(' ')[0]} key="typing-indicator" />
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  // Regular Conversation
                  <>
                    <AnimatePresence>
                        {messages.map((msg) => msg)}
                    </AnimatePresence>
                    {typingUser && <TypingIndicator name={typingUser} />}
                  </>
                )}
            </div>
        </div>
      <div className="h-[50vh]" />
    </div>
  );
}
