import makeWASocket, {
  DisconnectReason,
  fetchLatestBaileysVersion,
  type WASocket
} from "@whiskeysockets/baileys";

import qrcode from 'qrcode-terminal';
import { usePrismaAuth } from "./helpers/use-prisma-auth.helper.js";

export default class BaileysRepository implements SocketContract {

  private socket: WASocket | null = null;
  private isConnected = false;

  public async initSession(): Promise<void> {

    if (this.socket) {
      return;
    }

    const { state, saveCreds } = await usePrismaAuth("default-session");

    const { version } = await fetchLatestBaileysVersion();

    this.socket = makeWASocket({
      version,
      auth: state
    });

    // 🔥 persistência
    this.socket.ev.on('creds.update', saveCreds);

    // 🔥 conexão
    this.socket.ev.on('connection.update', async (update: any) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {

        qrcode.generate(qr, { small: true });
        console.log('📲 QR Code gerado');
      }

      if (connection === 'open') {
        this.isConnected = true;
        console.log('✅ Conectado ao WhatsApp');
      }

      if (connection === 'close') {
        this.isConnected = false;

        const statusCode = (lastDisconnect?.error as any)?.output?.statusCode;

        const shouldReconnect =
          statusCode !== DisconnectReason.loggedOut;

        console.log('❌ Conexão fechada:', statusCode);

        if (shouldReconnect) {
          console.log('🔄 Reconectando...');
          this.socket = null;
          await this.initSession();
        } else {
          console.log('🚪 Sessão desconectada (logout)');
        }
      }
    });

    // 🔥 mensagens recebidas
    this.socket.ev.on('messages.upsert', async (msg: any) => {
      const message = msg.messages?.[0];

      if (!message?.message) return;

      const from = message.key.remoteJid;

      const text =
        message.message.conversation ||
        message.message.extendedTextMessage?.text;

      console.log(`📩 ${from}: ${text}`);
    });
  }

  // 🚀 enviar mensagem
  public async sendMessage(to: string, text: string) {
    if (!this.socket || !this.isConnected) {
      throw new Error('Socket não conectado');
    }

    await this.socket.sendMessage(to, { text });
  }
}