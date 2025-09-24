/**
 * Project Info Component
 * Form section for collecting project information in invoice creation
 * Provides input field for project name to associate invoice with specific project
 * Used in invoice creation workflow for project tracking and organization
 * @param projectName - Current project name value
 * @param onInputChange - Callback function called when form field changes
 * @returns JSX element representing the project information form section
 */

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ProjectInfoProps {
  projectName: string;
  onInputChange: (field: string, value: string | number) => void;
}

/**
 * ProjectInfo component for collecting project details in invoice creation
 * Renders input field for project name to link invoice to specific project
 * Manages form state through parent component callbacks
 * @param projectName - Current project name value
 * @param onInputChange - Function called when project name changes
 * @returns JSX element representing the project information form
 */
export function ProjectInfo({ projectName, onInputChange }: ProjectInfoProps) {
  return (
    <div>
      <Label htmlFor="projectName">Project Name</Label>
      <Input
        id="projectName"
        value={projectName}
        onChange={(e) => onInputChange("projectName", e.target.value)}
        required
      />
    </div>
  );
}
