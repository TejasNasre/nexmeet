import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
}

export const RegisterEmail: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
}) => (
  <div>
    <h1>Welcome, {firstName}!</h1>
  </div>
);
