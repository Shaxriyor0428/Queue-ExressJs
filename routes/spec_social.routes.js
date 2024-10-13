import { Router } from "express";
import {
  addSpecSocial,
  deleteSpecSocialById,
  getSpecSocialById,
  getSpecSocials,
  updateSpecSocialById,
} from "../controllers/spec_social.controller.js";

const router = Router();

router.post("/add", addSpecSocial);
router.get("/", getSpecSocials);
router.get("/:id", getSpecSocialById);
router.delete("/:id", deleteSpecSocialById);
router.patch("/:id", updateSpecSocialById);

export default router;
