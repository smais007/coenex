import { Suspense } from "react";
import { FileUploadForm } from "./_components/file-upload-form";
import { FileList } from "./_components/file-list";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Clock, Lock, Download } from "lucide-react";

export default function FileSharePage() {
  return (
    <div className="container mx-auto space-y-8 py-8">
      {/* Header */}
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Anonymous File Sharing</h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          Share files securely with password protection and automatic expiration. Files are encrypted before upload and
          automatically deleted after 14 days.
        </p>

        {/* Feature highlights */}
        <div className="mx-auto mt-8 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
          <div className="flex flex-col items-center space-y-2 p-4">
            <Shield className="h-8 w-8 text-green-600" />
            <span className="text-sm font-medium">Encrypted</span>
          </div>
          <div className="flex flex-col items-center space-y-2 p-4">
            <Lock className="h-8 w-8 text-blue-600" />
            <span className="text-sm font-medium">Password Protected</span>
          </div>
          <div className="flex flex-col items-center space-y-2 p-4">
            <Clock className="h-8 w-8 text-orange-600" />
            <span className="text-sm font-medium">Auto Expires</span>
          </div>
          <div className="flex flex-col items-center space-y-2 p-4">
            <Download className="h-8 w-8 text-purple-600" />
            <span className="text-sm font-medium">Easy Download</span>
          </div>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-8 md:flex-row">
        {/* Upload Section */}
        <Card className="w-full md:w-1/2">
          <CardHeader>
            <CardTitle>Upload File</CardTitle>
            <CardDescription>
              Upload a file with password protection. Supported formats: PDF, images, documents, code files, archives,
              and more. Maximum file size: 50MB.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileUploadForm />
          </CardContent>
        </Card>
        {/* Files List Section */}
        <Card className="w-full md:w-1/2">
          <CardHeader>
            <CardTitle>Available Files</CardTitle>
            <CardDescription>
              Browse and download files. Enter the correct password to download or delete files.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense
              fallback={
                <div className="flex items-center justify-center p-8">
                  <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
                </div>
              }
            >
              <FileList />
            </Suspense>
          </CardContent>
        </Card>
      </div>
      <Separator />
      {/* Footer */}
      <div className="text-muted-foreground space-y-2 text-center text-sm">
        <p>All files are encrypted with your password before upload.</p>
        <p>Files without expiry date are automatically deleted after 14 days.</p>
        <p>We do not store your passwords in plain text.</p>
      </div>
    </div>
  );
}
