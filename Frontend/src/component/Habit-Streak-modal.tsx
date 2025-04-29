
import { useState } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, isSameDay, isToday, parseISO } from "date-fns"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ChevronLeft, ChevronRight, Info, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface HabitStreakModalProps {
  habitName: string
  checkInDates: string[]
  onClose: () => void
}

export function HabitStreakModal({ habitName, checkInDates, onClose }: HabitStreakModalProps) {
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

  const hasCheckIn = (date: Date): boolean => {
    return parsedCheckInDates.some((checkInDate) => checkInDate && isSameDay(checkInDate, date))
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
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-[#0d1117] rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-auto border border-[#30363d]"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#c9d1d9]">
              {habitName} <span className="text-[#8b949e]">Streak Calendar</span>
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#1f2937] transition-colors text-[#8b949e]"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                className="border-[#30363d] text-[#8b949e] hover:bg-[#1f2937] bg-transparent"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="ml-1">Previous</span>
              </Button>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#c9d1d9]">Contribution Activity</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-[#58a6ff]" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-[#1f2937] text-[#c9d1d9] border-[#30363d] max-w-xs">
                      <p className="text-xs">
                        This graph shows your habit check-in activity over time, similar to GitHub's contribution graph.
                        Each square represents a day, and the color intensity shows if you checked in.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="border-[#30363d] text-[#8b949e] hover:bg-[#1f2937] bg-transparent"
                onClick={handleNext}
                disabled={monthsOffset >= 0}
              >
                <span className="mr-1">Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {months.map((month) => (
                <div key={month.name} className="border border-[#30363d] rounded-lg p-3 bg-[#161b22]">
                  <h3 className="text-[#c9d1d9] font-medium mb-2 text-center">{month.name}</h3>
                  <div className="grid grid-cols-7 gap-1">
                    {/* Day labels */}
                    {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                      <div key={i} className="h-6 flex items-center justify-center text-xs text-[#8b949e] font-medium">
                        {day}
                      </div>
                    ))}

                    {/* Empty cells for proper alignment */}
                    {Array.from({ length: month.days[0].getDay() }).map((_, i) => (
                      <div key={`empty-${i}`} className="h-6" />
                    ))}

                    {/* Days of the month */}
                    {month.days.map((day) => {
                      const isCurrentDay = isToday(day)
                      const checkedIn = hasCheckIn(day)

                      return (
                        <TooltipProvider key={day.toString()}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className={`
                                  h-6 w-6 rounded-sm flex items-center justify-center text-xs
                                  ${isCurrentDay ? "ring-1 ring-[#58a6ff]" : ""}
                                  ${
                                    checkedIn
                                      ? "bg-[#0e4429] border border-[#39d353] text-[#39d353]"
                                      : "bg-[#161b22] border border-[#30363d] text-[#8b949e]"
                                  }
                                  transition-all duration-200 hover:scale-110
                                `}
                              >
                                {day.getDate()}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="bg-[#1f2937] text-[#c9d1d9] border-[#30363d] text-xs p-2"
                            >
                              <p>{format(day, "EEEE, MMMM d, yyyy")}</p>
                              <p className="text-[10px] mt-1">{checkedIn ? "Checked in ✓" : "No check-in"}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-4 pt-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-[#161b22] border border-[#30363d]"></div>
                <span className="text-xs text-[#8b949e]">No check-in</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-[#0e4429] border border-[#39d353]"></div>
                <span className="text-xs text-[#8b949e]">Checked in</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
