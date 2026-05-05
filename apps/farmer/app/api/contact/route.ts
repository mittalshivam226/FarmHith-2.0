import { NextResponse } from 'next/server';
import { adminDb } from '@farmhith/firebase/admin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, contactInfo, message } = body;

    if (!name || !contactInfo || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const docRef = await adminDb.collection('contact_inquiries').add({
      name,
      contactInfo,
      message,
      source: 'FARMER_PORTAL',
      createdAt: new Date().toISOString(),
      status: 'NEW'
    });

    return NextResponse.json({ success: true, id: docRef.id }, { status: 200 });
  } catch (error: any) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
