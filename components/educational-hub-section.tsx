"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, School, FileText, ShieldCheck } from "lucide-react"
import EducationalBookCard from "./educational-book-card"
import EducationalFilter from "./educational-filter"

export default function EducationalHubSection() {
  const [selectedLevel, setSelectedLevel] = useState("All Levels")
  const [selectedSubject, setSelectedSubject] = useState("All Subjects")

  // Mock data for demonstration
  const textbooks = [
    {
      id: 1,
      title: "Introduction to Calculus",
      author: "Dr. Robert Chen",
      institution: "Stanford University",
      cover: "/placeholder.svg?height=280&width=180",
      rating: 4.7,
      price: 49.99,
      rentPrice: 19.99,
      level: "University",
      subject: "Mathematics",
      verified: true,
    },
    {
      id: 2,
      title: "Principles of Economics",
      author: "Dr. Sarah Johnson",
      institution: "Harvard University",
      cover: "/placeholder.svg?height=280&width=180",
      rating: 4.5,
      price: 54.99,
      rentPrice: 22.99,
      level: "University",
      subject: "Economics",
      verified: true,
    },
    {
      id: 3,
      title: "Biology: The Living World",
      author: "Prof. Michael Davis",
      institution: "MIT",
      cover: "/placeholder.svg?height=280&width=180",
      rating: 4.8,
      price: 44.99,
      rentPrice: 18.99,
      level: "High School",
      subject: "Biology",
      verified: true,
    },
    {
      id: 4,
      title: "World History: Modern Era",
      author: "Dr. Emily Wilson",
      institution: "Oxford University",
      cover: "/placeholder.svg?height=280&width=180",
      rating: 4.6,
      price: 39.99,
      rentPrice: 16.99,
      level: "High School",
      subject: "History",
      verified: true,
    },
  ]

  const resources = [
    {
      id: 5,
      title: "Physics Lab Manual",
      author: "Prof. Alan Thompson",
      institution: "California Institute of Technology",
      cover: "/placeholder.svg?height=280&width=180",
      rating: 4.4,
      price: 29.99,
      rentPrice: 12.99,
      level: "University",
      subject: "Physics",
      verified: true,
    },
    {
      id: 6,
      title: "Computer Science Fundamentals",
      author: "Dr. Lisa Zhang",
      institution: "University of Washington",
      cover: "/placeholder.svg?height=280&width=180",
      rating: 4.9,
      price: 34.99,
      rentPrice: 14.99,
      level: "University",
      subject: "Computer Science",
      verified: true,
    },
    {
      id: 7,
      title: "Elementary Mathematics Workbook",
      author: "Maria Rodriguez",
      institution: "National Education Board",
      cover: "/placeholder.svg?height=280&width=180",
      rating: 4.7,
      price: 19.99,
      rentPrice: 8.99,
      level: "Elementary",
      subject: "Mathematics",
      verified: true,
    },
    {
      id: 8,
      title: "English Grammar and Composition",
      author: "Prof. James Wilson",
      institution: "Cambridge University",
      cover: "/placeholder.svg?height=280&width=180",
      rating: 4.5,
      price: 24.99,
      rentPrice: 9.99,
      level: "Middle School",
      subject: "English",
      verified: true,
    },
  ]

  const levels = ["All Levels", "Elementary", "Middle School", "High School", "University", "Professional"]
  const subjects = [
    "All Subjects",
    "Mathematics",
    "Science",
    "Biology",
    "Physics",
    "Chemistry",
    "Computer Science",
    "Economics",
    "History",
    "English",
    "Literature",
    "Languages",
    "Arts",
  ]

  const filterBooks = (books: any[]) => {
    return books.filter((book) => {
      const levelMatch = selectedLevel === "All Levels" || book.level === selectedLevel
      const subjectMatch = selectedSubject === "All Subjects" || book.subject === selectedSubject
      return levelMatch && subjectMatch
    })
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#5c3d53] mb-1">Educational Hub</h2>
          <p className="text-muted-foreground">Quality educational materials from verified institutions</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0 w-full md:w-auto">
          <EducationalFilter
            options={levels}
            selected={selectedLevel}
            onSelect={setSelectedLevel}
            placeholder="Education Level"
          />
          <EducationalFilter
            options={subjects}
            selected={selectedSubject}
            onSelect={setSelectedSubject}
            placeholder="Subject"
          />
        </div>
      </div>

      <div className="bg-[#f0e6ff] p-4 rounded-lg mb-6 flex items-center">
        <ShieldCheck className="h-5 w-5 text-[#5c3d53] mr-2" />
        <p className="text-sm">All materials in the Educational Hub are verified for academic quality and accuracy.</p>
        <Button variant="link" className="ml-auto text-[#5c3d53]">
          Become a Verified Educator
        </Button>
      </div>

      <Tabs defaultValue="textbooks">
        <TabsList className="mb-6">
          <TabsTrigger value="textbooks" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Textbooks
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Educational Resources
          </TabsTrigger>
          <TabsTrigger value="institutions" className="flex items-center gap-2">
            <School className="h-4 w-4" />
            Institutions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="textbooks" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filterBooks(textbooks).map((book) => (
              <EducationalBookCard key={book.id} book={book} />
            ))}
          </div>

          {filterBooks(textbooks).length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No textbooks found with the selected filters. Try different criteria.
              </p>
            </div>
          )}

          {filterBooks(textbooks).length > 0 && (
            <div className="flex justify-center mt-8">
              <Button variant="outline">Load More</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="resources" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filterBooks(resources).map((book) => (
              <EducationalBookCard key={book.id} book={book} />
            ))}
          </div>

          {filterBooks(resources).length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No resources found with the selected filters. Try different criteria.
              </p>
            </div>
          )}

          {filterBooks(resources).length > 0 && (
            <div className="flex justify-center mt-8">
              <Button variant="outline">Load More</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="institutions" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <Card className="overflow-hidden">
              <div className="p-6 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-[#f0e6ff] flex items-center justify-center mb-4">
                  <School className="h-10 w-10 text-[#5c3d53]" />
                </div>
                <h3 className="font-semibold text-lg">Harvard University</h3>
                <p className="text-muted-foreground text-sm mb-4">245 Publications</p>
                <Badge className="mb-4">Verified Institution</Badge>
                <Button variant="outline" className="w-full">
                  View Publications
                </Button>
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div className="p-6 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-[#f0e6ff] flex items-center justify-center mb-4">
                  <School className="h-10 w-10 text-[#5c3d53]" />
                </div>
                <h3 className="font-semibold text-lg">MIT</h3>
                <p className="text-muted-foreground text-sm mb-4">198 Publications</p>
                <Badge className="mb-4">Verified Institution</Badge>
                <Button variant="outline" className="w-full">
                  View Publications
                </Button>
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div className="p-6 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-[#f0e6ff] flex items-center justify-center mb-4">
                  <School className="h-10 w-10 text-[#5c3d53]" />
                </div>
                <h3 className="font-semibold text-lg">Stanford University</h3>
                <p className="text-muted-foreground text-sm mb-4">176 Publications</p>
                <Badge className="mb-4">Verified Institution</Badge>
                <Button variant="outline" className="w-full">
                  View Publications
                </Button>
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div className="p-6 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-[#f0e6ff] flex items-center justify-center mb-4">
                  <School className="h-10 w-10 text-[#5c3d53]" />
                </div>
                <h3 className="font-semibold text-lg">Oxford University</h3>
                <p className="text-muted-foreground text-sm mb-4">210 Publications</p>
                <Badge className="mb-4">Verified Institution</Badge>
                <Button variant="outline" className="w-full">
                  View Publications
                </Button>
              </div>
            </Card>
          </div>

          <div className="flex justify-center mt-8">
            <Button variant="outline">View All Institutions</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
