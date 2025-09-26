import React from 'react';
import {
  PdfIcon, DocIcon, DocxIcon, TxtIcon, DocumentIcon,
  XlsIcon, XlsxIcon, CsvIcon,
  PptIcon, PptxIcon,
  JpgIcon, JpegIcon, PngIcon, GifIcon, ImageIcon, SvgIcon, WebpIcon,
  ZipIcon, RarIcon,
  JsIcon, HtmlIcon, CssIcon, JsonIcon, XmlIcon, CodeIcon, JavaIcon,
  Mp3Icon, WavIcon, AudioIcon,
  Mp4Icon, AviIcon,
  FolderIcon
} from '@/components/icons';

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

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
  
  // File icons mapping - React components
  fileIcons: {
    // Documents
    pdf: PdfIcon,
    doc: DocIcon,
    docx: DocxIcon,
    txt: TxtIcon,
    rtf: DocumentIcon,
    
    // Spreadsheets
    xls: XlsIcon,
    xlsx: XlsxIcon,
    csv: CsvIcon,
    
    // Presentations
    ppt: PptIcon,
    pptx: PptxIcon,
    
    // Images
    jpg: JpgIcon,
    jpeg: JpegIcon,
    png: PngIcon,
    gif: GifIcon,
    bmp: ImageIcon,
    svg: SvgIcon,
    webp: WebpIcon,
    
    // Archives
    zip: ZipIcon,
    rar: RarIcon,
    '7z': ZipIcon,
    tar: ZipIcon,
    gz: ZipIcon,
    
    // Code files
    js: JsIcon,
    ts: JsIcon,
    jsx: JsIcon,
    tsx: JsIcon,
    html: HtmlIcon,
    css: CssIcon,
    json: JsonIcon,
    xml: XmlIcon,
    md: CodeIcon,
    py: CodeIcon,
    java: JavaIcon,
    cpp: CodeIcon,
    c: CodeIcon,
    php: CodeIcon,
    rb: CodeIcon,
    go: CodeIcon,
    rs: CodeIcon,
    
    // Audio
    mp3: Mp3Icon,
    wav: WavIcon,
    m4a: AudioIcon,
    flac: AudioIcon,
    
    // Video
    mp4: Mp4Icon,
    avi: AviIcon,
    mkv: Mp4Icon,
    mov: Mp4Icon,
    wmv: Mp4Icon,
    
    // Default
    default: FolderIcon
  } as Record<string, IconComponent>
} as const