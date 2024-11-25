import React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { getRandomGradient, getContrastColor } from "../../utils/colorUtils";

interface CommunityAddedEmailProps {
  communityDetails: {
    community_name: string;
  };
}

const CommunityAddedEmail: React.FC<CommunityAddedEmailProps> = ({
  communityDetails,
}) => {
  const greeting = getGreeting();
  const gradient = getRandomGradient();
  const textColor = getContrastColor(gradient.split(', ')[1].slice(0, -1));

  return (
    <Html>
      <Head />
      <Preview>Welcome to the community! 🎉</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={{
            ...gradientSection,
            backgroundImage: gradient,
            color: textColor,
          }}>
            <Heading style={{...h1, color: textColor}}>You&apos;re in! 🚀</Heading>
            <Text style={{...text, color: textColor}}>
              {greeting} awesome community creator,
            </Text>
            <Img
              src="/public/communityadded.jpg"
              width="300"
              height="300"
              alt="Welcome to the community meme"
              style={memeStyle}
            />
            <Text style={{...text, color: textColor}}>
              Congratulations! Your community &quot;{communityDetails.community_name}&quot; has been added to our platform. It&apos;s time to pop the virtual champagne! 🍾
            </Text>
            <Text style={{...text, color: textColor}}>
              You&apos;re now part of an elite group of community builders. No pressure, but we&apos;re expecting great things (and maybe some viral memes) from you!
            </Text>
            <Text style={{...text, color: textColor}}>
              Remember, with great power comes great responsibility... to have fun and create amazing connections!
            </Text>
            <Text style={{...signature, color: textColor}}>
              Welcome aboard,
              The NexMeet Community Squad 🎭
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default CommunityAddedEmail;

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const gradientSection = {
  margin: "0 auto",
  padding: "40px",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  maxWidth: "600px",
};

const h1 = {
  fontSize: "28px",
  fontWeight: "bold",
  margin: "0 0 20px",
  padding: "0",
  lineHeight: "1.25",
  textAlign: "center" as const,
};

const text = {
  fontSize: "18px",
  lineHeight: "1.5",
  margin: "0 0 20px",
};

const memeStyle = {
  display: "block",
  margin: "20px auto",
  maxWidth: "100%",
  height: "auto",
  borderRadius: "8px",
};

const signature = {
  fontSize: "16px",
  lineHeight: "1.5",
  margin: "40px 0 0",
  textAlign: "center" as const,
};

const highlight = {
  padding: "2px 4px",
  borderRadius: "4px",
  fontWeight: "bold",
};
