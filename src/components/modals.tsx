"use client";

import CreateWorkspaceModal from "@/features/workspaces/components/create-workspace-modal";
import { useEffect, useState } from "react";

const Modals = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), [setMounted]);
  if (!mounted) return null;
  return (
    <>
      <CreateWorkspaceModal />
    </>
  );
};

export default Modals;
