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
      <Table className="rounded-md">
        <TableHeader className="bg-gray-100 !rounded-md overflow-hidden">
          <TableRow>
            <TableHead className="text-left">Description</TableHead>
            <TableHead className="text-right">Units</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Tax/GST</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item.description}</TableCell>
              <TableCell className="text-right">{item.units}</TableCell>
              <TableCell className="text-right">${item.price}</TableCell>
              <TableCell className="text-right">${item.tax}</TableCell>
              <TableCell className="text-right font-bold">
                ${item.amount}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
