import { v4 as uuidv4 } from "uuid";
import otpGenerator from "otp-generator";
import pool from "../config/db.js";
import { errorHandler } from "../helpers/error_handler.js";
import { addminute } from "../helpers/add_minute.js";
import { decode, encode } from "../services/crypt.js";
import { sendMail } from "../services/send_mail.js";
import config from "config";
import myJwt from "../services/jwt_serves.js";
import bcrypt from "bcryptjs";
import DeviceDetector from "node-device-detector";
const { hashSync, compareSync } = bcrypt;

const detector = new DeviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
  deviceAliasCode: false,
  deviceTrusted: false,
  deviceInfo: false,
  maxUserAgentSize: 500,
});

const newOTP = async (req, res) => {
  try {
    const { phone_number } = req.body;
    const otp = otpGenerator.generate(4, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    const now = new Date();
    const expiration_time = addminute(now, 5);
    const newOtp = await pool.query(
      `
        INSERT INTO otp(id,otp,expiration_time)
        VALUES($1, $2, $3) RETURNING *
        `,
      [uuidv4(), otp, expiration_time]
    );
    const details = {
      timestamp: now,
      phone_number: phone_number,
      otp_id: newOtp.rows[0].id,
    };
    // Sms, bot, email
    const encodedData = await encode(JSON.stringify(details));
    res.status(201).send({
      messsage: "Success",
      encodedData,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { otp, phone_number, verification_key } = req.body;
    const currentDateTime = new Date();
    const decodedData = await decode(verification_key);
    // console.log(decodedData);
    const parserData = JSON.parse(decodedData);

    if (parserData.phone_number !== phone_number) {
      const response = {
        Status: "Failure ",
        Details: "Otp wasn't sent to this particular phone_number",
      };
      return res.status(400).send(response);
    }

    const otpResult = await pool.query(`SELECT * FROM otp where id = $1`, [
      parserData.otp_id,
    ]);
    const result = otpResult.rows[0];

    console.log(result);
    if (result !== null) {
      if (result.verified == true) {
        if (result.expiration_time > currentDateTime) {
          if (result.otp == otp) {
            await pool.query(
              `
                  UPDATE otp set verified = $2 where id = $1
                        `,
              [result.id, true]
            );
            const clientResult = await pool.query(
              `SELECT * FROM clients WHERE phone_number = $1`,
              [phone_number]
            );
            let client_id, client_status;
            if (clientResult.rows.length == 0) {
              const newClient = await pool.query(
                `
                    INSERT INTO clients (phone_number,otp_id,is_active)
                    VALUES ($1, $2, $3) RETURNING id
                    `,
                [phone_number, parserData.otp_id, true]
              );
              client_id = newClient.rows[0].id;
              client_status = "new";
            } else {
              client_id = clientResult.rows[0].id;
              (client_status = "old"),
                await pool.query(
                  `
                    UPDATE clients set otp_id = $2, is_active=true where id = $1
                    `,
                  [client_id, parserData.otp_id]
                );
            }

            const payload = {
              id: client_id,
              client_status,
            };
            const tokens = myJwt.generateTokens(payload);
            const hashedRefreshToken = hashSync(tokens.refreshToken, 7);

            const userAgent = req.headers["user-agent"];
            const { os, client: browser, device } = detector.detect(userAgent);
            console.log(os);
            console.log(browser);
            console.log(device);
            await pool.query(
              `INSERT INTO token (table_name, user_id, user_os, user_device, user_browser, hashed_refresh_token)
              VALUES ($1, $2, $3, $4 ,$5 ,$6)`,
              ["clients", client_id, os, device, browser, hashedRefreshToken]
            );
            res.cookie("refresh_token", tokens.refreshToken, {
              httpOnly: true,
              maxAge: config.get("refresh_time_ms"),
            });

            const response = {
              Status: "Success",
              Details: client_status,
              phone_number: phone_number,
              clientId: client_id,
              accessToken: tokens.accessToken,
            };

            return res.status(200).send(response);
          } else {
            const response = {
              Status: "Failure ",
              Details: "Otp not match",
            };
            return res.status(400).send(response);
          }
        } else {
          const response = {
            Status: "Failure ",
            Details: "Otp expired",
          };
          return res.status(400).send(response);
        }
      } else {
        const response = {
          Status: "Failure ",
          Details: "Otp already verified",
        };
        return res.status(400).send(response);
      }
    } else {
      const response = {
        Status: "Failure ",
        Details: "Otp not found",
      };
      return res.status(400).send(response);
    }
  } catch (error) {
    errorHandler(error, res);
  }
};

const getOTP = async (req, res) => {
  try {
    const otp = await pool.query("SELECT * FROM otp");
    res.send(otp.rows);
  } catch (error) {
    errorHandler(error, res);
  }
};

const newSpecialistOTP = async (req, res) => {
  try {
    const { phone_number } = req.body;

    const otp = otpGenerator.generate(4, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    const now = new Date();
    const expiration_time = addminute(now, 3);

    // await pool.query(`DELETE FROM otp WHERE $1 > NOW()`, [expiration_time]);
    // console.log(expiration_time, otp);

    const newSpecialistOtp = await pool.query(
      `
      INSERT INTO otp (id,otp,expiration_time)
      VALUES ($1, $2, $3) RETURNING *
      `,
      [uuidv4(), otp, expiration_time]
    );

    const details = {
      timestamp: now,
      phone_number: phone_number,
      otp_id: newSpecialistOtp.rows[0].id,
    };
    const mail_options = {
      from: config.get("smtp_user"),
      to: "shaxriyorziyodullayev816@gmail.com",
      subject: "Sent verification code to your email",
      text: "",
      html: `<div">
                    <h1>${otp}</h1>
               </div> `,
    };

    sendMail(mail_options);
    const encodedData = await encode(JSON.stringify(details));

    res.status(201).send({
      Sms: "Emailingizga sms yuborildi!",
      status: "Success",
      encodedData,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const verifySpecialistOTP = async (req, res) => {
  try {
    const { otp, phone_number, verification_key } = req.body;
    const currentDateTime = new Date();
    const decodedData = await decode(verification_key);
    const parserData = JSON.parse(decodedData);

    if (parserData.phone_number !== phone_number) {
      const response = {
        Status: "Failure",
        Details: "Otp was not sent to this particular phone number",
      };
      return res.status(400).send(response);
    }
    const otpResult = await pool.query(`SELECT * FROM otp WHERE id = $1`, [
      parserData.otp_id,
    ]);

    const result = otpResult.rows[0];

    if (result != null) {
      if (result.verified != true) {
        if (result.expiration_time > currentDateTime) {
          if (result.otp == otp) {
            await pool.query(`UPDATE otp SET verified = $1 WHERE id = $2`, [
              true,
              result.id,
            ]);

            const specialistResult = await pool.query(
              `SELECT * FROM specialist WHERE phone_number = $1`,
              [phone_number]
            );
            let specialist_id, specialist_status;

            if (specialistResult.rows.length === 0) {
              const newSpecialist = await pool.query(
                `INSERT INTO specialist (phone_number,otp_id,is_active)
                  VALUES ($1, $2, $3) RETURNING *
                  `,
                [phone_number, parserData.otp_id, true]
              );
              specialist_id = newSpecialist.rows[0].id;
              specialist_status = "new";
            } else {
              specialist_id = specialistResult.rows[0].id;
              specialist_status = "old";
              await pool.query(
                `
                UPDATE specialist SET otp_id = $1, is_active = true WHERE id = $2
                `,
                [parserData.otp_id, specialist_id]
              );
            }

            const response = {
              Status: "Success",
              Details: specialist_status,
              PhoneNumber: phone_number,
              SpecialistId: specialist_id,
            };

            return res.send(response);
          } else {
            const response = {
              Status: "Failure",
              Details: "Otp not matched",
            };
            return res.status(400).send(response);
          }
        } else {
          const response = {
            Status: "Failure",
            Details: "Otp expired",
          };
          return res.status(400).send(response);
        }
      } else {
        const response = {
          Status: "Failure",
          Details: "Otp already verified",
        };
        return res.status(400).send(response);
      }
    } else {
      const response = {
        Status: "Failure",
        Details: "Otp not found ",
      };
      return res.status(400).send(response);
    }
  } catch (error) {
    errorHandler(error, res);
  }
};

export { newOTP, verifyOTP, getOTP, newSpecialistOTP, verifySpecialistOTP };
