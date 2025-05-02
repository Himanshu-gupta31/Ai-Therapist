"use client"

import { CalendarDays } from "lucide-react"

interface HabitStreakCardProps {
  habitName: string
  streak: number
  longestStreak: number
  checkInDates?: string[]
  quote?: string
  frequency?: string
  duration?: number
  onViewCalendar: () => void
}

export function HabitStreakCard({
  habitName,
  streak,
  longestStreak,
  checkInDates = [],
  quote,
  frequency = "daily",
  duration = 1,
  onViewCalendar,
}: HabitStreakCardProps) {
  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 hover:border-[#58a6ff] transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-[#c9d1d9]">{habitName}</h3>
        <div className="flex items-center">
          <span className="text-xs font-medium bg-[#1f2937] text-[#8b949e] px-2 py-1 rounded-full">{frequency}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-[#1f2937] rounded-lg p-3">
          <div className="text-[#8b949e] text-xs mb-1">Current Streak</div>
          <div className="text-[#c9d1d9] text-xl font-bold">{streak} days</div>
        </div>
        <div className="bg-[#1f2937] rounded-lg p-3">
          <div className="text-[#8b949e] text-xs mb-1">Longest Streak</div>
          <div className="text-[#c9d1d9] text-xl font-bold">{longestStreak} days</div>
        </div>
      </div>

      {quote && (
        <div className="bg-[#1f2937] rounded-lg p-3 mb-4">
          <div className="text-[#8b949e] text-xs mb-1">Motivation</div>
          <div className="text-[#c9d1d9] text-sm italic">"{quote}"</div>
        </div>
      )}

      <button
        onClick={onViewCalendar}
        className="w-full flex items-center justify-center gap-2 text-[#58a6ff] bg-[#1f2937] hover:bg-[#2d3748] py-2 rounded-md transition-colors text-sm"
      >
        <CalendarDays className="w-4 h-4" />
        View Calendar
      </button>
    </div>
  )
}
