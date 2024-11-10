import React from "react";

export const ApprovalEmail = ({
  eventDetails,
  participant,
  isApproved,
}: {
  eventDetails: any;
  participant: any;
  isApproved: boolean;
}) => {
  return (
    <div>
      <h1>Event Registration {isApproved ? "Approved" : "Rejected"}</h1>
      <p>Dear {participant.participant_name},</p>
      {isApproved ? (
        <>
          <p>
            Great news! Your registration for the event has been approved. Here
            are the details:
          </p>
          <ul>
            <li>
              <strong>Title:</strong> {eventDetails.event_title}
            </li>
            <li>
              <strong>Description:</strong> {eventDetails.event_description}
            </li>
            <li>
              <strong>Location:</strong> {eventDetails.event_location}
            </li>
            <li>
              <strong>Start Date:</strong>{" "}
              {new Date(eventDetails.event_startdate).toLocaleString()}
            </li>
            <li>
              <strong>End Date:</strong>{" "}
              {new Date(eventDetails.event_enddate).toLocaleString()}
            </li>
          </ul>
          <p>We look forward to seeing you at the event!</p>
        </>
      ) : (
        <p>
          Unfortunately, your registration for the event has been rejected. If
          you have any questions, please contact us.
        </p>
      )}
      <p>Best regards,</p>
      <p>The NexMeet Team</p>
    </div>
  );
};
