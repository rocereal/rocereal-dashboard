// Task types and interfaces
export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate: string | null;
  createdAt: string;
  assignee: string;
  tags: string[];
  checklist: {
    id: string;
    text: string;
    completed: boolean;
  }[];
}

// Mock tasks data
export const mockTasks: Task[] = [
  {
    id: "1",
    title: "Design new landing page",
    description:
      "Create a modern, responsive landing page for the new product launch",
    completed: false,
    priority: "high",
    dueDate: "2024-01-20",
    createdAt: "2024-01-15",
    assignee: "John Doe",
    tags: ["design", "frontend", "urgent"],
    checklist: [
      { id: "1", text: "Create wireframes", completed: true },
      { id: "2", text: "Design mockups", completed: false },
      { id: "3", text: "Get client approval", completed: false },
    ],
  },
  {
    id: "2",
    title: "Fix authentication bug",
    description: "Users are unable to login with social media accounts",
    completed: true,
    priority: "high",
    dueDate: "2024-01-18",
    createdAt: "2024-01-16",
    assignee: "Jane Smith",
    tags: ["bug", "backend", "security"],
    checklist: [
      { id: "1", text: "Identify root cause", completed: true },
      { id: "2", text: "Implement fix", completed: true },
      { id: "3", text: "Test thoroughly", completed: true },
    ],
  },
  {
    id: "3",
    title: "Write API documentation",
    description: "Document all REST API endpoints for the mobile app",
    completed: false,
    priority: "medium",
    dueDate: "2024-01-25",
    createdAt: "2024-01-17",
    assignee: "Bob Johnson",
    tags: ["documentation", "api"],
    checklist: [
      { id: "1", text: "List all endpoints", completed: true },
      { id: "2", text: "Write descriptions", completed: false },
      { id: "3", text: "Add examples", completed: false },
    ],
  },
];

// Helper functions for task operations
export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "text-red-600 bg-red-50";
    case "medium":
      return "text-orange-600 bg-orange-50";
    case "low":
      return "text-green-600 bg-green-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

export const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case "high":
      return "AlertCircle";
    case "medium":
      return "Clock";
    case "low":
      return "CheckSquare";
    default:
      return "CheckSquare";
  }
};
