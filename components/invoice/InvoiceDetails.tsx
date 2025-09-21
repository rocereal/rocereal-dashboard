interface InvoiceDetailsProps {
  project: {
    name: string;
  };
  invoice: {
    date: string;
    dueDate: string;
  };
}

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
