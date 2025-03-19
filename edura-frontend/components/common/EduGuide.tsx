"use client"

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'
import { X, MessageSquare, Volume2, VolumeX } from 'lucide-react'

// EduGuide character states with corresponding images and messages
const EDUGUIDE_STATES = {
  IDLE: {
    image: '/sql-game/eduguide/eduguide-ready-to-learn.jpeg.png',
    messages: [
      "Need any help? I'm EduGuide, your learning assistant!",
      "Click on me if you have questions!",
      "Drag me around if I'm in your way!"
    ]
  },
  GREETING: {
    image: '/sql-game/eduguide/eduguide-says-hi.png',
    messages: [
      "Hi there! I'm EduGuide, your learning companion!",
      "Welcome to Edura! Let me know if you need help.",
      "Hello! Ready to learn something awesome today?"
    ]
  },
  HAPPY: {
    image: '/sql-game/eduguide/eduguide-happy.png',
    messages: [
      "Great job! You're making excellent progress!",
      "That's awesome! Keep up the good work!",
      "You're doing fantastically well!"
    ]
  },
  ADVICE: {
    image: '/sql-game/eduguide/eduguide-giving-advice.png',
    messages: [
      "Here's a tip: regular practice leads to mastery!",
      "Try breaking down complex concepts into smaller parts.",
      "Remember to take short breaks to keep your mind fresh!"
    ]
  },
  TROPHY: {
    image: '/sql-game/eduguide/eduguide-trophy.png',
    messages: [
      "Congratulations on your achievement!",
      "You've earned a new badge! Keep collecting them!",
      "Another milestone reached! You're on your way to becoming a pro!"
    ]
  },
  FRUSTRATED: {
    image: '/sql-game/eduguide/eduguide-frustrated.png',
    messages: [
      "Hmm, that's not quite right. Let's try again!",
      "Learning can be challenging sometimes, but don't give up!",
      "That's okay! Mistakes are part of the learning process."
    ]
  },
  SAD: {
    image: '/sql-game/eduguide/eduguide-sad.png',
    messages: [
      "Oops! Something went wrong. Let's figure it out together!",
      "Don't worry! We all face challenges sometimes.",
      "It's okay to struggle - that's how we grow!"
    ]
  }
}

// Page-specific suggestions
const PAGE_SUGGESTIONS = {
  '/dashboard': [
    "Check out your recent progress in the cards above!",
    "Your upcoming lessons are displayed in the sidebar.",
    "Don't forget to complete your pending assignments!"
  ],
  '/profile': [
    "You can earn XP badges by reaching certain experience thresholds!",
    "Collect EDUCOINS by completing courses and challenges.",
    "Your tier progress is shown at the top of your profile."
  ],
  '/courses': [
    "Browse courses by category or difficulty level.",
    "You can continue where you left off in your enrolled courses.",
    "Check the progress bar to see how far you've come in each course!"
  ],
  '/story-mode': [
    "Story mode lets you learn while enjoying an adventure!",
    "Complete challenges to progress in your journey.",
    "Each level teaches you different concepts in an engaging way."
  ],
  '/': [
    "Welcome to Edura! Sign up to start your learning journey.",
    "Explore our courses and interactive learning features.",
    "Join our community of learners from around the world!"
  ]
}

interface EduGuideProps {
  initialState?: keyof typeof EDUGUIDE_STATES
  initialPosition?: { x: number; y: number }
  customMessage?: string
  lockPosition?: boolean
  useFixedPosition?: boolean
}

// Create a global event system for EduGuide interactions
export const triggerEduGuideEvent = (eventType: string, data?: any) => {
  // Use a custom event to communicate with EduGuide
  const event = new CustomEvent('eduguide-event', {
    detail: { type: eventType, data }
  });
  window.dispatchEvent(event);
};

// Helper to directly trigger EduGuide using the context (for components with access to context)
export const triggerEduGuideWithContext = (
  eduGuideContext: any, 
  eventType: string, 
  message: string, 
  state: keyof typeof EDUGUIDE_STATES = 'ADVICE'
) => {
  if (!eduGuideContext) return;
  
  // Use the enhanced context API - single call to triggerMessage with state override
  eduGuideContext.triggerMessage(message, state);
};

export default function EduGuide({ 
  initialState = 'IDLE', 
  initialPosition, 
  customMessage,
  lockPosition = false,
  useFixedPosition = false 
}: EduGuideProps) {
  const [state, setState] = useState<keyof typeof EDUGUIDE_STATES>(initialState)
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState(customMessage || '')
  const [position, setPosition] = useState(initialPosition || { x: 20, y: 20 })
  const [isMuted, setIsMuted] = useState(true)
  const [hasInteracted, setHasInteracted] = useState(false)
  const bubbleControls = useAnimation()
  const characterControls = useAnimation()
  const pathname = usePathname()
  const eduguideRef = useRef<HTMLDivElement>(null)
  
  // Get random message based on current state
  const getRandomMessage = (stateKey: keyof typeof EDUGUIDE_STATES) => {
    const messages = EDUGUIDE_STATES[stateKey].messages
    return messages[Math.floor(Math.random() * messages.length)]
  }
  
  // Get page-specific suggestions
  const getPageSuggestions = () => {
    // Try exact path match first
    let suggestions = PAGE_SUGGESTIONS[pathname]
    
    // If no exact match, try to find a partial match
    if (!suggestions) {
      for (const path in PAGE_SUGGESTIONS) {
        if (pathname.includes(path) && path !== '/') {
          suggestions = PAGE_SUGGESTIONS[path]
          break
        }
      }
    }
    
    // If still no match, use generic suggestions
    if (!suggestions) {
      suggestions = PAGE_SUGGESTIONS['/']
    }
    
    return suggestions[Math.floor(Math.random() * suggestions.length)]
  }

  // Initial greeting on first load
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasInteracted) {
        setState('GREETING')
        setMessage(getRandomMessage('GREETING'))
        setIsOpen(true)
        
        // Auto-close after 5 seconds
        const closeTimer = setTimeout(() => {
          setIsOpen(false)
        }, 5000)
        
        return () => clearTimeout(closeTimer)
      }
    }, 3000)
    
    return () => clearTimeout(timer)
  }, [hasInteracted])
  
  // Periodic suggestions when idle
  useEffect(() => {
    if (!hasInteracted) return
    
    const randomInterval = Math.floor(Math.random() * (120000 - 60000) + 60000) // Between 1-2 minutes
    const timer = setTimeout(() => {
      if (!isOpen) {
        setState('ADVICE')
        setMessage(getPageSuggestions())
        setIsOpen(true)
        
        // Auto-close after 5 seconds
        const closeTimer = setTimeout(() => {
          setIsOpen(false)
          setState('IDLE')
        }, 5000)
        
        return () => clearTimeout(closeTimer)
      }
    }, randomInterval)
    
    return () => clearTimeout(timer)
  }, [isOpen, hasInteracted, pathname])
  
  // Respond to page changes
  useEffect(() => {
    if (hasInteracted) {
      setState('IDLE')
      // Wait a moment after page change to show a suggestion
      const timer = setTimeout(() => {
        if (!isOpen) {
          setState('ADVICE')
          setMessage(getPageSuggestions())
          setIsOpen(true)
          
          // Auto-close after 5 seconds
          const closeTimer = setTimeout(() => {
            setIsOpen(false)
            setState('IDLE')
          }, 5000)
          
          return () => clearTimeout(closeTimer)
        }
      }, 1500)
      
      return () => clearTimeout(timer)
    }
  }, [pathname])
  
  // Global event listener for EduGuide interactions
  useEffect(() => {
    const handleEduGuideEvent = (event: any) => {
      const { type, data } = event.detail;
      
      switch (type) {
        case 'achievement':
          setState('TROPHY');
          setMessage(`Congratulations! You've earned ${data.name}!`);
          setIsOpen(true);
          break;
        case 'course-complete':
          setState('HAPPY');
          setMessage(`Great job completing ${data.name}! You've earned ${data.reward} EDUCOINS!`);
          setIsOpen(true);
          break;
        case 'quiz-success':
          setState('HAPPY');
          setMessage(`Excellent work on the quiz! Your score: ${data.score}%`);
          setIsOpen(true);
          break;
        case 'error':
          setState('SAD');
          setMessage(`Oops! ${data.message}`);
          setIsOpen(true);
          break;
        case 'tip':
          setState('ADVICE');
          setMessage(data.message);
          setIsOpen(true);
          break;
      }
      
      // Auto close after a few seconds
      setTimeout(() => {
        setIsOpen(false);
        setState('IDLE');
      }, 5000);
    };
    
    window.addEventListener('eduguide-event', handleEduGuideEvent);
    return () => window.removeEventListener('eduguide-event', handleEduGuideEvent);
  }, []);
  
  // Animation for speech bubble
  useEffect(() => {
    if (isOpen) {
      bubbleControls.start({
        scale: [0, 1.1, 1],
        opacity: 1,
        transition: { duration: 0.3 }
      })
    } else {
      bubbleControls.start({
        scale: 0,
        opacity: 0,
        transition: { duration: 0.2 }
      })
    }
  }, [isOpen, bubbleControls])
  
  // Animation for character reactions
  useEffect(() => {
    // Different animations for different states
    if (state === 'HAPPY' || state === 'TROPHY') {
      characterControls.start({
        y: [0, -10, 0],
        transition: { duration: 0.5, times: [0, 0.5, 1] }
      })
    } else if (state === 'FRUSTRATED' || state === 'SAD') {
      characterControls.start({
        rotate: [-5, 5, 0],
        transition: { duration: 0.5, times: [0, 0.5, 1] }
      })
    } else if (state === 'GREETING') {
      characterControls.start({
        scale: [1, 1.1, 1],
        transition: { duration: 0.5, times: [0, 0.5, 1] }
      })
    } else if (state === 'IDLE') {
      // Subtle breathing animation when idle
      characterControls.start({
        y: [0, -3, 0],
        transition: { 
          duration: 2.5, 
          repeat: Infinity, 
          repeatType: "reverse" 
        }
      })
    }
  }, [state, characterControls])
  
  // Update message when customMessage prop changes
  useEffect(() => {
    if (customMessage) {
      setMessage(customMessage)
      setIsOpen(true)
      
      // Auto-close after 5 seconds
      const closeTimer = setTimeout(() => {
        setIsOpen(false)
      }, 5000)
      
      return () => clearTimeout(closeTimer)
    }
  }, [customMessage])
  
  // Always update position when initialPosition changes (for locked position)
  useEffect(() => {
    if (lockPosition && initialPosition && !useFixedPosition) {
      setPosition(initialPosition);
    }
  }, [lockPosition, initialPosition, useFixedPosition]);
  
  // Add resize event listener to reposition when window is resized - not needed with fixed positioning
  useEffect(() => {
    if (lockPosition && !useFixedPosition) {
      const handleResize = () => {
        if (typeof window !== 'undefined') {
          const rightOffset = 20;
          const bottomOffset = 20;
          setPosition({ 
            x: window.innerWidth - 80 - rightOffset, 
            y: window.innerHeight - 80 - bottomOffset 
          });
        }
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [lockPosition, useFixedPosition]);
  
  // Click handler for EduGuide
  const handleClick = () => {
    setHasInteracted(true)
    if (isOpen) {
      setIsOpen(false)
    } else {
      const possibleStates: (keyof typeof EDUGUIDE_STATES)[] = ['GREETING', 'ADVICE', 'HAPPY']
      const randomState = possibleStates[Math.floor(Math.random() * possibleStates.length)]
      setState(randomState)
      setMessage(getRandomMessage(randomState))
      setIsOpen(true)
    }
  }
  
  // Hover handlers
  const handleMouseEnter = () => {
    if (!isOpen) {
      setState('GREETING')
      setMessage("Click me for tips!")
      setIsOpen(true)
    }
  }
  
  const handleMouseLeave = () => {
    if (isOpen) {
      setIsOpen(false)
      setState('IDLE')
    }
  }

  return (
    <div 
      ref={eduguideRef}
      className="fixed z-50 select-none"
      style={
        useFixedPosition 
          ? { 
              bottom: '24px', 
              right: '24px',
              position: 'fixed'
            } 
          : { 
              top: position.y,
              left: position.x
            }
      }
    >
      {/* Message Bubble - positioned above for bottom-right corner placement */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={bubbleControls}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute bottom-[65px] min-w-[250px] max-w-[90vw] md:max-w-[320px] right-0 transform translate-x-0 bg-white rounded-xl p-3 shadow-lg border-2 border-blue-300"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-blue-600 text-sm">EduGuide</h4>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm">{message}</p>
            <div className="absolute -bottom-2 right-6 transform translate-x-0 w-4 h-4 bg-white border-b-2 border-r-2 border-blue-300 rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* EduGuide Character - No drag functionality */}
      <motion.div
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        animate={characterControls}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-16 h-16"
      >
        <div className="relative w-full h-full cursor-pointer">
          <Image 
            src={EDUGUIDE_STATES[state].image}
            alt="EduGuide"
            fill
            style={{ objectFit: 'contain' }}
            priority
            draggable={false}
            className="drop-shadow-lg"
          />
        </div>
        
        {/* Mute/Unmute button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsMuted(!isMuted)
          }}
          className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-md z-10"
        >
          {isMuted ? (
            <VolumeX className="h-3 w-3 text-gray-500" />
          ) : (
            <Volume2 className="h-3 w-3 text-blue-500" />
          )}
        </button>
        
        {/* Chat bubble indicator when closed */}
        <div 
          className={`absolute -top-2 -left-2 p-1 bg-blue-500 rounded-full shadow-md transition-opacity duration-300 z-10 ${isOpen ? 'opacity-0' : 'opacity-100'}`}
          onClick={(e) => {
            e.stopPropagation()
            handleClick()
          }}
        >
          <MessageSquare className="h-3 w-3 text-white" />
        </div>
      </motion.div>
    </div>
  )
} 