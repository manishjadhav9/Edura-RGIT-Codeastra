"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import GameCharacter from './GameCharacter'
import GameMonster from './GameMonster'
import DialogBox from './DialogBox'
import GameWorld from './GameWorld'
import SQLQueryInput from './SQLQueryInput'
import { SQLMonsters, MonsterType } from './game-data'
import { updateSQLGameProgress, awardXP, skillRewards } from '../sql-game-integration'
import { monsterImages, characterImages, uiImages } from './game-images'

export interface GameState {
  level: number
  character: {
    position: number
    health: number
    powers: string[]
    experience: number
  }
  currentMonster: MonsterType | null
  showDialog: boolean
  dialogText: string[]
  dialogSpeaker: 'character' | 'monster' | 'narrator'
  showQuery: boolean
  gameCompleted: boolean
  showVictory: boolean
}

export default function GameEngine() {
  const router = useRouter()
  const [gameState, setGameState] = useState<GameState>({
    level: 1,
    character: {
      position: 10,
      health: 100,
      powers: ['Basic SQL'],
      experience: 0
    },
    currentMonster: null,
    showDialog: true,
    dialogText: ['Welcome to SQL Jungle Adventure!', 'You must escape by mastering SQL concepts and defeating the database monsters ahead.'],
    dialogSpeaker: 'narrator',
    showQuery: false,
    gameCompleted: false,
    showVictory: false
  })
  const gameContainerRef = useRef<HTMLDivElement>(null)
  
  // Load saved game state if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('sql-game-state')
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState)
          setGameState(parsedState)
        } catch (e) {
          console.error('Failed to parse saved game state:', e)
        }
      }
    }
  }, [])
  
  // Save game state whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sql-game-state', JSON.stringify(gameState))
    }
  }, [gameState])

  useEffect(() => {
    if (gameState.level <= SQLMonsters.length && !gameState.currentMonster) {
      // Set the current monster when level changes and no monster is present
      setTimeout(() => {
        const monster = SQLMonsters[gameState.level - 1]
        setGameState(prev => ({
          ...prev,
          currentMonster: monster,
          showDialog: true,
          dialogText: [monster.greeting],
          dialogSpeaker: 'monster'
        }))
      }, 1000)
    }
  }, [gameState.level, gameState.currentMonster])

  const moveCharacter = (direction: 'left' | 'right') => {
    if (gameState.showDialog || gameState.showQuery) return

    setGameState(prev => {
      const newPosition = direction === 'right' 
        ? Math.min(prev.character.position + 10, 80) 
        : Math.max(prev.character.position - 10, 0)
      
      // If character moves to position 80, trigger monster encounter
      const shouldShowMonster = newPosition >= 80 && !prev.currentMonster

      return {
        ...prev,
        character: {
          ...prev.character,
          position: newPosition
        },
        showDialog: shouldShowMonster,
        dialogText: shouldShowMonster ? ['A wild database monster appears!'] : prev.dialogText,
        dialogSpeaker: shouldShowMonster ? 'narrator' : prev.dialogSpeaker
      }
    })
  }

  const handleDialogComplete = () => {
    setGameState(prev => ({
      ...prev,
      showDialog: false,
      showQuery: prev.currentMonster !== null
    }))
  }

  const handleQuerySubmit = (query: string, isCorrect: boolean) => {
    if (!gameState.currentMonster) return

    if (isCorrect) {
      // Calculate XP earned for this level
      const xpEarned = awardXP(gameState.level)
      
      // Get the skill for this level
      const newSkill = gameState.currentMonster.skill
      
      // Handle successful query
      setGameState(prev => ({
        ...prev,
        showQuery: false,
        showDialog: true,
        dialogText: [
          `Great job! Your ${query} query was effective!`,
          gameState.currentMonster?.defeatMessage || 'You defeated the monster!',
          `You gained a new SQL power: ${newSkill}!`,
          `You earned ${xpEarned} XP!`
        ],
        dialogSpeaker: 'narrator',
        character: {
          ...prev.character,
          health: Math.min(prev.character.health + 10, 100),
          powers: [...prev.character.powers, newSkill],
          experience: prev.character.experience + xpEarned
        }
      }))

      // Update game progress in the story mode system
      updateSQLGameProgress({
        levelsCompleted: gameState.level,
        conceptsLearned: [...(gameState.currentMonster ? [gameState.currentMonster.concept] : [])],
        skillsUnlocked: [...(newSkill ? [newSkill] : [])],
        xpEarned: xpEarned
      })

      // Move to next level after dialog
      setTimeout(() => {
        const nextLevel = gameState.level + 1
        
        if (nextLevel > SQLMonsters.length) {
          // Game completed
          setGameState(prev => ({
            ...prev,
            currentMonster: null,
            gameCompleted: true,
            showDialog: true,
            dialogText: [
              'Congratulations! You have mastered SQL and escaped the jungle!',
              'You have defeated all database monsters and learned all SQL concepts.',
              `Total XP earned: ${prev.character.experience}`
            ],
            dialogSpeaker: 'narrator',
            showVictory: true
          }))
          
          // Update final game completion status
          updateSQLGameProgress({
            levelsCompleted: SQLMonsters.length,
            completionStatus: 'completed'
          })
        } else {
          // Next level
          setGameState(prev => ({
            ...prev,
            level: nextLevel,
            currentMonster: null,
            character: {
              ...prev.character,
              position: 10
            }
          }))
        }
      }, 3000)
    } else {
      // Handle failed query
      setGameState(prev => ({
        ...prev,
        showQuery: false,
        showDialog: true,
        dialogText: [
          'Your query was incorrect!',
          'The monster is still strong. Try a different approach.'
        ],
        dialogSpeaker: 'narrator',
        character: {
          ...prev.character,
          health: Math.max(prev.character.health - 10, 5)
        }
      }))

      // Show query interface again after dialog
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          showDialog: false,
          showQuery: true
        }))
      }, 3000)
    }
  }

  const handleVictoryComplete = () => {
    // Navigate back to story mode or to next chapter
    router.push('/story-mode')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      moveCharacter('left')
    } else if (e.key === 'ArrowRight') {
      moveCharacter('right')
    }
  }

  // Reset game state button for testing
  const handleResetGame = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sql-game-state')
      localStorage.removeItem('sql-game-progress')
      setGameState({
        level: 1,
        character: {
          position: 10,
          health: 100,
          powers: ['Basic SQL'],
          experience: 0
        },
        currentMonster: null,
        showDialog: true,
        dialogText: ['Welcome to SQL Jungle Adventure!', 'You must escape by mastering SQL concepts and defeating the database monsters ahead.'],
        dialogSpeaker: 'narrator',
        showQuery: false,
        gameCompleted: false,
        showVictory: false
      })
    }
  }

  return (
    <div className="flex flex-col">
      {/* Game Screen - 2D Mario-style */}
      <div 
        ref={gameContainerRef}
        className="w-full h-[500px] bg-blue-50 relative overflow-hidden border-4 border-blue-900 rounded-t-lg focus:outline-none"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {/* Game World with parallax backgrounds */}
        <GameWorld level={gameState.level} />
        
        {/* Level indicator bar at top */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-r from-blue-900 to-blue-700 flex items-center justify-between px-4 text-white z-40 border-b-2 border-blue-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Image src={characterImages.idle} width={20} height={20} alt="Level" className="rounded-full border border-yellow-400" />
              <span className="text-sm font-pixel">Level {gameState.level}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 to-red-300" 
                  style={{ width: `${gameState.character.health}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-yellow-400/80 text-xs px-2 py-0.5 rounded-full text-blue-900 font-bold">
              XP: {gameState.character.experience}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleResetGame}
              className="bg-red-600 text-white hover:bg-red-700 text-xs h-6 px-2 py-0"
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Powers display */}
        <div className="absolute top-10 right-2 bg-black/40 text-white p-2 rounded z-10 max-w-32">
          <div className="text-xs font-bold mb-1">Powers:</div>
          <ul className="text-xs max-h-24 overflow-y-auto">
            {gameState.character.powers.map((power, index) => (
              <li key={index} className="mb-0.5 flex items-center gap-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                {power}
              </li>
            ))}
          </ul>
        </div>

        {/* Game Character */}
        <GameCharacter 
          position={gameState.character.position} 
          health={gameState.character.health}
        />
        
        {/* Game Monster when present */}
        {gameState.currentMonster && (
          <div className="monster-appearance-animation">
            <GameMonster monster={gameState.currentMonster} position={85} />
          </div>
        )}

        {/* Dialog Box */}
        {gameState.showDialog && (
          <DialogBox
            text={gameState.dialogText}
            speaker={gameState.dialogSpeaker}
            speakerName={gameState.dialogSpeaker === 'monster' ? gameState.currentMonster?.name : 'EduGuide'}
            onComplete={handleDialogComplete}
          />
        )}

        {/* Movement controls when no dialog or query is shown */}
        {!gameState.showDialog && !gameState.showQuery && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
            <Button 
              onClick={() => moveCharacter('left')}
              className="adventure-button rounded-full w-14 h-14 p-0 text-2xl"
            >
              ←
            </Button>
            <Button 
              onClick={() => moveCharacter('right')}
              className="adventure-button rounded-full w-14 h-14 p-0 text-2xl"
            >
              →
            </Button>
          </div>
        )}

        {/* Victory overlay */}
        {gameState.showVictory && (
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/80 to-amber-800/80 flex flex-col items-center justify-center text-white p-8 z-50">
            <h1 className="text-4xl font-bold mb-6 text-yellow-100">Victory!</h1>
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-600/30 rounded-full filter blur-xl"></div>
              <Image 
                src={characterImages.victory} 
                alt="Victory" 
                width={200} 
                height={200}
                className="relative z-10"
              />
            </div>
            <p className="text-xl mb-8 text-center text-yellow-100 max-w-lg">
              Congratulations! You've mastered SQL and escaped the jungle. 
              You've learned all the key SQL concepts and are now a database champion!
            </p>
            <Button onClick={handleVictoryComplete} className="bg-yellow-500 hover:bg-yellow-600 text-amber-900 border-2 border-amber-900 font-bold shadow-lg">
              Return to Story Mode
            </Button>
          </div>
        )}
      </div>
      
      {/* SQL Query Input Section Below the Game */}
      {gameState.showQuery && gameState.currentMonster && (
        <div className="w-full bg-gray-100 border-4 border-t-0 border-blue-900 rounded-b-lg p-4">
          <SQLQueryInput 
            monster={gameState.currentMonster}
            onSubmit={handleQuerySubmit}
          />
        </div>
      )}
    </div>
  )
} 