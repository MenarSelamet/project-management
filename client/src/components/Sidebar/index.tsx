"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";
import { useGetAuthUserQuery } from "@/state/api";
import { signOut } from "aws-amplify/auth";
import {
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  Briefcase,
  ChevronDown,
  ChevronUp,
  FolderKanban,
  Home,
  Layers3,
  LockIcon,
  LucideIcon,
  Search,
  ShieldAlert,
  User,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

const Sidebar = () => {
  const [showPriority, setShowPriority] = useState(true);
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  const { data: currentUser } = useGetAuthUserQuery({});
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  if (!currentUser) return null;
  const currentUserDetails = currentUser?.userDetails;

  const sidebarClassNames = `fixed flex flex-col h-screen top-0 justify-between shadow-xl
    transition-all duration-300 z-[60] overflow-y-auto bg-gray-800/90 backdrop-blur-sm
    ${isSidebarCollapsed ? "w-0 hidden" : "w-64"}
  `;

  const sidebarLinks = [
    {
      title: "Home",
      href: "/",
      icon: Home,
    },
    {
      title: "Teams",
      href: "/teams",
      icon: Users,
    },
    {
      title: "Projects",
      href: "/projects",
      icon: FolderKanban,
    },
    {
      title: "Users",
      href: "/users",
      icon: User,
    },
    {
      title: "Timeline",
      href: "/timeline",
      icon: Briefcase,
    },
    {
      title: "Search",
      href: "/search",
      icon: Search,
    },
    {
      title: "Profile",
      href: "/profile",
      icon: User,
    },
  ];

  return (
    <div className={sidebarClassNames}>
      <div className="flex h-[100%] w-full flex-col justify-start">
        {/* TOP LOGO */}
        <div className="z-50  flex min-h-[56px] w-64 items-center justify-between bg-gray-800/90 backdrop-blur-sm px-6 pt-3">
          <div className="text-xl font-bold text-white">
            Projects
          </div>
          {isSidebarCollapsed ? null : (
            <button
              className="py-3"
              onClick={() => {
                dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
              }}
            >
              <X className="h-6 w-6 text-white hover:text-gray-500" />
            </button>
          )}
        </div>
        {/* TEAM */}
        <div className="flex items-center gap-5 border-y-[1.5px] border-gray-200 px-8 py-4 dark:border-gray-700">
          {!!currentUserDetails?.profilePictureUrl ? (
            <Image
              src={`https://pms3images-ms.s3.us-east-1.amazonaws.com/${currentUserDetails?.profilePictureUrl}`}
              alt={currentUserDetails?.username || "User Profile Picture"}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          ) : (
            <User className="h-10 w-10 cursor-pointer self-center rounded-full p-1 border-2 text-white" />
          )}
          <div>
            <h3 className="text-md font-bold tracking-wide text-white">
              Welcome {currentUserDetails?.username || currentUser?.user?.username || 'User'}
            </h3>
            <div className="mt-1 flex items-start gap-2">
              <LockIcon className="mt-[0.1rem] h-3 w-3 text-gray-500" />
              <p className="text-xs text-gray-500">Private</p>
            </div>
          </div>
        </div>
        {/* NAVBAR LINKS */}
        <nav className="z-10 w-full">
          {sidebarLinks.map((link) => (
            <SidebarLink key={link.title} icon={link.icon} label={link.title} href={link.href} />
          ))}
        </nav>

        {/* PRIORITIES LINKS */}
        <button
          onClick={() => setShowPriority((prev) => !prev)}
          className="flex w-full items-center justify-between px-8 py-3 text-white"
        >
          <span className="">Priority</span>
          {showPriority ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
        {showPriority && (
          <>
            <SidebarLink
              icon={AlertCircle}
              label="Urgent"
              href="/priority/urgent"
            />
            <SidebarLink
              icon={ShieldAlert}
              label="High"
              href="/priority/high"
            />
            <SidebarLink
              icon={AlertTriangle}
              label="Medium"
              href="/priority/medium"
            />
            <SidebarLink icon={AlertOctagon} label="Low" href="/priority/low" />
            <SidebarLink
              icon={Layers3}
              label="Backlog"
              href="/priority/backlog"
            />
          </>
        )}
      </div>
      <div className="z-10 mt-32 flex w-full flex-col items-center gap-4 bg-gray-400 px-8 py-4 md:hidden">
        <div className="flex w-full items-center">
          <div className="align-center flex h-9 w-9 justify-center">
            {!!currentUserDetails?.profilePictureUrl ? (
              <Image
                src={`https://pms3images-ms.s3.us-east-1.amazonaws.com/${currentUserDetails?.profilePictureUrl}`}
                alt={currentUserDetails?.username || "User Profile Picture"}
                width={100}
                height={50}
                className="h-full rounded-full object-cover"
              />
            ) : (
              <User className="h-6 w-6 cursor-pointer self-center rounded-full text-white" />
            )}
          </div>
          <span className="mx-3 text-white">
            {currentUserDetails?.username}
          </span>
          <button
            className="self-start rounded bg-blue-400 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 md:block"
            onClick={handleSignOut}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

const SidebarLink = ({ href, icon: Icon, label }: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (pathname === "/" && href === "/dashboard");

  return (
    <Link href={href} className="w-full">
      <div
        className={`relative flex cursor-pointer items-center gap-3 transition-colors hover:bg-gray-500 dark:bg-black dark:hover:bg-gray-700 ${
          isActive ? "bg-gray-500 text-white" : ""
        } justify-start px-8 py-3`}
      >
        {isActive && (
          <div className="absolute top-0 left-0 h-[100%] w-[5px] bg-blue-200" />
        )}

        <Icon className="h-6 w-6 text-white" />
        <span className={`font-medium text-white`}>
          {label}
        </span>
      </div>
    </Link>
  );
};

export default Sidebar;
