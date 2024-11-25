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

export const RegistrationEmail = ({
  eventDetails,
  participant,
}: {
  eventDetails: any;
  participant: any;
}) => {
  const greeting = getGreeting();
  const gradient = getRandomGradient();
  const textColor = getContrastColor(gradient.split(', ')[1].slice(0, -1));

  return (
    <Html>
      <Head />
      <Preview>You&apos;re one step closer to awesome! 🎟️</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={{
            ...gradientSection,
            backgroundImage: gradient,
            color: textColor,
          }}>
            <Heading style={{...h1, color: textColor}}>You&apos;re on the VIP list! (Almost) 🌟</Heading>
            <Text style={{...text, color: textColor}}>
              {greeting} {participant.participant_name}, you party animal!
            </Text>
            <Img
              src="/placeholder.svg?height=300&width=300"
              width="300"
              height="300"
              alt="Event registration meme"
              style={memeStyle}
            />
            <Text style={{...text, color: textColor}}>
              Woohoo! You&apos;ve just taken the first step towards what could be the event of the century (no pressure, event organizers 😉).
            </Text>
            <Text style={{...text, color: textColor}}>
              Here&apos;s what you&apos;re potentially getting yourself into:
            </Text>
            <ul style={list}>
              <li style={{...listItem, color: textColor}}>
                <strong>The main attraction:</strong> {eventDetails.event_title}
              </li>
              <li style={{...listItem, color: textColor}}>
                <strong>The juicy details:</strong> {eventDetails.event_description}
              </li>
              <li style={{...listItem, color: textColor}}>
                <strong>The secret location:</strong> {eventDetails.event_location}
              </li>
              <li style={{...listItem, color: textColor}}>
                <strong>When the fun begins:</strong> {new Date(eventDetails.event_startdate).toLocaleString()}
              </li>
              <li style={{...listItem, color: textColor}}>
                <strong>When the party stops (boooo):</strong> {new Date(eventDetails.event_enddate).toLocaleString()}
              </li>
            </ul>
            <Text style={{...text, color: textColor}}>
              Now, don&apos;t go planning your outfit just yet. Your registration is pending approval faster than you can say &quot;Where&apos;s the dance floor?&quot; 💃🕺
            </Text>
            <Text style={{...text, color: textColor}}>
              We&apos;ll hit you up with the final verdict quicker than you can perfect your moonwalk. In the meantime, maybe practice your small talk or polish your dad jokes?
            </Text>
            <Text style={{...signature, color: textColor}}>
              Fingers crossed for you!
              The NexMeet Party Planners 🎉
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default RegistrationEmail;

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

const list = {
  margin: "0 0 20px",
  padding: "0 0 0 20px",
};

const listItem = {
  fontSize: "16px",
  lineHeight: "1.5",
  margin: "0 0 10px",
};

const signature = {
  fontSize: "16px",
  lineHeight: "1.5",
  margin: "40px 0 0",
  textAlign: "center" as const,
};

