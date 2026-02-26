// components/FAQSection.tsx
'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Lottie from "lottie-react";
import { motion } from "framer-motion";
import faqLottie from "../../../../public/faq.json";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";



const faqData = [
  {
    id: '1',
    question: 'How do I book a tutoring session?',
    answer:
      'Simply browse through our tutors, select the one that fits your needs, click "View Details", and choose your preferred time slot. Then click "Book" to confirm your session.',
  },
  {
    id: '2',
    question: 'Can I cancel a booking?',
    answer:
      'Yes, you can cancel a booking up to 24 hours before the session. After that, you may be charged a cancellation fee.',
  },
  {
    id: '3',
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards, PayPal, and bank transfers. Payment is processed securely through our platform.',
  },
  {
    id: '4',
    question: 'How do I become a tutor?',
    answer:
      'Click on "Become a Tutor" on our homepage and fill out the application form. We review all applications and contact qualified candidates within 7 days.',
  },
  {
    id: '5',
    question: 'Is there a minimum booking duration?',
    answer:
      'The minimum booking duration is 30 minutes. Most tutors offer sessions ranging from 30 minutes to 2 hours.',
  },
  {
    id: '6',
    question: 'Can I reschedule a booking?',
    answer:
      'Yes, you can reschedule bookings by contacting your tutor directly or through our platform at least 24 hours before the scheduled session.',
  },
];

export default function FAQSection() {
  const [openId, setOpenId] = useState<string | null>('1');

  return (
    <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="bg-gray-100 dark:bg-gray-950  relative rounded-md">

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true }}
                className="mx-auto container"
            >
                <div className="flex flex-col md:flex-row items-center gap-8  xl:py-6">

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        viewport={{ once: true }}
                        className="w-full lg:w-1/2"
                    >
                        <Lottie className="w-full lg:w-10/12" animationData={faqLottie} loop />
                    </motion.div>


                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        viewport={{ once: true }}
                        className="w-full lg:w-1/2 px-4"
                    >
                       
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white  lg:text-left mb-10">Frequently <span className="text-[#1cb89e]">Asked Questions</span></h2>
                        <Accordion type="single" collapsible>
                            {faqData.map(({ id, question, answer }) => (
                                <AccordionItem key={id} value={id}>
                                    <AccordionTrigger className={'cursor-pointer text-lg md:text-xl text-gray-900 dark:text-gray-100'}>{question}</AccordionTrigger>
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        whileInView={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.5, ease: "easeInOut", delay: 1 }}
                                        viewport={{ once: false, amount: 0.2 }}
                                    >
                                        <AccordionContent >{answer}</AccordionContent>
                                    </motion.div>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </motion.div>
                </div>
            </motion.div>

        </motion.div >
  );
}