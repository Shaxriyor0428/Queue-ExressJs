import { Router } from "express";
import {
  addSpecWorkingDay,
  deleteSpecWorkingDayById,
  getSpecWorkingDayById,
  getSpecWorkingDays,
  updateSpecWorkingDayById,
} from "../controllers/spec_working_day.controller.js";
const router = Router();

router.post("/add", addSpecWorkingDay);
router.get("/", getSpecWorkingDays);
router.get("/:id", getSpecWorkingDayById);
router.delete("/:id", deleteSpecWorkingDayById);
router.patch("/:id", updateSpecWorkingDayById);

export default router;
