import { CalendarDays, Clock, TrendingUp, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface HabitStreakCardProps {
  habitName: string;
  streak: number;
  last7CheckInCount: number;
  checkInDates?: string[];
  quote?: string;
  frequency?: string;
  duration?: number;
  goal?: string;
  suggestedTarget?: string;
  expertiselevel?: string;
  onViewCalendar: () => void;
}

export function HabitStreakCard({
  habitName,
  streak,
  last7CheckInCount,
  checkInDates = [],
  quote,
  frequency = "daily",
  duration = 1,
  goal = "",
  suggestedTarget,
  expertiselevel,
}: HabitStreakCardProps) {
  const [showAiSuggestion, setShowAiSuggestion] = useState(false);

  // Calculate the last 7 days for the mini calendar
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split("T")[0];
  });

  // Format frequency for display
  const formatFrequency = (freq: string) => {
    return freq.charAt(0).toUpperCase() + freq.slice(1);
  };

  return (
    <motion.div
      className="bg-[#161b22] rounded-xl border border-[#30363d] p-5 pb-14 h-full flex flex-col"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-xl font-bold text-[#c9d1d9]">{habitName}</h3>
          {expertiselevel && (
            <span className="text-sm font-medium text-[#8b949e]">
              {expertiselevel}
            </span>
          )}
        </div>

        {goal && (
          <div className="flex items-center gap-1 text-sm text-[#8b949e] mb-3">
            <Target className="h-4 w-4 text-[#58a6ff]" />
            <span>Goal: {goal}</span>
          </div>
        )}

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1 text-sm text-[#8b949e]">
            <Clock className="h-4 w-4 text-[#58a6ff]" />
            <span>{duration} hour(s)</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-[#8b949e]">
            <CalendarDays className="h-4 w-4 text-[#58a6ff]" />
            <span>{formatFrequency(frequency)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-3xl font-bold text-[#58a6ff]">{streak}</div>
            <div className="text-xs text-[#8b949e]">Current Streak</div>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4 text-[#58a6ff]" />
            <span className="text-sm text-[#8b949e]">
              {last7CheckInCount}/7 days this week
            </span>
          </div>
        </div>

        <div className="flex gap-1 mb-4">
          {last7Days.map((day, index) => {
            const isCheckedIn = checkInDates.includes(day);
            return (
              <div
                key={index}
                className={`flex-1 aspect-square rounded-md flex items-center justify-center text-xs font-medium ${
                  isCheckedIn
                    ? "bg-[#58a6ff] text-[#0d1117]"
                    : "bg-[#1f2937] text-[#8b949e]"
                }`}
              >
                {new Date(day).getDate()}
              </div>
            );
          })}
        </div>

        {quote && (
          <div className="mt-2">
            <div className="text-xs text-[#8b949e] italic border-l-2 border-[#58a6ff] pl-2">
              "{quote}"
            </div>
          </div>
        )}

        {suggestedTarget && (
          <div className="mt-4">
            <div className="flex items-center mb-2">
              {/* Improved custom checkbox */}
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  id={`aiSuggestion-${habitName}`}
                  checked={showAiSuggestion}
                  onChange={() => setShowAiSuggestion(!showAiSuggestion)}
                  className="sr-only" // Hide the actual checkbox but keep it accessible
                />
                <div
                  className={`w-5 h-5 flex items-center justify-center rounded border ${
                    showAiSuggestion
                      ? "bg-[#58a6ff] border-[#58a6ff]"
                      : "bg-[#0d1117] border-[#30363d]"
                  } cursor-pointer transition-colors duration-200`}
                  onClick={() => setShowAiSuggestion(!showAiSuggestion)}
                >
                  {showAiSuggestion && (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 3L4.5 8.5L2 6"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <label
                  htmlFor={`aiSuggestion-${habitName}`}
                  className="ml-2 text-sm text-[#8b949e] cursor-pointer"
                >
                  AI Suggestion
                </label>
              </div>
            </div>

            {/* AnimatePresence helps with smooth mounting/unmounting */}
            <AnimatePresence>
              {showAiSuggestion && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.15, ease: "easeInOut" }}
                  className="bg-[#1f2937] rounded-md p-3 border-l-2 border-[#58a6ff] overflow-hidden"
                >
                  <div className="text-xs text-[#8b949e] font-medium mb-1">
                    Suggested Target:
                  </div>
                  <div className="text-sm text-[#c9d1d9]">
                    {suggestedTarget}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}
