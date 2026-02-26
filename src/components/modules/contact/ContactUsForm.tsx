"use client"
import UnderLineButton from "@/components/shared/UnderLineButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";


import { useState } from "react";
import { toast } from "sonner";





export default function ContactUsForm() {


    
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e:any) => {
    e.preventDefault();

    // if (!user) {
    //   return toast.error("You must be logged in to send a message!", {
    //     position: "top-right",
    //     duration: 2000,
    //     style: {
    //       marginTop: "35px",
    //     },
    //   });
    // }

    try {
      if (message.length > 350) {
        return toast.error(
          "Your message is too long. Please keep it under 350 characters!",
          {
            position: "top-right",
            duration: 2000,
            style: {
              marginTop: "35px",
            },
          }
        );
      }

      const formData = {
        username,
        email,
        phoneNumber,
        message,
      };

    //   await toast.promise(axiosPublic.post(`/contact`, formData), {
    //     loading: "Sending your message...",
    //     success: "Your message was sent successfully!",
    //     error: "An error occurred while sending your message.",
    //     position: "top-right",
    //     duration: 2000,
    //     style: {
    //       marginTop: "35px",
    //     },
    //   });

      setPhoneNumber(null);
      setMessage("");
    } catch (error) {
    //   toast.error(
    //     error?.message || "Error occurred while sending the message.",
    //     {
    //       position: "top-right",
    //       duration: 2000,
    //       style: {
    //         marginTop: "35px",
    //       },
    //     }
    //   );
    }
  };







    return (
        <form onSubmit={handleSubmit} className="pt-5">
      <div>
        {/* First Name */}
        <div className="space-y-1">
          <Label className="text-[1rem] text-gray-900 dark:text-white font-normal">
            Username
          </Label>
          <Input
            type="text"
            placeholder="Your Name"
            required
            defaultValue={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
      </div>
      {/* Email & Phone Number */}
      <div className="flex flex-col sm:flex-row items-center gap-7.5 mt-6">
        {/* Email */}
        <div className="flex flex-col gap-1.25 w-full sm:w-[50%] space-y-1">
          <Label className="text-[1rem] text-gray-900 dark:text-white font-normal">
            Email Address
          </Label>
          <Input
            type="email"
             placeholder="Your Email"
            required
            defaultValue={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {/* Phone Number */}
        <div className="flex flex-col gap-1.25 w-full sm:w-[50%] space-y-1">
          <Label className="text-[1rem] text-gray-900 dark:text-white font-normal">
            Phone Number
          </Label>
          <Input
            type="text"
             placeholder="Your Number"
            required
            value={phoneNumber || ""}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
      </div>
      {/* Message */}
      <div className="flex flex-col gap-1.25 w-full mt-6 space-y-1">
        <Label className="text-[1rem] text-gray-900 dark:text-white font-normal">
          Write Message
        </Label>
        <Textarea
          required
          value={message}
        placeholder="Your Message "
          onChange={(e) => setMessage(e.target.value)}
          className={"resize-none"}
        />
      </div>
      {/* Submit Button */}
      <div
        // type="submit"
        className="w-full flex items-center justify-end mt-3"
      >
        <UnderLineButton text={"Send Message"} />
      </div>
    </form>
    );
}