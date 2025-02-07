import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import { AvatarImage } from "@radix-ui/react-avatar";
import { cva, VariantProps } from "class-variance-authority";
import Link from "next/link";
import { Id } from "../../../../convex/_generated/dataModel";

interface UserItemProps {
  id: Id<"members">;
  label: string;
  image: string;
  variant?: VariantProps<typeof userItemsVariants>["variant"];
}

const userItemsVariants = cva(
  "flex items-center gap-1.5 justify-start font-normal h-7 px-4 text-sm overflow-hidden",
  {
    variants: {
      variant: {
        default: "text-[#F9EDFFCC]",
        active: "text-[#481349] bg-white/90 hover:bg-white/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const UserItem = ({ label = "Member", id, image, variant }: UserItemProps) => {
  const workspaceId = useWorkspaceId();
  return (
    <Button
      asChild
      variant={"transparent"}
      className={cn(userItemsVariants({ variant }))}
      size={"sm"}
    >
      <Link href={`/workspace/${workspaceId}/member/${id}`}>
        <Avatar className="size-5 rounded-md mr-1">
          <AvatarImage className="rounded-md" src={image} alt={label} />
          <AvatarFallback className="rounded-md bg-sky-500 text-white">
            {label.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm truncate">{label}</span>
      </Link>
    </Button>
  );
};

export default UserItem;
