import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { adminDb } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

export async function POST(req: Request) {
  try {
    const { issue } = await req.json();

    // Use Gemini to classify the issue to one of the roles
    const prompt = `Classify the following customer service issue into one of these categories: "Developer", "Customer Service", or "Finance". If none apply, use "General". Only return the category name.
    Issue: ${issue}`;

    const result = await model.generateContent(prompt);
    const category = result.response.text().trim();

    // Create a new ticket in Firestore
    await adminDb.collection('tickets').add({
      issue,
      category,
      assignedToRole: category, 
      status: 'new',
      assignedTo: null,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, message: 'Ticket created successfully.' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error creating ticket:', error);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}