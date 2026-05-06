export function safeJSONStringify(value: unknown): string {
  const seen = new WeakSet<object>();

  return JSON.stringify(value, (_key, currentValue) => {
    if (typeof currentValue === "bigint") {
      return currentValue.toString();
    }

    if (typeof Buffer !== "undefined" && Buffer.isBuffer(currentValue)) {
      return currentValue.toString("base64");
    }

    if (ArrayBuffer.isView(currentValue)) {
      return Array.from(currentValue as Uint8Array);
    }

    if (currentValue && typeof currentValue === "object") {
      if (seen.has(currentValue)) {
        return "[Circular]";
      }
      seen.add(currentValue);
    }

    return currentValue;
  });
}
