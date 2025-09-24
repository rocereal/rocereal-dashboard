interface InvoiceDetailsProps {
  project: {
    name: string;
  };
  invoice: {
    date: string;
    dueDate: string;
  };
}

/**
 * Invoice Details Component
 * This component displays the project name and invoice dates
 * Renders project and date information in a grid layout
 * @param project - The project details
 * @param invoice - The invoice date details
 * @returns The JSX element for invoice details
 */
export function InvoiceDetails({ project, invoice }: InvoiceDetailsProps) {
  return (
    <div className="mb-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-1">
            Project
          </h3>
          <p className="text-gray-900 font-medium">{project.name}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
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
    </div>
  );
}
