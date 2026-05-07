import MessageController from "../controllers/message.controller.js";
import makeMessageDependencies from "./make-message-dependencies.factory.js";


export default function makeMessageController(): MessageController {

    const { sendMessageUseCase, listMessageByContactUseCase } = makeMessageDependencies()

    return new MessageController(
        sendMessageUseCase,
        listMessageByContactUseCase
    );
}
