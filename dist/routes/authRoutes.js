"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const { register, login, logout, getProfile } = require('../controllers/userControllers');
const verifyToken_1 = __importDefault(require("../auth/verifyToken"));
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/profile', verifyToken_1.default, getProfile);
exports.default = router;
