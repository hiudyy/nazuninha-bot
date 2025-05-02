/*══════════════════════════════════════════════
  NazuBot – Conexão WhatsApp (CommonJS)
  Autor: Hiudy
  Revisão: 01/05/2025
══════════════════════════════════════════════*/

const { Boom } = require('@hapi/boom');
const {
  makeWASocket,
  useMultiFileAuthState,
  makeCacheableSignalKeyStore,
  fetchLatestBaileysVersion,
  DisconnectReason,
  proto,
  makeInMemoryStore,
  getAggregateVotesInPollMessage
} = require('baileys');

const NodeCache = require('node-cache');
const readline = require('readline');
const pino = require('pino');
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

/*── Configurações ──*/
const settingsPath = path.join(__dirname, 'config.json');
const settings = JSON.parse(fs.readFileSync(settingsPath));
const templateName = settings.template || 'nazu-default';
const texts = require(path.join(__dirname, `templates/${templateName}/texts/connect.js`));

/*── Utilidades ──*/
function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function replace(template, obj) {
  return Object.entries(obj).reduce(
    (s, [k, v]) => s.replace(new RegExp(`#${k}#`, 'g'), v), template);
}
function ask(question) {
  return new Promise((res) => rl.question(`${question}\n> `, (ans) => res(ans.trim())));
}

/*── Logger ──*/
const logger = pino({ level: 'silent' });

/*── Store e cache ──*/
const store = makeInMemoryStore({ logger: undefined });
const groupCache = new NodeCache({ stdTTL: 300, useClones: false });

async function getMessage(key) {
  const m = await store.loadMessage(key.remoteJid, key.id);
  return m?.message || proto.Message.fromObject({});
}

/*── Readline ──*/
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

/*── Variável global do socket ──*/
let SOCKET = null;

/*══════════════════════════════════════════════
  Função principal de inicialização
══════════════════════════════════════════════*/
async function startBot() {
  const authDir = path.join(__dirname, '..', 'database/qr-code', 'default');
  fs.mkdirSync(authDir, { recursive: true });

  const { state, saveCreds } = await useMultiFileAuthState(authDir);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger)
    },
    logger,
    printQRInTerminal: !process.argv.includes('--code'),
    syncFullHistory: false,
    markOnlineOnConnect: false,
    generateHighQualityLinkPreview: false,
    fireInitQueries: false,
    connectTimeoutMs: 120_000,
    defaultQueryTimeoutMs: 0,
    keepAliveIntervalMs: 45_000,
    cachedGroupMetadata: (jid) => groupCache.get(jid),
    getMessage
  });

  SOCKET = sock;

  /*── Eventos ──*/
  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('groups.update', async ([ev]) => {
    const meta = await sock.groupMetadata(ev.id).catch(() => undefined);
    if (meta) groupCache.set(ev.id, meta);
  });

  sock.ev.on('group-participants.update', (ev) => handleParticipants(ev, sock));

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    for (const msg of messages || []) {
      if (!msg.message) continue;
      try {
        const index = require('./index.js');
        await index(sock, msg, 'default');
      } catch (err) {
        logger.error(replace(random(texts.indexError), { err: err.message }));
      }
    }
  });

  sock.ev.on('connection.update', (u) => handleConnection(u, sock, authDir));

  // Pareamento por código se solicitado
  if (process.argv.includes('--code') && !state.creds.registered) {
    await pairByCode(sock);
  }

  // Vincula store
  store.bind(sock.ev);
}

/*══════════════════════════════════════════════
  Pareamento por código numérico
══════════════════════════════════════════════*/
async function pairByCode(sock) {
  try {
    let number = await ask(random(texts.numberPrompt));
    number = number.replace(/\D/g, '');
    if (!/^\d{10,15}$/.test(number)) throw new Error(random(texts.invalidNumber));

    const code = await sock.requestPairingCode(number, 'N4ZUN4V2');
    console.log(code);
    console.log(random(texts.qrTip));
    console.log(random(texts.codeHelp));
  } catch (err) {
    console.error(replace(random(texts.error), { err: err.message }));
    await sock.end();
    process.exit(1);
  }
}

/*══════════════════════════════════════════════
  Welcome e Bye
══════════════════════════════════════════════*/
async function handleParticipants({ id, participants, action }, sock) {
  const meta = await sock.groupMetadata(id).catch(() => null);
  if (meta) groupCache.set(id, meta);

  const cfgPath = path.join(__dirname, '..', 'database', 'grupos', `${id}.json`);
  const cfg = fs.existsSync(cfgPath) ? JSON.parse(fs.readFileSync(cfgPath)) : {};

  const who = participants[0];
  if (who.startsWith(sock.user.id.split(':')[0])) return;

  if (action === 'add' && cfg.bemvindo !== false) {
    await sendWelcome(sock, id, who, meta, cfg);
  } else if (action === 'remove' && cfg.exit?.enabled !== false) {
    await sendGoodbye(sock, id, who, meta, cfg);
  }
}

function buildGroupText(tpl, data) {
  return replace(tpl, {
    numerodele: `@${data.participant.split('@')[0]}`,
    nomedogp: data.groupName,
    membros: data.count
  });
}

async function sendWelcome(sock, gid, participant, meta, cfg) {
  const txt = buildGroupText(
    cfg.textbv || random(texts.welcome),
    { participant, groupName: meta.subject, count: meta.participants.length }
  );

  const msg = cfg.welcome?.image
    ? { image: { url: cfg.welcome.image }, caption: txt, mentions: [participant] }
    : { text: txt, mentions: [participant] };

  await sock.sendMessage(gid, msg);
}

async function sendGoodbye(sock, gid, participant, meta, cfg) {
  const txt = buildGroupText(
    (cfg.exit && cfg.exit.text) || random(texts.goodbye),
    { participant, groupName: meta.subject, count: meta.participants.length }
  );

  const msg = cfg.exit?.image
    ? { image: { url: cfg.exit.image }, caption: txt, mentions: [participant] }
    : { text: txt, mentions: [participant] };

  await sock.sendMessage(gid, msg);
}

/*══════════════════════════════════════════════
  Connection handler
══════════════════════════════════════════════*/
async function handleConnection({ connection, lastDisconnect }, sock, authDir) {
  if (connection === 'open') {
    console.log(random(texts.started));
    return;
  }

  if (connection === 'close') {
    const err = lastDisconnect?.error;
    const code = new Boom(err)?.output?.statusCode;
    const msg = err?.message || 'desconhecido';

    const map = {
      [DisconnectReason.loggedOut]: 'loggedOut',
      [DisconnectReason.badSession]: 'badSession',
      [DisconnectReason.multideviceMismatch]: 'mdMismatch',
      401: 'unauthorized',
      440: 'timeout'
    };
    const key = map[code] || 'default';
    const arr = texts.close[key] || texts.close.default;
    console.log(replace(random(arr), { code: code || '???', err: msg }));

    // Remove auth se inválida
    const invalid = [
      DisconnectReason.loggedOut,
      DisconnectReason.badSession,
      DisconnectReason.multideviceMismatch,
      401, 440
    ];

    await sock.end();
    console.log(random(texts.reconnecting));
    startBot();
  }
}

/*══════════════════════════════════════════════
  Sinais do sistema
══════════════════════════════════════════════*/
function gracefulExit() {
  SOCKET?.end();
  rl.close();
  process.exit(0);
}
process.on('SIGINT', gracefulExit);
process.on('SIGTERM', gracefulExit);

/*══════════════════════════════════════════════
  Execução
══════════════════════════════════════════════*/
startBot().catch((e) => {
  console.error(replace(random(texts.error), { err: e.message }));
  process.exit(1);
});
