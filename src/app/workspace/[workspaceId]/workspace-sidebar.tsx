import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import {
  AlertTriangle,
  HashIcon,
  Loader,
  MessageSquareText,
  SendHorizonal,
} from "lucide-react";
import WorkspaceHeader from "./workspace-header";
import SidebarItem from "./sidebar-item";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import WorkspaceSection from "./workspace-section";
import { useGetMembers } from "@/features/members/api/use-get-members";
import UserItem from "./user-item";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";
import { useChannelId } from "@/hooks/use-channel-id";

const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [open, setOpen] = useCreateChannelModal();
  const { data: channels, isLoading: channelsLoading } = useGetChannels({
    workspaceId,
  });
  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  });
  const { data: members, isLoading: membersLoading } = useGetMembers({
    workspaceId,
  });
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });

  if (workspaceLoading || memberLoading || membersLoading || channelsLoading) {
    return (
      <div className="flex flex-col bg-[#5E2C5F] h-full items-center justify-center">
        <Loader className="size-5 animate-spin text-white transition" />
      </div>
    );
  }

  if (!workspace || !member) {
    return (
      <div className="flex flex-col bg-[#5E2C5F] h-full items-center justify-center">
        <AlertTriangle className="size-5 text-white" />
        <p className="text-white text-sm">Workspace not found</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col bg-[#5E2C5F] h-full">
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={member.role === "admin"}
      />
      <div className="flex flex-col px-2 mt-2">
        <SidebarItem label="Threads" icon={MessageSquareText} id="threads" />
        <SidebarItem label="Draft & Sent" icon={SendHorizonal} id="drafts" />
      </div>

      <WorkspaceSection
        label="Channels"
        hint="New Channel"
        onNew={
          member.role === "admin"
            ? () => {
                setOpen(true);
              }
            : undefined
        }
      >
        {channels?.map((item) => (
          <SidebarItem
            key={item._id}
            icon={HashIcon}
            label={item.name}
            id={item._id}
            variant={channelId === item._id ? "active" : "default"}
          />
        ))}
      </WorkspaceSection>
      <WorkspaceSection label="Direct Messages" hint="New DM" onNew={() => {}}>
        {members?.map((item) => (
          <UserItem
            key={item._id}
            image={item.user.image as string}
            label={item.user.name as string}
            id={item._id}
          />
        ))}
      </WorkspaceSection>
    </div>
  );
};

export default WorkspaceSidebar;
