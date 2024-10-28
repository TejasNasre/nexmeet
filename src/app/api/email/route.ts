import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { type, eventId, participantId } = await request.json();

    // Fetch participant and event details
    const { data: participant, error: participantError } = await supabase
      .from('event_participants')
      .select(`
        *,
        events:event_id (
          title,
          date,
          organizer_email
        )
      `)
      .eq('id', participantId)
      .single();

    if (participantError) {
      console.error('Error fetching participant:', participantError);
      return NextResponse.json(
        { error: 'Failed to fetch participant data' },
        { status: 500 }
      );
    }

    if (!participant) {
      return NextResponse.json(
        { error: 'Participant not found' },
        { status: 404 }
      );
    }

    const event = participant.events;

    // Send email based on type
    if (type === 'registration') {
      // Send email to organizer about new registration
      await resend.emails.send({
        from: 'NexMeet <events@nexmeet.social>',
        to: event.organizer_email,
        subject: `New Registration for ${event.title}`,
        html: `
          <h2>New Registration for ${event.title}</h2>
          <p>A new participant has registered for your event:</p>
          <ul>
            <li>Name: ${participant.participant_name}</li>
            <li>Email: ${participant.participant_email}</li>
            <li>Contact: ${participant.participant_contact}</li>
          </ul>
          <p>Please review and approve/reject the registration.</p>
        `,
      });

      // Send confirmation email to participant
      await resend.emails.send({
        from: 'NexMeet <events@nexmeet.social>',
        to: participant.participant_email,
        subject: `Registration Received - ${event.title}`,
        html: `
          <h2>Registration Received</h2>
          <p>Thank you for registering for ${event.title}!</p>
          <p>Your registration is pending approval from the event organizer.</p>
          <p>We'll notify you once it's approved.</p>
        `,
      });
    } else if (type === 'approval') {
      // Send approval/rejection email to participant
      await resend.emails.send({
        from: 'NexMeet <events@nexmeet.social>',
        to: participant.participant_email,
        subject: `Registration ${participant.is_approved ? 'Approved' : 'Status Update'} - ${event.title}`,
        html: `
          <h2>Registration ${participant.is_approved ? 'Approved' : 'Status Update'}</h2>
          <p>Dear ${participant.participant_name},</p>
          ${
            participant.is_approved
              ? `<p>Great news! Your registration for ${event.title} has been approved.</p>
                 <p>We're excited to have you join us!</p>`
              : `<p>Thank you for your interest in ${event.title}.</p>
                 <p>Unfortunately, we are unable to accommodate your registration at this time.</p>`
          }
          <p>Event Details:</p>
          <ul>
            <li>Event: ${event.title}</li>
            <li>Date: ${new Date(event.date).toLocaleDateString()}</li>
          </ul>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}