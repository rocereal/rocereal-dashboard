"use client";

import { useState } from "react";
import FilesContent from "./FilesContent";
import FilesHeader from "./FilesHeader";
import FilesSidebar from "./FilesSidebar";

export default function RenderPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPath, setCurrentPath] = useState("/");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  return (
    <div className="min-h-screen flex bg-gray-50">
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
