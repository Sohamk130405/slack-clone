import React from "react";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useMemberId } from "@/hooks/use-member-id";
import { useGetMember } from "@/features/members/api/use-get-member";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { Loader } from "lucide-react";
import ConversationHeader from "./conversation-header";
import ConversationChatInput from "./conversation-chat-input";
import MessageList from "@/components/message-list";

interface ConversationProps {
  id: Id<"conversations">;
}

const Conversation = ({ id }: ConversationProps) => {
  const memberId = useMemberId();
  const { data: member, isLoading: memberLoading } = useGetMember({
    id: memberId,
  });
  const { results, status, loadMore } = useGetMessages({ conversationId: id });

  if (memberLoading || status === "LoadingFirstPage")
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-5 animate-spin " />
      </div>
    );

  return (
    <div className="flex flex-col h-full">
      <ConversationHeader
        memberImage={member?.user.image}
        memberName={member?.user.name}
      />

      <MessageList
        memberImage={member?.user.image}
        memberName={member?.user.name}
        data={results}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
        variant="conversation"
      />
      <ConversationChatInput
        placeholder={`Message ${member?.user.name}`}
        conversationId={id}
      />
    </div>
  );
};

export default Conversation;
