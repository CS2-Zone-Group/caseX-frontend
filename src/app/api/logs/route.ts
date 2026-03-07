import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  let logs: unknown;
  try {
    ({ logs } = await request.json());
    
    // Backend'ga logs yuborish
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    
    const response = await fetch(`${backendUrl}/api/logs/frontend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ logs })
    });

    if (!response.ok) {
      throw new Error(`Backend logging failed: ${response.statusText}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Frontend logging API error:', error);
    
    // Fallback: log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Frontend logs:', JSON.stringify(logs, null, 2));
    }
    
    return NextResponse.json(
      { error: 'Failed to process logs' },
      { status: 500 }
    );
  }
}