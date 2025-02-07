"use client";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useMemberId } from "@/hooks/use-member-id";
import { useCreateOrGetConversation } from "@/features/conversations/api/use-create-or-get-conversation";
import { useEffect } from "react";
import { AlertTriangle, Loader } from "lucide-react";
import Conversation from "./conversation";

const MemberIdPage = () => {
  const memberId = useMemberId();
  const workspaceId = useWorkspaceId();

  const { data:conversationId, mutate, isPending } = useCreateOrGetConversation();
  useEffect(() => {
    mutate({ workspaceId, memberId });
  }, [mutate, memberId, workspaceId]);

  if (isPending)
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-5 animate-spin " />
      </div>
    );

  if (!conversationId)
    return (
      <div className="h-full flex items-center justify-center">
        <AlertTriangle className="size-5" />
        <span className="text-sm text-muted-foreground">
          Conversation not found
        </span>
      </div>
    );

  return <Conversation id={conversationId}/>;
};

export default MemberIdPage;
