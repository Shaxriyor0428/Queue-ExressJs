import pool from "../config/db.js";
import { errorHandler } from "../helpers/error_handler.js";

// Create (Add) a new spec_social entry
const addSpecSocial = async (req, res) => {
  try {
    const { specialist_id, social_id, link } = req.body;

    const newSpecSocial = await pool.query(
      `
      INSERT INTO spec_social (specialist_id, social_id, link)
      VALUES ($1, $2, $3) RETURNING *
      `,
      [specialist_id, social_id, link]
    );

    return res.status(201).send({
      message: "Specialist social link added successfully",
      data: newSpecSocial.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

// Read (Get all spec_social entries)
const getSpecSocials = async (req, res) => {
  try {
    const specSocials = await pool.query("SELECT * FROM spec_social");
    return res.status(200).send(specSocials.rows);
  } catch (error) {
    errorHandler(error, res);
  }
};

// Read (Get spec_social by ID)
const getSpecSocialById = async (req, res) => {
  try {
    const { id } = req.params;
    const specSocial = await pool.query(
      "SELECT * FROM spec_social WHERE id = $1",
      [id]
    );

    if (specSocial.rowCount === 0) {
      return res.status(404).send({
        message: "Specialist social link not found",
      });
    }

    return res.status(200).send(specSocial.rows[0]);
  } catch (error) {
    errorHandler(error, res);
  }
};

// Update (Edit spec_social by ID)
const updateSpecSocialById = async (req, res) => {
  try {
    const { id } = req.params;
    const { specialist_id, social_id, link } = req.body;

    const updatedSpecSocial = await pool.query(
      `
      UPDATE spec_social
      SET specialist_id = $1, social_id = $2, link = $3
      WHERE id = $4 RETURNING *
      `,
      [specialist_id, social_id, link, id]
    );

    if (updatedSpecSocial.rowCount === 0) {
      return res.status(404).send({
        message: "Specialist social link not found",
      });
    }

    return res.status(200).send({
      message: "Specialist social link updated successfully",
      data: updatedSpecSocial.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

// Delete (Remove spec_social by ID)
const deleteSpecSocialById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSpecSocial = await pool.query(
      "DELETE FROM spec_social WHERE id = $1 RETURNING *",
      [id]
    );

    if (deletedSpecSocial.rowCount === 0) {
      return res.status(404).send({
        message: "Specialist social link not found",
      });
    }

    return res.status(200).send({
      message: "Specialist social link deleted successfully",
      data: deletedSpecSocial.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

export {
  addSpecSocial,
  getSpecSocials,
  getSpecSocialById,
  updateSpecSocialById,
  deleteSpecSocialById,
};
