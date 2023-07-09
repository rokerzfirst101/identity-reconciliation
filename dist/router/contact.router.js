"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const contactModel = __importStar(require("../controller/contact.controller"));
const helper_1 = require("../helper");
const router = express_1.default.Router();
exports.router = router;
router.post("/identify", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const input = req.body;
    if (!input.email && !input.phoneNumber) {
        res.status(400).send({ error: "Both email and phone number can't be null!" });
        return;
    }
    const sameContacts = yield contactModel.findByEmailOrPhone(input);
    let emailSame = false;
    let phoneNumberSame = false;
    const exists = sameContacts.find(c => {
        if (input.phoneNumber === c.phoneNumber) {
            phoneNumberSame = true;
        }
        if (input.email === c.email) {
            emailSame = true;
        }
        if (input.phoneNumber === c.phoneNumber && input.email === c.email) {
            return true;
        }
        if (phoneNumberSame && !input.email || emailSame && !input.phoneNumber || phoneNumberSame && emailSame) {
            return true;
        }
        return false;
    });
    const primaryContacts = sameContacts.filter(c => c.linkPrecedence === "primary");
    let primaryContact = null;
    if (sameContacts.length > 0) {
        const turnIntoSecondary = [];
        primaryContact = primaryContacts[0];
        if (primaryContacts.length > 1) {
            primaryContacts.splice(1, primaryContacts.length).forEach(c => {
                turnIntoSecondary.push(c.id);
            });
            yield contactModel.makeSecondary(primaryContacts[0].id, turnIntoSecondary);
        }
    }
    let createdContact;
    if (!exists) {
        createdContact = yield contactModel.create(input, primaryContact ? primaryContact.id : null);
        if (primaryContact) {
            sameContacts.push(createdContact);
        }
        else {
            primaryContact = createdContact;
        }
    }
    const emails = [];
    const phoneNumbers = [];
    const secondaryContactIds = [];
    if (primaryContact) {
        emails.push(primaryContact.email);
        phoneNumbers.push(primaryContact.phoneNumber);
    }
    sameContacts.forEach(c => {
        if (c.id !== primaryContacts[0].id) {
            (0, helper_1.pushIfValueNotNullAndNotInArray)(emails, c.email);
            (0, helper_1.pushIfValueNotNullAndNotInArray)(phoneNumbers, c.phoneNumber);
            (0, helper_1.pushIfValueNotNullAndNotInArray)(secondaryContactIds, c.id);
        }
    });
    const resBody = {
        contact: {
            primaryContactId: primaryContact.id,
            emails,
            phoneNumbers,
            secondaryContactIds,
        }
    };
    res.send(resBody);
}));
//# sourceMappingURL=contact.router.js.map