-- Migration SQL for Supabase Cloud
-- This creates the anonymous_files table with RLS policies

-- Create the anonymous_files table
CREATE TABLE IF NOT EXISTS public.anonymous_files (
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_anonymous_files_expiry_date ON public.anonymous_files (expiry_date);
CREATE INDEX IF NOT EXISTS idx_anonymous_files_created_at ON public.anonymous_files (created_at);
CREATE INDEX IF NOT EXISTS idx_anonymous_files_file_name ON public.anonymous_files (file_name);

-- Enable Row Level Security (RLS)
ALTER TABLE public.anonymous_files ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public insert" ON public.anonymous_files;
DROP POLICY IF EXISTS "Allow server-only select" ON public.anonymous_files;
DROP POLICY IF EXISTS "Allow server-only update" ON public.anonymous_files;
DROP POLICY IF EXISTS "Allow server-only delete" ON public.anonymous_files;

-- Policy 1: Allow anyone to insert files (for anonymous file sharing)
CREATE POLICY "Allow public insert" ON public.anonymous_files
    FOR INSERT 
    WITH CHECK (true);

-- Policy 2: Deny direct SELECT from client (server-only access)
-- This policy explicitly denies all SELECT operations from the client
-- Only server actions with service role can access the data
CREATE POLICY "Allow server-only select" ON public.anonymous_files
    FOR SELECT 
    USING (false);

-- Policy 3: Deny direct UPDATE from client (server-only access)
CREATE POLICY "Allow server-only update" ON public.anonymous_files
    FOR UPDATE 
    USING (false);

-- Policy 4: Deny direct DELETE from client (server-only access)
CREATE POLICY "Allow server-only delete" ON public.anonymous_files
    FOR DELETE 
    USING (false);

-- Create a function to automatically delete expired files
CREATE OR REPLACE FUNCTION delete_expired_files()
RETURNS void AS $$
BEGIN
    DELETE FROM public.anonymous_files 
    WHERE (
        expiry_date IS NOT NULL AND expiry_date < NOW()
    ) OR (
        expiry_date IS NULL AND created_at < NOW() - INTERVAL '14 days'
    );
END;
$$ LANGUAGE plpgsql;

-- Create a function that can be called by edge functions or cron jobs
CREATE OR REPLACE FUNCTION cleanup_expired_files()
RETURNS json AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    WITH deleted AS (
        DELETE FROM public.anonymous_files 
        WHERE (
            expiry_date IS NOT NULL AND expiry_date < NOW()
        ) OR (
            expiry_date IS NULL AND created_at < NOW() - INTERVAL '14 days'
        )
        RETURNING *
    )
    SELECT COUNT(*) INTO deleted_count FROM deleted;
    
    RETURN json_build_object(
        'deleted_count', deleted_count,
        'timestamp', NOW()
    );
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.anonymous_files TO postgres, service_role;
GRANT SELECT, INSERT ON public.anonymous_files TO anon, authenticated;

-- Create storage bucket for files (this needs to be done in Supabase dashboard or via API)
-- Bucket name: 'anonymous-files'
-- Public: false (files are encrypted)
-- RLS policies for storage will be handled separately