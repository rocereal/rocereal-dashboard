import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ProjectInfoProps {
  projectName: string;
  onInputChange: (field: string, value: string | number) => void;
}

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
