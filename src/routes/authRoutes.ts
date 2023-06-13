import express from "express";
const router = express.Router();
const { register, login,logout, getProfile } = require('../controllers/userControllers');
import verifyToken from "../auth/verifyToken";


router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)
router.get('/profile',verifyToken, getProfile)

export default router;


