import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRemoveWorkspace } from "@/features/workspaces/api/use-remove-workspace";
import { useUpdateWorkspace } from "@/features/workspaces/api/use-update-workspace";
import useConfirm from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

interface PreferencesModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialValue: string;
}

const PreferencesModal = ({
  open,
  setOpen,
  initialValue,
}: PreferencesModalProps) => {
  const [value, setValue] = useState(initialValue);
  const [editing, setEditing] = useState(false);
  const router = useRouter();
  const [confirm, ConfirmDialog] = useConfirm(
    "Are you sure?",
    "This action is irreversible"
  );
  const workspaceId = useWorkspaceId();
  const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } =
    useUpdateWorkspace();
  const { mutate: removeWorkspace, isPending: isRemovingWorkspace } =
    useRemoveWorkspace();

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateWorkspace(
      {
        id: workspaceId,
        name: value,
      },
      {
        onSuccess() {
          toast.success("Workspace Updated");
          setEditing(false);
        },
        onError() {
          toast.error("Failed to update workspace");
        },
      }
    );
  };

  const handleRemove = async () => {
    const ok = await confirm();
    if (!ok) return;
    removeWorkspace(
      {
        id: workspaceId,
      },
      {
        onSuccess() {
          toast.success("Workspace Removed");
          setOpen(false);
          router.replace("/");
        },
        onError() {
          toast.error("Failed to remove workspace");
        },
      }
    );
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle>{value}</DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <div className="px-5 py-4 rounded-lg border bg-white hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Workspace name</p>
                {editing ? (
                  <p
                    className="text-sm text-rose-600 hover:underline font-semibold"
                    onClick={() => {
                      setEditing(false);
                      setValue(initialValue);
                    }}
                  >
                    Cancel
                  </p>
                ) : (
                  <p
                    className="text-sm text-[#1264a3] hover:underline font-semibold"
                    onClick={() => setEditing(true)}
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
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    onChange={(e) => setValue(e.target.value)}
                    className="border rounded"
                    disabled={isUpdatingWorkspace}
                  />
                  <Button disabled={isUpdatingWorkspace}>Rename</Button>
                </form>
              ) : (
                <p className="text-sm">{value}</p>
              )}
            </div>
            <button
              disabled={isRemovingWorkspace}
              onClick={handleRemove}
              className="flex items-center px-5 gap-x-2 py-4 bg-white rounded-lg hover:bg-gray-50 border text-rose-600"
            >
              <Trash className="size-4" />
              <p className="text-sm font-semibold">Delete Workspace</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PreferencesModal;
