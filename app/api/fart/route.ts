import { writeFile, readFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

const FART_FILE_PATH = path.join(process.cwd(), 'public', 'current-fart.mp3');

export async function GET() {
  try {
    const fileBuffer = await readFile(FART_FILE_PATH);
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'audio/mp3',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load fart sound' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save the file
    await writeFile(FART_FILE_PATH, buffer);

    return NextResponse.json({ message: 'Fart sound updated successfully' });
  } catch (error) {
    console.error('Error handling fart upload:', error);
    return NextResponse.json({ error: 'Failed to upload fart sound' }, { status: 500 });
  }
} 