import pool from "../config/db.js";
import { errorHandler } from "../helpers/error_handler.js";
import bcrypt from "bcryptjs";

const { hashSync, compareSync } = bcrypt;

const addAdmin = async (req, res) => {
  try {
    const { name, phone_number, email, password } = req.body;
    const hashed_password = hashSync(password, 7); 
    const newAdmin = await pool.query(
      `
        INSERT INTO admin (name, phone_number, email, hashed_password)
        VALUES ($1, $2, $3, $4) RETURNING *
      `,
      [name, phone_number, email, hashed_password]
    );
    return res.status(201).send({
      message: "Admin added successfully",
      data: newAdmin.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAdmins = async (req, res) => {
  try {
    const admins = await pool.query("SELECT * FROM admin");
    return res.status(200).send(admins.rows);
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await pool.query("SELECT * FROM admin WHERE id = $1", [id]);
    if (admin.rowCount === 0) {
      return res.status(404).send({
        message: "Admin not found",
      });
    }
    return res.status(200).send(admin.rows[0]);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone_number, email, password } = req.body;

    const hashed_password = password ? hashSync(password, 7) : undefined;

    const updateAdmin = await pool.query(
      `UPDATE admin SET name = $1 ,phone_number = $2 ,email= $3 WHERE id = $4 RETURNING *`,
      [name, phone_number, email, id]
    );

    if (updateAdmin.rowCount === 0) {
      return res.status(404).send({
        message: "Admin not found",
      });
    }

    return res.status(200).send({
      message: "Admin updated successfully",
      data: updateAdmin.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteAdmin = await pool.query(
      "DELETE FROM admin WHERE id = $1 RETURNING *",
      [id]
    );
    if (deleteAdmin.rowCount === 0) {
      return res.status(404).send({
        message: "Admin not found",
      });
    }
    return res.status(200).send({
      message: "Admin deleted successfully",
      data: deleteAdmin.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

export { addAdmin, getAdmins, getAdminById, updateAdminById, deleteAdminById };
