import { CalendarDays, CheckCircle2, Clock, Target } from "lucide-react"

interface HabitStreakCardProps {
  habitName: string
  streak: number
  last7CheckInCount: number
  checkInDates?: string[]
  quote?: string
  frequency?: string
  duration?: number
  goal?: string
  onViewCalendar: () => void
}

export function HabitStreakCard({
  habitName,
  streak,
  last7CheckInCount,
  checkInDates = [],
  quote,
  frequency,
  duration,
  goal,
  onViewCalendar,
}: HabitStreakCardProps) {
  
  const today = new Date().toISOString().split("T")[0]
  const isCheckedInToday = checkInDates.includes(today)

  // Format frequency for display
  const formatFrequency = (freq?: string) => {
    if (!freq) return "Daily"
    return freq.charAt(0).toUpperCase() + freq.slice(1)
  }

  return (
    <div
      className={`p-5 rounded-xl border ${
        isCheckedInToday ? "border-[#58a6ff] bg-[#1f2937]" : "border-[#30363d] bg-[#161b22]"
      } hover:border-[#58a6ff] transition-all duration-300 h-full flex flex-col`}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-[#c9d1d9] line-clamp-1">{habitName}</h3>
        <div
          className={`px-2 py-1 rounded-md text-xs font-medium ${
            isCheckedInToday ? "bg-[#58a6ff] text-[#0d1117]" : "bg-[#1f2937] text-[#8b949e]"
          }`}
        >
          {isCheckedInToday ? "Completed Today" : "Not Completed"}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-[#0d1117] p-3 rounded-lg">
          <div className="text-[#8b949e] text-xs mb-1 flex items-center">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Current Streak
          </div>
          <div className="text-xl font-bold text-[#c9d1d9]">{streak} days</div>
        </div>
        <div className="bg-[#0d1117] p-3 rounded-lg">
          <div className="text-[#8b949e] text-xs mb-1 flex items-center">
            <CalendarDays className="w-3 h-3 mr-1" />
            Last 7 Days
          </div>
          <div className="text-xl font-bold text-[#c9d1d9]">{last7CheckInCount} days</div>
        </div>
      </div>

      {goal && (
        <div className="bg-[#0d1117] p-3 rounded-lg mb-4">
          <div className="text-[#8b949e] text-xs mb-1 flex items-center">
            <Target className="w-3 h-3 mr-1" />
            Goal
          </div>
          <div className="text-sm text-[#c9d1d9]">{goal}</div>
        </div>
      )}

      <div className="flex items-center text-xs text-[#8b949e] mt-auto">
        <div className="flex items-center mr-4">
          <Clock className="w-3 h-3 mr-1" />
          {formatFrequency(frequency)}
        </div>
        {duration && (
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {duration} {duration === 1 ? "hour" : "hours"}
          </div>
        )}
      </div>

      {quote && <div className="mt-3 pt-3 border-t border-[#30363d] text-xs italic text-[#8b949e]">"{quote}"</div>}

      <button onClick={onViewCalendar} className="mt-3 text-xs text-[#58a6ff] hover:underline self-end">
        View Calendar
      </button>
    </div>
  )
}
