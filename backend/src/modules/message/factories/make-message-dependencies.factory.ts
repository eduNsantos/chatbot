import makeFindOrCreateContactUseCase from "../../contact/factories/make-find-or-create-contact-use-cases.factory.js";
import ContactRepository from "../../contact/infrastructure/respositories/contact.repository.js";
import ContactUpdateUseCase from "../../contact/use-cases/contact-update.use-case.js";
import { makeSessionDependencies } from "../../session/factories/make-session-dependencies.js";
import MessageRepository from "../infrastructure/repositories/message.repository.js";
import CreateMessageUseCase from "../use-cases/create-message.use-case.js";
import ListMessageByContactUseCase from "../use-cases/list-message.use-case.js";
import SendMessageUseCase from "../use-cases/send-message.use-case.js";

export default function makeMessageDependencies() {

    const messageRepository = new MessageRepository();
    const contactRepository = new ContactRepository();

    const { whatsappGateway } = makeSessionDependencies();
    const findOrCreateContactUseCase = makeFindOrCreateContactUseCase();
    const contactUpdateUseCase = new ContactUpdateUseCase(contactRepository);

    const createMessageUseCase = new CreateMessageUseCase(messageRepository, contactUpdateUseCase);
    const sendMessageUseCase = new SendMessageUseCase(whatsappGateway, findOrCreateContactUseCase, createMessageUseCase);
    const listMessageByContactUseCase = new ListMessageByContactUseCase(messageRepository);

    return {
        messageRepository,
        createMessageUseCase,
        sendMessageUseCase,
        listMessageByContactUseCase
    };

}
