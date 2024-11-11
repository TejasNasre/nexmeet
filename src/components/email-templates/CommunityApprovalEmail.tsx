import React from "react";

interface CommunityApprovalEmailProps {
  communityDetails: {
    community_name: string;
  };
  isApproved: boolean;
}

const CommunityApprovalEmail: React.FC<CommunityApprovalEmailProps> = ({
  communityDetails,
  isApproved,
}) => {
  return (
    <div>
      <p>Dear Community Leader,</p>
      {isApproved ? (
        <>
          <p>
            We are pleased to inform you that your community &quot;
            {communityDetails.community_name}&quot; has been approved.
          </p>
          <p>Thank you for being a part of our platform!</p>
        </>
      ) : (
        <p>
          Unfortunately, your community &quot;{communityDetails.community_name}
          &quot; has been rejected. If you have any questions, please contact
          us.
        </p>
      )}
      <p>Best regards,</p>
      <p>The NexMeet Team</p>
    </div>
  );
};

export default CommunityApprovalEmail;
