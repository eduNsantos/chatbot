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

  const sessionRepository = new BaileysSessionRepository();
  const sessionKeyRepository = new BaileysSessionKeyRepository();
  const whatsappGateway = new BaileysWhatsappGateway();

  cached = {
    sessionRepository,
    sessionKeyRepository,
    whatsappGateway
  };

  return cached;
}
