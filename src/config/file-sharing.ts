export const FILE_SHARING_CONFIG = {
  // File upload limits
  maxFileSize: 10 * 1024 * 1024, // 10MB in bytes (reduced for better performance)
  
  // Auto-expiry settings
  defaultExpiryDays: 14,
  
  // Password requirements
  minPasswordLength: 6,
  maxPasswordLength: 128,
  
  // Allowed file extensions
  allowedExtensions: [
    // Documents
    'pdf', 'doc', 'docx', 'txt', 'rtf',
    // Spreadsheets
    'xls', 'xlsx', 'csv',
    // Presentations
    'ppt', 'pptx',
    // Images
    'jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp',
    // Archives
    'zip', 'rar', '7z', 'tar', 'gz',
    // Code files
    'js', 'ts', 'jsx', 'tsx', 'html', 'css', 'json', 'xml', 'md',
    'py', 'java', 'cpp', 'c', 'php', 'rb', 'go', 'rs'
  ] as string[],
  
  // Storage settings
  supabaseBucket: 'anonymous-files',
  
  // UI settings
  searchDebounceMs: 300,
  itemsPerPage: 20,
  
  // Security settings
  bcryptRounds: 12,
  
  // File icons mapping
  fileIcons: {
    // Documents
    pdf: '📄',
    doc: '📝',
    docx: '📝',
    txt: '📄',
    rtf: '📄',
    
    // Spreadsheets
    xls: '📊',
    xlsx: '📊',
    csv: '📊',
    
    // Presentations
    ppt: '📊',
    pptx: '📊',
    
    // Images
    jpg: '🖼️',
    jpeg: '🖼️',
    png: '🖼️',
    gif: '🖼️',
    bmp: '🖼️',
    svg: '🖼️',
    webp: '🖼️',
    
    // Archives
    zip: '📦',
    rar: '📦',
    '7z': '📦',
    tar: '📦',
    gz: '📦',
    
    // Code files
    js: '💻',
    ts: '💻',
    jsx: '💻',
    tsx: '💻',
    html: '💻',
    css: '💻',
    json: '💻',
    xml: '💻',
    md: '💻',
    py: '💻',
    java: '💻',
    cpp: '💻',
    c: '💻',
    php: '💻',
    rb: '💻',
    go: '💻',
    rs: '💻',
    
    // Audio
    mp3: '🎵',
    wav: '🎵',
    m4a: '🎵',
    flac: '🎵',
    
    // Video
    mp4: '🎬',
    avi: '🎬',
    mkv: '🎬',
    mov: '🎬',
    wmv: '🎬',
    
    // Default
    default: '📁'
  }
} as const