import type CreateSessionDto from "../dtos/create-session.dto.js";
import type { SessionEntity } from "../entities/session.entity.js";
import type SessionRepositoryContract from "../contracts/session-repository.contract.js";

export default class CreateSessionUseCase {
    constructor(private sessionRepository: SessionRepositoryContract) {}

    async execute(createSessionDto: CreateSessionDto): Promise<SessionEntity> {

        if (!createSessionDto.sessionName || typeof createSessionDto.sessionName !== 'string') {
            throw new Error('Invalid session name');
        }

        const session = await this.sessionRepository.create(createSessionDto.sessionName, null);

        return session;
    }
}
