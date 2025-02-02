import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Doc } from "../../../../convex/_generated/dataModel";
import { ChevronDown, ListFilter, SquarePen } from "lucide-react";
import Hint from "@/components/hint";

interface WorkspaceHeaderProps {
  workspace: Doc<"workspaces">;
  isAdmin: boolean;
}

const WorkspaceHeader = ({ workspace, isAdmin }: WorkspaceHeaderProps) => {
  return (
    <div className="flex items-center justify-between px-4 h-[49px] gap-0.5">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={"transparent"}
            className="font-semibold text-lg w-auto p-1.5 overflow-hidden"
            size={"sm"}
          >
            <span className="truncate">{workspace.name}</span>
            <ChevronDown className="size-4 ml-1 shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" className="w-64" align="start">
          <DropdownMenuItem className="cursor-pointer capitalize">
            <div className="size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-xl rounded-md flex items-center justify-center mr-2">
              {workspace.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col items-start">
              <p className="font-bold">{workspace.name}</p>
              <p className="text-xs text-muted-foreground">Active Workspace</p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {isAdmin && (
            <>
              <DropdownMenuItem
                className="cursor-pointer py-2"
                onClick={() => {}}
              >
                Invite people to {workspace.name}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer py-2"
                onClick={() => {}}
              >
                Preferences
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="flex items-center gap-0.5">
        <Hint side="bottom" label="Filter">
          <Button variant={"transparent"} size={"sm"}>
            <ListFilter className="size-4" />
          </Button>
        </Hint>

        <Hint side="bottom" label="New Message">
          <Button variant={"transparent"} size={"sm"}>
            <SquarePen className="size-4" />
          </Button>
        </Hint>
      </div>
    </div>
  );
};

export default WorkspaceHeader;
