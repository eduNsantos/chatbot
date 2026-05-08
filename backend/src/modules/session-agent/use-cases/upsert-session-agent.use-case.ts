import type SessionAgentContract from "../contracts/session-agent.contract.js";
import type { SessionAgentUpsertDto } from "../dtos/session-agent-upsert.dto.js";
import type { SessionAgentEntity } from "../entities/session-agent.entity.js";

export default class UpsertSessionAgentUseCase {
    constructor(
        private sessionAgentRepository: SessionAgentContract // Replace with actual repository contract when available
    ) {}

    public async execute(dto: SessionAgentUpsertDto): Promise<SessionAgentEntity> {
        const sessionAgent = await this.sessionAgentRepository.upsert(dto);

        return sessionAgent;
    }

}
