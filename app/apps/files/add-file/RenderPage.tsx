"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, ArrowLeft } from "lucide-react";
import Link from "next/link";
import FileUploadSection from "./(components)/FileUploadSection";
import FileDetailsSection from "./(components)/FileDetailsSection";
import AccessSharingSection from "./(components)/AccessSharingSection";

export default function AddFileRenderPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("root");
  const [permissions, setPermissions] = useState<
    "private" | "shared" | "public"
  >("private");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [userRoles, setUserRoles] = useState<
    Record<string, "viewer" | "editor">
  >({});
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!fileName) {
        setFileName(file.name);
      }
    }
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
  };

  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );

    // Set default role for new users
    if (!selectedUsers.includes(userId)) {
      setUserRoles((prev) => ({ ...prev, [userId]: "viewer" }));
    }
  };

  const handleRoleChange = (userId: string, role: "viewer" | "editor") => {
    setUserRoles((prev) => ({ ...prev, [userId]: role }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);

    // Simulate file upload
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Here you would typically upload the file to your backend
    console.log("Uploading file:", {
      file: selectedFile,
      name: fileName,
      description,
      folder: selectedFolder,
      permissions,
      sharedUsers: selectedUsers.map((userId) => ({
        userId,
        role: userRoles[userId],
      })),
    });

    setIsUploading(false);
    // Redirect to files page or show success message
  };

  return (
    <div className="min-h-screen flex rounded-md border">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/apps/files">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Files
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Add File</h1>
                <p className="text-muted-foreground">
                  Upload a new file and set access permissions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Upload Section */}
              <FileUploadSection
                selectedFile={selectedFile}
                onFileSelect={handleFileSelect}
                onFileRemove={handleFileRemove}
              />

              {/* File Details Section */}
              <FileDetailsSection
                fileName={fileName}
                onFileNameChange={setFileName}
                description={description}
                onDescriptionChange={setDescription}
                selectedFolder={selectedFolder}
                onFolderChange={setSelectedFolder}
              />

              {/* Access & Sharing Section */}
              <AccessSharingSection
                permissions={permissions}
                onPermissionsChange={setPermissions}
                selectedUsers={selectedUsers}
                onUserToggle={handleUserToggle}
                userRoles={userRoles}
                onRoleChange={handleRoleChange}
              />

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6">
                <Link href="/apps/files">
                  <Button type="button" variant="outline">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </Link>

                <Button type="submit" disabled={!selectedFile || isUploading}>
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload File
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
