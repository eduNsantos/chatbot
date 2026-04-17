import type SessionUpdateDto from "../dtos/session-update.dto.js";

export default interface SessionRepositoryContract {
    findById(sessionId: string): Promise<any>;
    findByName(sessionName: string): Promise<any>;
    findAll(): Promise<any[]>;
    create(sessionId: string, creds: any): Promise<any>;
    updateCreds(sessionId: string, creds: any): Promise<void>;
    delete(sessionId: string): Promise<void>;
    update(updateDto: SessionUpdateDto): Promise<void>;
}
