interface InvoiceNotesProps {
  notes: string;
}

export function InvoiceNotes({ notes }: InvoiceNotesProps) {
  return (
    <div className="mb-6 p-4 bg-gray-50 border rounded-md">
      <h3 className="font-bold text-gray-900 mb-2">Notes</h3>
      <p className="text-gray-700 text-sm leading-relaxed">{notes}</p>
    </div>
  );
}
