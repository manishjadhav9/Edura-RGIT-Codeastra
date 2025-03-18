"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { worldImages } from './game-images'

interface GameWorldProps {
  level: number
}

export default function GameWorld({ level }: GameWorldProps) {
  // Different backgrounds for different levels using Unsplash images
  const getBackgroundImage = () => {
    // Different jungle-themed backgrounds for different game phases
    switch (true) {
      case level <= 3:
        // Beginning of the jungle - lighter, more open jungle
        return worldImages.earlyJungle
      case level <= 6:
        // Middle of the jungle - more dense vegetation
        return worldImages.midJungle
      case level <= 9:
        // Deep jungle - darker, more mysterious
        return worldImages.deepJungle
      case level <= 12:
        // Ancient ruins in jungle
        return worldImages.ancientRuins
      case level === 13:
        // Dragon's lair - dramatic setting for final boss
        return worldImages.dragonLair
      default:
        return worldImages.earlyJungle
    }
  }

  // Get mid-layer and foreground layer images based on level
  const getMidLayerImage = () => {
    // Different mid-layer images for different level ranges
    if (level <= 3) {
      return "https://images.unsplash.com/photo-1600273970168-c3de7cc8ce44?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
    } else if (level <= 6) {
      return "https://images.unsplash.com/photo-1600241692536-152d283b1af9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
    } else if (level <= 9) {
      return "https://images.unsplash.com/photo-1512618831669-1f7da81b9478?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
    } else if (level <= 12) {
      return "https://images.unsplash.com/photo-1621368286550-f54551f39b91?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
    } else {
      return "https://images.unsplash.com/photo-1508596374429-f515218fc6e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
    }
  }
  
  // Visual effect properties based on level
  const getLevelEffects = () => {
    if (level <= 3) {
      return {
        overlayColor: "bg-black/20",
        groundColor: "from-green-800 to-green-700",
        ambientLight: "0.9",
      }
    } else if (level <= 6) {
      return {
        overlayColor: "bg-black/30",
        groundColor: "from-green-900 to-green-800",
        ambientLight: "0.8",
      }
    } else if (level <= 9) {
      return {
        overlayColor: "bg-black/40",
        groundColor: "from-green-950 to-green-900",
        ambientLight: "0.7",
      }
    } else if (level <= 12) {
      return {
        overlayColor: "bg-blue-950/40",
        groundColor: "from-stone-800 to-stone-700",
        ambientLight: "0.6",
      }
    } else {
      return {
        overlayColor: "bg-red-950/30",
        groundColor: "from-stone-900 to-red-950",
        ambientLight: "0.5",
      }
    }
  }

  const effects = getLevelEffects()
  const [parallaxOffset, setParallaxOffset] = useState(0)
  
  // Create parallax effect for game world
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const moveX = (e.clientX / window.innerWidth - 0.5) * 20
      setParallaxOffset(moveX)
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <>
      {/* Far background layer - static */}
      <div className="absolute inset-0 z-0">
        <div className={`absolute inset-0 ${effects.overlayColor} z-10`}></div> {/* Overlay to darken and maintain consistent look */}
        <Image 
          src={getBackgroundImage()}
          alt="Jungle Background"
          fill
          style={{ objectFit: 'cover', opacity: effects.ambientLight }}
          priority
        />
      </div>
      
      {/* Mid background layer with parallax */}
      <div 
        className="absolute inset-0 z-1 transition-transform duration-200 ease-out"
        style={{ transform: `translateX(${parallaxOffset}px)` }}
      >
        <div className="absolute bottom-0 left-0 right-0 h-48 overflow-hidden">
          <Image
            src={getMidLayerImage()}
            alt="Jungle Mid Layer"
            fill
            style={{ 
              objectFit: 'cover', 
              objectPosition: 'bottom',
              opacity: 0.7
            }}
          />
        </div>
      </div>
      
      {/* Foreground layer with stronger parallax */}
      <div 
        className="absolute inset-0 z-2 pointer-events-none transition-transform duration-200 ease-out"
        style={{ transform: `translateX(${parallaxOffset * 2}px)` }}
      >
        <div className="absolute bottom-0 left-0 right-0 h-20">
          <div className={`w-full h-full bg-gradient-to-t ${effects.groundColor}/80 to-transparent`}></div>
        </div>
      </div>
      
      {/* Ground/platform */}
      <div className={`absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t ${effects.groundColor} z-3`} />
    </>
  )
} 