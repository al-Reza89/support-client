import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserMenu from "@/components/topbar/UserMenu";

interface UserIconDataProps {
  id: string;
}

const UserIcon: React.FC<UserIconDataProps> = ({ id }) => {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="">
          <Avatar className=" flex justify-center items-center">
            <AvatarImage
              className="w-8 h-8 rounded-full cursor-pointer"
              src="https://github.com/shadcn.png"
            />
            <AvatarFallback>{id}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <UserMenu />
      </DropdownMenu>
    </div>
  );
};

export default UserIcon;
