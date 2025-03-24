"use client";

import { useSearchQuery } from "@/state/api";
import React, { useEffect, useState } from "react";
import { debounce } from "lodash";
import Header from "@/components/Header";
import TaskCard from "@/components/TaskCard";
import ProjectCard from "@/components/ProjectCard";
import UserCard from "@/components/UserCard";
import { Search as SearchIcon, Briefcase, CheckSquare, Users } from "lucide-react";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data: searchResults,
    isLoading,
    isError,
  } = useSearchQuery(searchTerm, {
    skip: searchTerm.length < 3,
  });

  const handleSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    },
    500,
  );

  useEffect(() => {
    return handleSearch.cancel;
  }, [handleSearch.cancel]);

  return (
    <div className="p-8">
      <Header name="Search" />
      <div className="relative w-full max-w-2xl mx-auto mb-8">
        <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-600" size={20} />
        <input
          type="text"
          placeholder="Search for tasks, projects, or users..."
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 p-4 pl-12 shadow-sm 
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 
                   dark:text-white transition-all duration-200"
          onChange={handleSearch}
        />
      </div>

      <div className="space-y-8">
        {isLoading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {isError && (
          <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-red-600 dark:text-red-400">Error occurred while fetching search results.</p>
          </div>
        )}

        {!isLoading && !isError && searchResults && (
          <div className="grid grid-cols-1 gap-8">
            {/* Tasks Section */}
            {searchResults.tasks && searchResults.tasks.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckSquare className="text-blue-500" size={24} />
                  <h2 className="text-xl font-semibold dark:text-white">Tasks ({searchResults.tasks.length})</h2>
                </div>
                <div className="grid gap-4">
                  {searchResults.tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            )}

            {/* Projects Section */}
            {searchResults.projects && searchResults.projects.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="text-green-500" size={24} />
                  <h2 className="text-xl font-semibold dark:text-white">Projects ({searchResults.projects.length})</h2>
                </div>
                <div className="grid gap-4">
                  {searchResults.projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </div>
            )}

            {/* Users Section */}
            {searchResults.users && searchResults.users.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="text-purple-500" size={24} />
                  <h2 className="text-xl font-semibold dark:text-white">Users ({searchResults.users.length})</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {searchResults.users.map((user) => (
                    <UserCard key={user.userId} user={user} />
                  ))}
                </div>
              </div>
            )}

            {/* No Results Message */}
            {searchTerm.length >= 3 &&
              (!searchResults.tasks?.length && !searchResults.projects?.length && !searchResults.users?.length) && (
                <div className="text-center p-8">
                  <p className="text-gray-500 dark:text-gray-400">No results found for &quot;{searchTerm}&quot;</p>
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
