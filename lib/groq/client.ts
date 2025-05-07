import { groq } from "@ai-sdk/groq"

export const getGroqModel = (modelName = "llama-3.1-8b-instant") => {
  return groq(modelName)
}
