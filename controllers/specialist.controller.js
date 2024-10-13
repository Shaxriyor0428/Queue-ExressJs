import pool from "../config/db.js";
import { errorHandler } from "../helpers/error_handler.js";
import { v4 as uuidv4 } from "uuid";

const addSpecialist = async (req, res) => {
  try {
    const {
      position,
      first_name,
      last_name,
      middle_name,
      birth_day,
      photo,
      phone_number,
      info,
      otp_id
    } = req.body;

    const newSpecialist = await pool.query(
      `
      INSERT INTO specialist 
      (position, first_name, last_name, middle_name, birth_day, photo, phone_number, info, otp_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *
      `,
      [
        position,
        first_name,
        last_name,
        middle_name,
        birth_day,
        photo,
        phone_number,
        info,
        otp_id,
      ]
    );

    res.status(201).send({
      message: "New specialist added",
      data: newSpecialist.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getSpecialists = async (req, res) => {
  try {
    const specialists = await pool.query("SELECT * FROM specialist");
    res.status(200).send(specialists.rows);
  } catch (error) {
    errorHandler(error, res);
  }
};

const getSpecialistById = async (req, res) => {
  try {
    const { id } = req.params;
    const specialist = await pool.query(
      "SELECT * FROM specialist WHERE id = $1",
      [id]
    );
    if (specialist.rowCount === 0) {
      return res.status(404).send({
        message: "Specialist not found",
      });
    }
    return res.status(200).send(specialist.rows[0]);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateSpecialistById = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      position,
      first_name,
      last_name,
      middle_name,
      birth_day,
      photo,
      phone_number,
      info,
      is_active,
    } = req.body;

    const updateSpecialist = await pool.query(
      `
      UPDATE specialist
      SET position = $1, first_name = $2, last_name = $3, middle_name = $4, birth_day = $5, photo = $6,
      phone_number = $7, info = $8, is_active = $9 WHERE id = $10
      RETURNING *
      `,
      [
        position,
        first_name,
        last_name,
        middle_name,
        birth_day,
        photo,
        phone_number,
        info,
        is_active,
        id,
      ]
    );

    if (updateSpecialist.rowCount === 0) {
      return res.status(404).send({
        message: "Specialist not found",
      });
    }

    return res.status(200).send({
      message: "Specialist updated successfully",
      data: updateSpecialist.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteSpecialistById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteSpecialist = await pool.query(
      "DELETE FROM specialist WHERE id = $1 RETURNING *",
      [id]
    );

    if (deleteSpecialist.rowCount === 0) {
      return res.status(404).send({
        message: "Specialist not found",
      });
    }

    return res.status(200).send({
      message: "Specialist deleted successfully",
      data: deleteSpecialist.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

export {
  addSpecialist,
  getSpecialists,
  getSpecialistById,
  updateSpecialistById,
  deleteSpecialistById,
};
