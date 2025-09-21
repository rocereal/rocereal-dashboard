import { notFound } from "next/navigation";

// Mock invoice data - in a real app, this would come from a database
const invoiceData = {
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
};

interface PageProps {
  params: {
    id: string;
  };
}

export default function ClassicInvoice({ params }: PageProps) {
  const { id } = params;
  const data = invoiceData[id as keyof typeof invoiceData];

  if (!data) {
    notFound();
  }

  const {
    company,
    client,
    project,
    invoice,
    items,
    totals,
    notes,
    paymentMethod,
    metadata,
  } = data;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white print:p-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-gray-300">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">INVOICE</h1>
          <p className="text-gray-600 text-lg">#{invoice.number}</p>
        </div>
        <div className="text-right">
          <img
            src={company.logo}
            alt={`${company.name} Logo`}
            className="w-24 h-24 object-contain"
          />
        </div>
      </div>

      {/* Project & Dates */}
      <div className="mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-1">
              Project
            </h3>
            <p className="text-gray-900 font-medium">{project.name}</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-1">
              Issued Date
            </h3>
            <p className="text-gray-900">{invoice.date}</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-1">
              Due Date
            </h3>
            <p className="text-gray-900">{invoice.dueDate}</p>
          </div>
        </div>
      </div>

      {/* Addresses */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3">From</h3>
          <div className="space-y-1">
            <p className="font-bold text-gray-900">{company.name}</p>
            <p className="text-gray-700">{company.address}</p>
            <p className="text-gray-700">
              <span className="font-medium">ABN:</span> {company.abn}
            </p>
            <p className="text-gray-700">{company.email}</p>
            <p className="text-gray-700">{company.phone}</p>
            <p className="text-gray-700">{company.website}</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3">To</h3>
          <div className="space-y-1">
            <p className="font-bold text-gray-900">{client.name}</p>
            <p className="text-gray-700">{client.address}</p>
            <p className="text-gray-700">{client.email}</p>
            <p className="text-gray-700">{client.phone}</p>
            <p className="text-gray-700">{client.website}</p>
          </div>
        </div>
      </div>

      {/* Itemized Table */}
      <div className="mb-6">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-bold text-gray-900">
                Description
              </th>
              <th className="border border-gray-300 px-4 py-3 text-right text-sm font-bold text-gray-900">
                Units
              </th>
              <th className="border border-gray-300 px-4 py-3 text-right text-sm font-bold text-gray-900">
                Price
              </th>
              <th className="border border-gray-300 px-4 py-3 text-right text-sm font-bold text-gray-900">
                Tax/GST
              </th>
              <th className="border border-gray-300 px-4 py-3 text-right text-sm font-bold text-gray-900">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="border border-gray-300 px-4 py-3 text-gray-900">
                  {item.description}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-right text-gray-900">
                  {item.units}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-right text-gray-900">
                  ${item.price}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-right text-gray-900">
                  ${item.tax}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-right font-bold text-gray-900">
                  ${item.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-6">
        <div className="w-80 border border-gray-300 p-4 bg-gray-50">
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b border-gray-300">
              <span className="text-gray-700 font-medium">Subtotal:</span>
              <span className="text-gray-900">${totals.subtotal}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-300">
              <span className="text-gray-700 font-medium">Tax/GST:</span>
              <span className="text-gray-900">${totals.tax}</span>
            </div>
            <div className="flex justify-between py-3 text-xl font-bold border-t-2 border-gray-400 pt-3">
              <span>Total:</span>
              <span className="text-gray-900">${totals.total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="mb-6 p-4 bg-gray-50 border border-gray-300">
        <h3 className="font-bold text-gray-900 mb-2">Notes</h3>
        <p className="text-gray-700 text-sm leading-relaxed">{notes}</p>
      </div>

      {/* Payment Method Section */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Payment Methods
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="border border-gray-300 p-4">
            <h4 className="font-bold text-gray-900 mb-2">Bank Transfer</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <p>
                <span className="font-medium">Account Name:</span>{" "}
                {paymentMethod.bankTransfer.accountName}
              </p>
              <p>
                <span className="font-medium">BSB:</span>{" "}
                {paymentMethod.bankTransfer.bsb}
              </p>
              <p>
                <span className="font-medium">Account Number:</span>{" "}
                {paymentMethod.bankTransfer.accountNumber}
              </p>
            </div>
          </div>
          <div className="border border-gray-300 p-4">
            <h4 className="font-bold text-gray-900 mb-2">PayPal</h4>
            <p className="text-sm text-gray-700">{paymentMethod.paypal}</p>
          </div>
          <div className="border border-gray-300 p-4">
            <h4 className="font-bold text-gray-900 mb-2">Credit Card</h4>
            <p className="text-sm text-gray-700">{paymentMethod.creditCard}</p>
          </div>
        </div>
      </div>

      {/* Footer / Signature */}
      <div className="border-t-2 border-gray-300 pt-6">
        <div className="flex justify-between items-end">
          <div className="flex-1">
            <p className="text-xs text-gray-600 mb-4">
              This invoice was generated on{" "}
              {new Date(metadata.createdAt).toLocaleDateString()} and is valid
              for 30 days.
            </p>
          </div>
          <div className="text-right">
            <div className="border-b border-gray-600 w-48 mb-2"></div>
            <p className="text-sm text-gray-700">Authorized Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
}
