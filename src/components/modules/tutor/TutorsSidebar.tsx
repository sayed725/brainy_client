"use client"

import { Filter } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Category {
  id: number;
  name: string;
  slug: string | null;
}

interface TutorsSidebarProps {
  categories: Category[]
}

export default function TutorsSidebar({ categories }: TutorsSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const selectedCategory = searchParams.get("categoryName") || ""
  const isAvailable = searchParams.get("isAvailable") === "true"

  const currentSort = searchParams.get("sortBy") || "newest"
  const currentSortOption = currentSort

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sortBy", value)
    router.push(`/tutors?${params.toString()}`, { scroll: false })
  }

  const updateCategory = (name: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (name) {
      params.set("categoryName", name)
    } else {
      params.delete("categoryName")
    }
    router.push(`/tutors?${params.toString()}`, { scroll: false })
  }

  const handleReset = () => {
    router.push("/tutors", { scroll: false })
  }

  const toggleAvailable = (checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString())
    if (checked) {
      params.set("isAvailable", "true")
    } else {
      params.delete("isAvailable")
    }
    router.push(`/tutors?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="w-full lg:w-64 shrink-0 space-y-4">
      <div className="p-5 bg-card border rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-4 border-b pb-2">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <Filter className="w-5 h-5" /> Filters
          </div>
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleReset} 
            className="h-8 px-2 bg-[#1cb89e] hover:bg-[#1cb89e]/90 text-white rounded-md transition-all duration-300 font-semibold border-0 text-xs"
          >
            Reset
          </Button>
        </div>

        <div className="space-y-4">
          <div className="lg:hidden">
            <h3 className="font-medium mb-3 text-sm text-muted-foreground">Sort By</h3>
            <Select value={currentSortOption} onValueChange={handleSortChange}>
              <SelectTrigger className="w-full bg-background border-slate-200 dark:border-slate-800 focus:ring-[#1cb89e]/20">
                <SelectValue placeholder="Sort tutors..." />
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

          <div className="border-t border-slate-100 dark:border-slate-800 pt-4 lg:border-t-0 lg:pt-0">
            <h3 className="font-medium mb-3 text-sm text-muted-foreground">Category</h3>
            <div className="space-y-1 grid lg:grid-cols-1 gap-2 lg:gap-0 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              <div
                className={`cursor-pointer px-3 py-2 rounded-md transition-colors text-sm min-w-fit ${selectedCategory === ""
                  ? "bg-[#1cb89e] text-white font-medium"
                  : "hover:bg-muted"
                  }`}
                onClick={() => updateCategory("")}
              >
                All Categories
              </div>
              {Array.isArray(categories) && categories.map((cat) => (
                <div
                  key={cat.id}
                  className={`cursor-pointer px-3 py-2 rounded-md transition-colors text-sm min-w-fit  ${selectedCategory === cat.name
                      ? "bg-[#1cb89e] text-white font-medium"
                      : "hover:bg-muted"
                    }`}
                  onClick={() => updateCategory(cat.name)}
                >
                  {cat.name}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-3 text-sm text-muted-foreground">Preferences</h3>
            <div className="flex items-center justify-between">
              <label className="text-sm cursor-pointer flex items-center gap-2" htmlFor="available-mode">
                <span className="text-lg">✅</span> Available Only
              </label>
              <Switch
                id="available-mode"
                checked={isAvailable}
                onCheckedChange={toggleAvailable}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
