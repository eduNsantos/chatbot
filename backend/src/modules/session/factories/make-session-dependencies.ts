import makeFindOrCreateContactUseCase from "../../contact/factories/make-find-or-create-contact-use-cases.factory.js";
import makeMessageDependencies from "../../message/factories/make-message-dependencies.factory.js";
import MessageRepository from "../../message/infrastructure/repositories/message.repository.js";
import CreateMessageUseCase from "../../message/use-cases/create-message.use-case.js";
import BaileysWhatsappGateway from "../infrastructure/gateway/baileys-whatsapp.gateway.js";
import { BaileysSessionKeyRepository } from "../infrastructure/repositories/baileys-session-key.repository.js";
import BaileysSessionRepository from "../infrastructure/repositories/baileys-session.repository.js";
import CreateSessionUseCase from "../use-cases/create-session.use-case.js";

let cached: any = null;

export function makeSessionDependencies(): {
  sessionRepository: BaileysSessionRepository;
  sessionKeyRepository: BaileysSessionKeyRepository;
  whatsappGateway: BaileysWhatsappGateway;
  createSessionUseCase: CreateSessionUseCase;
} {
  if (cached) return cached;
  const findOrCreateContactUseCase = makeFindOrCreateContactUseCase();

  const {
    createMessageUseCase
  } = makeMessageDependencies()

  const sessionRepository = new BaileysSessionRepository();
  const sessionKeyRepository = new BaileysSessionKeyRepository();
  const whatsappGateway = new BaileysWhatsappGateway(
    findOrCreateContactUseCase,
    createMessageUseCase
  );

  const createSessionUseCase = new CreateSessionUseCase(sessionRepository);

  cached = {
    sessionRepository,
    sessionKeyRepository,
    whatsappGateway,
    createSessionUseCase
  };

  return cached;
}
