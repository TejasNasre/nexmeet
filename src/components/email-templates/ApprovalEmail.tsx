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
  const gradient = getRandomGradient();
  const textColor = getContrastColor(gradient.split(", ")[1].slice(0, -1));

  return (
    <Html>
      <Head />
      <Preview>
        {isApproved ? "Your event is approved! 🎉" : "Event update 📣"}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section
            style={{
              ...gradientSection,
              backgroundImage: gradient,
              color: textColor,
            }}
          >
            <Heading style={{ ...h1, color: textColor }}>
              {isApproved
                ? "You&apos;re on the list! 🎉"
                : "Better luck next time 😢"}
            </Heading>
            <Text style={{ ...text, color: textColor }}>
              {greeting} {participant.participant_name},
            </Text>
            {isApproved ? (
              <Img
                src="https://media1.tenor.com/m/dlGbktayOsEAAAAd/deadpool-you-are-in.gif"
                width="300"
                height="300"
                alt="Approved meme"
                style={memeStyle}
              />
            ) : (
              <Img
                src="https://media1.tenor.com/m/OUK_LciF--wAAAAd/simpsons-youre-out-of-the-game.gif"
                width="300"
                height="300"
                alt="Rejected meme"
                style={memeStyle}
              />
            )}
            {isApproved ? (
              <>
                <Text style={{ ...text, color: textColor }}>
                  <span
                    style={{ ...highlight, backgroundColor: `${textColor}33` }}
                  >
                    Awesome news!
                  </span>{" "}
                  Your spot for &quot;{eventDetails.event_title}&quot; is
                  confirmed. Time to celebrate! 💃🕺
                </Text>
                <Text style={{ ...text, color: textColor }}>
                  Here are the{" "}
                  <span
                    style={{ ...highlight, backgroundColor: `${textColor}33` }}
                  >
                    fantastic
                  </span>{" "}
                  details:
                </Text>
                <ul style={list}>
                  <li style={{ ...listItem, color: textColor }}>
                    <strong>What:</strong> {eventDetails.event_title}
                  </li>
                  <li style={{ ...listItem, color: textColor }}>
                    <strong>Where:</strong> {eventDetails.event_location}
                  </li>
                  <li style={{ ...listItem, color: textColor }}>
                    <strong>When:</strong>{" "}
                    {new Date(eventDetails.event_startdate).toLocaleString()} to{" "}
                    {new Date(eventDetails.event_enddate).toLocaleString()}
                  </li>
                </ul>
                <Text style={{ ...text, color: textColor }}>
                  Can&apos;t wait to see you there! Don&apos;t forget to bring
                  your{" "}
                  <span
                    style={{ ...highlight, backgroundColor: `${textColor}33` }}
                  >
                    A-game
                  </span>{" "}
                  (and maybe some snacks 🍿).
                </Text>
              </>
            ) : (
              <Text style={{ ...text, color: textColor }}>
                <span
                  style={{ ...highlight, backgroundColor: `${textColor}33` }}
                >
                  Oh no!
                </span>{" "}
                We hate to be the bearer of bad news, but your registration for
                &quot;{eventDetails.event_title}&quot; didn&apos;t make the cut
                this time. Don&apos;t let this get you down though – there are
                plenty of other fish in the sea (or events in the calendar)!
              </Text>
            )}
            <Text style={{ ...text, color: textColor }}>
              Stay{" "}
              <span style={{ ...highlight, backgroundColor: `${textColor}33` }}>
                cool
              </span>
              , stay{" "}
              <span style={{ ...highlight, backgroundColor: `${textColor}33` }}>
                awesome
              </span>
              , and keep on rockin&apos;!
            </Text>
            <Text style={{ ...signature, color: textColor }}>
              The NexMeet{" "}
              <span style={{ ...highlight, backgroundColor: `${textColor}33` }}>
                Team
              </span>{" "}
              😎
            </Text>
          </Section>
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

const highlight = {
  padding: "2px 4px",
  borderRadius: "4px",
  fontWeight: "bold",
};
