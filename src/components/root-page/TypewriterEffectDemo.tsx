"use client";
import { useRouter } from "next/navigation";
import { TypewriterEffect } from "../ui/typewriter-effect";

export function TypewriterEffectDemo() {
  const router = useRouter();

  const words = [
    {
      text: "Support",
    },
    {
      text: "is",
    },
    {
      text: "a",
    },
    {
      text: "web application ",
    },
    {
      text: "Support",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];

  const handleJoinNow = () => {
    router.push("/signin"); // Replace with your actual sign-in URL
  };

  const handleSignup = () => {
    router.push("/signup"); // Replace with your actual signup URL
  };

  return (
    <div className="flex flex-col items-center justify-center h-[40rem] ">
      <p className="text-neutral-600 dark:text-neutral-200 text-base mb-10"></p>
      <TypewriterEffect words={words} />
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4 mt-10">
        <button
          className="w-40 h-10 rounded-xl cursor-pointer bg-black border dark:border-white border-transparent text-white text-sm"
          onClick={handleJoinNow}
        >
          Join now
        </button>
        <button
          className="w-40 h-10 cursor-pointer rounded-xl bg-white text-black border border-black text-sm"
          onClick={handleSignup}
        >
          Signup
        </button>
      </div>
    </div>
  );
}
