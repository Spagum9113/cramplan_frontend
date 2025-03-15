"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, CheckCircle, Clock, BookOpen, Loader2, BookText } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

// Define interfaces for the API response data
interface SubTopic {
  sub_topic_title: string;
  sub_content_text: string;
}

interface TopicContent {
  topic_title: string;
  main_description: string;
  subtopics: SubTopic[];
}

interface StudyContent {
  topic: TopicContent[];
}

// Define interface for the transformed study plan data
interface StudyTopic {
  id: string;
  title: string;
  duration: number;
  completed: boolean;
  description: string;
  subtopics: string[];
  fullContent?: TopicContent;
}

interface StudyDay {
  id: number;
  date: string;
  topics: StudyTopic[];
}

interface StudyPlan {
  days: StudyDay[];
}

// Sample study plan data as fallback
const sampleStudyPlanData: StudyPlan = {
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
  const [studyContent, setStudyContent] = useState<StudyContent | null>(null)
  const [studyPlanData, setStudyPlanData] = useState(sampleStudyPlanData)
  const [isLoading, setIsLoading] = useState(true)
  const [expandedSubtopics, setExpandedSubtopics] = useState<Record<string, boolean>>({})
  const [activeTopic, setActiveTopic] = useState<string | null>(null)
  const [activeSubtopicIndex, setActiveSubtopicIndex] = useState<number | null>(null)
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({})

  // Load study content from localStorage on component mount
  useEffect(() => {
    try {
      const storedContent = localStorage.getItem('studyPlanContent')
      if (storedContent) {
        const parsedContent = JSON.parse(storedContent) as StudyContent
        console.log('Loaded study content from localStorage:', parsedContent)
        setStudyContent(parsedContent)
        
        // Transform the content into the study plan format
        if (parsedContent && parsedContent.topic && parsedContent.topic.length > 0) {
          const transformedData = transformContentToStudyPlan(parsedContent);
          setStudyPlanData(transformedData);
          
          // Set the first topic of the first day as active by default
          if (transformedData.days.length > 0 && transformedData.days[0].topics.length > 0) {
            setActiveTopic(transformedData.days[0].topics[0].id);
          }
        }
      }
      setIsLoading(false)
    } catch (error) {
      console.error('Error loading study content from localStorage:', error)
      setIsLoading(false)
      // Fall back to sample data if there's an error
    }
  }, [])

  // When active day changes, set the first topic of that day as active
  useEffect(() => {
    const day = studyPlanData.days.find(d => d.id.toString() === activeDay);
    if (day && day.topics.length > 0) {
      setActiveTopic(day.topics[0].id);
    }
  }, [activeDay, studyPlanData.days]);

  // Function to transform the API content into the study plan format
  const transformContentToStudyPlan = (content: StudyContent) => {
    // Distribute topics across days (for simplicity, we'll put 1-2 topics per day)
    const days = [];
    let topicCounter = 0;
    let dayCounter = 1;
    
    // Get the number of days until exam from localStorage
    const daysUntilExam = parseInt(localStorage.getItem('daysUntilExam') || '7');
    
    // Calculate how many topics per day
    const topicsPerDay = Math.ceil(content.topic.length / daysUntilExam);
    
    for (let i = 0; i < content.topic.length; i += topicsPerDay) {
      const dayTopics = [];
      
      for (let j = 0; j < topicsPerDay && i + j < content.topic.length; j++) {
        const apiTopic = content.topic[i + j];
        topicCounter++;
        
        // Create subtopics array from the API response
        const subtopics = apiTopic.subtopics.map(sub => sub.sub_topic_title);
        
        dayTopics.push({
          id: `topic-${dayCounter}-${j+1}`,
          title: apiTopic.topic_title,
          duration: 60, // Default duration
          completed: false,
          description: apiTopic.main_description,
          subtopics: subtopics,
          fullContent: apiTopic // Store the full content for detailed view
        });
      }
      
      days.push({
        id: dayCounter,
        date: `Day ${dayCounter}`,
        topics: dayTopics
      });
      
      dayCounter++;
    }
    
    return { days };
  };

  const handleMarkComplete = (topicId: string) => {
    if (completedTopics.includes(topicId)) {
      setCompletedTopics(completedTopics.filter((id) => id !== topicId))
    } else {
      setCompletedTopics([...completedTopics, topicId])
    }
  }

  const calculateProgress = () => {
    const totalTopics = studyPlanData.days.reduce((acc, day) => acc + day.topics.length, 0)
    return totalTopics > 0 ? (completedTopics.length / totalTopics) * 100 : 0
  }

  // Toggle subtopic expansion
  const toggleSubtopic = (topicId: string, subtopicIndex: number) => {
    const key = `${topicId}-${subtopicIndex}`;
    setExpandedSubtopics(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Check if a subtopic is expanded
  const isSubtopicExpanded = (topicId: string, subtopicIndex: number) => {
    const key = `${topicId}-${subtopicIndex}`;
    return expandedSubtopics[key] || false;
  };

  // Toggle topic expansion in sidebar
  const toggleTopicExpansion = (topicId: string) => {
    setExpandedTopics(prev => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));
  };

  // Check if a topic is expanded in sidebar
  const isTopicExpanded = (topicId: string) => {
    return expandedTopics[topicId] || false;
  };

  // Function to handle topic selection
  const handleTopicSelect = (topicId: string) => {
    setActiveTopic(topicId);
    setActiveSubtopicIndex(null); // Reset active subtopic when selecting a new topic
    
    // Don't auto-expand the topic when selected, just toggle it
    toggleTopicExpansion(topicId);
  };

  // Function to handle subtopic selection
  const handleSubtopicSelect = (topicId: string, subtopicIndex: number) => {
    setActiveTopic(topicId);
    setActiveSubtopicIndex(subtopicIndex);
    
    // Ensure the topic is expanded in the sidebar
    if (!isTopicExpanded(topicId)) {
      toggleTopicExpansion(topicId);
    }
    
    console.log(`Selected topic: ${topicId}, subtopic index: ${subtopicIndex}`);
  };

  // Check if a subtopic is active
  const isSubtopicActive = (topicId: string, subtopicIndex: number) => {
    return activeTopic === topicId && activeSubtopicIndex === subtopicIndex;
  };

  if (isLoading) {
    return (
      <div className="container max-w-6xl py-8 flex justify-center items-center min-h-[70vh]">
        <div className="text-center max-w-md mx-auto">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <BookText className="h-16 w-16 text-primary" />
              <Loader2 className="h-24 w-24 absolute -top-4 -left-4 text-primary/30 animate-spin" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4">Creating Your Personalized Study Plan</h2>
          <p className="text-gray-500 mb-6">We're analyzing your assessment results and generating a customized study plan tailored to your knowledge level.</p>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Analyzing results</span>
                <span>100%</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Curating topics</span>
                <span>100%</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Generating content</span>
                <span>75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Building study plan</span>
                <span>50%</span>
              </div>
              <Progress value={50} className="h-2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <Link href="/" className="inline-flex items-center text-sm font-medium text-primary mb-2">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Home
          </Link>
          <h1 className="text-3xl font-bold">Your Study Plan</h1>
          <p className="text-gray-500">Personalized study plan to prepare for your exam</p>
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
                const isDayActive = activeDay === day.id.toString();

                return (
                  <div key={day.id} className="mb-3">
                    <Button
                      variant={isDayActive ? "default" : "outline"}
                      className="w-full justify-start mb-1"
                      onClick={() => setActiveDay(day.id.toString())}
                    >
                      <div className="flex items-center w-full">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{day.date}</span>
                        {dayTopicsCompleted && <CheckCircle className="h-4 w-4 ml-auto text-green-500" />}
                      </div>
                    </Button>
                    
                    {/* Topic list - only show for active day */}
                    {isDayActive && (
                      <div className="pl-6 space-y-1 mt-2">
                        {day.topics.map((topic, index) => {
                          const isTopicActive = activeTopic === topic.id;
                          const isTopicCompleted = completedTopics.includes(topic.id);
                          const topicExpanded = isTopicExpanded(topic.id);
                          
                          return (
                            <div key={index} className="mb-2">
                              <Button
                                variant={isTopicActive && !activeSubtopicIndex ? "secondary" : "ghost"}
                                className="w-full justify-start h-9 px-3 mb-1"
                                onClick={() => handleTopicSelect(topic.id)}
                              >
                                <div className="flex items-center w-full">
                                  <BookOpen className="h-4 w-4 mr-2 flex-shrink-0" />
                                  <span className="truncate text-sm">{topic.title}</span>
                                  <div className="ml-auto flex items-center">
                                    {isTopicCompleted && (
                                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mr-1" />
                                    )}
                                    <svg 
                                      className={`h-4 w-4 transform transition-transform ${topicExpanded ? 'rotate-180' : ''}`} 
                                      fill="none" 
                                      viewBox="0 0 24 24" 
                                      stroke="currentColor"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleTopicExpansion(topic.id);
                                      }}
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </div>
                                </div>
                              </Button>
                              
                              {/* Subtopics list */}
                              {topicExpanded && (
                                <div className="pl-6 space-y-1 mt-1">
                                  {topic.subtopics.map((subtopic, subtopicIndex) => (
                                    <Button
                                      key={subtopicIndex}
                                      variant={isSubtopicActive(topic.id, subtopicIndex) ? "secondary" : "ghost"}
                                      size="sm"
                                      className="w-full justify-start h-7 px-2 text-xs"
                                      onClick={() => handleSubtopicSelect(topic.id, subtopicIndex)}
                                    >
                                      <div className="flex items-center w-full">
                                        <div className="w-1 h-1 rounded-full bg-gray-400 mr-2 flex-shrink-0"></div>
                                        <span className="truncate">{subtopic}</span>
                                      </div>
                                    </Button>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-3">
          {/* Show only the active topic instead of all topics for the day */}
          {studyPlanData.days.map((day) => (
            <div key={day.id} className={activeDay === day.id.toString() ? 'block' : 'hidden'}>
              <Card>
                <CardHeader>
                  <CardTitle>{day.date} Study Topics</CardTitle>
                  <CardDescription>Complete these topics to stay on track with your study plan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {day.topics.map((topic) => {
                      const isCompleted = completedTopics.includes(topic.id);
                      const fullContent = topic.fullContent;
                      const isActive = activeTopic === topic.id;

                      // Only render the active topic
                      if (!isActive) return null;

                      // If a subtopic is selected, show only that subtopic content
                      if (activeSubtopicIndex !== null) {
                        const subtopic = topic.subtopics[activeSubtopicIndex];
                        const hasContent = fullContent && fullContent.subtopics && fullContent.subtopics[activeSubtopicIndex];
                        
                        if (hasContent) {
                          return (
                            <div key={topic.id} className="rounded-lg border bg-white">
                              <div className="p-4 border-b bg-gray-50">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="mr-2 p-0 h-8 w-8"
                                      onClick={() => setActiveSubtopicIndex(null)}
                                    >
                                      <ArrowLeft className="h-4 w-4" />
                                    </Button>
                                    <h3 className="font-medium text-lg">{subtopic}</h3>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className={isCompleted ? "text-green-600" : ""}
                                    onClick={() => handleMarkComplete(topic.id)}
                                  >
                                    {isCompleted ? "Completed" : "Mark Complete"}
                                  </Button>
                                </div>
                              </div>
                              <div className="p-6">
                                <div className="prose prose-sm max-w-none prose-headings:font-medium prose-headings:text-primary prose-h3:text-base prose-h3:mt-4 prose-h3:mb-2 prose-p:my-2 prose-ul:my-2 prose-li:my-0.5 prose-strong:text-primary">
                                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {fullContent.subtopics[activeSubtopicIndex].sub_content_text}
                                  </ReactMarkdown>
                                </div>
                              </div>
                            </div>
                          );
                        } else {
                          // If content is not available, show a message
                          return (
                            <div key={topic.id} className="rounded-lg border bg-white p-6 text-center">
                              <BookText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                              <h3 className="text-lg font-medium mb-2">Content Not Available</h3>
                              <p className="text-gray-500 mb-4">The content for this subtopic is not available.</p>
                              <Button onClick={() => setActiveSubtopicIndex(null)}>
                                Back to Topic
                              </Button>
                            </div>
                          );
                        }
                      }

                      // If no subtopic is selected, show the main topic with a message to select a subtopic
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
                              variant="outline"
                              size="sm"
                              className={isCompleted ? "text-green-600" : ""}
                              onClick={() => handleMarkComplete(topic.id)}
                            >
                              {isCompleted ? "Completed" : "Mark Complete"}
                            </Button>
                          </div>

                          <p className="mt-3 text-gray-600">{topic.description}</p>

                          <div className="mt-6 p-6 bg-gray-50 rounded-md text-center">
                            <BookOpen className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                            <h4 className="text-lg font-medium mb-2">Select a Subtopic</h4>
                            <p className="text-gray-500 mb-4">Choose a subtopic from the sidebar to view its content.</p>
                            <div className="flex flex-wrap gap-2 justify-center">
                              {topic.subtopics.map((subtopic, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSubtopicSelect(topic.id, index)}
                                >
                                  {subtopic}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

