export default interface WhatsappGatewayContract {

    createSession(sessionName: string): Promise<void>;
    sendMessage(to: string, message: string): Promise<void>;
}
