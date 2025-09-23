/**
 * FormActionsSection Component
 * Action buttons section component for forms with cancel and submit functionality
 * Handles form validation state and provides loading state for submission
 * Renders consistent action buttons with proper disabled states
 * @returns The form actions section component
 */
"use client";

import { Button } from "@/components/ui/button";

interface FormActionsSectionProps {
  onCancel: () => void;
  onSubmit: () => void;
  isValid: boolean;
  isSubmitting?: boolean;
}

/**
 * FormActionsSection function component
 * Renders cancel and submit buttons for forms with validation and loading states
 * Handles button states based on form validity and submission status
 * @param onCancel - Callback function when cancel button is clicked
 * @param onSubmit - Callback function when submit button is clicked
 * @param isValid - Whether the form is valid for submission
 * @param isSubmitting - Optional boolean indicating if form is currently submitting
 * @returns JSX element for the form actions section
 */
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
