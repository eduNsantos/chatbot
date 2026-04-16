import { prisma } from "../../../../database/prisma.js";
import type SessionKeyRepositoryContract from "../../contracts/session-key-repository.contract.js";
import { deserializeBaileysKey, serializeBaileysData } from "../gateway/helpers/baileys-auth-state.helper.js";

type KeyData = Record<string, Record<string, any>>;

export class BaileysSessionKeyRepository implements SessionKeyRepositoryContract {

  async get(sessionId: string, type: string, ids: string[]): Promise<Record<string, any>> {
    const rows = await prisma.sessionKey.findMany({
      where: {
        sessionId,
        type,
        keyId: { in: ids }
      }
    });

    const result: Record<string, any> = {};

    for (const row of rows) {
      result[row.keyId] = deserializeBaileysKey(type, row.value);
    }

    return result;
  }

  async set(sessionId: string, data: KeyData): Promise<void> {
    const queries: any[] = [];

    for (const type in data) {
      for (const keyId in data[type]) {
        const value = data[type][keyId];

        if (!value) {
          queries.push(
            prisma.sessionKey.deleteMany({
              where: {
                sessionId,
                type,
                keyId,
              },
            })
          );

          continue;
        }

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
              value: serializeBaileysData(value)
            },
            create: {
              sessionId,
              type,
              keyId,
              value: serializeBaileysData(value)
            }
          })
        );
      }
    }

    if (queries.length) {
      await prisma.$transaction(queries);
    }
  }

  async deleteBySession(sessionId: string): Promise<void> {
    await prisma.sessionKey.deleteMany({
      where: { sessionId }
    });
  }

}