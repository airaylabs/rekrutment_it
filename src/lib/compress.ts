// Compress image files to under 500KB
export async function compressImage(file: File): Promise<File> {
  // Only compress images
  if (!file.type.startsWith('image/')) {
    return file;
  }

  // If already under 500KB, no need to compress
  if (file.size <= 500 * 1024) {
    return file;
  }

  try {
    // Dynamic import for browser-image-compression
    const imageCompression = (await import('browser-image-compression')).default;
    
    const options = {
      maxSizeMB: 0.5, // 500KB
      maxWidthOrHeight: 1920, // Max dimension
      useWebWorker: true,
      fileType: file.type as 'image/jpeg' | 'image/png' | 'image/webp',
    };

    const compressedFile = await imageCompression(file, options);
    
    // Return as File with original name
    return new File([compressedFile], file.name, {
      type: compressedFile.type,
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error('Compression error:', error);
    return file; // Return original if compression fails
  }
}

// Check if file is an image
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

// Check if file is PDF
export function isPdfFile(file: File): boolean {
  return file.type === 'application/pdf';
}

// Format file size for display
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
