export default interface SessionKeyRepositoryContract {
    get(sessionId: string, type: string, ids: string[]): Promise<Record<string, any>>;
    set(sessionId: string, data: Record<string, Record<string, any>>): Promise<void>;
    deleteBySession(sessionId: string): Promise<void>;
}
