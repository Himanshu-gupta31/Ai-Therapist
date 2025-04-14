
import { useState } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths } from "date-fns"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MonthlyStreakProps {
  checkInDates: string[]
}

export function MonthlyStreak({ checkInDates }: MonthlyStreakProps) {
  const [monthsOffset, setMonthsOffset] = useState(0)
  const today = new Date()

  // Get the current month and the previous 5 months
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

  const getIntensity = (date: Date): number => {
    const dateString = date.toISOString().split("T")[0]

    // Check if this date is in the checkInDates array
    if (checkInDates.includes(dateString)) {
      return 4 // Highest intensity
    }

    return 0 // No check-in
  }

  const handlePrevious = () => {
    setMonthsOffset((prev) => prev - 1)
  }

  const handleNext = () => {
    if (monthsOffset < 0) {
      setMonthsOffset((prev) => prev + 1)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          size="sm"
          className="border-teal-200 text-teal-700 hover:bg-teal-50"
          onClick={handlePrevious}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="ml-1">Previous</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="border-teal-200 text-teal-700 hover:bg-teal-50"
          onClick={handleNext}
          disabled={monthsOffset >= 0}
        >
          <span className="mr-1">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {months.map((month) => (
          <div key={month.name} className="border border-teal-100 rounded-lg p-4 bg-teal-50/50">
            <h3 className="text-teal-800 font-medium mb-3">{month.name}</h3>
            <div className="grid grid-cols-7 gap-1">
              {/* Day labels */}
              {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                <div key={i} className="h-6 flex items-center justify-center text-xs text-teal-600 font-medium">
                  {day}
                </div>
              ))}

              {/* Empty cells for proper alignment */}
              {Array.from({ length: month.days[0].getDay() }).map((_, i) => (
                <div key={`empty-${i}`} className="h-7" />
              ))}

              {/* Days of the month */}
              <TooltipProvider>
                {month.days.map((day) => {
                  const intensity = getIntensity(day)
                  const isToday = day.toDateString() === today.toDateString()
                  const dateString = format(day, "yyyy-MM-dd")
                  const hasCheckIn = checkInDates.includes(dateString)

                  return (
                    <Tooltip key={day.toString()}>
                      <TooltipTrigger asChild>
                        <div
                          className={`
                            h-7 w-7 rounded-md flex items-center justify-center text-xs
                            ${isToday ? "ring-2 ring-teal-400" : ""}
                            ${hasCheckIn ? "bg-teal-400 text-teal-900 font-medium" : "bg-teal-100/50 text-teal-700"}
                            ${isToday && !hasCheckIn ? "bg-teal-200/70" : ""}
                            transition-all duration-200 hover:scale-110
                          `}
                        >
                          {day.getDate()}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-teal-800 text-teal-50 border-teal-700">
                        <p>{format(day, "EEEE, MMMM d, yyyy")}</p>
                        <p className="text-xs mt-1">{hasCheckIn ? "Checked in ✓" : "No check-in"}</p>
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </TooltipProvider>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4 pt-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm bg-teal-100/50"></div>
          <span className="text-xs text-teal-700">No check-in</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm bg-teal-400"></div>
          <span className="text-xs text-teal-700">Checked in</span>
        </div>
      </div>
    </div>
  )
}

