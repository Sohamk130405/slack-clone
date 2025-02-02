interface WorkspaceIdPageProps {
  params: {
    workspaceId: string;
  };
}
const WorkspaceIdPage = ({ params }: WorkspaceIdPageProps) => {
  return <div>WorkspaceId: {params.workspaceId}</div>;
};

export default WorkspaceIdPage;
