import { prisma } from "../../../../database/prisma.js";
import type SessionAgentContract from "../../contracts/session-agent.contract.js";
import type { SessionAgentUpsertDto } from "../../dtos/session-agent-upsert.dto.js";
import type { SessionAgentEntity } from "../../entities/session-agent.entity.js";

export default class SessionAgentRepository implements SessionAgentContract {
    public async upsert(dto: SessionAgentUpsertDto): Promise<SessionAgentEntity> {

        const sessionAgent = await prisma.sessionAgent.upsert({
            where: {
                sessionId_name: {
                    sessionId: dto.sessionId,
                    name: dto.name
                }
            },
            update: {
                name: dto.name,
                config: dto.config
            },
            create: {
                sessionId: dto.sessionId,
                name: dto.name,
                config: dto.config
            }
        });

        return sessionAgent;
    }


    public async findBySessionId(sessionId: string): Promise<SessionAgentEntity> {
        const sessionAgent = await prisma.sessionAgent.findFirst({
            where: {
                sessionId
            }
        });

        if (!sessionAgent) {
            throw new Error(`Session agent not found for sessionId: ${sessionId}`);
        }

        return sessionAgent;
    }

}
