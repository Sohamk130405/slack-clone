import { Id } from "../../../../convex/_generated/dataModel";

interface ProfilProps {
  memberId: Id<"members">;
  onClose: () => void;
}
const Profile = ({memberId,onClose}: ProfilProps) => {
  return <div>Profile</div>;
};

export default Profile;
