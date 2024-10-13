import pool from "../config/db.js";
import { errorHandler } from "../helpers/error_handler.js";

const addSpecWorkingDay = async (req, res) => {
  try {
    const { specialist_id, day_of_week, start_time, finish_time } = req.body;

    const newSpecWorkingDay = await pool.query(
      `
      INSERT INTO spec_working_day (specialist_id, day_of_week, start_time, finish_time)
      VALUES ($1, $2, $3, $4) RETURNING *
      `,
      [specialist_id, day_of_week, start_time, finish_time]
    );

    return res.status(201).send({
      message: "Specialist working day added successfully",
      data: newSpecWorkingDay.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

// Read (Get all spec_working_day entries)
const getSpecWorkingDays = async (req, res) => {
  try {
    const specWorkingDays = await pool.query("SELECT * FROM spec_working_day");
    return res.status(200).send(specWorkingDays.rows);
  } catch (error) {
    errorHandler(error, res);
  }
};

// Read (Get spec_working_day by ID)
const getSpecWorkingDayById = async (req, res) => {
  try {
    const { id } = req.params;
    const specWorkingDay = await pool.query(
      "SELECT * FROM spec_working_day WHERE id = $1",
      [id]
    );

    if (specWorkingDay.rowCount === 0) {
      return res.status(404).send({
        message: "Specialist working day not found",
      });
    }

    return res.status(200).send(specWorkingDay.rows[0]);
  } catch (error) {
    errorHandler(error, res);
  }
};

// Update (Edit spec_working_day by ID)
const updateSpecWorkingDayById = async (req, res) => {
  try {
    const { id } = req.params;
    const { specialist_id, day_of_week, start_time, finish_time } = req.body;

    const updatedSpecWorkingDay = await pool.query(
      `
      UPDATE spec_working_day
      SET specialist_id = $1, day_of_week = $2, start_time = $3, finish_time = $4
      WHERE id = $5 RETURNING *
      `,
      [specialist_id, day_of_week, start_time, finish_time, id]
    );

    if (updatedSpecWorkingDay.rowCount === 0) {
      return res.status(404).send({
        message: "Specialist working day not found",
      });
    }

    return res.status(200).send({
      message: "Specialist working day updated successfully",
      data: updatedSpecWorkingDay.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

// Delete (Remove spec_working_day by ID)
const deleteSpecWorkingDayById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSpecWorkingDay = await pool.query(
      "DELETE FROM spec_working_day WHERE id = $1 RETURNING *",
      [id]
    );

    if (deletedSpecWorkingDay.rowCount === 0) {
      return res.status(404).send({
        message: "Specialist working day not found",
      });
    }

    return res.status(200).send({
      message: "Specialist working day deleted successfully",
      data: deletedSpecWorkingDay.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

export {
  addSpecWorkingDay,
  getSpecWorkingDays,
  getSpecWorkingDayById,
  updateSpecWorkingDayById,
  deleteSpecWorkingDayById,
};
