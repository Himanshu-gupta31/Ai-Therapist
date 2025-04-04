import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import {
  Calendar,
  Trophy,
  Flame,
  CheckCircle2,
  CalendarDays,
} from "lucide-react";
import { newRequest } from "@/utils/request";
import { MonthlyStreak } from "@/component/monthy-streak";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import fireAnimation from "@/assets/Fire.json";
interface Habit {
  habitName: string;
  description: string;
  id: string;
}
export default function Dashboard() {
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [complete, setComplete] = useState(false);
  const [lastCheckedIn, setLastCheckedIn] = useState("");
  const [checkInDates, setCheckInDates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [error, setError] = useState("");
  const [completedHabit, setCompletedHabit] = useState<Record<string, boolean>>(
    {}
  );

  const getHabits = async () => {
    try {
      setIsLoading(true);
      const response = await newRequest.get("/habit/getHabit");
      setHabits(response.data.getHabit);
      setError("");
    } catch (error) {
      setError("Failed to load Habits");
      console.error("Error fetching habits:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getHabits();
  }, []);

  useEffect(() => {
    const fetchStreak = async () => {
      setIsLoading(true);
      try {
        const response = await newRequest.get("/users/streak");
        setStreak(response.data.formattedUser.streak);
        setLongestStreak(response.data.formattedUser.longestStreak);
        setLastCheckedIn(response.data.formattedUser.lastCheckIn);
        setCheckInDates(response.data.formattedUser.checkInDates || []);
      } catch (error) {
        console.error("Error fetching streak:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStreak();
  }, []);
  useEffect(() => {
    const todayUTC = new Date().toISOString().split("T")[0];
    const lastDate = localStorage.getItem("lastcheckedDate");

    if (lastDate !== todayUTC) {
      // New day, reset completedHabit
      setCompletedHabit({});
      localStorage.setItem("lastcheckedDate", todayUTC);
    } else {
      // Same day, load from localStorage
      const storedHabits = localStorage.getItem("completedHabits");
      if (storedHabits) {
        setCompletedHabit(JSON.parse(storedHabits));
      }
    }
  }, []);
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setComplete(today === lastCheckedIn);
  }, [lastCheckedIn]);

  const handleCompletion = async () => {
    try {
      const response = await newRequest.post("/users/checkin");
      setStreak(response.data.streak);
      setLongestStreak(response.data.longestStreak);
      setComplete(true);
      setCheckInDates((prev) => [
        ...prev,
        new Date().toISOString().split("T")[0],
      ]);
    } catch (error) {
      console.error("Error updating streak:", error);
    }
  };
  const habitCompletion = (habitId: any) => {
    const updatedHabits = {
      ...completedHabit,
      [habitId]: !completedHabit[habitId],
    };

    setCompletedHabit(updatedHabits);
    localStorage.setItem("completedHabits", JSON.stringify(updatedHabits));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <motion.h1
            className="text-3xl md:text-4xl font-bold text-amber-900 mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Habit Streak Dashboard
          </motion.h1>
          <motion.p
            className="text-amber-700 max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Track your daily habits and build consistency
          </motion.p>
        </header>
        {/* Get all the Habit here */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {isLoading ? (
            Array(3)
              .fill(0)
              .map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="bg-white/80 border border-amber-200 backdrop-blur-sm rounded-lg p-5 animate-pulse"
                >
                  <div className="h-5 bg-amber-100 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-amber-50 rounded w-full mb-2"></div>
                  <div className="h-4 bg-amber-50 rounded w-2/3"></div>
                </div>
              ))
          ) : error ? (
            <div className="col-span-full bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
              <p className="flex items-center gap-2">
                <span className="inline-block w-5 h-5">⚠️</span>
                {error}
              </p>
            </div>
          ) : habits.length === 0 ? (
            <div className="col-span-full bg-amber-50 border border-amber-200 text-amber-700 p-6 rounded-lg text-center">
              <p className="mb-3 font-medium">No habits created yet</p>
              <p className="text-sm text-amber-600 mb-4">
                Start by creating your first habit to track
              </p>
              <button className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Create Habit
              </button>
            </div>
          ) : (
            habits.map((habit, index) => (
              <div key={index} className="group relative">
                <div className="bg-white/80 border border-amber-200 backdrop-blur-sm hover:shadow-lg rounded-lg p-5 h-[10rem] flex flex-col transition-all duration-300 hover:border-amber-300">
                  <div className="flex justify-between items-start mb-2">
                    <h3
                      className={cn(
                        "font-semibold line-clamp-1",
                        completedHabit[habit.id]
                          ? "line-through text-amber-400"
                          : "text-amber-900"
                      )}
                    >
                      {habit.habitName}
                    </h3>
                    <div className="flex gap-1">
                      {completedHabit[habit.id] ? (
                        <div className="flex">
                          <Lottie
                            animationData={fireAnimation}
                            loop={true}
                            className="w-6 h-6"
                          />
                          <button className=" text-green-400 hover:text-amber-700 p-1.5 rounded-full hover:bg-amber-100 transition-colors">
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <button className="text-amber-500 hover:text-amber-700 p-1.5 rounded-full hover:bg-amber-100 transition-colors">
                            <Flame className="w-4 h-4" />
                          </button>
                          <button
                            className="text-amber-500 hover:text-amber-700 p-1.5 rounded-full hover:bg-amber-100 transition-colors"
                            onClick={() => habitCompletion(habit.id)}
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
                      completedHabit[habit.id]
                        ? "line-through text-amber-400"
                        : "text-amber-700/80"
                    )}
                  >
                    {habit.description}
                  </p>

                  <div className="mt-2 pt-2 border-t border-amber-100 flex justify-between items-center">
                    <span className="text-xs text-amber-600 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Daily
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Current Streak */}
          <Card className="overflow-hidden border-amber-200 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2">
              <CardDescription className="text-amber-700">
                Current Streak
              </CardDescription>
              <div className="absolute top-4 right-4 bg-amber-100 p-2 rounded-full">
                <Flame className="text-amber-500 w-5 h-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-1">
                <span className="font-bold text-4xl text-amber-800">
                  {streak}
                </span>
                <span className="text-amber-600 font-medium">
                  day{streak !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="mt-2 text-xs text-amber-600">
                Keep going! You're building a habit.
              </div>
            </CardContent>
          </Card>

          {/* Longest Streak */}
          <Card className="overflow-hidden border-amber-200 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2">
              <CardDescription className="text-amber-700">
                Longest Streak
              </CardDescription>
              <div className="absolute top-4 right-4 bg-amber-100 p-2 rounded-full">
                <Trophy className="text-amber-500 w-5 h-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-1">
                <span className="font-bold text-4xl text-amber-800">
                  {longestStreak}
                </span>
                <span className="text-amber-600 font-medium">
                  day{longestStreak !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="mt-2 text-xs text-amber-600">
                Your personal best. Can you beat it?
              </div>
            </CardContent>
          </Card>

          {/* Today's Check-in */}
          <Card
            className={cn(
              "overflow-hidden border-amber-200 transition-all duration-300",
              complete
                ? "bg-amber-50/90 border-amber-300"
                : "bg-white/80 hover:shadow-lg"
            )}
          >
            <CardHeader className="pb-2">
              <CardDescription className="text-amber-700">
                Today's Check-in
              </CardDescription>
              {/* <div className="absolute top-4 right-4 bg-amber-100 p-2 rounded-full">
                <Calendar className="text-amber-500 w-5 h-5" />
              </div> */}
            </CardHeader>
            <CardContent>
              {complete ? (
                <div className="bg-amber-100/80 rounded-lg p-3 flex items-center gap-3 border border-amber-200">
                  <CheckCircle2 className="text-amber-500 w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-amber-700">
                      Completed for Today!
                    </p>
                    <p className="text-xs text-amber-600 mt-1">
                      Come back tomorrow to continue your streak
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Button
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium py-5"
                    onClick={handleCompletion}
                  >
                    Check In Today
                  </Button>
                  <p className="text-xs text-amber-600 text-center">
                    Don't break your streak!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Monthly Streak Visualization */}
        <motion.div
          className="bg-white/90 backdrop-blur-sm border border-amber-200 rounded-lg p-6 shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-amber-800">
                Your Habit Streak
              </h2>
              <p className="text-amber-600 text-sm">
                Monthly visualization of your check-ins
              </p>
            </div>
            <div className="flex items-center gap-2 text-amber-700 text-sm">
              <CalendarDays className="w-4 h-4" />
              <span>Last 6 months</span>
            </div>
          </div>

          <MonthlyStreak checkInDates={checkInDates} />
        </motion.div>
      </div>
    </div>
  );
}
