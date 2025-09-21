interface InvoiceItemsTableProps {
  items: Array<{
    description: string;
    units: number;
    price: number;
    tax: number;
    amount: number;
  }>;
}

export function InvoiceItemsTable({ items }: InvoiceItemsTableProps) {
  return (
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
  );
}
