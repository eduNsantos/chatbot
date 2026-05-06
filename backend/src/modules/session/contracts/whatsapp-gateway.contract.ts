import type { FindOrCreateContactDTO } from "../../contact/dtos/find-or-create-contact.dto.js";
// import type ContactEntity from "../../contact/entity/contact.entity.js";

export default interface WhatsappGatewayContract {

    createSession(sessionId: string): Promise<void>;
    sendMessage(sessionId: string, to: string, type: 'person' | 'group', message: string): Promise<{ messageKey: string }>;
    // createContact(contact: FindOrCreateContactDTO): Promise<ContactEntity>;
    // onMessageReceived(contactIdentification: string, contactNumber: string, message: any): void;
}
