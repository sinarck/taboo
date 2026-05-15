// Fisher-Yates with crypto.getRandomValues — unbiased and unguessable.
// Falls back to Math.random only in environments without crypto (very rare).
export function shuffle<T>(input: readonly T[]): T[] {
  const out = input.slice();
  const cryptoApi = typeof globalThis !== "undefined" ? globalThis.crypto : undefined;

  for (let i = out.length - 1; i > 0; i--) {
    const j = randomIndex(i + 1, cryptoApi);
    const tmp = out[i] as T;
    out[i] = out[j] as T;
    out[j] = tmp;
  }
  return out;
}

function randomIndex(upperExclusive: number, cryptoApi: Crypto | undefined) {
  if (!cryptoApi?.getRandomValues || upperExclusive <= 1) {
    return Math.floor(Math.random() * upperExclusive);
  }
  // Rejection sampling to avoid modulo bias.
  const range = 0xffffffff - (0xffffffff % upperExclusive);
  const buf = new Uint32Array(1);
  while (true) {
    cryptoApi.getRandomValues(buf);
    const value = buf[0] ?? 0;
    if (value < range) return value % upperExclusive;
  }
}
