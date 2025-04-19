import { useState, useEffect } from "react"
import {
  Clock,
  CircleCheck,
  CirclePlus,
  Trash2,
  X,
  Calendar,
  Trophy,
  Flame,
  CheckCircle2,
  CalendarDays,
} from "lucide-react"
import { newRequest } from "@/utils/request"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import Lottie from "lottie-react"
import { MonthlyStreak } from "@/component/monthy-streak"

// You'll need to update the path to your fire animation
import fireAnimation from "@/assets/Fire.json"
import { Link, useNavigate } from "react-router-dom"

interface Habit {
  habitName: string
  description: string
  id?: string
}

interface DailyPlan {
  id:string
  date: Date
  planName: string
  priority: string
  description: string
  time: string
  category: string
}

export default function UnifiedDashboard() {
  // Habit state
  const [habits, setHabits] = useState<Habit[]>([])
  const [habitName, setHabitName] = useState("")
  const [description, setDescription] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [suggestionFilter, setSuggestionFilter] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [completedHabit, setCompletedHabit] = useState<Record<string, boolean>>({})

  // Streak state
  const [streak, setStreak] = useState(0)
  const [longestStreak, setLongestStreak] = useState(0)
  const [complete, setComplete] = useState(false)
  const [lastCheckedIn, setLastCheckedIn] = useState("")
  const [checkInDates, setCheckInDates] = useState<string[]>([])

  // Daily plan state
  const [dailyplan, setDailyPlan] = useState<DailyPlan[]>([])
  const [planLoading, setPlanLoading] = useState(false)
  const [planError, setPlanError] = useState("")
  const [selectedDate,setSelectedDate]=useState(()=>{
    const today=new Date();
    return today.toISOString().split("T")[0]
  })
  // Habit suggestions
  const habitSuggestion = [
    "Yoga",
    "Meditation",
    "Reading",
    "Learning",
    "Breakfast",
    "8k Steps",
    "3-4L water",
    "Work",
    "Workout",
    "Skincare",
    "Haircare",
    "Socialising",
  ]
  
  // Filter suggestions based on input
  const filteredSuggestions = habitSuggestion.filter((suggestion) =>
    suggestion.toLowerCase().includes(suggestionFilter.toLowerCase()),
)

// Fetch habits
const fetchHabits = async () => {
  try {
    setLoading(true)
    const response = await newRequest.get("/habit/getHabit")
    setHabits(response.data.getHabit)
    setError("")
  } catch (error) {
    setError("Failed to load Habits")
    console.error("Error fetching habits:", error)
  } finally {
    setLoading(false)
  }
}

// Fetch daily plans
const fetchPlan = async () => {
  try {
    setPlanLoading(true)
    const response = await newRequest.get("/daily/fetchPlan")
    setDailyPlan(response.data.fetchPlan)
    setPlanError("")
  } catch (error) {
    setPlanError("Failed to load daily plan")
    console.log("Error fetching plan", error)
  } finally {
    setPlanLoading(false)
  }
}

// Fetch streak data
const fetchStreak = async () => {
  try {
    const response = await newRequest.get("/users/streak")
    setStreak(response.data.formattedUser.streak)
    setLongestStreak(response.data.formattedUser.longestStreak)
    setLastCheckedIn(response.data.formattedUser.lastCheckIn)
    setCheckInDates(response.data.formattedUser.checkInDates || [])
  } catch (error) {
    console.error("Error fetching streak:", error)
  }
}
//Daily plan for each date
const changeDate=(days:number)=>{
  const newDate=new Date(selectedDate);
  newDate.setDate(newDate.getDate() + days)
  
  const today=new Date().toISOString().split("T")[0]
  const newDateStr=newDate.toISOString().split("T")[0]

  if(newDateStr <= today){
    setSelectedDate(newDateStr)
  }
}
const planForSelectedDate=dailyplan.filter(plan =>{
  const planDateStr = new Date(plan.date).toISOString().split("T")[0];
  return planDateStr===selectedDate
})

  // Delete habit
  const deleteHabits = async (habitId: string) => {
    try {
      setDeleteLoading(habitId)
      await newRequest.delete(`/habit/deleteHabit/${habitId}`)
      setDeleteLoading(null)
      fetchHabits()
    } catch (error) {
      setError("Failed to delete Habit")
      console.error("Error deleting habits:", error)
      setDeleteLoading(null)
    }
  }

  // Add habit
  const addHabitHandler = async () => {
    try {
      setLoading(true)
      await newRequest.post("/habit/addHabit", {
        habitName,
        description,
      })
      setHabitName("")
      setDescription("")
      setSuggestionFilter("")
      setShowModal(false)
      setError("")
      fetchHabits()
    } catch (error) {
      setError("Failed to add habit")
      console.error("Error adding habit:", error)
    } finally {
      setLoading(false)
    }
  }

  // Handle streak check-in
  const handleCompletion = async () => {
    try {
      const response = await newRequest.post("/users/checkin")
      setStreak(response.data.streak)
      setLongestStreak(response.data.longestStreak)
      setComplete(true)
      setCheckInDates((prev) => [...prev, new Date().toISOString().split("T")[0]])
    } catch (error) {
      console.error("Error updating streak:", error)
    }
  }
  // delete Habit
  const handleDeletePlan = async (planId: string) => {
    try {
      setDeleteLoading(planId)
      await newRequest.delete(`/daily/deleteplan/${planId}`)
      setDeleteLoading(null)
      fetchPlan()
    } catch (error) {
      setPlanError("Failed to delete plan")
      console.error("Error deleting plan:", error)
      setDeleteLoading(null)
    }
  }
  // Toggle habit completion
  const habitCompletion = (habitId: string) => {
    const updatedHabits = {
      ...completedHabit,
      [habitId]: !completedHabit[habitId],
    }

    setCompletedHabit(updatedHabits)
    localStorage.setItem("completedHabits", JSON.stringify(updatedHabits))
  }

  // Select a suggestion
  const selectSuggestion = (suggestion: string) => {
    setHabitName(suggestion)
    setSuggestionFilter("")
    setShowSuggestions(false)
  }

  // Get priority color
  const priorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-500"
      case "Medium":
        return "bg-amber-100 text-amber-500"
      case "Low":
        return "bg-green-100 text-green-500"
      default:
        return ""
    }
  }

  // Get category color
  const categoryColor = (category: string) => {
    switch (category) {
      case "Health":
        return "bg-blue-100 text-blue-600"
      case "Work":
        return "bg-indigo-100 text-indigo-600"
      case "Personal":
        return "bg-emerald-100 text-emerald-600"
      case "Study":
        return "bg-cyan-100 text-cyan-600"
      default:
        return "bg-teal-100 text-teal-600"
    }
  }

  // Load data on component mount
  useEffect(() => {
    fetchHabits()
    fetchPlan()
    fetchStreak()
  }, [])

  // Handle completed habits persistence
  useEffect(() => {
    const todayUTC = new Date().toISOString().split("T")[0]
    const lastDate = localStorage.getItem("lastcheckedDate")
  
    if (lastDate !== todayUTC) {
      // New day, reset completedHabit
      setCompletedHabit({})
      localStorage.setItem("completedHabits", JSON.stringify({})) // Also clear in localStorage
      localStorage.setItem("lastcheckedDate", todayUTC)
    } else {
      // Same day, load from localStorage
      const storedHabits = localStorage.getItem("completedHabits")
      if (storedHabits) {
        setCompletedHabit(JSON.parse(storedHabits))
      }
    }
  }, [])

  // Check if today is already checked in
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    setComplete(today === lastCheckedIn)
  }, [lastCheckedIn])

  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-teal-100/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <motion.h1
            className="text-3xl md:text-4xl font-bold text-teal-900 mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            My Productivity Dashboard
          </motion.h1>
          <motion.p
            className="text-teal-700 max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Track your habits and daily plans in one place
          </motion.p>
        </header>

        {/* Streak Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Current Streak */}
          <Card className="overflow-hidden border-teal-200 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2">
              <CardDescription className="text-teal-700">Current Streak</CardDescription>
              <div className="absolute top-4 right-4 bg-teal-100 p-2 rounded-full">
                <Flame className="text-teal-500 w-5 h-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-1">
                <span className="font-bold text-4xl text-teal-800">{streak}</span>
                <span className="text-teal-600 font-medium">day{streak !== 1 ? "s" : ""}</span>
              </div>
              <div className="mt-2 text-xs text-teal-600">Keep going! You're building a habit.</div>
            </CardContent>
          </Card>

          {/* Longest Streak */}
          <Card className="overflow-hidden border-teal-200 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2">
              <CardDescription className="text-teal-700">Longest Streak</CardDescription>
              <div className="absolute top-4 right-4 bg-teal-100 p-2 rounded-full">
                <Trophy className="text-teal-500 w-5 h-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-1">
                <span className="font-bold text-4xl text-teal-800">{longestStreak}</span>
                <span className="text-teal-600 font-medium">day{longestStreak !== 1 ? "s" : ""}</span>
              </div>
              <div className="mt-2 text-xs text-teal-600">Your personal best. Can you beat it?</div>
            </CardContent>
          </Card>

          {/* Today's Check-in */}
          <Card
            className={cn(
              "overflow-hidden border-teal-200 transition-all duration-300",
              complete ? "bg-teal-50/90 border-teal-300" : "bg-white/80 hover:shadow-lg",
            )}
          >
            <CardHeader className="pb-2">
              <CardDescription className="text-teal-700">Today's Check-in</CardDescription>
            </CardHeader>
            <CardContent>
              {complete ? (
                <div className="bg-teal-100/80 rounded-lg p-3 flex items-center gap-3 border border-teal-200">
                  <CheckCircle2 className="text-teal-500 w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-teal-700">Completed for Today!</p>
                    <p className="text-xs text-teal-600 mt-1">Come back tomorrow to continue your streak</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Button
                    className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-medium py-5"
                    onClick={handleCompletion}
                  >
                    Check In Today
                  </Button>
                  <p className="text-xs text-teal-600 text-center">Don't break your streak!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Habits Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <CircleCheck className="text-teal-600" />
              <h2 className="ml-2 text-xl font-bold text-teal-900">My Habits</h2>
            </div>
            <div>
              {/* Removed the Link and modified to open the modal directly */}
              <Button
                onClick={() => {
                  setShowModal(true)
                  setSuggestionFilter("")
                }}
                className="bg-teal-600 hover:bg-teal-700"
              >
                <CirclePlus className="mr-2" />
                Add Habit
              </Button>
            </div>
          </div>

          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-teal-200">
            {loading && habits.length === 0 ? (
              <div className="p-8 text-center">
                <div className="animate-spin h-8 w-8 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your habits...</p>
              </div>
            ) : habits.length === 0 ? (
              <div className="p-8 text-center">
                <div className="bg-teal-100 rounded-full p-4 inline-flex mb-4">
                  <CirclePlus className="h-8 w-8 text-teal-400" />
                </div>
                <p className="text-gray-500 mb-2">No habits added yet</p>
                <p className="text-gray-400 text-sm">Start building better routines by adding your first habit</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                {habits.map((habit, index) => (
                  <div key={index} className="group relative">
                    <div className="bg-white border border-teal-200 hover:shadow-lg rounded-lg p-5 h-[10rem] flex flex-col transition-all duration-300 hover:border-teal-300">
                      <div className="flex justify-between items-start mb-2">
                        <h3
                          className={cn(
                            "font-semibold line-clamp-1",
                            completedHabit[habit.id || ""] ? "line-through text-teal-400" : "text-teal-900",
                          )}
                        >
                          {habit.habitName}
                        </h3>
                        <div className="flex gap-1">
                          {completedHabit[habit.id || ""] ? (
                            <div className="flex">
                              <Lottie animationData={fireAnimation} loop={true} className="w-6 h-6" />
                              <button className="text-green-400 hover:text-teal-700 p-1.5 rounded-full hover:bg-teal-100 transition-colors">
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div>
                              <button className="text-teal-500 hover:text-teal-700 p-1.5 rounded-full hover:bg-teal-100 transition-colors">
                                <Flame className="w-4 h-4" />
                              </button>
                              <button
                                className="text-teal-500 hover:text-teal-700 p-1.5 rounded-full hover:bg-teal-100 transition-colors"
                                onClick={() => habit.id && habitCompletion(habit.id)}
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <p
                        className={cn(
                          "text-sm line-clamp-3 mb-auto",
                          completedHabit[habit.id || ""] ? "line-through text-teal-400" : "text-teal-700/80",
                        )}
                      >
                        {habit.description}
                      </p>

                      <div className="mt-2 pt-2 border-t border-teal-100 flex justify-between items-center">
                        <span className="text-xs text-teal-600 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          Daily
                        </span>
                        <button
                          type="button"
                          className="text-gray-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-full"
                          onClick={() => habit.id && deleteHabits(habit.id)}
                          disabled={deleteLoading === habit.id}
                        >
                          {deleteLoading === habit.id ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Daily Plans Section */}
        <div className="flex justify-between items-center mb-6 px-4 py-3 rounded-xl bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-50 shadow-md border border-yellow-300">
  <button
    onClick={() => changeDate(-1)}
    className="text-sm font-medium px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition duration-200 shadow"
  >
    ← Previous Day
  </button>

  <h2 className="text-base sm:text-lg font-semibold text-teal-800 text-center">
    {new Date(selectedDate).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}
  </h2>

  <button
    onClick={() => changeDate(1)}
    className="text-sm font-medium px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition duration-200 shadow"
  >
    Next Day →
  </button>
</div>

        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <CalendarDays className="text-teal-600" />
              <h2 className="ml-2 text-xl font-bold text-teal-900">Daily Plans</h2>
            </div>
            <Button onClick={() => navigate && navigate("/dailyplan")} className="bg-teal-600 hover:bg-teal-700">
              <CirclePlus className="mr-2" />
              Add Plan
            </Button>
          </div>

          <div className="space-y-4">
            {planLoading && <div className="text-center py-4">Loading plans...</div>}

            {planError && <div className="text-red-500 text-center py-4">{planError}</div>}

            {dailyplan.length === 0 && !planLoading && !planError && (
              <div className="text-center py-8 bg-white rounded-lg shadow-sm border border-teal-200">
                <div className="bg-teal-100 rounded-full p-4 inline-flex mb-4">
                  <CalendarDays className="h-8 w-8 text-teal-400" />
                </div>
                <p className="text-gray-500 mb-2">No plans found</p>
                <p className="text-gray-400 text-sm">S tart organizing your day by adding your first plan</p>
              </div>
            )}

{planForSelectedDate.length > 0 ? (
  planForSelectedDate.map((plan, index) => (
    <div key={index} className="border p-4 rounded-xl shadow-sm bg-white hover:shadow-md transition-all duration-300">
      <div className="flex items-start">
        <div className="mt-1 mr-3">
          <div className="w-6 h-6 rounded-full border-2 border-teal-200 flex items-center justify-center" />
        </div>

        <div className="flex-1 flex justify-between">
          <div>
            <h3 className="text-lg font-medium text-teal-900">{plan.planName}</h3>
            <p className="text-gray-500 text-sm mt-1">{plan.description}</p>

            <div className="flex gap-2 mt-3 items-center">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColor(plan.category)}`}>
                {plan.category}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColor(plan.priority)}`}>
                {plan.priority} Priority
              </span>
              <button onClick={() => plan.id && handleDeletePlan(plan.id)} className="text-gray-500 hover:text-red-600">
                <Trash2 />
              </button>
            </div>
          </div>

          <div className="flex items-start ml-6">
            <Clock className="w-4 h-4 mr-1 text-teal-400" />
            <span className="text-gray-500 text-sm">{plan.time}</span>
          </div>
        </div>
      </div>
    </div>
  ))
) : (
  <p className="text-gray-400 text-center mt-6">No plans for this date.</p>
)}

          </div>
        </div>

        {/* Monthly Streak Visualization */}
        <motion.div
          className="bg-white/90 backdrop-blur-sm border border-teal-200 rounded-lg p-6 shadow-md mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-teal-800">Your Habit Streak</h2>
              <p className="text-teal-600 text-sm">Monthly visualization of your check-ins</p>
            </div>
            <div className="flex items-center gap-2 text-teal-700 text-sm">
              <CalendarDays className="w-4 h-4" />
              <span>Last 6 months</span>
            </div>
          </div>

          <MonthlyStreak checkInDates={checkInDates} />
        </motion.div>
      </div>

      {/* Add Habit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-teal-900">Add New Habit</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X />
              </button>
            </div>
            <div className="space-y-4">
              {/* Suggestion Box */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Find Suggestions</label>
                <div className="relative">
                  <input
                    type="text"
                    value={suggestionFilter}
                    onChange={(e) => {
                      setSuggestionFilter(e.target.value)
                      setShowSuggestions(true)
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Type to find suggestions"
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  {showSuggestions && filteredSuggestions.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
                      <ul className="py-1">
                        {filteredSuggestions.map((suggestion) => (
                          <li
                            key={suggestion}
                            className="px-3 py-2 hover:bg-teal-50 cursor-pointer text-sm"
                            onClick={() => selectSuggestion(suggestion)}
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Habit Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Habit Name</label>
                <input
                  type="text"
                  value={habitName}
                  onChange={(e) => setHabitName(e.target.value)}
                  placeholder="Enter habit name"
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  value={description}
                  placeholder="Enter description"
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="mr-2 border-teal-200 text-teal-700 hover:bg-teal-50"
                >
                  Cancel
                </Button>
                <Button onClick={addHabitHandler} disabled={loading} className="bg-teal-600 hover:bg-teal-700">
                  {loading ? "Adding..." : "Add Habit"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}