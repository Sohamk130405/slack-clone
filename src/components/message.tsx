import React from "react";
import { Doc, Id } from "../../convex/_generated/dataModel";
import dynamic from "next/dynamic";
import { format, isToday, isYesterday } from "date-fns";
import Hint from "./hint";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Thumbnail from "./thumbnail";
import MessageToolbar from "./message-toolbar";
import { useUpdateMessage } from "@/features/messages/api/use-update-message";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRemoveMessage } from "@/features/messages/api/use-remove-message copy";
import useConfirm from "@/hooks/use-confirm";
import { useToggleReactions } from "@/features/reactions/api/use-toggle-reactions";
import Reactions from "./reactions";
import { usePanel } from "@/hooks/use-panel";

const Renderer = dynamic(() => import("@/components/renderer"), { ssr: false });
const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface MessageProps {
  id: Id<"messages">;
  memberId: string;
  authorImage?: string | undefined;
  authorName?: string;
  isAuthor: boolean;
  reactions: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
  body: Doc<"messages">["body"];
  image?: string | null | undefined;
  createdAt: Doc<"messages">["_creationTime"];
  updatedAt: Doc<"messages">["updatedAt"];
  threadCount?: number;
  threadImage?: string;
  threadTimestamp?: number;
  isEditing: boolean;
  isCompact?: boolean;
  setEditingId: (id: Id<"messages"> | null) => void;
  hideThreadButton: boolean;
}

const formatFullTime = (date: number) => {
  return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d,yyyy")} at ${format(date, "h:mm:ss a")}`;
};

const Message = ({
  id,
  memberId,
  authorImage,
  authorName = "Member",
  isAuthor,
  reactions,
  body,
  image,
  updatedAt,
  createdAt,
  threadCount,
  threadImage,
  threadTimestamp,
  isEditing,
  setEditingId,
  isCompact,
  hideThreadButton,
}: MessageProps) => {
  const { mutate: updateMessage, isPending: isUpdatingMessage } =
    useUpdateMessage();

  const { mutate: removeMessage, isPending: isRemovingMessage } =
    useRemoveMessage();

  const { mutate: toggleReaction } = useToggleReactions();

  const { parentMessageId, onOpenMessage, onClose } = usePanel();

  const handleReaction = (value: string) => {
    toggleReaction(
      {
        messageId: id,
        value,
      },
      {
        onError: () => {
          toast.error("Failed to toggle reaction");
        },
      }
    );
  };

  const [confirm, ConfirmDialog] = useConfirm(
    "Delete Message",
    "Are you sure you want to delete this message? This is irreversible action"
  );

  const handleDelete = async () => {
    const ok = await confirm();
    if (!ok) return;
    removeMessage(
      { id },
      {
        onSuccess: () => {
          toast.success("Message Deleted");
          if (parentMessageId === id) {
            onClose();
          }
        },
        onError: () => {
          toast.error("Failed to delete a message");
        },
        onSettled: () => {
          setEditingId(null);
        },
      }
    );
  };

  const handleUpdate = ({ body }: { body: string }) => {
    setEditingId(id);
    updateMessage(
      { id, body },
      {
        onSuccess: () => {
          toast.success("Message Updated");
        },
        onError: () => {
          toast.error("Failed to update a message");
        },
        onSettled: () => {
          setEditingId(null);
        },
      }
    );
  };

  if (isCompact)
    return (
      <>
        <ConfirmDialog />
        <div
          className={cn(
            "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative items-start",
            isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
            isRemovingMessage &&
              "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
          )}
        >
          <div className="flex items-start gap-2">
            <Hint label={formatFullTime(createdAt)}>
              <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 text-center hover:underline">
                {format(new Date(createdAt), "hh:mm")}
              </button>
            </Hint>
            {isEditing ? (
              <div className="w-full h-full">
                <Editor
                  onSubmit={handleUpdate}
                  disabled={isUpdatingMessage}
                  defaultValue={JSON.parse(body)}
                  onCancel={() => setEditingId(null)}
                  variant="update"
                />
              </div>
            ) : (
              <div className="flex flex-col w-full items-start">
                <Thumbnail url={image} />
                <Renderer value={body} />
                {updatedAt ? (
                  <span className="text-xs text-muted-foreground">Edited</span>
                ) : null}
                <Reactions data={reactions} onChange={handleReaction} />
              </div>
            )}
          </div>
          {!isEditing && (
            <MessageToolbar
              isAuthor={isAuthor}
              isPending={isEditing}
              handleEdit={() => setEditingId(id)}
              handleThread={() => onOpenMessage(id)}
              handleDelete={handleDelete}
              hideThreadButton={hideThreadButton}
              handleReaction={handleReaction}
            />
          )}
        </div>
      </>
    );

  return (
    <>
      <ConfirmDialog />
      <div
        className={cn(
          "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative items-start",
          isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
          isRemovingMessage &&
            "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
        )}
      >
        <div className="flex items-start gap-2">
          <button>
            <Avatar className="size-6 rounded-md mr-1">
              <AvatarImage src={authorImage} />
              <AvatarFallback className="bg-sky-500 text-white text-xs">
                {authorName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </button>
          {isEditing ? (
            <div className="w-ful h-full">
              <Editor
                onSubmit={handleUpdate}
                disabled={isUpdatingMessage}
                defaultValue={JSON.parse(body)}
                onCancel={() => setEditingId(null)}
                variant="update"
              />
            </div>
          ) : (
            <div className="flex flex-col items-start w-full overflow-hidden">
              <div className="text-sm">
                <button className="font-bold text-primary hover:underline">
                  {authorName}
                </button>
                <span>&nbsp;&nbsp;</span>
                <Hint label={formatFullTime(createdAt)}>
                  <button className="text-xs text-muted-foreground hover:underline">
                    {format(new Date(createdAt), "hh:mm a")}
                  </button>
                </Hint>
              </div>
              <Thumbnail url={image} />
              <Renderer value={body} />
              {updatedAt ? (
                <span className="text-xs text-muted-foreground">Edited</span>
              ) : null}
              <Reactions data={reactions} onChange={handleReaction} />
            </div>
          )}
        </div>
        {!isEditing && (
          <MessageToolbar
            isAuthor={isAuthor}
            isPending={isEditing}
            handleEdit={() => setEditingId(id)}
            handleThread={() => onOpenMessage(id)}
            handleDelete={handleDelete}
            hideThreadButton={hideThreadButton}
            handleReaction={handleReaction}
          />
        )}
      </div>
    </>
  );
};

export default Message;
