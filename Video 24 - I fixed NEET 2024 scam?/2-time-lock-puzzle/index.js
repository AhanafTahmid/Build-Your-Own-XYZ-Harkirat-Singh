"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/fast-mod-exp/dist/index.js
var fme_bigint = (a, b, n) => {
  let r = 1n;
  let x = a % n;
  while (b) {
    if (b & 1n) {
      r = r * x % n;
    }
    x = x * x % n;
    b = b >> 1n;
  }
  return r;
};
function fme(a, b, n) {
  if (typeof a === "bigint" && typeof b === "bigint" && typeof n === "bigint") {
    return fme_bigint(a, b, n);
  } else {
    return Number(fme_bigint(BigInt(a), BigInt(b), BigInt(n)));
  }
}
var dist_default = fme;

// node_modules/tiny-encryptor/dist/v1.js
var v1_exports = {};
__export(v1_exports, {
  decrypt: () => decrypt,
  encrypt: () => encrypt
});

// node_modules/node-buffer-encoding/dist/index.js
var import_node_buffer = require("node:buffer");
var BufferEncoding = {
  /* API */
  encode: (data, encoding) => {
    return import_node_buffer.Buffer.from(data).toString(encoding);
  },
  encodeStr: (data, encoding) => {
    return import_node_buffer.Buffer.from(data).toString(encoding);
  },
  decode: (data, encoding) => {
    const buffer = import_node_buffer.Buffer.from(data, encoding);
    return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  },
  decodeStr: (data, encoding) => {
    return import_node_buffer.Buffer.from(data, encoding).toString();
  }
};
var dist_default2 = BufferEncoding;

// node_modules/hex-encoding/dist/is.js
var is = (data) => {
  if (data.length % 2)
    return false;
  if (!/^[a-fA-F0-9]*$/.test(data))
    return false;
  return true;
};
var is_default = is;

// node_modules/hex-encoding/dist/node.js
var Node = {
  /* API */
  encode: (data) => {
    return dist_default2.encode(data, "hex");
  },
  encodeStr: (data) => {
    return dist_default2.encodeStr(data, "hex");
  },
  decode: (data) => {
    return dist_default2.decode(data, "hex");
  },
  decodeStr: (data) => {
    return dist_default2.decodeStr(data, "hex");
  },
  is: is_default
};
var node_default = Node;

// node_modules/uint8-to-hex/dist/index.js
var toHex = (uint8) => {
  return node_default.encode(uint8);
};
var dist_default3 = toHex;

// node_modules/tiny-webcrypto/dist/node.js
var import_node_crypto = __toESM(require("node:crypto"), 1);
var WebCrypto = import_node_crypto.default.webcrypto;
var node_default2 = WebCrypto;

// node_modules/crypto-pbkdf2-hmac/dist/index.js
var encoder = new TextEncoder();
var makePbkdf2 = (algorithm) => {
  const bufferKey = async (password) => {
    if (password instanceof Uint8Array) {
      return node_default2.subtle.importKey("raw", password, { name: "PBKDF2" }, false, ["deriveBits"]);
    } else if (typeof password === "string") {
      return bufferKey(encoder.encode(password.normalize()));
    } else {
      return password;
    }
  };
  const bufferBits = (password, salt, iterations, bitsLength) => {
    salt = typeof salt === "string" ? encoder.encode(salt) : salt;
    return node_default2.subtle.deriveBits({ name: "PBKDF2", salt, iterations, hash: { name: algorithm } }, password, bitsLength);
  };
  const buffer = async (password, salt, iterations, bytesLength) => {
    const key = await bufferKey(password);
    const bits = await bufferBits(key, salt, iterations, bytesLength * 8);
    return bits;
  };
  const uint8 = async (password, salt, iterations, bytesLength) => {
    return new Uint8Array(await buffer(password, salt, iterations, bytesLength));
  };
  const hex = async (password, salt, iterations, bytesLength) => {
    return dist_default3(await uint8(password, salt, iterations, bytesLength));
  };
  hex.buffer = buffer;
  hex.hex = hex;
  hex.uint8 = uint8;
  return hex;
};
var pbkdf2 = {
  sha1: makePbkdf2("SHA-1"),
  sha256: makePbkdf2("SHA-256"),
  sha384: makePbkdf2("SHA-384"),
  sha512: makePbkdf2("SHA-512")
};
var dist_default4 = pbkdf2;

// node_modules/crypto-random-uint8/dist/index.js
var random = (bytes) => {
  const uint8 = new Uint8Array(bytes);
  node_default2.getRandomValues(uint8);
  return uint8;
};
var dist_default5 = random;

// node_modules/crypto-sha/dist/index.js
var encoder2 = new TextEncoder();
var makeHash = (algorithm) => {
  const buffer = (input) => {
    input = typeof input === "string" ? encoder2.encode(input) : input;
    return node_default2.subtle.digest(algorithm, input);
  };
  const uint8 = async (input) => {
    return new Uint8Array(await buffer(input));
  };
  const hex = async (input) => {
    return dist_default3(await uint8(input));
  };
  hex.buffer = buffer;
  hex.hex = hex;
  hex.uint8 = uint8;
  return hex;
};
var sha1 = makeHash("SHA-1");
var sha256 = makeHash("SHA-256");
var sha384 = makeHash("SHA-384");
var sha512 = makeHash("SHA-512");

// node_modules/int32-encoding/dist/index.js
var Int32 = {
  /* API */
  encode: (data) => {
    if (data !== data >> 0)
      throw new Error("Invalid 32-bit integer");
    const byte1 = data >> 24 & 255;
    const byte2 = data >> 16 & 255;
    const byte3 = data >> 8 & 255;
    const byte4 = data >> 0 & 255;
    return new Uint8Array([byte1, byte2, byte3, byte4]);
  },
  decode: (data) => {
    if (data.length !== 4)
      throw new Error("Invalid 32-bit integer");
    const byte1 = data[0];
    const byte2 = data[1];
    const byte3 = data[2];
    const byte4 = data[3];
    return (byte1 << 24) + (byte2 << 16) + (byte3 << 8) + (byte4 << 0);
  }
};
var dist_default6 = Int32;

// node_modules/uint8-concat/dist/index.js
var concat = (chunks) => {
  const length = chunks.reduce((acc, chunk) => acc + chunk.byteLength, 0);
  const buffer = new Uint8Array(length);
  for (let offset = 0, i = 0, l = chunks.length; i < l; i++) {
    buffer.set(chunks[i], offset);
    offset += chunks[i].byteLength;
  }
  return buffer;
};
var dist_default7 = concat;

// node_modules/uint8-encoding/dist/index.js
var encoder3 = new TextEncoder();
var decoder = new TextDecoder("utf-8", { ignoreBOM: true });
var U8 = {
  /* API */
  encode: (data) => {
    return encoder3.encode(data);
  },
  decode: (data) => {
    return decoder.decode(data);
  }
};
var dist_default8 = U8;

// node_modules/tiny-encryptor/dist/v1.js
var encrypt = async (input, secret, salt, pbkdf2Rounds) => {
  input = typeof input === "string" ? dist_default8.encode(input) : input;
  salt = typeof salt === "string" ? dist_default8.encode(salt) : salt || dist_default5(32);
  salt = salt.length === 32 ? salt : await sha256.uint8(salt);
  const version = new Uint8Array([1]);
  const rounds = Math.max(1, pbkdf2Rounds || 0);
  const keyRaw = await dist_default4.sha256.uint8(secret, salt, rounds, 32);
  const key = await node_default2.subtle.importKey("raw", keyRaw, "AES-GCM", false, ["encrypt"]);
  const iv = dist_default5(16);
  const encryptedBuffer = await node_default2.subtle.encrypt({ name: "AES-GCM", iv, length: 256, tagLength: 128 }, key, input);
  const encryptedUint8 = new Uint8Array(encryptedBuffer);
  const archive = dist_default7([version, salt, dist_default6.encode(rounds), iv, encryptedUint8]);
  return archive;
};
var decrypt = async (input, secret) => {
  const version = input[0];
  if (version !== 1)
    throw new Error("Unsupported encrypted archive version");
  const salt = input.slice(1, 33);
  const rounds = dist_default6.decode(input.slice(33, 37));
  const iv = input.slice(37, 53);
  const encrypted = input.slice(53);
  const keyRaw = await dist_default4.sha256.uint8(secret, salt, rounds, 32);
  const key = await node_default2.subtle.importKey("raw", keyRaw, "AES-GCM", false, ["decrypt"]);
  const decryptedBuffer = await node_default2.subtle.decrypt({ name: "AES-GCM", iv, length: 256, tagLength: 128 }, key, encrypted);
  const decryptedUint8 = new Uint8Array(decryptedBuffer);
  return decryptedUint8;
};

// node_modules/tiny-encryptor/dist/index.js
var dist_default9 = v1_exports;

// node_modules/crypto-miller-rabin/dist/constants.js
var PRIMES_1000 = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n, 43n, 47n, 53n, 59n, 61n, 67n, 71n, 73n, 79n, 83n, 89n, 97n, 101n, 103n, 107n, 109n, 113n, 127n, 131n, 137n, 139n, 149n, 151n, 157n, 163n, 167n, 173n, 179n, 181n, 191n, 193n, 197n, 199n, 211n, 223n, 227n, 229n, 233n, 239n, 241n, 251n, 257n, 263n, 269n, 271n, 277n, 281n, 283n, 293n, 307n, 311n, 313n, 317n, 331n, 337n, 347n, 349n, 353n, 359n, 367n, 373n, 379n, 383n, 389n, 397n, 401n, 409n, 419n, 421n, 431n, 433n, 439n, 443n, 449n, 457n, 461n, 463n, 467n, 479n, 487n, 491n, 499n, 503n, 509n, 521n, 523n, 541n, 547n, 557n, 563n, 569n, 571n, 577n, 587n, 593n, 599n, 601n, 607n, 613n, 617n, 619n, 631n, 641n, 643n, 647n, 653n, 659n, 661n, 673n, 677n, 683n, 691n, 701n, 709n, 719n, 727n, 733n, 739n, 743n, 751n, 757n, 761n, 769n, 773n, 787n, 797n, 809n, 811n, 821n, 823n, 827n, 829n, 839n, 853n, 857n, 859n, 863n, 877n, 881n, 883n, 887n, 907n, 911n, 919n, 929n, 937n, 941n, 947n, 953n, 967n, 971n, 977n, 983n, 991n, 997n];

// node_modules/uint-rng/dist/index.js
function makeRNG(constructor) {
  let pool;
  let cursor = 0;
  return () => {
    if (!pool || cursor === pool.length) {
      pool = new constructor(65536 / (constructor.BYTES_PER_ELEMENT * 8));
      cursor = 0;
      node_default2.getRandomValues(pool);
    }
    return pool[cursor++];
  };
}
function makeBitRNG(rng, bits) {
  let pool = 0;
  let cursor = bits;
  return () => {
    if (cursor === bits) {
      pool = rng();
      cursor = 0;
    }
    return pool & 1 << cursor++ ? 1 : 0;
  };
}
var RNG = {
  get1: makeBitRNG(makeRNG(Uint8Array), 8),
  get8: makeRNG(Uint8Array),
  get16: makeRNG(Uint16Array),
  get32: makeRNG(Uint32Array),
  get64: makeRNG(BigUint64Array)
};
var dist_default10 = RNG;

// node_modules/crypto-random-bigint/dist/index.js
var get8 = Object.assign(() => BigInt(dist_default10.get8()), { BITS: 8 });
var get16 = Object.assign(() => BigInt(dist_default10.get16()), { BITS: 16 });
var get32 = Object.assign(() => BigInt(dist_default10.get32()), { BITS: 32 });
var get64 = Object.assign(() => dist_default10.get64(), { BITS: 64 });
var random2 = (bits) => {
  const get = bits <= 8 ? get8 : bits <= 16 ? get16 : bits <= 32 ? get32 : get64;
  const BITS = get.BITS;
  if (bits === BITS)
    return get();
  if (bits === 1)
    return get() & 1n;
  if (bits === 128)
    return get() << 64n | get();
  if (bits === 160)
    return random2(128) << 32n | random2(32);
  if (bits === 192)
    return random2(128) << 64n | random2(64);
  if (bits === 224)
    return random2(160) << 64n | random2(64);
  if (bits === 256)
    return random2(128) << 128n | random2(128);
  if (bits === 384)
    return random2(256) << 128n | random2(128);
  if (bits === 512)
    return random2(256) << 256n | random2(256);
  if (bits === 1024)
    return random2(512) << 512n | random2(512);
  if (bits === 2048)
    return random2(1024) << 1024n | random2(1024);
  let index = 0;
  let result = 0n;
  while (index < bits) {
    const chunkBits = Math.min(BITS, bits - index);
    const randomMask = 2n ** BigInt(chunkBits) - 1n;
    const random3 = get();
    const chunk = random3 & randomMask;
    if (bits === chunkBits)
      return chunk;
    result = index ? result | chunk << BigInt(index) : chunk;
    index += chunkBits;
  }
  return result;
};
var dist_default11 = random2;

// node_modules/crypto-random-in-range/dist/index.js
var inRange = (min, max) => {
  min = BigInt(min);
  max = BigInt(max);
  if (min < 0n || max < 0n)
    throw new Error("Negative ranges are not supported");
  if (max <= min)
    throw new Error('"max" must be at least equal to "min" plus 1');
  const interval = max - min - 1n;
  const intervalBits = interval.toString(2).length;
  while (true) {
    const nr = dist_default11(intervalBits);
    if (nr > interval)
      continue;
    return nr + min;
  }
};
var dist_default12 = inRange;

// node_modules/crypto-miller-rabin/dist/index.js
var isProbablyPrime = (n, k = 8) => {
  for (const prime of PRIMES_1000) {
    if (n % prime === 0n)
      return n === prime;
  }
  if (n <= 1000n)
    return false;
  let s = 0n;
  let d = n - 1n;
  while ((d & 1n) === 0n) {
    s += 1n;
    d >>= 1n;
  }
  for (let i = 0; i < k; i++) {
    const a = dist_default12(2n, n - 2n);
    let x = dist_default(a, d, n);
    let y = 0n;
    for (let j = 0; j < s; j++) {
      y = dist_default(x, 2n, n);
      if (y === 1n && x !== 1n && x !== n - 1n)
        return false;
      x = y;
    }
    if (y !== 1n)
      return false;
  }
  return true;
};
var dist_default13 = isProbablyPrime;

// node_modules/crypto-random-prime/dist/index.js
var randomPrime = (bits, k = 8) => {
  let n = dist_default11(bits);
  if ((n & 1n) === 0n) {
    n += 1n;
  }
  while (true) {
    if (dist_default13(n, k))
      return n;
    n += 2n;
  }
};
var dist_default14 = randomPrime;

// node_modules/bigint-encoding/dist/index.js
var BigEnc = {
  /* API */
  encode: (data) => {
    let encoded = 0n;
    for (let i = 0, l = data.length; i < l; i++) {
      encoded |= BigInt(data[i]) << (BigInt(l) - BigInt(i) - 1n) * 8n;
    }
    return encoded;
  },
  decode: (data) => {
    if (data < 0n)
      throw new Error("Negative BigInts are not supported");
    const decoded = [];
    while (data) {
      decoded.push(Number(data & 0xffn));
      data >>= 8n;
    }
    return new Uint8Array(decoded.reverse());
  }
};
var dist_default15 = BigEnc;

// node_modules/crypto-puzzle/dist/archiver.js
var Archiver = {
  /* API */
  archive: (archive) => {
    const [n, a, t, Ck, Cm] = archive;
    const n_uint8 = dist_default15.decode(n);
    const n_length = dist_default6.encode(n_uint8.length);
    const a_uint8 = dist_default15.decode(a);
    const a_length = dist_default6.encode(a_uint8.length);
    const t_uint8 = dist_default15.decode(t);
    const t_length = dist_default6.encode(t_uint8.length);
    const Ck_uint8 = dist_default15.decode(Ck);
    const Ck_length = dist_default6.encode(Ck_uint8.length);
    return dist_default7([n_length, n_uint8, a_length, a_uint8, t_length, t_uint8, Ck_length, Ck_uint8, Cm]);
  },
  unarchive: (archive) => {
    const n_length_offset = 0;
    const n_length_uint8 = archive.slice(n_length_offset, n_length_offset + 4);
    const n_length = dist_default6.decode(n_length_uint8);
    const n_offset = n_length_offset + 4;
    const n_uint8 = archive.slice(n_offset, n_offset + n_length);
    const n = dist_default15.encode(n_uint8);
    const a_length_offset = n_offset + n_length;
    const a_length_uint8 = archive.slice(a_length_offset, a_length_offset + 4);
    const a_length = dist_default6.decode(a_length_uint8);
    const a_offset = a_length_offset + 4;
    const a_uint8 = archive.slice(a_offset, a_offset + a_length);
    const a = dist_default15.encode(a_uint8);
    const t_length_offset = a_offset + a_length;
    const t_length_uint8 = archive.slice(t_length_offset, t_length_offset + 4);
    const t_length = dist_default6.decode(t_length_uint8);
    const t_offset = t_length_offset + 4;
    const t_uint8 = archive.slice(t_offset, t_offset + t_length);
    const t = dist_default15.encode(t_uint8);
    const Ck_length_offset = t_offset + t_length;
    const Ck_length_uint8 = archive.slice(Ck_length_offset, Ck_length_offset + 4);
    const Ck_length = dist_default6.decode(Ck_length_uint8);
    const Ck_offset = Ck_length_offset + 4;
    const Ck_uint8 = archive.slice(Ck_offset, Ck_offset + Ck_length);
    const Ck = dist_default15.encode(Ck_uint8);
    const Cm_offset = Ck_offset + Ck_length;
    const Cm = archive.slice(Cm_offset);
    return [n, a, t, Ck, Cm];
  }
};
var archiver_default = Archiver;

// node_modules/crypto-puzzle/dist/utils.js
var sfme = (a, t, n) => {
  let x = a % n;
  if (t <= BigInt(Number.MAX_SAFE_INTEGER)) {
    for (let i = Number(t); i > 0; i--) {
      x = x * x % n;
    }
  } else {
    for (let i = t; i > 0n; i--) {
      x = x * x % n;
    }
  }
  return x % n;
};

// node_modules/crypto-puzzle/dist/index.js
var CryptoPuzzle = {
  /* API */
  generate: async (options) => {
    const PRIME_BITS = options.primeBits ?? 100;
    const PRIME_ROUNDS = options.primeRounds ?? 6;
    const OPS_PER_SECOND = options.opsPerSecond ?? 33e5;
    const DURATION = options.duration ?? 1e3;
    const MESSAGE = options.message;
    const p = dist_default14(PRIME_BITS, PRIME_ROUNDS);
    const q = dist_default14(PRIME_BITS, PRIME_ROUNDS);
    const n = p * q;
    const n1 = (p - 1n) * (q - 1n);
    const S = OPS_PER_SECOND;
    const T = DURATION;
    const t = BigInt(Math.round(Math.max(1, S / 1e3) * T));
    const K = await sha256.uint8(dist_default5(32));
    const M = MESSAGE;
    const Cm = await dist_default9.encrypt(M, K);
    const a = dist_default12(1n, n - 1n);
    const e = dist_default(2n, t, n1);
    const b = dist_default(a, e, n);
    const Ck = dist_default15.encode(K) + b;
    const archive = archiver_default.archive([n, a, t, Ck, Cm]);
    return archive;
  },
  solve: async (puzzle) => {
    const [n, a, t, Ck, Cm] = archiver_default.unarchive(puzzle);
    const b = sfme(a, t, n);
    const K = dist_default15.decode(Ck - b);
    const M_uint8 = await dist_default9.decrypt(Cm, K);
    const M = dist_default8.decode(M_uint8);
    return M;
  }
};
var dist_default16 = CryptoPuzzle;

// index.ts
async function main() {
  const puzzle = await dist_default16.generate({
    opsPerSecond: 33e5,
    duration: 5e3,
    // Rough minimum number of milliseconds that this puzzle will be unsolvable for
    message: "What is 2 + 2"
    // Message to encrypt inside the puzzle
  });
  const solution = await dist_default16.solve(puzzle);
  console.log(solution);
}
main();
