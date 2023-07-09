import express, { Request, Response } from 'express';
import { Contact, ContactInput, ContactResponse } from "../models/contact.model";
import * as contactModel from '../controller/contact.controller';
import { pushIfValueNotNullAndNotInArray } from '../helper';

const router = express.Router();

router.post("/identify", async (req: Request, res: Response) => {
    const input: ContactInput = req.body

    if (!input.email && !input.phoneNumber) {
        res.status(400).send({error: "Both email and phone number can't be null!"})

        return
    }

    const sameContacts = await contactModel.findByEmailOrPhone(input)

    let emailSame = false
    let phoneNumberSame = false

    const exists = sameContacts.find(c => {
        if (input.phoneNumber === c.phoneNumber) {
            phoneNumberSame = true
        }

        if (input.email === c.email) {
            emailSame = true
        }

        if (input.phoneNumber === c.phoneNumber && input.email === c.email) {
            return true
        }

        if (phoneNumberSame && !input.email || emailSame && !input.phoneNumber || phoneNumberSame && emailSame) {
            return true
        }

        return false
    })

    const primaryContacts = sameContacts.filter(c => c.linkPrecedence === "primary")


    let primaryContact = null

    if (sameContacts.length > 0) {
        const turnIntoSecondary: number[] = []

        primaryContact = primaryContacts[0]

        if (primaryContacts.length > 1) {
            primaryContacts.splice(1, primaryContacts.length).forEach(c => {
                turnIntoSecondary.push(c.id)
            })

            await contactModel.makeSecondary(primaryContacts[0].id, turnIntoSecondary)
        }
    }

    let createdContact: Contact

    if (!exists) {
        createdContact = await contactModel.create(input, primaryContact ? primaryContact.id : null)

        if (primaryContact) {
            sameContacts.push(createdContact)
        } else {
            primaryContact = createdContact
        }
    }

    const emails: string[] = []
    const phoneNumbers: string[] = []
    const secondaryContactIds: number[] = []

    if (primaryContact) {
        emails.push(primaryContact.email)
        phoneNumbers.push(primaryContact.phoneNumber)
    }

    sameContacts.forEach(c => {
        if (c.id !== primaryContacts[0].id) {
            pushIfValueNotNullAndNotInArray(emails, c.email)
            pushIfValueNotNullAndNotInArray(phoneNumbers, c.phoneNumber)
            pushIfValueNotNullAndNotInArray(secondaryContactIds, c.id)
        }
    })

    const resBody: ContactResponse = {
        contact: {
            primaryContactId: primaryContact.id,
            emails,
            phoneNumbers,
            secondaryContactIds,
        }
    }

    res.send(resBody)
});



export {router}