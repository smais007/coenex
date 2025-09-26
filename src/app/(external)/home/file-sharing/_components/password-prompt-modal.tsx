"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { downloadFile, deleteFile } from "@/server/file-sharing-actions";

interface PasswordPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileId: string;
  fileName: string;
  action: "download" | "delete";
}

export function PasswordPromptModal({ isOpen, onClose, fileId, fileName, action }: PasswordPromptModalProps) {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password.trim()) {
      toast.error("Please enter a password");
      return;
    }

    setIsLoading(true);

    try {
      if (action === "download") {
        const result = await downloadFile(fileId, password);

        if (result.success && result.data) {
          // Create blob and trigger download
          const blob = new Blob([result.data.fileBuffer], {
            type: result.data.contentType,
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = result.data.fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          toast.success("File downloaded successfully!");
          onClose();
        } else {
          toast.error("Download failed", {
            description: result.error,
          });
        }
      } else if (action === "delete") {
        const result = await deleteFile(fileId, password);

        if (result.success) {
          toast.success("File deleted successfully!");
          onClose();
        } else {
          toast.error("Delete failed", {
            description: result.error,
          });
        }
      }
    } catch (error) {
      console.error(`${action} error:`, error);
      toast.error(`${action} failed`, {
        description: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPassword("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {action === "download" ? <Download className="h-5 w-5" /> : <Trash2 className="h-5 w-5" />}
            {action === "download" ? "Download" : "Delete"} File
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">
              Enter the password to {action} &ldquo;<span className="font-medium">{fileName}</span>&rdquo;
            </p>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter file password"
                disabled={isLoading}
                autoFocus
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !password.trim()}
              variant={action === "delete" ? "destructive" : "default"}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {action === "download" ? "Downloading..." : "Deleting..."}
                </>
              ) : (
                <>
                  {action === "download" ? <Download className="mr-2 h-4 w-4" /> : <Trash2 className="mr-2 h-4 w-4" />}
                  {action === "download" ? "Download" : "Delete"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
