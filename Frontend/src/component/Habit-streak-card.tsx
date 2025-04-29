
import { useState } from "react"
import { parseISO, isSameDay, format, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from "date-fns"
import { Calendar } from "lucide-react"
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
  const today = new Date()

  // Get the current month for the mini calendar
  const currentMonth = {
    date: today,
    days: eachDayOfInterval({
      start: startOfMonth(today),
      end: endOfMonth(today),
    }),
  }

  // Parse the ISO date strings into Date objects for comparison
  const parsedCheckInDates = checkInDates
    .map((dateStr) => {
      try {
        return parseISO(dateStr)
      } catch (e) {
        return null
      }
    })
    .filter(Boolean) as Date[]

  const hasCheckIn = (date: Date): boolean => {
    return parsedCheckInDates.some((checkInDate) => checkInDate && isSameDay(checkInDate, date))
  }

  return (
    <>
      <div className="bg-[#0d1117] rounded-lg border border-[#30363d] shadow-sm hover:shadow-md transition-all p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1f2937] rounded-md flex items-center justify-center">
              <Calendar className="h-5 w-5 text-[#58a6ff]" />
            </div>
            <h3 className="font-medium text-[#c9d1d9]">{habitName}</h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#8b949e]">
            <span className="font-semibold">{streak} day streak</span>
            <span className="text-[#30363d]">|</span>
            <span>Best: {longestStreak}</span>
          </div>
        </div>

        {/* Mini calendar for current month */}
        <div className="mb-4 overflow-hidden">
          <div className="border border-[#30363d] rounded-lg p-2 bg-[#161b22]">
            <div className="text-xs text-[#8b949e] font-medium mb-1 text-center">
              {format(currentMonth.date, "MMMM yyyy")}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {/* Day labels */}
              {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                <div key={i} className="h-4 flex items-center justify-center text-[10px] text-[#8b949e]">
                  {day}
                </div>
              ))}

              {/* Empty cells for proper alignment */}
              {Array.from({ length: currentMonth.days[0].getDay() }).map((_, i) => (
                <div key={`empty-${i}`} className="h-4" />
              ))}

              {/* Days of the month */}
              {currentMonth.days.map((day) => {
                const isCurrentDay = isToday(day)
                const checkedIn = hasCheckIn(day)

                return (
                  <div
                    key={day.toString()}
                    className={`
                      h-4 w-4 rounded-sm flex items-center justify-center text-[9px]
                      ${isCurrentDay ? "ring-1 ring-[#58a6ff]" : ""}
                      ${
                        checkedIn
                          ? "bg-[#0e4429] border border-[#39d353] text-[#39d353]"
                          : "bg-[#161b22] border border-[#30363d] text-[#8b949e]"
                      }
                    `}
                  >
                    {day.getDate()}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs border-[#30363d] text-[#8b949e] hover:bg-[#1f2937] bg-transparent"
          onClick={() => setShowModal(true)}
        >
          View Full Calendar
        </Button>
      </div>

      {showModal && (
        <HabitStreakModal habitName={habitName} checkInDates={checkInDates} onClose={() => setShowModal(false)} />
      )}
    </>
  )
}
