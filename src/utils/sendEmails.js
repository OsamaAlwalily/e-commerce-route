import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html, attachments }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAILPASS,
    },
  });

  const emailInfo = await transporter.sendMail({
    from: `"Route Academy" <${process.env.EMAIL}>`,
    to,
    subject,
    html,
    attachments,
  });

  return emailInfo.accepted.length < 1 ? false : true;
};
