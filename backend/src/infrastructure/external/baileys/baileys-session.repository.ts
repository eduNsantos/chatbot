import { prisma } from "../../../database/prisma.js";
import type { Session } from "@prisma/client";

export default class SessionRepository  {

  async findByName(sessionName: string): Promise<Session | null> {
    return prisma.session.findUnique({
      where: { sessionName }
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

}