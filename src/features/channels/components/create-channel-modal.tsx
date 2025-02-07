import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateChannelModal } from "../store/use-create-channel-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateChannel } from "../api/use-create-channel";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

const CreateChannelModal = () => {
  const [open, setOpen] = useCreateChannelModal();
  const [name, setName] = useState("");
  const workspaceId = useWorkspaceId();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setName(value);
  };
  const router = useRouter();
  const { mutate, isPending } = useCreateChannel();

  const handleClose = () => {
    setName("");
    setOpen(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(
      { name, workspaceId },
      {
        onSuccess(id) {
          toast.success("Channel created successfully");
          router.push(`/workspace/${workspaceId}/channel/${id}`);
          handleClose();
        },
        onError(){
          toast.error("Failed to create channel");
        }
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a channel</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            value={name}
            disabled={isPending}
            required
            autoFocus
            onChange={handleChange}
            minLength={3}
            maxLength={80}
            placeholder="Channel name e.g. 'general', 'production', 'plan-budget'"
          />
          <div className="flex justify-end">
            <Button disabled={isPending}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannelModal;
