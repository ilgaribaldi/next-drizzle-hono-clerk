import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import * as React from "react";

interface ContactEmailProps {
  name: string;
  email: string;
  message: string;
  company?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  ? process.env.NEXT_PUBLIC_APP_URL
  : "";

export const ContactEmail = ({
  name,
  email,
  message,
  company,
}: ContactEmailProps) => {
  const previewText = `Message from ${name} on Rapidwork`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px]">
              <Img
                src={`${baseUrl}/logo.png`}
                width="40"
                height="37"
                alt="Logo"
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Message from <strong>{name}</strong> on <strong>rapidwork</strong>
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Hello,
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              <strong>{name}</strong> (
              <Link
                href={`mailto:${email}`}
                className="text-blue-600 no-underline"
              >
                {email}
              </Link>
              ) has left you a message on <strong>rapidwork</strong>.
              {company && (
                <span>
                  {" "}
                  They are from <strong>{company}</strong>.
                </span>
              )}
            </Text>

            <Text className="text-[14px] leading-[24px] text-black">
              This is the message sent:
              <br />
              {message}
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              This message was automatically generated and sent from your
              Portfolio Website.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

ContactEmail.PreviewProps = {
  name: "Your name",
  email: "name@example.com",
  company: "Awesome Company",
  message: `Hello!
  
    This is John, from Awesome Company. Just wanted to say hi!
    `,
} as ContactEmailProps;

export default ContactEmail;
