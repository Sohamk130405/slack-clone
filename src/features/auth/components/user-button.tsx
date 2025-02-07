"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useCurrentUser } from "../api/use-current-user";
import { Loader, LogOut } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";

const UserButton = () => {
  const { data, isLoading } = useCurrentUser();
  const { signOut } = useAuthActions();
  if (isLoading)
    return <Loader className="size-4 animate-spin text-muted-foreground" />;
  if (!data) return null;
  const { image, name, email } = data;
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative">
        <Avatar className=" rounded-md size-10 hover:opacity-75 transition">
          <AvatarImage className="rounded-md" src={image} alt={name} />
          <AvatarFallback className="rounded-md bg-sky-500 text-white text-xs">
            {name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60" align="center" side="right">
        <DropdownMenuItem className="h-10">{name}</DropdownMenuItem>
        <DropdownMenuItem className="h-10">{email}</DropdownMenuItem>
        <DropdownMenuItem onClick={signOut} className="h-10">
          <LogOut className="size-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
