import React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Text,
} from "@react-email/components";

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
  const greeting = getGreeting();
  const memeUrl = isApproved
    ? "https://example.com/community-approved-meme.gif"
    : "https://example.com/community-rejected-meme.gif";

  return (
    <Html>
      <Head />
      <Preview>
        {isApproved ? "Your community is in! 🎉" : "Community update 📣"}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>
            {isApproved ? "You're officially awesome! 🌟" : "Plot twist! 😮"}
          </Heading>
          <Text style={text}>
            {greeting} fearless community leader,
          </Text>
          <Img
            src={memeUrl}
            width="300"
            height="300"
            alt={isApproved ? "Approved community meme" : "Rejected community meme"}
          />
          {isApproved ? (
            <>
              <Text style={text}>
                Break out the confetti! 🎊 Your community "{communityDetails.community_name}" just got the golden ticket to join our platform!
              </Text>
              <Text style={text}>
                You're now part of an elite group of awesome communities. No pressure, but we expect great things (and maybe some viral memes) from you!
              </Text>
            </>
          ) : (
            <>
              <Text style={text}>
                We hate to be the bearer of bad news, but your community "{communityDetails.community_name}" didn't make the cut this time. 😢
              </Text>
              <Text style={text}>
                Don't let this get you down! Even The Beatles got rejected once. (Okay, maybe not, but you get the idea.) Why not take another shot? We believe in second chances and epic comebacks!
              </Text>
            </>
          )}
          <Text style={text}>
            Remember, with great power comes great responsibility... to have fun and create amazing connections!
          </Text>
          <Text style={signature}>
            Cheering you on,
            The NexMeet Fun Squad 🎭
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default CommunityApprovalEmail;

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
  lineHeight: "1.25",
};

const text = {
  color: "#333",
  fontSize: "18px",
  lineHeight: "1.5",
  margin: "0 0 20px",
};

const signature = {
  color: "#898989",
  fontSize: "16px",
  lineHeight: "1.5",
  margin: "40px 0 0",
};

