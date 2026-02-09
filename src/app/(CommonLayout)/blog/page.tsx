"use client"
import { useEffect } from "react";
import { motion } from "framer-motion"; 
import BlogCard from "@/components/modules/blog/BlogCard";
import Sidebar from "@/components/modules/blog/SideBar";



export default function BlogPage() {

const blogData = [
  {
    title: "How to Choose the Best Online Tutor for Your Child in 2025",
    category: "Parenting, Online Learning",
    date: "July 15, 2025",
    imageUrl: "https://img.freepik.com/free-photo/schoolgirl-writing-while-having-online-class-with-her-teacher-laptop-due-virus-pandemic_637285-9416.jpg",
    // alt: Young student in online tutoring session with teacher on laptop
  },
  {
    title: "10 Most Important Subjects to Focus on for Board Exams",
    category: "Exam Preparation, Study Tips",
    date: "July 10, 2025",
    imageUrl: "https://d2bps9p1kiy4ka.cloudfront.net/5eb393ee95fab7468a79d189/0ec29f50-35be-42d9-b9da-dcc0bcf48181.jpg",
    // alt: CBSE Class 10 revision books and study materials for board exams
  },
  {
    title: "Why Students Are Switching to Online Tutoring in 2025",
    category: "Education Trends, Online Learning",
    date: "July 05, 2025",
    imageUrl: "https://www.gostudent.org/hubfs/teacher-recording-video-blog-for-her-internet-chan-2025-03-18-19-02-47-utc%20(1).jpg",
    // alt: Professional online English tutor teaching via video call
  },
  {
    title: "How to Stay Focused During Long Online Sessions",
    category: "Study Tips, Productivity",
    date: "June 28, 2025",
    imageUrl: "https://media.gettyimages.com/id/2220532069/video/online-tutoring-session-between-a-child-and-a-teacher-using-a-laptop-at-home.jpg",
    // alt: Child attending focused online tutoring session at home
  },
  {
    title: "Best Time Management Tips for Students with Private Tutors",
    category: "Study Tips, Time Management",
    date: "June 22, 2025",
    imageUrl: "https://c8.alamy.com/comp/2RFE6A3/two-happy-and-cute-young-asian-girls-are-focusing-on-studying-with-a-private-teacher-at-home-learning-a-lesson-on-a-laptop-together-private-tutor-e-2RFE6A3.jpg",
    // alt: Young students learning with private tutor on laptop at home
  },
  {
    title: "IELTS vs PTE vs TOEFL – Which English Test Should You Choose?",
    category: "English Learning, Exam Preparation",
    date: "June 18, 2025",
    imageUrl: "https://standtogether.org/sites/default/files/styles/landscape_178_16x9_768x432_1x/public/2024-10/AI%20tutors%20hero.jpg",
    // alt: Parent and child using laptop together for learning / exam prep
  },
  {
    title: "How Much Should You Pay a Good Home/Private Tutor in 2025?",
    category: "Tutoring Guide, Pricing",
    date: "June 12, 2025",
    imageUrl: "https://media.gettyimages.com/id/1135563625/video/girl-on-private-class-with-young-woman-teacher-at-home.jpg",
    // alt: Girl studying with private female tutor at home
  },
  {
    title: "Top 7 Mistakes Students Make During Online Classes (And Fixes)",
    category: "Common Mistakes, Online Learning",
    date: "June 08, 2025",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/68acba4e8b33cc029a22431b/3fdb8f4e-a496-43b0-8650-d7e01b05787c/kalvian_sub_herosections+%289%29.png",
    // alt: Student taking notes during group online tutoring session
  },
];

  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const stagger = {
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };






    return (
         <div className="min-h-screen  mx-auto py-10 bg-gray-50 dark:bg-gray-950">
      <div className="container  lg:px-0 mx-auto">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
           {/* Header */}
        <div className="text-center mb-10">
          <p className="text-sm uppercase tracking-wider text-teal-600 dark:text-teal-400 font-medium">
            All Blog
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
            Explore Our Latest Blogs
          </h2>
          <div className="mt-4 flex justify-center">
            <div className="h-1 w-24 bg-teal-500/70 rounded-full"></div>
          </div>
        </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 lg:gap-6"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {/* blog cards */}
          <motion.div className="col-span-2" variants={stagger}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {blogData.map((blog, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                >
                  <BlogCard
                    title={blog.title}
                    date={blog.date}
                    imageUrl={blog.imageUrl}
                    category={blog.category}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* sidebar */}
          <motion.div variants={fadeInUp}>
            <Sidebar />
          </motion.div>
        </motion.div>
      </div>
    </div>
    );
}