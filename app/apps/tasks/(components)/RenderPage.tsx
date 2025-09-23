/**
 * RenderPage Component
 * Main layout component for the tasks application that manages the overall UI state
 * Handles sidebar visibility, task selection, and drawer states for task creation and details
 * Renders the sidebar, header, task list, and various modal drawers in a responsive layout
 * @returns The complete tasks application layout
 */
"use client";

import { useState } from "react";
import TasksHeader from "./TasksHeader";
import TasksList from "./TasksList";
import TasksSidebar from "./TasksSidebar";
import TaskDetailsDrawer from "./TaskDetailsDrawer";
import CreateTaskDrawer from "./CreateTaskDrawer";
import { Task } from "@/data/tasks";

/**
 * RenderPage function component
 * Manages state for sidebar, selected tasks, and drawer visibility
 * Renders the tasks interface with responsive layout for desktop and mobile
 * @returns JSX element for the tasks layout
 */
export default function RenderPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [taskDetailsOpen, setTaskDetailsOpen] = useState(false);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);

  /**
   * Handles task selection from the task list
   * Sets the selected task ID and opens the task details drawer
   * @param taskId - The ID of the selected task
   */
  const handleTaskSelect = (taskId: string) => {
    setSelectedTaskId(taskId);
    setTaskDetailsOpen(true);
  };

  /**
   * Handles the creation of a new task
   * Opens the create task drawer
   */
  const handleCreateTask = () => {
    setCreateTaskOpen(true);
  };

  /**
   * Handles the successful creation of a new task
   * Processes the created task and logs it (placeholder for actual implementation)
   * @param task - The newly created task object
   */
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
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
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
