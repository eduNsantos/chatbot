import { prisma } from '../../../../database/prisma.js';
import type { ContactEntity } from '../../entities/contact.entity.js';
import type { FindOrCreateContactDTO } from '../../dtos/find-or-create-contact.dto.js';
import type { UpdateContactDTO } from '../../dtos/update-contact.dto.js';
import type ContactRepositoryContract from '../../contracts/contact-repository.contract.js';
import { notifyContactUpsert } from '../../../../shared/realtime/socket.js';

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
            orderBy: [
                { lastMessageAt: 'desc' },
                { updatedAt: 'desc' },
                { id: 'desc' }
            ]
        });

        return contacts;
    }

    async findOrCreate(contact: FindOrCreateContactDTO): Promise<ContactEntity> {
        console.log(contact)

        let result = await prisma.contact.findUnique({
            where: {
                sessionId_whatsappId: {
                    sessionId: contact.sessionId,
                    whatsappId: contact.whatsappId
                }
            }
        });

        if (!result) {
            result = await prisma.contact.create({
                data: {
                    name: contact.name,
                    whatsappNumber: contact.whatsappNumber,
                    pictureUrl: contact.pictureUrl ?? null,
                    sessionId: contact.sessionId,
                    whatsappId: contact.whatsappId,
                }
            });

            notifyContactUpsert({
                id: result.id,
                sessionId: result.sessionId,
                whatsappId: result.whatsappId,
                whatsappNumber: result.whatsappNumber,
                pictureUrl: result.pictureUrl,
                name: result.name,
                isGroup: result.isGroup,
                lastMessageAt: result.lastMessageAt?.toISOString() ?? null,
                createdAt: result.createdAt.toISOString(),
                updatedAt: result.updatedAt.toISOString()
            });
        }

        return result;
    }

    async updateContact(contactDto: UpdateContactDTO): Promise<ContactEntity> {
        const { id, ...data } = contactDto;

        const updatedContact = await prisma.contact.update({
            where: { id },
            data
        });

        notifyContactUpsert({
            id: updatedContact.id,
            sessionId: updatedContact.sessionId,
            whatsappId: updatedContact.whatsappId,
            whatsappNumber: updatedContact.whatsappNumber,
            pictureUrl: updatedContact.pictureUrl,
            name: updatedContact.name,
            isGroup: updatedContact.isGroup,
            lastMessageAt: updatedContact.lastMessageAt?.toISOString() ?? null,
            createdAt: updatedContact.createdAt.toISOString(),
            updatedAt: updatedContact.updatedAt.toISOString()
        });

        return updatedContact;
    }
}
