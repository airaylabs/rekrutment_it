import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;
    
    if (!N8N_WEBHOOK_URL) {
      console.warn('N8N_WEBHOOK_URL not configured');
      return NextResponse.json({ success: false, message: 'Webhook not configured' });
    }

    // Send to n8n webhook
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      return NextResponse.json({ success: true });
    } else {
      console.error('Webhook response not ok:', response.status);
      return NextResponse.json({ success: false, message: 'Webhook failed' });
    }
  } catch (error) {
    console.error('Notify error:', error);
    return NextResponse.json({ success: false, error: 'Internal error' });
  }
}
