import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface ConversationHeroProps {
  name?: string;
  image?: string;
}

const ConversationHero = ({
  name = "Member",
  image,
}: ConversationHeroProps) => {
  return (
    <div className="mt-[88px] mx-5 mb-4">
      <div className="flex items-center gap-x-1 mb-2">
        <Avatar className="size-8 rounded-md mr-1">
          <AvatarImage className="rounded-md" src={image} alt={name} />
          <AvatarFallback className="rounded-md bg-sky-500 text-white">
            {name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      <p className="text-2xl font-bold">{name}</p>
      </div>
      <p className="font-normal text-slate-800 mb-4">
        This conversation is just between you and <strong>{name}</strong>
      </p>
    </div>
  );
};

export default ConversationHero;
