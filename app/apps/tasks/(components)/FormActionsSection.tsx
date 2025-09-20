"use client";

import { Button } from "@/components/ui/button";

interface FormActionsSectionProps {
  onCancel: () => void;
  onSubmit: () => void;
  isValid: boolean;
  isSubmitting?: boolean;
}

export default function FormActionsSection({
  onCancel,
  onSubmit,
  isValid,
  isSubmitting = false,
}: FormActionsSectionProps) {
  return (
    <div className="flex gap-3">
      <Button
        variant="outline"
        className="flex-1"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button
        className="flex-1"
        onClick={onSubmit}
        disabled={!isValid || isSubmitting}
      >
        {isSubmitting ? "Creating..." : "Create Task"}
      </Button>
    </div>
  );
}
