// components/LatestBlogsSection.tsx
"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRight, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/shared/SectionHeader";
import Link from "next/link";
import Image from "next/image";

const BLOG_POSTS = [
  {
    title: "How to Choose the Best Online Tutor for Your Child in 2025",
    category: "Online Learning",
    date: "July 15, 2025",
    imageUrl:
      "https://img.freepik.com/free-photo/schoolgirl-writing-while-having-online-class-with-her-teacher-laptop-due-virus-pandemic_637285-9416.jpg",
    excerpt:
      "Discover key tips and factors to consider when selecting the ideal online tutor for your child's academic success.",
  },
  {
    title: "Why Students Are Switching to Online Tutoring in 2025",
    category: "Education Trends",
    date: "July 05, 2025",
    imageUrl:
      "https://www.gostudent.org/hubfs/teacher-recording-video-blog-for-her-internet-chan-2025-03-18-19-02-47-utc%20(1).jpg",
    excerpt:
      "Learn why thousands of students prefer online tutoring and how it's reshaping modern education.",
  },
  {
    title: "10 Most Important Subjects to Focus on for Board Exams",
    category: "Exam Preparation",
    date: "July 10, 2025",
    imageUrl:
      "https://d2bps9p1kiy4ka.cloudfront.net/5eb393ee95fab7468a79d189/0ec29f50-35be-42d9-b9da-dcc0bcf48181.jpg",
    excerpt:
      "A strategic guide to prioritizing subjects and maximizing your scores in upcoming board examinations.",
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function LatestBlogsSection() {
  return (
    <section className="py-10 bg-gray-100 dark:bg-gray-950">
      <div className="container mx-auto px-4 lg:px-0">
        {/* Header */}
        <div className="mb-12 text-center flex flex-col items-center">
          <SectionHeader
            title="Latest from Our Blog"
            badge="Blog"
            description="Stay updated with tips, trends, and insights to boost your learning journey."
            descriptionClassName="hidden lg:block"
          />
        </div>

        {/* Blog Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
        >
          {BLOG_POSTS.map((post, index) => (
            <motion.article
              key={index}
              variants={cardVariants}
              className="group relative bg-gray-50 dark:bg-gray-800/50 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-[#1cb89e]/30 hover:shadow-xl hover:shadow-[#1cb89e]/5 transition-all duration-500"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1cb89e]/90 text-white text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm">
                    <Tag className="w-3 h-3" />
                    {post.category}
                  </span>
                </div>
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Content */}
              <div className="p-6 space-y-3">
                {/* Date */}
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#1cb89e]" />
                  {post.date}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-[#1cb89e] transition-colors duration-300">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>

                {/* Read More */}
                <div className="pt-2">
                  <Link 
                    href="/blog"
                    className="inline-flex items-center gap-1.5 text-[#1cb89e] font-semibold text-sm group-hover:gap-3 transition-all duration-300"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* View All CTA */}
        <div className="mt-12 text-center">
          <Button
            asChild
            size="lg"
            className="bg-[#1cb89e] hover:bg-[#1cb89e]/90 text-white px-8 py-6 text-lg rounded-xl font-bold shadow-lg shadow-[#1cb89e]/20 group transition-all duration-300"
          >
            <Link href="/blog" className="flex items-center gap-2">
              View All Blogs
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
