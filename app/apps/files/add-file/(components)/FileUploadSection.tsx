"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, X } from "lucide-react";

/**
 * Props for FileUploadSection component
 * @param selectedFile - The currently selected file object or null if no file is selected
 * @param onFileSelect - Callback function triggered when a file is selected via input
 * @param onFileRemove - Callback function to remove the currently selected file
 */
interface FileUploadSectionProps {
  selectedFile: File | null;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFileRemove: () => void;
}

/**
 * File Upload Section Component
 * Interactive file upload interface with drag-and-drop and click-to-upload functionality
 * Displays upload area with visual indicators and handles file selection via input
 * Shows selected file information including name, size, and type with remove option
 * Provides responsive design that adapts to different screen sizes
 * Includes accessibility features with proper labels and hidden file inputs
 * @param selectedFile - The currently selected file object or null if no file is selected
 * @param onFileSelect - Callback function triggered when a file is selected via input
 * @param onFileRemove - Callback function to remove the currently selected file
 * @returns The JSX element representing the file upload interface
 */
export default function FileUploadSection({
  selectedFile,
  onFileSelect,
  onFileRemove,
}: FileUploadSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          File Upload
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 dark:border-secondary rounded-lg p-8 text-center">
            <input
              type="file"
              onChange={onFileSelect}
              className="hidden"
              id="file-upload"
              accept="*/*"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                  <Upload className="h-6 w-6 text-gray-600 dark:text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm lg:text-base font-medium text-gray-900  dark:text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                </div>
              </div>
            </label>
          </div>

          {selectedFile && (
            <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="flex-1">
                <p className="font-medium text-sm lg:text-base">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB •{" "}
                  {selectedFile.type}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onFileRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
