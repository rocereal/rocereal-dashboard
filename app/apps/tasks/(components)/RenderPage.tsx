"use client";

import { useState } from "react";
import TasksHeader from "./TasksHeader";
import TasksList from "./TasksList";
import TasksSidebar from "./TasksSidebar";
import TaskDetailsDrawer from "./TaskDetailsDrawer";
import CreateTaskDrawer from "./CreateTaskDrawer";
import { Task } from "@/data/tasks";

export default function RenderPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [taskDetailsOpen, setTaskDetailsOpen] = useState(false);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);

  const handleTaskSelect = (taskId: string) => {
    setSelectedTaskId(taskId);
    setTaskDetailsOpen(true);
  };

  const handleCreateTask = () => {
    setCreateTaskOpen(true);
  };

  const handleTaskCreated = (task: Task) => {
    // Here you would typically add the task to your state or refetch data
    console.log("Task created:", task);
    // For now, we'll just close the drawer
  };

  return (
    <div className="min-h-screen flex bg-card border rounded-md overflow-hidden">
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

      {/* Task Details Drawer */}
      <TaskDetailsDrawer
        taskId={selectedTaskId}
        isOpen={taskDetailsOpen}
        onOpenChange={setTaskDetailsOpen}
      />

      {/* Create Task Drawer */}
      <CreateTaskDrawer
        isOpen={createTaskOpen}
        onOpenChange={setCreateTaskOpen}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  );
}
