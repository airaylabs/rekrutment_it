import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Upload ke file.io (gratis, temporary hosting)
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    
    const response = await fetch('https://file.io', {
      method: 'POST',
      body: uploadFormData
    });
    
    const data = await response.json();
    
    if (data.success) {
      return NextResponse.json({ 
        success: true, 
        url: data.link,
        filename: file.name,
        size: file.size
      });
    }
    
    // Fallback: return filename only
    return NextResponse.json({ 
      success: true, 
      url: `[CV: ${file.name}]`,
      filename: file.name,
      size: file.size
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      success: false, 
      url: '',
      error: 'Upload failed' 
    }, { status: 500 });
  }
}
