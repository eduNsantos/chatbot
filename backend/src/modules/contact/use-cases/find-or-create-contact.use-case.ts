import type { Contact } from "@prisma/client";
import type { FindOrCreateContactDTO } from "../dtos/find-or-create-contact.dto.js";
import type ContactRepository from "../infrastructure/respositories/contact.repository.js";

export default class FindOrCreateContactUseCase {

    constructor(
        private contactRepository: ContactRepository
    ) { }

    async execute(contactDto: FindOrCreateContactDTO): Promise<Contact> {
        return await this.contactRepository.findOrCreate(contactDto);
    }
}