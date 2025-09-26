"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { uploadFile } from "@/server/file-sharing-actions";
import { validateFile, formatFileSize } from "@/lib/file-utils";
import { format } from "date-fns";

const uploadSchema = z.object({
  file: z.instanceof(File, { message: "Please select a file" }),
  fileName: z.string().min(1, "File name is required").max(255, "File name too long"),
  password: z.string().min(6, "Password must be at least 6 characters").max(128, "Password too long"),
  expiryDate: z.date().optional(),
});

type UploadFormData = z.infer<typeof uploadSchema>;

export function FileUploadForm() {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<string>("");

  const form = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      fileName: "",
      password: "",
      expiryDate: undefined,
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validation = validateFile(file);

      if (!validation.isValid) {
        toast.error(validation.errors.join(", "));
        event.target.value = "";
        return;
      }

      setSelectedFile(file);
      form.setValue("file", file);
      form.setValue("fileName", file.name);
      form.clearErrors("file");
    }
  };

  const onSubmit = async (data: UploadFormData) => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus("Preparing file...");

    try {
      const formData = new FormData();
      formData.append("file", data.file);
      formData.append("fileName", data.fileName);
      formData.append("password", data.password);

      if (data.expiryDate) {
        formData.append("expiryDate", data.expiryDate.toISOString());
      }

      setUploadStatus("Encrypting and uploading...");
      setUploadProgress(25);

      const result = await uploadFile(formData);

      setUploadProgress(100);

      if (result.success) {
        toast.success("File uploaded successfully!", {
          description: `File "${result.data?.fileName}" is now available for download.`,
        });

        // Reset form
        form.reset();
        setSelectedFile(null);

        // Reset file input
        const fileInput = document.getElementById("file-input") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      } else {
        toast.error("Upload failed", {
          description: result.error,
        });
      }
    } catch (error) {
      console.error("Upload error:", error);

      let errorMessage = "An unexpected error occurred";
      const errorStr = error instanceof Error ? error.message : String(error);

      if (errorStr.includes("413") || errorStr.includes("Body exceeded")) {
        errorMessage = "File is too large. Please select a smaller file (max 10MB).";
      } else if (errorStr.includes("timeout") || errorStr.includes("fetch failed")) {
        errorMessage = "Upload timed out. Please check your connection and try again.";
      } else if (errorStr.includes("network") || errorStr.includes("connection")) {
        errorMessage = "Network error. Please check your internet connection.";
      }

      toast.error("Upload failed", {
        description: errorMessage,
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setUploadStatus("");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* File Input */}
        <div className="space-y-2">
          <Label htmlFor="file-input">Select File</Label>
          <div className="relative">
            <Input
              id="file-input"
              type="file"
              onChange={handleFileChange}
              className="file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:mr-4 file:rounded-md file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold"
              accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.svg,.webp,.doc,.docx,.txt,.rtf,.xls,.xlsx,.csv,.ppt,.pptx,.zip,.rar,.7z,.tar,.gz,.js,.ts,.jsx,.tsx,.html,.css,.json,.xml,.md,.py,.java,.cpp,.c,.php,.rb,.go,.rs"
            />
          </div>

          {selectedFile && (
            <div className="text-muted-foreground text-sm">
              Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
            </div>
          )}

          {form.formState.errors.file && (
            <p className="text-destructive text-sm">{form.formState.errors.file.message}</p>
          )}
        </div>

        {/* File Name */}
        <FormField
          control={form.control}
          name="fileName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>File Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter a display name for your file" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter a secure password (min. 6 characters)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Expiry Date */}
        <FormField
          control={form.control}
          name="expiryDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Expiry Date (Optional)</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date (auto-deletes in 14 days if not set)</span>
                      )}
                      <Calendar className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                  {field.value && (
                    <div className="border-t p-3">
                      <Button variant="ghost" size="sm" onClick={() => field.onChange(undefined)} className="w-full">
                        Clear date
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Progress Display */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{uploadStatus}</span>
              <span className="text-muted-foreground">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </div>
        )}

        {/* Submit Button */}
        <Button type="submit" disabled={isUploading || !selectedFile} className="w-full">
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {uploadStatus || "Uploading..."}
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload File
            </>
          )}
        </Button>

        {/* Help Text */}
        <div className="text-muted-foreground space-y-1 text-sm">
          <p>• Supported formats: PDF, images, documents, code files, archives</p>
          <p>• Maximum file size: 10MB</p>
          <p>• Files are encrypted with your password before upload</p>
          <p>• Files without expiry date are auto-deleted after 14 days</p>
        </div>
      </form>
    </Form>
  );
}
