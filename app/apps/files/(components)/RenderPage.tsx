"use client";

import { useState } from "react";
import FilesContent from "./FilesContent";
import FilesHeader from "./FilesHeader";
import FilesSidebar from "./FilesSidebar";

/**
 * Files Application Render Page Component
 * Main layout component for the files application with responsive design
 * Manages file system state including sidebar visibility, current path, view mode, and file selection
 * Combines sidebar, header, and content components into a cohesive file management interface
 * Provides state management for file navigation and selection across all child components
 * @returns The JSX element representing the complete files application layout
 */
export default function RenderPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPath, setCurrentPath] = useState("/");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  return (
    <div className="min-h-screen flex rounded-md border">
      <FilesSidebar
        sidebarOpen={sidebarOpen}
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        currentPath={currentPath}
        onPathChange={setCurrentPath}
      />

      <div className="flex-1 flex flex-col">
        <FilesHeader
          sidebarOpen={sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          currentPath={currentPath}
          onPathChange={setCurrentPath}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          selectedFiles={selectedFiles}
          onSelectionChange={setSelectedFiles}
        />

        <FilesContent
          currentPath={currentPath}
          onPathChange={setCurrentPath}
          viewMode={viewMode}
          selectedFiles={selectedFiles}
          onSelectionChange={setSelectedFiles}
        />
      </div>
    </div>
  );
}
