export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  type: "meeting" | "task" | "reminder" | "event" | "deadline";
  priority: "low" | "medium" | "high";
  attendees?: string[];
  location?: string;
  color?: string;
}

export const calendarEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Team Standup",
    description: "Daily team standup meeting",
    start: new Date(2025, 8, 19, 9, 0), // September 19, 2025, 9:00 AM
    end: new Date(2025, 8, 19, 9, 30),
    type: "meeting",
    priority: "medium",
    attendees: ["john@example.com", "sarah@example.com", "mike@example.com"],
    location: "Conference Room A",
    color: "#3b82f6",
  },
  {
    id: "2",
    title: "Project Deadline",
    description: "Submit final project deliverables",
    start: new Date(2025, 8, 20, 17, 0), // September 20, 2025, 5:00 PM
    end: new Date(2025, 8, 20, 17, 0),
    type: "deadline",
    priority: "high",
    color: "#ef4444",
  },
  {
    id: "3",
    title: "Client Presentation",
    description: "Present Q3 results to client",
    start: new Date(2025, 8, 21, 14, 0), // September 21, 2025, 2:00 PM
    end: new Date(2025, 8, 21, 15, 30),
    type: "meeting",
    priority: "high",
    attendees: ["client@company.com", "manager@example.com"],
    location: "Virtual Meeting",
    color: "#10b981",
  },
  {
    id: "4",
    title: "Code Review",
    description: "Review pull requests for feature branch",
    start: new Date(2025, 8, 22, 10, 0), // September 22, 2025, 10:00 AM
    end: new Date(2025, 8, 22, 11, 0),
    type: "task",
    priority: "medium",
    attendees: ["dev1@example.com", "dev2@example.com"],
    color: "#f59e0b",
  },
  {
    id: "5",
    title: "Team Building Event",
    description: "Company team building activity",
    start: new Date(2025, 8, 23, 13, 0), // September 23, 2025, 1:00 PM
    end: new Date(2025, 8, 23, 17, 0),
    type: "event",
    priority: "low",
    attendees: ["team@example.com"],
    location: "Central Park",
    color: "#8b5cf6",
  },
  {
    id: "6",
    title: "Doctor Appointment",
    description: "Annual checkup",
    start: new Date(2025, 8, 24, 11, 0), // September 24, 2025, 11:00 AM
    end: new Date(2025, 8, 24, 12, 0),
    type: "reminder",
    priority: "medium",
    location: "Medical Center",
    color: "#06b6d4",
  },
  {
    id: "7",
    title: "Product Launch",
    description: "Launch new product version",
    start: new Date(2025, 8, 25, 9, 0), // September 25, 2025, 9:00 AM
    end: new Date(2025, 8, 25, 12, 0),
    type: "event",
    priority: "high",
    attendees: ["marketing@example.com", "sales@example.com"],
    color: "#84cc16",
  },
  {
    id: "8",
    title: "Budget Review",
    description: "Monthly budget review meeting",
    start: new Date(2025, 8, 26, 15, 0), // September 26, 2025, 3:00 PM
    end: new Date(2025, 8, 26, 16, 30),
    type: "meeting",
    priority: "medium",
    attendees: ["finance@example.com", "manager@example.com"],
    location: "Board Room",
    color: "#f97316",
  },
  {
    id: "9",
    title: "Training Session",
    description: "New employee onboarding training",
    start: new Date(2025, 8, 27, 10, 0), // September 27, 2025, 10:00 AM
    end: new Date(2025, 8, 27, 12, 0),
    type: "event",
    priority: "medium",
    attendees: ["hr@example.com", "newhire@example.com"],
    color: "#ec4899",
  },
  {
    id: "10",
    title: "System Maintenance",
    description: "Scheduled server maintenance",
    start: new Date(2025, 8, 28, 2, 0), // September 28, 2025, 2:00 AM
    end: new Date(2025, 8, 28, 4, 0),
    type: "reminder",
    priority: "low",
    color: "#6366f1",
  },
];

export const eventTypes = [
  { id: "meeting", label: "Meetings", color: "#3b82f6" },
  { id: "task", label: "Tasks", color: "#f59e0b" },
  { id: "reminder", label: "Reminders", color: "#06b6d4" },
  { id: "event", label: "Events", color: "#8b5cf6" },
  { id: "deadline", label: "Deadlines", color: "#ef4444" },
];

export const priorities = [
  { id: "low", label: "Low", color: "#10b981" },
  { id: "medium", label: "Medium", color: "#f59e0b" },
  { id: "high", label: "High", color: "#ef4444" },
];
