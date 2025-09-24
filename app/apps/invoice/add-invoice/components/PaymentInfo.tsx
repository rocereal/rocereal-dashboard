/**
 * Payment Info Component
 * Form section for collecting payment information and terms in invoice creation
 * Provides input fields for payment notes, bank details, PayPal, credit card info, and tax rate
 * Used in invoice creation workflow for payment instructions and financial details
 * @param notes - Invoice payment notes and terms
 * @param bankAccountName - Bank account holder name
 * @param bankBSB - Bank BSB (routing number)
 * @param bankAccountNumber - Bank account number
 * @param paypalEmail - PayPal payment email address
 * @param creditCardNote - Credit card payment instructions
 * @param taxRate - Tax rate percentage for calculations
 * @param onInputChange - Callback function called when form fields change
 * @returns JSX element representing the payment information form section
 */

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

/**
 * PaymentInfo component for collecting payment details and terms
 * Renders form fields for payment notes, banking information, and tax settings
 * Manages form state through parent component callbacks
 * @param notes - Current payment notes value
 * @param bankAccountName - Current bank account name value
 * @param bankBSB - Current BSB value
 * @param bankAccountNumber - Current account number value
 * @param paypalEmail - Current PayPal email value
 * @param creditCardNote - Current credit card note value
 * @param taxRate - Current tax rate value
 * @param onInputChange - Function called when any field value changes
 * @returns JSX element representing the payment information form
 */
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
