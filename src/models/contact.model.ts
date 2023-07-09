import { RowDataPacket } from "mysql2"

export interface Contact extends RowDataPacket {
    id: number,
    phoneNumber?: string,
    email?: string,
    linkedId?: number,
    linkPrecedence: "secondary" | "primary",
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date
}

export type ContactInput = {
    email?: string,
    phoneNumber?: string
}

export type ContactResponse = {
    contact: {
        primaryContactId: number,
        emails: string[],
        phoneNumbers: string[],
        secondaryContactIds: number[]
    }
}
