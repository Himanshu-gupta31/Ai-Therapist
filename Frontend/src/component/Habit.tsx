import { Button } from "@/components/ui/button"
import { newRequest } from "@/utils/request"
import axios from "axios"
import { CircleCheck, CirclePlus } from "lucide-react"
import { useEffect, useState } from "react"
interface Habit{
    habitName:string
    description:string
}
function Habit(){
    const [habits,setHabit]=useState([])
    const [habitName,setHabitName]=useState("")
    const  [description,setDescription]=useState("")
    const  [showModal,setShowModal]=useState(false);
    const [loading,setLoading]=useState(false)
    const [error, setError] = useState("")
    

    useEffect(()=>{
        fetchHabits();
    })
    const fetchHabits=async()=>{
        try {
            setLoading(true)
            const response=await newRequest.get("/getHabits")
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
            const response=await axios.post("/addHabit",
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
                            <li key={index}>
                                {/* <h3>{habit.habitName}</h3> */}
                            </li>
                        ))}

                    </ul>
                )
                }

            </div>
        </div>
    )
}
export default Habit
