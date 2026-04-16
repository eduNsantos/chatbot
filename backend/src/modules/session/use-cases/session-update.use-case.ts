import type SessionContract from "../contracts/session-repository.contract.js";
import type SessionUpdateDto from "../dtos/session-update.dto.js";

export default class SessionUpdateUseCase {
    constructor(private sessionRepository: SessionContract) {}

    async execute(updateDto: SessionUpdateDto) {
        const sessions = await this.sessionRepository.update(updateDto);

        return sessions;
    }

}