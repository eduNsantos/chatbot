import type SessionContract from "../contracts/session.contract.js";

export default class SessionsListUseCase {
    constructor(private sessionRepository: SessionContract) {}

    async execute() {
        const sessions = await this.sessionRepository.findAll();

        return sessions;
    }

}