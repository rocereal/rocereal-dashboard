interface InvoicePaymentMethodsProps {
  paymentMethod: {
    bankTransfer: {
      accountName: string;
      bsb: string;
      accountNumber: string;
    };
    paypal: string;
    creditCard: string;
  };
}

/**
 * Invoice Payment Methods Component
 * This component displays available payment methods for the invoice
 * Renders bank transfer, PayPal, and credit card options
 * @param paymentMethod - The payment method details
 * @returns The JSX element for invoice payment methods
 */
export function InvoicePaymentMethods({
  paymentMethod,
}: InvoicePaymentMethodsProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Methods</h3>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="border  border-gray-200 rounded-md p-4">
          <h4 className="font-bold text-gray-900 mb-2">Bank Transfer</h4>
          <div className="text-sm text-gray-700 space-y-1">
            <p>
              <span className="font-medium">Account Name:</span>{" "}
              {paymentMethod.bankTransfer.accountName}
            </p>
            <p>
              <span className="font-medium">BSB:</span>{" "}
              {paymentMethod.bankTransfer.bsb}
            </p>
            <p>
              <span className="font-medium">Account Number:</span>{" "}
              {paymentMethod.bankTransfer.accountNumber}
            </p>
          </div>
        </div>
        <div className="border  border-gray-200 rounded-md p-4">
          <h4 className="font-bold text-gray-900 mb-2">PayPal</h4>
          <p className="text-sm text-gray-700">{paymentMethod.paypal}</p>
        </div>
        <div className="border  border-gray-200 rounded-md p-4">
          <h4 className="font-bold text-gray-900 mb-2">Credit Card</h4>
          <p className="text-sm text-gray-700">{paymentMethod.creditCard}</p>
        </div>
      </div>
    </div>
  );
}
