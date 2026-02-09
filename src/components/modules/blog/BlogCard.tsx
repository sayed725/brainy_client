import Link from "next/link";

export default function BlogCard({
  title,
  category,
  date,
  imageUrl,
}: {
  title: string;
  category: string;
  date: string;
  imageUrl: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-950 text-gray-950 dark:text-gray-100 p-5 rounded-lg border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform duration-300">
      {/* image */}
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-67.5 object-cover rounded-lg"
      />

      {/* content */}
      <div className="mt-5 flex flex-col gap-5">
        <p className="text-sm text-gray-500 dark:text-gray-400">{category}</p>

        <Link
          href="#"
          className="hover:text-[#1cb89e] dark:hover:text-[#1cb89e] text-lg font-medium text-gray-900 dark:text-gray-100 transition-colors"
        >
          {title}
        </Link>

        <p className="text-sm text-gray-500 dark:text-gray-400">{date}</p>
      </div>
    </div>
  );
}