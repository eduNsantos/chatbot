import type { ContactEntity } from "../entities/contact.entity.js";
import type { FindOrCreateContactDTO } from "../dtos/find-or-create-contact.dto.js";
import type { UpdateContactDTO } from "../dtos/update-contact.dto.js";

export default interface ContactRepositoryContract {
    findOrCreate(contact: FindOrCreateContactDTO): Promise<ContactEntity>;
    findAllBySessionId(sessionId: string): Promise<ContactEntity[]>;
    findById(id: number): Promise<ContactEntity | null>;
    updateContact(contactDto: UpdateContactDTO): Promise<ContactEntity>;
}
