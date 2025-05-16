import type React from "react";

import { useContext, useEffect, useState } from "react";
import { newRequest } from "@/utils/request";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarIcon, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import AuthContext from "@/component/context/AuthContext";

export default function DailyPlanForm() {
  // Individual state for each input field
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [planName, setPlanName] = useState("");
  const [startingtime, setStartingTime] = useState("");
  const [endtime,setEndTime]=useState("")
  const [priority, setPriority] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  

  // UI state
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Individual handlers for each input field
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setDate(e.target.value);
  const handlePlanNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPlanName(e.target.value);
  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setStartingTime(e.target.value);
  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEndTime(e.target.value);
  const handlePriorityChange = (value: string) => setPriority(value);
  const handleCategoryChange = (value: string) => setCategory(value);
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setDescription(e.target.value);
  

  const resetForm = () => {
    setDate(new Date().toISOString().split("T")[0]);
    setPlanName("");
    setStartingTime("")
    setEndTime("")
    setPriority("");
    setCategory("");
    setDescription("");
    
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await newRequest.post("/daily/addplan", {
        date,
        planName,
        startingtime,
        endtime,
        priority,
        category,
        description,
     
      });

      setMessage(response.data.message);
      resetForm();
      navigate("/dashboard")
      await newRequest.post("/google/calendar/create-event", {
        date,
        startingtime,
        endtime,
        planName,
        description,
       
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add plan");
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-500";
      case "Medium":
        return "text-amber-500";
      case "Low":
        return "text-green-500";
      default:
        return "";
    }
  };
  const categoryColor = (category: string) => {
    switch (category) {
      case "Health":
        return "bg-blue-100 text-blue-600";
      case "Work":
        return "bg-teal-100 text-indigo-600";
      case "Personal":
        return "bg-emerald-100 text-emerald-600";
      case "Study":
        return "bg-cyan-100 text-cyan-600";
      default:
        return "bg-teal-100 text-teal-600";
    }
  };
  const navigate=useNavigate()

  // const {auth}=useContext(AuthContext)

  // useEffect(()=>{
  //   if(!auth){
  //     navigate("/signin")
  //   }
  // },[auth])

  return (
    <div className="w-screen h-screen  overflow-hidden bg-black">
    <Card className="w-full max-w-3xl mx-auto shadow-lg mt-6 py-0 border border-blue-400 rounded-xl">
      <CardHeader className="space-y-1 bg-gradient-to-r from-blue-50 to-blue-100 border-b pt-2 rounded-xl">
        <CardTitle className="text-2xl font-bold text-center">
          Daily Plan
        </CardTitle>
        <CardDescription className="text-center pb-2">
          Add a new task to your daily schedule
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        {message && (
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <CheckCircle className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Success</AlertTitle>
            <AlertDescription className="text-blue-700">
              {message}
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">Error</AlertTitle>
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-slate-500" />
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={handleDateChange}
                className="focus-visible:ring-slate-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-500" />
                Starting Time
              </Label>
              <Input
                id="time"
                type="time"
                value={startingtime}
                onChange={handleStartTimeChange}
                className="focus-visible:ring-slate-400"
                step="60"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-500" />
                Ending Time
              </Label>
              <Input
                id="time"
                type="time"
                value={endtime}
                onChange={handleEndTimeChange}
                className="focus-visible:ring-slate-400"
                step="60"
                required
              />
            </div>
          </div>

          

          <div className="space-y-2">
            <Label htmlFor="planName">Plan Name</Label>
            <Input
              id="planName"
              type="text"
              value={planName}
              onChange={handlePlanNameChange}
              className="focus-visible:ring-slate-400"
              placeholder="What do you need to do?"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={priority}
                onValueChange={handlePriorityChange}
                required
              >
                <SelectTrigger
                  id="priority"
                  className={cn(
                    "focus-visible:ring-slate-400",
                    priority && getPriorityColor(priority)
                  )}
                >
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High" className="text-red-500">
                    High
                  </SelectItem>
                  <SelectItem value="Medium" className="text-amber-500">
                    Medium
                  </SelectItem>
                  <SelectItem value="Low" className="text-green-500">
                    Low
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={category}
                onValueChange={handleCategoryChange}
                required
              >
                <SelectTrigger
                  id="priority"
                  className={cn(
                    "focus-visible:ring-slate-400",
                    category && categoryColor(category)
                  )}
                >
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Work" className="text-indigo-600">
                    Work
                  </SelectItem>
                  <SelectItem value="Personal" className="text-emerald-600">
                    Personal
                  </SelectItem>
                  <SelectItem value="Health" className="text-blue-600">
                    Health
                  </SelectItem>
                  <SelectItem value="Study" className="text-cyan-500">
                    Study
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={handleDescriptionChange}
              className="min-h-[100px] focus-visible:ring-slate-400"
              placeholder="Add any additional details about this task..."
            />
          </div>

          <CardFooter className="px-0 pt-2 mb-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full transition-all duration-200 bg-blue-500"
              variant="default"
            >
              {loading ? "Adding..." : "Add to Schedule"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
</div>
  );
}
