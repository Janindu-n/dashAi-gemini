
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export async function POST(request: Request) {
  try {
    const { ticketId } = await request.json();

    if (!ticketId) {
      return NextResponse.json({ error: 'Ticket ID is required' }, { status: 400 });
    }

    // TODO: Add server-side authentication to ensure only authorized users can delete.
    // For now, we will proceed with the deletion.

    await adminDb.collection('tickets').doc(ticketId).delete();

    return NextResponse.json({ message: 'Ticket deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    return NextResponse.json({ error: 'Failed to delete ticket' }, { status: 500 });
  }
}
