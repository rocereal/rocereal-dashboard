import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
      <Table className="!rounded-md">
        <TableHeader className="bg-gray-100 !rounded-md overflow-hidden hover:!bg-gray-100">
          <TableRow className="hover:!bg-transparent border-b border-gray-300">
            <TableHead className="text-left text-gray-800">
              Description
            </TableHead>
            <TableHead className="text-right text-gray-800">Units</TableHead>
            <TableHead className="text-right text-gray-800">Price</TableHead>
            <TableHead className="text-right text-gray-800">Tax/GST</TableHead>
            <TableHead className="text-right text-gray-800">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow
              key={index}
              className="border-gray-200 hover:!bg-transparent"
            >
              <TableCell className="font-medium text-gray-800">
                {item.description}
              </TableCell>
              <TableCell className="text-right text-gray-800">
                {item.units}
              </TableCell>
              <TableCell className="text-right text-gray-800">
                ${item.price}
              </TableCell>
              <TableCell className="text-right text-gray-800">
                ${item.tax}
              </TableCell>
              <TableCell className="text-right font-bold text-gray-800">
                ${item.amount}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
