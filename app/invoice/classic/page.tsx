import { invoiceData } from "../data";

export default function ClassicInvoice() {
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
  } = invoiceData;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-sm border border-gray-200 print:shadow-none print:border-none">
      {/* Header */}
      <div className="flex justify-between items-start mb-8 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">INVOICE</h1>
          <p className="text-gray-600 text-lg">#{invoice.number}</p>
        </div>
        <div className="text-right">
          <img
            src={company.logo}
            alt={`${company.name} Logo`}
            className="w-24 h-24 object-contain mb-4"
          />
        </div>
      </div>

      {/* Project & Dates */}
      <div className="mb-8">
        <div className="grid grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Project
            </h3>
            <p className="text-gray-900 font-medium">{project.name}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Issued Date
            </h3>
            <p className="text-gray-900">{invoice.date}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Due Date
            </h3>
            <p className="text-gray-900">{invoice.dueDate}</p>
          </div>
        </div>
      </div>

      {/* Addresses */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">From</h3>
          <div className="space-y-1">
            <p className="font-bold text-gray-900">{company.name}</p>
            <p className="text-gray-600">{company.address}</p>
            <p className="text-gray-600">ABN: {company.abn}</p>
            <p className="text-gray-600">{company.email}</p>
            <p className="text-gray-600">{company.phone}</p>
            <p className="text-gray-600">{company.website}</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">To</h3>
          <div className="space-y-1">
            <p className="font-bold text-gray-900">{client.name}</p>
            <p className="text-gray-600">{client.address}</p>
            <p className="text-gray-600">{client.email}</p>
            <p className="text-gray-600">{client.phone}</p>
            <p className="text-gray-600">{client.website}</p>
          </div>
        </div>
      </div>

      {/* Itemized Table */}
      <div className="mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-3 px-2 font-semibold text-gray-900">
                Description
              </th>
              <th className="text-right py-3 px-2 font-semibold text-gray-900">
                Units
              </th>
              <th className="text-right py-3 px-2 font-semibold text-gray-900">
                Price
              </th>
              <th className="text-right py-3 px-2 font-semibold text-gray-900">
                Tax/GST
              </th>
              <th className="text-right py-3 px-2 font-semibold text-gray-900">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-3 px-2 text-gray-900">{item.description}</td>
                <td className="py-3 px-2 text-right text-gray-900">
                  {item.units}
                </td>
                <td className="py-3 px-2 text-right text-gray-900">
                  ${item.price}
                </td>
                <td className="py-3 px-2 text-right text-gray-900">
                  ${item.tax}
                </td>
                <td className="py-3 px-2 text-right font-medium text-gray-900">
                  ${item.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-80">
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-gray-900">${totals.subtotal}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Tax/GST:</span>
              <span className="text-gray-900">${totals.tax}</span>
            </div>
            <div className="flex justify-between py-3 text-xl font-bold bg-gray-50 px-3 py-2 rounded">
              <span>Total:</span>
              <span className="text-blue-600">${totals.total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="mb-8 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{notes}</p>
      </div>

      {/* Payment Method Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Payment Methods
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-4 border border-gray-200 rounded">
            <h4 className="font-medium text-gray-900 mb-2">Bank Transfer</h4>
            <div className="text-sm text-gray-600 space-y-1">
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
          <div className="p-4 border border-gray-200 rounded">
            <h4 className="font-medium text-gray-900 mb-2">PayPal</h4>
            <p className="text-sm text-gray-600">{paymentMethod.paypal}</p>
          </div>
          <div className="p-4 border border-gray-200 rounded">
            <h4 className="font-medium text-gray-900 mb-2">Credit Card</h4>
            <p className="text-sm text-gray-600">{paymentMethod.creditCard}</p>
          </div>
        </div>
      </div>

      {/* Footer / Signature */}
      <div className="border-t border-gray-200 pt-8">
        <div className="flex justify-between items-end">
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-4">
              This invoice was generated on{" "}
              {new Date(metadata.createdAt).toLocaleDateString()} and is valid
              for 30 days.
            </p>
          </div>
          <div className="text-right">
            <div className="border-b border-gray-400 w-48 mb-2"></div>
            <p className="text-sm text-gray-600">Authorized Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
}
