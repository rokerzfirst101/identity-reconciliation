"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSecondary = exports.checkIfContactExists = exports.update = exports.create = exports.findByEmailOrPhone = exports.getById = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const tableName = "contacts";
const Queries = {
    CheckIfEntryExists: `SELECT COUNT(*) FROM ${tableName} WHERE email=? and phoneNumber=?`,
    GetById: `SELECT * FROM ${tableName} WHERE id=?`,
    FindByEmailOrPhone: `SELECT * FROM ${tableName} WHERE email=? OR phoneNumber=? OR id IN (
        SELECT DISTINCT(linkedId) FROM ${tableName} WHERE email=? OR phoneNumber=?
    ) OR linkedId IN (
        SELECT DISTINCT(id) FROM ${tableName} WHERE email=? OR phoneNumber=?
    ) `,
    Insert: `INSERT INTO ${tableName} (email, phoneNumber, linkedId, linkPrecedence) VALUES(?, ?, ?, ?)`,
    Update: `UPDATE ${tableName} SET phoneNumber=?, email=?, linkedId=?, linkPrecedence=? WHERE id=?`,
    MakeSecondary: `UPDATE ${tableName} SET linkedId=?, linkPrecedence='secondary' WHERE id IN (?)`
};
const getById = (id) => {
    return new Promise((resolve, reject) => {
        connection_1.default.query(Queries.GetById, [id], (err, res) => {
            if (err)
                reject(err);
            else
                resolve(res === null || res === void 0 ? void 0 : res[0]);
        });
    });
};
exports.getById = getById;
const findByEmailOrPhone = (data) => {
    return new Promise((resolve, reject) => {
        connection_1.default.query(Queries.FindByEmailOrPhone, [data.email, data.phoneNumber, data.email, data.phoneNumber,
            data.email, data.phoneNumber], (err, res) => {
            if (err)
                reject(err);
            else
                resolve(res);
        });
    });
};
exports.findByEmailOrPhone = findByEmailOrPhone;
const create = (data, linkedId) => {
    return new Promise((resolve, reject) => {
        connection_1.default.query(Queries.Insert, [data.email, data.phoneNumber, linkedId, linkedId ? "secondary" : "primary"], (err, res) => {
            if (err)
                reject(err);
            else
                (0, exports.getById)(res.insertId)
                    .then(getByIdRes => resolve(getByIdRes))
                    .catch(getByIdErr => reject(err));
        });
    });
};
exports.create = create;
const update = (contactId, updatedContact) => {
    return new Promise((resolve, reject) => {
        connection_1.default.query(Queries.Update, [updatedContact.phoneNumber, updatedContact.email, updatedContact.linkedId,
            updatedContact.linkPrecedence, contactId], (err, res) => {
            if (err)
                reject(err);
            else if (res.affectedRows > 0) {
                (0, exports.getById)(contactId)
                    .then(getByIdRes => resolve(getByIdRes))
                    .catch(getByIdErr => reject(getByIdErr));
            }
        });
    });
};
exports.update = update;
const checkIfContactExists = (data) => {
    return new Promise((resolve, reject) => {
        connection_1.default.query(Queries.CheckIfEntryExists, [data.email, data.phoneNumber], (err, res) => {
            if (err)
                reject(err);
            else
                resolve(res);
        });
    });
};
exports.checkIfContactExists = checkIfContactExists;
const makeSecondary = (primaryId, ids) => {
    return new Promise((resolve, reject) => {
        connection_1.default.query(Queries.MakeSecondary, [primaryId, ids], (err, res) => {
            if (err)
                reject(err);
            else
                resolve(res);
        });
    });
};
exports.makeSecondary = makeSecondary;
//# sourceMappingURL=contact.controller.js.map