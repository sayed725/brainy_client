import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function BlogTags() {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-2xl mt-4 mb-2 text-gray-900 dark:text-gray-100">
        Popular Tags
      </h2>

      <div className="flex flex-wrap gap-2">
        {[
          "Online Tutoring",
          "Exam Preparation",
          "Study Tips",
          "IELTS",
          "Math",
          "English",
          "Board Exams",
          "Programming",
          "Career Skills",
          "Parenting",
          "Time Management",
          "Motivation",
        ].map((tag) => (
          <Link key={tag} href="#" className="block">
            <Button
              variant="outline"
              size="sm"
              className="
                text-gray-600 dark:text-gray-300 
                border-gray-300 dark:border-gray-700 
                bg-white dark:bg-gray-900 
                hover:bg-[#1cb89e]/10 dark:hover:bg-[#1cb89e]/20 
                hover:text-[#1cb89e] dark:hover:text-[#1cb89e] 
                hover:border-[#1cb89e]/50 dark:hover:border-[#1cb89e]/40 
                transition-all duration-200
              "
            >
              {tag}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}