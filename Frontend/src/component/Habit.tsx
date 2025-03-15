import { Button } from "@/components/ui/button"
import { CircleCheck, CirclePlus } from "lucide-react"

function Habit(){
    return (
        <div>
           <div className="flex items-center justify-between">
           <div className="flex items-center">
           <CircleCheck />
           <h1 className="ml-2 text-xl font-bold">My Habits</h1>
           </div>
           <div>
            <Button>
            <CirclePlus /> 
            Add Habit</Button>
           </div>
           </div>
           <div></div>
        </div>
    )
}
export default Habit
