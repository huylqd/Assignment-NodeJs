import express from "express";
import multer from "multer";
import { UploadImage } from "../controller/upload";

const router = express.Router()
const upload = multer({ dest: "uploads/" })
router.post("/images", upload.array("image", 5), UploadImage);

export default router;