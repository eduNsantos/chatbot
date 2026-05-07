import makeFindOrCreateContactUseCase from "../../contact/factories/make-find-or-create-contact-use-cases.factory.js";
import { makeSessionDependencies } from "../../session/factories/make-session-dependencies.js";
import MessageRepository from "../infrastructure/repositories/message.repository.js";
import CreateMessageUseCase from "../use-cases/create-message.use-case.js";
import ListMessageByContactUseCase from "../use-cases/list-message.use-case.js";
import SendMessageUseCase from "../use-cases/send-message.use-case.js";

export default function makeMessageDependencies() {

    const messageRepository = new MessageRepository();

    const { whatsappGateway } = makeSessionDependencies();
    const findOrCreateContactUseCase = makeFindOrCreateContactUseCase();

    const createMessageUseCase = new CreateMessageUseCase(messageRepository, findOrCreateContactUseCase);
    const sendMessageUseCase = new SendMessageUseCase(whatsappGateway, findOrCreateContactUseCase, createMessageUseCase);
    const listMessageByContactUseCase = new ListMessageByContactUseCase(messageRepository);

    return {
        messageRepository,
        createMessageUseCase,
        sendMessageUseCase,
        listMessageByContactUseCase
    };

}
