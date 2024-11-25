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

interface EventApprovalEmailProps {
  eventDetails: {
    event_title: string;
    event_startdate: string;
    event_enddate: string;
  };
  isApproved: boolean;
}

const EventApprovalEmail: React.FC<EventApprovalEmailProps> = ({
  eventDetails,
  isApproved,
}) => {
  const greeting = getGreeting();
  const gradient = getRandomGradient();
  const textColor = getContrastColor(gradient.split(", ")[1].slice(0, -1));

  return (
    <Html>
      <Head />
      <Preview>
        {isApproved ? "Your event is a go! 🚀" : "Event update 📣"}
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
              {isApproved ? "It&apos;s party time! 🎉" : "Rain check? ☔"}
            </Heading>
            <Text style={{ ...text, color: textColor }}>
              {greeting} event enthusiast,
            </Text>
            {isApproved ? (
              <Img
                src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExdzRiYm5sYnVlN2NqYnRvNTdnaTVram8xcHp4dmQ4bDFrazM4emcyNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/mDMOkkXWQZvEJMnvTW/giphy.webp"
                width="300"
                height="300"
                alt="Approved event meme"
                style={memeStyle}
              />
            ) : (
              <Img
                src="https://media1.tenor.com/m/8UIJRYM1hscAAAAC/rejected-mirwen.gif"
                width="300"
                height="300"
                alt="Rejected event meme"
                style={memeStyle}
              />
            )}
            {isApproved ? (
              <>
                <Text style={{ ...text, color: textColor }}>
                  Guess what? Your event &quot;
                  <span
                    style={{ ...highlight, backgroundColor: `${textColor}33` }}
                  >
                    {eventDetails.event_title}
                  </span>
                  &quot; just got the green light! 🟢 Time to dust off your
                  party pants!
                </Text>
                <Text style={{ ...text, color: textColor }}>
                  Here&apos;s when the magic happens:
                </Text>
                <Text style={{ ...text, color: textColor }}>
                  🗓️ From:{" "}
                  {new Date(eventDetails.event_startdate).toLocaleString()}
                  <br />
                  🏁 To: {new Date(eventDetails.event_enddate).toLocaleString()}
                </Text>
                <Text style={{ ...text, color: textColor }}>
                  Get ready to host the event of the century! (No pressure or
                  anything 😉)
                </Text>
              </>
            ) : (
              <>
                <Text style={{ ...text, color: textColor }}>
                  We hate to rain on your parade, but your event &quot;
                  <span
                    style={{ ...highlight, backgroundColor: `${textColor}33` }}
                  >
                    {eventDetails.event_title}
                  </span>
                  &quot; didn&apos;t get the thumbs up this time. 👎
                </Text>
                <Text style={{ ...text, color: textColor }}>
                  Don&apos;t let this dampen your spirits! Even the best party
                  planners face setbacks. Why not take this as a chance to make
                  your event even more awesome and try again?
                </Text>
              </>
            )}
            <Text style={{ ...text, color: textColor }}>
              Remember, the best events are the ones where everyone has a blast
              (and maybe learns something too)!
            </Text>
            <Text style={{ ...signature, color: textColor }}>
              Keeping the party going, The NexMeet Event Squad 🎭
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default EventApprovalEmail;

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
