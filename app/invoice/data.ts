// Dummy data for invoices
export const invoiceData = {
  company: {
    name: "Acme Corporation",
    address: "123 Business St, City, State 12345",
    phone: "(555) 123-4567",
    email: "billing@acme.com",
    website: "www.acmecorp.com",
    abn: "12 345 678 901",
    logo: "/logo.png", // placeholder
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
};

export const invoiceData2 = {
  ...invoiceData,
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
  ],
  totals: {
    subtotal: 8000,
    tax: 640,
    total: 8640,
  },
};

export const invoiceData3 = {
  ...invoiceData,
  invoice: {
    number: "INV-2025-003",
    date: "2025-09-23",
    dueDate: "2025-10-23",
    status: "Overdue",
  },
  items: [
    {
      description: "Mobile App Development",
      units: 80,
      price: 85,
      tax: 544,
      amount: 6800,
    },
    {
      description: "Testing & QA",
      units: 15,
      price: 60,
      tax: 72,
      amount: 900,
    },
    {
      description: "Deployment",
      units: 5,
      price: 200,
      tax: 80,
      amount: 1000,
    },
  ],
  totals: {
    subtotal: 8700,
    tax: 696,
    total: 9396,
  },
};
