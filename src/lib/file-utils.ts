import { FILE_SHARING_CONFIG } from '@/config/file-sharing'

/**
 * Get file type icon based on file extension or mime type
 */
export function getFileIcon(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase() || ''
  return FILE_SHARING_CONFIG.fileIcons[extension as keyof typeof FILE_SHARING_CONFIG.fileIcons] || FILE_SHARING_CONFIG.fileIcons.default
}

/**
 * Format file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${units[i]}`
}

/**
 * Check if file type is allowed
 */
export function isAllowedFileType(fileName: string): boolean {
  const extension = fileName.split('.').pop()?.toLowerCase() || ''
  return FILE_SHARING_CONFIG.allowedExtensions.includes(extension)
}

/**
 * Get max file size in bytes
 */
export const MAX_FILE_SIZE = FILE_SHARING_CONFIG.maxFileSize

/**
 * Validate file before upload
 */
export function validateFile(file: File): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!isAllowedFileType(file.name)) {
    errors.push('File type not allowed')
  }
  
  if (file.size > MAX_FILE_SIZE) {
    errors.push(`File size must be less than ${formatFileSize(MAX_FILE_SIZE)}`)
  }
  
  if (file.size === 0) {
    errors.push('File cannot be empty')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}