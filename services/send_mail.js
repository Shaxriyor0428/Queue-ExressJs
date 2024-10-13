import nodemailer from "nodemailer";
import config from "config";

export const sendMail = (mail_options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: config.get("smtp_host"),
      port: config.get("smtp_port"),
      secure: false,
      auth: {
        user: config.get("smtp_user"),
        pass: config.get("smtp_pass"),
      },
    });
    transporter.sendMail(mail_options, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log(info.response);
      }
    });
  } catch (error) {
    console.error("Error on sending email ", error);
  }
};
