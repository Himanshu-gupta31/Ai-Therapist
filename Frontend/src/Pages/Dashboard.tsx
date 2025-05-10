import { useState, useEffect } from "react"
import { Clock, CirclePlus, Trash2, X, Calendar, CheckCircle2, CalendarDays } from "lucide-react"
import { newRequest } from "@/utils/request"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { HabitStreakCard } from "@/component/Habit-streak-card"
import { useNavigate } from "react-router-dom"

interface Habit {
  habitName: string
  description: string
  id?: string
  streak?: number
  longestStreak?: number
  lastCheckIn?: string | null
  checkInDates?: string[]
  frequency?: string
  duration?: number
  goal?: string
  last7CheckInCount?: number
  completedDays?: string[]
}

interface DailyPlan {
  id: string
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
  const [frequency, setFrequency] = useState<string>("daily")
  const [duration, setDuration] = useState<number>(1)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [suggestionFilter, setSuggestionFilter] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [completedHabit, setCompletedHabit] = useState<Record<string, boolean>>({})
  const [viewingCalendarForHabit, setViewingCalendarForHabit] = useState<string | null>(null)
  const [expertise, setExpertise] = useState("Beginner")
  console.log("Habits", habits)
  // Daily plan state
  const [dailyplan, setDailyPlan] = useState<DailyPlan[]>([])
  const [planLoading, setPlanLoading] = useState(false)
  const [planError, setPlanError] = useState("")
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  })
  //Quotes state
  const [quotes, setQuotes] = useState<Record<string, string>>({})
  console.log("quotes", quotes)
  //Context

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

  // Update the fetchHabitStreaks function to properly connect to the backend API
  // and update the habits with streak information
  const fetchHabitStreaks = async () => {
    try {
      const response = await newRequest.get("/habit/streak")

      if (response.data && response.data.habits && response.data.habits.length > 0) {
        // Create a mapping of habit IDs to their streak data
        const streakData = response.data.habits.reduce((acc: Record<string, any>, habit: any) => {
          if (habit.habitId) {
            acc[habit.habitId] = {
              streak: habit.streak || 0,
              longestStreak: habit.longestStreak || 0,
              lastCheckIn: habit.lastCheckIn || null,
              checkInDates: habit.checkInDates || [],
              last7CheckInCount: habit.last7CheckInCount || 0,
              completedDays: habit.completedDays || [],
              goal: habit.goal || "",
            }
          }
          return acc
        }, {})

        // Update habits with streak data
        setHabits((prevHabits) =>
          prevHabits.map((habit) => {
            if (habit.id && streakData[habit.id]) {
              return {
                ...habit,
                streak: streakData[habit.id].streak,
                longestStreak: streakData[habit.id].longestStreak,
                lastCheckIn: streakData[habit.id].lastCheckIn,
                checkInDates: streakData[habit.id].checkInDates,
                last7CheckInCount: streakData[habit.id].last7CheckInCount,
                completedDays: streakData[habit.id].completedDays,
                goal: streakData[habit.id].goal,
              }
            }
            return habit
          }),
        )
      }
    } catch (error) {
      console.error("Error fetching habit streaks:", error)
    }
  }

  // Add a function to handle habit check-in
  const handleHabitCheckIn = async (habitId: string) => {
    try {
      // First update the UI optimistically
      habitCompletion(habitId)

      // Then make the API call to update the streak on the server
      const response = await newRequest.post(`/habit/checkin/${habitId}`)

      // Update the habit with new streak data
      if (response.data) {
        setHabits((prevHabits) =>
          prevHabits.map((habit) => {
            if (habit.id === habitId) {
              return {
                ...habit,
                streak: response.data.streak || habit.streak,
                longestStreak: response.data.longestStreak || habit.longestStreak,
                lastCheckIn: response.data.lastCheckIn || habit.lastCheckIn,
                checkInDates: response.data.checkInDates || habit.checkInDates || [],
              }
            }

            return habit
          }),
        )
      }

      // Refresh all habit streaks
      fetchHabitStreaks()
    } catch (error) {
      console.error("Error checking in habit:", error)
      // Revert the optimistic update if the API call fails
      habitCompletion(habitId)
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

  //Daily plan for each date
  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + days)

    const today = new Date().toISOString().split("T")[0]
    const newDateStr = newDate.toISOString().split("T")[0]

    if (newDateStr <= today) {
      setSelectedDate(newDateStr)
    }
  }
  const planForSelectedDate = dailyplan.filter((plan) => {
    const planDateStr = new Date(plan.date).toISOString().split("T")[0]
    return planDateStr === selectedDate
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
        frequency,
        duration,
        expertise,
        goal: "", // Add default empty goal
      })
      setHabitName("")
      setDescription("")
      setFrequency("daily")
      setDuration(1)
      setSuggestionFilter("")
      setShowModal(false)
      setExpertise("")
      setError("")
      await fetchHabits()
      await fetchHabitStreaks()
    } catch (error) {
      setError("Failed to add habit")
      console.error("Error adding habit:", error)
    } finally {
      setLoading(false)
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
    const loadData = async () => {
      await fetchHabits()
      await fetchHabitStreaks()
      await fetchPlan()
    }
    loadData()
  }, [])
  // Quotes For Habit
  const HabitQuotes = async (habitId: string) => {
    try {
      const response = await newRequest.get(`/quotes/getQuotes/${habitId}`)
      if (!response.data.quote) {
        setError("No quote found")
        return
      }
      setQuotes((prev) => ({
        ...prev,
        [habitId]: response.data.quote.text,
      }))
    } catch (error) {
      setError("Failed to load quotes")
      console.error("Error loading quotes:", error)
    }
  }
  useEffect(() => {
    habits.forEach((habit) => {
      if (habit.lastCheckIn && habit.id) {
        HabitQuotes(habit.id)
      }
    })
  }, [habits.map((h) => h.lastCheckIn).join(",")])
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

  const navigate = useNavigate()

  // const {auth}=useContext(AuthContext)
  // useEffect(()=>{
  //   if(!auth){
  //     navigate("/signin")
  //   }else{
  //     navigate("/dashboard")
  //   }
  // },[auth])

  return (
    <div className="min-h-screen bg-[#0d1117] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <motion.h1
            className="text-3xl md:text-4xl font-bold text-[#c9d1d9] mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            My Habit Streaks
          </motion.h1>
          <motion.p
            className="text-[#8b949e] max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Track your habits and build consistency
          </motion.p>
        </header>

        {/* Habit Streak Cards */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-[#c9d1d9] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#58a6ff]" />
                Habit Streaks
              </h2>
              <p className="text-[#8b949e] text-sm">Track each habit's consistency over time</p>
            </div>
            <Button
              onClick={() => {
                setShowModal(true)
                setSuggestionFilter("")
              }}
              className="bg-[#1f6feb] hover:bg-[#388bfd] text-white border-none"
            >
              <CirclePlus className="mr-2" />
              Add Habit
            </Button>
          </div>

          {error && (
            <div className="bg-[#f85149] bg-opacity-20 border border-[#f85149] text-[#f85149] px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {loading && habits.length === 0 ? (
            <div className="p-8 text-center">
              <div className="animate-spin h-8 w-8 border-4 border-[#58a6ff] border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-[#8b949e]">Loading your habits...</p>
            </div>
          ) : habits.length === 0 ? (
            <div className="text-center py-8 bg-[#161b22] rounded-lg border border-[#30363d]">
              <div className="bg-[#1f2937] rounded-full p-4 inline-flex mb-4">
                <Calendar className="h-8 w-8 text-[#58a6ff]" />
              </div>
              <p className="text-[#c9d1d9] mb-2">No habits added yet</p>
              <p className="text-[#8b949e] text-sm">Start building better routines by adding your first habit</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {habits.map(
                (habit) =>
                  habit.id && (
                    <div key={habit.id} className="relative group">
                      <HabitStreakCard
                        habitName={habit.habitName}
                        streak={habit.streak || 0}
                        last7CheckInCount={habit.last7CheckInCount || 0}
                        checkInDates={habit.checkInDates || []}
                        quote={habit.id ? quotes[habit.id] : ""}
                        frequency={habit.frequency}
                        duration={habit.duration}
                        goal={habit.goal || ""}
                        onViewCalendar={() => setViewingCalendarForHabit(habit.id || null)}
                      />
                      <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <button
                          className="w-8 h-8 bg-[#1f2937] rounded-md flex items-center justify-center text-[#8b949e] hover:text-[#58a6ff]"
                          onClick={(e) => {
                            e.stopPropagation()
                            habit.id && handleHabitCheckIn(habit.id)
                          }}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </button>
                        <button
                          className="w-8 h-8 bg-[#1f2937] rounded-md flex items-center justify-center text-[#8b949e] hover:text-[#f85149]"
                          onClick={(e) => {
                            e.stopPropagation()
                            habit.id && deleteHabits(habit.id)
                          }}
                          disabled={deleteLoading === habit.id}
                        >
                          {deleteLoading === habit.id ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#f85149] border-t-transparent" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  ),
              )}
            </div>
          )}
        </motion.div>

        {/* Daily Plans Section */}
        <div className="flex justify-between items-center mb-6 px-4 py-3 rounded-xl bg-[#161b22] border border-[#30363d]">
          <button
            onClick={() => changeDate(-1)}
            className="text-sm font-medium px-4 py-2 bg-[#1f6feb] text-white rounded-md hover:bg-[#388bfd] transition duration-200"
          >
            ← Previous Day
          </button>

          <h2 className="text-base sm:text-lg font-semibold text-[#c9d1d9] text-center">
            {new Date(selectedDate).toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h2>

          <button
            onClick={() => changeDate(1)}
            className="text-sm font-medium px-4 py-2 bg-[#1f6feb] text-white rounded-md hover:bg-[#388bfd] transition duration-200"
          >
            Next Day →
          </button>
        </div>

        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <CalendarDays className="text-[#58a6ff]" />
              <h2 className="ml-2 text-xl font-bold text-[#c9d1d9]">Daily Plans</h2>
            </div>
            <Button
              onClick={() => navigate && navigate("/dailyplan")}
              className="bg-[#1f6feb] hover:bg-[#388bfd] text-white border-none"
            >
              <CirclePlus className="mr-2" />
              Add Plan
            </Button>
          </div>

          <div className="space-y-4">
            {planLoading && <div className="text-center py-4 text-[#8b949e]">Loading plans...</div>}

            {planError && <div className="text-[#f85149] text-center py-4">{planError}</div>}

            {dailyplan.length === 0 && !planLoading && !planError && (
              <div className="text-center py-8 bg-[#161b22] rounded-lg border border-[#30363d]">
                <div className="bg-[#1f2937] rounded-full p-4 inline-flex mb-4">
                  <CalendarDays className="h-8 w-8 text-[#58a6ff]" />
                </div>
                <p className="text-[#c9d1d9] mb-2">No plans found</p>
                <p className="text-[#8b949e] text-sm">Start organizing your day by adding your first plan</p>
              </div>
            )}

            {planForSelectedDate.length > 0 ? (
              planForSelectedDate.map((plan, index) => (
                <div
                  key={index}
                  className="border border-[#30363d] p-4 rounded-xl bg-[#161b22] hover:bg-[#1f2937] transition-all duration-300"
                >
                  <div className="flex items-start">
                    <div className="mt-1 mr-3">
                      <div className="w-6 h-6 rounded-full border-2 border-[#30363d] flex items-center justify-center" />
                    </div>

                    <div className="flex-1 flex justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-[#c9d1d9]">{plan.planName}</h3>
                        <p className="text-[#8b949e] text-sm mt-1">{plan.description}</p>

                        <div className="flex gap-2 mt-3 items-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColor(plan.category)}`}
                          >
                            {plan.category}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColor(plan.priority)}`}
                          >
                            {plan.priority} Priority
                          </span>
                          <button
                            onClick={() => plan.id && handleDeletePlan(plan.id)}
                            className="text-[#8b949e] hover:text-[#f85149]"
                          >
                            <Trash2 />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-start ml-6">
                        <Clock className="w-4 h-4 mr-1 text-[#58a6ff]" />
                        <span className="text-[#8b949e] text-sm">{plan.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[#8b949e] text-center mt-6">No plans for this date.</p>
            )}
          </div>
        </div>
      </div>

      {/* Add Habit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[1000]">
          <div className="bg-[#161b22] rounded-lg p-6 w-full max-w-md shadow-xl border border-[#30363d]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#c9d1d9]">Add New Habit</h2>
              <button onClick={() => setShowModal(false)} className="text-[#8b949e] hover:text-[#c9d1d9]">
                <X />
              </button>
            </div>
            <div className="space-y-4">
              {/* Suggestion Box */}
              <div>
                <label className="block text-sm font-medium text-[#c9d1d9] mb-1">Find Suggestions</label>
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
                    className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-transparent text-[#c9d1d9]"
                  />
                  {showSuggestions && filteredSuggestions.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-[#161b22] shadow-lg rounded-md border border-[#30363d] max-h-60 overflow-auto">
                      <ul className="py-1">
                        {filteredSuggestions.map((suggestion) => (
                          <li
                            key={suggestion}
                            className="px-3 py-2 hover:bg-[#1f2937] cursor-pointer text-sm text-[#c9d1d9]"
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
                <label className="block text-sm font-medium text-[#c9d1d9] mb-1">Habit Name</label>
                <input
                  type="text"
                  value={habitName}
                  onChange={(e) => setHabitName(e.target.value)}
                  placeholder="Enter habit name"
                  className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-transparent text-[#c9d1d9]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-[#c9d1d9] mb-1">Description</label>
                <input
                  value={description}
                  placeholder="Enter description"
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-transparent text-[#c9d1d9]"
                />
              </div>
              {/* Frequency */}
              <div>
                <label className="block text-sm font-medium text-[#c9d1d9] mb-1">Frequency</label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-transparent text-[#c9d1d9]"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-[#c9d1d9] mb-1">Duration (hours)</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number.parseInt(e.target.value))}
                  placeholder="Enter duration in days"
                  min="1"
                  max="24"
                  className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-transparent text-[#c9d1d9]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#c9d1d9] mb-1">Expertise Level</label>
                <select
                  value={expertise}
                  onChange={(e) => setExpertise(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-transparent text-[#c9d1d9]"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
              {/* Buttons */}
              <div className="flex justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="mr-2 border-[#30363d] text-[#c9d1d9] hover:bg-[#1f2937] bg-transparent"
                >
                  Cancel
                </Button>
                <Button
                  onClick={addHabitHandler}
                  disabled={loading}
                  className="bg-[#1f6feb] hover:bg-[#388bfd] text-white border-none"
                >
                  {loading ? "Adding..." : "Add Habit"}
                </Button>
                {/* Expertise Level */}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Full Calendar Modal */}
      {viewingCalendarForHabit && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[1000]">
          <div className="bg-[#161b22] rounded-lg p-6 w-full max-w-2xl shadow-xl border border-[#30363d]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#c9d1d9]">
                Check-in Calendar: {habits.find((h) => h.id === viewingCalendarForHabit)?.habitName}
              </h2>
              <button onClick={() => setViewingCalendarForHabit(null)} className="text-[#8b949e] hover:text-[#c9d1d9]">
                <X />
              </button>
            </div>
            <div className="p-4 min-h-[300px] bg-[#0d1117] rounded-lg border border-[#30363d]">
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 30 }).map((_, index) => {
                  const date = new Date()
                  date.setDate(date.getDate() - (29 - index))
                  const dateStr = date.toISOString().split("T")[0]
                  const habit = habits.find((h) => h.id === viewingCalendarForHabit)
                  const isCheckedIn = habit?.checkInDates?.includes(dateStr)

                  return (
                    <div
                      key={index}
                      className={`aspect-square rounded-md flex flex-col items-center justify-center text-xs
                        ${isCheckedIn ? "bg-[#58a6ff] text-[#0d1117]" : "bg-[#1f2937] text-[#8b949e]"}`}
                    >
                      <span className="font-medium">{date.getDate()}</span>
                      <span>{date.toLocaleDateString("en-US", { month: "short" })}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
