import type ContactContract from "../contracts/contact-repository.contract.js";
import type { UpdateContactDTO } from "../dtos/update-contact.dto.js";

export default class ContactUpdateUseCase {
    constructor(
        private contactRepository: ContactContract
    ) {}

    async execute(contactDto: UpdateContactDTO): Promise<void> {

        if (contactDto.name !== undefined) {
            updateData.name = contactDto.name;
        }
        if (contactDto.pictureUrl !== undefined) {
            updateData.pictureUrl = contactDto.pictureUrl;
        }
        if (contactDto.lastMessageAt !== undefined) {
            updateData.lastMessageAt = contactDto.lastMessageAt;
        }

        await this.contactRepository.updateContact({
            id: contactDto.id
        });
    }

}