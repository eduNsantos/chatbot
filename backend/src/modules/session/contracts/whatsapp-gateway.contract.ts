export default interface WhatsappGatewayContract {

    createSession(sessionId: string): Promise<void>;
    sendMessage(sessionId: string, to: string, type: 'person' | 'group', message: string): Promise<void>;
}
