import { User } from "@/state/api";
import Image from "next/image";

type Props = {
  user: User;
};

const TaskCard = ({ user }: Props) => {
  return (
    <div className="flex items-center rounded border p-4 shadow">
      {user.profilePictureUrl && (
        <Image
          src={`https://pms3images-ms.s3.us-east-1.amazonaws.com/p1.jpeg`}
          alt="Profile Picture"
          width={32}
          height={32}
          className="rounded-full"
        />
      )}
      <div>
        <h3>{user.username}</h3>
        <p>{user.email}</p>
      </div>
    </div>
  );
};

export default TaskCard;
