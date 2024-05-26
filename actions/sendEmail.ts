// Use the "use server" directive to indicate this is server-side code
"use server";

import React from "react";
import { Resend } from "resend";
import { validateString, getErrorMessage } from "@/lib/utils"; // Adjust import paths as necessary
import ContactFormEmail from "@/email/contact-form-email";

// Initialize Resend with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

// Define the sendEmail function to handle form submissions
export const sendEmail = async (formData: FormData) => {
  const senderEmail = formData.get("senderEmail");
  const message = formData.get("message");

  // Simple server-side validation
  if (!validateString(senderEmail, 500)) {
    return {
      error: "Invalid sender email",
    };
  }
  if (!validateString(message, 5000)) {
    return {
      error: "Invalid message",
    };
  }

  let data;
  try {
    // Send the email using the Resend API
    data = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: "ladsanjana99@gmail.com",
      subject: "Message from contact form",
      reply_to: senderEmail,
      react: React.createElement(ContactFormEmail, {
        message: message,
        senderEmail: senderEmail,
      }),
    });
  } catch (error) {
    // Handle any errors that occur during email sending
    return {
      error: getErrorMessage(error),
    };
  }

  // Return the result of the email sending operation
  return {
    data,
  };
};
