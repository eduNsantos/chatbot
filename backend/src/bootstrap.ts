import ContactRepository from "./modules/contact/infrastructure/respositories/contact.repository.js";
import FindAllContactsUseCase from "./modules/contact/use-cases/find-all-contacts.use-case.js";
import FindOrCreateContactUseCase from "./modules/contact/use-cases/find-or-create-contact.use-case.js";
import ContactUpdateUseCase from "./modules/contact/use-cases/contact-update.use-case.js";
import ContactController from "./modules/contact/controllers/contact.controller.js";

import MessageRepository from "./modules/message/infrastructure/repositories/message.repository.js";
import CreateMessageUseCase from "./modules/message/use-cases/create-message.use-case.js";
import ListMessageByContactUseCase from "./modules/message/use-cases/list-message.use-case.js";
import SendMessageUseCase from "./modules/message/use-cases/send-message.use-case.js";
import MessageController from "./modules/message/controllers/message.controller.js";

import BaileysSessionRepository from "./modules/session/infrastructure/repositories/baileys-session.repository.js";
import { BaileysSessionKeyRepository } from "./modules/session/infrastructure/repositories/baileys-session-key.repository.js";
import BaileysWhatsappGateway from "./modules/session/infrastructure/gateway/baileys-whatsapp.gateway.js";
import CreateSessionUseCase from "./modules/session/use-cases/create-session.use-case.js";
import SessionsListUseCase from "./modules/session/use-cases/sessions-list.use-case.js";
import SessionUpdateUseCase from "./modules/session/use-cases/session-update.use-case.js";
import SessionController from "./modules/session/controlllers/session.controller.js";

export interface AppDependencies {
    controllers: {
        sessionController: SessionController;
        contactController: ContactController;
        messageController: MessageController;
    };
    whatsappGateway: BaileysWhatsappGateway;
    sessionRepository: BaileysSessionRepository;
    createSessionUseCase: CreateSessionUseCase;
}

export function bootstrap(): AppDependencies {
    // 1. Repositórios
    const contactRepository = new ContactRepository();
    const messageRepository = new MessageRepository();
    const sessionRepository = new BaileysSessionRepository();
    new BaileysSessionKeyRepository(); // instanciado para efeitos colaterais de inicialização

    // 2. Use cases de contact
    const findOrCreateContactUseCase = new FindOrCreateContactUseCase(contactRepository);
    const findAllContactsUseCase = new FindAllContactsUseCase(contactRepository);
    const contactUpdateUseCase = new ContactUpdateUseCase(contactRepository);

    // 3. Use cases de message (dependem de contact)
    const createMessageUseCase = new CreateMessageUseCase(messageRepository, contactUpdateUseCase);
    const listMessageByContactUseCase = new ListMessageByContactUseCase(messageRepository);

    // 4. Gateway (depende de contact + message)
    const whatsappGateway = new BaileysWhatsappGateway(findOrCreateContactUseCase, createMessageUseCase);

    // 5. Use cases de message que dependem do gateway
    const sendMessageUseCase = new SendMessageUseCase(whatsappGateway, findOrCreateContactUseCase, createMessageUseCase);

    // 6. Use cases de session
    const createSessionUseCase = new CreateSessionUseCase(sessionRepository);
    const sessionsListUseCase = new SessionsListUseCase(sessionRepository);
    const sessionUpdateUseCase = new SessionUpdateUseCase(sessionRepository);

    // 7. Controllers
    const contactController = new ContactController(findOrCreateContactUseCase, findAllContactsUseCase);
    const messageController = new MessageController(sendMessageUseCase, listMessageByContactUseCase);
    const sessionController = new SessionController(sessionsListUseCase, sessionUpdateUseCase);

    return {
        controllers: { sessionController, contactController, messageController },
        whatsappGateway,
        sessionRepository,
        createSessionUseCase,
    };
}
