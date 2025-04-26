"use client"

import { useState } from "react"
import { format, parseISO, isSameMonth, isSameDay } from "date-fns"
import { Calendar, BarChart2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { HabitStreakModal } from "./Habit-Streak-modal"

interface HabitStreakCardProps {
  habitName: string
  streak: number
  longestStreak: number
  checkInDates: string[]
}

export function HabitStreakCard({ habitName, streak, longestStreak, checkInDates }: HabitStreakCardProps) {
  const [showModal, setShowModal] = useState(false)
  
  // Get current month check-ins for mini visualization
  const today = new Date()
  const currentMonthCheckIns = checkInDates.filter(date => {
    try {
      const parsedDate = parseISO(date)
      return isSameMonth(parsedDate, today)
    } catch (e) {
      return false
    }
  })
  
  // Create a mini calendar for the current month
  const daysInCurrentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const miniCalendarDays = Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1)
  
  // Check if a day has a check-in
  const hasCheckIn = (day: number) => {
    const dateToCheck = new Date(today.getFullYear(), today.getMonth(), day)
    return currentMonthCheckIns.some(date => {
      try {
        return isSameDay(parseISO(date), dateToCheck)
      } catch (e) {
        return false
      }
    })
  }
  
  // Calculate completion rate for current month
  const completionRate = daysInCurrentMonth > 0 
    ? Math.round((currentMonthCheckIns.length / daysInCurrentMonth) * 100) 
    : 0

  return (
    <>
      <div className="bg-white rounded-lg border border-teal-200 shadow-sm hover:shadow-md transition-all p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-medium text-teal-800">{habitName}</h3>
          <div className="flex items-center gap-2 text-xs text-teal-600">
            <span className="font-semibold">{streak} day streak</span>
            <span className="text-gray-400">|</span>
            <span>Best: {longestStreak}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-teal-500" />
            <span className="text-xs text-teal-700">{format(today, 'MMMM yyyy')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BarChart2 className="h-4 w-4 text-teal-500" />
            <span className="text-xs text-teal-700">{completionRate}% complete</span>
          </div>
        </div>
        
        {/* Mini calendar visualization */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {miniCalendarDays.map(day => (
            <div 
              key={day}
              className={`
                h-2 w-full rounded-sm
                ${hasCheckIn(day) 
                  ? 'bg-teal-500' 
                  : 'bg-gray-100'}
              `}
            />
          ))}
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-xs border-teal-200 text-teal-700 hover:bg-teal-50"
          onClick={() => setShowModal(true)}
        >
          View Full Calendar
        </Button>
      </div>
      
      {showModal && (
        <HabitStreakModal 
          habitName={habitName}
          checkInDates={checkInDates}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
