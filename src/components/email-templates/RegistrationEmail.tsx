import React from "react";

export const RegistrationEmail = ({
  eventDetails,
  participant,
}: {
  eventDetails: any;
  participant: any;
}) => {
  return (
    <div>
      <h1>Event Registration Confirmation</h1>
      <p>Dear {participant.participant_name},</p>
      <p>Thank you for registering for the event. Here are the details:</p>
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
      <p>
        Your registration is currently pending approval from the organizer. We
        will notify you once it is approved.
      </p>
      <p>Best regards,</p>
      <p>The NexMeet Team</p>
    </div>
  );
};
