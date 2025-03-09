"use client";
import React, { useState } from "react";

const index = () => {
    const [showProjects, setShowProjects] = useState(true);
    const [showPriority, useStatePriority] = useState(true);

    const sideBarClassNames = `fixed flex flex-col h-[100%] justify-between shadow-xl transition-all duration-300 h-full z-40 dark:bg-black overflow-y-auto bg-white w-64`;



  return <div className={sideBarClassNames}>Sidebarrrr</div>;
};

export default index;
