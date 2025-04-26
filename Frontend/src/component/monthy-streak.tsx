
import { useState } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, isSameDay, isToday, parseISO } from "date-fns"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ChevronLeft, ChevronRight, Info } from "lucide-react"
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

  const getIntensity = (date: Date): number => {
    // Check if this date is in the checkInDates array
    const isCheckedIn = parsedCheckInDates.some((checkInDate) => checkInDate && isSameDay(checkInDate, date))

    if (isCheckedIn) {
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

  // Get color based on intensity (GitHub-like)
  const getColor = (intensity: number) => {
    if (intensity === 0) return "bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
    if (intensity === 1) return "bg-teal-100 border border-teal-200"
    if (intensity === 2) return "bg-teal-200 border border-teal-300"
    if (intensity === 3) return "bg-teal-300 border border-teal-400"
    return "bg-teal-500 border border-teal-600" // Highest intensity
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

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-teal-800">Contribution Activity</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-teal-500" />
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-teal-800 text-white border-teal-700 max-w-xs">
                <p className="text-xs">
                  This graph shows your habit check-in activity over time, similar to GitHub's contribution graph. Each
                  square represents a day, and the color intensity shows if you checked in.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

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

      <div className="overflow-x-auto pb-2">
        <div className="min-w-max">
          <div className="flex mb-2">
            {/* Month labels */}
            <div className="w-8"></div> {/* Spacer for day labels */}
            <div className="flex flex-1 justify-between px-1">
              {months.map((month) => (
                <div key={month.name} className="text-xs font-medium text-teal-700">
                  {format(month.date, "MMM")}
                </div>
              ))}
            </div>
          </div>

          <div className="flex">
            {/* Day of week labels */}
            <div className="w-8 mr-2">
              <div className="grid grid-rows-7 gap-1 text-right h-full pt-1">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
                  <div key={i} className="h-3 text-[10px] text-teal-600 font-medium">
                    {day.charAt(0)}
                  </div>
                ))}
              </div>
            </div>

            {/* Calendar grid - GitHub style */}
            <div className="flex gap-1">
              {months.map((month) => {
                // Group days by week
                const weeks: Date[][] = []
                let currentWeek: Date[] = []

                // Add empty cells for days before the first of the month
                const firstDayOfMonth = month.days[0]
                const dayOfWeek = firstDayOfMonth.getDay()

                for (let i = 0; i < dayOfWeek; i++) {
                  currentWeek.push(new Date(0)) // Placeholder date
                }

                // Add all days of the month
                month.days.forEach((day) => {
                  currentWeek.push(day)
                  if (currentWeek.length === 7) {
                    weeks.push(currentWeek)
                    currentWeek = []
                  }
                })

                // Add remaining days to complete the last week
                if (currentWeek.length > 0) {
                  while (currentWeek.length < 7) {
                    currentWeek.push(new Date(0)) // Placeholder date
                  }
                  weeks.push(currentWeek)
                }

                return (
                  <div key={month.name} className="flex flex-col gap-1">
                    {/* Transpose the weeks to columns */}
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: 7 }).map((_, rowIndex) => (
                        <div key={rowIndex} className="flex flex-col gap-1">
                          {weeks.map((week, weekIndex) => {
                            const day = week[rowIndex]
                            // Skip rendering placeholder dates
                            if (day.getTime() === 0) return <div key={weekIndex} className="h-3 w-3"></div>

                            const intensity = getIntensity(day)
                            const isCurrentDay = isToday(day)

                            return (
                              <TooltipProvider key={weekIndex}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div
                                      className={`
                                        h-3 w-3 rounded-sm
                                        ${getColor(intensity)}
                                        ${isCurrentDay ? "ring-1 ring-teal-400" : ""}
                                        transition-all duration-200 hover:scale-125
                                      `}
                                    ></div>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="top"
                                    className="bg-teal-800 text-white border-teal-700 text-xs p-2"
                                  >
                                    <p>{format(day, "EEEE, MMMM d, yyyy")}</p>
                                    <p className="text-[10px] mt-1">{intensity > 0 ? "Checked in ✓" : "No check-in"}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 pt-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm bg-gray-100 border border-gray-200"></div>
          <span className="text-xs text-teal-700">No check-in</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm bg-teal-500 border border-teal-600"></div>
          <span className="text-xs text-teal-700">Checked in</span>
        </div>
      </div>
    </div>
  )
}
