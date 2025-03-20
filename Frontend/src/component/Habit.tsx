import { Button } from "@/components/ui/button"
import { newRequest } from "@/utils/request"
import axios from "axios"
import { CircleCheck, CirclePlus, X } from "lucide-react"
import { useEffect, useState } from "react"
interface Habit{
    habitName:string
    description:string
} 
function Habit(){
    const [habits,setHabit]=useState<Habit[]>([])
    const [habitName,setHabitName]=useState("")
    const  [description,setDescription]=useState("")
    const  [showModal,setShowModal]=useState(false);
    const [loading,setLoading]=useState(false)
    const [error, setError] = useState("")
    

    useEffect(()=>{
        fetchHabits();
    },[])
    const fetchHabits=async()=>{
        try {
            setLoading(true)
            const response=await newRequest.get("/habit/getHabit")
            console.log(response)
            setHabit(response.data.getHabit)
            setError("")
        } catch (error) {
            setError("Failed to load Habits")
            console.error("Error fetching habits:", error)
        }
        finally{
            setLoading(false)
        }
    }
    const addHabitHandler=async()=>{
        try {
            setShowModal(true)
            const response=await newRequest.post("/habit/addHabit",
                {
                   habitName:habitName,
                   description:description 
                }
             )
             setHabitName("")
             setDescription("")
             setShowModal(false)
             setError("")
             fetchHabits()
        } catch (error) {
            setError("Failed to add habit")
            console.error("Error adding habit:", error)
        }
        finally{
            setLoading(false)
        }
    }
    return (
        <div>
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
            </div>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            <div className="bg-white rounded shadow">
                {loading ? (
                    <div className="p-4 text-center">Loading...</div>
                ):
                habits.length===0 ? (
                    <div className="p-4 text-center text-gray-500">No habits added yet</div>
 
                ):
                (
                    <ul className="divide-y divide-gray-200">
                        {habits.map((habit,index)=>(
                            <li key={index} className="p-4">
                                <h3 className="font-medium">{habit.habitName}</h3>
                                <p>{habit.description}</p>
 
                            </li>
                        ))}

                    </ul>
                )
                }

            </div>
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Add New Habit</h2>
                            <button onClick={()=>setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                                <X/>
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
                                onChange={(e)=>setHabitName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <input
                                value={description}
                                placeholder="Enter description"
                                onChange={(e)=>setDescription(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-md"
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
                                <Button 
                                    onClick={addHabitHandler}
                                    disabled={loading}
                                >
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
export default Habit
