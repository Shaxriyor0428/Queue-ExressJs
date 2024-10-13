import pool from "../config/db.js";
import { errorHandler } from "../helpers/error_handler.js";

// Create (Add) a new spec_service entry
const addSpecService = async (req, res) => {
  try {
    const { specialist_id, service_id, spec_service_price } = req.body;

    const newSpecService = await pool.query(
      `
      INSERT INTO spec_service (specialist_id, service_id, spec_service_price)
      VALUES ($1, $2, $3) RETURNING *
      `,
      [specialist_id, service_id, spec_service_price]
    );

    return res.status(201).send({
      message: "Specialist service added successfully",
      data: newSpecService.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

// Read (Get all spec_service entries)
const getSpecServices = async (req, res) => {
  try {
    const specServices = await pool.query("SELECT * FROM spec_service");
    return res.status(200).send(specServices.rows);
  } catch (error) {
    errorHandler(error, res);
  }
};

// Read (Get spec_service by ID)
const getSpecServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const specService = await pool.query(
      "SELECT * FROM spec_service WHERE id = $1",
      [id]
    );

    if (specService.rowCount === 0) {
      return res.status(404).send({
        message: "Specialist service entry not found",
      });
    }

    return res.status(200).send(specService.rows[0]);
  } catch (error) {
    errorHandler(error, res);
  }
};

// Update (Edit spec_service by ID)
const updateSpecServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const { specialist_id, service_id, spec_service_price } = req.body;

    const updatedSpecService = await pool.query(
      `
      UPDATE spec_service
      SET specialist_id = $1, service_id = $2, spec_service_price = $3
      WHERE id = $4 RETURNING *
      `,
      [specialist_id, service_id, spec_service_price, id]
    );

    if (updatedSpecService.rowCount === 0) {
      return res.status(404).send({
        message: "Specialist service entry not found",
      });
    }

    return res.status(200).send({
      message: "Specialist service updated successfully",
      data: updatedSpecService.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

// Delete (Remove spec_service by ID)
const deleteSpecServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSpecService = await pool.query(
      "DELETE FROM spec_service WHERE id = $1 RETURNING *",
      [id]
    );

    if (deletedSpecService.rowCount === 0) {
      return res.status(404).send({
        message: "Specialist service entry not found",
      });
    }

    return res.status(200).send({
      message: "Specialist service deleted successfully",
      data: deletedSpecService.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

export {
  addSpecService,
  getSpecServices,
  getSpecServiceById,
  updateSpecServiceById,
  deleteSpecServiceById,
};
