"use client";

import { Button } from "@/components/ui/button";
import { newRequest } from "@/utils/request";
import { CircleCheck, CirclePlus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

interface Habit {
  habitName: string;
  description: string;
  id?: string;
}

function Habit() {
  const [habits, setHabit] = useState<Habit[]>([]);
  const [habitName, setHabitName] = useState("");
  const [description, setDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHabits();
  }, []);
  const deleteHabits = async (habitId: string) => {
    try {
      setDeleteLoading(habitId);
      const response = await newRequest.delete(`/habit/deleteHabit/${habitId}`);
      console.log(response);

      // Reset loading state
      setDeleteLoading(null);

      // Fetch updated habits from the server
      fetchHabits();
    } catch (error) {
      setError("Failed to delete Habit");
      console.error("Error deleting habits:", error);
      setDeleteLoading(null); // Reset loading state even on error
    }
  };
  const fetchHabits = async () => {
    try {
      setLoading(true);
      console.log("Cookies:", document.cookie)
      const response = await newRequest.get("/habit/getHabit");
      console.log(response);
      setHabit(response.data.getHabit);
      setError("");
    } catch (error) {
      setError("Failed to load Habits");
      console.error("Error fetching habits:", error);
    } finally {
      setLoading(false);
    }
  };

  const addHabitHandler = async () => {
    try {
      setLoading(true);
      const response = await newRequest.post("/habit/addHabit", {
        habitName: habitName,
        description: description,
      });
      console.log(response)
      setHabitName("");
      setDescription("");
      setShowModal(false);
      setError("");
      fetchHabits();
    } catch (error) {
      setError("Failed to add habit");
      console.error("Error adding habit:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <CircleCheck className="text-green-600" />
            <h1 className="ml-2 text-xl font-bold">My Habits</h1>
          </div>
          <div>
            <Button onClick={() => setShowModal(true)}>
              <CirclePlus className="mr-2" />
              Add Habit
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading && habits.length === 0 ? (
            <div className="p-8 text-center">
              <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your habits...</p>
            </div>
          ) : habits.length === 0 ? (
            <div className="p-8 text-center">
              <div className="bg-gray-100 rounded-full p-4 inline-flex mb-4">
                <CirclePlus className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-2">No habits added yet</p>
              <p className="text-gray-400 text-sm">
                Start building better routines by adding your first habit
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {habits.map((habit, index) => (
                <li
                  key={index}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {habit.habitName}
                      </h3>
                      <p className="text-gray-600 mt-1">{habit.description}</p>
                    </div>
                    <button
                      type="button"
                      className="text-gray-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-full"
                      onClick={() => {
                        console.log(
                          "Delete button clicked for habit ID:",
                          habit.id
                        );
                        if (habit.id) deleteHabits(habit.id);
                      }}
                      disabled={deleteLoading === habit.id}
                    >
                      {deleteLoading === habit.id ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Habit</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Habit Name
                </label>
                <input
                  type="text"
                  value={habitName}
                  placeholder="Enter habit name"
                  onChange={(e) => setHabitName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  value={description}
                  placeholder="Enter description"
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div className="flex justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button onClick={addHabitHandler} disabled={loading}>
                  {loading ? "Adding..." : "Add Habit"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Habit;
