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

export const EventSubmissionEmail = ({
  eventDetails,
}: {
  eventDetails: any;
}) => {
  const greeting = getGreeting();
  const memeUrl = "https://example.com/event-submitted-meme.gif";

  return (
    <Html>
      <Head />
      <Preview>Your event is in the spotlight! 🎭</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Your event is ready for its close-up! 🎬</Heading>
          <Text style={text}>
            {greeting} {eventDetails.organizer_name}, you superstar event planner!
          </Text>
          <Img
            src={memeUrl}
            width="300"
            height="300"
            alt="Event submitted meme"
          />
          <Text style={text}>
            We've got your event "{eventDetails.event_title}" in our hot little hands, and boy, does it look exciting! 🎉
          </Text>
          <Text style={text}>
            Here's a quick recap of your soon-to-be-legendary event:
          </Text>
          <ul style={list}>
            <li style={listItem}>
              <strong>What's going down:</strong> {eventDetails.event_title}
            </li>
            <li style={listItem}>
              <strong>The lowdown:</strong> {eventDetails.event_description}
            </li>
            <li style={listItem}>
              <strong>Where it's at:</strong> {eventDetails.event_location}
            </li>
            <li style={listItem}>
              <strong>Kicking off:</strong> {new Date(eventDetails.event_startdate).toLocaleString()}
            </li>
            <li style={listItem}>
              <strong>Wrapping up:</strong> {new Date(eventDetails.event_enddate).toLocaleString()}
            </li>
          </ul>
          <Text style={text}>
            Now, don't freak out, but your event is currently in the green room (a.k.a. pending approval). Our team of event enthusiasts is reviewing it faster than you can say "Is this thing on?" 🎤
          </Text>
          <Text style={text}>
            Got questions? We've got answers! Just hit us up, and we'll chat faster than you can plan an impromptu flash mob.
          </Text>
          <Text style={signature}>
            Break a leg!
            The NexMeet Showtime Crew 🎭
          </Text>
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

