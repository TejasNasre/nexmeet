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
  const gradient = getRandomGradient();
  const textColor = getContrastColor(gradient.split(', ')[1].slice(0, -1));

  return (
    <Html>
      <Head />
      <Preview>
        {isApproved ? "Your community is in! 🎉" : "Community update 📣"}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={{
            ...gradientSection,
            backgroundImage: gradient,
            color: textColor,
          }}>
            <Heading style={{...h1, color: textColor}}>
              {isApproved ? "You&apos;re officially awesome! 🌟" : "Plot twist! 😮"}
            </Heading>
            <Text style={{...text, color: textColor}}>
              {greeting} fearless community leader,
            </Text>
            {isApproved ? (
              <Img
                src="/public/communityapproval.jpg"
                width="300"
                height="300"
                alt="Approved community meme"
                style={memeStyle}
              />
            ) : (
              <Img
                src="/public/communityrejected.jpg"
                width="300"
                height="300"
                alt="Rejected community meme"
                style={memeStyle}
              />
            )}
            {isApproved ? (
              <>
                <Text style={{...text, color: textColor}}>
                  Break out the confetti! 🎊 Your community &quot;<span style={{...highlight, backgroundColor: `${textColor}33`}}>{communityDetails.community_name}</span>&quot; just got the golden ticket to join our platform!
                </Text>
                <Text style={{...text, color: textColor}}>
                  You&apos;re now part of an elite group of awesome communities. No pressure, but we expect great things (and maybe some viral memes) from you!
                </Text>
              </>
            ) : (
              <>
                <Text style={{...text, color: textColor}}>
                  We hate to be the bearer of bad news, but your community &quot;<span style={{...highlight, backgroundColor: `${textColor}33`}}>{communityDetails.community_name}</span>&quot; didn&apos;t make the cut this time. 😢
                </Text>
                <Text style={{...text, color: textColor}}>
                  Don&apos;t let this get you down! Even The Beatles got rejected once. (Okay, maybe not, but you get the idea.) Why not take another shot? We believe in second chances and epic comebacks!
                </Text>
              </>
            )}
            <Text style={{...text, color: textColor}}>
              Remember, with great power comes great responsibility... to have fun and create amazing connections!
            </Text>
            <Text style={{...signature, color: textColor}}>
              Cheering you on,
              The NexMeet Fun Squad 🎭
            </Text>
          </Section>
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
