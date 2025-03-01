import express from "express";
import { loginByFirebase, loginUser, registerUser } from "../controllers/user.controller.js";

const router=express.Router();

router.post('/login-firebase',loginByFirebase);
router.post('/login',loginUser);
router.post('/register',registerUser);

export default router;