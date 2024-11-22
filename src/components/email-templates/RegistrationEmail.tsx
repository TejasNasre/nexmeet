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

export const RegistrationEmail = ({
  eventDetails,
  participant,
}: {
  eventDetails: any;
  participant: any;
}) => {
  const greeting = getGreeting();
  const memeUrl = "https://example.com/event-registration-meme.gif";

  return (
    <Html>
      <Head />
      <Preview>You're one step closer to awesome! 🎟️</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>You're on the VIP list! (Almost) 🌟</Heading>
          <Text style={text}>
            {greeting} {participant.participant_name}, you party animal!
          </Text>
          <Img
            src={memeUrl}
            width="300"
            height="300"
            alt="Event registration meme"
          />
          <Text style={text}>
            Woohoo! You've just taken the first step towards what could be the event of the century (no pressure, event organizers 😉).
          </Text>
          <Text style={text}>
            Here's what you're potentially getting yourself into:
          </Text>
          <ul style={list}>
            <li style={listItem}>
              <strong>The main attraction:</strong> {eventDetails.event_title}
            </li>
            <li style={listItem}>
              <strong>The juicy details:</strong> {eventDetails.event_description}
            </li>
            <li style={listItem}>
              <strong>The secret location:</strong> {eventDetails.event_location}
            </li>
            <li style={listItem}>
              <strong>When the fun begins:</strong> {new Date(eventDetails.event_startdate).toLocaleString()}
            </li>
            <li style={listItem}>
              <strong>When the party stops (boo!):</strong> {new Date(eventDetails.event_enddate).toLocaleString()}
            </li>
          </ul>
          <Text style={text}>
            Now, don't go planning your outfit just yet! Your registration is currently pending approval from the event organizer. They're probably just making sure you're cool enough (JK, you're definitely cool enough 😎).
          </Text>
          <Text style={text}>
            We'll hit you up faster than you can say "FOMO" once you're officially on the list. In the meantime, maybe practice your dance moves?
          </Text>
          <Text style={signature}>
            Keeping our fingers crossed for you!
            The NexMeet Party Patrol 🎉
          </Text>
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

const list = {
  margin: "0 0 20px",
  padding: "0 0 0 20px",
};

const listItem = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "1.5",
  margin: "0 0 10px",
};

const signature = {
  color: "#898989",
  fontSize: "16px",
  lineHeight: "1.5",
  margin: "40px 0 0",
};

