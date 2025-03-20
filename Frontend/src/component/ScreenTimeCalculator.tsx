
import { useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion"
import { AlertCircle, Clock, Eye } from "lucide-react"
import { Link } from "react-router-dom"

export default function ScreenTimeCalculator() {
  const [screenTime, setScreenTime] = useState<string>("")
  const [totalScreenTime, setTotalScreenTime] = useState<number | null>(null)
  const [showSolutions, setShowSolutions] = useState(false)

  const calculateScreenTime = () => {
    if (!screenTime || isNaN(Number(screenTime))) {
      return
    }

    const dailyHours = Number(screenTime)
    const totalHours = dailyHours * 365 * 30
    setTotalScreenTime(totalHours)
  }

  const problems = [
    {
      title: "Digital Eye Strain",
      description: "Extended screen time can cause eye fatigue, dry eyes, blurred vision, and headaches.",
      solution:
        "Follow the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds. Use blue light filters and ensure proper lighting.",
    },
    {
      title: "Poor Sleep Quality",
      description: "Blue light from screens can disrupt your circadian rhythm and melatonin production.",
      solution: "Avoid screens 1-2 hours before bedtime. Use night mode or blue light filters in the evening.",
    },
    {
      title: "Sedentary Lifestyle",
      description: "Excessive screen time often leads to reduced physical activity and associated health problems.",
      solution:
        "Take regular movement breaks. Aim for at least 30 minutes of physical activity daily. Consider a standing desk.",
    },
    {
      title: "Neck and Back Pain",
      description: "Poor posture while using devices can lead to musculoskeletal problems.",
      solution: "Maintain proper ergonomics. Position screens at eye level and take regular stretching breaks.",
    },
  ]

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="mx-auto max-w-3xl">
        <Card className="border-yellow-300 shadow-lg bg-yellow-50">
          <CardHeader className="bg-yellow-50">
            <CardTitle className="text-2xl md:text-3xl text-center text-yellow-800">Screen Time Calculator</CardTitle>
            <CardDescription className="text-center text-yellow-700">
              Discover how much time you'll spend on screens over the next 30 years
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="screenTime" className="text-yellow-800">
                  Your daily screen time (hours)
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="screenTime"
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="Enter hours per day"
                    value={screenTime}
                    onChange={(e) => setScreenTime(e.target.value)}
                    className="border-yellow-300 focus-visible:ring-yellow-500"
                  />
                  <Button onClick={calculateScreenTime} className="bg-yellow-500 hover:bg-yellow-600 text-white">
                    Calculate
                  </Button>
                </div>
              </div>

              {totalScreenTime !== null && (
                <div className="rounded-lg bg-yellow-50 p-4 border border-yellow-200">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-yellow-800 mb-2">
                    <Clock className="h-5 w-5" />
                    Your Screen Time Impact
                  </h3>
                  <p className="text-yellow-700">Based on your current usage, you will spend approximately:</p>
                  <p className="text-2xl font-bold text-yellow-800 my-2">{totalScreenTime.toLocaleString()} hours</p>
                  <p className="text-yellow-700">
                    on screens over the next 30 years. That's equivalent to about{" "}
                    <span className="font-semibold">{Math.round((totalScreenTime / 24 / 365) * 10) / 10} years</span> of
                    your life!
                  </p>
                </div>
              )}

              {totalScreenTime !== null && (
                <div>
                  <Button
                    onClick={() => setShowSolutions(!showSolutions)}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                  >
                    {showSolutions ? "Hide Health Solutions" : "Show Health Solutions"}
                  </Button>
                  <Link to="/screenassistant">
                  <Button
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white my-4"
                    
                  >
                    Show Personalised Solution
                  </Button>
                  </Link>

                  {showSolutions && (
                    <div className="mt-4 rounded-lg border border-yellow-200 bg-white">
                      <div className="p-4 bg-yellow-50 rounded-t-lg">
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-yellow-800">
                          <AlertCircle className="h-5 w-5" />
                          Potential Health Concerns & Solutions
                        </h3>
                        <p className="text-yellow-700 text-sm mt-1">
                          Extended screen time can lead to these health issues. Expand each item to learn more.
                        </p>
                      </div>

                      <Accordion type="single" collapsible className="p-4">
                        {problems.map((problem, index) => (
                          <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-yellow-800 hover:text-yellow-600">
                              {problem.title}
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-2 pt-2">
                                <p className="text-gray-700">{problem.description}</p>
                                <div className="bg-yellow-50 p-3 rounded-md">
                                  <p className="text-sm font-medium text-yellow-800">Solution:</p>
                                  <p className="text-sm text-yellow-700">{problem.solution}</p>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="bg-yellow-50 flex justify-center border-t border-yellow-200">
            <p className="text-sm text-yellow-700 flex items-center gap-1">
              <Eye className="h-4 w-4" />
              Take care of your digital wellbeing
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

