import { Router } from "express";
import {
  addSocial,
  deleteSocialById,
  getSocialById,
  getSocials,
  updateSocialById,
} from "../controllers/social.controller.js";
const router = Router();

router.post("/add", addSocial);
router.get("/", getSocials);
router.get("/:id", getSocialById);
router.delete("/:id", deleteSocialById);
router.patch("/:id", updateSocialById);

export default router;
