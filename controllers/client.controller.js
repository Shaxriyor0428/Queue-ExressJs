import pool from "../config/db.js";
import DeviceDetector from "node-device-detector";
import { errorHandler } from "../helpers/error_handler.js";
import { v4 as uuidv4 } from "uuid";

const detector = new DeviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
  deviceAliasCode: false,
  deviceTrusted: false,
  deviceInfo: false,
  maxUserAgentSize: 500,
});

const addClient = async (req, res) => {
  try {
    const otp_id = uuidv4();
    const { first_name, last_name, phone_number, info, photo } = req.body;
    const newClient = await pool.query(
      `
      INSERT INTO clients (first_name, last_name, phone_number, info, photo, otp_id )
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
      `,
      [first_name, last_name, phone_number, info, photo, otp_id]
    );
    // console.log(newClient);

    res.status(201).send({
      message: "New client added",
      data: newClient.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getClients = async (req, res) => {
  try {
    const userAgent = req.headers["user-agent"];
    console.log(userAgent);
    const result = detector.detect(userAgent);
    console.log("result parse", result);
    
    const clients = await pool.query(`SELECT * FROM clients`);

    res.status(200).send(clients.rows);
  } catch (error) {
    errorHandler(error, res);
  }
};

const getClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await pool.query(
      `
        SELECT * FROM clients WHERE id = $1
        `,
      [id]
    );
    if (client.rowCount === 0) {
      return res.status(404).send({
        message: "Id Not found",
      });
    }
    return res.status(200).send((await client).rows[0]);
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteClient = await pool.query(
      `DELETE FROM clients WHERE id = $1 RETURNING *`,
      [id]
    );

    if (deleteClient.rowCount === 0) {
      return res.status(404).send({
        message: "Client not found",
      });
    }
    res.status(200).send({
      message: "Deleted successfully",
      data: deleteClient.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name } = req.body;

    const updateClient = await pool.query(
      `
      UPDATE clients SET first_name = $1, last_name = $2 WHERE id = $3
      RETURNING *
      `,
      [first_name, last_name, id]
    );
    if (updateClient.rowCount === 0) {
      return res.status(404).send({
        message: "Id not found",
      });
    }
    return res.status(200).send({
      message: "Client updated successfully",
      data: updateClient.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

export {
  addClient,
  getClients,
  deleteClientById,
  updateClientById,
  getClientById,
};
