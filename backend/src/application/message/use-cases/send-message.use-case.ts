import type SocketContract from "../../../domain/socket/socket.contract.js";

export default class SendMessageUseCase {
    constructor(private socketRepository: SocketContract) {
        this.socketRepository = socketRepository;
    }

    async execute(to: string, message: string) {
        // Lógica para enviar a mensagem usando Baileys ou outra biblioteca
        console.log(`Enviando mensagem para ${to}: ${message}`);

        this.socketRepository.sendMessage(to, message);
        // Simulação de envio de mensagem
        return { success: true, to, message };
    }
}