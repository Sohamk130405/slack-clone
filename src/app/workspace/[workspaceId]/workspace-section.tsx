import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import React, { ReactNode } from "react";
import { FaCaretDown } from "react-icons/fa";
import { useToggle } from "react-use";
interface WorkspaceSectionProps {
  label: string;
  children: ReactNode;
  hint: string;
  onNew?: () => void;
}

const WorkspaceSection = ({
  children,
  hint,
  label,
  onNew,
}: WorkspaceSectionProps) => {
  const [on, toggle] = useToggle(false);
  return (
    <div className="flex flex-col mt-3 px-2">
      <div className="flex items-center px-3.5 group">
        <Button
          variant={"transparent"}
          onClick={toggle}
          className="p-2.5 text-sm text-[#F9EDFFCC] shrink-0 size-6"
        >
          <FaCaretDown
            className={cn("size-4 transition-transform", on && "-rotate-90")}
          />
        </Button>
        <Button
          variant={"transparent"}
          size={"sm"}
          className="group px-1.5 text-sm text-[#F9EDFFCC] h-[28px] overflow-hidden flex justify-start"
        >
          <span className="truncate">{label}</span>
        </Button>
        {onNew && (
          <Hint label={hint} side="top" align="center">
            <Button
              onClick={onNew}
              variant={"transparent"}
              size={"iconSm"}
              className="opacity-0 group-hover:opacity-100 ml-auto p-0.5 text-[#F9EDFFCC] size-6 shrink-0"
            >
              <Plus className="size-5" />
            </Button>
          </Hint>
        )}
      </div>
      {on && children}
    </div>
  );
};

export default WorkspaceSection;
