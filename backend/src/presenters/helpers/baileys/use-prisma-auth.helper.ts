// src/presenters/helpers/baileys/use-prisma-auth.helper.ts

import { initAuthCreds } from "@whiskeysockets/baileys";
import type { AuthenticationCreds } from "@whiskeysockets/baileys";
import { SessionKeyRepository } from "../../../infrastructure/external/baileys/session-key.repository.js";
import SessionRepository from "../../../infrastructure/external/baileys/baileys-session.repository.js";


export async function usePrismaAuth(sessionName: string) {
  const sessionRepo = new SessionRepository();
  const keyRepo = new SessionKeyRepository();

  let session = await sessionRepo.findByName(sessionName);

  if (!session) {
    session = await sessionRepo.create(sessionName, {});
  }

  // 🔥 garante tipagem correta + evita sessão quebrada
  const creds: AuthenticationCreds =
    session.creds && Object.keys(session.creds as object).length > 0
      ? (session.creds as unknown as AuthenticationCreds)
      : initAuthCreds();

  const state = {
    creds,
    keys: {
      get: async (type: string, ids: string[]) => {
        return keyRepo.get(session!.id, type, ids);
      },
      set: async (data: any) => {
        await keyRepo.set(session!.id, data);
      }
    }
  };

  const saveCreds = async () => {
    await sessionRepo.updateCreds(session!.id, state.creds);
  };

  return { state, saveCreds };
}