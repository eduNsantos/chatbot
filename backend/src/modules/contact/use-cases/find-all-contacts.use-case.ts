import type { Contact } from "@prisma/client";
import type ContactRepository from "../infrastructure/respositories/contact.repository.js";

export default class FindAllContactsUseCase {
  constructor(private contactRepository: ContactRepository) {}

  async execute(sessionId: string): Promise<Contact[]> {
    return this.contactRepository.findAllBySessionId(sessionId);
  }
}
