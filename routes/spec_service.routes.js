import { Router } from "express";
import {
  addSpecService,
  deleteSpecServiceById,
  getSpecServiceById,
  getSpecServices,
  updateSpecServiceById,
} from "../controllers/spec_service.controller.js";
const router = Router();

router.post("/add", addSpecService);
router.get("/", getSpecServices);
router.get("/:id", getSpecServiceById);
router.delete("/:id", deleteSpecServiceById);
router.patch("/:id", updateSpecServiceById);

export default router;
