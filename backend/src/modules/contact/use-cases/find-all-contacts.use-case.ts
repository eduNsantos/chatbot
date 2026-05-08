import type { ContactEntity } from "../entities/contact.entity.js";
import type ContactRepository from "../infrastructure/respositories/contact.repository.js";

export default class FindAllContactsUseCase {
  constructor(private contactRepository: ContactRepository) {}

  async execute(sessionId: string): Promise<ContactEntity[]> {
    return this.contactRepository.findAllBySessionId(sessionId);
  }
}
