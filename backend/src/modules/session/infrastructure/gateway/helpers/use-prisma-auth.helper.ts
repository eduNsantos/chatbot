// src/presenters/helpers/baileys/use-prisma-auth.helper.ts

import { initAuthCreds } from "@whiskeysockets/baileys";
import type { AuthenticationCreds } from "@whiskeysockets/baileys";
import {
  deserializeBaileysData,
  serializeBaileysData,
} from "./baileys-auth-state.helper.js";
import BaileysSessionRepository from "../../repositories/baileys-session.repository.js";
import { BaileysSessionKeyRepository } from "../../repositories/baileys-session-key.repository.js";

function hasValidSignalKeyPair(keyPair: unknown): boolean {
  return !!keyPair
    && typeof keyPair === "object"
    && "private" in keyPair
    && Buffer.isBuffer(keyPair.private)
    && "public" in keyPair
    && Buffer.isBuffer(keyPair.public);
}

function isValidCreds(creds: AuthenticationCreds): boolean {
  return hasValidSignalKeyPair(creds.noiseKey)
    && hasValidSignalKeyPair(creds.signedIdentityKey)
    && hasValidSignalKeyPair(creds.pairingEphemeralKeyPair)
    && typeof creds.advSecretKey === "string";
}


export async function usePrismaAuth(sessionName: string) {
  const sessionRepo = new BaileysSessionRepository();
  const keyRepo = new BaileysSessionKeyRepository();

  let session = await sessionRepo.findByName(sessionName);

  if (!session) {
    session = await sessionRepo.create(sessionName, {});
  }

  const storedCreds = session.creds && Object.keys(session.creds as object).length > 0
    ? deserializeBaileysData(session.creds as unknown as AuthenticationCreds)
    : null;

  const creds: AuthenticationCreds = storedCreds && isValidCreds(storedCreds)
    ? storedCreds
    : initAuthCreds();

  if (storedCreds && !isValidCreds(storedCreds)) {
    await sessionRepo.updateCreds(session.id, serializeBaileysData(creds));
  }

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
    await sessionRepo.updateCreds(session!.id, serializeBaileysData(state.creds));
  };

  return { state, saveCreds };
}