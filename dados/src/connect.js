// NazuBot - Sistema avançado para WhatsApp
// Criador: Hiudy
// Mantenha os créditos, por favor! <3

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
const axios = require('axios');
const readline = require('readline');
const pino = require('pino');
const fs = require('fs').promises;
const fs2 = require('fs');
const path = require('path');

// Configurações
const logger = pino({ level: 'silent' });
const groupCache = new NodeCache({ stdTTL: 300, useClones: false });
const { prefixo, nomebot, nomedono, numerodono } = require('./config.json');

// Utilitários
const createReadlineInterface = () => readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (question) => new Promise(resolve => {
  const rl = createReadlineInterface();
  rl.question(question, answer => {
    rl.close();
    resolve(answer.trim());
  });
  console.log(" ");
});

// Gerenciamento de conexões
class ConnectionManager {
  constructor() {
    this.activeConnections = new Map();
    this.baseAuthDir = __dirname+'/../database/qr-code';
  }

  async createConnection(id = 'default') {
  try {
    const authDir = path.join(this.baseAuthDir, id);
    const { state, saveCreds } = await useMultiFileAuthState(authDir);
    const { version } = await fetchLatestBaileysVersion();
    const store = makeInMemoryStore({
      logger: pino().child({
        level: 'debug',
        stream: 'store',
      }),
    });

    async function getMessage(key) {
      const msg = await store.loadMessage(key.remoteJid, key.id);
      return msg?.message || proto.Message.fromObject({});
    }

    this.getMessage = getMessage;

    // Criação do socket
    const socket = makeWASocket({
      countryCode: 'BR',
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, logger)
      },
      logger,
      printQRInTerminal: !process.argv.includes('--code'),
      syncFullHistory: false,
      markOnlineOnConnect: false,
      generateHighQualityLinkPreview: true,
      fireInitQueries: true,
      emitOwnEvents: true,
      patchMessageBeforeSending: msg => msg,
      connectTimeoutMs: 180000,
      defaultQueryTimeoutMs: 0,
      keepAliveIntervalMs: 60000,
      cachedGroupMetadata: (jid) => groupCache.get(jid),
      getMessage,
    });

    // Verifica se deve usar o modo de pareamento por código
    if (process.argv.includes('--code') && !state.creds.registered) {
      try {
        let phoneNumber = await ask('📞 Digite seu número (com DDD e DDI, ex: +5511999999999): ');
        phoneNumber = phoneNumber.replace(/\D/g, '');
        if (!/^\d{10,15}$/.test(phoneNumber)) {
          console.log('❌ Número inválido! Deve conter entre 10 e 15 dígitos.');
          await socket.end();
          process.exit(1);
        }
        const code = await socket.requestPairingCode(phoneNumber, 'N4ZUN4V2');
        console.log(`🔢 Seu código de pareamento: ${code}`);
        console.log('📲 No WhatsApp, vá em "Aparelhos Conectados" -> "Conectar com Número de Telefone" e insira o código.');
      } catch (err) {
        console.error('❌ Erro ao solicitar código:', err.message || err);
        console.error('📌 Resposta completa do erro:', err);
        await socket.end();
        process.exit(1);
      }
    }

    await this.setupEventHandlers(socket, id, store, saveCreds);
    this.activeConnections.set(id, socket);
    return socket;
  } catch (error) {
    logger.error(`Erro ao criar conexão ${id}:`, error);
    throw error;
  }
}

  async setupEventHandlers(socket, id, store, saveCreds) {
    store.bind(socket.ev);

    socket.ev.on('creds.update', saveCreds);
    
    socket.ev.on('groups.update', async ([event]) => {
      const metadata = await socket.groupMetadata(event.id);
      groupCache.set(event.id, metadata);
    });

    socket.ev.on('group-participants.update', async ({ id, participants, action }) => {
      await this.handleGroupParticipants(id, participants, action, socket);
    });

    socket.ev.on('messages.upsert', async ({ messages, type }) => {
      if (type === 'append' || !messages) return;
      for (const msg of messages) {
        if (!msg.message) continue;
        try {
          const indexModule = require('./index.js');
          await indexModule(socket, msg, id);
        } catch (error) {
          logger.error('Erro ao processar mensagem:', error);
        }
      }
    });

    socket.ev.on('connection.update', async ({ connection, lastDisconnect, qr }) => {
      await this.handleConnectionUpdate(connection, lastDisconnect, id, socket);
    });
    
    socket.ev.on('messages.update', async event => {
    for(const { key, update } of event) {
        if(update.pollUpdates) {
            const pollCreation = await this.getMessage(key)
            console.log(pollCreation);
            if(pollCreation) {
                bah = await getAggregateVotesInPollMessage({ message: pollCreation, pollUpdates: update.pollUpdates});
                console.log(bah);
            };
        };
    };
  });
  
  };

  async handleGroupParticipants(groupId, participants, action, socket) {
    const metadata = await socket.groupMetadata(groupId);
    groupCache.set(groupId, metadata);

    const groupConfigPath = path.join(__dirname, '..', 'database', 'grupos', `${groupId}.json`);
    if (!await fs.access(groupConfigPath).then(() => true).catch(() => false)) return;

    const groupConfig = JSON.parse(await fs.readFile(groupConfigPath));
    const sender = participants[0];

    if (sender.startsWith(socket.user.id.split(':')[0])) return;

    if (action === 'add' && groupConfig.bemvindo) {
      await this.sendWelcomeMessage(socket, groupId, sender, metadata, groupConfig);
    } else if (action === 'remove' && groupConfig.exit?.enabled) {
      await this.sendExitMessage(socket, groupId, sender, metadata, groupConfig);
    }
  }

  async sendWelcomeMessage(socket, groupId, sender, metadata, config) {
    const text = (config.textbv || 'Seja bem vindo(a) #numerodele# ao #nomedogp#!\nVocê é nosso membro número: *#membros#*!')
      .replace('#numerodele#', `@${sender.split('@')[0]}`)
      .replace('#nomedogp#', metadata.subject)
      .replace('#desc#', metadata.desc || '')
      .replace('#membros#', metadata.participants.length);

    const message = config.welcome?.image 
      ? { image: { url: config.welcome.image }, caption: text, mentions: [sender] }
      : { text, mentions: [sender] };

    await socket.sendMessage(groupId, message);
  }

  async sendExitMessage(socket, groupId, sender, metadata, config) {
    const text = (config.exit.text || 'Adeus #numerodele#! 👋\nO grupo *#nomedogp#* agora tem *#membros#* membros.')
      .replace('#numerodele#', `@${sender.split('@')[0]}`)
      .replace('#nomedogp#', metadata.subject)
      .replace('#desc#', metadata.desc || '')
      .replace('#membros#', metadata.participants.length);

    const message = config.exit?.image 
      ? { image: { url: config.exit.image }, caption: text, mentions: [sender] }
      : { text, mentions: [sender] };

    await socket.sendMessage(groupId, message);
  }

  async handleConnectionUpdate(connection, lastDisconnect, id, socket) {
    if (connection === 'open') {
      console.log(`✅ ${nomebot} (${id}) iniciado com sucesso!\nPrefixo: ${prefixo}\nDono: ${nomedono}\nCriador: Hiudy`);
    } else if (connection === 'close') {
      const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
      console.log(`⚠️ Conexão ${id} fechada: ${reason || 'desconhecido'}`);

      if (reason === DisconnectReason.loggedOut || reason === 401) {
        await fs.rm(path.join(this.baseAuthDir, id), { recursive: true, force: true });
      }

      await socket.end();
      this.activeConnections.delete(id);
      console.log(`🔄 Reconectando ${id}...`);
      await this.createConnection(id);
    }
  }

  async start() {
    try {
    
      if (!fs2.existsSync(this.baseAuthDir)) fs2.mkdirSync(this.baseAuthDir, { recursive: true });
      
      const existingConnections = await fs.readdir(this.baseAuthDir);
      
      if (process.argv.includes('--add-number')) {
        const id = await ask('Digite um ID único para a nova conexão: ');
        if (!id || existingConnections.includes(id)) {
          console.log('❌ ID inválido ou já existente!');
          process.exit(1);
        }
        await this.createConnection(id);
        console.log(`✅ Conexão "${id}" adicionada!`);
        return;
      }

      if (existingConnections.length === 0) {
        console.log('ℹ️ Nenhuma conexão encontrada, iniciando padrão...');
        await this.createConnection();
        return;
      }

      for (const id of existingConnections) {
        await this.createConnection(id);
        console.log(`✅ Conexão "${id}" iniciada!`);
      }
    } catch (error) {
      logger.error('Erro ao iniciar bot:', error);
    }
  }
}

// Inicialização
const manager = new ConnectionManager();
manager.start();