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

interface EventSubmissionEmailProps {
  eventDetails: {
    event_title: string;
    event_startdate: string;
    event_enddate: string;
  };
}

const EventSubmissionEmail: React.FC<EventSubmissionEmailProps> = ({
  eventDetails,
}) => {
  const greeting = getGreeting();
  const gradient = getRandomGradient();
  const textColor = getContrastColor(gradient.split(', ')[1].slice(0, -1));

  return (
    <Html>
      <Head />
      <Preview>Your event is under review! 🎉</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={{
            ...gradientSection,
            backgroundImage: gradient,
            color: textColor,
          }}>
            <Heading style={{...h1, color: textColor}}>You&apos;re almost there! 🚀</Heading>
            <Text style={{...text, color: textColor}}>
              {greeting} event maestro,
            </Text>
            <Img
              src="/public/eventsubmitted.jpg"
              width="300"
              height="300"
              alt="Event submission meme"
              style={memeStyle}
            />
            <Text style={{...text, color: textColor}}>
              Woohoo! Your event &quot;{eventDetails.event_title}&quot; has been submitted for review. It&apos;s like waiting for a soufflé to rise – exciting and a little nerve-wracking!
            </Text>
            <Text style={{...text, color: textColor}}>
              Here&apos;s a quick recap of your soon-to-be-legendary event:
            </Text>
            <Text style={{...text, color: textColor}}>
              🎭 Event: {eventDetails.event_title}
              <br />
              🗓️ From: {new Date(eventDetails.event_startdate).toLocaleString()}
              <br />
              🏁 To: {new Date(eventDetails.event_enddate).toLocaleString()}
            </Text>
            <Text style={{...text, color: textColor}}>
              Our team of event-reviewing ninjas is on the case. We&apos;ll get back to you faster than you can say &quot;Is this thing on?&quot; (Well, maybe not that fast, but pretty darn quick!)
            </Text>
            <Text style={{...text, color: textColor}}>
              In the meantime, why not practice your hosting skills? Or maybe work on your opening joke?
            </Text>
            <Text style={{...signature, color: textColor}}>
              Fingers crossed for you!
              The NexMeet Event Squad 🎭
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default EventSubmissionEmail;

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
