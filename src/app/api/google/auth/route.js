import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_BASE_URL}/api/google/callback`
);

export async function GET() {
  try {
    const scopes = ['https://www.googleapis.com/auth/calendar'];
        
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
    });

    return NextResponse.redirect(url);
  } catch (error) {
    console.error('Error generating auth URL:', error);
    return NextResponse.json({ error: 'Failed to generate auth URL' }, { status: 500 });
  }
}