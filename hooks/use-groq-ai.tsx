"use client"

import { useState } from "react"
import { generateText } from "ai"
import { getGroqModel } from "@/lib/groq/client"

export function useGroqAI() {
  const [isGenerating, setIsGenerating] = useState(false)

  const generateImprovement = async (text: string, prompt: string) => {
    setIsGenerating(true)
    try {
      const model = getGroqModel()
      const { text: improvedText } = await generateText({
        model,
        prompt: `${prompt}\n\nOriginal text: "${text}"`,
      })
      return improvedText
    } catch (error) {
      console.error("Error generating improvement:", error)
      throw error
    } finally {
      setIsGenerating(false)
    }
  }

  const generateSummary = async (bookContent: string) => {
    setIsGenerating(true)
    try {
      const model = getGroqModel()
      const { text: summary } = await generateText({
        model,
        prompt: `Summarize the following book content in a concise and engaging way, highlighting the main themes and plot points without spoilers:\n\n${bookContent.substring(0, 4000)}...`,
      })
      return summary
    } catch (error) {
      console.error("Error generating summary:", error)
      throw error
    } finally {
      setIsGenerating(false)
    }
  }

  const generateBookCoverIdeas = async (title: string, description: string) => {
    setIsGenerating(true)
    try {
      const model = getGroqModel()
      const { text: ideas } = await generateText({
        model,
        prompt: `Generate 3 detailed book cover design ideas for a book with the following title and description:
        
        Title: "${title}"
        Description: "${description}"
        
        For each idea, describe the visual elements, color scheme, typography, and overall mood. Format as a numbered list.`,
      })
      return ideas
    } catch (error) {
      console.error("Error generating cover ideas:", error)
      throw error
    } finally {
      setIsGenerating(false)
    }
  }

  const moderateComment = async (comment: string) => {
    try {
      const model = getGroqModel()
      const { text: result } = await generateText({
        model,
        prompt: `Analyze the following comment for inappropriate content, hate speech, or offensive language. 
        Return only "APPROVED" if the comment is appropriate, or "REJECTED" with a brief reason if it should be blocked:
        
        Comment: "${comment}"`,
      })
      return result.includes("APPROVED")
        ? { approved: true }
        : { approved: false, reason: result.replace("REJECTED:", "").trim() }
    } catch (error) {
      console.error("Error moderating comment:", error)
      // Default to approval if the AI service fails
      return { approved: true }
    }
  }

  return {
    isGenerating,
    generateImprovement,
    generateSummary,
    generateBookCoverIdeas,
    moderateComment,
  }
}
