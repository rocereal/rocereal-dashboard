import Image from "next/image";

interface InvoiceHeaderProps {
  company: {
    name: string;
    logo: string;
  };
  invoice: {
    number: string;
  };
}

export function InvoiceHeader({ company, invoice }: InvoiceHeaderProps) {
  return (
    <div className="flex justify-between items-start mb-6 pb-4 border-b-1 border-gray-300">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">INVOICE</h1>
        <p className="text-gray-600 text-lg">#{invoice.number}</p>
      </div>
      <div className="text-right">
        <Image
          src={company.logo}
          alt={`${company.name} Logo`}
          width={96}
          height={96}
          className="object-contain"
        />
      </div>
    </div>
  );
}
