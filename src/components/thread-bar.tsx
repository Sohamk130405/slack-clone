import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { ChevronRight } from "lucide-react";

interface ThreadBarProps {
  count?: number;
  image?: string;
  timestamp?: number;
  name?: string;
  onClick?: () => void;
}

const ThreadBar = ({
  name,
  count,
  image,
  onClick,
  timestamp,
}: ThreadBarProps) => {
  if (!count || !timestamp) return null;

  return (
    <button
      onClick={onClick}
      className="p-1 rounded-md hover:bg-white border border-transparent hover:border-border flex items-center justify-center group/thread-bar transition max-w-[600px]"
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <Avatar className="size-5 rounded-md mr-1">
          <AvatarImage className="rounded-md" src={image} alt={"user"} />
          <AvatarFallback className="rounded-md bg-sky-500 text-white">
            {name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="text-xs text-sky-700 hover:underline font-bold truncate">
          {count} {count > 1 ? "replies" : "reply"}
        </span>
        <span className="text-xs text-muted-foreground group-hover:hidden block">
          Last reply {formatDistanceToNow(timestamp, { addSuffix: true })}
        </span>
        <span className="text-xs text-muted-foreground truncate group-hover/thread-bar:block hidden">
          View in thread
        </span>
        <ChevronRight className="size-4 text-muted-foreground ml-auto hidden group-hover/thread-bar:block transition shrink-0" />
      </div>
    </button>
  );
};

export default ThreadBar;
