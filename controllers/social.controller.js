import pool from "../config/db.js";
import { errorHandler } from "../helpers/error_handler.js";

const addSocial = async (req, res) => {
  try {
    const { social_name, social_icon_file } = req.body;
    const newSocial = await pool.query(
      `
      INSERT INTO social (social_name, social_icon_file)
      VALUES ($1, $2) RETURNING *
      `,
      [social_name, social_icon_file]
    );
    return res.status(201).send({
      message: "Social entry added successfully",
      data: newSocial.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getSocials = async (req, res) => {
  try {
    const socials = await pool.query("SELECT * FROM social");
    return res.status(200).send(socials.rows);
  } catch (error) {
    errorHandler(error, res);
  }
};

const getSocialById = async (req, res) => {
  try {
    const { id } = req.params;
    const social = await pool.query("SELECT * FROM social WHERE id = $1", [id]);
    if (social.rowCount === 0) {
      return res.status(404).send({
        message: "Social entry not found",
      });
    }
    return res.status(200).send(social.rows[0]);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateSocialById = async (req, res) => {
  try {
    const { id } = req.params;
    const { social_name, social_icon_file } = req.body;

    const updateSocial = await pool.query(
      `
      UPDATE social SET social_name = $1, social_icon_file = $2 WHERE id = $3 RETURNING *
      `,
      [social_name, social_icon_file, id]
    );
    if (updateSocial.rowCount === 0) {
      return res.status(404).send({
        message: "Social entry not found",
      });
    }
    return res.status(200).send({
      message: "Social entry updated successfully",
      data: updateSocial.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteSocialById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteSocial = await pool.query(
      "DELETE FROM social WHERE id = $1 RETURNING *",
      [id]
    );
    if (deleteSocial.rowCount === 0) {
      return res.status(404).send({
        message: "Social entry not found",
      });
    }
    return res.status(200).send({
      message: "Social entry deleted successfully",
      data: deleteSocial.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

export {
  addSocial,
  getSocials,
  getSocialById,
  updateSocialById,
  deleteSocialById,
};
