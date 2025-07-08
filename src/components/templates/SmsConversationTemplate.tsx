
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
  isCoverLetterOpen: boolean;
  setCoverLetterOpen: (open: boolean) => void;
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

export function SmsConversationTemplate({ data, isCoverLetterOpen, setCoverLetterOpen }: TemplateProps) {
  const [messages, setMessages] = useState<React.ReactNode[]>([]);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const { about, experience, skills, education, portfolio, custom, references } = data;

  const conversationFlow = useMemo(() => [
    { type: 'recruiter', content: `Hi there! I came across your profile. I'm looking for a top-tier ${about.jobTitle}. Is that you?` },
    
    { type: 'typing', who: 'candidate', delay: 2000 },
    { type: 'candidate', content: `Hello! Yes, that's me. I'm ${about.name}, a passionate ${about.jobTitle}. It's great to connect!` },
    
    { type: 'typing', who: 'candidate', delay: 2500 },
    { type: 'candidate', content: about.summary },

    { type: 'typing', who: 'recruiter', delay: 2200 },
    { type: 'recruiter', content: "Impressive summary. Can you walk me through your experience?" },

    { type: 'typing', who: 'candidate', delay: 3000 },
    ...experience.map(job => ({ type: 'candidate', content: <div><h4 className="font-bold">{job.role} at {job.company}</h4><p className="text-xs opacity-80">{job.startDate} - {job.endDate}</p><p className="whitespace-pre-line mt-1">{job.description}</p></div> })),

    { type: 'typing', who: 'recruiter', delay: 2000 },
    { type: 'recruiter', content: "Solid background. What are your core skills?" },
    
    { type: 'typing', who: 'candidate', delay: 2500 },
    { type: 'candidate', content: <div className="flex flex-wrap gap-2">{skills.map(s => <span key={s.id} className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">{s.name}</span>)}</div> },

    { type: 'typing', who: 'recruiter', delay: 1800 },
    { type: 'recruiter', content: "Great skillset. What about your education?" },

    { type: 'typing', who: 'candidate', delay: 2000 },
    ...education.map(edu => ({ type: 'candidate', content: <div><h4 className="font-bold">{edu.degree}</h4><p>{edu.institution}</p><p className="text-xs opacity-80">{edu.startDate} - {edu.endDate}</p></div>})),
    
    { type: 'typing', who: 'recruiter', delay: 2200 },
    { type: 'recruiter', content: "Looks good. Anything else I should know?" },

    { type: 'typing', who: 'candidate', delay: 2800 },
    ...(custom.title && custom.items.length > 0 ? [{ type: 'candidate', content: <div><h4 className="font-bold">{custom.title}</h4>{custom.items.map(i => <p key={i.id} className="whitespace-pre-line text-sm">- {i.description}</p>)}</div> }] : []),
    { type: 'candidate', content: "I have portfolio pieces and references available as well. Let me know if you'd like to see them." },
    
    { type: 'typing', who: 'recruiter', delay: 2000 },
    { type: 'recruiter', content: "Yes, please! Send over your portfolio." },

    { type: 'typing', who: 'candidate', delay: 2500 },
    ...portfolio.map(p => ({ type: 'candidate', content: <div><h4 className="font-bold">{p.title}</h4><a href={p.url} target="_blank" rel="noopener noreferrer" className="text-white underline">{p.url}</a><p className="whitespace-pre-line mt-1">{p.description}</p></div> })),

    { type: 'typing', who: 'recruiter', delay: 2200 },
    { type: 'recruiter', content: "Excellent work. And references?" },

    { type: 'typing', who: 'candidate', delay: 2000 },
    ...references.map(r => ({ type: 'candidate', content: <div><h4 className="font-bold">{r.name}</h4><p>{r.relation}</p><p className="text-xs opacity-80">{r.contact}</p></div> })),

    { type: 'typing', who: 'recruiter', delay: 2500 },
    { type: 'recruiter', content: "This is all great. I'm very interested. Let's schedule a call for next week." },
  ].filter(item => item.content || item.type === 'typing'), [about, experience, skills, education, custom, portfolio, references]);

  // Force scrollbar to be visible to prevent layout jank
  useEffect(() => {
    document.documentElement.style.overflowY = 'scroll';
    return () => {
      document.documentElement.style.overflowY = 'auto';
    };
  }, []);

  useEffect(() => {
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
        const randomDelay = Math.random() * 2000 + 1000; // 1-3 seconds
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
        const messageDelay = item.type === 'recruiter' ? 1200 : 800;
        const timeoutId = setTimeout(() => {
          setMessages(prev => [...prev, <MessageBubble key={prev.length} sender={item.type as 'recruiter' | 'candidate'}>{item.content}</MessageBubble>]);
          currentMessageIndex++;
          processNextMessage();
        }, messageDelay);
        timeouts.push(timeoutId);
      }
    };
    
    // A slight delay to let the page settle before starting the conversation
    const startTimeout = setTimeout(processNextMessage, 1000);
    timeouts.push(startTimeout);

    return () => timeouts.forEach(clearTimeout);
  }, [conversationFlow, data.about.name]);

  useEffect(() => {
    if (messages.length > 0) {
      // A short delay to allow the new element to render before scrolling
      setTimeout(() => {
          window.scrollTo({
              top: document.body.scrollHeight,
              behavior: 'smooth'
          });
      }, 100);
    }
  }, [messages]);

  return (
    <div className="bg-white min-h-screen p-4 font-sans">
        <div className="w-full max-w-lg mx-auto">
            <div className="flex items-center justify-center mb-8 p-4 bg-gray-50 rounded-lg">
                <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-600" />
                    </div>
                    <span className="absolute bottom-0 right-0 block h-4 w-4 rounded-full bg-green-500 border-2 border-gray-50"></span>
                </div>
                <div className="ml-4">
                    <h2 className="text-xl font-bold text-gray-800">{data.about.name}</h2>
                    <p className="text-sm text-gray-500">Online</p>
                </div>
            </div>
            
            <div>
                <AnimatePresence>
                    {messages.map((msg) => msg)}
                </AnimatePresence>
                {typingUser && <TypingIndicator name={typingUser} />}
            </div>
        </div>
      <div className="h-[50vh]" />
    </div>
  );
}
