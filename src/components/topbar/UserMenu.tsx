import React from "react";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useLogout, useUser } from "@/hooks/auth";
import { useRouter } from "next/navigation";

const UserMenu = () => {
  const router = useRouter();
  const { mutate: logout } = useLogout();
  const { data: user, refetch: refetchUser } = useUser();

  const handleLogout = () => {
    try {
      logout();
    } catch (error) {
      console.error(error);
    }
  };

  console.log("User data:", user);

  return (
    <DropdownMenuContent>
      <DropdownMenuLabel>{user ? user.name : "User"}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem>Profile</DropdownMenuItem>
      <DropdownMenuItem>Tickets</DropdownMenuItem>
      <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
    </DropdownMenuContent>
  );
};

export default UserMenu;
