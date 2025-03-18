"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { MonsterType } from './game-data'
import Image from 'next/image'

interface SQLQueryInputProps {
  monster: MonsterType
  onSubmit: (query: string, isCorrect: boolean) => void
}

export default function SQLQueryInput({ monster, onSubmit }: SQLQueryInputProps) {
  const [query, setQuery] = useState('')
  const [selectedOption, setSelectedOption] = useState('')
  const [error, setError] = useState('')

  const handleQuerySubmit = () => {
    if (!query.trim()) {
      setError('Please enter a SQL query')
      return
    }

    // Check if the query is correct by simple string matching
    // In a real implementation, this would involve more sophisticated validation
    const isCorrect = monster.correctQueries.some(
      correctQuery => query.toLowerCase().includes(correctQuery.toLowerCase())
    )

    onSubmit(query, isCorrect)
  }

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option)
  }

  const handleOptionSubmit = () => {
    if (!selectedOption) {
      setError('Please select an option')
      return
    }

    const isCorrect = selectedOption === monster.correctOption
    onSubmit(selectedOption, isCorrect)
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between bg-blue-900 text-white px-4 py-2 rounded-t-md">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-blue-300">
            <Image 
              src={monster.image}
              alt={monster.name}
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div>
            <h3 className="font-bold text-lg">{monster.name} Challenge</h3>
            <p className="text-sm text-blue-200">{monster.concept}</p>
          </div>
        </div>
        <div className="bg-yellow-400/80 text-xs px-2 py-1 rounded-full text-blue-900 font-bold">
          Skill: {monster.skill}
        </div>
      </div>
      
      <div className="bg-white p-4 shadow-md rounded-b-md">
        <div className="mb-4">
          <div className="flex items-center mb-3">
            <div className="bg-blue-100 p-2 rounded-md border-l-4 border-blue-500 flex-1">
              <div className="font-medium">{monster.challenge}</div>
              <div className="text-sm font-medium mt-1">Task: {monster.task}</div>
            </div>
          </div>
          
          {monster.hint && (
            <div className="bg-yellow-50 p-2 border-l-4 border-yellow-400 mb-4 text-sm">
              <span className="font-semibold">💡 Hint:</span> {monster.hint}
            </div>
          )}
        </div>
        
        {monster.challengeType === 'query' ? (
          <div className="space-y-3">
            <Textarea
              placeholder="Enter your SQL query here..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-h-[120px] font-mono text-sm border-2 border-blue-200 focus:border-blue-400"
            />
            
            {error && <div className="text-red-500 text-sm">{error}</div>}
          </div>
        ) : (
          <div className="space-y-3">
            <RadioGroup 
              value={selectedOption} 
              onValueChange={handleOptionSelect}
              className="space-y-2"
            >
              {monster.options?.map((option, index) => (
                <div 
                  key={index} 
                  className={`flex items-start space-x-2 border-2 p-3 rounded-md cursor-pointer ${
                    selectedOption === option 
                      ? 'bg-blue-50 border-blue-400' 
                      : 'hover:bg-gray-50 border-gray-200'
                  }`}
                  onClick={() => handleOptionSelect(option)}
                >
                  <RadioGroupItem value={option} id={`option-${index}`} className="mt-1" />
                  <Label 
                    htmlFor={`option-${index}`} 
                    className="font-mono text-sm flex-1 cursor-pointer"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            
            {error && <div className="text-red-500 text-sm">{error}</div>}
          </div>
        )}
        
        <div className="flex justify-end mt-6">
          <Button 
            onClick={monster.challengeType === 'query' ? handleQuerySubmit : handleOptionSubmit}
            className="bg-green-600 hover:bg-green-700 px-6"
          >
            Submit Answer
          </Button>
        </div>
      </div>
    </div>
  )
} 