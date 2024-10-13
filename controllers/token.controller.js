import pool from "../config/db.js";
import { errorHandler } from "../helpers/error_handler.js";

const addToken = async (req, res) => {
  try {
    const {
      table_name,
      user_id,
      user_os,
      user_device,
      user_browser,
      hashed_refresh_token,
    } = req.body;

    const newToken = await pool.query(
      `
      INSERT INTO token (table_name, user_id, user_os, user_device, user_browser, hashed_refresh_token)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
      `,
      [
        table_name,
        user_id,
        user_os,
        user_device,
        user_browser,
        hashed_refresh_token,
      ]
    );

    return res.status(201).send({
      message: "Token entry added successfully",
      data: newToken.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getTokens = async (req, res) => {
  try {
    const tokens = await pool.query("SELECT * FROM token");
    return res.status(200).send(tokens.rows);
  } catch (error) {
    errorHandler(error, res);
  }
};

const getTokenById = async (req, res) => {
  try {
    const { id } = req.params;
    const token = await pool.query("SELECT * FROM token WHERE id = $1", [id]);

    if (token.rowCount === 0) {
      return res.status(404).send({
        message: "Token entry not found",
      });
    }

    return res.status(200).send(token.rows[0]);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateTokenById = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      table_name,
      user_id,
      user_os,
      user_device,
      user_browser,
      hashed_refresh_token,
    } = req.body;

    const updatedToken = await pool.query(
      `
      UPDATE token
      SET table_name = $1, user_id = $2, user_os = $3, user_device = $4, user_browser = $5, hashed_refresh_token = $6
      WHERE id = $7 RETURNING *
      `,
      [
        table_name,
        user_id,
        user_os,
        user_device,
        user_browser,
        hashed_refresh_token,
        id,
      ]
    );

    if (updatedToken.rowCount === 0) {
      return res.status(404).send({
        message: "Token entry not found",
      });
    }

    return res.status(200).send({
      message: "Token entry updated successfully",
      data: updatedToken.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteTokenById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedToken = await pool.query(
      "DELETE FROM token WHERE id = $1 RETURNING *",
      [id]
    );

    if (deletedToken.rowCount === 0) {
      return res.status(404).send({
        message: "Token entry not found",
      });
    }

    return res.status(200).send({
      message: "Token entry deleted successfully",
      data: deletedToken.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

export { addToken, getTokens, getTokenById, updateTokenById, deleteTokenById };
