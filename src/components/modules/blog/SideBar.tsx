import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import BlogCategory from "./BlogCategory";
import NewPosts from "./NewPosts";
import BlogTags from "./BlogTags";

export default function Sidebar() {
    return (
        <div className="w-full py-5   flex flex-col gap-5 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
    {/* input  */}
    <h2 className="text-2xl  mb-4">Search</h2>
    <div className="relative">
      <input
        type="text"
        placeholder="Search..."
        className="w-full p-4 bg-gray-100 dark:bg-black text-gray-900 dark:text-gray-100 border-none rounded-lg"
      />
      <FaSearch className="absolute right-4 top-5 text-[#1cb89e]" />
    </div>

    {/* category  */}
    <BlogCategory />

    {/* new posts */}
    <NewPosts />

    {/* tags  */}
    <BlogTags />

    {/* hire me  */}

    <div className="relative w-full h-96 bg-gray-800 rounded-lg overflow-hidden shadow-lg mt-10">
      <img
        src="/web-team.png"
        alt="Creative Team"
        className="absolute inset-0 w-full h-full object-cover filter brightness-50"
      />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-4">
        <h3 className="text-[#1cb89e] text-lg font-semibold">Get A Quote</h3>
        <h2 className="text-white text-3xl font-bold mt-2">
          Looking For Creative Web Designer
        </h2>
       <Link href={'#'}>
        <Button className="mt-4  bg-[#1cb89e] text-black font-semibold rounded-lg hover:bg-white transition">
          Hire Me &gt;
        </Button></Link>
      </div>
    </div>
  </div>
    );
}