"use client";

import { useGetAuthUserQuery, useGetTeamsQuery } from "@/state/api";
import { User, Edit2, Save } from "lucide-react";
import Image from "next/image";
import { useState, useRef } from "react";

const ProfilePage = () => {
  const { data: currentUser, isLoading: userLoading } = useGetAuthUserQuery({});
  const { data: teams, isLoading: teamsLoading } = useGetTeamsQuery();
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedRole, setSelectedRole] = useState("Mid");
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const roles = ["Senior", "Mid", "Junior", "Other"];

  if (userLoading || teamsLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!currentUser) return null;

  const currentUserDetails = currentUser.userDetails || currentUser.user;

  const handleImageClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    // Frontend only - backend integration would go here
  };

  return (
    <div className="mx-auto max-w-4xl p-8">
      <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
        <div className="flex justify-between px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
            User Profile
          </h3>
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4" />
                Save
              </>
            ) : (
              <>
                <Edit2 className="h-4 w-4" />
                Edit
              </>
            )}
          </button>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-col items-center space-y-4">
              <div 
                className={`relative h-32 w-32 overflow-hidden rounded-full ${isEditing ? 'cursor-pointer hover:opacity-80' : ''}`}
                onClick={handleImageClick}
              >
                {previewImage || currentUserDetails?.profilePictureUrl ? (
                  <Image
                    src={previewImage || `https://pms3images-ms.s3.us-east-1.amazonaws.com/${currentUserDetails.profilePictureUrl}`}
                    alt={currentUserDetails.username || "User Profile Picture"}
                    width={128}
                    height={128}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-700">
                    <User className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                {isEditing && (
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                )}
              </div>

              <div className="mt-4 text-center">
                {isEditing ? (
                  <input
                    type="text"
                    value={username || currentUserDetails?.username || ""}
                    onChange={(e) => setUsername(e.target.value)}
                    className="rounded-md border border-gray-300 px-3 py-2 text-center text-2xl font-semibold focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                ) : (
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {username || currentUserDetails?.username || "N/A"}
                  </h2>
                )}
              </div>

              <div className="mt-6 grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Team
                  </h4>
                  <select
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="">Select a team</option>
                    {teams?.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.teamName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Role
                  </h4>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
