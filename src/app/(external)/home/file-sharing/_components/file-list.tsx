"use client";

import { useEffect, useState } from "react";
import { FileItem } from "./file-item";
import { FileSearch } from "./file-search";
import { Button } from "@/components/ui/button";
import { RefreshCw, Trash2 } from "lucide-react";
import { getFilesList, cleanupExpiredFiles } from "@/server/file-sharing-actions";
import { useFileSearchStore } from "@/stores/file-search-store";
interface PublicFileData {
  id: string;
  file_name: string;
  created_at: string;
  file_size: number | null;
  file_type: string | null;
  download_count: number;
  expiry_date: string | null;
}
import { toast } from "sonner";

export function FileList() {
  const [files, setFiles] = useState<PublicFileData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const { searchQuery } = useFileSearchStore();

  const fetchFiles = async (search?: string) => {
    try {
      const result = await getFilesList(search);
      if (result.success) {
        setFiles(result.data || []);
      } else {
        toast.error("Failed to fetch files", {
          description: result.error,
        });
      }
    } catch (error) {
      console.error("Fetch files error:", error);
      toast.error("Failed to fetch files");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchFiles(searchQuery);
  };

  const handleCleanup = async () => {
    setIsCleaningUp(true);
    try {
      const result = await cleanupExpiredFiles();
      if (result.success) {
        toast.success("Cleanup completed", {
          description: `Removed ${result.data?.deletedCount || 0} expired files`,
        });
        await fetchFiles(searchQuery);
      } else {
        toast.error("Cleanup failed", {
          description: result.error,
        });
      }
    } catch (error) {
      console.error("Cleanup error:", error);
      toast.error("Cleanup failed");
    } finally {
      setIsCleaningUp(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchFiles();
  }, []);

  // Search effect
  useEffect(() => {
    if (!isLoading) {
      const timeoutId = setTimeout(() => {
        fetchFiles(searchQuery);
      }, 300); // Debounce search

      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, isLoading]);

  const filteredFiles = files.filter((file) => {
    if (!searchQuery) return true;
    return file.file_name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with search and actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <FileSearch />

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`mr-1 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button variant="outline" size="sm" onClick={handleCleanup} disabled={isCleaningUp}>
            <Trash2 className="mr-1 h-4 w-4" />
            {isCleaningUp ? "Cleaning..." : "Cleanup Expired"}
          </Button>
        </div>
      </div>

      {/* Files list */}
      {filteredFiles.length === 0 ? (
        <div className="py-12 text-center">
          <div className="text-muted-foreground">
            {searchQuery ? (
              <>
                No files found matching &ldquo;<span className="font-medium">{searchQuery}</span>&rdquo;
              </>
            ) : (
              "No files uploaded yet"
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFiles.map((file) => (
            <FileItem key={file.id} file={file} />
          ))}
        </div>
      )}

      {/* Stats */}
      {filteredFiles.length > 0 && (
        <div className="text-muted-foreground border-t pt-4 text-center text-sm">
          Showing {filteredFiles.length} {filteredFiles.length === 1 ? "file" : "files"}
          {searchQuery && ` matching "${searchQuery}"`}
        </div>
      )}
    </div>
  );
}
