"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"

// Sample quiz questions (in a real app, these would be generated based on uploaded materials)
const quizQuestions = [
  {
    id: 1,
    question: "What is the primary function of mitochondria in a cell?",
    options: ["Protein synthesis", "Energy production", "Cell division", "Waste removal"],
    correctAnswer: "Energy production",
  },
  {
    id: 2,
    question: "Which of the following is a key principle of object-oriented programming?",
    options: ["Sequential execution", "Encapsulation", "Procedural design", "Linear processing"],
    correctAnswer: "Encapsulation",
  },
  {
    id: 3,
    question: "In economics, what does GDP stand for?",
    options: [
      "Global Development Plan",
      "Gross Domestic Product",
      "General Distribution Process",
      "Growth and Development Percentage",
    ],
    correctAnswer: "Gross Domestic Product",
  },
  {
    id: 4,
    question: "Which of the following is NOT a type of chemical bond?",
    options: ["Ionic bond", "Covalent bond", "Hydrogen bond", "Magnetic bond"],
    correctAnswer: "Magnetic bond",
  },
  {
    id: 5,
    question: "What is the correct order of operations in mathematics?",
    options: [
      "Addition, Subtraction, Multiplication, Division, Exponents, Parentheses",
      "Parentheses, Exponents, Multiplication, Division, Addition, Subtraction",
      "Parentheses, Exponents, Addition, Subtraction, Multiplication, Division",
      "Exponents, Parentheses, Multiplication, Division, Addition, Subtraction",
    ],
    correctAnswer: "Parentheses, Exponents, Multiplication, Division, Addition, Subtraction",
  },
]

export default function AssessmentPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)

  const handleAnswer = (answer: string) => {
    setAnswers({
      ...answers,
      [quizQuestions[currentQuestion].id]: answer,
    })
  }

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateScore = () => {
    let score = 0
    Object.keys(answers).forEach((questionId) => {
      const question = quizQuestions.find((q) => q.id === Number.parseInt(questionId))
      if (question && answers[Number.parseInt(questionId)] === question.correctAnswer) {
        score++
      }
    })
    return score
  }

  const getLevel = () => {
    const score = calculateScore()
    if (score <= 2) return "Beginner"
    if (score <= 4) return "Intermediate"
    return "Advanced"
  }

  const handleFinish = () => {
    router.push("/study-plan")
  }

  if (showResults) {
    const score = calculateScore()
    const level = getLevel()

    return (
      <div className="container max-w-4xl py-12">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Assessment Results</CardTitle>
            <CardDescription>Based on your answers, we've determined your current knowledge level.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg">
              <div className="text-5xl font-bold mb-2">
                {score}/{quizQuestions.length}
              </div>
              <p className="text-gray-500">Correct Answers</p>
            </div>

            <div className="space-y-2">
              <p className="font-medium">Your Knowledge Level:</p>
              <div className="p-4 bg-primary/10 rounded-lg flex items-center">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground mr-4">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-lg">{level}</p>
                  <p className="text-sm text-gray-500">
                    {level === "Beginner" && "We'll focus on building a strong foundation."}
                    {level === "Intermediate" && "We'll help you strengthen your knowledge."}
                    {level === "Advanced" && "We'll focus on advanced concepts and mastery."}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-medium">What's Next?</p>
              <p className="text-gray-500">
                Based on your assessment and uploaded materials, we'll create a personalized study plan tailored to your
                knowledge level and the time you have until your exam.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleFinish} className="w-full">
              Generate My Study Plan
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const question = quizQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100

  return (
    <div className="container max-w-4xl py-12">
      <Link href="/upload" className="inline-flex items-center text-sm font-medium text-primary mb-6">
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to Upload
      </Link>

      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Knowledge Assessment</CardTitle>
            <span className="text-sm text-gray-500">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </span>
          </div>
          <CardDescription>Answer these questions to help us determine your current knowledge level.</CardDescription>
          <Progress value={progress} className="h-2 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">{question.question}</h3>
              <RadioGroup value={answers[question.id] || ""} onValueChange={handleAnswer} className="space-y-3">
                {question.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 rounded-md border p-3">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
            Previous
          </Button>
          <Button onClick={handleNext} disabled={!answers[question.id]}>
            {currentQuestion < quizQuestions.length - 1 ? "Next" : "Finish"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

