import React from "react";
import { Menu, Moon, Sun } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/state";
import { useGetAuthUserQuery } from "@/state/api";
import { signOut } from "aws-amplify/auth";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const { data: currentUser } = useGetAuthUserQuery({});
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="flex items-center justify-between bg-gray-800/90 backdrop-blur-sm px-4 py-3 fixed top-0 left-0 right-0 z-50">
      {/* Menu Toggle */}
      <div className="flex items-center">
        {!isSidebarCollapsed ? null : (
          <button
            onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
            className="hover:bg-gray-500 p-2 rounded-full transition-colors"
          >
            <Menu className="h-6 w-6 text-white" />
          </button>
        )}
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
          className="rounded-full p-2 transition-colors hover:bg-gray-500"
        >
          {isDarkMode ? (
            <Sun className="h-6 w-6 cursor-pointer text-white" />
          ) : (
            <Moon className="h-6 w-6 cursor-pointer text-white" />
          )}
        </button>
        <div className="mx-2 hidden h-6 w-px bg-gray-300 md:inline-block"></div>
        <button
          className="hidden rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors md:block"
          onClick={handleSignOut}
        >
          Sign out
        </button>
      </div>
    </div>
  );
};

export default Navbar;
