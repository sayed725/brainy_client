import Link from "next/link";
import { SlCalender } from "react-icons/sl";


export default function NewPosts() {
    return (
        <div className="flex flex-col gap-5">
      <h2 className="text-2xl  mt-4 mb-2">Latest News</h2>

      <div className="flex gap-5 items-center mb-5">
        <div>
          <img
            src="https://d2bps9p1kiy4ka.cloudfront.net/5eb393ee95fab7468a79d189/0ec29f50-35be-42d9-b9da-dcc0bcf48181.jpg"
            alt="img"
            className="h-15 w-15 rounded-full"
          />
        </div>
        <div>
          <p className="flex gap-2 items-center text-gray-400">
            {" "}
            <SlCalender className="text-white" /> June 22, 2025
          </p>
          <Link href={'#'} className="hover:text-[#1cb89e]">Online Environment Work</Link>
        </div>
      </div>
      <div className="flex gap-5 items-center mb-5">
        <div>
          <img
            src="https://c8.alamy.com/comp/2RFE6A3/two-happy-and-cute-young-asian-girls-are-focusing-on-studying-with-a-private-teacher-at-home-learning-a-lesson-on-a-laptop-together-private-tutor-e-2RFE6A3.jpg"
            alt="img"
            className="h-15 w-15 rounded-full"
          />
        </div>
        <div>
          <p className="flex gap-2 items-center text-gray-400">
            {" "}
            <SlCalender className="text-white" /> June 23, 2025
          </p>
          <Link href={'#'}className="hover:text-[#1cb89e]">
            Usability With Participants
          </Link>
        </div>
      </div>
      <div className="flex gap-5 items-center mb-5">
        <div>
          <img
            src="https://standtogether.org/sites/default/files/styles/landscape_178_16x9_768x432_1x/public/2024-10/AI%20tutors%20hero.jpg"
            alt="img"
            className="h-15 w-15 rounded-full"
          />
        </div>
        <div>
          <p className="flex gap-2 items-center text-gray-400">
            {" "}
            <SlCalender className="text-white" />
            June 25, 2025
          </p>
          <Link href={'#'} className="hover:text-[#1cb89e]">
            Tips For Conducting Study
          </Link>
        </div>
      </div>
    </div>
    );
}