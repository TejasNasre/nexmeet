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
  const memeUrl = "https://example.com/form-submission-meme.gif";

  return (
    <Html>
      <Head />
      <Preview>We've got your message! 📬</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Your message is in our VIP inbox! 🌟</Heading>
          <Text style={text}>
            {greeting} {name}, you awesome human!
          </Text>
          <Img
            src={memeUrl}
            width="300"
            height="300"
            alt="Form submission meme"
          />
          <Text style={text}>
            Guess what? Your message just parachuted into our inbox, and boy, are we excited! 🪂
          </Text>
          <Text style={text}>
            Here's a quick recap of what you sent our way:
          </Text>
          <ul style={list}>
            <li style={listItem}>
              <strong>From:</strong> {name} (that's you, superstar!)
            </li>
            <li style={listItem}>
              <strong>Email:</strong> {email}
            </li>
            <li style={listItem}>
              <strong>Your awesome message:</strong> {message}
            </li>
          </ul>
          <Text style={text}>
            We're on it like a car bonnet! Our team of message-reading ninjas is preparing to dive into your words of wisdom. We'll get back to you faster than you can say "Why did the scarecrow win an award? He was outstanding in his field!" 🌾
          </Text>
          <Text style={text}>
            In the meantime, feel free to practice your patience... or your dad jokes. Your choice!
          </Text>
          <Text style={signature}>
            Eagerly awaiting our chat,
            The NexMeet Message Maestros 📮
          </Text>
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

