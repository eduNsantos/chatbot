import makeWASocket, {
  DisconnectReason,
  fetchLatestBaileysVersion,
  type WASocket
} from "@whiskeysockets/baileys";

import qrcode from 'qrcode-terminal';
import { usePrismaAuth } from "./helpers/use-prisma-auth.helper.js";
import type WhatsappGatewayContract from "../../contracts/whatsapp-gateway.contract.js";


interface ExtendedWASocket extends WASocket {
  id: string;
  isConnected?: boolean;
}

export default class BaileysWhatsappGateway implements WhatsappGatewayContract {

  private sockets: ExtendedWASocket[] = [];

  public async createSession(sessionId: string): Promise<void> {

    if (this.sockets.find(s => s.id === sessionId)) {
      return;
    }

    const { state, saveCreds } = await usePrismaAuth(sessionId);

    const { version } = await fetchLatestBaileysVersion();

    const socket = makeWASocket({
      version,
      auth: state
    }) as ExtendedWASocket;

    // 🔥 persistência
    socket.ev.on('creds.update', saveCreds);

    // 🔥 conexão
    socket.ev.on('connection.update', async (update: any) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {

        qrcode.generate(qr, { small: true });
        console.log('📲 QR Code gerado');
      }

      if (connection === 'open') {
        socket.isConnected = true;
        console.log('✅ Conectado ao WhatsApp');
      }

      if (connection === 'close') {
        socket.isConnected = false;

        const statusCode = (lastDisconnect?.error as any)?.output?.statusCode;

        const shouldReconnect =
          statusCode !== DisconnectReason.loggedOut;

        console.log('❌ Conexão fechada:', statusCode);

        if (shouldReconnect) {
          console.log('🔄 Reconectando...');
          this.sockets = this.sockets.filter(s => s.id !== sessionId);
          await this.createSession(sessionId);
        } else {
          console.log('🚪 Sessão desconectada (logout)');
        }
      }
    });

    socket.ev.on('messages.upsert', async (msg: any) => {
      const message = msg.messages?.[0];

      if (!message?.message) return;

      const from = message.key.remoteJid;

      const text =
        message.message.conversation ||
        message.message.extendedTextMessage?.text;

      console.log(`📩 ${from}: ${text}`);
    });

    socket.id = sessionId;
    this.sockets.push(socket);

  }

  // 🚀 enviar mensagem
  public async sendMessage(sessionId: string, to: string, type: 'person' | 'group', message: string) {
    const socket = this.sockets.find(s => s.id === sessionId);

    console.log(this.sockets, socket, sessionId)

    if (!socket || !socket.isConnected) {
      throw new Error('SOCKET_NOT_CONNECTED');
    }

    await socket.sendMessage(to, { text: message });
  }
}