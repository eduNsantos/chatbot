import type { FastifyReply } from "fastify";
import type { FindAllContactsRequest } from "../@types/contact.types.js";
import type FindAllContactsUseCase from "../use-cases/find-all-contacts.use-case.js";
import type FindOrCreateContactUseCase from "../use-cases/find-or-create-contact.use-case.js";

export default class ContactController {
    constructor(
        private findOrCreateContactUseCase: FindOrCreateContactUseCase,
        private findAllContactsUseCase: FindAllContactsUseCase
    ) { }

    async findAll(req: FindAllContactsRequest, res: FastifyReply) {
        try {
            const { sessionId } = req.params;

            if (!sessionId) {
                return res.status(400).send({ error: 'Missing session ID' });
            }

            const contacts = await this.findAllContactsUseCase.execute(sessionId);

            return res.status(200).send(contacts);
        } catch (error) {
            return res.status(500).send({ error: 'Failed to fetch contacts' });
        }
    }

    async findOrCreate(req: any, res: FastifyReply) {
        try {
            const contact = await this.findOrCreateContactUseCase.execute(req.body);
            return res.status(200).send(contact);
        } catch (error) {
            return res.status(500).send({ error: 'Failed to find or create contact' });
        }
    }
}