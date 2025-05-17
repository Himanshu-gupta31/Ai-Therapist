import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

const Timer = () => {
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [inputHours, setInputHours] = useState("")
  const [inputMinutes, setInputMinutes] = useState("")
  const [inputSeconds, setInputSeconds] = useState("")

  const handleStart = () => {
    const hours = Number.parseInt(inputHours) || 0
    const minutes = Number.parseInt(inputMinutes) || 0
    const seconds = Number.parseInt(inputSeconds) || 0

    const totalSeconds = hours * 3600 + minutes * 60 + seconds

    if (totalSeconds > 0) {
      setSecondsLeft(totalSeconds)
      setIsRunning(true)
    }
  }

  const handlePause = () => setIsRunning(!isRunning)

  const handleReset = () => {
    setIsRunning(false)
    setInputHours("")
    setInputMinutes("")
    setInputSeconds("")
    setSecondsLeft(0)
  }

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1)
      }, 1000)
    }

    if (secondsLeft === 0) {
      setIsRunning(false)
    }

    return () => clearInterval(interval)
  }, [isRunning, secondsLeft])

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
  }

  // Calculate percentage for circular progress
  const totalInitialSeconds =
    (Number.parseInt(inputHours) || 0) * 3600 +
    (Number.parseInt(inputMinutes) || 0) * 60 +
    (Number.parseInt(inputSeconds) || 0)

  const percentage = totalInitialSeconds > 0 ? (secondsLeft / totalInitialSeconds) * 100 : 0

  // Calculate stroke-dasharray and stroke-dashoffset for SVG circle
  const radius = 85
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex items-center justify-center min-h-screen bg-black p-4">
      <Card className="w-full max-w-md bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold text-center text-white mb-6">Countdown Timer</h1>

          <div className="relative flex justify-center mb-8">
            
            <svg className="w-64 h-64 -rotate-90" viewBox="0 0 200 200">
              
              <circle cx="100" cy="100" r={radius} fill="transparent" stroke="#1e293b" strokeWidth="10" />
              
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="transparent"
                stroke="#3b82f6"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={isRunning || secondsLeft > 0 ? strokeDashoffset : circumference}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>

            {/* Timer display in center of circle */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-blue-500 tabular-nums">
              {formatTime(secondsLeft)}
            </div>
          </div>

          {!isRunning && secondsLeft === 0 && (
            <div className="grid grid-cols-3 gap-2 mb-6">
              <div className="flex flex-col">
                <label className="text-sm text-gray-400 mb-1">Hours</label>
                <Input
                  type="number"
                  placeholder="00"
                  value={inputHours}
                  onChange={(e) => setInputHours(e.target.value)}
                  min="0"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-400 mb-1">Minutes</label>
                <Input
                  type="number"
                  placeholder="00"
                  value={inputMinutes}
                  onChange={(e) => setInputMinutes(e.target.value)}
                  min="0"
                  max="59"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-400 mb-1">Seconds</label>
                <Input
                  type="number"
                  placeholder="00"
                  value={inputSeconds}
                  onChange={(e) => setInputSeconds(e.target.value)}
                  min="0"
                  max="59"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
          )}

          <div className="flex justify-center space-x-4">
            {isRunning ? (
              <Button onClick={handlePause} className="bg-blue-600 hover:bg-blue-700 text-white">
                Pause
              </Button>
            ) : secondsLeft === 0 ? (
              <Button onClick={handleStart} className="bg-blue-600 hover:bg-blue-700 text-white">
                Start
              </Button>
            ) : (
              <Button onClick={handlePause} className="bg-blue-600 hover:bg-blue-700 text-white">
                Resume
              </Button>
            )}

            {(secondsLeft > 0 || isRunning) && (
              <Button
                onClick={handleReset}
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Timer
