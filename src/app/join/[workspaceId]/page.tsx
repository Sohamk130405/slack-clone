"use client";

import { Button } from "@/components/ui/button";
import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info";
import { useJoin } from "@/features/workspaces/api/use-join";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import VerificationInput from "react-verification-input";
import { toast } from "sonner";
const JoinPage = () => {
  const workspaceId = useWorkspaceId();
  const { mutate: join, isPending } = useJoin();
  const router = useRouter();
  const { data, isLoading } = useGetWorkspaceInfo({ id: workspaceId });
  const isMember = useMemo(() => data?.isMember, [data?.isMember]);

  useEffect(() => {
    if (isMember) router.replace(`/workspace/${workspaceId}`);
  }, [isMember, router, workspaceId]);
  if (isLoading)
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-5 animate-spin " />
      </div>
    );
  const handleJoin = (value: string) => {
    join(
      {
        workspaceId,
        joinCode: value,
      },
      {
        onSuccess() {
          router.replace(`/workspace/${workspaceId}`);
          toast.success("Workspace joined");
        },
        onError() {
          toast.error("Failed to join workspace");
        },
      }
    );
  };
  return (
    <div className="h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-md">
      <Image src={"/logo.svg"} width={240} height={200} alt="logo" />
      <div className="flex flex-col justify-center items-center max-w-md">
        <div className="flex flex-col gap-y-2 items-center justify-center">
          <h1 className="text-2xl font-bold">Join {data?.name}</h1>
          <p className="text-md text-muted-foreground">
            Enter the workspace code to join
          </p>
        </div>
        <VerificationInput
          autoFocus
          length={6}
          onComplete={handleJoin}
          classNames={{
            container: cn(
              "flex gap-x-2",
              isPending && "opacity-50 cursor-not-allowed"
            ),
            character:
              "uppercase h-auto rounded-md border border-gray-300 flex items-center justify-center font-medium text-lg text-gray-500",
            characterInactive: "bg-muted",
            characterSelected: "bg-white text-black",
            characterFilled: "bg-white text-black",
          }}
        />
      </div>
      <div className="flex gap-x-4">
        <Button size={"lg"} variant={"outline"} asChild>
          <Link href={"/"}>Back to home</Link>
        </Button>
      </div>
    </div>
  );
};

export default JoinPage;
