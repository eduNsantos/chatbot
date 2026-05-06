import type { Contact } from '@prisma/client';
import { prisma } from '../../../../database/prisma.js';
import type ContactContract from '../../contracts/contact.contract.js';
import type { FindOrCreateContactDTO } from '../../dtos/find-or-create-contact.dto.js';

export default class ContactRepository implements ContactContract {
    async findAllBySessionId(sessionId: string): Promise<Contact[]> {
        const contacts = await prisma.contact.findMany({
            where: { sessionId },
            orderBy: { id: 'desc' }
        });

        return contacts;
    }

    async findOrCreate(contact: FindOrCreateContactDTO): Promise<Contact> {
        const result = await prisma.contact.upsert({
            where: {
                sessionId_whatsappId: {
                    sessionId: contact.sessionId,
                    whatsappId: contact.whatsappId
                }
            },
            update: {
                name: contact.name,
                whatsappNumber: contact.whatsappNumber,
                pictureUrl: contact.pictureUrl ?? null,
                sessionId: contact.sessionId
            },
            create: {
                name: contact.name,
                whatsappNumber: contact.whatsappNumber,
                pictureUrl: contact.pictureUrl ?? null,
                sessionId: contact.sessionId,
                whatsappId: contact.whatsappId,
            }
        });

        return result;
    }
}
