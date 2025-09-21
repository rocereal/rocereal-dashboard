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

export interface InvoiceDetail {
  company: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    abn: string;
    logo: string;
  };
  client: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
  };
  project: {
    name: string;
  };
  invoice: {
    number: string;
    date: string;
    dueDate: string;
    status: string;
  };
  items: Array<{
    description: string;
    units: number;
    price: number;
    tax: number;
    amount: number;
  }>;
  totals: {
    subtotal: number;
    tax: number;
    total: number;
  };
  notes: string;
  paymentMethod: {
    bankTransfer: {
      accountName: string;
      bsb: string;
      accountNumber: string;
    };
    paypal: string;
    creditCard: string;
  };
  metadata: {
    createdAt: string;
    updatedAt: string;
    currency: string;
    taxRate: number;
  };
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

export const invoiceDetailsData: Record<string, InvoiceDetail> = {
  "INV-2025-001": {
    company: {
      name: "Acme Corporation",
      address: "123 Business St, City, State 12345",
      phone: "(555) 123-4567",
      email: "billing@acme.com",
      website: "www.acmecorp.com",
      abn: "12 345 678 901",
      logo: "/logo.png",
    },
    client: {
      name: "John Doe",
      address: "456 Client Ave, Town, State 67890",
      phone: "(555) 987-6543",
      email: "john.doe@example.com",
      website: "www.johndoeconsulting.com",
    },
    project: {
      name: "Website Redesign Project",
    },
    invoice: {
      number: "INV-2025-001",
      date: "2025-09-21",
      dueDate: "2025-10-21",
      status: "Unpaid",
    },
    items: [
      {
        description: "Web Development Services",
        units: 40,
        price: 75,
        tax: 240,
        amount: 3000,
      },
      {
        description: "UI/UX Design",
        units: 20,
        price: 100,
        tax: 160,
        amount: 2000,
      },
      {
        description: "Project Management",
        units: 10,
        price: 50,
        tax: 40,
        amount: 500,
      },
    ],
    totals: {
      subtotal: 5500,
      tax: 440,
      total: 5940,
    },
    notes:
      "Thank you for your business. Payment is due within 30 days. Late payment fees may apply.",
    paymentMethod: {
      bankTransfer: {
        accountName: "Acme Corporation",
        bsb: "123-456",
        accountNumber: "123456789",
      },
      paypal: "billing@acmecorp.com",
      creditCard: "Accepted via secure payment gateway",
    },
    metadata: {
      createdAt: "2025-09-21T18:26:34Z",
      updatedAt: "2025-09-21T18:26:34Z",
      currency: "USD",
      taxRate: 0.08,
    },
  },
  "INV-2025-002": {
    company: {
      name: "Acme Corporation",
      address: "123 Business St, City, State 12345",
      phone: "(555) 123-4567",
      email: "billing@acme.com",
      website: "www.acmecorp.com",
      abn: "12 345 678 901",
      logo: "/logo.png",
    },
    client: {
      name: "Jane Smith",
      address: "789 Tech Blvd, Innovation City, State 54321",
      phone: "(555) 246-8135",
      email: "jane.smith@techcorp.com",
      website: "www.techcorp.com",
    },
    project: {
      name: "Mobile App Development",
    },
    invoice: {
      number: "INV-2025-002",
      date: "2025-09-22",
      dueDate: "2025-10-22",
      status: "Paid",
    },
    items: [
      {
        description: "Consulting Services",
        units: 25,
        price: 120,
        tax: 240,
        amount: 3000,
      },
      {
        description: "Software License",
        units: 1,
        price: 5000,
        tax: 400,
        amount: 5000,
      },
      {
        description: "Training & Support",
        units: 5,
        price: 200,
        tax: 80,
        amount: 1000,
      },
    ],
    totals: {
      subtotal: 9000,
      tax: 720,
      total: 9720,
    },
    notes: "Thank you for your business. Payment has been received.",
    paymentMethod: {
      bankTransfer: {
        accountName: "Acme Corporation",
        bsb: "123-456",
        accountNumber: "123456789",
      },
      paypal: "billing@acmecorp.com",
      creditCard: "Accepted via secure payment gateway",
    },
    metadata: {
      createdAt: "2025-09-22T10:15:22Z",
      updatedAt: "2025-09-22T14:30:45Z",
      currency: "USD",
      taxRate: 0.08,
    },
  },
  "INV-2025-003": {
    company: {
      name: "Acme Corporation",
      address: "123 Business St, City, State 12345",
      phone: "(555) 123-4567",
      email: "billing@acme.com",
      website: "www.acmecorp.com",
      abn: "12 345 678 901",
      logo: "/logo.png",
    },
    client: {
      name: "Bob Johnson",
      address: "321 Commerce Dr, Business Park, State 13579",
      phone: "(555) 369-2580",
      email: "bob@ecommerceplus.com",
      website: "www.ecommerceplus.com",
    },
    project: {
      name: "E-commerce Platform",
    },
    invoice: {
      number: "INV-2025-003",
      date: "2025-09-23",
      dueDate: "2025-10-23",
      status: "Overdue",
    },
    items: [
      {
        description: "E-commerce Platform Setup",
        units: 1,
        price: 8000,
        tax: 640,
        amount: 8000,
      },
      {
        description: "Payment Gateway Integration",
        units: 3,
        price: 500,
        tax: 120,
        amount: 1500,
      },
      {
        description: "Custom Features Development",
        units: 20,
        price: 150,
        tax: 240,
        amount: 3000,
      },
    ],
    totals: {
      subtotal: 12500,
      tax: 1000,
      total: 13500,
    },
    notes:
      "Payment is overdue. Please settle immediately to avoid additional fees.",
    paymentMethod: {
      bankTransfer: {
        accountName: "Acme Corporation",
        bsb: "123-456",
        accountNumber: "123456789",
      },
      paypal: "billing@acmecorp.com",
      creditCard: "Accepted via secure payment gateway",
    },
    metadata: {
      createdAt: "2025-09-23T09:45:12Z",
      updatedAt: "2025-09-23T09:45:12Z",
      currency: "USD",
      taxRate: 0.08,
    },
  },
  "INV-2025-004": {
    company: {
      name: "Acme Corporation",
      address: "123 Business St, City, State 12345",
      phone: "(555) 123-4567",
      email: "billing@acme.com",
      website: "www.acmecorp.com",
      abn: "12 345 678 901",
      logo: "/logo.png",
    },
    client: {
      name: "Alice Brown",
      address: "654 Design St, Creative District, State 97531",
      phone: "(555) 147-2589",
      email: "alice@designstudio.com",
      website: "www.designstudio.com",
    },
    project: {
      name: "Brand Identity Design",
    },
    invoice: {
      number: "INV-2025-004",
      date: "2025-09-24",
      dueDate: "2025-10-24",
      status: "Unpaid",
    },
    items: [
      {
        description: "Logo Design",
        units: 1,
        price: 2000,
        tax: 160,
        amount: 2000,
      },
      {
        description: "Brand Guidelines",
        units: 1,
        price: 1500,
        tax: 120,
        amount: 1500,
      },
      {
        description: "Business Card Design",
        units: 50,
        price: 5,
        tax: 20,
        amount: 250,
      },
    ],
    totals: {
      subtotal: 3750,
      tax: 300,
      total: 4050,
    },
    notes: "Thank you for your business. Payment is due within 30 days.",
    paymentMethod: {
      bankTransfer: {
        accountName: "Acme Corporation",
        bsb: "123-456",
        accountNumber: "123456789",
      },
      paypal: "billing@acmecorp.com",
      creditCard: "Accepted via secure payment gateway",
    },
    metadata: {
      createdAt: "2025-09-24T16:20:33Z",
      updatedAt: "2025-09-24T16:20:33Z",
      currency: "USD",
      taxRate: 0.08,
    },
  },
  "INV-2025-005": {
    company: {
      name: "Acme Corporation",
      address: "123 Business St, City, State 12345",
      phone: "(555) 123-4567",
      email: "billing@acme.com",
      website: "www.acmecorp.com",
      abn: "12 345 678 901",
      logo: "/logo.png",
    },
    client: {
      name: "Charlie Wilson",
      address: "987 Marketing Ave, Digital City, State 86420",
      phone: "(555) 753-9514",
      email: "charlie@seomaster.com",
      website: "www.seomaster.com",
    },
    project: {
      name: "SEO Optimization",
    },
    invoice: {
      number: "INV-2025-005",
      date: "2025-09-25",
      dueDate: "2025-10-25",
      status: "Paid",
    },
    items: [
      {
        description: "SEO Audit & Analysis",
        units: 1,
        price: 800,
        tax: 64,
        amount: 800,
      },
      {
        description: "Keyword Research",
        units: 1,
        price: 600,
        tax: 48,
        amount: 600,
      },
      {
        description: "Content Optimization",
        units: 10,
        price: 80,
        tax: 64,
        amount: 800,
      },
    ],
    totals: {
      subtotal: 2200,
      tax: 176,
      total: 2376,
    },
    notes: "Thank you for your business. Payment has been received.",
    paymentMethod: {
      bankTransfer: {
        accountName: "Acme Corporation",
        bsb: "123-456",
        accountNumber: "123456789",
      },
      paypal: "billing@acmecorp.com",
      creditCard: "Accepted via secure payment gateway",
    },
    metadata: {
      createdAt: "2025-09-25T11:30:18Z",
      updatedAt: "2025-09-25T15:45:22Z",
      currency: "USD",
      taxRate: 0.08,
    },
  },
  "INV-2025-006": {
    company: {
      name: "Acme Corporation",
      address: "123 Business St, City, State 12345",
      phone: "(555) 123-4567",
      email: "billing@acme.com",
      website: "www.acmecorp.com",
      abn: "12 345 678 901",
      logo: "/logo.png",
    },
    client: {
      name: "Diana Prince",
      address: "Wonder Tower, Metropolis, State 99999",
      phone: "(555) 999-0000",
      email: "diana@wondertech.com",
      website: "www.wondertech.com",
    },
    project: {
      name: "API Integration",
    },
    invoice: {
      number: "INV-2025-006",
      date: "2025-09-26",
      dueDate: "2025-10-26",
      status: "Unpaid",
    },
    items: [
      {
        description: "API Development",
        units: 30,
        price: 120,
        tax: 288,
        amount: 3600,
      },
      {
        description: "Integration Testing",
        units: 15,
        price: 80,
        tax: 96,
        amount: 1200,
      },
      {
        description: "Documentation",
        units: 5,
        price: 100,
        tax: 40,
        amount: 500,
      },
    ],
    totals: {
      subtotal: 5300,
      tax: 424,
      total: 5724,
    },
    notes: "Thank you for your business. Payment is due within 30 days.",
    paymentMethod: {
      bankTransfer: {
        accountName: "Acme Corporation",
        bsb: "123-456",
        accountNumber: "123456789",
      },
      paypal: "billing@acmecorp.com",
      creditCard: "Accepted via secure payment gateway",
    },
    metadata: {
      createdAt: "2025-09-26T08:15:30Z",
      updatedAt: "2025-09-26T08:15:30Z",
      currency: "USD",
      taxRate: 0.08,
    },
  },
  "INV-2025-007": {
    company: {
      name: "Acme Corporation",
      address: "123 Business St, City, State 12345",
      phone: "(555) 123-4567",
      email: "billing@acme.com",
      website: "www.acmecorp.com",
      abn: "12 345 678 901",
      logo: "/logo.png",
    },
    client: {
      name: "Edward Norton",
      address: "Paper Street, Fight Club City, State 11111",
      phone: "(555) 111-2222",
      email: "edward@fightclub.com",
      website: "www.fightclub.com",
    },
    project: {
      name: "Database Migration",
    },
    invoice: {
      number: "INV-2025-007",
      date: "2025-09-27",
      dueDate: "2025-10-27",
      status: "Paid",
    },
    items: [
      {
        description: "Database Design",
        units: 20,
        price: 150,
        tax: 240,
        amount: 3000,
      },
      {
        description: "Data Migration",
        units: 1,
        price: 4000,
        tax: 320,
        amount: 4000,
      },
      {
        description: "Testing & Validation",
        units: 10,
        price: 100,
        tax: 80,
        amount: 1000,
      },
    ],
    totals: {
      subtotal: 8000,
      tax: 640,
      total: 8640,
    },
    notes: "Thank you for your business. Payment has been received.",
    paymentMethod: {
      bankTransfer: {
        accountName: "Acme Corporation",
        bsb: "123-456",
        accountNumber: "123456789",
      },
      paypal: "billing@acmecorp.com",
      creditCard: "Accepted via secure payment gateway",
    },
    metadata: {
      createdAt: "2025-09-27T12:45:15Z",
      updatedAt: "2025-09-27T16:20:30Z",
      currency: "USD",
      taxRate: 0.08,
    },
  },
  "INV-2025-008": {
    company: {
      name: "Acme Corporation",
      address: "123 Business St, City, State 12345",
      phone: "(555) 123-4567",
      email: "billing@acme.com",
      website: "www.acmecorp.com",
      abn: "12 345 678 901",
      logo: "/logo.png",
    },
    client: {
      name: "Fiona Green",
      address: "Green Energy Blvd, Eco City, State 22222",
      phone: "(555) 333-4444",
      email: "fiona@greenenergy.com",
      website: "www.greenenergy.com",
    },
    project: {
      name: "Sustainability Dashboard",
    },
    invoice: {
      number: "INV-2025-008",
      date: "2025-09-28",
      dueDate: "2025-10-28",
      status: "Draft",
    },
    items: [
      {
        description: "Dashboard Development",
        units: 25,
        price: 120,
        tax: 240,
        amount: 3000,
      },
      {
        description: "Data Integration",
        units: 15,
        price: 80,
        tax: 96,
        amount: 1200,
      },
      {
        description: "Training",
        units: 5,
        price: 100,
        tax: 40,
        amount: 500,
      },
    ],
    totals: {
      subtotal: 4700,
      tax: 376,
      total: 5076,
    },
    notes: "Draft invoice - subject to final approval.",
    paymentMethod: {
      bankTransfer: {
        accountName: "Acme Corporation",
        bsb: "123-456",
        accountNumber: "123456789",
      },
      paypal: "billing@acmecorp.com",
      creditCard: "Accepted via secure payment gateway",
    },
    metadata: {
      createdAt: "2025-09-28T09:30:45Z",
      updatedAt: "2025-09-28T09:30:45Z",
      currency: "USD",
      taxRate: 0.08,
    },
  },
};
