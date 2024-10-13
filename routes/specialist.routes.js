import { Router } from "express";
import {
  addSpecialist,
  deleteSpecialistById,
  getSpecialistById,
  getSpecialists,
  updateSpecialistById,
} from "../controllers/specialist.controller.js";
const router = Router();

router.post("/add", addSpecialist);
router.get("/", getSpecialists);
router.get("/:id", getSpecialistById);
router.delete("/:id", deleteSpecialistById);
router.patch("/:id", updateSpecialistById);

export default router;
