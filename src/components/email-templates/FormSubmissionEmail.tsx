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

interface FormSubmissionEmailProps {
  name: string;
  email: string;
  message: string;
}

const FormSubmissionEmail: React.FC<FormSubmissionEmailProps> = ({
  name,
  email,
  message,
}) => {
  const greeting = getGreeting();
  const gradient = getRandomGradient();
  const textColor = getContrastColor(gradient.split(', ')[1].slice(0, -1));

  return (
    <Html>
      <Head />
      <Preview>We&apos;ve got your message! 📬</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={{
            ...gradientSection,
            backgroundImage: gradient,
            color: textColor,
          }}>
            <Heading style={{...h1, color: textColor}}>Your message is in our VIP inbox! 🌟</Heading>
            <Text style={{...text, color: textColor}}>
              {greeting} {name}, you awesome human!
            </Text>
            <Img
              src="/public/formsubmission.jpg"
              width="300"
              height="300"
              alt="Message received meme"
              style={memeStyle}
            />
            <Text style={{...text, color: textColor}}>
              Guess what? Your message just parachuted into our inbox, and boy, are we excited! 🪂
            </Text>
            <Text style={{...text, color: textColor}}>
              Here&apos;s a quick recap of what you sent our way:
            </Text>
            <ul style={list}>
              <li style={{...listItem, color: textColor}}>
                <strong>From:</strong> {name} (that&apos;s you, superstar!)
              </li>
              <li style={{...listItem, color: textColor}}>
                <strong>Email:</strong> {email}
              </li>
              <li style={{...listItem, color: textColor}}>
                <strong>Your awesome message:</strong> {message}
              </li>
            </ul>
            <Text style={{...text, color: textColor}}>
              We&apos;re on it like a car bonnet! Our team of message-reading ninjas is preparing to dive into your words of wisdom. We&apos;ll get back to you faster than you can say &quot;Why did the scarecrow win an award? He was outstanding in his field!&quot; 🌾
            </Text>
            <Text style={{...text, color: textColor}}>
              In the meantime, feel free to practice your patience... or your dad jokes. Your choice!
            </Text>
            <Text style={{...signature, color: textColor}}>
              Eagerly awaiting our chat,
              The NexMeet Message Maestros 📮
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default FormSubmissionEmail;

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

