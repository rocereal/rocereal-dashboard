import { invoiceData2 } from "../data";

export default function InvoiceDesign2() {
  const { company, client, invoice, items, totals, notes, metadata } =
    invoiceData2;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-indigo-600">INVOICE</h1>
              <p className="text-gray-600 mt-1">#{invoice.number}</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-semibold text-gray-800">
                {company.name}
              </h2>
              <div className="text-gray-600 text-sm mt-2">
                <p>{company.address}</p>
                <p>
                  {company.phone} | {company.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Client and Invoice Info */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Bill To
            </h3>
            <div className="space-y-1">
              <p className="font-medium text-gray-900">{client.name}</p>
              <p className="text-gray-600">{client.address}</p>
              <p className="text-gray-600">{client.phone}</p>
              <p className="text-gray-600">{client.email}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Invoice Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Invoice Date</p>
                <p className="font-medium">{invoice.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Due Date</p>
                <p className="font-medium">{invoice.dueDate}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Status</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    invoice.status === "Paid"
                      ? "bg-green-100 text-green-800"
                      : invoice.status === "Unpaid"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {invoice.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <table className="w-full">
            <thead className="bg-indigo-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Description
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  Qty
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  Rate
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.description}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-900">
                    {item.units}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-900">
                    ${item.price}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                    ${item.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals and Notes */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Notes</h3>
            <p className="text-gray-600 text-sm">{notes}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Payment Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">${totals.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Tax ({metadata.taxRate * 100}%):
                </span>
                <span className="font-medium">${totals.tax}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-3">
                <span>Total:</span>
                <span className="text-indigo-600">${totals.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Metadata Footer */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>
            Invoice created on {metadata.createdAt} | Last updated{" "}
            {metadata.updatedAt} | Currency: {metadata.currency}
          </p>
        </div>
      </div>
    </div>
  );
}
