"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import TasksHeader from "./(components)/TasksHeader";
import TasksList from "./(components)/TasksList";
import TasksSidebar from "./(components)/TasksSidebar";

export default function TasksPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleTaskSelect = (taskId: string) => {
    router.push(`/apps/tasks/${taskId}`);
  };

  const handleCreateTask = () => {
    router.push("/apps/tasks/create");
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <TasksSidebar
        sidebarOpen={sidebarOpen}
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        onCreateTask={handleCreateTask}
      />

      <div className="flex-1 flex flex-col">
        <TasksHeader
          sidebarOpen={sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        <TasksList onTaskSelect={handleTaskSelect} />
      </div>
    </div>
  );
}
