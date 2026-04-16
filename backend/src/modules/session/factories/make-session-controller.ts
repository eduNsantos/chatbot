import SessionController from "../controlllers/session.controller.js";
import BaileysSessionRepository from "../infrastructure/external/baileys/baileys-session.repository.js";
import SessionsListUseCase from "../use-cases/sessions-list.use-case.js";

export default class MakeSessionControllerFactory {
    static create(): SessionController {

        const sessionRepository = new BaileysSessionRepository();
        const useCase = new SessionsListUseCase(sessionRepository);
        const sessionController = new SessionController(useCase);

        return sessionController;
    }

}