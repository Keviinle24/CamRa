import { resend } from "../libs/resend";
import { render } from "@react-email/render";
import MagicLinkEmail from "../components/MagicLinkEmail";
import React from "react";

export async function sendVerificationEmail(email, url, host) {
  try {

    const emailHtml = await render(React.createElement(MagicLinkEmail, { url, host }));

    const data = await resend.emails.send({
      from: "CamRa <verify@camra.me>",
      to: [email],
      subject: "Verify CamRa Account",
      html: emailHtml,
      text: `Verify CamRa Account: ${url}`,
    });

    console.log("Email sent to:", email, "with url:", url, "data:", data);
    return { success: true, data };
  } catch (err) {
    console.error(err);
    throw new Error("Failed to send verification email");
  }
}
