interface InvoiceTotalsProps {
  totals: {
    subtotal: number;
    tax: number;
    total: number;
  };
}

export function InvoiceTotals({ totals }: InvoiceTotalsProps) {
  return (
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
  );
}
