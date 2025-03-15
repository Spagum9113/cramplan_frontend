"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Upload, FileText, Calendar } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function UploadPage() {
  const router = useRouter()
  const [courseFiles, setCourseFiles] = useState<File[]>([])
  const [examFiles, setExamFiles] = useState<File[]>([])
  const [daysUntilExam, setDaysUntilExam] = useState<number>(7)
  const [uploading, setUploading] = useState<boolean>(false)
  const [uploadProgress, setUploadProgress] = useState<number>(0)

  const handleCourseFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCourseFiles(Array.from(e.target.files))
    }
  }

  const handleExamFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setExamFiles(Array.from(e.target.files))
    }
  }

  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value > 0) {
      setDaysUntilExam(value)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    // Simulate upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 5
      setUploadProgress(progress)

      if (progress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          router.push("/assessment")
        }, 500)
      }
    }, 200)
  }

  return (
    <div className="container py-12 pt-6">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-blue-600 mb-6">
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to Home
      </Link>

      <h1 className="text-2xl font-bold text-blue-700 mb-6">Upload Your Study Materials</h1>

      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Course Notes Upload Box */}
          <div className="flex-1">
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-blue-600 text-white p-4">
                <h2 className="text-lg font-medium">Course Notes</h2>
                <p className="text-sm text-blue-100">Upload your lecture notes, textbooks, and study guides</p>
              </div>
              <div className="p-6 bg-white">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-blue-200 rounded-lg p-8 text-center bg-blue-50">
                  <div className="mb-4">
                    <Upload className="mx-auto h-10 w-10 text-blue-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold">Upload your notes</span>
                    </p>
                    <p className="text-xs text-gray-500">PDF, DOCX, TXT (max 50MB)</p>
                  </div>
                  <Input
                    id="course-notes"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleCourseFilesChange}
                    accept=".pdf,.docx,.txt"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4 bg-white text-blue-600 border-blue-300 hover:bg-blue-50"
                    onClick={() => document.getElementById("course-notes")?.click()}
                  >
                    Select Files
                  </Button>

                  {courseFiles.length > 0 && (
                    <div className="mt-4 w-full">
                      <p className="text-sm font-medium text-left">Selected Files ({courseFiles.length})</p>
                      <div className="max-h-32 overflow-y-auto mt-2 space-y-2">
                        {courseFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center p-2 rounded-md bg-blue-50 border border-blue-100"
                          >
                            <FileText className="h-4 w-4 mr-2 text-blue-500" />
                            <span className="text-sm truncate">{file.name}</span>
                            <span className="text-xs text-gray-500 ml-auto">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Past Exams Upload Box */}
          <div className="flex-1">
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-blue-600 text-white p-4">
                <h2 className="text-lg font-medium">Past Exams</h2>
                <p className="text-sm text-blue-100">Upload previous exams, quizzes, and practice tests</p>
              </div>
              <div className="p-6 bg-white">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-blue-200 rounded-lg p-8 text-center bg-blue-50">
                  <div className="mb-4">
                    <Upload className="mx-auto h-10 w-10 text-blue-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold">Upload past exams</span>
                    </p>
                    <p className="text-xs text-gray-500">PDF, DOCX, TXT (max 50MB)</p>
                  </div>
                  <Input
                    id="past-exams"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleExamFilesChange}
                    accept=".pdf,.docx,.txt"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4 bg-white text-blue-600 border-blue-300 hover:bg-blue-50"
                    onClick={() => document.getElementById("past-exams")?.click()}
                  >
                    Select Files
                  </Button>

                  {examFiles.length > 0 && (
                    <div className="mt-4 w-full">
                      <p className="text-sm font-medium text-left">Selected Files ({examFiles.length})</p>
                      <div className="max-h-32 overflow-y-auto mt-2 space-y-2">
                        {examFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center p-2 rounded-md bg-blue-50 border border-blue-100"
                          >
                            <FileText className="h-4 w-4 mr-2 text-blue-500" />
                            <span className="text-sm truncate">{file.name}</span>
                            <span className="text-xs text-gray-500 ml-auto">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Days Until Exam Box - Centered */}
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-blue-600 text-white p-4">
                <h2 className="text-lg font-medium">Days Until Exam</h2>
                <p className="text-sm text-blue-100">Enter how many days you have to prepare</p>
              </div>
              <div className="p-6 bg-white">
                <div className="flex items-center space-x-4">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <Input
                    id="days"
                    type="number"
                    min="1"
                    value={daysUntilExam}
                    onChange={handleDaysChange}
                    className="flex-1 border-blue-200 bg-blue-50 focus:border-blue-400"
                    placeholder="Enter number of days"
                  />
                  <span className="text-gray-500">days</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Button */}
        <div className="mt-6">
          {uploading ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Uploading and analyzing materials...</span>
                <span className="text-sm text-gray-500">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2 bg-blue-100" />
            </div>
          ) : (
            <Button
              onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg"
              disabled={courseFiles.length === 0 && examFiles.length === 0}
            >
              Upload and Get A Quick Assessment
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

