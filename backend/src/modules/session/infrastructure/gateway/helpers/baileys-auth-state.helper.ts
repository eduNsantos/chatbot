import { BufferJSON, proto } from "@whiskeysockets/baileys";

function reviveBaileysValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(reviveBaileysValue);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  if (
    "type" in value &&
    value.type === "Buffer" &&
    "data" in value
  ) {
    if (typeof value.data === "string") {
      return Buffer.from(value.data, "base64");
    }

    if (Array.isArray(value.data)) {
      return Buffer.from(value.data);
    }
  }

  const entries = Object.entries(value);

  if (
    entries.length > 0 &&
    entries.every(([key, entryValue]) => !Number.isNaN(Number.parseInt(key, 10)) && typeof entryValue === "number")
  ) {
    return Buffer.from(entries.map(([, entryValue]) => entryValue));
  }

  return Object.fromEntries(
    entries.map(([key, entryValue]) => [key, reviveBaileysValue(entryValue)])
  );
}

export function serializeBaileysData<T>(value: T): T {
  return JSON.parse(JSON.stringify(value, BufferJSON.replacer)) as T;
}

export function deserializeBaileysData<T>(value: T): T {
  return reviveBaileysValue(value) as T;
}

export function deserializeBaileysKey(type: string, value: unknown) {
  const revivedValue = deserializeBaileysData(value);

  if (type === "app-state-sync-key" && revivedValue) {
    return proto.Message.AppStateSyncKeyData.fromObject(revivedValue);
  }

  return revivedValue;
}
