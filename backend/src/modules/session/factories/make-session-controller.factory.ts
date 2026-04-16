import SessionController from "../controlllers/session.controller.js";
import SessionsListUseCase from "../use-cases/sessions-list.use-case.js";
import { makeSessionDependencies } from "./make-session-dependencies.js";

export function makeSessionController() {
    const { sessionRepository } = makeSessionDependencies();

    const sessionListUseCase = new SessionsListUseCase(sessionRepository)

    const sessionController = new SessionController(
        sessionListUseCase
    );

    return sessionController;
}
