import { NextResponse } from "next/server";
import { Resend } from "resend";
import { EventSubmissionEmail } from "../../../components/email-templates/EventSubmissionEmail";
import { RegistrationEmail } from "../../../components/email-templates/RegistrationEmail";
import { ApprovalEmail } from "../../../components/email-templates/ApprovalEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { type, eventDetails, participant, isApproved } =
      await request.json();

    let emailContent;
    let subject;
    let recipient;

    if (type === "submission") {
      emailContent = EventSubmissionEmail({ eventDetails });
      subject = "Event Submission Confirmation";
      recipient = eventDetails.organizer_email;
    } else if (type === "registration") {
      emailContent = RegistrationEmail({ eventDetails, participant });
      subject = "Event Registration Confirmation";
      recipient = participant.participant_email;
    } else if (type === "approval") {
      emailContent = ApprovalEmail({ eventDetails, participant, isApproved });
      subject = `Event Registration ${isApproved ? "Approved" : "Rejected"}`;
      recipient = participant.participant_email;
    } else {
      return NextResponse.json(
        { error: "Invalid email type" },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "NexMeet <events@nexmeet.social>",
      to: [recipient],
      subject,
      react: emailContent,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
