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

interface CommunityAddedEmailProps {
  communityName: string;
}

const CommunityAddedEmail: React.FC<CommunityAddedEmailProps> = ({
  communityName,
}) => {
  const greeting = getGreeting();
  const memeUrl = "https://example.com/community-added-meme.gif";

  return (
    <Html>
      <Head />
      <Preview>Welcome to the club, {communityName}! 🎉</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>You're officially part of the cool kids now!</Heading>
          <Text style={text}>
            {greeting} awesome community leader,
          </Text>
          <Img
            src={memeUrl}
            width="300"
            height="300"
            alt="Welcome to the community meme"
          />
          <Text style={text}>
            Drum roll, please... 🥁 Your community "{communityName}" is now officially part of our big, happy NexMeet family!
          </Text>
          <Text style={text}>
            We're so excited to have you on board that we're doing a little happy dance right now. Can you feel the vibes? 💃🕺
          </Text>
          <Text style={text}>
            Get ready to connect, engage, and maybe even break the internet (in a good way, of course). The world isn't ready for how awesome your community is going to be!
          </Text>
          <Text style={text}>
            Now go forth and conquer! And remember, with great power comes great responsibility... to have fun and make awesome connections!
          </Text>
          <Text style={signature}>
            High fives from the NexMeet Crew 🖐️
          </Text>
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

