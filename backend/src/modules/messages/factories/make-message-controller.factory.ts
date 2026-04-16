import SendMessageUseCase from "../use-cases/send-message.use-case.js";
import MessageController from "../controllers/message.controller.js";
import { socketRepository } from "../../../server.js";

export default class MakeMessageControllerFactory {
  static create() {
    const useCase = new SendMessageUseCase(socketRepository);
    return new MessageController(useCase);
  }
}
