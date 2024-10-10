import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_BASE_URL}/api/google/callback`
);

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  try {
    const { tokens } = await oauth2Client.getToken(code);
    const html = `
      <html>
        <body>
          <script>
            localStorage.setItem('googleAccessToken', '${tokens.access_token}');
            const redirectEventDetails = localStorage.getItem('eventDetails');
            if (redirectEventDetails) {
              const parsedDetails = JSON.parse(redirectEventDetails);
              localStorage.setItem('redirect_eventDetails', JSON.stringify(parsedDetails));
              localStorage.removeItem('eventDetails');
              window.location.href = '/register-event/' + parsedDetails.id;
            } else {
              window.location.href = '/dashboard';
            }
          </script>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    console.error('Error retrieving tokens:', error);
    return NextResponse.json({ error: 'Error retrieving tokens' }, { status: 500 });
  }
}

