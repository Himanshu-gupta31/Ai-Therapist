import { CalendarDays } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface HabitStreakCardProps {
  habitName: string
  streak: number
  longestStreak: number
  checkInDates?: string[]
  quote?: string
  onViewCalendar?: () => void
}

export function HabitStreakCard({
  habitName,
  streak,
  longestStreak,
  checkInDates = [],
  quote,
  onViewCalendar,
}: HabitStreakCardProps) {
  // Function to get the last 7 days for the mini calendar
  const getLast7Days = () => {
    const days = []
    const today = new Date()

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      days.push(date.toISOString().split("T")[0])
    }

    return days
  }

  const last7Days = getLast7Days()

  return (
    <Card className="overflow-hidden bg-[#161b22] border-[#30363d] hover:border-[#58a6ff] transition-all duration-300 h-full">
      <CardContent className="p-5">
        <h3 className="text-lg font-semibold text-[#c9d1d9] mb-2">{habitName}</h3>

        {quote && (
          <div className="mb-4 p-3 bg-[#1f2937] rounded-lg border-l-4 border-[#58a6ff] italic text-[#8b949e] text-sm">
            "{quote}"
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[#8b949e] text-sm">Current Streak</p>
            <p className="text-2xl font-bold text-[#58a6ff]">{streak} days</p>
          </div>
          <div className="text-right">
            <p className="text-[#8b949e] text-sm">Longest Streak</p>
            <p className="text-xl font-semibold text-[#c9d1d9]">{longestStreak} days</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center mb-2">
            <CalendarDays className="w-4 h-4 text-[#58a6ff] mr-2" />
            <span className="text-[#8b949e] text-sm">Last 7 days</span>
          </div>

          <div className="flex justify-between">
            {last7Days.map((day, index) => {
              const date = new Date(day)
              const dayName = date.toLocaleDateString("en-US", { weekday: "short" }).charAt(0)
              const isCheckedIn = checkInDates.includes(day)

              return (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 text-xs font-medium
                    ${isCheckedIn ? "bg-[#58a6ff] text-[#0d1117]" : "bg-[#1f2937] text-[#8b949e]"}`}
                  >
                    {dayName}
                  </div>
                  <div className="text-[#8b949e] text-xs">{date.getDate()}</div>
                </div>
              )
            })}
          </div>
          <div className="mt-4 text-center">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onViewCalendar && onViewCalendar()
              }}
              className="text-sm text-[#58a6ff] hover:text-[#388bfd] hover:underline flex items-center justify-center mx-auto"
            >
              <CalendarDays className="w-4 h-4 mr-1" />
              View Full Calendar
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
