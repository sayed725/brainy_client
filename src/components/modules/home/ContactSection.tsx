"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  MessageSquare,
  Loader2,
} from "lucide-react";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";
import SectionHeader from "@/components/shared/SectionHeader";

const contactInfo = [
  {
    icon: <MapPin className="w-5 h-5" />,
    title: "Dhaka, Bangladesh",
    subtitle: "Nawabjong, Dhaka 1320",
    gradient: "from-[#1cb89e] to-[#1cb89e]/80",
  },
  {
    icon: <Phone className="w-5 h-5" />,
    title: "+8801627142598",
    subtitle: "Sun to Thu 9am to 8pm",
    gradient: "from-[#1cb89e]/90 to-[#1cb89e]/70",
  },
  {
    icon: <Mail className="w-5 h-5" />,
    title: "abusayedkhan.pro@gmail.com",
    subtitle: "Send me query anytime!",
    gradient: "from-[#1cb89e]/80 to-[#1cb89e]/60",
  },
  {
    icon: <MessageSquare className="w-5 h-5" />,
    title: "+8801627142598",
    subtitle: "WhatsApp — Available 24/7!",
    gradient: "from-[#1cb89e]/70 to-[#1cb89e]/50",
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const serviceID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
    const templateID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "";
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "";

    emailjs
      .send(serviceID, templateID, {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      }, { publicKey })
      .then(() => {
        toast.success("Message sent successfully!");
        setFormData({ name: "", email: "", subject: "", message: "" });
      })
      .catch((error) => {
        console.error("EmailJS error:", JSON.stringify(error, null, 2));
        toast.error("Failed to send message. Please try again.");
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <section id="contact" className="py-10 bg-gray-100 dark:bg-gray-950 relative overflow-hidden">
      {/* Ambient background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#1cb89e]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#1cb89e]/5 rounded-full blur-[100px]" />
      </div>

      <div className="container w-11/12 mx-auto relative z-10">
        <div className="text-center mb-8 max-w-2xl mx-auto flex flex-col items-center">
          <SectionHeader
            title="Get In Touch"
            description="Have a question about our tutoring services, booking, or want to collaborate? Feel free to reach out. We're here to help!"
            badge="Reach Out"
            descriptionClassName="hidden lg:block"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
          {/* Left: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="lg:col-span-2 h-full"
          >
            <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl h-full flex flex-col">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                Let&apos;s talk!
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                Don&apos;t like forms? Send us an email or reach out via WhatsApp. 👋
              </p>

              <div className="flex-1">
                {contactInfo.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 5 }}
                    className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all cursor-default group"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform`}
                    >
                      {item.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-slate-900 dark:text-white font-bold text-sm sm:text-base break-all sm:break-normal">
                        {item.title}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-0.5 truncate sm:whitespace-normal">
                        {item.subtitle}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:col-span-3 h-full"
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl h-full flex flex-col"
            >
              <div className="flex-1 flex flex-col space-y-3">
                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Abu Sayed Khan"
                      required
                      className="w-full px-5 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-[#1cb89e] focus:ring-1 focus:ring-[#1cb89e] transition-all appearance-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      className="w-full px-5 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-[#1cb89e] focus:ring-1 focus:ring-[#1cb89e] transition-all appearance-none"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="General Inquiry"
                    required
                    className="w-full px-5 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-[#1cb89e] focus:ring-1 focus:ring-[#1cb89e] transition-all appearance-none"
                  />
                </div>

                {/* Message */}
                <div className="space-y-2 flex-1 flex flex-col">
                  <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your requirements..."
                    required
                    className="w-full flex-1 px-5 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-[#1cb89e] focus:ring-1 focus:ring-[#1cb89e] transition-all resize-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 mt-auto">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 rounded-xl bg-[#1cb89e] hover:bg-[#1cb89e]/90 text-white hover:shadow-lg hover:shadow-[#1cb89e]/20 hover:-translate-y-0.5 active:translate-y-0 transition-all text-sm sm:text-base font-bold gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
