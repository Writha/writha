import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import Image from "next/image"

export default function RecommendationBanner() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#5c3d53] to-[#3d5c53] text-white">
      <div className="absolute inset-0 opacity-10">
        <Image
          src="/placeholder.svg?height=400&width=1200"
          alt="Background pattern"
          width={1200}
          height={400}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <div className="flex flex-col justify-center">
          <div className="flex items-center mb-2">
            <Sparkles className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">AI-Powered Recommendation</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Discover Your Next Favorite Book</h2>
          <p className="text-white/80 mb-4">
            Based on your reading history, we think you'll love "The Silent Echo" by Maya Johnson.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button className="bg-white text-[#5c3d53] hover:bg-white/90">View Book</Button>
            <Button variant="outline" className="text-white border-white hover:bg-white/10">
              See More Recommendations
            </Button>
          </div>
        </div>
        <div className="flex justify-center md:justify-end">
          <div className="relative w-[140px] h-[210px]">
            <Image
              src="/placeholder.svg?height=280&width=180"
              alt="The Silent Echo by Maya Johnson"
              width={180}
              height={280}
              className="rounded-md shadow-lg"
            />
            <div className="absolute -right-4 -top-4 bg-yellow-400 text-black font-bold rounded-full w-12 h-12 flex items-center justify-center">
              4.7
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
