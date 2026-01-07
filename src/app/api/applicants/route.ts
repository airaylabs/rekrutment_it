import { NextRequest, NextResponse } from 'next/server';

// In-memory storage (akan reset saat server restart)
// Untuk production dengan data persist, gunakan database seperti:
// - Vercel KV
// - Supabase
// - PlanetScale
// - MongoDB Atlas

let applicants: any[] = [];

// GET - Fetch all applicants
export async function GET() {
  return NextResponse.json({ success: true, data: applicants });
}

// POST - Add new applicant
export async function POST(request: NextRequest) {
  try {
    const applicant = await request.json();
    
    // Add new applicant at the beginning
    applicants.unshift(applicant);
    
    // Keep only last 1000 applicants in memory
    if (applicants.length > 1000) {
      applicants = applicants.slice(0, 1000);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Save error:', error);
    return NextResponse.json({ success: false, error: 'Save failed' }, { status: 500 });
  }
}
