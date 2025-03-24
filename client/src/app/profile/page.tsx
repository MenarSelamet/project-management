"use client";

import { useGetAuthUserQuery } from "@/state/api";
import { User } from "lucide-react";
import Image from "next/image";

const ProfilePage = () => {
  const { data: currentUser, isLoading } = useGetAuthUserQuery({});

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!currentUser) return null;
  const currentUserDetails = currentUser.userDetails;

  return (
    <div className="mx-auto max-w-4xl p-8">
      <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
            User Profile
          </h3>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="h-32 w-32 overflow-hidden rounded-full">
                {currentUserDetails?.profilePictureUrl ? (
                  <Image
                    src={`https://pm-s3-images.s3.us-east-2.amazonaws.com/${currentUserDetails.profilePictureUrl}`}
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
              </div>

              <div className="mt-4 text-center">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {currentUserDetails?.username || "N/A"}
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {currentUserDetails?.email || "No email provided"}
                </p>
              </div>

              <div className="mt-6 grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Team
                  </h4>
                  <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                    {currentUserDetails?.team?.name || "No team assigned"}
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Role
                  </h4>
                  <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                    {currentUserDetails?.role || "No role assigned"}
                  </p>
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
