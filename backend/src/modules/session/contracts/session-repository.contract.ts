import type { SessionEntity } from "../entities/session.entity.js";
import type SessionUpdateDto from "../dtos/session-update.dto.js";

export default interface SessionRepositoryContract {
    findById(sessionId: string): Promise<SessionEntity | null>;
    findByName(sessionName: string): Promise<SessionEntity | null>;
    findAll(): Promise<SessionEntity[]>;
    create(sessionId: string, creds: unknown): Promise<SessionEntity>;
    updateCreds(sessionId: string, creds: unknown): Promise<void>;
    delete(sessionId: string): Promise<void>;
    update(updateDto: SessionUpdateDto): Promise<void>;
}
