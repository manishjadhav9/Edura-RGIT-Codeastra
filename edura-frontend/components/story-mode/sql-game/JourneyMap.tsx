"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { SQLMonsters } from './game-data'
import { useRouter } from 'next/navigation'
import { journeyImages, monsterImages, uiImages } from './game-images'
import { motion } from 'framer-motion'

interface JourneyMapProps {
  onStartGame: () => void
}

export default function JourneyMap({ onStartGame }: JourneyMapProps) {
  const [hoveredLevel, setHoveredLevel] = useState<number | null>(null)
  const [activeLevel, setActiveLevel] = useState<number | null>(null)
  const [showPathAnimation, setShowPathAnimation] = useState(false)
  const router = useRouter()

  // Play path drawing animation when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPathAnimation(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full bg-gradient-to-br from-blue-100 to-green-100 p-6 rounded-xl border-4 border-blue-900 relative overflow-hidden shadow-xl transition-all duration-300">
      <div className="absolute inset-0 bg-green-900/5"></div>
      
      {/* Map title with animated effect */}
      <motion.div 
        className="text-center mb-8 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-3xl font-extrabold text-blue-900 inline-block px-8 py-2 bg-white/90 rounded-lg shadow-lg border-2 border-blue-500">
          SQL Jungle Adventure Map
        </h2>
        <p className="text-lg text-blue-800 mt-2 max-w-2xl mx-auto bg-white/50 p-2 rounded-lg">
          Navigate through the treacherous jungle by defeating SQL monsters and unlocking new paths!
        </p>
      </motion.div>

      {/* Interactive Map with path and monsters */}
      <div className="relative h-[600px] w-full p-4 rounded-xl overflow-hidden shadow-inner border-2 border-blue-800">
        {/* Jungle background */}
        <div className="absolute inset-0 z-0">
          <Image 
            src={journeyImages.mapBackground}
            alt="Jungle Map Background"
            fill
            style={{ objectFit: 'cover', opacity: 0.9 }}
            priority
          />
          <div className="absolute inset-0 bg-blue-900/20"></div>
        </div>

        {/* Animated path through the jungle */}
        <div className="absolute h-[70%] w-[90%] top-[15%] left-[5%] z-10">
          <svg className="w-full h-full" viewBox="0 0 1000 300">
            {/* Path texture/pattern */}
            <defs>
              <pattern id="pathPattern" patternUnits="userSpaceOnUse" width="100" height="100">
                <image 
                  href={journeyImages.pathTexture} 
                  x="0" y="0" 
                  width="100" height="100"
                  style={{ opacity: 0.3 }}
                />
              </pattern>
            </defs>
            
            {/* Main path with animated drawing effect */}
            <motion.path 
              d="M50,150 C150,50 250,250 350,150 C450,50 550,250 650,150 C750,50 850,250 950,150" 
              stroke="#8B4513" 
              strokeWidth="30" 
              fill="url(#pathPattern)"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: showPathAnimation ? 1 : 0 }}
              transition={{ duration: 3, ease: "easeInOut" }}
            />

            {/* Path decoration */}
            <motion.path 
              d="M50,150 C150,50 250,250 350,150 C450,50 550,250 650,150 C750,50 850,250 950,150" 
              stroke="rgba(194, 138, 86, 0.6)" 
              strokeWidth="34" 
              fill="none"
              strokeLinecap="round"
              strokeDasharray="1,30"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: showPathAnimation ? 1 : 0 }}
              transition={{ duration: 3, ease: "easeInOut", delay: 0.2 }}
            />
          </svg>
        </div>

        {/* Character start position with animation */}
        <motion.div 
          className="absolute bottom-[45%] left-[5%] z-20"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, duration: 0.5, type: "spring" }}
        >
          <motion.div 
            className="relative w-20 h-20"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Image 
              src="/sql-game/eduguide/eduguide-ready-for-quest.png"
              alt="EduGuide Character"
              fill
              style={{ objectFit: 'contain' }}
            />
          </motion.div>
          <div className="text-xs font-bold bg-white/90 px-3 py-1 rounded-md text-center mt-1 shadow-md border border-green-500">
            START HERE
          </div>
        </motion.div>

        {/* Monsters along the path with staggered appearance */}
        {SQLMonsters.map((monster, index) => {
          // Calculate position along the curved path
          const xPos = 5 + (index + 1) * (90 / (SQLMonsters.length + 1));
          const yPos = index % 2 === 0 ? 35 : 65;
          
          // Set stage completion status (for future use with saved progress)
          const isCompleted = false;
          const isActive = activeLevel === monster.id;
          const isHovered = hoveredLevel === monster.id;

          return (
            <motion.div 
              key={monster.id}
              className={`absolute z-20 cursor-pointer ${isActive || isHovered ? 'z-30' : ''}`}
              style={{ 
                left: `${xPos}%`, 
                top: `${yPos}%` 
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1, 
                scale: isActive || isHovered ? 1.1 : 1,
                y: isActive || isHovered ? -5 : 0
              }}
              transition={{ 
                delay: 1 + (index * 0.15),
                duration: 0.5,
                scale: { duration: 0.2 }
              }}
              onMouseEnter={() => setHoveredLevel(monster.id)}
              onMouseLeave={() => setHoveredLevel(null)}
              onClick={() => setActiveLevel(monster.id === activeLevel ? null : monster.id)}
            >
              {/* Level marker with monster image */}
              <div className={`relative w-20 h-20 rounded-full overflow-hidden border-4 ${isActive || isHovered ? 'border-yellow-500 shadow-lg shadow-yellow-300/50' : 'border-orange-600'} transition-all duration-300`}>
                <Image 
                  src={monster.image}
                  alt={monster.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  className={`transition-all duration-300 ${isCompleted ? 'grayscale-0' : 'grayscale-[30%]'} ${isActive || isHovered ? 'grayscale-0 scale-110' : ''}`}
                />
                
                {/* Level number badge */}
                <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-white font-bold text-sm">
                  {monster.id}
                </div>
              </div>
              
              {/* Monster name label */}
              <div className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded text-xs font-bold whitespace-nowrap shadow-md border w-max text-center transition-all duration-300 ${isActive || isHovered ? 'bg-yellow-100 border-yellow-500 scale-110' : 'bg-white/90 border-orange-500'}`}>
                {monster.name}
                <div className="text-[10px] font-normal text-gray-700">Lv.{monster.id}: {monster.concept}</div>
              </div>

              {/* Info popup on hover or active */}
              {(isHovered || isActive) && (
                <motion.div 
                  className="absolute -right-4 top-0 transform translate-x-full bg-white/95 p-4 rounded-lg shadow-xl border-2 border-blue-500 w-72 z-40"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="font-bold text-lg text-blue-900 border-b border-blue-200 pb-2 mb-2">{monster.name}</h3>
                  <div className="flex gap-3 mb-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-blue-300 flex-shrink-0">
                      <Image 
                        src={monster.image}
                        alt={monster.name}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div>
                      <p className="text-sm text-blue-800 font-medium">{monster.concept}</p>
                      <p className="text-xs text-gray-500 italic mt-1">Skill: {monster.skill}</p>
                    </div>
                  </div>
                  <p className="text-xs mt-2 text-gray-700 bg-blue-50 p-2 rounded border border-blue-100">{monster.challenge}</p>
                  <div className="mt-3 text-xs flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <span className="text-blue-800 font-medium">Required SQL Knowledge</span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}

        {/* Final destination - Freedom Gate */}
        <motion.div 
          className="absolute top-[50%] right-[5%] z-20"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 3, duration: 0.7, type: "spring" }}
        >
          <motion.div 
            className="relative w-24 h-24"
            animate={{ 
              boxShadow: ["0px 0px 8px 2px rgba(255,215,0,0.3)", "0px 0px 16px 4px rgba(255,215,0,0.6)", "0px 0px 8px 2px rgba(255,215,0,0.3)"]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Image 
              src={journeyImages.finishPoint}
              alt="Freedom Gate"
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-lg border-4 border-yellow-500"
            />
          </motion.div>
          <div className="text-center mt-2">
            <span className="text-sm font-bold bg-yellow-400/90 px-3 py-1 rounded-lg shadow-md border border-yellow-600">
              FREEDOM!
            </span>
          </div>
        </motion.div>
        
        {/* Trail markers - decorative elements */}
        {[1, 2, 3, 4, 5].map((num) => (
          <motion.div 
            key={`marker-${num}`}
            className="absolute z-10"
            style={{ 
              left: `${15 + (num * 15)}%`, 
              top: `${70 + (num % 3) * 10}%`,
              opacity: 0.7
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.7, y: 0 }}
            transition={{ delay: 2 + (num * 0.1) }}
          >
            <div className="relative w-6 h-6">
              <Image
                src={uiImages.achievementBadge}
                alt="Trail marker"
                fill
                style={{ objectFit: 'contain' }}
                className="opacity-40"
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Start journey button */}
      <motion.div 
        className="text-center mt-6 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.2, duration: 0.5 }}
      >
        <p className="text-blue-800 mb-4 font-medium italic bg-white/70 inline-block px-4 py-2 rounded-lg shadow">
          Are you ready to start your adventure and master SQL to escape the jungle?
        </p>
        <Button 
          onClick={onStartGame} 
          size="lg"
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg shadow-lg border-2 border-green-800 transition-all hover:scale-105 rounded-xl"
        >
          <span className="mr-2">🚀</span> Begin Your Journey!
        </Button>
      </motion.div>

      {/* Map Legend with animated appearance */}
      <motion.div 
        className="absolute bottom-4 left-4 bg-white/90 p-3 rounded-lg text-xs shadow-lg border border-blue-300 z-20"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 3.5, duration: 0.5 }}
      >
        <h4 className="font-bold text-blue-900 mb-2 border-b border-blue-200 pb-1">Map Legend:</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-blue-800">Start Point</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-blue-800">SQL Monsters</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-blue-800">Freedom Gate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-blue-800">Adventure Path</span>
          </div>
        </div>
      </motion.div>
      
      {/* Progress indicator - for future implementation */}
      <motion.div 
        className="absolute top-4 right-4 bg-white/90 py-2 px-3 rounded-lg text-xs shadow-lg border border-blue-300 z-20"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 3.5, duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <span className="font-bold text-blue-900">Progress:</span>
          <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{ width: `0%` }}></div>
          </div>
          <span className="text-blue-800 font-medium">0/13</span>
        </div>
      </motion.div>
    </div>
  )
} 