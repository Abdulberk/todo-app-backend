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
exports.disconnect = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connection = {
    isConnected: false,
};
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    if (connection.isConnected) {
        console.log('Veritabanına zaten bağlandı!');
        return;
    }
    try {
        const baglanti = process.env.MONGODB_URI;
        const db = yield mongoose_1.default.connect(baglanti);
        console.log('Yeni bağlantı kuruldu!');
        connection.isConnected = db.connections[0].readyState === 1;
    }
    catch (err) {
        console.error('Bağlantı başarısız!', err);
    }
});
exports.connectDB = connectDB;
const disconnect = () => __awaiter(void 0, void 0, void 0, function* () {
    if (connection.isConnected) {
        if (process.env.NODE_ENV === 'production') {
            yield mongoose_1.default.disconnect();
            connection.isConnected = false;
        }
        if (process.env.NODE_ENV === 'development') {
            yield mongoose_1.default.disconnect();
            connection.isConnected = false;
        }
    }
});
exports.disconnect = disconnect;
exports.default = connection;
