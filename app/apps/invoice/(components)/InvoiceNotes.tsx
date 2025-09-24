interface InvoiceNotesProps {
  notes: string;
}

/**
 * Invoice Notes Component
 * This component displays additional notes for the invoice
 * Renders notes in a styled box
 * @param notes - The invoice notes text
 * @returns The JSX element for invoice notes
 */
export function InvoiceNotes({ notes }: InvoiceNotesProps) {
  return (
    <div className="mb-6 p-4 bg-gray-50 border  border-gray-200 rounded-md">
      <h3 className="font-bold text-gray-900 mb-2">Notes</h3>
      <p className="text-gray-700 text-sm leading-relaxed">{notes}</p>
    </div>
  );
}
