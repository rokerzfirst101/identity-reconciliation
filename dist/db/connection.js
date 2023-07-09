"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
require("dotenv/config");
const connectionOptions = {
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};
const connection = mysql2_1.default.createConnection(connectionOptions);
connection.connect((err) => {
    if (err)
        throw err;
    console.info("Connected to MySQL server!");
});
exports.default = connection;
//# sourceMappingURL=connection.js.map