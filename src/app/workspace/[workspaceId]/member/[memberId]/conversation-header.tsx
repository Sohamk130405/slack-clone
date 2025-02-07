import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaChevronDown } from "react-icons/fa";

interface ConversationHeaderProps {
  memberName?: string;
  memberImage?: string;
  onClick?: () => void;
}
const ConversationHeader = ({
  onClick,
  memberImage,
  memberName,
}: ConversationHeaderProps) => {
  return (
    <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
      <Button
        variant={"ghost"}
        className="text-lg px-2 font-semibold overflow-hidden w-auto"
        size={"sm"}
        onClick={onClick}
      >
        <Avatar className="size-5 rounded-md mr-1">
          <AvatarImage
            className="rounded-md"
            src={memberImage}
            alt={memberName}
          />
          <AvatarFallback className="rounded-md bg-sky-500 text-white">
            {memberName?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="truncate">{memberName}</span>
        <FaChevronDown className="size-2.5 ml-2" />
      </Button>
    </div>
  );
};

export default ConversationHeader;
