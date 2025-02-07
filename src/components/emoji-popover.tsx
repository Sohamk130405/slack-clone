import { ReactNode, useState } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface EmojiPopoverProps {
  children: ReactNode;
  hint?: string;
  onEmojiSelect: (value: string) => void;
}

const EmojiPopover = ({
  children,
  hint = "Emoji",
  onEmojiSelect,
}: EmojiPopoverProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const onSelect = (value: EmojiClickData) => {
    onEmojiSelect(value.emoji);
    setPopoverOpen(false);
    setTimeout(() => {
      setTooltipOpen(false);
    }, 500);
  };
  return (
    <TooltipProvider>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <Tooltip
          open={tooltipOpen}
          onOpenChange={setTooltipOpen}
          delayDuration={50}
        >
          <PopoverTrigger asChild>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
          </PopoverTrigger>
          <TooltipContent className="bg-black border text-white border-white/5">
            <p className="font-medium text-xs">{hint}</p>
          </TooltipContent>
        </Tooltip>
        <PopoverContent className="p-0 w-full shadow-none border-none">
          <EmojiPicker onEmojiClick={onSelect} />
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
};

export default EmojiPopover;
