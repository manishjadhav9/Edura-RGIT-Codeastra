"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import EduGuide from './EduGuide'

// Define the context type
interface EduGuideContextType {
  updateState: (state: string) => void;
  updatePosition: (position: { x: number; y: number }) => void;
  triggerMessage: (message: string, stateOverride?: string) => void;
  currentState: string;
  currentPosition: { x: number; y: number };
  instanceId: string;
  useFixedPosition: boolean;
}

// Create a unique instance ID for this session
const EDUGUIDE_INSTANCE_ID = typeof window !== 'undefined' 
  ? localStorage.getItem('eduguide-instance-id') || `eduguide-${Date.now()}`
  : `eduguide-${Date.now()}`;

// Store instance ID in localStorage
if (typeof window !== 'undefined') {
  localStorage.setItem('eduguide-instance-id', EDUGUIDE_INSTANCE_ID);
  // Clear any previously saved position since we're locking it
  localStorage.removeItem('eduguide-position');
}

// Create context with default values
export const EduGuideContext = createContext<EduGuideContextType>({
  updateState: () => {},
  updatePosition: () => {},
  triggerMessage: () => {},
  currentState: 'IDLE',
  currentPosition: { x: 0, y: 0 },
  instanceId: EDUGUIDE_INSTANCE_ID,
  useFixedPosition: true,
});

// Hook to use the EduGuide context
export const useEduGuide = () => useContext(EduGuideContext);

interface EduraLayoutProviderProps {
  children: React.ReactNode
}

export default function EduraLayoutProvider({ children }: EduraLayoutProviderProps) {
  const [eduGuideState, setEduGuideState] = useState('IDLE');
  // Use a dummy position, we'll use fixed positioning with CSS
  const [eduGuidePosition] = useState({ x: 0, y: 0 });
  const [eduGuideMessage, setEduGuideMessage] = useState('');
  const [triggerUpdate, setTriggerUpdate] = useState(0);
  const pathname = usePathname();

  // Set EduGuide state based on current page
  useEffect(() => {
    // Set page-specific states
    if (pathname.includes('/profile')) {
      setEduGuideState('ADVICE');
    } else if (pathname.includes('/dashboard')) {
      setEduGuideState('HAPPY');
    } else if (pathname.includes('/courses')) {
      setEduGuideState('GREETING');
    } else if (pathname.includes('/story-mode')) {
      setEduGuideState('HAPPY');
    } else {
      // Default state for other pages
      setEduGuideState('IDLE');
    }
  }, [pathname]);

  const contextValue = {
    updateState: (state: string) => {
      setEduGuideState(state);
      setTriggerUpdate(prev => prev + 1);
    },
    updatePosition: () => {
      // Position is locked with fixed positioning
    },
    triggerMessage: (message: string, stateOverride?: string) => {
      setEduGuideMessage(message);
      if (stateOverride) {
        setEduGuideState(stateOverride);
      }
      setTriggerUpdate(prev => prev + 1);
    },
    currentState: eduGuideState,
    currentPosition: eduGuidePosition,
    instanceId: EDUGUIDE_INSTANCE_ID,
    useFixedPosition: true,
  };

  return (
    <EduGuideContext.Provider value={contextValue}>
      {children}
      <EduGuide 
        initialState={eduGuideState as any}  
        initialPosition={eduGuidePosition}
        key={EDUGUIDE_INSTANCE_ID}
        customMessage={eduGuideMessage}
        lockPosition={true}
        useFixedPosition={true}
      />
    </EduGuideContext.Provider>
  )
} 