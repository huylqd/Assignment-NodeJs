import express from "express";
import { create, get, getAll, remove, update } from "../controller/category";
import { checkPermission } from "../midlewares/checkPermission";
const router = express.Router();
router.use(express.json());

router.get("/categories", getAll);
router.get("/categories/:id", get);
router.post("/categories", checkPermission, create);
router.patch("/categories/:id", checkPermission, update);
router.delete("/categories/:id", checkPermission, remove);

export default router;