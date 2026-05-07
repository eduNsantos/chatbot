import makeWASocket, {
  DisconnectReason,
  fetchLatestBaileysVersion,
  type WAMessage,
  type WASocket
} from "@whiskeysockets/baileys";

import qrcode from 'qrcode-terminal';
import { usePrismaAuth } from "./helpers/use-prisma-auth.helper.js";
import type WhatsappGatewayContract from "../../contracts/whatsapp-gateway.contract.js";
import type { BaileysWhatsappGatewayUpsertMessage } from "./@types/baileys-whatsapp-gateway.js";
import FindOrCreateContactUseCase from "../../../contact/use-cases/find-or-create-contact.use-case.js";
import CreateMessageUseCase from "../../../message/use-cases/create-message.use-case.js";
import { safeJSONStringify } from "../../../../shared/utils/safe-json-stringify.js";


interface ExtendedWASocket extends WASocket {
  id: string;
  isConnected?: boolean;
}

export default class BaileysWhatsappGateway implements WhatsappGatewayContract {

  private sockets: ExtendedWASocket[] = [];

  constructor(
    private findOrCreateContactUseCase: FindOrCreateContactUseCase,
    private createMessageUseCase: CreateMessageUseCase
  ) {}


  async onMessageReceived(sessionId: string, event: BaileysWhatsappGatewayUpsertMessage): Promise<void> {
    const message = event.messages?.[0] as WAMessage | undefined;

    if (!message?.message) return;

    const from = message.key.remoteJid || '';
    const whatsappNumber = from.split('@')[0]?.toString() || '';

    if (!from || !whatsappNumber) return;

    const isGroup = from.endsWith('@g.us');

    if (isGroup) {
      console.log('Mensagem recebida em grupo, ignorando...');
      return;
    }

    const me = message.key.fromMe;

    const name = message.key.participant || message.pushName || '';

    const contact = await this.findOrCreateContactUseCase.execute({
      whatsappId: from,
      name,
      sessionId,
      whatsappNumber
    });

    const text =
      message.message.conversation ||
      message.message.extendedTextMessage?.text;

    if (!text) return;

    const key = message.key.id;

    console.log(message)

    if (!key) return;

    const parsedType = Object.keys(message.message)[0] || event.type;

    await this.createMessageUseCase.execute({
      contactId: contact.id,
      sessionId,
      type: parsedType,
      message: text,
      rawPayloadJson: safeJSONStringify(message),
      isGroup,
      key,
      fromMe: me ? true : false
    });
  }

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

    socket.id = sessionId;

    socket.ev.on('creds.update', saveCreds);

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

    socket.ev.on('messages.upsert', ev => {
      void this.onMessageReceived(socket.id, ev);
    });


    this.sockets.push(socket);

  }

  public async sendMessage(sessionId: string, to: string, type: 'person' | 'group', message: string): Promise<{ messageKey: string }> {
    const socket = this.sockets.find(s => s.id === sessionId);

    if (!socket || !socket.isConnected) {
      throw new Error('SOCKET_NOT_CONNECTED');
    }

    const result = await socket.sendMessage(to, { text: message });
    const messageKey = result?.key?.id;

    console.log(result)

    if (!messageKey) {
      throw new Error('MESSAGE_KEY_NOT_FOUND');
    }

    return { messageKey };
  }
}