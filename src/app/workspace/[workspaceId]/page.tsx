"use client";

import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Loader, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

const WorkspaceIdPage = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [open, setOpen] = useCreateChannelModal();

  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });

  const { data: channels, isLoading: channelsLoading } = useGetChannels({
    workspaceId,
  });

  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  });

  const isAdmin = useMemo(() => member?.role === "admin", [member?.role]);

  const channelId = useMemo(() => channels?.[0]?._id, [channels]);
  useEffect(() => {
    if (workspaceLoading || channelsLoading || !workspace || memberLoading)
      return;
    if (channelId)
      router.push(`/workspace/${workspaceId}/channel/${channelId}`);
    else if (!open && isAdmin) setOpen(true);
  }, [
    channelId,
    workspaceLoading,
    channelsLoading,
    workspace,
    router,
    open,
    setOpen,
    workspaceId,
    memberLoading,
    isAdmin,
  ]);

  if (workspaceLoading || channelsLoading || memberLoading)
    return (
      <div className="h-full flex-1  flex flex-col items-center justify-center gap-y-2">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );

  if (!workspace || !member) {
    return (
      <div className="h-full flex-1  flex flex-col items-center justify-center gap-y-2">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Workspace not found
        </span>
      </div>
    );
  }
  return (
    <div className="h-full flex-1  flex flex-col items-center justify-center gap-y-2">
      <TriangleAlert className="size-6 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">No Channel found</span>
    </div>
  );
};

export default WorkspaceIdPage;
