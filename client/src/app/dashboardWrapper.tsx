import React from "react";
import Navbar from "@/app/(components)/Navbar/index";
import Sidebar from "@/app/(components)/Sidebar/index";

const dashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex- min-h-screen w-full bg-gray-50 text-gray-900">
      <Sidebar />
      <main
        className={"dark:bg-dark-bg flex w-full flex-col bg-gray-50 md:pl-64"}
      >
        <Navbar />
        {children}
      </main>
    </div>
  );
};

export default dashboardWrapper;
