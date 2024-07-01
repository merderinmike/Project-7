import express from "express";
import logout from "../../controllers/auth.logout";

const router = express.Router();

router.post("/", logout);

export default router;
