import pool from "../config/db.js";
import { errorHandler } from "../helpers/error_handler.js";

// Create (Add) a new service
const addService = async (req, res) => {
  try {
    const { service_name, service_price } = req.body;

    const newService = await pool.query(
      `
      INSERT INTO service (service_name, service_price)
      VALUES ($1, $2) RETURNING *
      `,
      [service_name, service_price]
    );

    return res.status(201).send({
      message: "Service entry added successfully",
      data: newService.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

// Read (Get all services)
const getServices = async (req, res) => {
  try {
    const services = await pool.query("SELECT * FROM service");
    return res.status(200).send(services.rows);
  } catch (error) {
    errorHandler(error, res);
  }
};

// Read (Get service by ID)
const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await pool.query("SELECT * FROM service WHERE id = $1", [
      id,
    ]);

    if (service.rowCount === 0) {
      return res.status(404).send({
        message: "Service entry not found",
      });
    }

    return res.status(200).send(service.rows[0]);
  } catch (error) {
    errorHandler(error, res);
  }
};

// Update (Edit service by ID)
const updateServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const { service_name, service_price } = req.body;

    const updatedService = await pool.query(
      `
      UPDATE service
      SET service_name = $1, service_price = $2
      WHERE id = $3 RETURNING *
      `,
      [service_name, service_price, id]
    );

    if (updatedService.rowCount === 0) {
      return res.status(404).send({
        message: "Service entry not found",
      });
    }

    return res.status(200).send({
      message: "Service entry updated successfully",
      data: updatedService.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

// Delete (Remove service by ID)
const deleteServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedService = await pool.query(
      "DELETE FROM service WHERE id = $1 RETURNING *",
      [id]
    );

    if (deletedService.rowCount === 0) {
      return res.status(404).send({
        message: "Service entry not found",
      });
    }

    return res.status(200).send({
      message: "Service entry deleted successfully",
      data: deletedService.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

export {
  addService,
  getServices,
  getServiceById,
  updateServiceById,
  deleteServiceById,
};
