import { prisma } from "../../../../database/prisma.js";
import type { Session } from "@prisma/client";
import type SessionRepositoryContract from "../../contracts/session-repository.contract.js";
import type SessionUpdateDto from "../../dtos/session-update.dto.js";

export default class BaileysSessionRepository implements SessionRepositoryContract {
  async findByName(sessionName: string): Promise<Session | null> {
    return prisma.session.findUnique({
      where: { sessionName }
    });
  }

  async findAll(): Promise<Partial<Session>[]> {
    return prisma.session.findMany({
      select: { id: true, sessionName: true, createdAt: true, updatedAt: true }
    });
  }

  async findById(id: string): Promise<Session | null> {
    return prisma.session.findUnique({
      where: { id }
    });
  }

  async create(sessionName: string, creds: any): Promise<Session> {
    return prisma.session.create({
      data: {
        sessionName,
        creds
      }
    });
  }

  async updateCreds(sessionId: string, creds: any): Promise<void> {
    await prisma.session.update({
      where: { id: sessionId },
      data: { creds }
    });
  }

  async delete(sessionId: string): Promise<void> {
    await prisma.session.delete({
      where: { id: sessionId }
    });
  }

  async update(updateDto: SessionUpdateDto): Promise<void> {
    await prisma.session.update({
      where: { id: updateDto.id },
      data: {
        sessionName: updateDto.sessionName
        // webhoookUrl: updateDto.isActive ? "https://example.com/webhook" : null,
        // webhookHeaders: updateDto.isActive ? { "X-Session-Id": updateDto.id } : null
      }
    });
  }

}