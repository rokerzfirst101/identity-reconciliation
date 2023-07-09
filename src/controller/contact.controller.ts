import mysql, { OkPacket } from 'mysql2';
import { ContactInput } from '../models/contact.model';
import { Contact } from '../models/contact.model';
import db from '../db/connection'

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
}

export const getById = (id: number): Promise<Contact> => {
    return new Promise<Contact>((resolve, reject) => {
        db.query<Contact[]>(
            Queries.GetById,
            [id],
            (err, res) => {
                if (err) reject(err)
                else resolve(res?.[0])
            }
        )
    })
}

export const findByEmailOrPhone = (data: ContactInput): Promise<Contact[]> => {
    return new Promise<Contact[]>((resolve, reject) => {
        db.query<Contact[]>(
            Queries.FindByEmailOrPhone,
            [data.email, data.phoneNumber, data.email, data.phoneNumber,
                data.email, data.phoneNumber],
            (err, res) => {
                if (err) reject(err)
                else resolve(res)
            }
        )
    })
}

export const create = (data: ContactInput, linkedId?: number): Promise<Contact> => {
    return new Promise<Contact>((resolve, reject) => {
        db.query<OkPacket>(
            Queries.Insert,
            [data.email, data.phoneNumber, linkedId, linkedId ? "secondary" : "primary"],
            (err, res) => {
                if (err) reject(err)
                else getById(res.insertId)
                    .then(getByIdRes => resolve(getByIdRes))
                    .catch(getByIdErr => reject(err))
            }
        )
    })
}

export const update = (contactId: number, updatedContact: Contact): Promise<Contact> => {
    return new Promise<Contact>((resolve, reject) => {
        db.query<OkPacket>(
            Queries.Update,
            [updatedContact.phoneNumber, updatedContact.email, updatedContact.linkedId,
                updatedContact.linkPrecedence, contactId],
            (err, res) => {
                if (err) reject(err)
                else if (res.affectedRows > 0) {
                    getById(contactId)
                        .then(getByIdRes => resolve(getByIdRes))
                        .catch(getByIdErr => reject(getByIdErr))
                }
            }
        )
    })
}


export const checkIfContactExists = (data: ContactInput) => {
    return new Promise<Contact[]>((resolve, reject) => {
        db.query<Contact[]>(
            Queries.CheckIfEntryExists,
            [data.email, data.phoneNumber],
            (err, res) => {
                if (err) reject(err)
                else resolve(res)
            }
        )
    })
}

export const makeSecondary = (primaryId: number, ids: number[]) => {
    return new Promise<OkPacket>((resolve, reject) => {
        db.query<OkPacket>(
            Queries.MakeSecondary,
            [primaryId, ids],
            (err, res) => {
                if (err) reject(err)
                else resolve(res)
            }
        )
    })
}