export default interface SessionRepositoryContract {
    findByName(sessionName: string): Promise<any>;
    findAll(): Promise<any[]>;
    findById(id: string): Promise<any>;
    create(sessionName: string, creds: any): Promise<any>;
    updateCreds(sessionId: string, creds: any): Promise<void>;
    delete(sessionId: string): Promise<void>;
}
