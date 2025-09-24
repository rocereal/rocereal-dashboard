interface InvoiceAddressesProps {
  company: {
    name: string;
    address: string;
    abn: string;
    email: string;
    phone: string;
    website: string;
  };
  client: {
    name: string;
    address: string;
    email: string;
    phone: string;
    website: string;
  };
}

/**
 * Invoice Addresses Component
 * This component displays the company and client addresses in the invoice
 * Renders address information in a grid layout
 * @param company - The company address details
 * @param client - The client address details
 * @returns The JSX element for invoice addresses
 */
export function InvoiceAddresses({ company, client }: InvoiceAddressesProps) {
  return (
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
  );
}
