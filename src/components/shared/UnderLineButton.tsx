import { Button } from "../ui/button";

export default function UnderLineButton({text}: {text: string}) {
    return (
         <Button className=" border-none hover:bg-teal-600 text-[1rem] duration-500 bg-[#1cb89e] text-white mt-4 relative group">
      <span className="relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-px after:bg-white after:transition-all after:duration-300 group-hover:after:w-full">
        {text}
      </span>
    </Button>
  );
}