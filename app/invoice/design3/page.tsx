import { invoiceData3 } from "../data";

export default function InvoiceDesign3() {
  const { company, client, invoice, items, totals, notes, metadata } =
    invoiceData3;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-light tracking-wide mb-2">INVOICE</h1>
          <p className="text-gray-400 text-lg">#{invoice.number}</p>
        </div>

        {/* Company and Client Info */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-300">From</h2>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{company.name}</p>
              <p className="text-gray-400">{company.address}</p>
              <p className="text-gray-400">{company.phone}</p>
              <p className="text-gray-400">{company.email}</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-300">To</h2>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{client.name}</p>
              <p className="text-gray-400">{client.address}</p>
              <p className="text-gray-400">{client.phone}</p>
              <p className="text-gray-400">{client.email}</p>
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-gray-400 text-sm uppercase tracking-wide">
                Invoice Date
              </p>
              <p className="text-xl font-semibold mt-1">{invoice.date}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm uppercase tracking-wide">
                Due Date
              </p>
              <p className="text-xl font-semibold mt-1">{invoice.dueDate}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm uppercase tracking-wide">
                Status
              </p>
              <span
                className={`inline-block px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide mt-1 ${
                  invoice.status === "Paid"
                    ? "bg-green-600 text-white"
                    : invoice.status === "Unpaid"
                    ? "bg-yellow-600 text-white"
                    : "bg-red-600 text-white"
                }`}
              >
                {invoice.status}
              </span>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="space-y-4 mb-12">
          {items.map((item, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">
                    {item.description}
                  </h3>
                  <div className="flex space-x-6 text-gray-400">
                    <span>Units: {item.units}</span>
                    <span>Price: ${item.price}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">${item.amount}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Subtotal</span>
              <span className="text-xl">${totals.subtotal}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">
                Tax ({metadata.taxRate * 100}%)
              </span>
              <span className="text-xl">${totals.tax}</span>
            </div>
            <div className="border-t border-gray-700 pt-4 flex justify-between items-center">
              <span className="text-2xl font-bold">Total</span>
              <span className="text-3xl font-bold text-blue-400">
                ${totals.total}
              </span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Notes</h3>
          <p className="text-gray-400 leading-relaxed">{notes}</p>
        </div>

        {/* Metadata */}
        <div className="text-center text-gray-500 text-sm space-y-1">
          <p>
            Generated on {new Date(metadata.createdAt).toLocaleDateString()}
          </p>
          <p>
            Last modified {new Date(metadata.updatedAt).toLocaleDateString()}
          </p>
          <p>All amounts in {metadata.currency}</p>
        </div>
      </div>
    </div>
  );
}
