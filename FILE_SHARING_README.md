# Anonymous File Sharing System

A secure, password-protected file sharing system built with Next.js 15, TypeScript, and Supabase Cloud.

## Features

- 🔒 **Password Protected**: All files are encrypted with user-provided passwords
- 🔐 **End-to-End Encryption**: Files are encrypted before upload using AES encryption
- ⏰ **Auto-Expiry**: Files automatically expire after 14 days (or custom expiry date)
- 🔍 **Search & Filter**: Search files by name with real-time filtering
- 📊 **File Management**: View file metadata, download counts, and expiry status
- 🗑️ **Secure Deletion**: Delete files with password verification
- 📱 **Responsive Design**: Modern, clean UI built with shadcn/ui components

## Supported File Types

- **Documents**: PDF, DOC, DOCX, TXT, RTF
- **Spreadsheets**: XLS, XLSX, CSV
- **Presentations**: PPT, PPTX
- **Images**: JPG, JPEG, PNG, GIF, BMP, SVG, WebP
- **Archives**: ZIP, RAR, 7Z, TAR, GZ
- **Code Files**: JS, TS, JSX, TSX, HTML, CSS, JSON, XML, MD, PY, Java, CPP, C, PHP, RB, GO, RS

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **Backend**: Supabase Cloud (PostgreSQL + Storage)
- **Authentication**: Row Level Security (RLS)
- **Encryption**: crypto-js (AES)
- **Password Hashing**: bcrypt
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation

## Setup Instructions

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Settings > API** and copy your project URL and API keys
3. Go to **Storage > Buckets** and create a new bucket named `anonymous-files`
4. Set the bucket to **Private** (files are encrypted, so privacy is handled at application level)
5. Run the migration SQL in **SQL Editor**:

```sql
-- Run the contents of supabase/migrations/001_anonymous_files.sql
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Install Dependencies

```bash
bun install
# or
npm install
# or
yarn install
```

### 4. Run Development Server

```bash
bun dev
# or
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000/home/file-sharing](http://localhost:3000/home/file-sharing)

## Database Schema

The system uses a single table `anonymous_files` with the following structure:

```sql
CREATE TABLE anonymous_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name TEXT NOT NULL,
    storage_path TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    expiry_date TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    file_size BIGINT,
    file_type TEXT,
    download_count INTEGER DEFAULT 0
);
```

## Security Features

### Row Level Security (RLS)

- **Insert Policy**: Anyone can upload files (anonymous sharing)
- **Select/Update/Delete Policies**: Only server actions can access data (client access denied)
- **Password Verification**: All operations require password verification on the server

### File Encryption

- Files are encrypted using AES encryption before upload
- Encryption key is derived from user-provided password
- Decryption only happens server-side after password verification
- Storage paths are randomized UUIDs

### Password Security

- Passwords are hashed using bcrypt with 12 rounds
- Original passwords are never stored
- Password verification happens server-side only

## API Endpoints (Server Actions)

### Upload File

```typescript
uploadFile(formData: FormData): Promise<UploadResult>
```

### Download File

```typescript
downloadFile(fileId: string, password: string): Promise<DownloadResult>
```

### Delete File

```typescript
deleteFile(fileId: string, password: string): Promise<DeleteResult>
```

### List Files

```typescript
getFilesList(searchQuery?: string): Promise<FileListResult>
```

### Cleanup Expired Files

```typescript
cleanupExpiredFiles(): Promise<CleanupResult>
```

## Component Architecture

```
src/app/(main)/home/file-sharing/
├── page.tsx                           # Main page
└── _components/
    ├── file-upload-form.tsx           # File upload with validation
    ├── file-list.tsx                  # File listing with search
    ├── file-item.tsx                  # Individual file display
    ├── file-search.tsx                # Search input component
    └── password-prompt-modal.tsx      # Password input dialog
```

## Cleanup & Maintenance

### Automatic Cleanup

Files are automatically filtered out from the UI when expired, but physical cleanup requires running:

```typescript
// Manual cleanup via UI button or server cron job
await cleanupExpiredFiles();
```

### Supabase Edge Function (Optional)

For automatic cleanup, you can deploy an edge function:

```sql
SELECT cron.schedule('cleanup-expired-files', '0 2 * * *', 'SELECT cleanup_expired_files();');
```

## Configuration

### File Upload Limits

- **Max File Size**: 50MB (configurable in `src/lib/file-utils.ts`)
- **Allowed Extensions**: Configurable in `src/lib/file-utils.ts`

### Auto-Expiry

- **Default Expiry**: 14 days for files without explicit expiry date
- **Custom Expiry**: Users can set custom expiry dates via calendar picker

## Development

### Adding New File Types

1. Update `getFileIcon()` in `src/lib/file-utils.ts`
2. Add extensions to `isAllowedFileType()` function
3. Update file input `accept` attribute in upload form

### Customizing UI

The system uses shadcn/ui components. Customize by:

1. Modifying component props in `_components/` files
2. Updating Tailwind classes
3. Extending the theme in `tailwind.config.js`

## Production Deployment

1. **Environment Variables**: Set all required env vars in your hosting platform
2. **Supabase Setup**: Ensure RLS policies are enabled and migration is run
3. **Storage Bucket**: Verify the `anonymous-files` bucket exists and is configured
4. **Cron Jobs**: Set up automatic cleanup if needed (via Supabase cron or external service)

## Security Considerations

- All file operations require password verification
- Files are encrypted before storage
- No direct database access from client
- Expired files are automatically cleaned up
- Rate limiting should be implemented in production
- Consider adding CAPTCHA for upload form in production

## License

This is part of the Studio Admin dashboard template. Check the main project license for details.
