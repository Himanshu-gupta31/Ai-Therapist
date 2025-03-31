
import { useState } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths } from "date-fns"

interface GitStreakProps {
  checkInDates: string[]
}

function GitStreak({ checkInDates }: GitStreakProps) {
  const [monthsOffset, setMonthsOffset] = useState(0)
  const today = new Date()

  // Get the current month and the previous 5 months (6 months total)
  const months = Array.from({ length: 6 }).map((_, index) => {
    const date = addMonths(today, index - 5 + monthsOffset)
    return {
      date,
      name: format(date, "MMMM yyyy"),
      days: eachDayOfInterval({
        start: startOfMonth(date),
        end: endOfMonth(date),
      }),
    }
  })

  const handlePrevious = () => {
    setMonthsOffset((prev) => prev - 1)
  }

  const handleNext = () => {
    if (monthsOffset < 0) {
      setMonthsOffset((prev) => prev + 1)
    }
  }

  return (
    <div className="p-4 m-4 border border-amber-200 rounded-lg bg-amber-50/50 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-amber-800">Habit Streak</h2>
        <div className="flex gap-2">
          <button
            onClick={handlePrevious}
            className="px-3 py-1 text-sm bg-white border border-amber-200 rounded-md text-amber-700 hover:bg-amber-100 transition-colors"
          >
            ← Previous
          </button>
          <button
            onClick={handleNext}
            disabled={monthsOffset >= 0}
            className={`px-3 py-1 text-sm bg-white border border-amber-200 rounded-md text-amber-700 hover:bg-amber-100 transition-colors ${
              monthsOffset >= 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Next →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {months.map((month) => (
          <div key={month.name} className="border border-amber-100 rounded-lg p-3 bg-white">
            <h3 className="text-amber-800 font-medium mb-2 text-center">{month.name}</h3>
            <div className="grid grid-cols-7 gap-1">
              {/* Day labels */}
              {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                <div key={i} className="h-6 flex items-center justify-center text-xs text-amber-600 font-medium">
                  {day}
                </div>
              ))}

              {/* Empty cells for proper alignment */}
              {Array.from({ length: month.days[0].getDay() }).map((_, i) => (
                <div key={`empty-${i}`} className="h-6" />
              ))}

              {/* Days of the month */}
              {month.days.map((day) => {
                const dateString = day.toISOString().split("T")[0]
                const isToday = day.toDateString() === today.toDateString()
                const hasCheckIn = checkInDates.includes(dateString)

                return (
                  <div
                    key={day.toString()}
                    className={`
                      h-6 w-6 rounded-sm flex items-center justify-center text-xs
                      ${isToday ? "ring-1 ring-amber-500" : ""}
                      ${
                        hasCheckIn
                          ? "bg-amber-400 border border-amber-500 text-amber-900"
                          : "bg-amber-100/50 border border-amber-200 text-amber-700"
                      }
                    `}
                    title={format(day, "EEEE, MMMM d, yyyy") + (hasCheckIn ? " - Checked in" : " - No check-in")}
                  >
                    {day.getDate()}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm bg-amber-100/50 border border-amber-200"></div>
          <span className="text-xs text-amber-700">No check-in</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm bg-amber-400 border border-amber-500"></div>
          <span className="text-xs text-amber-700">Checked in</span>
        </div>
      </div>
    </div>
  )
}

export default GitStreak

