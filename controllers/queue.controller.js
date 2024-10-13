import pool from "../config/db.js";
import { errorHandler } from "../helpers/error_handler.js";

// Create (Add) a new queue entry
const addQueue = async (req, res) => {
  try {
    const { spec_service_id, client_id, queue_date_time, queue_number } =
      req.body;

    const newQueue = await pool.query(
      `
      INSERT INTO queue (spec_service_id, client_id, queue_date_time, queue_number)
      VALUES ($1, $2, $3, $4) RETURNING *
      `,
      [spec_service_id, client_id, queue_date_time, queue_number]
    );

    return res.status(201).send({
      message: "Queue entry added successfully",
      data: newQueue.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

// Read (Get all queue entries)
const getQueues = async (req, res) => {
  try {
    const queues = await pool.query("SELECT * FROM queue");
    return res.status(200).send(queues.rows);
  } catch (error) {
    errorHandler(error, res);
  }
};

// Read (Get queue entry by ID)
const getQueueById = async (req, res) => {
  try {
    const { id } = req.params;
    const queue = await pool.query("SELECT * FROM queue WHERE id = $1", [id]);

    if (queue.rowCount === 0) {
      return res.status(404).send({
        message: "Queue entry not found",
      });
    }

    return res.status(200).send(queue.rows[0]);
  } catch (error) {
    errorHandler(error, res);
  }
};

// Update (Edit queue entry by ID)
const updateQueueById = async (req, res) => {
  try {
    const { id } = req.params;
    const { spec_service_id, client_id, queue_date_time, queue_number } =
      req.body;

    const updatedQueue = await pool.query(
      `
      UPDATE queue
      SET spec_service_id = $1, client_id = $2, queue_date_time = $3, queue_number = $4
      WHERE id = $5 RETURNING *
      `,
      [spec_service_id, client_id, queue_date_time, queue_number, id]
    );

    if (updatedQueue.rowCount === 0) {
      return res.status(404).send({
        message: "Queue entry not found",
      });
    }

    return res.status(200).send({
      message: "Queue entry updated successfully",
      data: updatedQueue.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

// Delete (Remove queue entry by ID)
const deleteQueueById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedQueue = await pool.query(
      "DELETE FROM queue WHERE id = $1 RETURNING *",
      [id]
    );

    if (deletedQueue.rowCount === 0) {
      return res.status(404).send({
        message: "Queue entry not found",
      });
    }

    return res.status(200).send({
      message: "Queue entry deleted successfully",
      data: deletedQueue.rows[0],
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

export { addQueue, getQueues, getQueueById, updateQueueById, deleteQueueById };
