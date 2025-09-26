"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Trash2, Calendar, HardDrive } from "lucide-react";
import { getFileIcon, formatFileSize } from "@/lib/file-utils";
import { PasswordPromptModal } from "./password-prompt-modal";
interface PublicFileData {
  id: string;
  file_name: string;
  created_at: string;
  file_size: number | null;
  file_type: string | null;
  download_count: number;
  expiry_date: string | null;
}
import { formatDistanceToNow, format, isAfter } from "date-fns";

interface FileItemProps {
  file: PublicFileData;
}

export function FileItem({ file }: FileItemProps) {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    action: "download" | "delete";
  }>({
    isOpen: false,
    action: "download",
  });

  const FileIconComponent = getFileIcon(file.file_name);
  const isExpired = file.expiry_date ? isAfter(new Date(), new Date(file.expiry_date)) : false;

  // Calculate days until expiry
  const getDaysUntilExpiry = () => {
    if (file.expiry_date) {
      const expiryDate = new Date(file.expiry_date);
      const now = new Date();
      const diffTime = expiryDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } else {
      // Auto-expire after 14 days
      const createdDate = new Date(file.created_at);
      const expiryDate = new Date(createdDate.getTime() + 14 * 24 * 60 * 60 * 1000);
      const now = new Date();
      const diffTime = expiryDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
  };

  const daysUntilExpiry = getDaysUntilExpiry();

  const handleDownload = () => {
    setModalState({ isOpen: true, action: "download" });
  };

  const handleDelete = () => {
    setModalState({ isOpen: true, action: "delete" });
  };

  const handleModalClose = () => {
    setModalState({ isOpen: false, action: "download" });
  };

  if (isExpired || daysUntilExpiry <= 0) {
    return null; // Don't render expired files
  }

  return (
    <>
      <div className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition-colors">
        <div className="flex min-w-0 flex-1 items-center space-x-4">
          <div className="text-2xl">
            <FileIconComponent className="h-8 w-8" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate font-medium">{file.file_name}</h3>
            <div className="text-muted-foreground flex items-center space-x-4 text-sm">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDistanceToNow(new Date(file.created_at), { addSuffix: true })}
              </span>

              {file.file_size && (
                <span className="flex items-center gap-1">
                  <HardDrive className="h-3 w-3" />
                  {formatFileSize(file.file_size)}
                </span>
              )}

              {file.download_count > 0 && (
                <span className="flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  {file.download_count} downloads
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Expiry Badge */}
          {daysUntilExpiry <= 3 && (
            <Badge variant="destructive" className="text-xs">
              {daysUntilExpiry === 1 ? "Expires tomorrow" : `${daysUntilExpiry} days left`}
            </Badge>
          )}

          {daysUntilExpiry > 3 && daysUntilExpiry <= 7 && (
            <Badge variant="secondary" className="text-xs">
              {daysUntilExpiry} days left
            </Badge>
          )}

          {file.expiry_date && (
            <div className="text-muted-foreground text-xs">
              Expires: {format(new Date(file.expiry_date), "MMM dd, yyyy")}
            </div>
          )}

          {!file.expiry_date && (
            <div className="text-muted-foreground text-xs">Auto-expires in {daysUntilExpiry} days</div>
          )}

          {/* Action Buttons */}
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="mr-1 h-4 w-4" />
            Download
          </Button>

          <Button variant="outline" size="sm" onClick={handleDelete}>
            <Trash2 className="mr-1 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <PasswordPromptModal
        isOpen={modalState.isOpen}
        onClose={handleModalClose}
        fileId={file.id}
        fileName={file.file_name}
        action={modalState.action}
      />
    </>
  );
}
