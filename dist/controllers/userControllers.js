"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler = require('express-async-handler');
const User_1 = __importDefault(require("../models/User"));
const generateToken_1 = __importDefault(require("../auth/generateToken"));
const bcrypt = require('bcrypt');
const register = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    const user = yield User_1.default.findOne({ email });
    if (user) {
        return res.status(400).json({ message: "Bu email adresi zaten kullanımda" });
    }
    const salt = yield bcrypt.genSalt(10);
    const hashedPass = yield bcrypt.hash(password, salt);
    const newUser = new User_1.default({
        username,
        email,
        password: hashedPass
    });
    yield newUser.save();
    const token = yield (0, generateToken_1.default)({
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
    });
    return res.status(200).json({
        user: newUser,
        token
    });
}));
const login = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_1.default.findOne({ email });
        if (!user)
            return res.status(404).json({ message: 'bu email adresi bulunamadı' });
        const checkPassword = yield bcrypt.compare(password, user.password);
        if (!checkPassword)
            return res.status(400).json({ message: 'lütfen şifrenizi kontrol edin' });
        const newToken = yield (0, generateToken_1.default)(user);
        return res.status(200).json({
            message: 'giriş başarılı',
            token: newToken
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'sunucuda bir hata oluştu, giriş yapılamadı' });
    }
}));
const logout = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(200).json({
        message: 'çıkış yapıldı'
    });
}));
const getProfile = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield User_1.default.findOne({
            _id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id
        });
        if (!user)
            return res.status(404).json({ message: 'kullanıcı bulunamadı' });
        return res.status(200).json({
            user
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'sunucuda bir hata oluştu, profil bilgileri getirilemedi' });
    }
}));
module.exports = { register, login, logout, getProfile };
