"use client"

import GitStreak from "@/component/GitStreak"
import { Calendar, CircleCheckBig, Trophy } from "lucide-react"
import { useState } from "react"

function Dashboard() {
  const [complete, setComplete] = useState(false)

  const handleCompletion = () => {
    setComplete(!complete)
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-amber-50/50">
      <h1 className="text-2xl font-bold text-amber-900 mb-8 text-center">Habit Streak Dashboard</h1>

      <div className="flex flex-col md:flex-row gap-6 justify-center mb-10">
        {/* Current Streak Card */}
        <div className="border border-amber-300 bg-white w-full md:w-[18rem] rounded-lg flex p-5 flex-col justify-around shadow-md hover:shadow-lg transition-shadow">
          <p className="font-medium text-sm text-amber-700 mb-3">Current Streak</p>

          <div className="flex items-center gap-3">
            <div className="bg-amber-100 p-2 rounded-full">
              <Calendar className="text-amber-500 w-5 h-5" />
            </div>
            <p className="font-bold text-2xl text-amber-800">1 day</p>
          </div>
        </div>

        {/* Longest Streak Card */}
        <div className="border border-amber-300 bg-white w-full md:w-[18rem] rounded-lg flex p-5 flex-col justify-around shadow-md hover:shadow-lg transition-shadow">
          <p className="font-medium text-sm text-amber-700 mb-3">Longest Streak</p>

          <div className="flex items-center gap-3">
            <div className="bg-amber-100 p-2 rounded-full">
              <Trophy className="text-amber-500 w-5 h-5" />
            </div>
            <p className="font-bold text-2xl text-amber-800">1 day</p>
          </div>
        </div>

        {/* Today's Check-in Card */}
        <div
          className={`border ${complete ? "border-amber-400 bg-amber-50" : "border-amber-300 bg-white"} w-full md:w-[18rem] rounded-lg flex p-5 flex-col justify-around shadow-md hover:shadow-lg transition-all`}
        >
          <p className="font-medium text-sm text-amber-700 mb-3">Today's Check-in</p>

          <div className="flex items-center">
            {complete ? (
              <div className="w-full bg-amber-100 rounded-md p-3 flex items-center gap-2 border border-amber-200">
                <CircleCheckBig className="text-amber-500 w-5 h-5 flex-shrink-0" />
                <p className="font-semibold text-amber-700">Completed for Today!</p>
              </div>
            ) : (
              <button
                className="bg-amber-500 hover:bg-amber-600 text-white font-medium p-3 w-full rounded-md transition-colors shadow-sm hover:shadow active:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-opacity-50"
                onClick={handleCompletion}
              >
                Check In Today
              </button>
            )}
          </div>
        </div>
      </div>

      {/* GitStreak Component (unchanged) */}
      <div className="bg-white border border-amber-200 rounded-lg p-6 shadow-md">
        <h2 className="text-lg font-semibold text-amber-800 mb-4">Your Habit Streak</h2>
        <GitStreak />
      </div>
    </div>
  )
}

export default Dashboard

