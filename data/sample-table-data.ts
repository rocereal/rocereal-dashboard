export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "pending";
  lastLogin: string;
  createdAt: string;
}

export const sampleUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Admin",
    status: "active",
    lastLogin: "2025-09-18T10:30:00Z",
    createdAt: "2025-01-15T08:00:00Z",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "User",
    status: "active",
    lastLogin: "2025-09-17T14:20:00Z",
    createdAt: "2025-02-20T09:15:00Z",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    role: "Moderator",
    status: "inactive",
    lastLogin: "2025-08-15T11:45:00Z",
    createdAt: "2025-03-10T10:30:00Z",
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice.brown@example.com",
    role: "User",
    status: "pending",
    lastLogin: "2025-09-16T16:10:00Z",
    createdAt: "2025-09-10T12:00:00Z",
  },
  {
    id: "5",
    name: "Charlie Wilson",
    email: "charlie.wilson@example.com",
    role: "User",
    status: "active",
    lastLogin: "2025-09-18T09:15:00Z",
    createdAt: "2025-04-05T11:20:00Z",
  },
  {
    id: "6",
    name: "Diana Davis",
    email: "diana.davis@example.com",
    role: "Admin",
    status: "active",
    lastLogin: "2025-09-17T13:30:00Z",
    createdAt: "2025-01-08T07:45:00Z",
  },
  {
    id: "7",
    name: "Edward Miller",
    email: "edward.miller@example.com",
    role: "User",
    status: "inactive",
    lastLogin: "2025-07-20T15:50:00Z",
    createdAt: "2025-05-12T14:10:00Z",
  },
  {
    id: "8",
    name: "Fiona Garcia",
    email: "fiona.garcia@example.com",
    role: "Moderator",
    status: "active",
    lastLogin: "2025-09-18T08:45:00Z",
    createdAt: "2025-02-28T16:30:00Z",
  },
  {
    id: "9",
    name: "George Taylor",
    email: "george.taylor@example.com",
    role: "User",
    status: "pending",
    lastLogin: "2025-09-15T17:20:00Z",
    createdAt: "2025-08-22T13:15:00Z",
  },
  {
    id: "10",
    name: "Helen Anderson",
    email: "helen.anderson@example.com",
    role: "User",
    status: "active",
    lastLogin: "2025-09-17T12:10:00Z",
    createdAt: "2025-06-15T10:45:00Z",
  },
];
