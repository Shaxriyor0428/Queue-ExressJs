import { Router } from "express";
import {
  addClient,
  deleteClientById,
  getClientById,
  getClients,
  updateClientById,
} from "../controllers/client.controller.js";
const router = Router();

router.post("/add", addClient);
router.get("/", getClients);
router.get("/:id", getClientById);
router.delete("/:id", deleteClientById);
router.patch("/update/:id", updateClientById);

export default router;
