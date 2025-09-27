"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Trash2, Calendar, HardDrive, MoreVertical } from "lucide-react";
import { getFileIcon, formatFileSize } from "@/lib/file-utils";
import { PasswordPromptModal } from "./password-prompt-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  const getExpiryBadge = () => {
    if (daysUntilExpiry <= 1) {
      return (
        <Badge variant="destructive" className="text-xs font-medium">
          {daysUntilExpiry <= 0 ? "Expired" : "Expires today"}
        </Badge>
      );
    }
    if (daysUntilExpiry <= 3) {
      return (
        <Badge variant="destructive" className="text-xs font-medium">
          {daysUntilExpiry} days left
        </Badge>
      );
    }
    if (daysUntilExpiry <= 7) {
      return (
        <Badge variant="secondary" className="text-xs font-medium">
          {daysUntilExpiry} days left
        </Badge>
      );
    }
    return null;
  };

  if (isExpired || daysUntilExpiry <= 0) {
    return null; // Don't render expired files
  }

  return (
    <>
      {/* Desktop and Tablet Layout */}
      <div className="group border-border bg-card hover:border-muted-foreground/20 hover:bg-muted/30 relative rounded-lg border p-4 shadow-sm transition-all duration-200 hover:shadow-md">
        <div className="flex items-start justify-between gap-4">
          {/* File Info Section */}
          <div className="flex min-w-0 flex-1 items-start gap-4">
            {/* File Icon */}
            <div className="flex-shrink-0">
              <div className="bg-muted/50 group-hover:bg-muted flex h-12 w-12 items-center justify-center rounded-lg transition-colors">
                <FileIconComponent className="text-muted-foreground h-6 w-6" />
              </div>
            </div>

            {/* File Details */}
            <div className="min-w-0 flex-1 space-y-2">
              {/* File Name */}
              <h3 className="text-foreground group-hover:text-foreground/90 truncate text-base font-semibold">
                {file.file_name}
              </h3>

              {/* Metadata Row */}
              <div className="text-muted-foreground flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Uploaded </span>
                  {formatDistanceToNow(new Date(file.created_at), { addSuffix: true })}
                </span>

                {file.file_size && (
                  <span className="flex items-center gap-1.5">
                    <HardDrive className="h-3.5 w-3.5" />
                    {formatFileSize(file.file_size)}
                  </span>
                )}

                {file.download_count > 0 && (
                  <span className="flex items-center gap-1.5">
                    <Download className="h-3.5 w-3.5" />
                    {file.download_count} download{file.download_count !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {/* Expiry Info - Mobile Only */}
              <div className="flex flex-wrap items-center gap-2 sm:hidden">
                {getExpiryBadge()}
                <span className="text-muted-foreground text-xs">
                  {file.expiry_date
                    ? `Expires ${format(new Date(file.expiry_date), "MMM dd, yyyy")}`
                    : `Expires in ${daysUntilExpiry} days`}
                </span>
              </div>
            </div>
          </div>

          {/* Actions Section */}
          <div className="flex flex-shrink-0 items-start gap-3">
            {/* Expiry Info - Desktop/Tablet */}
            <div className="hidden flex-col items-end gap-2 sm:flex">
              {getExpiryBadge()}
              <span className="text-muted-foreground text-xs whitespace-nowrap">
                {file.expiry_date
                  ? `Expires ${format(new Date(file.expiry_date), "MMM dd")}`
                  : `${daysUntilExpiry} days left`}
              </span>
            </div>

            {/* Desktop Action Buttons */}
            <div className="hidden space-x-2 lg:flex">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="hover:bg-primary hover:text-primary-foreground h-9 px-3 text-sm font-medium transition-colors"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="hover:bg-destructive hover:text-destructive-foreground h-9 px-3 text-sm font-medium transition-colors"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>

            {/* Mobile/Tablet Action Menu */}
            <div className="lg:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="hover:bg-muted h-9 w-9 p-0 transition-colors">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={handleDownload} className="cursor-pointer font-medium">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-destructive focus:text-destructive cursor-pointer font-medium"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
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
