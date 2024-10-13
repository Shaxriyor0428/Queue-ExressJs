import { Router } from "express";
import {
  addToken,
  deleteTokenById,
  getTokenById,
  getTokens,
  updateTokenById,
} from "../controllers/token.controller.js";
const router = Router();

router.post("/add", addToken);
router.get("/", getTokens);
router.get("/:id", getTokenById);
router.delete("/:id", deleteTokenById);
router.patch("/:id", updateTokenById);

export default router;
