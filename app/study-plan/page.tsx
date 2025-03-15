"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, CheckCircle, Clock, BookOpen } from "lucide-react"
import { Progress } from "@/components/ui/progress"

// Sample study plan data (in a real app, this would be generated based on assessment and materials)
const studyPlanData = {
  days: [
    {
      id: 1,
      date: "Day 1",
      topics: [
        {
          id: "topic-1-1",
          title: "Introduction to Cell Biology",
          duration: 60,
          completed: false,
          description: "Learn about the basic structure and function of cells, including organelles and their roles.",
          subtopics: ["Cell Structure Overview", "Cell Membrane Functions", "Organelles and Their Roles"],
        },
        {
          id: "topic-1-2",
          title: "Basic Object-Oriented Programming Concepts",
          duration: 45,
          completed: false,
          description:
            "Understand the fundamental principles of OOP including encapsulation, inheritance, and polymorphism.",
          subtopics: ["Classes and Objects", "Encapsulation", "Inheritance Basics"],
        },
      ],
    },
    {
      id: 2,
      date: "Day 2",
      topics: [
        {
          id: "topic-2-1",
          title: "Cellular Respiration",
          duration: 75,
          completed: false,
          description: "Explore how cells convert nutrients into energy through various metabolic pathways.",
          subtopics: ["Glycolysis", "Krebs Cycle", "Electron Transport Chain"],
        },
        {
          id: "topic-2-2",
          title: "Advanced OOP and Design Patterns",
          duration: 60,
          completed: false,
          description: "Learn about advanced OOP concepts and common design patterns used in software development.",
          subtopics: ["Polymorphism in Depth", "Abstract Classes vs Interfaces", "Common Design Patterns"],
        },
      ],
    },
    {
      id: 3,
      date: "Day 3",
      topics: [
        {
          id: "topic-3-1",
          title: "Macroeconomics Fundamentals",
          duration: 90,
          completed: false,
          description: "Understand key macroeconomic concepts including GDP, inflation, and fiscal policy.",
          subtopics: [
            "GDP and Economic Growth",
            "Inflation and Monetary Policy",
            "Fiscal Policy and Government Spending",
          ],
        },
      ],
    },
    {
      id: 4,
      date: "Day 4",
      topics: [
        {
          id: "topic-4-1",
          title: "Chemical Bonding",
          duration: 60,
          completed: false,
          description: "Learn about different types of chemical bonds and their properties.",
          subtopics: ["Ionic Bonds", "Covalent Bonds", "Hydrogen Bonds and Van der Waals Forces"],
        },
        {
          id: "topic-4-2",
          title: "Mathematical Operations and Order",
          duration: 45,
          completed: false,
          description: "Review the order of operations in mathematics and practice solving complex expressions.",
          subtopics: ["PEMDAS Rule", "Evaluating Complex Expressions", "Common Mistakes and How to Avoid Them"],
        },
      ],
    },
    {
      id: 5,
      date: "Day 5",
      topics: [
        {
          id: "topic-5-1",
          title: "Cell Division and Reproduction",
          duration: 75,
          completed: false,
          description: "Explore the processes of mitosis and meiosis and their role in cell reproduction.",
          subtopics: ["Mitosis Phases", "Meiosis and Genetic Variation", "Cell Cycle Regulation"],
        },
      ],
    },
    {
      id: 6,
      date: "Day 6",
      topics: [
        {
          id: "topic-6-1",
          title: "Microeconomics and Market Structures",
          duration: 90,
          completed: false,
          description: "Learn about supply and demand, market equilibrium, and different market structures.",
          subtopics: ["Supply and Demand Analysis", "Market Equilibrium", "Perfect Competition vs. Monopoly"],
        },
      ],
    },
    {
      id: 7,
      date: "Day 7",
      topics: [
        {
          id: "topic-7-1",
          title: "Final Review and Practice Exam",
          duration: 120,
          completed: false,
          description: "Comprehensive review of all topics and a practice exam to test your knowledge.",
          subtopics: ["Key Concepts Review", "Practice Exam", "Targeted Review of Weak Areas"],
        },
      ],
    },
  ],
}

export default function StudyPlanPage() {
  const [activeDay, setActiveDay] = useState("1")
  const [completedTopics, setCompletedTopics] = useState<string[]>([])

  const handleMarkComplete = (topicId: string) => {
    if (completedTopics.includes(topicId)) {
      setCompletedTopics(completedTopics.filter((id) => id !== topicId))
    } else {
      setCompletedTopics([...completedTopics, topicId])
    }
  }

  const calculateProgress = () => {
    const totalTopics = studyPlanData.days.reduce((acc, day) => acc + day.topics.length, 0)
    return (completedTopics.length / totalTopics) * 100
  }

  return (
    <div className="container max-w-6xl py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <Link href="/" className="inline-flex items-center text-sm font-medium text-primary mb-2">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Home
          </Link>
          <h1 className="text-3xl font-bold">Your Study Plan</h1>
          <p className="text-gray-500">Personalized 7-day plan to prepare for your exam</p>
        </div>
        <Card className="w-full md:w-auto">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Overall Progress</span>
                <div className="flex items-center space-x-2">
                  <Progress value={calculateProgress()} className="h-2 w-40" />
                  <span className="text-sm font-medium">{Math.round(calculateProgress())}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Study Schedule</CardTitle>
            <CardDescription>Select a day to view topics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {studyPlanData.days.map((day) => {
                const dayTopicsCompleted = day.topics.every((topic) => completedTopics.includes(topic.id))

                return (
                  <Button
                    key={day.id}
                    variant={activeDay === day.id.toString() ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setActiveDay(day.id.toString())}
                  >
                    <div className="flex items-center w-full">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{day.date}</span>
                      {dayTopicsCompleted && <CheckCircle className="h-4 w-4 ml-auto text-green-500" />}
                    </div>
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-3">
          <Tabs value={activeDay} onValueChange={setActiveDay} className="w-full">
            <TabsList className="hidden">
              {studyPlanData.days.map((day) => (
                <TabsTrigger key={day.id} value={day.id.toString()}>
                  {day.date}
                </TabsTrigger>
              ))}
            </TabsList>

            {studyPlanData.days.map((day) => (
              <TabsContent key={day.id} value={day.id.toString()} className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>{day.date} Study Topics</CardTitle>
                    <CardDescription>Complete these topics to stay on track with your study plan</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {day.topics.map((topic) => {
                        const isCompleted = completedTopics.includes(topic.id)

                        return (
                          <div
                            key={topic.id}
                            className={`p-4 rounded-lg border ${isCompleted ? "bg-green-50 border-green-200" : "bg-white"}`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <h3 className="font-medium text-lg">{topic.title}</h3>
                                <div className="flex items-center text-sm text-gray-500">
                                  <Clock className="h-4 w-4 mr-1" />
                                  <span>{topic.duration} minutes</span>
                                </div>
                              </div>
                              <Button
                                variant={isCompleted ? "outline" : "default"}
                                size="sm"
                                onClick={() => handleMarkComplete(topic.id)}
                              >
                                {isCompleted ? "Completed ✓" : "Mark as Complete"}
                              </Button>
                            </div>

                            <p className="mt-2 text-gray-600">{topic.description}</p>

                            <div className="mt-4">
                              <h4 className="text-sm font-medium mb-2">Key Subtopics:</h4>
                              <ul className="space-y-1">
                                {topic.subtopics.map((subtopic, index) => (
                                  <li key={index} className="text-sm flex items-start">
                                    <span className="inline-block h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs mr-2">
                                      {index + 1}
                                    </span>
                                    {subtopic}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="mt-4 pt-4 border-t">
                              <Link
                                href={`/learn/${topic.id}`}
                                className="inline-flex items-center text-sm font-medium text-primary"
                              >
                                <BookOpen className="mr-1 h-4 w-4" />
                                Start Learning
                              </Link>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  )
}

