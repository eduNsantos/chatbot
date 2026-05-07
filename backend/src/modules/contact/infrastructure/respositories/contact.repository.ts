import { prisma } from '../../../../database/prisma.js';
import type { ContactEntity } from '../../entities/contact.entity.js';
import type { FindOrCreateContactDTO } from '../../dtos/find-or-create-contact.dto.js';
import type { UpdateContactDTO } from '../../dtos/update-contact.dto.js';
import type ContactRepositoryContract from '../../contracts/contact-repository.contract.js';

export default class ContactRepository implements ContactRepositoryContract {
    async findById(id: number): Promise<ContactEntity | null> {
        return prisma.contact.findUnique({
            where: {
                id
            }
        });
    }

    async findAllBySessionId(sessionId: string): Promise<ContactEntity[]> {
        const contacts = await prisma.contact.findMany({
            where: { sessionId },
            orderBy: { id: 'desc' }
        });

        return contacts;
    }

    async findOrCreate(contact: FindOrCreateContactDTO): Promise<ContactEntity> {
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

    async updateContact(contactDto: UpdateContactDTO): Promise<ContactEntity> {
        const { id, ...data } = contactDto;

        const updatedContact = await prisma.contact.update({
            where: { id },
            data
        });

        return updatedContact;
    }
}
