import { Router } from "express";
import {
  addQueue,
  deleteQueueById,
  getQueueById,
  getQueues,
  updateQueueById,
} from "../controllers/queue.controller.js";
const router = Router();

router.post("/add", addQueue);
router.get("/", getQueues);
router.get("/:id", getQueueById);
router.delete("/:id", deleteQueueById);
router.patch("/:id", updateQueueById);

export default router;
