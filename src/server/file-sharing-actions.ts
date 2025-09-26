'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase'
import { FileEncryption } from '@/lib/encryption'
import { PasswordUtils } from '@/lib/password'
import { validateFile } from '@/lib/file-utils'
type PublicFileData = {
  id: string
  file_name: string
  created_at: string
  file_size: number | null
  file_type: string | null
  download_count: number
  expiry_date: string | null
}

export interface UploadResult {
  success: boolean
  data?: {
    id: string
    fileName: string
    downloadUrl: string
  }
  error?: string
}

export interface DownloadResult {
  success: boolean
  data?: {
    fileBuffer: ArrayBuffer
    fileName: string
    contentType: string
  }
  error?: string
}

export interface DeleteResult {
  success: boolean
  error?: string
}

/**
 * Upload and encrypt file
 */
export async function uploadFile(formData: FormData): Promise<UploadResult> {
  try {
    const file = formData.get('file') as File
    const fileName = formData.get('fileName') as string
    const password = formData.get('password') as string
    const expiryDate = formData.get('expiryDate') as string

    // Validate inputs
    if (!file || !fileName || !password) {
      return { success: false, error: 'Missing required fields' }
    }

    // Validate password
    const passwordValidation = PasswordUtils.validatePassword(password)
    if (!passwordValidation.isValid) {
      return { 
        success: false, 
        error: passwordValidation.errors.join(', ')
      }
    }

    // Validate file
    const fileValidation = validateFile(file)
    if (!fileValidation.isValid) {
      return { 
        success: false, 
        error: fileValidation.errors.join(', ')
      }
    }

    // Generate unique storage path
    const fileId = crypto.randomUUID()
    const extension = file.name.split('.').pop() || ''
    const storagePath = `${fileId}.${extension}`

    // Read file as ArrayBuffer
    const fileBuffer = await file.arrayBuffer()

    // Encrypt file
    const encryptedBuffer = FileEncryption.encryptFile(fileBuffer, password)

    // Upload encrypted file to Supabase Storage with retry logic
    let uploadError: Error | null = null
    let uploadAttempts = 0
    const maxRetries = 3
    
    while (uploadAttempts < maxRetries) {
      try {
        const { error } = await supabaseAdmin.storage
          .from('anonymous-files')
          .upload(storagePath, encryptedBuffer, {
            contentType: 'application/octet-stream', // Always binary since encrypted
            upsert: false
          })

        if (!error) {
          uploadError = null
          break // Success, exit retry loop
        }
        
        uploadError = error
        uploadAttempts++
        
        if (uploadAttempts < maxRetries) {
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, uploadAttempts) * 1000))
        }
      } catch (err) {
        uploadError = err as Error
        uploadAttempts++
        
        if (uploadAttempts < maxRetries) {
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, uploadAttempts) * 1000))
        }
      }
    }

    if (uploadError) {
      console.error('Storage upload error after retries:', uploadError)
      
      // Provide more specific error messages
      let errorMessage = 'Failed to upload file'
      if (uploadError?.message?.includes('timeout') || uploadError?.message?.includes('fetch failed')) {
        errorMessage = 'Upload timeout - please check your connection and try again'
      } else if (uploadError?.message?.includes('413') || uploadError?.message?.includes('size')) {
        errorMessage = 'File too large for upload'
      }
      
      return { success: false, error: errorMessage }
    }

    // Hash password
    const passwordHash = await PasswordUtils.hashPassword(password)

    // Parse expiry date
    const parsedExpiryDate = expiryDate ? new Date(expiryDate).toISOString() : null

    // Save metadata to database
    const { data: dbData, error: dbError } = await supabaseAdmin
      .from('anonymous_files')
      .insert({
        file_name: fileName,
        storage_path: storagePath,
        password_hash: passwordHash,
        expiry_date: parsedExpiryDate,
        file_size: file.size,
        file_type: file.type || 'application/octet-stream'
      })
      .select('id, file_name')
      .single()

    if (dbError) {
      // Clean up uploaded file if database insert fails
      await supabaseAdmin.storage
        .from('anonymous-files')
        .remove([storagePath])
      
      console.error('Database insert error:', dbError)
      return { success: false, error: 'Failed to save file metadata' }
    }

    revalidatePath('/home/file-sharing')

    return {
      success: true,
      data: {
        id: dbData.id,
        fileName: dbData.file_name,
        downloadUrl: `/home/file-sharing?fileId=${dbData.id}`
      }
    }
  } catch (error) {
    console.error('Upload error:', error)
    return { success: false, error: 'Internal server error' }
  }
}

/**
 * Download and decrypt file
 */
export async function downloadFile(fileId: string, password: string): Promise<DownloadResult> {
  try {
    if (!fileId || !password) {
      return { success: false, error: 'Missing file ID or password' }
    }

    // Get file metadata from database
    const { data: fileData, error: dbError } = await supabaseAdmin
      .from('anonymous_files')
      .select('*')
      .eq('id', fileId)
      .single()

    if (dbError || !fileData) {
      return { success: false, error: 'File not found' }
    }

    // Check if file has expired
    const now = new Date()
    if (fileData.expiry_date && new Date(fileData.expiry_date) < now) {
      // Delete expired file
      await deleteExpiredFile(fileData.id, fileData.storage_path)
      return { success: false, error: 'File has expired' }
    }

    // Check if file has auto-expired (14 days)
    if (!fileData.expiry_date) {
      const createdAt = new Date(fileData.created_at)
      const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
      
      if (createdAt < fourteenDaysAgo) {
        await deleteExpiredFile(fileData.id, fileData.storage_path)
        return { success: false, error: 'File has expired (14 days)' }
      }
    }

    // Verify password
    const isPasswordValid = await PasswordUtils.verifyPassword(password, fileData.password_hash)
    if (!isPasswordValid) {
      return { success: false, error: 'Invalid password' }
    }

    // Download encrypted file from storage
    const { data: storageData, error: storageError } = await supabaseAdmin.storage
      .from('anonymous-files')
      .download(fileData.storage_path)

    if (storageError || !storageData) {
      return { success: false, error: 'Failed to download file' }
    }

    // Convert blob to ArrayBuffer
    const encryptedBuffer = await storageData.arrayBuffer()

    // Decrypt file
    try {
      const decryptedBuffer = FileEncryption.decryptFile(encryptedBuffer, password)

      // Update download count
      await supabaseAdmin
        .from('anonymous_files')
        .update({ download_count: (fileData.download_count || 0) + 1 })
        .eq('id', fileId)

      return {
        success: true,
        data: {
          fileBuffer: decryptedBuffer,
          fileName: fileData.file_name,
          contentType: fileData.file_type || 'application/octet-stream'
        }
      }
    } catch {
      return { success: false, error: 'Failed to decrypt file. Invalid password.' }
    }
  } catch (error) {
    console.error('Download error:', error)
    return { success: false, error: 'Internal server error' }
  }
}

/**
 * Delete file with password verification
 */
export async function deleteFile(fileId: string, password: string): Promise<DeleteResult> {
  try {
    if (!fileId || !password) {
      return { success: false, error: 'Missing file ID or password' }
    }

    // Get file metadata
    const { data: fileData, error: dbError } = await supabaseAdmin
      .from('anonymous_files')
      .select('*')
      .eq('id', fileId)
      .single()

    if (dbError || !fileData) {
      return { success: false, error: 'File not found' }
    }

    // Verify password
    const isPasswordValid = await PasswordUtils.verifyPassword(password, fileData.password_hash)
    if (!isPasswordValid) {
      return { success: false, error: 'Invalid password' }
    }

    // Delete from storage
    const { error: storageError } = await supabaseAdmin.storage
      .from('anonymous-files')
      .remove([fileData.storage_path])

    if (storageError) {
      console.error('Storage delete error:', storageError)
    }

    // Delete from database
    const { error: deleteError } = await supabaseAdmin
      .from('anonymous_files')
      .delete()
      .eq('id', fileId)

    if (deleteError) {
      console.error('Database delete error:', deleteError)
      return { success: false, error: 'Failed to delete file' }
    }

    revalidatePath('/home/file-sharing')

    return { success: true }
  } catch (error) {
    console.error('Delete error:', error)
    return { success: false, error: 'Internal server error' }
  }
}

/**
 * Get list of files (public metadata only)
 */
export async function getFilesList(searchQuery?: string) {
  try {
    let query = supabaseAdmin
      .from('anonymous_files')
      .select('id, file_name, created_at, file_size, file_type, download_count, expiry_date')
      .order('created_at', { ascending: false })

    // Add search filter if provided
    if (searchQuery && searchQuery.trim()) {
      query = query.ilike('file_name', `%${searchQuery.trim()}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Database query error:', error)
      return { success: false, error: 'Failed to fetch files' }
    }

    // Filter out expired files
    const now = new Date()
    const validFiles = (data || []).filter((file: PublicFileData) => {
      // Check explicit expiry date
      if (file.expiry_date && new Date(file.expiry_date) < now) {
        return false
      }

      // Check auto-expiry (14 days)
      if (!file.expiry_date) {
        const createdAt = new Date(file.created_at)
        const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
        if (createdAt < fourteenDaysAgo) {
          return false
        }
      }

      return true
    })

    return { success: true, data: validFiles }
  } catch (error) {
    console.error('Get files error:', error)
    return { success: false, error: 'Internal server error' }
  }
}

/**
 * Clean up expired files
 */
export async function cleanupExpiredFiles() {
  try {
    const { data, error } = await supabaseAdmin.rpc('cleanup_expired_files')
    
    if (error) {
      console.error('Cleanup error:', error)
      return { success: false, error: 'Failed to cleanup expired files' }
    }

    revalidatePath('/home/file-sharing')

    return { 
      success: true, 
      data: { deletedCount: data?.deleted_count || 0 } 
    }
  } catch (error) {
    console.error('Cleanup error:', error)
    return { success: false, error: 'Internal server error' }
  }
}

/**
 * Helper function to delete expired file
 */
async function deleteExpiredFile(fileId: string, storagePath: string) {
  try {
    // Delete from storage
    await supabaseAdmin.storage
      .from('anonymous-files')
      .remove([storagePath])

    // Delete from database
    await supabaseAdmin
      .from('anonymous_files')
      .delete()
      .eq('id', fileId)
  } catch (error) {
    console.error('Error deleting expired file:', error)
  }
}