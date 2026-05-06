import type { Contact } from "@prisma/client";
import type { FindOrCreateContactDTO } from "../dtos/find-or-create-contact.dto.js";

export default interface ContactContract {
    findOrCreate(contact: FindOrCreateContactDTO): Promise<Contact>;
    findAllBySessionId(sessionId: string): Promise<Contact[]>;
}
