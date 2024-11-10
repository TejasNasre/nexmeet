import React from "react";

export const EventSubmissionEmail = ({
  eventDetails,
}: {
  eventDetails: any;
}) => {
  return (
    <div>
      <h1>Event Submission Confirmation</h1>
      <p>Dear {eventDetails.organizer_name},</p>
      <p>Thank you for submitting your event. Here are the details:</p>
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
        Your event is currently pending approval from the admin. This process
        may take some time. If you have any questions, please contact us.
      </p>
      <p>Best regards,</p>
      <p>The NexMeet Team</p>
    </div>
  );
};
