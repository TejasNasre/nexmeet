import React from "react";

interface EventApprovalEmailProps {
  eventDetails: {
    event_title: string;
    event_startdate: string;
    event_enddate: string;
  };
  isApproved: boolean;
}

const EventApprovalEmail: React.FC<EventApprovalEmailProps> = ({
  eventDetails,
  isApproved,
}) => {
  return (
    <div>
      <p>Dear Participant,</p>
      {isApproved ? (
        <>
          <p>
            We are pleased to inform you that your registration for the event
            &quot;
            {eventDetails.event_title}&quot; has been approved.
          </p>
          <p>Event Details:</p>
          <ul>
            <li>
              Start Date:{" "}
              {new Date(eventDetails.event_startdate).toLocaleString()}
            </li>
            <li>
              End Date: {new Date(eventDetails.event_enddate).toLocaleString()}
            </li>
          </ul>
          <p>We look forward to seeing you at the event!</p>
        </>
      ) : (
        <p>
          Unfortunately, your registration for the event &quot;
          {eventDetails.event_title}&quot; has been rejected. If you have any
          questions, please contact us.
        </p>
      )}
      <p>Best regards,</p>
      <p>The NexMeet Team</p>
    </div>
  );
};

export default EventApprovalEmail;
