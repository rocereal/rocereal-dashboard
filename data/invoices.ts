export interface Invoice {
  id: string;
  number: string;
  clientName: string;
  clientEmail: string;
  projectName: string;
  date: string;
  dueDate: string;
  status: "Paid" | "Unpaid" | "Overdue" | "Draft";
  total: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export const invoicesData: Invoice[] = [
  {
    id: "INV-2025-001",
    number: "INV-2025-001",
    clientName: "John Doe",
    clientEmail: "john.doe@example.com",
    projectName: "Website Redesign Project",
    date: "2025-09-21",
    dueDate: "2025-10-21",
    status: "Unpaid",
    total: 5940,
    currency: "USD",
    createdAt: "2025-09-21T18:26:34Z",
    updatedAt: "2025-09-21T18:26:34Z",
  },
  {
    id: "INV-2025-002",
    number: "INV-2025-002",
    clientName: "Jane Smith",
    clientEmail: "jane.smith@techcorp.com",
    projectName: "Mobile App Development",
    date: "2025-09-22",
    dueDate: "2025-10-22",
    status: "Paid",
    total: 9720,
    currency: "USD",
    createdAt: "2025-09-22T10:15:22Z",
    updatedAt: "2025-09-22T14:30:45Z",
  },
  {
    id: "INV-2025-003",
    number: "INV-2025-003",
    clientName: "Bob Johnson",
    clientEmail: "bob@ecommerceplus.com",
    projectName: "E-commerce Platform",
    date: "2025-09-23",
    dueDate: "2025-10-23",
    status: "Overdue",
    total: 13500,
    currency: "USD",
    createdAt: "2025-09-23T09:45:12Z",
    updatedAt: "2025-09-23T09:45:12Z",
  },
  {
    id: "INV-2025-004",
    number: "INV-2025-004",
    clientName: "Alice Brown",
    clientEmail: "alice@designstudio.com",
    projectName: "Brand Identity Design",
    date: "2025-09-24",
    dueDate: "2025-10-24",
    status: "Unpaid",
    total: 4050,
    currency: "USD",
    createdAt: "2025-09-24T16:20:33Z",
    updatedAt: "2025-09-24T16:20:33Z",
  },
  {
    id: "INV-2025-005",
    number: "INV-2025-005",
    clientName: "Charlie Wilson",
    clientEmail: "charlie@seomaster.com",
    projectName: "SEO Optimization",
    date: "2025-09-25",
    dueDate: "2025-10-25",
    status: "Paid",
    total: 2376,
    currency: "USD",
    createdAt: "2025-09-25T11:30:18Z",
    updatedAt: "2025-09-25T15:45:22Z",
  },
  {
    id: "INV-2025-006",
    number: "INV-2025-006",
    clientName: "Diana Prince",
    clientEmail: "diana@wondertech.com",
    projectName: "API Integration",
    date: "2025-09-26",
    dueDate: "2025-10-26",
    status: "Unpaid",
    total: 7200,
    currency: "USD",
    createdAt: "2025-09-26T08:15:30Z",
    updatedAt: "2025-09-26T08:15:30Z",
  },
  {
    id: "INV-2025-007",
    number: "INV-2025-007",
    clientName: "Edward Norton",
    clientEmail: "edward@fightclub.com",
    projectName: "Database Migration",
    date: "2025-09-27",
    dueDate: "2025-10-27",
    status: "Paid",
    total: 8500,
    currency: "USD",
    createdAt: "2025-09-27T12:45:15Z",
    updatedAt: "2025-09-27T16:20:30Z",
  },
  {
    id: "INV-2025-008",
    number: "INV-2025-008",
    clientName: "Fiona Green",
    clientEmail: "fiona@greenenergy.com",
    projectName: "Sustainability Dashboard",
    date: "2025-09-28",
    dueDate: "2025-10-28",
    status: "Draft",
    total: 6500,
    currency: "USD",
    createdAt: "2025-09-28T09:30:45Z",
    updatedAt: "2025-09-28T09:30:45Z",
  },
];
