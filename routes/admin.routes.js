import { Router } from "express";
import { addAdmin, deleteAdminById, getAdminById, getAdmins, updateAdminById } from "../controllers/admin.controller.js";
const router = Router();

router.post("/add", addAdmin);
router.get("/", getAdmins);
router.get("/:id", getAdminById);
router.delete("/:id", deleteAdminById);
router.patch("/:id", updateAdminById);

export default router;
