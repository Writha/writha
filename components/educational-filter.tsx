"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EducationalFilterProps {
  options: string[]
  selected: string
  onSelect: (value: string) => void
  placeholder: string
}

export default function EducationalFilter({ options, selected, onSelect, placeholder }: EducationalFilterProps) {
  return (
    <div className="w-full">
      <Select value={selected} onValueChange={onSelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
