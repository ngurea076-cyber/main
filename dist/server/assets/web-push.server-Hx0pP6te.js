const encoder = new TextEncoder();
function getWebPushPublicKey() {
  return process.env.PUBLIC_WEB_PUSH_PUBLIC_KEY?.trim() || process.env.PUBLIC_VAPID_PUBLIC_KEY?.trim() || null;
}
function getWebPushConfig() {
  const publicKey = getWebPushPublicKey();
  const privateKey = process.env.WEB_PUSH_PRIVATE_KEY?.trim() || process.env.VAPID_PRIVATE_KEY?.trim() || null;
  const subject = process.env.WEB_PUSH_SUBJECT?.trim() || "mailto:ictgadgetsshop@gmail.com";
  if (!publicKey || !privateKey) return null;
  return { publicKey, privateKey, subject };
}
async function sendWebPushNotification(input) {
  const config = getWebPushConfig();
  if (!config) {
    return { ok: false, skipped: true, status: 0 };
  }
  const endpointUrl = new URL(input.subscription.endpoint);
  const audience = endpointUrl.origin;
  const jwt = await createVapidJwt(config, audience);
  const body = await encryptPushPayload(
    JSON.stringify({
      title: input.message.title,
      body: input.message.body,
      url: input.message.url,
      tag: input.message.tag ?? "shopict-order"
    }),
    input.subscription
  );
  const response = await fetch(endpointUrl.toString(), {
    method: "POST",
    headers: {
      Authorization: `vapid t=${jwt}, k=${config.publicKey}`,
      "Content-Encoding": "aes128gcm",
      "Content-Type": "application/octet-stream",
      "Crypto-Key": `p256ecdsa=${config.publicKey}`,
      TTL: "300",
      Urgency: "high"
    },
    body
  });
  return { ok: response.ok, skipped: false, status: response.status };
}
async function createVapidJwt(config, audience) {
  const header = toBase64Url(encoder.encode(JSON.stringify({ alg: "ES256", typ: "JWT" })));
  const payload = toBase64Url(
    encoder.encode(
      JSON.stringify({
        aud: audience,
        exp: Math.floor(Date.now() / 1e3) + 60 * 60 * 12,
        sub: config.subject
      })
    )
  );
  const signingInput = `${header}.${payload}`;
  const privateKey = await importVapidPrivateKey(config.publicKey, config.privateKey);
  const signatureBuffer = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    privateKey,
    encoder.encode(signingInput)
  );
  const signature = derToJoseOrRaw(new Uint8Array(signatureBuffer), 64);
  return `${signingInput}.${toBase64Url(signature)}`;
}
async function importVapidPrivateKey(publicKey, privateKey) {
  const publicBytes = fromBase64Url(publicKey);
  const privateBytes = fromBase64Url(privateKey);
  const x = toBase64Url(publicBytes.slice(1, 33));
  const y = toBase64Url(publicBytes.slice(33, 65));
  const d = toBase64Url(privateBytes);
  return crypto.subtle.importKey(
    "jwk",
    {
      kty: "EC",
      crv: "P-256",
      x,
      y,
      d,
      ext: true,
      key_ops: ["sign"]
    },
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"]
  );
}
async function encryptPushPayload(payload, subscription) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const senderKeys = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]);
  const senderPublicRaw = new Uint8Array(await crypto.subtle.exportKey("raw", senderKeys.publicKey));
  const receiverPublicRaw = fromBase64Url(subscription.p256dh);
  const receiverPublicKey = await crypto.subtle.importKey(
    "raw",
    receiverPublicRaw,
    { name: "ECDH", namedCurve: "P-256" },
    false,
    []
  );
  const sharedSecret = new Uint8Array(
    await crypto.subtle.deriveBits({ name: "ECDH", public: receiverPublicKey }, senderKeys.privateKey, 256)
  );
  const authSecret = fromBase64Url(subscription.auth);
  const authInfo = concatBytes(
    encoder.encode("WebPush: info\0"),
    receiverPublicRaw,
    senderPublicRaw
  );
  const prkKey = await hmacSha256(authSecret, sharedSecret);
  const ikm = await hmacSha256(prkKey, concatBytes(authInfo, Uint8Array.of(1)));
  const prk = await hmacSha256(salt, ikm);
  const cek = (await hmacSha256(prk, concatBytes(encoder.encode("Content-Encoding: aes128gcm\0"), Uint8Array.of(1)))).slice(
    0,
    16
  );
  const nonce = (await hmacSha256(prk, concatBytes(encoder.encode("Content-Encoding: nonce\0"), Uint8Array.of(1)))).slice(
    0,
    12
  );
  const plaintext = concatBytes(encoder.encode(payload), Uint8Array.of(2));
  const contentKey = await crypto.subtle.importKey("raw", cek, { name: "AES-GCM" }, false, ["encrypt"]);
  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce, tagLength: 128 }, contentKey, plaintext)
  );
  return concatBytes(
    salt,
    uint32ToBytes(4096),
    Uint8Array.of(senderPublicRaw.length),
    senderPublicRaw,
    ciphertext
  );
}
async function hmacSha256(keyBytes, dataBytes) {
  const key = await crypto.subtle.importKey("raw", keyBytes, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, dataBytes));
}
function concatBytes(...parts) {
  const totalLength = parts.reduce((sum, part) => sum + part.length, 0);
  const output = new Uint8Array(totalLength);
  let offset = 0;
  for (const part of parts) {
    output.set(part, offset);
    offset += part.length;
  }
  return output;
}
function uint32ToBytes(value) {
  return Uint8Array.of(value >>> 24 & 255, value >>> 16 & 255, value >>> 8 & 255, value & 255);
}
function fromBase64Url(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4 || 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}
function toBase64Url(value) {
  let binary = "";
  value.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function derToJoseOrRaw(signature, outputLength) {
  if (signature.length === outputLength) {
    return signature;
  }
  if (signature[0] !== 48) {
    return signature;
  }
  let offset = 2;
  if (signature[1] & 128) {
    offset = 2 + (signature[1] & 127);
  }
  if (signature[offset] !== 2) {
    return signature;
  }
  const rLength = signature[offset + 1];
  const r = signature.slice(offset + 2, offset + 2 + rLength);
  const sOffset = offset + 2 + rLength;
  if (signature[sOffset] !== 2) {
    return signature;
  }
  const sLength = signature[sOffset + 1];
  const s = signature.slice(sOffset + 2, sOffset + 2 + sLength);
  const length = outputLength / 2;
  const output = new Uint8Array(outputLength);
  output.set(trimAndPad(r, length), 0);
  output.set(trimAndPad(s, length), length);
  return output;
}
function trimAndPad(value, length) {
  let next = value;
  while (next.length > 0 && next[0] === 0 && next.length > length) {
    next = next.slice(1);
  }
  if (next.length >= length) {
    return next.slice(next.length - length);
  }
  const output = new Uint8Array(length);
  output.set(next, length - next.length);
  return output;
}
export {
  getWebPushPublicKey,
  sendWebPushNotification
};
