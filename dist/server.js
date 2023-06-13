"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const { connectDB, disconnect } = require('./connection');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const todoRoutes_1 = __importDefault(require("./routes/todoRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
connectDB()
    .then(() => {
    app.use('/', todoRoutes_1.default);
    app.use('/', authRoutes_1.default);
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
    .catch((err) => {
    console.error('Bağlantı başarısız!', err);
});
