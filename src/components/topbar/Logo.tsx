"use client";

import React from "react";
import { useRouter } from "next/navigation";

const Logo = () => {
  const router = useRouter();

  const handleLogoClick = () => {
    router.push("/"); // Redirect to the home page
  };

  return (
    <div
      className="text-xl font-semibold text-gray-800 dark:text-white cursor-pointer"
      onClick={handleLogoClick}
    >
      Support
    </div>
  );
};

export default Logo;
