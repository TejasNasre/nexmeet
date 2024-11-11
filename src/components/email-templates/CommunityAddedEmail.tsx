import React from "react";

interface CommunityAddedEmailProps {
  communityName: string;
}

const CommunityAddedEmail: React.FC<CommunityAddedEmailProps> = ({
  communityName,
}) => {
  return (
    <div>
      <p>Dear Community Member,</p>
      <p>
        We are excited to inform you that your community{" "}
        <h1>{communityName}</h1> has been successfully added to our platform!
      </p>
      <p>
        Thank you for contributing to our community. We look forward to seeing
        the positive impact your community will have.
      </p>
      <p>Best regards,</p>
      <p>The NexMeet Team</p>
    </div>
  );
};

export default CommunityAddedEmail;
