import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InvoiceBasicInfoProps {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  status: string;
  onInputChange: (field: string, value: string | number) => void;
}

export function InvoiceBasicInfo({
  invoiceNumber,
  date,
  dueDate,
  status,
  onInputChange,
}: InvoiceBasicInfoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <Label htmlFor="invoiceNumber">Invoice Number</Label>
        <Input
          id="invoiceNumber"
          value={invoiceNumber}
          onChange={(e) => onInputChange("invoiceNumber", e.target.value)}
          placeholder="Auto-generated if empty"
        />
      </div>
      <div>
        <Label htmlFor="date">Issue Date</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => onInputChange("date", e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="dueDate">Due Date</Label>
        <Input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => onInputChange("dueDate", e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select
          value={status}
          onValueChange={(value) => onInputChange("status", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="Unpaid">Unpaid</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
