import { Router } from "express";
import {
  getOTP,
  newOTP,
  newSpecialistOTP,
  verifyOTP,
  verifySpecialistOTP,
} from "../controllers/otp.controller.js";
const router = Router();

router.post("/newotp", newOTP);
router.post("/verifyotp", verifyOTP);
router.post("/newspecialistotp", newSpecialistOTP);
router.post("/verifyspecialistotp", verifySpecialistOTP);
router.get("/", getOTP);

export default router;
