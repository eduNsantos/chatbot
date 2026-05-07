import makeFindOrCreateContactUseCase from "../../contact/factories/make-find-or-create-contact-use-cases.factory.js";
import MessageRepository from "../../message/infrastructure/repositories/message.repository.js";
import CreateMessageUseCase from "../../message/use-cases/create-message.use-case.js";
import BaileysWhatsappGateway from "../infrastructure/gateway/baileys-whatsapp.gateway.js";
import { BaileysSessionKeyRepository } from "../infrastructure/repositories/baileys-session-key.repository.js";
import BaileysSessionRepository from "../infrastructure/repositories/baileys-session.repository.js";

let cached: any = null;

export function makeSessionDependencies(): {
  sessionRepository: BaileysSessionRepository;
  sessionKeyRepository: BaileysSessionKeyRepository;
  whatsappGateway: BaileysWhatsappGateway;
} {
  if (cached) return cached;
  const findOrCreateContactUseCase = makeFindOrCreateContactUseCase();
  const messageRepository = new MessageRepository();
  const createMessageUseCase = new CreateMessageUseCase(messageRepository);

  const sessionRepository = new BaileysSessionRepository();
  const sessionKeyRepository = new BaileysSessionKeyRepository();
  const whatsappGateway = new BaileysWhatsappGateway(
    findOrCreateContactUseCase,
    createMessageUseCase
  );

  cached = {
    sessionRepository,
    sessionKeyRepository,
    whatsappGateway
  };

  return cached;
}
