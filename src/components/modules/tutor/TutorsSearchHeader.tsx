"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import SectionHeader from "../../shared/SectionHeader"

export default function TutorsSearchHeader({ children }: { children?: React.ReactNode }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentSearch = searchParams.get("searchTerm") || ""
  const currentSort = searchParams.get("sortBy") || "newest"
  const currentSortOption = currentSort

  const [searchTerm, setSearchTerm] = useState(currentSearch)

  // Sync local state when URL changes externally (e.g. Reset button)
  useEffect(() => {
    setSearchTerm(currentSearch)
  }, [currentSearch])

  // Debounced search update
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm !== currentSearch) {
        const params = new URLSearchParams(searchParams.toString())
        if (searchTerm) {
          params.set("searchTerm", searchTerm)
        } else {
          params.delete("searchTerm")
        }
        router.push(`/tutors?${params.toString()}`, { scroll: false })
      }
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm, searchParams, router, currentSearch])

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sortBy", value)
    router.push(`/tutors?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
    
      <div className="max-w-2xl pb-5">
        <SectionHeader
          badge="Expert Mentors"
          title="Pick A Tutor"
          description="Find the perfect mentor to help you achieve your goals"
        />
      </div>


      <div className="flex w-full lg:w-auto items-center gap-2 sm:gap-3 relative">
        <div className="relative flex-1 lg:flex-none lg:w-[300px] xl:w-[350px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tutors..."
            className="pl-9 w-full bg-background border-slate-200 dark:border-slate-800 focus-visible:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {children}

        <div className="hidden lg:block w-full sm:w-[180px]">
          <Select value={currentSortOption} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full bg-background border-slate-200 dark:border-slate-800">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="name-asc">Name: A to Z</SelectItem>
              <SelectItem value="name-desc">Name: Z to A</SelectItem>
              <SelectItem value="rate-desc">Highest Price</SelectItem>
              <SelectItem value="rating-desc">Top Rated</SelectItem>
              <SelectItem value="bookings-desc">Most Booked</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
