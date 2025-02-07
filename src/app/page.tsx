"use client";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Loader } from "lucide-react";

const Home = () => {
  const [open, setOpen] = useCreateWorkspaceModal();
  const { data, isLoading } = useGetWorkspaces();
  const workspaceId = useMemo(() => data?.[0]?._id, [data]);
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (workspaceId) {
      router.replace(`/workspace/${workspaceId}`);
    } else if (!open) {
      setOpen(true);
    }
  }, [workspaceId, router, isLoading, setOpen, open]);

  return (
    <div className="h-full flex items-center justify-center">
      <Loader className="size-5 animate-spin " />
    </div>
  );
};

export default Home;
