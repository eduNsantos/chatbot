import type ChatContract from "../../../domain/socket/socket.contract.js";
import makeWASocket, { Browsers, useMultiFileAuthState } from '@whiskeysockets/baileys'

class InitChatUseCase {
    constructor(private chatContract: ChatContract) {
        this.chatContract = chatContract;
    }


    async execute() {
        this.chatContract.initSession();
    }
}

export default InitChatUseCase;
