import type { SessionAgentUpsertDto } from "../dtos/session-agent-upsert.dto.js";
import type { SessionAgentEntity } from "../entities/session-agent.entity.js";

export default interface SessionAgentContract {
    upsert(dto: SessionAgentUpsertDto): Promise<SessionAgentEntity>;
    findBySessionId(sessionId: string): Promise<SessionAgentEntity>;
}