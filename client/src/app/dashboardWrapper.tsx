import React from "react";
import Navbar from "@/app/(components)/Navbar/index";

const dashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex- min-h-screen w-full bg-gray-50 text-gray-900">
      {/* {sidebar} */}
      sidebar
      <main className={"flex w-full flex-col bg-gray-50 md:pl-64 dark:bg-dark-bg"}>
        {/* {navbar} */}
        <Navbar />
        {children}
      </main>
    </div>
  );
};

export default dashboardWrapper;
