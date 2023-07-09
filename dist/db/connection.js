"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
const connection = mysql2_1.default.createConnection({
    host: "localhost",
    port: 2021,
    user: "root",
    password: "password",
    database: "bitespeed_test"
});
connection.connect((err) => {
    if (err)
        throw err;
    console.info("Connected to MySQL server!");
});
exports.default = connection;
//# sourceMappingURL=connection.js.map