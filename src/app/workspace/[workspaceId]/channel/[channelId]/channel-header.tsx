import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Hash, Trash } from "lucide-react";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useUpdateChannel } from "@/features/channels/api/use-update-channel";
import { useRemoveChannel } from "@/features/channels/api/use-remove-channel";
import useConfirm from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCurrentMember } from "@/features/members/api/use-current-member";

interface ChannelHeaderProps {
  title: string;
  id: Id<"channels">;
}
const ChannelHeader = ({ title, id }: ChannelHeaderProps) => {
  const workspaceId = useWorkspaceId();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(title);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { data: member } = useCurrentMember({ workspaceId });
  const isAdmin = member?.role === "admin";
  const [confirm, ConfirmDialog] = useConfirm(
    "Are you sure?",
    "This action is irreversible"
  );
  const { mutate: updateChannel, isPending: isUpdatingChannel } =
    useUpdateChannel();
  const { mutate: removeChannel, isPending: isRemovingChannel } =
    useRemoveChannel();

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateChannel(
      {
        id,
        name: value,
      },
      {
        onSuccess() {
          toast.success("Channel Updated");
          setEditing(false);
        },
        onError() {
          toast.error("Failed to update Channel");
        },
      }
    );
  };

  const handleRemove = async () => {
    if (!isAdmin) return;
    const ok = await confirm();
    if (!ok) return;
    removeChannel(
      {
        id,
      },
      {
        onSuccess() {
          toast.success("Channel Removed");
          setOpen(false);
          router.replace(`/workspace/${workspaceId}`);
        },
        onError() {
          toast.error("Failed to remove Channel");
        },
      }
    );
  };

  return (
    <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant={"ghost"}
            className="text-lg font-semibold px-2 overflow-hidden w-auto"
            size={"sm"}
          >
            <Hash className="size-2.5" />
            <span className="truncate">{title}</span>
            <FaChevronDown className="size-2.5 ml-2" />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-gray-50 overflow-hidden">
          <DialogHeader className="bg-white border-b p-4">
            <DialogTitle># {title}</DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Channel name</p>
                {editing ? (
                  <p
                    className="text-sm text-rose-600 hover:underline font-semibold"
                    onClick={() => {
                      setEditing(false);
                      setValue(title);
                    }}
                  >
                    Cancel
                  </p>
                ) : (
                  <p
                    className="text-sm text-[#1264a3] hover:underline font-semibold"
                    onClick={() => {
                      if (!isAdmin) return;
                      setEditing(true);
                    }}
                  >
                    Edit
                  </p>
                )}
              </div>
              {editing ? (
                <form
                  onSubmit={handleEdit}
                  className="flex items-center gap-2 mt-2 p-2"
                >
                  <Input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    className="border rounded"
                  />
                  <Button disabled={isUpdatingChannel}>Rename</Button>
                </form>
              ) : (
                <p className="text-sm"># {title}</p>
              )}
            </div>
            <button
              onClick={handleRemove}
              disabled={isRemovingChannel}
              className="flex items-center gap-x-2 rounded-lg text-rose-500 cursor-pointer border hover:bg-gray-50 px-5 py-4"
            >
              <Trash className="size-4" />
              <p className="text-sm font-semibold">Delete channel</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChannelHeader;
