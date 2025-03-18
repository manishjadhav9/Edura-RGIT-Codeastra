"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { MonsterType } from './game-data'

interface GameMonsterProps {
  monster: MonsterType
  position: number
}

export default function GameMonster({ monster, position }: GameMonsterProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Create a simple idle animation effect
    const interval = setInterval(() => {
      setIsAnimating(prev => !prev)
    }, 1000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div 
      className={`absolute bottom-16 transition-transform duration-1000 ${isAnimating ? 'translate-y-1' : 'translate-y-0'}`}
      style={{ left: `${position}%` }}
    >
      <div className="relative w-36 h-40 overflow-hidden rounded-lg border-4 border-orange-600 shadow-lg bg-orange-50/30">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-orange-900/30 z-10"></div>
        <Image 
          src={monster.image}
          alt={monster.name}
          fill
          style={{ 
            objectFit: 'contain',
            objectPosition: 'center'
          }}
          priority
          className="transition-transform hover:scale-110 duration-700 p-2"
        />
      </div>
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-orange-700 text-white px-3 py-1 rounded-lg text-sm font-bold whitespace-nowrap shadow-md border border-orange-500">
        {monster.name}
      </div>
    </div>
  )
} 