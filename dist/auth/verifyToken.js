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
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const verifyToken = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token)
            return res.status(401).json({ message: 'token bulunamadı' });
        jwt.verify(token, process.env.JWT_SECRET, (error, decodedUser) => {
            if (error)
                throw error;
            req.user = decodedUser;
            next();
        });
    }
    catch (err) {
        switch (true) {
            case err instanceof jwt.TokenExpiredError:
                return res.status(401).json({ message: 'tokenin süresi dolmuş !' });
            case err instanceof jwt.JsonWebTokenError:
                return res.status(403).json({ message: 'token geçersiz !' });
            default:
                return res.status(500).json({ message: err.message || 'token doğrulanırken bilinmeyen bir hata oluştu !' });
        }
    }
}));
exports.default = verifyToken;
