import SendMessageUseCase from "../use-cases/send-message.use-case.js";
import MessageController from "../controllers/message.controller.js";
import { makeSessionDependencies } from "../../session/factories/make-session-dependencies.js";
import makeFindOrCreateContactUseCase from "../../contact/factories/make-find-or-create-contact-use-cases.factory.js";
import MessageRepository from "../infrastructure/repositories/message.repository.js";
import CreateMessageUseCase from "../use-cases/create-message.use-case.js";
import ListMessageByContactUseCase from "../use-cases/list-message.use-case.js";


export default function makeMessageController(): MessageController {
    const { whatsappGateway } = makeSessionDependencies();
    const findOrCreateContactUseCase = makeFindOrCreateContactUseCase();
    const messageRepository = new MessageRepository();
    const createMessageUseCase = new CreateMessageUseCase(messageRepository);

    const sendMessageUseCase = new SendMessageUseCase(whatsappGateway, findOrCreateContactUseCase, createMessageUseCase);

    const listMessageByContactUseCase = new ListMessageByContactUseCase(messageRepository);

    return new MessageController(
        sendMessageUseCase,
        listMessageByContactUseCase
    );
}
