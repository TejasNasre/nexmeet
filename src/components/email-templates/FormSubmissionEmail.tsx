import React from "react";

interface FormSubmissionEmailProps {
  name: string;
  email: string;
  message: string;
}

const FormSubmissionEmail: React.FC<FormSubmissionEmailProps> = ({
  name,
  email,
  message,
}) => {
  return (
    <div>
      <p>Dear {name},</p>
      <p>
        Thank you for reaching out to us. We have received your message and will
        get back to you soon.
      </p>
      <p>Message Details:</p>
      <ul>
        <li>Name: {name}</li>
        <li>Email: {email}</li>
        <li>Message: {message}</li>
      </ul>
      <p>Best regards,</p>
      <p>The NexMeet Team</p>
    </div>
  );
};

export default FormSubmissionEmail;
