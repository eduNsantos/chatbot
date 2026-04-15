import { prisma } from "../../../database/prisma.js";

type KeyData = Record<string, Record<string, any>>;

export class SessionKeyRepository {

  async get(sessionId: string, type: string, ids: string[]) {
    const rows = await prisma.sessionKey.findMany({
      where: {
        sessionId,
        type,
        keyId: { in: ids }
      }
    });

    const result: Record<string, any> = {};

    for (const row of rows) {
      result[row.keyId] = row.value;
    }

    return result;
  }

  async set(sessionId: string, data: KeyData) {
    const queries: any[] = [];

    for (const type in data) {
      for (const keyId in data[type]) {
        const value = data[type][keyId];

        queries.push(
          prisma.sessionKey.upsert({
            where: {
              sessionId_type_keyId: {
                sessionId,
                type,
                keyId
              }
            },
            update: {
              value
            },
            create: {
              sessionId,
              type,
              keyId,
              value
            }
          })
        );
      }
    }

    if (queries.length) {
      await prisma.$transaction(queries);
    }
  }

  async deleteBySession(sessionId: string) {
    await prisma.sessionKey.deleteMany({
      where: { sessionId }
    });
  }

}