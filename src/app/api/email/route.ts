import { NextResponse } from "next/server";
import { Resend } from "resend";
import EventSubmissionEmail from "../../../components/email-templates/EventSubmissionEmail";
import { RegistrationEmail } from "../../../components/email-templates/RegistrationEmail";
import EventApprovalEmail from "../../../components/email-templates/EventApprovalEmail";
import CommunityApprovalEmail from "../../../components/email-templates/CommunityApprovalEmail";
import CommunityAddedEmail from "../../../components/email-templates/CommunityAddedEmail";
import FormSubmissionEmail from "../../../components/email-templates/FormSubmissionEmail";
import ApprovalEmail from "../../../components/email-templates/ApprovalEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const {
      type,
      eventDetails,
      participant,
      isApproved,
      communityDetails,
      name,
      email,
      message,
    } = await request.json();

    let emailContent;
    let subject;
    let recipient;
 //   let cc = ["nexmeetup@gmail.com"];

    if (type === "submission") {
      emailContent = EventSubmissionEmail({ eventDetails });
      subject = "Event Submission Confirmation";
      recipient = eventDetails.organizer_email;
    } else if (type === "registration") {
      emailContent = RegistrationEmail({ eventDetails, participant });
      subject = "Event Registration Confirmation";
      recipient = participant.participant_email;
    } else if (type === "event-approval") {
      emailContent = EventApprovalEmail({ eventDetails, isApproved });
      subject = `Event Registration ${isApproved ? "Approved" : "Rejected"}`;
      recipient = eventDetails.organizer_email;
    } else if (type === "participant-approval") {
      emailContent = ApprovalEmail({ eventDetails, participant, isApproved });
      subject = `Participant ${isApproved ? "Approved" : "Rejected"}`;
      recipient = participant.participant_email;
    } else if (type === "community-approval") {
      emailContent = CommunityApprovalEmail({ communityDetails, isApproved });
      subject = `Community ${isApproved ? "Approved" : "Rejected"}`;
      recipient = communityDetails.contact_info;
    } else if (type === "community-added") {
      emailContent = CommunityAddedEmail({
        communityDetails: communityDetails,
      });
      subject = "Community Added Successfully";
      recipient = communityDetails.contactInfo;
      cc.push("tejasnasre120@gmail.com");
    } else if (type === "form-submission") {
      emailContent = FormSubmissionEmail({ name, email, message });
      subject = "Form Submission Received";
      recipient = email;
      cc.push("tejasnasre120@gmail.com");
    } else {
      return NextResponse.json(
        { error: "Invalid email type" },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "NexMeet <events@nexmeet.social>",
      to: [recipient],
      // cc,
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
