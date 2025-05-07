import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Trophy, BookOpen, Clock } from "lucide-react"

export default function WeeklyChallengeCard() {
  return (
    <div className="bg-[#f0e6ff] rounded-xl p-6">
      <div className="flex items-center mb-4">
        <Trophy className="h-6 w-6 text-[#5c3d53] mr-2" />
        <h2 className="text-xl font-bold text-[#5c3d53]">Weekly Reading Challenge</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 text-[#5c3d53] mr-2" />
              <h3 className="font-medium">Books Read</h3>
            </div>
            <span className="text-lg font-bold">2/5</span>
          </div>
          <Progress value={40} className="h-2 mb-2" />
          <p className="text-sm text-muted-foreground">Read 3 more books to complete this challenge</p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-[#5c3d53] mr-2" />
              <h3 className="font-medium">Reading Time</h3>
            </div>
            <span className="text-lg font-bold">3.5/10 hrs</span>
          </div>
          <Progress value={35} className="h-2 mb-2" />
          <p className="text-sm text-muted-foreground">Read for 6.5 more hours this week</p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-medium mb-2">Rewards</h3>
            <p className="text-sm text-muted-foreground mb-4">Complete the challenge to earn:</p>
            <ul className="text-sm space-y-1 mb-4">
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-[#5c3d53] mr-2"></div>
                <span>50 BookVerse Points</span>
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-[#5c3d53] mr-2"></div>
                <span>Dedicated Reader Badge</span>
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-[#5c3d53] mr-2"></div>
                <span>$5 Store Credit</span>
              </li>
            </ul>
          </div>
          <Button className="w-full bg-[#5c3d53] hover:bg-[#4a3143]">View Challenge Details</Button>
        </div>
      </div>
    </div>
  )
}
