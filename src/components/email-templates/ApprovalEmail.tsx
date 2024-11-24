import React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Text,
} from "@react-email/components";

export const ApprovalEmail = ({
  eventDetails,
  participant,
  isApproved,
}: {
  eventDetails: any;
  participant: any;
  isApproved: boolean;
}) => {
  const greeting = getGreeting();
  const memeUrl = isApproved
    ? "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZW9kcXFta3d2dWM5dWhpZzVrcGJsdmw1MGZpN2MwdjF0dDVzbDJkZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/YKdm91XONLTaw/giphy.webp"
    : "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExZHIyNGM1N3M5MzkxMHBwM21mcHhrN2ZldHk0OGFkdHVyamVzdXprMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l2SpUoAPo0CBOkyxq/giphy.webp";

  return (
    <Html>
      <Head />
      <Preview>
        {isApproved ? "You're in! 🎉" : "Aw, snap! 😢"} Event Registration
        Update
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>
            {isApproved ? "You're on the list! 🎉" : "Better luck next time 😢"}
          </Heading>
          <Text style={text}>
            {greeting} {participant.participant_name},
          </Text>
          <Img
            src={memeUrl}
            width="300"
            height="300"
            alt={isApproved ? "Approved meme" : "Rejected meme"}
          />
          {isApproved ? (
            <>
              <Text style={text}>
                Guess what? You made it! Your spot for "
                {eventDetails.event_title}" is locked in. Time to happy dance!
                💃🕺
              </Text>
              <Text style={text}>Here's the lowdown:</Text>
              <ul>
                <li style={listItem}>
                  <strong>What:</strong> {eventDetails.event_title}
                </li>
                <li style={listItem}>
                  <strong>Where:</strong> {eventDetails.event_location}
                </li>
                <li style={listItem}>
                  <strong>When:</strong>{" "}
                  {new Date(eventDetails.event_startdate).toLocaleString()} to{" "}
                  {new Date(eventDetails.event_enddate).toLocaleString()}
                </li>
              </ul>
              <Text style={text}>
                Can't wait to see your awesome self there! Don't forget to bring
                your A-game (and maybe some snacks 🍿).
              </Text>
            </>
          ) : (
            <Text style={text}>
              We hate to be the bearer of bad news, but your registration for "
              {eventDetails.event_title}" didn't make the cut this time. Don't
              let it get you down though – there are plenty of other fish in the
              sea (or events in the calendar)!
            </Text>
          )}
          <Text style={text}>
            Stay cool, stay awesome, and keep on rockin'!
          </Text>
          <Text style={signature}>The NexMeet Squad 😎</Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ApprovalEmail;

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
