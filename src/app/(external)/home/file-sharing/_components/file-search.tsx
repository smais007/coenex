"use client";

import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useFileSearchStore } from "@/stores/file-search-store";
import { Button } from "@/components/ui/button";

export function FileSearch() {
  const { searchQuery, setSearchQuery, clearSearch } = useFileSearchStore();

  return (
    <div className="relative max-w-md">
      <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform" />
      <Input
        placeholder="Search files..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10 pr-10"
      />
      {searchQuery && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearSearch}
          className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 transform p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
