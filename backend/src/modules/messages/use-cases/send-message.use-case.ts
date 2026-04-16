import type WhatsappGatewayContract from "../../session/contracts/whatsapp-gateway.contract.js";

export default class SendMessageUseCase {
    constructor(private whatsappGateway: WhatsappGatewayContract) {}

    async execute(to: string, message: string) {
        await this.whatsappGateway.sendMessage(to, message);
        // Simulação de envio de mensagem
        return { success: true, to, message };
    }
}