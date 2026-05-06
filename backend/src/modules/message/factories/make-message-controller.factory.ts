import SendMessageUseCase from "../use-cases/send-message.use-case.js";
import MessageController from "../controllers/message.controller.js";
import { makeSessionDependencies } from "../../session/factories/make-session-dependencies.js";
import makeFindOrCreateContactUseCase from "../../contact/factories/make-find-or-create-contact-use-cases.factory.js";
import MessageRepository from "../routes/message.repository.js";
import CreateMessageUseCase from "../use-cases/create-message.use-case.js";


export default function makeMessageController(): MessageController {
    const { whatsappGateway } = makeSessionDependencies();
    const findOrCreateContactUseCase = makeFindOrCreateContactUseCase();
    const createMessageUseCase = new CreateMessageUseCase(new MessageRepository());

    const useCase = new SendMessageUseCase(whatsappGateway, findOrCreateContactUseCase, createMessageUseCase);

    return new MessageController(useCase);
}
