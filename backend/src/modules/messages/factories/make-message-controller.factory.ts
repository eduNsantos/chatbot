import SendMessageUseCase from "../use-cases/send-message.use-case.js";
import MessageController from "../controllers/message.controller.js";
import { makeSessionDependencies } from "../../session/factories/make-session-dependencies.js";


export default function makeMessageController(): MessageController {
    const { whatsappGateway } = makeSessionDependencies();

    const useCase = new SendMessageUseCase(whatsappGateway);

    return new MessageController(useCase);
}
