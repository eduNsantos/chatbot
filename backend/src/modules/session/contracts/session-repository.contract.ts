import type SessionUpdateDto from "../dtos/session-update.dto.js";

export default interface SessionRepositoryContract {
    findByName(sessionName: string): Promise<any>;
    findAll(): Promise<any[]>;
    findById(id: string): Promise<any>;
    create(sessionName: string, creds: any): Promise<any>;
    updateCreds(sessionId: string, creds: any): Promise<void>;
    delete(sessionId: string): Promise<void>;
    update(updateDto: SessionUpdateDto): Promise<void>;
}
