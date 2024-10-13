import { Router } from "express";
import {
  addService,
  deleteServiceById,
  getServiceById,
  getServices,
  updateServiceById,
} from "../controllers/service.controller.js";
const router = Router();

router.post("/add", addService);
router.get("/", getServices);
router.get("/:id", getServiceById);
router.delete("/:id", deleteServiceById);
router.patch("/:id", updateServiceById);

export default router;
