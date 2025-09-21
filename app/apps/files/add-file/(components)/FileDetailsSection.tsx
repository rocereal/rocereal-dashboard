"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Folder } from "lucide-react";
import { mockFoldersForUpload } from "@/data/files";

interface FileDetailsSectionProps {
  fileName: string;
  onFileNameChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  selectedFolder: string;
  onFolderChange: (value: string) => void;
}

export default function FileDetailsSection({
  fileName,
  onFileNameChange,
  description,
  onDescriptionChange,
  selectedFolder,
  onFolderChange,
}: FileDetailsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          File Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fileName">File Name</Label>
            <Input
              id="fileName"
              value={fileName}
              onChange={(e) => onFileNameChange(e.target.value)}
              placeholder="Enter file name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="folder">Folder</Label>
            <Select value={selectedFolder} onValueChange={onFolderChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select folder" />
              </SelectTrigger>
              <SelectContent>
                {mockFoldersForUpload.map((folder) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    <div className="flex items-center gap-2">
                      <Folder className="h-4 w-4" />
                      {folder.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Add a description for this file..."
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}
