import Link from "next/link";
import { FaAngleRight } from "react-icons/fa";

export default function BlogCategory() {
  return (
    <div className='flex flex-col gap-5'>
      <h2 className="text-2xl mt-4 mb-2 text-gray-950 dark:text-gray-100 ">
        Category
      </h2>

      <ul className="space-y-5">
        {[
          "Online Tutoring Tips",
          "Exam Preparation",
          "Study Techniques",
          "Career & Skill Development",
          "English Language Learning",
          "Math & Science Mastery",
          "Board Exam Guides",
          "Parenting & Education",
          "IELTS / PTE / TOEFL",
          "Programming & Tech Skills",
        ].map((item) => (
          <li key={item} className="">
            <Link
              href={'#'}
              className='flex gap-2 items-center text-gray-500 dark:text-gray-400 hover:text-[#1cb89e] transition-colors duration-200'
            >
              <FaAngleRight className="text-gray-400 dark:text-gray-500" />
              {item}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}