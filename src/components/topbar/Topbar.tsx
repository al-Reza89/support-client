"use client";
import React, { use } from "react";
import { ModeToggle } from "@/components/dark-mode/ModeToggle";
import Searchbar from "@/components/topbar/Searchbar";
import Logo from "@/components/topbar/Logo";
import UserIcon from "@/components/topbar/UserIcon";
import { useUser } from "@/hooks/auth";
import { useRouter } from "next/navigation";

const Topbar = () => {
  const { data: user, isLoading } = useUser();
  const router = useRouter();

  console.log(user, isLoading);

  const handleJoinNow = () => {
    router.push("/signin");
  };

  if (!user) {
    return (
      <div
        className="fixed top-0 left-0 right-0 bg-white border-b dark:bg-black
      shadow-md"
      >
        <div className="px-2 mx-auto h-[50px] flex justify-between items-center gap-4">
          <Logo />
          <Searchbar />

          <div className="flex justify-center gap-4">
            <ModeToggle />
            <button
              className="w-40 h-10 cursor-pointer rounded-xl bg-white text-black border border-black text-sm"
              onClick={handleJoinNow}
            >
              Join now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed top-0 left-0 right-0 bg-white border-b dark:bg-black
    shadow-md"
    >
      <div className="px-2 mx-auto h-[50px] flex justify-between items-center gap-4">
        <Logo />
        <Searchbar />

        <div className="flex justify-center items-center gap-4">
          {user && user.role === "admin" && "admin"}
          <ModeToggle />

          <UserIcon id={user.id} />
        </div>
      </div>
    </div>
  );
};

export default Topbar;
