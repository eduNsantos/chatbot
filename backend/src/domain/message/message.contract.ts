export default interface MessageContract {
    sendMessage(to: string, message: string): Promise<{ success: boolean, to: string, message: string }>;
}