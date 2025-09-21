import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface PaymentInfoProps {
  notes: string;
  bankAccountName: string;
  bankBSB: string;
  bankAccountNumber: string;
  paypalEmail: string;
  creditCardNote: string;
  taxRate: number;
  onInputChange: (field: string, value: string | number) => void;
}

export function PaymentInfo({
  notes,
  bankAccountName,
  bankBSB,
  bankAccountNumber,
  paypalEmail,
  creditCardNote,
  taxRate,
  onInputChange,
}: PaymentInfoProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => onInputChange("notes", e.target.value)}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="bankAccountName">Bank Account Name</Label>
          <Input
            id="bankAccountName"
            value={bankAccountName}
            onChange={(e) => onInputChange("bankAccountName", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="bankBSB">BSB</Label>
          <Input
            id="bankBSB"
            value={bankBSB}
            onChange={(e) => onInputChange("bankBSB", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="bankAccountNumber">Account Number</Label>
          <Input
            id="bankAccountNumber"
            value={bankAccountNumber}
            onChange={(e) => onInputChange("bankAccountNumber", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="paypalEmail">PayPal Email</Label>
          <Input
            id="paypalEmail"
            type="email"
            value={paypalEmail}
            onChange={(e) => onInputChange("paypalEmail", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="creditCardNote">Credit Card Note</Label>
          <Input
            id="creditCardNote"
            value={creditCardNote}
            onChange={(e) => onInputChange("creditCardNote", e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="taxRate">Tax Rate (%)</Label>
        <Input
          id="taxRate"
          type="number"
          min="0"
          max="100"
          step="0.01"
          value={taxRate}
          onChange={(e) =>
            onInputChange("taxRate", parseFloat(e.target.value) || 0)
          }
        />
      </div>
    </div>
  );
}
