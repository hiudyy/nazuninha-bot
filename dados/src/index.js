// Index principal do bot
// Sistema unico, diferente de qualquer outro bot
// Criador: Hiudy
// Caso for usar deixe o caralho dos créditos 
// <3

const { downloadContentFromMessage, Mimetype, getAggregateVotesInPollMessage } = require('baileys');
const { exec, spawn, execSync } = require('child_process');
const { reportError, youtube, tiktok, pinterest, igdl, sendSticker, FilmesDL, styleText, emojiMix, upload, mcPlugin, tictactoe, rpg, toolsJson, vabJson, apkMod, google }  = require(__dirname+'/funcs/exports.js');
const axios = require('axios');
const pathz = require('path');
const fs = require('fs');
const os = require('os');

async function NazuninhaBotExec(nazu, info) {
const { numerodono, nomedono, nomebot, prefixo, prefixo: prefix, debug } = JSON.parse(fs.readFileSync(__dirname+'/config.json'));

try {
 const settingsz = JSON.parse(fs.readFileSync(__dirname + '/config.json'));
 const template = settingsz.template || 'nazu-default';
 const { menu, menudown, menuadm, menubn, menuDono, menuMembros, menuFerramentas, menuSticker, menuIa, menuRpg } = require(`${__dirname}/templates/${template}/menus/index.js`);
 const t = require(`${__dirname}/templates/${template}/texts/index.js`);
 const from = info.key.remoteJid;
 const isGroup = from.endsWith('@g.us');
 if(!info.key.participant && !info.key.remoteJid) return;
 const sender = isGroup ? info.key.participant.includes(':') ? info.key.participant.split(':')[0] +'@s.whatsapp.net': info.key.participant : info.key.remoteJid;
 const isStatus = from.endsWith('@broadcast');
 const nmrdn = numerodono.replace(new RegExp("[()+-/ +/]", "gi"), "") + `@s.whatsapp.net`
 const isOwner = (nmrdn == sender ? true : false) || info.key.fromMe;
 
 const baileys = require('baileys');
 const type = baileys.getContentType(info.message);
 
 const isImage = type == 'imageMessage'
 const isVideo = type == 'videoMessage'
 const isVisuU2 = type == 'viewOnceMessageV2'
 const isVisuU = type == 'viewOnceMessage'
 
 const pushname = info.pushName ? info.pushName : '';
 
 var body = info.message?.conversation || info.message?.viewOnceMessageV2?.message?.imageMessage?.caption || info.message?.viewOnceMessageV2?.message?.videoMessage?.caption || info.message?.imageMessage?.caption || info.message?.videoMessage?.caption || info.message?.extendedTextMessage?.text || info.message?.viewOnceMessage?.message?.videoMessage?.caption || info.message?.viewOnceMessage?.message?.imageMessage?.caption || info.message?.documentWithCaptionMessage?.message?.documentMessage?.caption || info.message?.editedMessage?.message?.protocolMessage?.editedMessage?.extendedTextMessage?.text || info.message?.editedMessage?.message?.protocolMessage?.editedMessage?.imageMessage?.caption || info?.text || '';
 
 const args = body.trim().split(/ +/).slice(1);
 const q = args.join(' ');
 const budy2 = body.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
 const menc_prt = info.message?.extendedTextMessage?.contextInfo?.participant;
 const menc_jid = args?.join(" ").replace("@", "") + "@s.whatsapp.net";
 const menc_jid2 = info.message?.extendedTextMessage?.contextInfo?.mentionedJid;
 const menc_os2 = q.includes("@") ? menc_jid : menc_prt;
 const sender_ou_n = q.includes("@") ? menc_jid : menc_prt ? menc_prt : sender;

 var isCmd = body.trim().startsWith(prefix);
 const command = isCmd ? budy2.trim().slice(1).split(/ +/).shift().toLocaleLowerCase().trim().replaceAll(' ', '') : null;
 
 //CRIAR PASTAS
  if (!fs.existsSync(__dirname + `/../database/grupos`)) fs.mkdirSync(__dirname + `/../database/grupos`, { recursive: true });
  if (!fs.existsSync(__dirname + `/../database/users`)) fs.mkdirSync(__dirname + `/../database/users`, { recursive: true });
  if (!fs.existsSync(__dirname + `/../database/dono`)) fs.mkdirSync(__dirname + `/../database/dono`, { recursive: true });
  
 //SISTEMA DE PREMIUM
 if (!fs.existsSync(__dirname + `/../database/dono/premium.json`)) fs.writeFileSync(__dirname + `/../database/dono/premium.json`, JSON.stringify({}, null, 2));
 const premiumListaZinha = JSON.parse(fs.readFileSync(__dirname + `/../database/dono/premium.json`, 'utf-8'));
 const isPremium = !!premiumListaZinha[sender] || !!premiumListaZinha[from] || isOwner;
 
 //BAN GPS
 if (!fs.existsSync(__dirname + `/../database/dono/bangp.json`)) fs.writeFileSync(__dirname + `/../database/dono/bangp.json`, JSON.stringify({}, null, 2));
 const banGpIds = JSON.parse(fs.readFileSync(__dirname + `/../database/dono/bangp.json`, 'utf-8'));
 if(!!banGpIds[from] && !isOwner && !isPremium) return;
 
 //INFOS DE GRUPO
  const groupFile = __dirname + `/../database/grupos/${from}.json`;
  const groupMetadata = !isGroup ? {} : await nazu.groupMetadata(from);
  const groupName = isGroup && groupMetadata.subject ? groupMetadata.subject : '';
  const AllgroupMembers = !isGroup ? [] : groupMetadata.participants.map(p => p.id);
  const groupAdmins = !isGroup ? [] : groupMetadata.participants.filter(p => p.admin).map(p => p.id);
  const botNumber = nazu.user.id.split(':')[0] + '@s.whatsapp.net';
  const isGroupAdmin = !isGroup ? null : groupAdmins.includes(sender) || isOwner;
  const isBotAdmin = !isGroup ? null : groupAdmins.includes(botNumber);
  if(isGroup) {
  if (!fs.existsSync(__dirname + `/../database/grupos/${from}.json`)) fs.writeFileSync(__dirname + `/../database/grupos/${from}.json`, JSON.stringify({ mark: {} }, null, 2));
  };
  let groupData = {};
  try {groupData = JSON.parse(fs.readFileSync(__dirname + `/../database/grupos/${from}.json`));} catch (error) {};
  const isModoBn = groupData.modobrincadeira ? true : false;
  const isOnlyAdmin = groupData.soadm ? true : false;
  const isAntiPorn = groupData.antiporn ? true : false;
  const isMuted = (groupData.mutedUsers && groupData.mutedUsers[sender]) ? true : false;
  const isAntiLinkGp = groupData.antilinkgp ? true : false;
  const isModoRpg = isGroup && groupData.modorpg ? true : false;
  if(isGroup && !isGroupAdmin && isOnlyAdmin) return;
  if(isGroup && !isGroupAdmin && isCmd && groupData.blockedCommands && groupData.blockedCommands[command]) return reply('Este comando foi bloqueado pelos administradores do grupo.');
  
 //BANIR USUÁRIOS MUTADOS 🤓☝🏻
 if(isGroup && isMuted) {
 await nazu.sendMessage(from, {text: `🤫 Hmm @${sender.split("@")[0]}, achou que ia passar despercebido? Achou errado lindo(a)! Você está sendo removido por enviar mensagem, sendo que você está mutado neste grupo.`, mentions: [sender]}, {quoted: info});
 await nazu.sendMessage(from, {delete: {remoteJid: from, fromMe: false, id: info.key.id, participant: sender}});
 await nazu.groupParticipantsUpdate(from, [sender], 'remove');
 delete groupData.mutedUsers[sender];
 fs.writeFileSync(__dirname + `/../database/grupos/${from}.json`, JSON.stringify(groupData, null, 2));
 };
 //FIM
 
 //CONTADOR DE MENSAGEM 🤓
 if(isGroup){/*Created By Hiudy*/groupData.contador=groupData.contador||[];const a=groupData.contador.findIndex(b=>b.id===sender);if(a!==-1){const c=groupData.contador[a];isCmd?c.cmd=(c.cmd||0)+1:type=="stickerMessage"?c.figu=(c.figu||0)+1:c.msg=(c.msg||0)+1;pushname&&c.pushname!==pushname&&(c.pushname=pushname)}else{groupData.contador.push({id:sender,msg:isCmd?0:1,cmd:isCmd?1:0,figu:type=="stickerMessage"?1:0,pushname:pushname||'Unknown User'})}try{fs.writeFileSync(`${__dirname}/../database/grupos/${from}.json`,JSON.stringify(groupData,null,2))}catch{}};
 //FIM DO CONTADOR
 
 //FUNÇÕES BASICAS
 async function reply(text, aA = { mentions: [] }) {const result = await nazu.sendMessage(from, {text: text.trim(), mentions: aA.mentions}, {sendEphemeral: true, contextInfo: { forwardingScore: 50, isForwarded: true, externalAdReply: { showAdAttribution: true }}, quoted: info})}; nazu.reply=reply;
 
 const reagir = async (emj) => { if (typeof emj === 'string') { await nazu.sendMessage(from, { react: { text: emj, key: info.key } }); } else if (Array.isArray(emj)) { for (const emjzin of emj) { await nazu.sendMessage(from, { react: { text: emjzin, key: info.key } }); await new Promise(res => setTimeout(res, 500)); } } }; nazu.react = reagir;
 
 const getFileBuffer = async (mediakey, MediaType) => {const stream = await downloadContentFromMessage(mediakey, MediaType);let buffer = Buffer.from([]);for await(const chunk of stream) {buffer = Buffer.concat([buffer, chunk]) };return buffer}

 const normalizar = texto => texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
 //FIM FUNÇÕES BASICAS

 //SISTEMA ANTI PORNOGRAFIA 🤫
 if (isGroup && isAntiPorn && (isImage || isVisuU || isVisuU2)) { const midiaz = info.message?.imageMessage || info.message?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessage?.message?.imageMessage || info.message?.videoMessage || info.message?.stickerMessage || info.message?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessage?.message?.videoMessage; if (midiaz) { try { const stream = await getFileBuffer(midiaz, "image"); const mediaURL = await upload(stream, true); if (mediaURL) { const apiResponse = await axios.get(`https://nsfw-demo.sashido.io/api/image/classify?url=${mediaURL}`); const { Porn, Hentai } = apiResponse.data.reduce((acc, item) => ({...acc,[item.className]: item.probability}), {}); let userMessage = ''; let actionTaken = false; if (Porn > 0.80 || Hentai > 0.80) { if(!isGroupAdmin) { await nazu.sendMessage(from, { delete: info.key }); userMessage = `🚫 @${sender.split('@')[0]} foi removido por compartilhar conteúdo impróprio.\n\n🚫 Esta mídia contém conteúdo adulto (${apiResponse.data[0].className}) com uma probabilidade de ${apiResponse.data[0].probability.toFixed(2)} e foi removida!`; await nazu.groupParticipantsUpdate(from, [sender], "remove"); actionTaken = true; } else { await nazu.sendMessage(from, { delete: info.key }); await reply('Conteudo adulto detectado, porem como você é um administrador não irei banir.'); } } if (actionTaken) { await nazu.sendMessage(from, { text: userMessage, mentions: [sender] }, { quoted: info }); }; } } catch (error) { } } };
 //FIM 🤫

 //DEFINIÇÕES DE ISQUOTED
 const content = JSON.stringify(info.message);
 const isQuotedMsg = type === 'extendedTextMessage' && content.includes('conversation')
 const isQuotedMsg2 = type === 'extendedTextMessage' && content.includes('text')
 const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
 const isQuotedVisuU = type === 'extendedTextMessage' && content.includes('viewOnceMessage')
 const isQuotedVisuU2 = type === 'extendedTextMessage' && content.includes('viewOnceMessageV2')
 const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
 const isQuotedDocument = type === 'extendedTextMessage' && content.includes('documentMessage')
 const isQuotedDocW = type === 'extendedTextMessage' && content.includes('documentWithCaptionMessage')
 const isQuotedAudio = type === 'extendedTextMessage' && content.includes('audioMessage')
 const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
 const isQuotedContact = type === 'extendedTextMessage' && content.includes('contactMessage')
 const isQuotedLocation = type === 'extendedTextMessage' && content.includes('locationMessage')
 const isQuotedProduct = type === 'extendedTextMessage' && content.includes('productMessage')
 
 //EXECUÇÕES DE DONO BBZIN 🥵
 if(body.startsWith('$')) {if(!isOwner) return;exec(q, (err, stdout) => {if(err) return reply(`${err}`);if(stdout) {reply(stdout);}})};
 
 if(body.startsWith('>>')){try { if(!isOwner) return;(async () => {try {const codeLines = body.slice(2).trim().split('\n');if (codeLines.length > 1) {codeLines[codeLines.length - 1] = 'return ' + codeLines[codeLines.length - 1];} else {codeLines[0] = 'return ' + codeLines[0];};const result = await eval(`(async () => { ${codeLines.join('\n')} })()`);let output;if (typeof result === 'object' && result !== null) {output = JSON.stringify(result, null, '\t');} else if (typeof result === 'function') {output = result.toString();} else {output = String(result);};return reply(output).catch(e => reply(String(e)));} catch (e) {return reply(String(e));};})();} catch (e){return reply(String(e));}};
 //FIM DAS EXECUÇÕES BB 🥵
 
 //ANTILINK DE GRUPOS :)
 if(isGroup && isAntiLinkGp && !isGroupAdmin && budy2.includes('chat.whatsapp.com') && isGroupAdmin) {
  if(isOwner) return;
  link_dgp = await nazu.groupInviteCode(from);
  if(budy2.match(link_dgp)) return;
  nazu.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: info.key.id, participant: sender}});
  if(!JSON.stringify(AllgroupMembers).includes(sender)) return;
  nazu.groupParticipantsUpdate(from, [sender], 'remove');
 };
 //FIM :)
 
 //BOT OFF
  const botStateFile = __dirname + '/../database/botState.json';
  let botState = { status: 'on' };
  if (fs.existsSync(botStateFile)) {
  botState = JSON.parse(fs.readFileSync(botStateFile));
  };
  if (botState.status === 'off' && !isOwner) return;

 //LOGS AQUI BBZIN <3
 console.log(`=========================================`);
 console.log(`${isCmd ? '⚒️ Comando' : '🗨️ Mensagem'} ${isGroup ? 'em grupo 👥' : 'no privado 👤'}`);
 console.log(`${isCmd ? '⚒️ Comando' : '🗨️ Mensagem'}: "${isCmd ? prefix+command : budy2.substring(0, 12)+'...'}"`);
 console.log(`${isGroup ? '👥 Grupo' : '👤 Usuario'}: "${isGroup ? groupName : pushname}"`);
 console.log(`${isGroup ? '👤 Usuario' : '📲 Numero'}: "${isGroup ? pushname : sender.split('@')[0]}"`);
 console.log(`=========================================`);
 //FIM DOS LOGS
 
 //JOGO DA VELHA
 if (isGroup) {
    if (tictactoe.hasPendingInvitation(from) && budy2) {
        const normalizedResponse = budy2.toLowerCase().trim();
        const result = tictactoe.processInvitationResponse(from, sender, normalizedResponse);
        if (result.success) {
            await nazu.sendMessage(from, { 
                text: result.message, 
                mentions: result.mentions || [] 
            });
        };
    };
    if (tictactoe.hasActiveGame(from) && budy2) {
        if (['tttend', 'rv', 'fimjogo'].includes(budy2)) {
            if (!isGroupAdmin) return reply(t.b.admin());
            const result = tictactoe.endGame(from);
            await reply(result.message);
            return;
        };
        const position = parseInt(budy2.trim());
        if (!isNaN(position)) {
            const result = tictactoe.makeMove(from, sender, position);
            if (result.success) {
                await nazu.sendMessage(from, { 
                    text: result.message, 
                    mentions: result.mentions || [sender] 
                });
            };
        };
        return;
    };
};


//VERIFICAR USUÁRIOS BLOQUEADOS (GRUPO)
if (isGroup && groupData.blockedUsers && (groupData.blockedUsers[sender] || groupData.blockedUsers[sender.split('@')[0]]) && isCmd) {
  return reply(`🚫 Você está bloqueado de usar o bot neste grupo!\nMotivo: ${groupData.blockedUsers[sender] ? groupData.blockedUsers[sender].reason : groupData.blockedUsers[sender.split('@')[0]].reason}`);
};

//VERIFICAR BLOQUEIOS (GLOBAL)
let globalBlocks = { commands: {}, users: {} };
if (fs.existsSync(__dirname + '/../database/globalBlocks.json')) {
  globalBlocks = JSON.parse(fs.readFileSync(__dirname + '/../database/globalBlocks.json'));
};
if (globalBlocks.users && (globalBlocks.users[sender.split('@')[0]] || globalBlocks.users[sender]) && isCmd) {
  return reply(`🚫 Você está bloqueado globalmente!\nMotivo: ${globalBlocks.users[sender] ? globalBlocks.users[sender].reason : globalBlocks.users[sender.split('@')[0]].reason}`);
};
if (isCmd && globalBlocks.commands && globalBlocks.commands[command]) {
  return reply(`🚫 O comando *${command}* está bloqueado globalmente!\nMotivo: ${globalBlocks.commands[command].reason}`);
};

 switch(command) {
  //INTELIGENCIA ARTIFICIAL
  
  case 'nazu': case 'nazuninha': case 'ai': 
  try {
    if (!q) return reply(t.b.digitarPrompt());
    nazu.react('💞');
    bahz = (await axios.post("https://api.cognima.com.br/api/ia/chat?key=CognimaTeamFreeKey", { message: q, chat_id: `nazuninha_${sender.split('@')[0]}`, model_name: "nazuninha", })).data;
    await reply(bahz.reply);
  } catch (e) {
    console.error(e);
    await reply(t.b.erro());
  }
  break;
  
  case 'gpt': case 'gpt4': case 'chatgpt':
  try {
    if (!q) return reply(t.b.digitarPrompt());
    nazu.react('🧠');
    bahz = (await axios.post("https://api.cognima.com.br/api/ia/chat?key=CognimaTeamFreeKey", { message: q, chat_id: `gpt_${sender.split('@')[0]}`, model_name: "gpt", })).data;
    await reply(bahz.reply);
  } catch (e) {
    console.error(e);
    await reply(t.b.erro());
  }
  break;
  
  case 'llama': case 'llama3': case 'llamachat':
  try {
    if (!q) return reply(t.b.digitarPrompt());
    nazu.react('🧠');
    bahz = (await axios.post("https://api.cognima.com.br/api/ia/chat?key=CognimaTeamFreeKey", { 
      message: q, 
      chat_id: `llama_${sender.split('@')[0]}`, 
      model_name: "llama" 
    })).data;
    await reply(bahz.reply);
  } catch (e) {
    console.error(e);
    await reply(t.b.erro());
  }
  break;
  
  case 'cognimai': case 'cog-base':
  try {
    if (!q) return reply(t.b.digitarPrompt());
    nazu.react('🤖');
    bahz = (await axios.post("https://api.cognima.com.br/api/ia/chat?key=CognimaTeamFreeKey", { 
      message: q, 
      chat_id: `cognimai_${sender.split('@')[0]}`, 
      model_name: "cognimai" 
    })).data;
    await reply(bahz.reply);
  } catch (e) {
    console.error(e);
    await reply(t.b.erro());
  }
  break;
  
  case 'qwen': case 'qwen2': case 'qwenchat':
  try {
    if (!q) return reply(t.b.digitarPrompt());
    nazu.react('🌠');
    bahz = (await axios.post("https://api.cognima.com.br/api/ia/chat?key=CognimaTeamFreeKey", { 
      message: q, 
      chat_id: `qwen_${sender.split('@')[0]}`, 
      model_name: "qwen"
    })).data;
    await reply(bahz.reply);
  } catch (e) {
    console.error(e);
    await reply(t.b.erro());
  }
  break;
  
  case 'gemma': case 'gemma2': case 'gecko':
  try {
    if (!q) return reply(t.b.digitarPrompt());
    nazu.react('💎');
    bahz = (await axios.post("https://api.cognima.com.br/api/ia/chat?key=CognimaTeamFreeKey", { 
      message: q, 
      chat_id: `gemma_${sender.split('@')[0]}`, 
      model_name: "gemma"
    })).data;
    await reply(bahz.reply);
  } catch (e) {
    console.error(e);
    await reply(t.b.erro());
  }
  break;
  
  case 'imagine': case 'img':
  try {
    const modelos = [
      "cognimai-realism",
      "cognimai-anime", 
      "cognimai-3d",
      "cognimai-cablyai",
      "cognimai-turbo",
      "cognimai-pro",
      "cognimai"
    ];
    if (!q) {
      let ajuda = `🖼️ *GERADOR DE IMAGENS* 🖼️\n\n`+`⚠️ Use: *${prefix}imagine modelo/prompt*\n\n`+`📝 *Modelos disponíveis:*\n`+`• realism (Padrão)\n`+`• anime\n`+`• 3d\n`+`• cablyai\n`+`• turbo\n`+`• pro\n\n`+`Exemplo: *${prefix}imagine anime/gato samurai*`;
      return reply(ajuda);
    };
    nazu.react('🔄');
    const [inputModelo, ...promptArray] = q.split('/');
    const prompt = promptArray.join('/').trim() || inputModelo.trim();
    const modeloEscolhido = inputModelo.trim().toLowerCase();
    const modelosParaTestar = modeloEscolhido && modelos.includes(`cognimai-${modeloEscolhido}`)
      ? [`cognimai-${modeloEscolhido}`]
      : modelos;
    for (const model of modelosParaTestar) {
      try {
        const url = `https://api.cognima.com.br/api/ia/image/generate?key=CognimaTeamFreeKey&prompt=${encodeURIComponent(prompt)}&model_name=${model}`;
        await nazu.sendMessage(from, { image: { url }, caption: `🎨 Modelo: ${model.replace('cognimai-', '') || 'padrão'}\n📌 Prompt: ${prompt}`});
        nazu.react('✅');
        return;
      } catch (e) {
        console.log(`❌ ${model} falhou, tentando próximo...`);
      }
    }

    await reply('❌ Todos os modelos falharam. Tente um prompt diferente.');
    nazu.react('❌');

  } catch (e) {
    console.error('Erro grave:', e);
    reply(t.b.erro());
  }
  break;
  
  case 'code-gen': try {
  if(!isPremium) return reply('Apenas usuários premium.');
  if(!q) return reply(t.b.digitarPrompt());
  nazu.react('✅');
  const response = await axios.get(`https://api.cognima.com.br/api/ia/code-gen?key=CognimaTeamFreeKey&q=${q}`, { responseType: 'arraybuffer' });
  const mimeType = response.headers['content-type'];
  const contentDisposition = response.headers['content-disposition'];
  let nomeArquivo = Date.now();
  if (contentDisposition) {
    const match = contentDisposition.match(/filename="?([^"]+)"?/);
    if (match) nomeArquivo = match[1];
  };
  if (!nomeArquivo.includes('.')) {
    const extensoes = { 'application/json': 'json', 'text/plain': 'txt', 'application/javascript': 'js', 'application/zip': 'zip', 'application/pdf': 'pdf' };
    nomeArquivo += '.' + (extensoes[mimeType] || 'bin');
  };
  await nazu.sendMessage(from, { document: response.data, mimetype: mimeType, fileName: nomeArquivo }, { quoted: info });
  } catch(e) {
  console.error(e);
  await reply(t.b.erro());
  };
  break
  
  case 'cog':
  try {
    if(!isPremium) return reply('Apenas usuários premium.');
    if (!q) return nazu.react('❌');

    await nazu.react('⚒️');

    const response = await axios.post("https://api.cognima.com.br/api/ia/chat?key=CognimaTeamFreeKey", {
      message: q,
      chat_id: `cog_ultra_${sender.split('@')[0]}`,
      model_name: "cognimai-ultra",
    });

    const resultPriv = response.data;
    if (!resultPriv.success) return reply(t.b.erro());

    let responseText = resultPriv.reply;
    if (resultPriv.sources.length > 0) {
      responseText += `\n\nFontes utilizadas:\n${resultPriv.sources.join('\n')}`;
    };

    if (resultPriv.file?.content) {
      await nazu.sendMessage(from, {
        document: Buffer.from(resultPriv.file.content, "utf-8"),
        fileName: resultPriv.file.filename,
        mimetype: resultPriv.file.mimetype,
        caption: responseText
      }, { quoted: info });
    } else {
      await reply(responseText);
    }
  } catch (e) {
    console.error(e);
    await reply(t.b.erro());
  }
  break;
  
  
  //FERRAMENTAS
  case 'encurtalink': case 'tinyurl': try {
  if(!q) return reply(`❌️ *Forma incorreta, use está como exemplo:* ${prefix + command} https://instagram.com/hiudyyy_`);
  anu = await axios.get(`https://tinyurl.com/api-create.php?url=${q}`);
  reply(`${anu.data}`);
  } catch(e) {
  console.error(e);
  await reply(t.b.erro());
  };
  break

  case 'nick': case 'gerarnick': try {
  if(!q) return reply('Digite o nick após o comando.');
  datzn = await styleText(q);
  await reply(datzn.join('\n'));
  } catch(e) {
  console.error(e);
  await reply(t.b.erro());
  };
  break
  
  case 'printsite': case 'ssweb': try{
  if(!q) return reply(`Cade o link?`)
  await nazu.react('✅');
  await nazu.sendMessage(from, {image: {url: `https://image.thum.io/get/fullpage/${q}`}}, {quoted: info})
  } catch(e) {
  console.error(e);
  await reply(t.b.erro());
  };
  break
  
  case 'upload':case 'imgpralink':case 'videopralink':case 'gerarlink': try {
  if(!isQuotedImage && !isQuotedVideo && !isQuotedDocument && !isQuotedAudio) return reply(`Marque um video, uma foto, um audio ou um documento`);
  var foto1 = isQuotedImage ? info.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage : {};
  var video1 = isQuotedVideo ? info.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage : {};
  var docc1 = isQuotedDocument ? info.message.extendedTextMessage.contextInfo.quotedMessage.documentMessage: {};
  var audio1 = isQuotedAudio ? info.message.extendedTextMessage.contextInfo.quotedMessage.audioMessage : "";
  let media = {};
  if(isQuotedDocument) {
  media = await getFileBuffer(docc1, "document");
  } else if(isQuotedVideo) {
  media = await getFileBuffer(video1, "video");
  } else if(isQuotedImage) {
  media = await getFileBuffer(foto1, "image");
  } else if(isQuotedAudio) {
  media = await getFileBuffer(audio1, "audio");
  };
  let linkz = await upload(media);
  await reply(`${linkz}`);
  } catch(e) {
  console.error(e);
  await reply(t.b.erro());
  }
  break

  
  //DOWNLOADS
  case 'assistir': try {
  if(!q) return reply('Cadê o nome do filme ou episódio de série? 🤔');
  await reply('Um momento, estou buscando as informações para você 🕵️‍♂️');
  datyz = await FilmesDL(q);
  if(!datyz || !datyz.url) return reply('Desculpe, não consegui encontrar nada. Tente com outro nome de filme ou série. 😔');
  anu = await axios.get(`https://tinyurl.com/api-create.php?url=${datyz.url}`);
  linkEncurtado = anu.data;
  await nazu.sendMessage(from, {image: { url: datyz.img },caption: `Aqui está o que encontrei! 🎬\n\n*Nome*: ${datyz.name}\n\nSe tudo estiver certo, você pode assistir no link abaixo:\n${linkEncurtado}\n\nFique tranquilo, não é vírus! O link foi encurtado por ser muito longo.\n\n> Você pode apoiar o projeto de outra forma! 💖 Que tal dar uma estrela no repositório do GitHub? Isso ajuda a motivar e melhorar o bot!\n> ⭐ https://github.com/hiudyy/nazuninha-bot 🌟`}, { quoted: info });
  } catch(e) {
  console.error(e);
  await reply(t.b.erro());
  };
  break;
  
  case 'apkmod':
case 'mod':
try {
if (!q) return reply('Digite o nome do aplicativo.');
datinha = await apkMod(q);
if (datinha.error) return reply(datinha.error);
anu = await axios.get(`https://tinyurl.com/api-create.php?url=${datinha.download}`);
linkEncurtado = anu.data;
await nazu.sendMessage(from, { image: { url: datinha.image }, caption: `\n💻 *Informações do Aplicativo*\n\n🔸 *Título:* ${datinha.title}\n🔹 *Descrição:*  \n_${datinha.description}_\n\n📋 *Detalhes Técnicos:*  \n- 📛 *Nome:* ${datinha.details.name}  \n- 🗓️ *Última Atualização:* ${datinha.details.updated}  \n- 🆚 *Versão:* ${datinha.details.version}  \n- 🏷️ *Categoria:* ${datinha.details.category}  \n- 🛠️ *Modificação:* ${datinha.details.modinfo}  \n- 📦 *Tamanho:* ${datinha.details.size}  \n- ⭐ *Classificação:* ${datinha.details.rate}  \n- 📱 *Requer Android:* ${datinha.details.requires}  \n- 👨‍💻 *Desenvolvedor:* ${datinha.details.developer}  \n- 🔗 *Google Play:* ${datinha.details.googleplay}  \n- 📥 *Downloads:* ${datinha.details.downloads}  \n\n⬇️ *Download do APK:*  \n📤 _Tentando enviar o APK para você..._  \nCaso não seja enviado, use o link abaixo:  \n🔗 ${linkEncurtado}` }, { quoted: info });
await nazu.sendMessage(from, { document: { url: datinha.download }, mimetype: 'application/vnd.android.package-archive', fileName: `${datinha.details.name}.apk`, caption: `🔒 *Instalação Bloqueada pelo Play Protect?* 🔒\n\nCaso a instalação do aplicativo seja bloqueada pelo Play Protect, basta seguir as instruções do vídeo abaixo:\n\n🎥 https://youtu.be/FqQB2vojzlU?si=9qPnu_PGj3GU3L4_`}, {quoted: info});
} catch (e) {
console.log(e);
await reply(t.b.erro());
};
break;
  
  case 'google': try {
  if(!q) return reply(t.b.formatoEspecifico('Texto', `${prefix}${command} Os Simpsons`));
  bahzhw = await google.search(q);
  if(!bahzhw.ok) return reply(t.b.erro());
  await nazu.sendMessage(from, {image: {url: bahzhw.image}, caption: bahzhw.text}, {quoted: info});
  } catch(e) {
  console.error(e);
  await reply(t.b.erro());
  };
  break;
  
  case 'mcplugin':case 'mcplugins': try {
  if(!q) return reply('Cadê o nome do plugin para eu pesquisar? 🤔');
  await nazu.react('🔍');
  datz = await mcPlugin(q);
  if(!datz.ok) return reply(datz.msg);
  await nazu.sendMessage(from, {image: {url: datz.image}, caption: `🔍 Encontrei esse plugin aqui:\n\n*Nome*: _${datz.name}_\n*Publicado por*: _${datz.creator}_\n*Descrição*: _${datz.desc}_\n*Link para download*: _${datz.url}_\n\n> 💖 `}, {quoted: info});
  } catch(e) {
  console.error(e);
  await reply(t.b.erro());
  };
  break
  
  case 'play':
  case 'ytmp3':
  try {
    if (!q) return reply(`Digite o nome da música.\n> Ex: ${prefix + command} Back to Black`);
    nazu.react(['💖']);
    datinha = await youtube.search(q);
    if(!datinha.ok) return reply(datinha.msg);
    await nazu.sendMessage(from, { image: { url: datinha.data.thumbnail }, caption: `🎵 *Música Encontrada* 🎵\n\n📌 *Nome:* ${datinha.data.title}\n👤 *Canal:* ${datinha.data.author.name}\n👀 *Visualizações:* ${datinha.data.views}\n🔗 *Link:* ${datinha.data.url}`, footer: `By: ${nomebot}` }, { quoted: info });
    dlRes = await youtube.mp3(datinha.data.url);
    if(!dlRes.ok) return reply(dlRes.msg);
    await nazu.sendMessage(from, {audio: {url: dlRes.url}, fileName: datinha.data.title, mimetype: 'audio/mp4'}, {quoted: info});
  } catch (e) {
    console.error(e);
    reply(t.b.erro());
  }
  break;
  
  case 'playvid':
  case 'ytmp4':
  try {
    if (!q) return reply(`Digite o nome da música.\n> Ex: ${prefix + command} Back to Black`);
    nazu.react(['💖']);
    datinha = await youtube.search(q);
    if(!datinha.ok) return reply(datinha.msg);
    await nazu.sendMessage(from, { image: { url: datinha.data.thumbnail }, caption: `🎵 *Música Encontrada* 🎵\n\n📌 *Nome:* ${datinha.data.title}\n👤 *Canal:* ${datinha.data.author.name}\n👀 *Visualizações:* ${datinha.data.views}\n🔗 *Link:* ${datinha.data.url}`, footer: `By: ${nomebot}` }, { quoted: info });
    dlRes = await youtube.mp4(datinha.data.url);
    if(!dlRes.ok) return reply(dlRes.msg);
    await nazu.sendMessage(from, {video: {url: dlRes.url}, fileName: datinha.data.title, mimetype: 'video/mp4'}, {quoted: info});
  } catch (e) {
    console.error(e);
    reply(t.b.erro());
  }
  break;
  
    
  case 'play2':
  case 'ytmp32':
  try {
    if (!q) return reply(`Digite o nome da música.\n> Ex: ${prefix + command} Back to Black`);
    nazu.react(['💖']);
    datinha = await youtube.search(q);
    if(!datinha.ok) return reply(datinha.msg);
    await nazu.sendMessage(from, { image: { url: datinha.data.thumbnail }, caption: `🎵 *Música Encontrada* 🎵\n\n📌 *Nome:* ${datinha.data.title}\n👤 *Canal:* ${datinha.data.author.name}\n👀 *Visualizações:* ${datinha.data.views}\n🔗 *Link:* ${datinha.data.url}`, footer: `By: ${nomebot}` }, { quoted: info });
    dlRes = await youtube.mp3v2(datinha.data.url);
    if(!dlRes.ok) return reply(dlRes.msg);
    await nazu.sendMessage(from, {audio: {url: dlRes.url}, fileName: datinha.data.title, mimetype: 'audio/mp4'}, {quoted: info});
  } catch (e) {
    console.error(e);
    reply(t.b.erro());
  }
  break;
  
  case 'playvid2':
  case 'ytmp42':
  try {
    if (!q) return reply(`Digite o nome da música.\n> Ex: ${prefix + command} Back to Black`);
    nazu.react(['💖']);
    datinha = await youtube.search(q);
    if(!datinha.ok) return reply(datinha.msg);
    await nazu.sendMessage(from, { image: { url: datinha.data.thumbnail }, caption: `🎵 *Música Encontrada* 🎵\n\n📌 *Nome:* ${datinha.data.title}\n👤 *Canal:* ${datinha.data.author.name}\n👀 *Visualizações:* ${datinha.data.views}\n🔗 *Link:* ${datinha.data.url}`, footer: `By: ${nomebot}` }, { quoted: info });
    dlRes = await youtube.mp4v2(datinha.data.url);
    if(!dlRes.ok) return reply(dlRes.msg);
    await nazu.sendMessage(from, {video: {url: dlRes.url}, fileName: datinha.data.title, mimetype: 'video/mp4'}, {quoted: info});
  } catch (e) {
    console.error(e);
    reply(t.b.erro());
  }
  break;
  
  case 'tiktok': case 'tiktokaudio': case 'tiktokvideo': case 'tiktoks': case 'tiktoksearch': case 'ttk': case 'tkk':
   try {
    if (!q) return reply(`Digite um nome ou o link de um vídeo.\n> Ex: ${prefix}${command} Gato`);
    nazu.react(['💖']);
    let isTikTokUrl = /^https?:\/\/(?:www\.|m\.|vm\.|t\.)?tiktok\.com\//.test(q);
    let datinha = await (isTikTokUrl ? tiktok.dl(q) : tiktok.search(q));
    if (!datinha.ok) return reply(datinha.msg);
    let bahzz = [];
    if(datinha.urls.length > 1) {
    for (const urlz of datinha.urls) {
        bahzz.push({type: datinha.type, [datinha.type]: { url: urlz }});
    };
    await nazu.sendAlbumMessage(from, bahzz, { quoted: info });
    } else {
    await nazu.sendMessage(from, { [datinha.type]: { url: datinha.urls[0] }}, {quoted: info});
    }
    if (datinha.audio) await nazu.sendMessage(from, { audio: { url: datinha.audio }, mimetype: 'audio/mp4' }, { quoted: info });
   } catch (e) {
    console.error(e);
    reply(t.b.erro());
   }
   break;
   
   case 'instagram': case 'igdl': case 'ig': case 'instavideo':
  try {
    if (!q) return reply(`Digite um link do Instagram.\n> Ex: ${prefix}${command} https://www.instagram.com/reel/DFaq_X7uoiT/?igsh=M3Q3N2ZyMWU1M3Bo`);
    nazu.react(['📌']);
    const datinha = await igdl.dl(q);
    if (!datinha.ok) return reply(datinha.msg);
    let bahzz = [];
    if(datinha.data.length > 1) {
    await Promise.all(datinha.data.map(urlz => bahzz.push({type: urlz.type, [urlz.type]: urlz.buff})));
    await nazu.sendAlbumMessage(from, bahzz, { quoted: info });
    } else {
    await nazu.sendMessage(from, {[datinha.data[0].type]: datinha.data[0].buff}, {quoted: info});
    };
  } catch (e) {
    console.error(e);
    reply(t.b.erro());
  }
  break;
    
  case 'pinterest': case 'pin': case 'pinterestdl': case 'pinterestsearch':
   try {
    if (!q) return reply(`Digite um nome ou envie um link do Pinterest.\n> Ex: ${prefix}${command} Gatos\n> Ex: ${prefix}${command} https://www.pinterest.com/pin/123456789/`);  
    nazu.react(['📌']); 
    let datinha = await (/^https?:\/\/(?:[a-zA-Z0-9-]+\.)?pinterest\.\w{2,6}(?:\.\w{2})?\/pin\/\d+|https?:\/\/pin\.it\/[a-zA-Z0-9]+/.test(q) ? pinterest.dl(q) : pinterest.search(q));
    if (!datinha.ok) return reply(datinha.msg);
    slakk = [];
    for (const urlz of datinha.urls) {
     slakk.push({[datinha.type]: {url: urlz}});
    };
    await nazu.sendAlbumMessage(from, slakk, { quoted: info });
   } catch (e) {
    console.error(e);
    reply(t.b.erro());
   }
   break;
   
   
   //MENUS AQUI BB
  case 'menu': case 'help':
  nazu.sendMessage(from, {[fs.existsSync(__dirname + '/../midias/menu.mp4') ? 'video' : 'image']: fs.readFileSync(fs.existsSync(__dirname+'/../midias/menu.mp4')?__dirname+'/../midias/menu.mp4':__dirname+'/../midias/menu.jpg'), caption: await menu(prefix, nomebot, pushname), gifPlayback: fs.existsSync(__dirname+'/../midias/menu.mp4'), mimetype: fs.existsSync(__dirname+'/../midias/menu.mp4')?'video/mp4':'image/jpeg'}, {quoted: info});
  break;

  case 'rpg': case 'menurpg':
  nazu.sendMessage(from, {[fs.existsSync(__dirname + '/../midias/menu.mp4') ? 'video' : 'image']: fs.readFileSync(fs.existsSync(__dirname+'/../midias/menu.mp4')?__dirname+'/../midias/menu.mp4':__dirname+'/../midias/menu.jpg'), caption: await menuRpg(prefix, nomebot, pushname), gifPlayback: fs.existsSync(__dirname+'/../midias/menu.mp4'), mimetype: fs.existsSync(__dirname+'/../midias/menu.mp4')?'video/mp4':'image/jpeg'}, {quoted: info});
  break;
  case 'menuia': case 'aimenu': case 'menuias':
  nazu.sendMessage(from, {[fs.existsSync(__dirname + '/../midias/menu.mp4') ? 'video' : 'image']: fs.readFileSync(fs.existsSync(__dirname+'/../midias/menu.mp4')?__dirname+'/../midias/menu.mp4':__dirname+'/../midias/menu.jpg'), caption: await menuIa(prefix, nomebot, pushname), gifPlayback: fs.existsSync(__dirname+'/../midias/menu.mp4'), mimetype: fs.existsSync(__dirname+'/../midias/menu.mp4')?'video/mp4':'image/jpeg'}, {quoted: info});
  break;
  case 'menubn': case 'menubrincadeira': case 'menubrincadeiras':
  nazu.sendMessage(from, {[fs.existsSync(__dirname + '/../midias/menu.mp4') ? 'video' : 'image']: fs.readFileSync(fs.existsSync(__dirname+'/../midias/menu.mp4')?__dirname+'/../midias/menu.mp4':__dirname+'/../midias/menu.jpg'), caption: await menubn(prefix, nomebot, pushname), gifPlayback: fs.existsSync(__dirname+'/../midias/menu.mp4'), mimetype: fs.existsSync(__dirname+'/../midias/menu.mp4')?'video/mp4':'image/jpeg'}, {quoted: info});
  break;
  case 'menudown': case 'menudownload': case 'menudownloads':
  nazu.sendMessage(from, {[fs.existsSync(__dirname + '/../midias/menu.mp4') ? 'video' : 'image']: fs.readFileSync(fs.existsSync(__dirname+'/../midias/menu.mp4')?__dirname+'/../midias/menu.mp4':__dirname+'/../midias/menu.jpg'), caption: await menudown(prefix, nomebot, pushname), gifPlayback: fs.existsSync(__dirname+'/../midias/menu.mp4'), mimetype: fs.existsSync(__dirname+'/../midias/menu.mp4')?'video/mp4':'image/jpeg'}, {quoted: info});
  break;
  case 'ferramentas': case 'menuferramentas': case 'menuferramenta':
  nazu.sendMessage(from, {[fs.existsSync(__dirname + '/../midias/menu.mp4') ? 'video' : 'image']: fs.readFileSync(fs.existsSync(__dirname+'/../midias/menu.mp4')?__dirname+'/../midias/menu.mp4':__dirname+'/../midias/menu.jpg'), caption: await menuFerramentas(prefix, nomebot, pushname), gifPlayback: fs.existsSync(__dirname+'/../midias/menu.mp4'), mimetype: fs.existsSync(__dirname+'/../midias/menu.mp4')?'video/mp4':'image/jpeg'}, {quoted: info});
  break;
  case 'menuadm': case 'menuadmin': case 'menuadmins':
  nazu.sendMessage(from, {[fs.existsSync(__dirname + '/../midias/menu.mp4') ? 'video' : 'image']: fs.readFileSync(fs.existsSync(__dirname+'/../midias/menu.mp4')?__dirname+'/../midias/menu.mp4':__dirname+'/../midias/menu.jpg'), caption: await menuadm(prefix, nomebot, pushname), gifPlayback: fs.existsSync(__dirname+'/../midias/menu.mp4'), mimetype: fs.existsSync(__dirname+'/../midias/menu.mp4')?'video/mp4':'image/jpeg'}, {quoted: info});
  break;
  case 'menumembros': case 'menumemb': case 'menugeral':
  nazu.sendMessage(from, {[fs.existsSync(__dirname + '/../midias/menu.mp4') ? 'video' : 'image']: fs.readFileSync(fs.existsSync(__dirname+'/../midias/menu.mp4')?__dirname+'/../midias/menu.mp4':__dirname+'/../midias/menu.jpg'), caption: await menuMembros(prefix, nomebot, pushname), gifPlayback: fs.existsSync(__dirname+'/../midias/menu.mp4'), mimetype: fs.existsSync(__dirname+'/../midias/menu.mp4')?'video/mp4':'image/jpeg'}, {quoted: info});
  break;
  case 'menudono': case 'ownermenu':
  nazu.sendMessage(from, {[fs.existsSync(__dirname + '/../midias/menu.mp4') ? 'video' : 'image']: fs.readFileSync(fs.existsSync(__dirname+'/../midias/menu.mp4')?__dirname+'/../midias/menu.mp4':__dirname+'/../midias/menu.jpg'), caption: await menuDono(prefix, nomebot, pushname), gifPlayback: fs.existsSync(__dirname+'/../midias/menu.mp4'), mimetype: fs.existsSync(__dirname+'/../midias/menu.mp4')?'video/mp4':'image/jpeg'}, {quoted: info});
  break;
  case 'stickermenu': case 'menusticker':case 'menufig':
  nazu.sendMessage(from, {[fs.existsSync(__dirname + '/../midias/menu.mp4') ? 'video' : 'image']: fs.readFileSync(fs.existsSync(__dirname+'/../midias/menu.mp4')?__dirname+'/../midias/menu.mp4':__dirname+'/../midias/menu.jpg'), caption: await menuSticker(prefix, nomebot, pushname), gifPlayback: fs.existsSync(__dirname+'/../midias/menu.mp4'), mimetype: fs.existsSync(__dirname+'/../midias/menu.mp4')?'video/mp4':'image/jpeg'}, {quoted: info});
  break;
   
   
  //COMANDOS DE DONO BB
  case 'boton':
case 'botoff':
  if (!isOwner) return reply(t.b.dono());
  try {
    const botStateFile = __dirname + '/../database/botState.json';
    let botState = { status: 'on' };
    if (fs.existsSync(botStateFile)) {
      botState = JSON.parse(fs.readFileSync(botStateFile));
    }

    const isOn = botState.status === 'on';
    if (command === 'boton' && isOn) {
      return reply('🌟 O bot já está ativado!');
    }
    if (command === 'botoff' && !isOn) {
      return reply('🌙 O bot já está desativado!');
    }

    botState.status = command === 'boton' ? 'on' : 'off';
    fs.writeFileSync(botStateFile, JSON.stringify(botState, null, 2));

    const message = command === 'boton'
      ? '✅ *Bot ativado!* Agora todos podem usar os comandos.'
      : '✅ *Bot desativado!* Apenas o dono pode usar comandos.';
    
    await reply(message);
    await nazu.react('🔄');
  } catch (e) {
    console.error(e);
    await reply(t.b.erro());
  }
break;

  case 'blockcmdg':
  if (!isOwner) return reply(t.b.dono());
  try {
    const cmdToBlock = q?.toLowerCase().split(' ')[0];
    const reason = q?.split(' ').slice(1).join(' ') || 'Sem motivo informado';
    if (!cmdToBlock) return reply('❌ Informe o comando a bloquear! Ex.: !blockcmd sticker');
    const blockFile = __dirname + '/../database/globalBlocks.json';
    globalBlocks.commands = globalBlocks.commands || {};
    globalBlocks.commands[cmdToBlock] = { reason, timestamp: Date.now() };
    fs.writeFileSync(blockFile, JSON.stringify(globalBlocks, null, 2));
    await reply(`✅ Comando *${cmdToBlock}* bloqueado globalmente!\nMotivo: ${reason}`);
    await nazu.react('🔒');
  } catch (e) {
    console.error(e);
    await reply(t.b.erro());
  }
  break;

  case 'unblockcmdg':
  if (!isOwner) return reply(t.b.dono());
  try {
    const cmdToUnblock = q?.toLowerCase().split(' ')[0];
    if (!cmdToUnblock) return reply('❌ Informe o comando a desbloquear! Ex.: !unblockcmd sticker');
    const blockFile = __dirname + '/../database/globalBlocks.json';
    if (!fs.existsSync(blockFile)) return reply('❌ Nenhum comando bloqueado!');
    if (!globalBlocks.commands || !globalBlocks.commands[cmdToUnblock]) {
      return reply(`❌ O comando *${cmdToUnblock}* não está bloqueado!`);
    }
    delete globalBlocks.commands[cmdToUnblock];
    fs.writeFileSync(blockFile, JSON.stringify(globalBlocks, null, 2));
    await reply(`✅ Comando *${cmdToUnblock}* desbloqueado globalmente!`);
    await nazu.react('🔓');
  } catch (e) {
    console.error(e);
    await reply(t.b.erro());
  }
  break;

  case 'blockuserg':
  if (!isOwner) return reply(t.b.dono());
  try {
    reason = q ? q.includes('@') ? q.includes(' ') ? q.split(' ').slice(1).join(' ') : "Não informado" : q : 'Não informado';
    menc_os3 = menc_os2.includes(' ') ? menc_os2.split(' ')[0] : menc_os2;
    if(!menc_os3) return reply(t.b.marcarAlguem());
    const blockFile = __dirname + '/../database/globalBlocks.json';
    globalBlocks.users = globalBlocks.users || {};
    globalBlocks.users[menc_os3] = { reason, timestamp: Date.now() };
    fs.writeFileSync(blockFile, JSON.stringify(globalBlocks, null, 2));
    await reply(`✅ Usuário @${menc_os3.split('@')[0]} bloqueado globalmente!\nMotivo: ${reason}`, { mentions: [menc_os3] });
    await nazu.react('🔒');
  } catch (e) {
    console.error(e);
    await reply(t.b.erro());
  }
  break;

  case 'unblockuserg':
  if (!isOwner) return reply(t.b.dono());
  try {
    if(!menc_os2) return reply(t.b.marcarAlguem());
    const blockFile = __dirname + '/../database/globalBlocks.json';
    if (!fs.existsSync(blockFile)) return reply('❌ Nenhum usuário bloqueado!');
    if (!globalBlocks.users || (!globalBlocks.users[menc_os2] && !globalBlocks.users[menc_os2.split('@')[0]])) {
      return reply(`❌ O usuário @${menc_os2.split('@')[0]} não está bloqueado!`, { mentions: [menc_os2] });
    }
    if (globalBlocks.users[menc_os2]) {
    delete globalBlocks.users[menc_os2];
    } else if (globalBlocks.users[menc_os2.split('@')[0]]) {
    delete globalBlocks.users[menc_os2.split('@')[0]];
    }
    fs.writeFileSync(blockFile, JSON.stringify(globalBlocks, null, 2));
    await reply(`✅ Usuário @${menc_os2.split('@')[0]} desbloqueado globalmente!`, { mentions: [menc_os2] });
    await nazu.react('🔓');
  } catch (e) {
    console.error(e);
    await reply(t.b.erro());
  }
  break;

  case 'listblocks':
  if (!isOwner) return reply(t.b.dono());
  try {
    const blockFile = __dirname + '/../database/globalBlocks.json';
    if (!fs.existsSync(blockFile)) return reply('❌ Nenhum bloqueio registrado!');
    const blockedCommands = globalBlocks.commands ? Object.entries(globalBlocks.commands).map(([cmd, data]) => `🔧 *${cmd}* - Motivo: ${data.reason}`).join('\n') : 'Nenhum comando bloqueado.';
    const blockedUsers = globalBlocks.users ? Object.entries(globalBlocks.users).map(([user, data]) => {const userId = user.split('@')[0]; return `👤 *${userId}* - Motivo: ${data.reason}`;}).join('\n') : 'Nenhum usuário bloqueado.';
    const message = `🔒 *Bloqueios Globais - ${nomebot}* 🔒\n\n📜 *Comandos Bloqueados*:\n${blockedCommands}\n\n👥 *Usuários Bloqueados*:\n${blockedUsers}`;    
    await reply(message);
    await nazu.react('✅');
  } catch (e) {
    console.error(e);
    await reply(t.b.erro());
  }
  break;

  case 'seradm': try {
  if(!isOwner) return reply(t.b.dono());
  await nazu.groupParticipantsUpdate(from, [sender], "promote");
  await nazu.react('✅');
  } catch(e) {
  console.error(e);
  await reply(t.b.erro());
  };
  break

  case 'sermembro': try {
  if(!isOwner) return reply(t.b.dono());
  await nazu.groupParticipantsUpdate(from, [sender], "demote");
  await nazu.react('✅');
  } catch(e) {
  console.error(e);
  await reply(t.b.erro());
  };
  break

   case 'prefixo':case 'numerodono':case 'nomedono':case 'nomebot': try {
    if(!isOwner) return reply(t.b.dono());
    if (!q) return reply(`Uso correto: ${prefix}${command} <valor>`);
     let config = JSON.parse(fs.readFileSync(__dirname + '/config.json'));
     config[command] = q;
     fs.writeFileSync(__dirname + '/config.json', JSON.stringify(config, null, 2));
     reply(`✅ ${command} atualizado para: *${q}*`);
   } catch (e) {
   console.error(e);
   reply(t.b.erro());
   };
  break;
  
  case 'fotomenu':case 'videomenu':case 'mediamenu':case 'midiamenu': try {
   if(!isOwner) return reply(t.b.dono());
   if(fs.existsSync(__dirname+'/../midias/menu.jpg')) fs.unlinkSync(__dirname+'/../midias/menu.jpg');
   if(fs.existsSync(__dirname+'/../midias/menu.mp4')) fs.unlinkSync(__dirname+'/../midias/menu.mp4');
   var RSM = info.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    var boij2 = RSM?.imageMessage || info.message?.imageMessage || RSM?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessage?.message?.imageMessage || RSM?.viewOnceMessage?.message?.imageMessage;
   var boij = RSM?.videoMessage || info.message?.videoMessage || RSM?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessage?.message?.videoMessage || RSM?.viewOnceMessage?.message?.videoMessage;
    if (!boij && !boij2) return reply(`Marque uma imagem ou um vídeo, com o comando: ${prefix + command} (mencionando a mídia)`);
    var isVideo2 = !!boij;
    var buffer = await getFileBuffer(isVideo2 ? boij : boij2, isVideo2 ? 'video' : 'image');
    fs.writeFileSync(__dirname+'/../midias/menu.' + (isVideo2 ? 'mp4' : 'jpg'), buffer);
    await reply('✅ Mídia do menu atualizada com sucesso.');
  } catch(e) {
   console.error(e);
   reply(t.b.erro());
  }
  break
  
  case 'bangp':case 'unbangp':case 'desbangp': try {
  if(!isGroup) return reply(t.b.grupo());
  if(!isOwner) return reply(t.b.dono());
  banGpIds[from] = !banGpIds[from];
  if(banGpIds[from]) {
  await reply('🚫 Grupo banido, apenas usuarios premium ou meu dono podem utilizar o bot aqui agora.');
  } else {
  await reply('✅ Grupo desbanido, todos podem utilizar o bot novamente.');
  };
  fs.writeFileSync(__dirname + `/../database/dono/bangp.json`, JSON.stringify(banGpIds));
  } catch(e) {
  console.error(e);
  await reply(t.b.erro());
  };
  break
  
  case 'addpremium':case 'addvip':
  try {
    if (!isOwner) return reply(t.b.dono());
    if (!menc_os2) return reply(t.b.marcarAlguem());
    if(!!premiumListaZinha[menc_os2]) return reply('O usuário ja esta na lista premium.');
    premiumListaZinha[menc_os2] = true;
    await nazu.sendMessage(from, {text: `✅ @${menc_os2.split('@')[0]} foi adicionado(a) a lista premium.`, mentions: [menc_os2] }, { quoted: info });
    fs.writeFileSync(__dirname + `/../database/dono/premium.json`, JSON.stringify(premiumListaZinha));
  } catch (e) {
    console.error(e);
    reply(t.b.erro());
  }
  break;
  
  case 'delpremium':case 'delvip':case 'rmpremium':case 'rmvip':
  try {
    if(!isOwner) return reply(t.b.dono());
    if(!menc_os2) return reply(t.b.marcarAlguem());
    if(!premiumListaZinha[menc_os2]) return reply('O usuário não esta na lista premium.');
    delete premiumListaZinha[menc_os2];
    await nazu.sendMessage(from, {text: `🫡 @${menc_os2.split('@')[0]} foi removido(a) da lista premium.`, mentions: [menc_os2] }, { quoted: info });
    fs.writeFileSync(__dirname + `/../database/dono/premium.json`, JSON.stringify(premiumListaZinha));
  } catch (e) {
    console.error(e);
    reply(t.b.erro());
  }
  break;
  
  case 'addpremiumgp':case 'addvipgp':
  try {
    if (!isOwner) return reply(t.b.dono());
    if (!isGroup) return reply(t.b.grupo());
    if(!!premiumListaZinha[from]) return reply('O grupo ja esta na lista premium.');
    premiumListaZinha[from] = true;
    await nazu.sendMessage(from, {text: `✅ O grupo foi adicionado a lista premium.` }, { quoted: info });
    fs.writeFileSync(__dirname + `/../database/dono/premium.json`, JSON.stringify(premiumListaZinha));
  } catch (e) {
    console.error(e);
    reply(t.b.erro());
  }
  break;
  
  case 'delpremiumgp':case 'delvipgp':case 'rmpremiumgp':case 'rmvipgp':
  try {
    if(!isOwner) return reply(t.b.dono());
    if (!isGroup) return reply(t.b.grupo());
    if(!premiumListaZinha[from]) return reply('O grupo não esta na lista premium.');
    delete premiumListaZinha[from];
    await nazu.sendMessage(from, {text: `🫡 O grupo foi removido da lista premium.` }, { quoted: info });
    fs.writeFileSync(__dirname + `/../database/dono/premium.json`, JSON.stringify(premiumListaZinha));
  } catch (e) {
    console.error(e);
    reply(t.b.erro());
  }
  break;
  
  
  //COMANDOS GERAIS
  case 'rvisu':case 'open':case 'revelar': try {
  await nazu.react("👀");
  var RSMM = info.message?.extendedTextMessage?.contextInfo?.quotedMessage
  var boij22 = RSMM?.imageMessage || info.message?.imageMessage || RSMM?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessage?.message?.imageMessage || RSMM?.viewOnceMessage?.message?.imageMessage;
  var boijj = RSMM?.videoMessage || info.message?.videoMessage || RSMM?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessage?.message?.videoMessage || RSMM?.viewOnceMessage?.message?.videoMessage;
  var boij33 = RSMM?.audioMessage || info.message?.audioMessage || RSMM?.viewOnceMessageV2?.message?.audioMessage || info.message?.viewOnceMessageV2?.message?.audioMessage || info.message?.viewOnceMessage?.message?.audioMessage || RSMM?.viewOnceMessage?.message?.audioMessage;
  if(boijj) {
  var px = boijj;
  px.viewOnce = false;
  px.video = {url: px.url};
  await nazu.sendMessage(from,px,{quoted:info});
  } else if(boij22) {
  var px = boij22;
  px.viewOnce = false;
  px.image = {url: px.url};
  await nazu.sendMessage(from,px,{quoted:info});
  } else if(boij33) {
  var px = boij33;
  px.viewOnce = false;
  px.audio = {url: px.url};
  await nazu.sendMessage(from,px,{quoted:info});
  } else {
  return reply('Por favor, *mencione uma imagem, video ou áudio em visualização única* para executar o comando.');
  };
  } catch(e) {
  console.error(e);
  await reply(t.b.erro());
  };
  break
  
  case 'rankativog':
  try {
    const userTotals = {};

    const groupFiles = fs.readdirSync(__dirname + '/../database/grupos').filter(file => file.endsWith('.json'));
    for (const file of groupFiles) {
      try {
        const groupData = JSON.parse(fs.readFileSync(__dirname + `/../database/grupos/${file}`));
        if (groupData.contador && Array.isArray(groupData.contador)) {
          groupData.contador.forEach(user => {
            const userId = user.id;
            if (!userTotals[userId]) {
              userTotals[userId] = {
                name: user.pushname || userId.split('@')[0],
                messages: 0,
                commands: 0,
                stickers: 0
              };
            }
            userTotals[userId].messages += (user.msg || 0);
            userTotals[userId].commands += (user.cmd || 0);
            userTotals[userId].stickers += (user.figu || 0);
          });
        }
      } catch (e) {
        console.error(`Erro ao ler ${file}:`, e);
      };
    };

    const rankedUsers = Object.entries(userTotals) .map(([id, data]) => ({ id, name: data.name, total: data.messages + data.commands + data.stickers, messages: data.messages, commands: data.commands, stickers: data.stickers})).filter(user => user.total > 0).sort((a, b) => b.total - a.total).slice(0, 5);
      
    const rankMessage = rankedUsers.length > 0 ? rankedUsers.map((user, index) => { const emoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅'; return `${emoji} *${index + 1}. @${user.id.split('@')[0]}* - ${user.total} interações\n` + `   💬 Msgs: ${user.messages} | ⚒️ Cmds: ${user.commands} | 🎨 Figus: ${user.stickers}`; }).join('\n\n') : 'Nenhum dado de atividade registrado.';

    const finalMessage = `🏆 *Ranking Global de Atividade - ${nomebot}* 🏆\n\n${rankMessage}\n\n✨ *Total de Usuários*: ${Object.keys(userTotals).length}\n📊 *Bot*: ${nomebot} by ${nomedono} ✨`;

    await nazu.sendMessage(from, { text: finalMessage, mentions: rankedUsers.map(user => user.id).filter(id => id.includes('@s.whatsapp.net')) }, { quoted: info });
  } catch (e) {
    console.error(e);
    await reply(t.b.erro());
  }
break;

  case 'rankativos': 
  case 'rankativo': try {
    if (!isGroup) return reply(t.b.grupo());
    blue67 = groupData.contador.sort((a, b) => ((a.figu == undefined ? a.figu = 0 : a.figu + a.msg + a.cmd) < (b.figu == undefined ? b.figu = 0 : b.figu + b.cmd + b.msg)) ? 0 : -1);
    menc = [];
    blad = `*🏆 Rank dos ${blue67.length < 10 ? blue67.length : 10} mais ativos do grupo:*\n`;
    for (i6 = 0; i6 < (blue67.length < 10 ? blue67.length : 10); i6++) {
        if (i6 != null) blad += `\n*🏅 ${i6 + 1}º Lugar:* @${blue67[i6].id.split('@')[0]}\n- mensagens encaminhadas: *${blue67[i6].msg}*\n- comandos executados: *${blue67[i6].cmd}*\n- Figurinhas encaminhadas: *${blue67[i6].figu}*\n`;
        if(!groupData.mark) groupData.mark = {};
        if(!['0', 'marca'].includes(groupData.mark[blue67[i6].id])) {
        menc.push(blue67[i6].id);
        };
    };
    await nazu.sendMessage(from, {text: blad, mentions: menc}, {quoted: info});
  } catch(e) {
  console.error(e);
  await reply(t.b.erro());
  };
  break;
  
  case 'rankinativos': 
  case 'rankinativo': try {
    if (!isGroup) return reply(t.b.grupo());
    blue67 = groupData.contador.sort((a, b) => (a.msg + a.cmd) - (b.msg + b.cmd));
    menc = [];
    blad = `*🗑️ Rank dos ${blue67.length < 10 ? blue67.length : 10} mais inativos do grupo:*\n`;
    for (i6 = 0; i6 < (blue67.length < 10 ? blue67.length : 10); i6++) {
        if (i6 != null) blad += `\n*🏅 ${i6 + 1}º Lugar:* @${blue67[i6].id.split('@')[0]}\n- mensagens encaminhadas: *${blue67[i6].msg}*\n- comandos executados: *${blue67[i6].cmd}*\n- Figurinhas encaminhadas: *${blue67[i6].figu}*\n`;
        if(!groupData.mark) groupData.mark = {};
        if(!['0', 'marca'].includes(groupData.mark[blue67[i6].id])) {
        menc.push(blue67[i6].id);
        };
    };
    await nazu.sendMessage(from, {text: blad, mentions: menc}, {quoted: info});
  } catch(e) {
  console.error(e);
  reply(t.b.erro());
  };
  break;
  
  case 'totalcmd':
  case 'totalcomando': try {
    fs.readFile(__dirname + '/index.js', 'utf8', async (err, data) => {
      if (err) throw err;
      const comandos = [...data.matchAll(/case [`'"](\w+)[`'"]/g)].map(m => m[1]);
      await nazu.sendMessage(from, {image: {url: `https://api.cognima.com.br/api/banner/counter?key=CognimaTeamFreeKey&num=${String(comandos.length)}&theme=miku`}, caption: `╭〔 🤖 *Meus Comandos* 〕╮\n`+`┣ 📌 Total: *${comandos.length}* comandos\n`+`╰━━━━━━━━━━━━━━━╯`}, { quoted: info });
    });
    } catch(e) {
    console.error(e);
    await reply(t.b.erro());
    }
  break;
 
 case 'meustatus':
  try {
    let groupMessages = 0;
    let groupCommands = 0;
    let groupStickers = 0;
    if (isGroup && groupData.contador && Array.isArray(groupData.contador)) {
      const userData = groupData.contador.find(u => u.id === sender);
      if (userData) {
        groupMessages = userData.msg || 0;
        groupCommands = userData.cmd || 0;
        groupStickers = userData.figu || 0;
      };
    };
    let totalMessages = 0;
    let totalCommands = 0;
    let totalStickers = 0;
    const groupFiles = fs.readdirSync(__dirname + '/../database/grupos').filter(file => file.endsWith('.json'));
    for (const file of groupFiles) {
      try {
        const groupData = JSON.parse(fs.readFileSync(__dirname + `/../database/grupos/${file}`));
        if (groupData.contador && Array.isArray(groupData.contador)) {
          const userData = groupData.contador.find(u => u.id === sender);
          if (userData) {
            totalMessages += (userData.msg || 0);
            totalCommands += (userData.cmd || 0);
            totalStickers += (userData.figu || 0);
          };
        };
      } catch (e) {
        console.error(`Erro ao ler ${file}:`, e);
      };
    };
    const userName = pushname || sender.split('@')[0];
    const userStatus = isOwner ? 'Dono' : isPremium ? 'Premium' : isGroupAdmin ? 'Admin' : 'Membro';
    let profilePic = null;
    try {
      profilePic = await nazu.profilePictureUrl(sender, 'image');
    } catch (e) {};
    const statusMessage = `📊 *Meu Status - ${userName}* 📊\n\n👤 *Nome*: ${userName}\n📱 *Número*: @${sender.split('@')[0]}\n⭐ *Status*: ${userStatus}\n\n${isGroup ? `\n📌 *No Grupo: ${groupName}*\n💬 Mensagens: ${groupMessages}\n⚒️ Comandos: ${groupCommands}\n🎨 Figurinhas: ${groupStickers}\n` : ''}\n\n🌐 *Geral (Todos os Grupos)*\n💬 Mensagens: ${totalMessages}\n⚒️ Comandos: ${totalCommands}\n🎨 Figurinhas: ${totalStickers}\n\n✨ *Bot*: ${nomebot} by ${nomedono} ✨`;
    if (profilePic) {
      await nazu.sendMessage(from, { image: { url: profilePic }, caption: statusMessage, mentions: [sender] }, { quoted: info });
    } else {
      await nazu.sendMessage(from, { text: statusMessage, mentions: [sender] }, { quoted: info });
    };
  } catch (e) {
    console.error(e);
    await reply(t.b.erro());
  };
  break;
  
  case 'statusbot':
  try {
    const uptime = process.uptime();
    const uptimeStr = `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`;
    const groups = await nazu.groupFetchAllParticipating();
    const totalGroups = Object.keys(groups).length;
    let totalMessages = 0;
    let totalCommands = 0;
    let totalStickers = 0;
    const groupFiles = fs.readdirSync(__dirname + '/../database/grupos').filter(file => file.endsWith('.json'));
    for (const file of groupFiles) {
      try {
        const groupData = JSON.parse(fs.readFileSync(__dirname + `/../database/grupos/${file}`));
        if (groupData.contador && Array.isArray(groupData.contador)) {
          groupData.contador.forEach(user => {
            totalMessages += (user.msg || 0);
            totalCommands += (user.cmd || 0);
            totalStickers += (user.figu || 0);
          });
        };
      } catch (e) {
        console.error(`Erro ao ler ${file}:`, e);
      };
    };
    const memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const { version } = JSON.parse(fs.readFileSync(__dirname + '/../../package.json'));
    const statusMessage = `📡 *Status do ${nomebot}* 📡\n\n⏳ *Tempo Online*: ${uptimeStr}\n👥 *Grupos*: ${totalGroups}\n💬 *Mensagens Totais*: ${totalMessages}\n⚒️ *Comandos Executados*: ${totalCommands}\n🎨 *Figurinhas Enviadas*: ${totalStickers}\n🧠 *Ram Usada*: ${memoryUsage} MB\n📌 *Versão*: ${version}\n\n✨ *Criado por*: ${nomedono} ✨
    `;
    await nazu.sendMessage(from, { text: statusMessage }, { quoted: info });
  } catch (e) {
    console.error(e);
    await reply(t.b.erro());
  };
  break;
  
  case 'statusgp': case 'dadosgp': try {
    if (!isGroup) return reply(t.b.grupo());
    const groupInfo = await nazu.groupMetadata(from);
    const totalMembers = groupInfo.participants.length;
    const totalAdmins = groupAdmins.length;
    const groupCreated = groupInfo.creation ? new Date(groupInfo.creation * 1000).toLocaleDateString('pt-BR') : 'Desconhecida';
    let totalMessages = 0;
    let totalCommands = 0;
    let totalStickers = 0;
    if (groupData.contador && Array.isArray(groupData.contador)) {
      groupData.contador.forEach(user => {
        totalMessages += (user.msg || 0);
        totalCommands += (user.cmd || 0);
        totalStickers += (user.figu || 0);
      });
    };
    const settings = [
      `🔞 Antiporn: ${isAntiPorn ? 'Ativado' : 'Desativado'}`,
      `🔗 Antilink: ${isAntiLinkGp ? 'Ativado' : 'Desativado'}`,
      `🎲 Modo Brincadeira: ${isModoBn ? 'Ativado' : 'Desativado'}`,
      `🧙 Modo RPG: ${isModoRpg ? 'Ativado' : 'Desativado'}`,
      `👑 Apenas Admins: ${isOnlyAdmin ? 'Ativado' : 'Desativado'}`
    ].join('\n');
    const statsMessage = `\n📊 *Estatísticas do Grupo: ${groupName}* 📊\n\n👥 *Total de Membros*: ${totalMembers}\n👑 *Administradores*: ${totalAdmins}\n📅 *Criado em*: ${groupCreated}\n💬 *Mensagens Totais*: ${totalMessages}\n⚒️ *Comandos Usados*: ${totalCommands}\n🎨 *Figurinhas Enviadas*: ${totalStickers}\n\n⚙️ *Configurações*:\n${settings}\n\n✨ *Bot*: ${nomebot} by ${nomedono} ✨`;
    await nazu.sendMessage(from, { text: statsMessage }, { quoted: info });
  } catch (e) {
    console.error(e);
    await reply(t.b.erro());
  }
break;

case 'ping':
  try {
    const timestamp = Date.now();
    const speedConverted = (Date.now() - (info.messageTimestamp * 1000)) / 1000;
    const config = JSON.parse(fs.readFileSync(__dirname + '/config.json'));
    function formatUptime(seconds) {
      let d = Math.floor(seconds / (24 * 3600));
      let h = Math.floor((seconds % (24 * 3600)) / 3600);
      let m = Math.floor((seconds % 3600) / 60);
      let s = Math.floor(seconds % 60);
      let uptimeStr = [];
      if (d > 0) uptimeStr.push(`${d}d`);
      if (h > 0) uptimeStr.push(`${h}h`);
      if (m > 0) uptimeStr.push(`${m}m`);
      if (s > 0) uptimeStr.push(`${s}s`);
      return uptimeStr.join(' ');
    };
    const uptimeBot = formatUptime(process.uptime());
    const uptimeSistema = formatUptime(os.uptime());
    const ramTotal = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
    const ramUso = ((os.totalmem() - os.freemem()) / 1024 / 1024 / 1024).toFixed(2);
    const cpuUso = os.loadavg()[0].toFixed(2);
    const cpuModelo = os.cpus()[0].model;
    const nodeVersao = process.version;
    var getGroups = await nazu.groupFetchAllParticipating();
    var groups = Object.entries(getGroups).map(entry => entry[1]);
    var totalGrupos = groups.length;
    const mensagem = `┏━〔 🤖 *STATUS DO BOT* 〕━┓\n\n📌 *Prefixo:* ${config.prefixo}\n👑 *Dono:* ${config.nomedono}\n🤖 *Nome:* ${config.nomebot}\n💬 *Grupos Ativos:* ${totalGrupos}\n\n🚀 *Latência:* ${speedConverted.toFixed(3)}s\n⏳ *Uptime do Bot:* ${uptimeBot}\n🖥 *Uptime do Sistema:* ${uptimeSistema}\n\n💾 *Memória:* ${ramUso} GB / ${ramTotal} GB\n⚡ *CPU:* ${cpuUso}%\n🔧 *Processador:* ${cpuModelo}\n📜 *Node.js:* ${nodeVersao}\n\n┗━━━━━━━━━━━━━━┛`;
    await nazu.sendMessage(from, { image: { url: `https://api.cognima.com.br/api/banner/counter?key=CognimaTeamFreeKey&num=${0.000>speedConverted ? "0" : String(speedConverted.toFixed(3)).replaceAll('.', '')}&theme=original` }, caption: mensagem }, { quoted: info });
  } catch (e) {
    console.error(e);
    reply(t.b.erro());
  };
  break;
  
  
  //COMANDOS DE FIGURINHAS
  case 'toimg':
  if(!isQuotedSticker) return reply('Por favor, *mencione um sticker* para executar o comando.');
  try {
  buff = await getFileBuffer(info.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage, 'sticker');
  await nazu.sendMessage(from, {image: buff}, {quoted: info});
  } catch(error) {
  await reply(t.b.erro());
  };
  break

  case 'qc': try {
  if(!q) return reply('Falta o texto.');
   let ppimg = "";
   try {
   ppimg = await nazu.profilePictureUrl(sender, 'image');
   } catch {
   ppimg = 'https://telegra.ph/file/b5427ea4b8701bc47e751.jpg'
   };
  const json = {"type": "quote","format": "png","backgroundColor": "#FFFFFF","width": 512,"height": 768,"scale": 2,"messages": [{"entities": [],"avatar": true,"from": {"id": 1,"name": pushname,"photo": {"url": ppimg}},"text": q,"replyMessage": {}}]};
  res = await axios.post('https://bot.lyo.su/quote/generate', json, {headers: {'Content-Type': 'application/json'}});
  await sendSticker(nazu, from, { sticker: Buffer.from(res.data.result.image, 'base64'), author: 'Hiudy', packname: 'By:', type: 'image' }, {quoted: info });
  } catch(e) {
  console.error(e);
  await reply(t.b.erro());
  };
  break;
  
  case 'emojimix': try {
  emoji1 = q.split(`/`)[0];emoji2 = q.split(`/`)[1];
  if(!q || !emoji1 || !emoji2) return reply(`Formato errado, utilize:\n${prefix}${command} emoji1/emoji2\nEx: ${prefix}${command} 🤓/🙄`);
  datzc = await emojiMix(emoji1, emoji2);
  await sendSticker(nazu, from, { sticker: {url: datzc}, author: 'Hiudy', packname: 'By:', type: 'image'}, { quoted: info });
  } catch(e) {
  console.error(e);
  await reply(t.b.erro());
  };
  break;
  
  case 'ttp': try {
  if(!q) return reply('Cadê o texto?');
  cor = ["f702ff","ff0202","00ff2e","efff00","00ecff","3100ff","ffb400","ff00b0","00ff95","efff00"];
  fonte = ["Days%20One","Domine","Exo","Fredoka%20One","Gentium%20Basic","Gloria%20Hallelujah","Great%20Vibes","Orbitron","PT%20Serif","Pacifico"];
  cores = cor[Math.floor(Math.random() * (cor.length))];
  fontes = fonte[Math.floor(Math.random() * (fonte.length))];
  await sendSticker(nazu, from, { sticker: {url: `https://huratera.sirv.com/PicsArt_08-01-10.00.42.png?profile=Example-Text&text.0.text=${q}&text.0.outline.color=000000&text.0.outline.blur=0&text.0.outline.opacity=55&text.0.color=${cores}&text.0.font.family=${fontes}&text.0.background.color=ff0000`}, author: 'Hiudy', packname: 'By:', type: 'image'}, { quoted: info });
  } catch(e) {
  console.error(e);
  await reply(t.b.erro());
  };
  break;
  
  case 'brat': try {
  if(!q) return reply(t.b.formatoEspecifico('Texto', `${prefix}${command} Nazu é a melhor 🥵`));
  await sendSticker(nazu, from, { sticker: {url: `https://api.cognima.com.br/api/image/brat?key=CognimaTeamFreeKey&texto=${encodeURIComponent(q)}`}, author: 'Hiudy', packname: 'By:', type: 'image'}, { quoted: info });
  } catch(e) {
  console.error(e);
  };
  break;
  
  case 'st':case 'stk':case 'sticker':case 's': try {
    var RSM = info.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    var boij2 = RSM?.imageMessage || info.message?.imageMessage || RSM?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessage?.message?.imageMessage || RSM?.viewOnceMessage?.message?.imageMessage;
   var boij = RSM?.videoMessage || info.message?.videoMessage || RSM?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessage?.message?.videoMessage || RSM?.viewOnceMessage?.message?.videoMessage;
    if (!boij && !boij2) return reply(`Marque uma imagem ou um vídeo de até 9.9 segundos para fazer figurinha, com o comando: ${prefix + command} (mencionando a mídia)`);
    var isVideo2 = !!boij;
    if (isVideo2 && boij.seconds > 9.9) return reply(`O vídeo precisa ter no máximo 9.9 segundos para ser convertido em figurinha.`);
    var buffer = await getFileBuffer(isVideo2 ? boij : boij2, isVideo2 ? 'video' : 'image')
    await sendSticker(nazu, from, { sticker: buffer, author: 'Hiudy', packname: 'By:', type: isVideo2 ? 'video' : 'image'}, { quoted: info });
  } catch(e) {
  console.error(e);
  await reply(t.b.erro());
  };
  break
  
  case 'figualeatoria':case 'randomsticker': try {
   await nazu.sendMessage(from, { sticker: { url: `https://raw.githubusercontent.com/badDevelopper/Testfigu/main/fig (${Math.floor(Math.random() * 8051)}).webp`}}, {quoted: info});
  } catch(e) {
  console.error(e);
  await reply(t.b.erro());
  };
  break;
  
  case 'rename':case 'roubar': try {
   if(!isQuotedSticker) return reply('Você usou de forma errada... Marque uma figurinha.')
   author = q.split(`/`)[0];packname = q.split(`/`)[1];
   if(!q || !author || !packname) return reply(`Formato errado, utilize:\n${prefix}${command} Autor/Pack\nEx: ${prefix}${command} By:/Hiudy`);
   encmediats = await getFileBuffer(info.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage, 'sticker');
   await sendSticker(nazu, from, { sticker: `data:image/jpeg;base64,${encmediats.toString('base64')}`, author: packname, packname: author, rename: true}, { quoted: info });
  } catch(e) {
  console.error(e);
  await reply(t.b.erro());
  };
  break;
  
  case 'rgtake': try {
  const [author, pack] = q.split('/');
  if (!q || !author || !pack) return reply(`Formato errado, utilize:\n${prefix}${command} Autor/Pack\nEx: ${prefix}${command} By:/Hiudy`);
  const filePath = __dirname + '/../database/users/take.json';
  const dataTake = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf-8')) : {};
  dataTake[sender] = { author, pack };
  fs.writeFileSync(filePath, JSON.stringify(dataTake, null, 2), 'utf-8');
  reply(`Autor e pacote salvos com sucesso!\nAutor: ${author}\nPacote: ${pack}`);
  } catch(e) {
  console.error(e);
  await reply(t.b.erro());
  };
  break;
  
  case 'take': try {
  if (!isQuotedSticker) return reply('Você usou de forma errada... Marque uma figurinha.');
  const filePath = __dirname + '/../database/users/take.json';
  if (!fs.existsSync(filePath)) return reply('Nenhum autor e pacote salvos. Use o comando *rgtake* primeiro.');
  const dataTake = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  if (!dataTake[sender]) return reply('Você não tem autor e pacote salvos. Use o comando *rgtake* primeiro.');
  const { author, pack } = dataTake[sender];
  const encmediats = await getFileBuffer(info.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage, 'sticker');
  await sendSticker(nazu, from, { sticker: `data:image/jpeg;base64,${encmediats.toString('base64')}`, author: pack, packname: author, rename: true }, { quoted: info });
  } catch(e) {
  console.error(e);
  await reply(t.b.erro());
  };
  break;
  
  //FIM COMANDOS DE FIGURINHAS
  
  
  case 'mention':
  try {
    if (!isGroup) return reply(t.b.grupo());
    if (!q) return reply(`📢 *Configuração de Marcações*\n\n🔧 Escolha como deseja ser mencionado:\n\n✅ *${prefix}mention all* → Marcado em tudo (marcações e jogos).\n📢 *${prefix}mention marca* → Apenas em marcações de administradores.\n🎮 *${prefix}mention games* → Somente em jogos do bot.\n🚫 *${prefix}mention 0* → Não será mencionado em nenhuma ocasião.`);
    let options = {  all: '✨ Você agora será mencionado em todas as interações do bot, incluindo marcações de administradores e os jogos!', marca: '📢 A partir de agora, você será mencionado apenas quando um administrador marcar.',games: '🎮 Você optou por ser mencionado somente em jogos do bot.', 0: '🔕 Silêncio ativado! Você não será mais mencionado pelo bot, nem em marcações nem em jogos.'};
    if (options[q.toLowerCase()] !== undefined) {
      if(!groupData.mark) groupData.mark = {};
      groupData.mark[sender] = q.toLowerCase();
      fs.writeFileSync(__dirname + `/../database/grupos/${from}.json`, JSON.stringify(groupData, null, 2));
      return reply(`*${options[q.toLowerCase()]}*`);
    }

    reply(`❌ Opção inválida! Use *${prefix}mention* para ver as opções.`);
  } catch (e) {
    console.error(e);
    reply(t.b.erro());
  }
  break;
  
  //COMANDOS DE ADM
  case 'deletar': case 'delete': case 'del':  case 'd':
  if(!isGroupAdmin) return reply(t.b.admin());
  if(!menc_prt) return reply(t.b.marcarMensagem());
  let stanzaId, participant;
    if (info.message.extendedTextMessage) {
        stanzaId = info.message.extendedTextMessage.contextInfo.stanzaId;
        participant = info.message.extendedTextMessage.contextInfo.participant || menc_prt;
    } else if (info.message.viewOnceMessage) {
        stanzaId = info.key.id;
        participant = info.key.participant || menc_prt;
    };
    try {
        await nazu.sendMessage(from, { delete: { remoteJid: from, fromMe: false, id: stanzaId, participant: participant } });
    } catch (error) {
        reply(t.b.erro());
    };
  break

 case 'blockuser':
  if (!isGroup) return reply(t.b.grupo());
  if (!isGroupAdmin) return reply(t.b.admin());
  try {
    if (!menc_os2) return reply(t.b.marcarAlguem());
    reason = q  ? q.includes('@')  ? q.includes(' ') ? q.split(' ').slice(1).join(' ')  : "Não informado" : q : 'Não informado';
    menc_os3 = menc_os2.includes(' ') ? menc_os2.split(' ')[0] : menc_os2;
    groupData.blockedUsers = groupData.blockedUsers || {};
    groupData.blockedUsers[menc_os3] = { reason, timestamp: Date.now() };
    fs.writeFileSync(groupFile, JSON.stringify(groupData, null, 2));
    await reply(`✅ Usuário @${menc_os3.split('@')[0]} bloqueado no grupo!\nMotivo: ${reason}`, { mentions: [menc_os3] });
  } catch (e) {
    console.error(e);
    await reply(t.b.erro());
  };
  break;

  case 'unblockuser':
  if (!isGroup) return reply(t.b.grupo());
  if (!isGroupAdmin) return reply(t.b.admin());
  try {
    if (!menc_os2) return reply(t.b.marcarAlguem());
    if (!groupData.blockedUsers || (!groupData.blockedUsers[menc_os2] && !groupData.blockedUsers[menc_os2.split('@')[0]])) return reply(`❌ O usuário @${menc_os2.split('@')[0]} não está bloqueado no grupo!`, { mentions: [menc_os2] });
    if (!delete groupData.blockedUsers[menc_os2]) {
    delete groupData.blockedUsers[menc_os2.split('@')[0]];
    }
    fs.writeFileSync(groupFile, JSON.stringify(groupData, null, 2));
    await reply(`✅ Usuário @${menc_os2.split('@')[0]} desbloqueado no grupo!`, { mentions: [menc_os2] });
  } catch (e) {
    console.error(e);
    await reply(t.b.erro());
  }
  break;

  case 'listblocksgp':
  if (!isGroup) return reply(t.b.grupo());
  if (!isGroupAdmin) return reply(t.b.admin());
  try {
    const blockedUsers = groupData.blockedUsers ? Object.entries(groupData.blockedUsers).map(([user, data]) => `👤 *${user.split('@')[0]}* - Motivo: ${data.reason}`).join('\n') : 'Nenhum usuário bloqueado no grupo.';
    const message = `🔒 *Usuários Bloqueados no Grupo - ${groupName}* 🔒\n\n${blockedUsers}`;
    await reply(message);
  } catch (e) {
    console.error(e);
    await reply(t.b.erro());
  }
  break;

  case 'banir':
  case 'ban':
  case 'b':
  case 'kick':
  try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isGroupAdmin) return reply(t.b.admin());
    if (!isBotAdmin) return reply(t.b.botAdm());
    if (!menc_os2) return reply(t.b.marcarAlguem());
    await nazu.groupParticipantsUpdate(from, [menc_os2], 'remove');
    reply(`✅ Usuário banido com sucesso!`);
  } catch (e) {
    console.error(e);
    reply(t.b.erro());
  }
  break;
  
    case 'linkgp':
    case 'linkgroup': try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isGroupAdmin) return reply(t.b.admin());
    if (!isBotAdmin) return reply(t.b.botAdm());
    linkgc = await nazu.groupInviteCode(from)
    await reply('https://chat.whatsapp.com/'+linkgc)
    } catch(e) {
    console.error(e);
    await reply(t.b.erro());
    };
    break

  case 'promover':
  try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isGroupAdmin) return reply(t.b.admin());
    if (!isBotAdmin) return reply(t.b.botAdm());
    if (!menc_os2) return reply(t.b.marcarAlguem());
    await nazu.groupParticipantsUpdate(from, [menc_os2], 'promote');
    reply(`✅ Usuário promovido a administrador!`);
  } catch (e) {
    console.error(e);
    reply(t.b.erro());
  }
  break;

  case 'rebaixar':
  try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isGroupAdmin) return reply(t.b.admin());
    if (!isBotAdmin) return reply(t.b.botAdm());
    if (!menc_os2) return reply(t.b.marcarAlguem());
    await nazu.groupParticipantsUpdate(from, [menc_os2], 'demote');
    reply(`✅ Usuário rebaixado com sucesso!`);
  } catch (e) {
    console.error(e);
    reply(t.b.erro());
  }
  break;

  case 'setname':
  try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isGroupAdmin) return reply(t.b.admin());
    if (!isBotAdmin) return reply(t.b.botAdm());
    const newName = q.trim();
    if (!newName) return reply('❌ Digite um novo nome para o grupo.');
    await nazu.groupUpdateSubject(from, newName);
    reply(`✅ Nome do grupo alterado para: *${newName}*`);
  } catch (e) {
    console.error(e);
    reply(t.b.erro());
  }
  break;

  case 'setdesc':
  try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isGroupAdmin) return reply(t.b.admin());
    if (!isBotAdmin) return reply(t.b.botAdm());
    const newDesc = q.trim();
    if (!newDesc) return reply('❌ Digite uma nova descrição para o grupo.');
    await nazu.groupUpdateDescription(from, newDesc);
    reply(`✅ Descrição do grupo alterada!`);
  } catch (e) {
    console.error(e);
    reply(t.b.erro());
  }
  break;
  
  case 'marcar':
  if (!isGroup) return reply(t.b.grupo());
  if (!isGroupAdmin) return reply(t.b.admin());
  if (!isBotAdmin) return reply(t.b.botAdm());
  try {
    let path = __dirname + '/../database/grupos/' + from + '.json';
    let data = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : { mark: {} };
    if(!data.mark) data.mark = {};
    let membros = AllgroupMembers.filter(m => !['0', 'games'].includes(data.mark[m]));
    if (!membros.length) return reply('❌ Nenhum membro para mencionar.');
    let msg = `📢 *Membros mencionados:* ${q ? `\n💬 *Mensagem:* ${q}` : ''}\n\n`;
    await nazu.sendMessage(from, {text: msg + membros.map(m => `➤ @${m.split('@')[0]}`).join('\n'), mentions: membros});
  } catch (e) {
    console.error(e);
    reply(t.b.erro());
  }
  break;
  
  case 'grupo': try {
  if (!isGroup) return reply(t.b.grupo());
  if (!isGroupAdmin) return reply(t.b.admin());
  if (!isBotAdmin) return reply(t.b.botAdm());
  if(q.toLowerCase() === 'a' || q.toLowerCase() === 'abrir') {
  await nazu.groupSettingUpdate(from, 'not_announcement');
  await reply('Grupo aberto.');
  } else if(q.toLowerCase() === 'f' || q.toLowerCase() === 'fechar') {
  await nazu.groupSettingUpdate(from, 'announcement');
  await reply('Grupo fechado.');
  }} catch(e) {
  console.error(e);
  await reply(t.b.erro());
  };
  break
  
  case 'totag':
  case 'cita':
  case 'hidetag': try {
  if (!isGroup) return reply(t.b.grupo());
  if (!isGroupAdmin) return reply(t.b.admin());
  if (!isBotAdmin) return reply(t.b.botAdm());
    
    var DFC4 = "";
    var rsm4 = info.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    var pink4 = isQuotedImage ? rsm4?.imageMessage : info.message?.imageMessage;
    var blue4 = isQuotedVideo ? rsm4?.videoMessage : info.message?.videoMessage;
    var purple4 = isQuotedDocument ? rsm4?.documentMessage : info.message?.documentMessage;
    var yellow4 = isQuotedDocW ? rsm4?.documentWithCaptionMessage?.message?.documentMessage : info.message?.documentWithCaptionMessage?.message?.documentMessage;
    var aud_d4 = isQuotedAudio ? rsm4.audioMessage : "";
    var figu_d4 = isQuotedSticker ? rsm4.stickerMessage : "";
    var red4 = isQuotedMsg && !aud_d4 && !figu_d4 && !pink4 && !blue4 && !purple4 && !yellow4 ? rsm4.conversation : info.message?.conversation;
    var green4 = rsm4?.extendedTextMessage?.text || info?.message?.extendedTextMessage?.text;
    let path = __dirname + '/../database/grupos/' + from + '.json';
    let data = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : { mark: {} };
    if(!data.mark) data.mark = {};
    var MRC_TD4 = AllgroupMembers.filter(m => !['0', 'games'].includes(data.mark[m]));

    if (pink4 && !aud_d4 && !purple4) {
        var DFC4 = pink4;
        pink4.caption = q.length > 1 ? q : pink4.caption.replace(new RegExp(prefix + command, "gi"), ` `);
        pink4.image = { url: pink4.url };
        pink4.mentions = MRC_TD4;
    } else if (blue4 && !aud_d4 && !purple4) {
        var DFC4 = blue4;
        blue4.caption = q.length > 1 ? q.trim() : blue4.caption.replace(new RegExp(prefix + command, "gi"), ` `).trim();
        blue4.video = { url: blue4.url };
        blue4.mentions = MRC_TD4;
    } else if (red4 && !aud_d4 && !purple4) {
        var black4 = {};
        black4.text = red4.replace(new RegExp(prefix + command, "gi"), ` `).trim();
        black4.mentions = MRC_TD4;
        var DFC4 = black4;
    } else if (!aud_d4 && !figu_d4 && green4 && !purple4) {
        var brown4 = {};
        brown4.text = green4.replace(new RegExp(prefix + command, "gi"), ` `).trim();
        brown4.mentions = MRC_TD4;
        var DFC4 = brown4;
    } else if (purple4) {
        var DFC4 = purple4;
        purple4.document = { url: purple4.url };
        purple4.mentions = MRC_TD4;
    } else if (yellow4 && !aud_d4) {
        var DFC4 = yellow4;
        yellow4.caption = q.length > 1 ? q.trim() : yellow4.caption.replace(new RegExp(prefix + command, "gi"), `${pushname}\n\n`).trim();
        yellow4.document = { url: yellow4.url };
        yellow4.mentions = MRC_TD4;
    } else if (figu_d4 && !aud_d4) {
        var DFC4 = figu_d4;
        figu_d4.sticker = { url: figu_d4.url };
        figu_d4.mentions = MRC_TD4;
    } else if (aud_d4) {
        var DFC4 = aud_d4;
        aud_d4.audio = { url: aud_d4.url };
        aud_d4.mentions = MRC_TD4;
        aud_d4.ptt = true;
    };
    await nazu.sendMessage(from, DFC4).catch((error) => {});
    } catch(e) {
    console.error(e);
    await reply(t.b.erro());
    };
    break;
    
    case 'modobrincadeira': case 'modobrincadeiras': case 'modobn': try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isGroupAdmin) return reply(t.b.admin());
    const groupFilePath = __dirname + `/../database/grupos/${from}.json`;
    if (!groupData.modobrincadeira || groupData.modobrincadeira === undefined) {
        groupData.modobrincadeira = true;
    } else {
        groupData.modobrincadeira = !groupData.modobrincadeira;
    };
    fs.writeFileSync(groupFilePath, JSON.stringify(groupData));
    if (groupData.modobrincadeira) {
        await reply('🎉 *Modo de Brincadeiras ativado!* Agora o grupo está no modo de brincadeiras. Divirta-se!');
    } else {
        await reply('⚠️ *Modo de Brincadeiras desativado!* O grupo não está mais no modo de brincadeiras.');
    }} catch(e) {
    console.error(e);
    await reply(t.b.erro());
    };
    break;
    
    case 'bemvindo': case 'bv': case 'boasvindas': try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isGroupAdmin) return reply(t.b.admin());
    const groupFilePath = __dirname + `/../database/grupos/${from}.json`;   
    if (!groupData.bemvindo || groupData.bemvindo === undefined) {
        groupData.bemvindo = true;
    } else {
        groupData.bemvindo = !groupData.bemvindo;
    };
    fs.writeFileSync(groupFilePath, JSON.stringify(groupData));
    if (groupData.bemvindo) {
        await reply(`✅ *Boas-vindas ativadas!* Agora, novos membros serão recebidos com uma mensagem personalizada.\n📝 Para configurar a mensagem, use: *${prefixo}legendabv*`);
    } else {
        await reply('⚠️ *Boas-vindas desativadas!* O grupo não enviará mais mensagens para novos membros.');
    }} catch(e) {
    console.error(e);
    await reply(t.b.erro());
    };
    break;
    
   case 'fotobv':
   case 'welcomeimg': {
  if (!isGroup) return reply(t.b.grupo());
  if (!isGroupAdmin) return reply(t.b.admin());
  if (!isQuotedImage && !isImage) return reply('❌ Marque uma imagem ou envie uma imagem com o comando!');

  try {
      const imgMessage = isQuotedImage
        ? info.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage
        : info.message.imageMessage;
      const media = await getFileBuffer(imgMessage, 'image');
      const uploadResult = await upload(media);
      if (!uploadResult) throw new Error('Falha ao fazer upload da imagem');
      if (!groupData.welcome) groupData.welcome = {};
      groupData.welcome.image = uploadResult;
      fs.writeFileSync(__dirname + `/../database/grupos/${from}.json`, JSON.stringify(groupData, null, 2));
    await reply('✅ Foto de boas-vindas configurada com sucesso!');
  } catch (error) {
    console.error(error);
    reply(t.b.erro());
  }
}
break;

   case 'fotosaida': case 'fotosaiu': case 'imgsaiu': case 'exitimg': {
     if (!isGroup) return reply(t.b.grupo());
     if (!isGroupAdmin) return reply(t.b.admin());
     if (!isQuotedImage && !isImage) return reply('❌ Marque uma imagem ou envie uma imagem com o comando!');
     try {
       const media = await getFileBuffer(
         isQuotedImage ? info.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage : info.message.imageMessage,
         'image'
       );
       const uploadResult = await upload(media);
       if (!uploadResult) throw new Error('Falha ao fazer upload da imagem');
       if (!groupData.exit) groupData.exit = {};
       groupData.exit.image = uploadResult;
       fs.writeFileSync(__dirname + `/../database/grupos/${from}.json`, JSON.stringify(groupData, null, 2));
       await reply('✅ Foto de saída configurada com sucesso!');
     } catch (error) {
       console.error(error);
       reply(t.b.erro());
     };
   };
   break;

   case 'configsaida': case 'textsaiu': case 'legendasaiu': case 'exitmsg': {
     if (!isGroup) return reply(t.b.grupo());
     if (!isGroupAdmin) return reply(t.b.admin());
     if (!q) return reply(`📝 Para configurar a mensagem de saída, use:\n${prefix}${command} <mensagem>\n\nVocê pode usar:\n#numerodele# - Menciona quem saiu\n#nomedogp# - Nome do grupo\n#membros# - Total de membros\n#desc# - Descrição do grupo`);
     try {
       if (!groupData.exit) groupData.exit = {};
       groupData.exit.enabled = true;
       groupData.exit.text = q;
       fs.writeFileSync(__dirname + `/../database/grupos/${from}.json`, JSON.stringify(groupData, null, 2));
       await reply('✅ Mensagem de saída configurada com sucesso!\n\n📝 Mensagem definida como:\n' + q);
     } catch (error) {
       console.error(error);
       await reply(t.b.erro());
     }
   }
   break;

   case 'saida': case 'exit': {
     if (!isGroup) return reply(t.b.grupo());
     if (!isGroupAdmin) return reply(t.b.admin());
     try {
       if (!groupData.exit) groupData.exit = {};
       groupData.exit.enabled = !groupData.exit.enabled;
       fs.writeFileSync(__dirname + `/../database/grupos/${from}.json`, JSON.stringify(groupData, null, 2));
       await reply(groupData.exit.enabled ? '✅ Mensagens de saída ativadas!' : '❌ Mensagens de saída desativadas!');
     } catch (error) {
       console.error(error);
       await reply(t.b.erro());
     };
   };
   break;

   case 'modorpg': try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isGroupAdmin) return reply(t.b.admin());
    if (!groupData.modorpg) {
      groupData.modorpg = true;
      fs.writeFileSync(__dirname + `/../database/grupos/${from}.json`, JSON.stringify(groupData, null, 2));
      reply('✅ *Modo RPG ativado!* Agora os comandos de RPG estão disponíveis no grupo.');
    } else {
      groupData.modorpg = false;
      fs.writeFileSync(__dirname + `/../database/grupos/${from}.json`, JSON.stringify(groupData, null, 2));
      reply('⚠️ *Modo RPG desativado!* Os comandos de RPG não estão mais disponíveis.');
    };
   } catch(e) {
   console.error(e);
   await reply(t.b.erro());
   };
   break;
   
    case 'soadm': case 'onlyadm': case 'soadmin': try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isGroupAdmin) return reply(t.b.admin());
    const groupFilePath = __dirname + `/../database/grupos/${from}.json`;   
    if (!groupData.soadm || groupData.soadm === undefined) {
        groupData.soadm = true;
    } else {
        groupData.soadm = !groupData.soadm;
    };
    fs.writeFileSync(groupFilePath, JSON.stringify(groupData));
    if (groupData.soadm) {
        await reply(`✅ *Modo apenas adm ativado!* Agora apenas administrdores do grupo poderam utilizar o bot*`);
    } else {
        await reply('⚠️ *Modo apenas adm desativado!* Agora todos os membros podem utilizar o bot novamente.');
    }} catch(e) {
    console.error(e);
    reply(t.b.erro());
    };
    break;
    
    case 'antilinkgp':
    try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isGroupAdmin) return reply(t.b.admin());
    if (!isBotAdmin) return reply(t.b.botAdm());
    const groupFilePath = __dirname + `/../database/grupos/${from}.json`;
    let groupData = fs.existsSync(groupFilePath) ? JSON.parse(fs.readFileSync(groupFilePath)) : { antilinkgp: false };
    groupData.antilinkgp = !groupData.antilinkgp;
    fs.writeFileSync(groupFilePath, JSON.stringify(groupData));
    const message = groupData.antilinkgp ? `✅ *Antilinkgp foi ativado com sucesso!*\n\nAgora, se alguém enviar links de outros grupos, será banido automaticamente. Mantenha o grupo seguro! 🛡️` : `✅ *Antilinkgp foi desativado.*\n\nLinks de outros grupos não serão mais bloqueados. Use com cuidado! ⚠️`;
     reply(`${message}`);
    } catch (e) {
     console.error(e);
     reply(t.b.erro());
    }
    break;
    
    case 'antiporn':
    try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isGroupAdmin) return reply(t.b.admin());
    if (!isBotAdmin) return reply(t.b.botAdm());

    const groupFilePath = __dirname + `/../database/grupos/${from}.json`;
    let groupData = fs.existsSync(groupFilePath) ? JSON.parse(fs.readFileSync(groupFilePath)) : { antiporn: false };
    groupData.antiporn = !groupData.antiporn;
    fs.writeFileSync(groupFilePath, JSON.stringify(groupData));
    const message = groupData.antiporn ? `✅ *Antiporn foi ativado com sucesso!*\n\nAgora, se alguém enviar conteúdo adulto (NSFW), será banido automaticamente. Mantenha o grupo seguro e adequado! 🛡️` : `✅ *Antiporn foi desativado.*\n\nConteúdo adulto não será mais bloqueado. Use com responsabilidade! ⚠️`;

    reply(`${message}`);
    } catch (e) {
     console.error(e);
     reply(t.b.erro());
    }
    break;
    
    case 'antigore':
    try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isGroupAdmin) return reply(t.b.admin());
    if (!isBotAdmin) return reply(t.b.botAdm());
    const groupFilePath = __dirname + `/../database/grupos/${from}.json`;
    let groupData = fs.existsSync(groupFilePath) ? JSON.parse(fs.readFileSync(groupFilePath)) : { antigore: false };
    groupData.antigore = !groupData.antigore;
    fs.writeFileSync(groupFilePath, JSON.stringify(groupData));
    const message = groupData.antigore ? `✅ *Antigore foi ativado com sucesso!*\n\nAgora, se alguém enviar conteúdo gore, será banido automaticamente. Mantenha o grupo seguro e saudável! 🛡️` : `✅ *Antigore foi desativado.*\n\nConteúdo gore não será mais bloqueado. Use com cuidado! ⚠️`;
    reply(`${message}`);
  } catch (e) {
    console.error(e);
    reply(t.b.erro());
  }
  break;
    
    case 'modonsfw':
    case 'modo+18':
    try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isGroupAdmin) return reply(t.b.admin());
    const groupFilePath = __dirname + `/../database/grupos/${from}.json`;
    let groupData = fs.existsSync(groupFilePath) ? JSON.parse(fs.readFileSync(groupFilePath)) : { nsfwMode: false };
    groupData.nsfwMode = !groupData.nsfwMode;
    fs.writeFileSync(groupFilePath, JSON.stringify(groupData));
    if (groupData.nsfwMode) {
      await nazu.sendMessage(from, {text: `🔞 *Modo +18 ativado!*`,}, { quoted: info });
    } else {
      await nazu.sendMessage(from, {text: `✅ *Modo +18 desativado!.*`,}, { quoted: info });
    }
    } catch (e) {
     console.error(e);
     reply(t.b.erro());
    }
    break;
    
    case 'legendabv': case 'textbv': try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isGroupAdmin) return reply(t.b.admin());
    const groupFilePath = __dirname + `/../database/grupos/${from}.json`;
    if (!q) return reply(`📝 *Configuração da Mensagem de Boas-Vindas*\n\nPara definir uma mensagem personalizada, digite o comando seguido do texto desejado. Você pode usar as seguintes variáveis:\n\n- *#numerodele#* → Marca o novo membro.\n- *#nomedogp#* → Nome do grupo.\n- *#desc#* → Descrição do grupo.\n- *#membros#* → Número total de membros no grupo.\n\n📌 *Exemplo:*\n${prefixo}legendabv Bem-vindo(a) #numerodele# ao grupo *#nomedogp#*! Agora somos #membros# membros. Leia a descrição: #desc#`);
    groupData.textbv = q;
    fs.writeFileSync(groupFilePath, JSON.stringify(groupData));
    reply(`✅ *Mensagem de boas-vindas configurada com sucesso!*\n\n📌 Nova mensagem:\n"${groupData.textbv}"`);
    } catch(e) {
    console.error(e);
    await reply(t.b.erro());
    };
  break;
  
  case 'mute':
  case 'mutar':
  try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isGroupAdmin) return reply(t.b.admin());
    if (!isBotAdmin) return reply(t.b.botAdm());
    if (!menc_os2) return reply(t.b.marcarAlguem());
    const groupFilePath = __dirname + `/../database/grupos/${from}.json`;
    let groupData = fs.existsSync(groupFilePath) ? JSON.parse(fs.readFileSync(groupFilePath)) : { mutedUsers: {} };
    groupData.mutedUsers = groupData.mutedUsers || {};
    groupData.mutedUsers[menc_os2] = true;
    fs.writeFileSync(groupFilePath, JSON.stringify(groupData));
    await nazu.sendMessage(from, {text: `✅ @${menc_os2.split('@')[0]} foi mutado. Se enviar mensagens, será banido.`, mentions: [menc_os2] }, { quoted: info });
  } catch (e) {
    console.error(e);
    reply(t.b.erro());
  }
  break;
  
  case 'desmute':
  case 'desmutar':
  try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isGroupAdmin) return reply(t.b.admin());
    if (!menc_os2) return reply(t.b.marcarAlguem());
    const groupFilePath = __dirname + `/../database/grupos/${from}.json`;
    let groupData = fs.existsSync(groupFilePath) ? JSON.parse(fs.readFileSync(groupFilePath)) : { mutedUsers: {} };
    groupData.mutedUsers = groupData.mutedUsers || {};
    if (groupData.mutedUsers[menc_os2]) {
      delete groupData.mutedUsers[menc_os2];
      fs.writeFileSync(groupFilePath, JSON.stringify(groupData));
      await nazu.sendMessage(from, {text: `✅ @${menc_os2.split('@')[0]} foi desmutado e pode enviar mensagens novamente.`, mentions: [menc_os2]}, { quoted: info });
    } else {
      reply('❌ Este usuário não está mutado.');
    }
  } catch (e) {
    console.error(e);
    reply(t.b.erro());
  }
  break;
  
  case 'blockcmd':
  try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isGroupAdmin) return reply(t.b.admin());
    if (!q) return reply('❌ Digite o comando que deseja bloquear. Exemplo: /blockcmd sticker');
    const groupFilePath = __dirname + `/../database/grupos/${from}.json`;
    let groupData = fs.existsSync(groupFilePath) ? JSON.parse(fs.readFileSync(groupFilePath)) : { blockedCommands: {} };
    groupData.blockedCommands = groupData.blockedCommands || {};
    groupData.blockedCommands[q.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replaceAll(prefix, '')] = true;
    fs.writeFileSync(groupFilePath, JSON.stringify(groupData));
    reply(`✅ O comando *${q.trim()}* foi bloqueado e só pode ser usado por administradores.`);
  } catch (e) {
    console.error(e);
    reply(t.b.erro());
  }
  break;
    
  case 'unblockcmd':
  try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isGroupAdmin) return reply(t.b.admin());
    if (!q) return reply('❌ Digite o comando que deseja desbloquear. Exemplo: /unblockcmd sticker');
    const groupFilePath = __dirname + `/../database/grupos/${from}.json`;
    let groupData = fs.existsSync(groupFilePath) ? JSON.parse(fs.readFileSync(groupFilePath)) : { blockedCommands: {} };
    groupData.blockedCommands = groupData.blockedCommands || {};
    if (groupData.blockedCommands[q.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replaceAll(prefix, '')]) {
      delete groupData.blockedCommands[q.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replaceAll(prefix, '')];
      fs.writeFileSync(groupFilePath, JSON.stringify(groupData));
      reply(`✅ O comando *${q.trim()}* foi desbloqueado e pode ser usado por todos.`);
    } else {
      reply('❌ Este comando não está bloqueado.');
    }
  } catch (e) {
    console.error(e);
    reply(t.b.erro());
  }
  break;
    
    
    //JOGO DA VELHA
    case 'ttt': case 'jogodavelha': {
    if (!isGroup) return reply(t.b.grupo());
    if (!menc_os2) return reply(t.b.marcarAlguem());
    const result = await tictactoe.invitePlayer(from, sender, menc_os2);
    await nazu.sendMessage(from, {
        text: result.message,
        mentions: result.mentions
    });
    break;
   };
   
    //COMANDOS DE BRINCADEIRAS
   
   case 'eununca': try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isModoBn) return reply('❌ O modo brincadeira não esta ativo nesse grupo');
    await nazu.sendMessage(from, {poll: {name: toolsJson().iNever[Math.floor(Math.random() * toolsJson().iNever.length)],values: ["Eu nunca", "Eu ja"], selectableCount: 1}, messageContextInfo: { messageSecret: Math.random()}}, {from, options: {userJid: nazu?.user?.id}})
   } catch(e) {
   console.error(e);
   await reply(t.b.erro());
   };
   break
   
   case 'vab': try {
   if (!isGroup) return reply(t.b.grupo());
   if (!isModoBn) return reply('❌ O modo brincadeira não esta ativo nesse grupo');
   const vabs = vabJson()[Math.floor(Math.random() * vabJson().length)];
   await nazu.sendMessage(from, {poll: {name: 'O que você prefere?',values: [vabs.option1, vabs.option2], selectableCount: 1}, messageContextInfo: { messageSecret: Math.random()}}, {from, options: {userJid: nazu?.user?.id}})
   } catch(e) {
   console.error(e);
   await reply(t.b.erro());
   };
   break
   
   case 'gay': case 'burro': case 'inteligente': case 'otaku': case 'fiel': case 'infiel': case 'corno':  case 'gado': case 'gostoso': case 'feio': case 'rico': case 'pobre': case 'pirocudo': case 'pirokudo': case 'nazista': case 'ladrao': case 'safado': case 'vesgo': case 'bebado': case 'machista': case 'homofobico': case 'racista': case 'chato': case 'sortudo': case 'azarado': case 'forte': case 'fraco': case 'pegador': case 'otario': case 'macho': case 'bobo': case 'nerd': case 'preguicoso': case 'trabalhador': case 'brabo': case 'lindo': case 'malandro': case 'simpatico': case 'engracado': case 'charmoso': case 'misterioso': case 'carinhoso': case 'desumilde': case 'humilde': case 'ciumento': case 'corajoso': case 'covarde': case 'esperto': case 'talarico': case 'chorao': case 'brincalhao': case 'bolsonarista': case 'petista': case 'comunista': case 'lulista': case 'traidor': case 'bandido': case 'cachorro': case 'vagabundo': case 'pilantra': case 'mito': case 'padrao': case 'comedia': case 'psicopata': case 'fortao': case 'magrelo': case 'bombado': case 'chefe': case 'presidente': case 'rei': case 'patrao': case 'playboy': case 'zueiro': case 'gamer': case 'programador': case 'visionario': case 'billionario': case 'poderoso': case 'vencedor': case 'senhor': try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isModoBn) return reply('❌ O modo brincadeira não esta ativo nesse grupo');
    let gamesData = fs.existsSync(__dirname + '/funcs/json/games.json') ? JSON.parse(fs.readFileSync(__dirname + '/funcs/json/games.json')) : { games: {} };
    const target = menc_os2 ? menc_os2 : sender;
    const targetName = `@${target.split('@')[0]}`;
    const level = Math.floor(Math.random() * 101);
    let responses = fs.existsSync(__dirname + '/funcs/json/gamestext.json') ? JSON.parse(fs.readFileSync(__dirname + '/funcs/json/gamestext.json')) : {};
    const responseText = responses[command].replaceAll('#nome#', targetName).replaceAll('#level#', level) || `📊 ${targetName} tem *${level}%* de ${command}! 🔥`;
    const media = gamesData.games[command]
    if (media?.image) {
        await nazu.sendMessage(from, { image: media.image, caption: responseText, mentions: [target] });
    } else if (media?.video) {
        await nazu.sendMessage(from, { video: media.video, caption: responseText, mentions: [target], gifPlayback: true});
    } else {
        await nazu.sendMessage(from, {text: responseText, mentions: [target]});
    };
} catch(e) {
console.error(e);
await reply(t.b.erro());
};
break;

   case 'lesbica': case 'burra': case 'inteligente': case 'otaku': case 'fiel': case 'infiel': case 'corna': case 'gado': case 'gostosa': case 'feia': case 'rica': case 'pobre': case 'bucetuda': case 'nazista': case 'ladra': case 'safada': case 'vesga': case 'bebada': case 'machista': case 'homofobica': case 'racista': case 'chata': case 'sortuda': case 'azarada': case 'forte': case 'fraca': case 'pegadora': case 'otaria': case 'boba': case 'nerd': case 'preguicosa': case 'trabalhadora': case 'braba': case 'linda': case 'malandra': case 'simpatica': case 'engracada': case 'charmosa': case 'misteriosa': case 'carinhosa': case 'desumilde': case 'humilde': case 'ciumenta': case 'corajosa': case 'covarde': case 'esperta': case 'talarica': case 'chorona': case 'brincalhona': case 'bolsonarista': case 'petista': case 'comunista': case 'lulista': case 'traidora': case 'bandida': case 'cachorra': case 'vagabunda': case 'pilantra': case 'mito': case 'padrao': case 'comedia': case 'psicopata': case 'fortona': case 'magrela': case 'bombada': case 'chefe': case 'presidenta': case 'rainha': case 'patroa': case 'playboy': case 'zueira': case 'gamer': case 'programadora': case 'visionaria': case 'bilionaria': case 'poderosa': case 'vencedora': case 'senhora': try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isModoBn) return reply('❌ O modo brincadeira não esta ativo nesse grupo');
    let gamesData = fs.existsSync(__dirname + '/funcs/json/games.json') ? JSON.parse(fs.readFileSync(__dirname + '/funcs/json/games.json')) : { games: {} };
    const target = menc_os2 ? menc_os2 : sender;
    const targetName = `@${target.split('@')[0]}`;
    const level = Math.floor(Math.random() * 101);
    let responses = fs.existsSync(__dirname + '/funcs/json/gamestext2.json') ? JSON.parse(fs.readFileSync(__dirname + '/funcs/json/gamestext2.json')) : {};
    const responseText = responses[command].replaceAll('#nome#', targetName).replaceAll('#level#', level) || `📊 ${targetName} tem *${level}%* de ${command}! 🔥`;
    const media = gamesData.games[command]
    if (media?.image) {
        await nazu.sendMessage(from, { image: media.image, caption: responseText, mentions: [target] });
    } else if (media?.video) {
        await nazu.sendMessage(from, { video: media.video, caption: responseText, mentions: [target], gifPlayback: true});
    } else {
        await nazu.sendMessage(from, {text: responseText, mentions: [target]});
    };
} catch(e) {
console.error(e);
await reply(t.b.erro());
};
break;

case 'rankgay': case 'rankburro': case 'rankinteligente': case 'rankotaku': case 'rankfiel': case 'rankinfiel': case 'rankcorno': case 'rankgado': case 'rankgostoso': case 'rankrico': case 'rankpobre': case 'rankforte': case 'rankpegador': case 'rankmacho': case 'ranknerd': case 'ranktrabalhador': case 'rankbrabo': case 'ranklindo': case 'rankmalandro': case 'rankengracado': case 'rankcharmoso': case 'rankvisionario': case 'rankpoderoso': case 'rankvencedor':case 'rankgays': case 'rankburros': case 'rankinteligentes': case 'rankotakus': case 'rankfiels': case 'rankinfieis': case 'rankcornos': case 'rankgados': case 'rankgostosos': case 'rankricos': case 'rankpobres': case 'rankfortes': case 'rankpegadores': case 'rankmachos': case 'ranknerds': case 'ranktrabalhadores': case 'rankbrabos': case 'ranklindos': case 'rankmalandros': case 'rankengracados': case 'rankcharmosos': case 'rankvisionarios': case 'rankpoderosos': case 'rankvencedores': try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isModoBn) return reply('❌ O modo brincadeira não está ativo nesse grupo.');
    let path = __dirname + '/../database/grupos/' + from + '.json';
    let gamesData = fs.existsSync(__dirname + '/funcs/json/games.json') ? JSON.parse(fs.readFileSync(__dirname + '/funcs/json/games.json')) : { ranks: {} };
    let data = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : { mark: {} };
    let membros = AllgroupMembers.filter(m => !['0', 'marca'].includes(data.mark[m]));
    if (membros.length < 5) return reply('❌ Membros insuficientes para formar um ranking.');
    let top5 = membros.sort(() => Math.random() - 0.5).slice(0, 5);
    let cleanedCommand = command.endsWith('s') ? command.slice(0, -1) : command;
    let ranksData = fs.existsSync(__dirname + '/funcs/json/ranks.json') ? JSON.parse(fs.readFileSync(__dirname + '/funcs/json/ranks.json')) : { ranks: {} };
    let responseText = ranksData[cleanedCommand] || `📊 *Ranking de ${cleanedCommand.replace('rank', '')}*:\n\n`;
    top5.forEach((m, i) => {
        responseText += `🏅 *#${i + 1}* - @${m.split('@')[0]}\n`;
    });
    let media = gamesData.ranks[cleanedCommand];
    if (media?.image) {
        await nazu.sendMessage(from, { image: media.image, caption: responseText, mentions: top5 });
    } else if (media?.video) {
        await nazu.sendMessage(from, { video: media.video, caption: responseText, mentions: top5, gifPlayback: true });
    } else {
        await nazu.sendMessage(from, { text: responseText, mentions: top5 });
    }
} catch(e) {
console.error(e);
await reply(t.b.erro());
};
break;

case 'ranklesbica': case 'rankburra': case 'rankinteligente': case 'rankotaku': case 'rankfiel': case 'rankinfiel': case 'rankcorna': case 'rankgada': case 'rankgostosa': case 'rankrica': case 'rankpobre': case 'rankforte': case 'rankpegadora': case 'ranknerd': case 'ranktrabalhadora': case 'rankbraba': case 'ranklinda': case 'rankmalandra': case 'rankengracada': case 'rankcharmosa': case 'rankvisionaria': case 'rankpoderosa': case 'rankvencedora':case 'ranklesbicas': case 'rankburras': case 'rankinteligentes': case 'rankotakus': case 'rankfiels': case 'rankinfieis': case 'rankcornas': case 'rankgads': case 'rankgostosas': case 'rankricas': case 'rankpobres': case 'rankfortes': case 'rankpegadoras': case 'ranknerds': case 'ranktrabalhadoras': case 'rankbrabas': case 'ranklindas': case 'rankmalandras': case 'rankengracadas': case 'rankcharmosas': case 'rankvisionarias': case 'rankpoderosas': case 'rankvencedoras': try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isModoBn) return reply('❌ O modo brincadeira não está ativo nesse grupo.');
    let path = __dirname + '/../database/grupos/' + from + '.json';
    let gamesData = fs.existsSync(__dirname + '/funcs/json/games.json') ? JSON.parse(fs.readFileSync(__dirname + '/funcs/json/games.json')) : { ranks: {} };
    let data = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : { mark: {} };
    let membros = AllgroupMembers.filter(m => !['0', 'marca'].includes(data.mark[m]));
    if (membros.length < 5) return reply('❌ Membros insuficientes para formar um ranking.');
    let top5 = membros.sort(() => Math.random() - 0.5).slice(0, 5);
    let cleanedCommand = command.endsWith('s') ? command.slice(0, -1) : command;
    let ranksData = fs.existsSync(__dirname + '/funcs/json/ranks.json') ? JSON.parse(fs.readFileSync(__dirname + '/funcs/json/ranks.json')) : { ranks: {} };
    let responseText = ranksData[cleanedCommand]+'\n\n' || `📊 *Ranking de ${cleanedCommand.replace('rank', '')}*:\n\n`;
    top5.forEach((m, i) => {
        responseText += `🏅 *#${i + 1}* - @${m.split('@')[0]}\n`;
    });
    let media = gamesData.ranks[cleanedCommand];
    if (media?.image) {
        await nazu.sendMessage(from, { image: media.image, caption: responseText, mentions: top5 });
    } else if (media?.video) {
        await nazu.sendMessage(from, { video: media.video, caption: responseText, mentions: top5, gifPlayback: true });
    } else {
        await nazu.sendMessage(from, { text: responseText, mentions: top5 });
    }
} catch(e) {
console.error(e);
await reply(t.b.erro());
};
break;

case 'chute': case 'chutar': case 'tapa': case 'soco': case 'socar': case 'beijo': case 'beijar': case 'beijob': case 'beijarb': case 'abraco': case 'abracar': case 'mata': case 'matar': case 'tapar': case 'goza': case 'gozar': case 'mamar': case 'mamada': case 'cafune': case 'morder': case 'mordida': case 'lamber': case 'lambida': case 'explodir': try {
    if (!isGroup) return reply(t.b.grupo());
    if (!isModoBn) return reply('❌ O modo brincadeira não está ativo nesse grupo.');
    if(!menc_os2) return reply('Marque um usuário.');
    let gamesData = fs.existsSync(__dirname + '/funcs/json/games.json') ? JSON.parse(fs.readFileSync(__dirname + '/funcs/json/games.json')) : { games2: {} };
    let GamezinData = fs.existsSync(__dirname + '/funcs/json/markgame.json') ? JSON.parse(fs.readFileSync(__dirname + '/funcs/json/markgame.json')) : { ranks: {} };
    let responseText = GamezinData[command].replaceAll('#nome#', `@${menc_os2.split('@')[0]}`) || `Voce acabou de dar um(a) ${command} no(a) @${menc_os2.split('@')[0]}`;
    let media = gamesData.games2[command];
    if (media?.image) {
        await nazu.sendMessage(from, { image: media.image, caption: responseText, mentions: [menc_os2] });
    } else if (media?.video) {
        await nazu.sendMessage(from, { video: media.video, caption: responseText, mentions: [menc_os2], gifPlayback: true });
    } else {
        await nazu.sendMessage(from, { text: responseText, mentions: [menc_os2] });
    };
} catch(e) {
console.error(e);
await reply(t.b.erro());
};
   break;






//SITEMA DE RPG EM TESTE
    case 'registrar':
    case 'reg':
        try {
            if (!isGroup) return reply('⚠️ Este comando só pode ser usado em grupos.');
            if (!isModoRpg) return reply('⚠️ O modo RPG precisa estar ativo.');
            const DadosRpReg = await rpg(sender);
            if (DadosRpReg) return reply(`🌟 Você já está registrado como ${DadosRpReg.nome}.`);
            if (!q) return reply(`📜 Digite seu nome.\nExemplo: ${prefix}registrar João`);
            if (q.length > 15) return reply('📛 O nome não pode ter mais de 15 caracteres.');
            const registrar = await rpg.rg(sender, q);
            return reply(registrar.msg);
        } catch (e) {
            console.error('Erro no comando registrar:', e);
            return reply('❌ Erro ao executar o comando registrar.');
        }
        break;

    case 'deletar':
    case 'delrg':
        try {
            if (!isGroup) return reply('⚠️ Este comando só pode ser usado em grupos.');
            if (!isModoRpg) return reply('⚠️ O modo RPG precisa estar ativo.');
            const DadosRpDel = await rpg(sender);
            if (!DadosRpDel) return reply('⚠️ Você não está registrado.');
            if (!q || q !== '1') return reply(`⚠️ Confirme a exclusão com: ${prefix}${command} 1`);
            const deletarRegistro = await rpg.del(sender);
            return reply(deletarRegistro.msg);
        } catch (e) {
            console.error('Erro no comando deletar:', e);
            return reply('❌ Erro ao executar o comando deletar.');
        }
        break;

    // Banco
    case 'saldo':
    case 'banco':
        try {
            if (!isGroup) return reply('⚠️ Este comando só pode ser usado em grupos.');
            if (!isModoRpg) return reply('⚠️ O modo RPG precisa estar ativo.');
            const DadosRpSaldo = await rpg(sender);
            if (!DadosRpSaldo) return reply('⚠️ Você não está registrado.');
            return reply(`🏦 *INFORMAÇÕES BANCÁRIAS* 🏦\n\nBanco: NazuBank\nNome: ${DadosRpSaldo.nome}\nSaldo no Banco: R$${DadosRpSaldo.saldo.banco}\nSaldo na Carteira: R$${DadosRpSaldo.saldo.carteira}`);
        } catch (e) {
            console.error('Erro no comando saldo:', e);
            return reply('❌ Erro ao executar o comando saldo.');
        }
        break;

    case 'depositar':
        try {
            if (!isGroup) return reply('⚠️ Este comando só pode ser usado em grupos.');
            if (!isModoRpg) return reply('⚠️ O modo RPG precisa estar ativo.');
            const DadosRpDep = await rpg(sender);
            if (!DadosRpDep) return reply('⚠️ Você não está registrado.');
            if (!q || isNaN(q)) return reply(`💰 Digite um valor válido.\nExemplo: ${prefix}depositar 50`);
            if (DadosRpDep.saldo.carteira < Number(q)) return reply('💸 Saldo insuficiente.');
            if (!await rpg.depositar(sender, Number(q))) return reply('❌ Erro ao depositar.');
            return reply(`💰 Você depositou R$${q}.`);
        } catch (e) {
            console.error('Erro no comando depositar:', e);
            return reply('❌ Erro ao executar o comando depositar.');
        }
        break;

    case 'sacar':
        try {
            if (!isGroup) return reply('⚠️ Este comando só pode ser usado em grupos.');
            if (!isModoRpg) return reply('⚠️ O modo RPG precisa estar ativo.');
            const DadosRpSacar = await rpg(sender);
            if (!DadosRpSacar) return reply('⚠️ Você não está registrado.');
            if (!q || isNaN(q)) return reply(`💰 Digite um valor válido.\nExemplo: ${prefix}sacar 50`);
            if (DadosRpSacar.saldo.banco < Number(q)) return reply('💸 Saldo insuficiente no banco.');
            if (!await rpg.sacar(sender, Number(q))) return reply('❌ Erro ao sacar.');
            return reply(`💰 Você sacou R$${q}.`);
        } catch (e) {
            console.error('Erro no comando sacar:', e);
            return reply('❌ Erro ao executar o comando sacar.');
        }
        break;

    case 'depoall':
        try {
            if (!isGroup) return reply('⚠️ Este comando só pode ser usado em grupos.');
            if (!isModoRpg) return reply('⚠️ O modo RPG precisa estar ativo.');
            const DadosRpDepAll = await rpg(sender);
            if (!DadosRpDepAll) return reply('⚠️ Você não está registrado.');
            if (DadosRpDepAll.saldo.carteira <= 0) return reply('💸 Sem ouro na carteira para depositar.');
            if (!await rpg.depoall(sender)) return reply('❌ Erro ao depositar tudo.');
            return reply(`💰 Você depositou todo o saldo da carteira no banco.`);
        } catch (e) {
            console.error('Erro no comando depoall:', e);
            return reply('❌ Erro ao executar o comando depoall.');
        }
        break;

    case 'saqueall':
        try {
            if (!isGroup) return reply('⚠️ Este comando só pode ser usado em grupos.');
            if (!isModoRpg) return reply('⚠️ O modo RPG precisa estar ativo.');
            const DadosRpSaqueAll = await rpg(sender);
            if (!DadosRpSaqueAll) return reply('⚠️ Você não está registrado.');
            if (DadosRpSaqueAll.saldo.banco <= 0) return reply('💸 Sem ouro no banco para sacar.');
            if (!await rpg.saqueall(sender)) return reply('❌ Erro ao sacar tudo.');
            return reply(`💰 Você sacou todo o saldo do banco para a carteira.`);
        } catch (e) {
            console.error('Erro no comando saqueall:', e);
            return reply('❌ Erro ao executar o comando saqueall.');
        }
        break;

    case 'pix':
    case 'transferir':
        try {
            if (!isGroup) return reply('⚠️ Este comando só pode ser usado em grupos.');
            if (!isModoRpg) return reply('⚠️ O modo RPG precisa estar ativo.');
            const DadosRpPix = await rpg(sender);
            if (!DadosRpPix) return reply('⚠️ Você não está registrado.');
            if (!q) return reply(`💸 Digite o usuário e valor: ${prefix}pix @usuario/valor`);
            let destinatario, valor;
            if (q.includes('@')) {
                [destinatario, valor] = q.replace(/ /g, '').split('/');
                destinatario = destinatario.split('@')[1] + '@s.whatsapp.net';
            } else {
                if (!menc_os2) return reply('📌 Marque quem deseja enviar o pix.');
                destinatario = menc_os2;
                valor = q;
            }
            if (!destinatario) return reply('📌 Está faltando o destinatário.');
            if (!valor || isNaN(valor)) return reply(`💸 Valor inválido.\nExemplo: ${prefix}pix @usuario/200`);
            if (DadosRpPix.saldo.banco < Number(valor)) return reply('💸 Saldo insuficiente.');
            const userDestino = await rpg(destinatario);
            if (!userDestino) return reply('⚠️ Usuário não registrado no RPG.');
            const pix = await rpg.pix(sender, destinatario, Number(valor));
            return reply(pix.msg);
        } catch (e) {
            console.error('Erro no comando pix:', e);
            return reply('❌ Erro ao executar o comando pix.');
        }
        break;

    // Empregos
    case 'trabalhar':
        try {
            if (!isGroup) return reply('⚠️ Este comando só pode ser usado em grupos.');
            if (!isModoRpg) return reply('⚠️ O modo RPG precisa estar ativo.');
            const DadosRpTrabalhar = await rpg(sender);
            if (!DadosRpTrabalhar) return reply('⚠️ Você não está registrado.');
            if (!DadosRpTrabalhar.emprego || DadosRpTrabalhar.emprego === 'desempregado') return reply('😅 Andarilhos não trabalham! Escolha um caminho!');
            const trabalho = await rpg.trabalhar(sender);
            return reply(trabalho.msg);
        } catch (e) {
            console.error('Erro no comando trabalhar:', e);
            return reply('❌ Erro ao executar o comando trabalhar.');
        }
        break;

    case 'empregos':
        try {
            if (!isGroup) return reply('⚠️ Este comando só pode ser usado em grupos.');
            if (!isModoRpg) return reply('⚠️ O modo RPG precisa estar ativo.');
            const DadosRpEmpregos = await rpg(sender);
            if (!DadosRpEmpregos) return reply('⚠️ Você não está registrado.');
            const empregos = await rpg.empregos(sender);
            return reply(empregos.msg);
        } catch (e) {
            console.error('Erro no comando empregos:', e);
            return reply('❌ Erro ao executar o comando empregos.');
        }
        break;

    case 'addemprego':
        try {
            if (!isGroup) return reply('⚠️ Este comando só pode ser usado em grupos.');
            if (!isModoRpg) return reply('⚠️ O modo RPG precisa estar ativo.');
            const DadosRpAddEmprego = await rpg(sender);
            if (!DadosRpAddEmprego) return reply('⚠️ Você não está registrado.');
            if (DadosRpAddEmprego.emprego && DadosRpAddEmprego.emprego !== 'desempregado') return reply('⚠️ Você já tem um emprego. Demita-se primeiro.');
            if (!q) return reply(`📜 Digite o nome do emprego.\nExemplo: ${prefix}addemprego lixeiro`);
            const addEmprego = await rpg.emprego.add(sender, normalizar(q));
            return reply(addEmprego.msg);
        } catch (e) {
            console.error('Erro no comando addemprego:', e);
            return reply('❌ Erro ao executar o comando addemprego.');
        }
        break;

    case 'demissao':
        try {
            if (!isGroup) return reply('⚠️ Este comando só pode ser usado em grupos.');
            if (!isModoRpg) return reply('⚠️ O modo RPG precisa estar ativo.');
            const DadosRpDemissao = await rpg(sender);
            if (!DadosRpDemissao) return reply('⚠️ Você não está registrado.');
            if (!DadosRpDemissao.emprego || DadosRpDemissao.emprego === 'desempregado') return reply('😅 Você já vive como andarilho!');
            const demissao = await rpg.emprego.del(sender);
            return reply(demissao.msg);
        } catch (e) {
            console.error('Erro no comando demissao:', e);
            return reply('❌ Erro ao executar o comando demissao.');
        }
        break;

    // Loja e Inventário
    case 'loja':
        try {
            if (!isGroup) return reply('⚠️ Este comando só pode ser usado em grupos.');
            if (!isModoRpg) return reply('⚠️ O modo RPG precisa estar ativo.');
            const DadosRpLoja = await rpg(sender);
            if (!DadosRpLoja) return reply('⚠️ Você não está registrado.');
            const loja = await rpg.loja();
            return reply(loja.msg.replaceAll('#prefix#', prefix));
        } catch (e) {
            console.error('Erro no comando loja:', e);
            return reply('❌ Erro ao executar o comando loja.');
        }
        break;

    case 'comprar':
        try {
            if (!isGroup) return reply('⚠️ Este comando só pode ser usado em grupos.');
            if (!isModoRpg) return reply('⚠️ O modo RPG precisa estar ativo.');
            const DadosRpComprar = await rpg(sender);
            if (!DadosRpComprar) return reply('⚠️ Você não está registrado.');
            if (!q) return reply(`🛒 Digite o nome do item.\nExemplo: ${prefix}comprar picareta`);
            const [itemz, quantidadez] = q.split('/').map(v => v.trim());
            const compra = quantidadez ? await rpg.comprar(sender, normalizar(itemz), Number(quantidadez)) : await rpg.comprar(sender, normalizar(itemz));
            return reply(compra.msg.replaceAll('#prefix#', prefix));
        } catch (e) {
            console.error('Erro no comando comprar:', e);
            return reply('❌ Erro ao executar o comando comprar.');
        }
        break;

    case 'vender':
        try {
            if (!isGroup) return reply('⚠️ Este comando só pode ser usado em grupos.');
            if (!isModoRpg) return reply('⚠️ O modo RPG precisa estar ativo.');
            const DadosRpVender = await rpg(sender);
            if (!DadosRpVender) return reply('⚠️ Você não está registrado.');
            if (!q) return reply(`💰 Digite o item e quantidade: item/quantidade.\nExemplo: ${prefix}vender carvao/5`);
            const [item, quantidade] = q.split('/').map(v => v.trim());
            if (!item || !quantidade || isNaN(quantidade)) return reply('⚠️ Formato inválido. Exemplo: carvao/5');
            const venda = await rpg.vender(sender, normalizar(item), parseInt(quantidade));
            return reply(venda.msg);
        } catch (e) {
            console.error('Erro no comando vender:', e);
            return reply('❌ Erro ao executar o comando vender.');
        }
        break;

    case 'inventario':
        try {
            if (!isGroup) return reply('⚠️ Este comando só pode ser usado em grupos.');
            if (!isModoRpg) return reply('⚠️ O modo RPG precisa estar ativo.');
            const DadosRpInventario = await rpg(sender);
            if (!DadosRpInventario) return reply('⚠️ Você não está registrado.');
            const inventario = await rpg.itens(sender);
            return reply(inventario.msg);
        } catch (e) {
            console.error('Erro no comando inventario:', e);
            return reply('❌ Erro ao executar o comando inventario.');
        }
        break;

    case 'me':
        try {
            if (!isGroup) return reply('⚠️ Este comando só pode ser usado em grupos.');
            if (!isModoRpg) return reply('⚠️ O modo RPG precisa estar ativo.');
            const DadosRpMe = await rpg(sender);
            if (!DadosRpMe) return reply('⚠️ Você não está registrado.');
            const informacoes = await rpg.me(sender);
            return reply(informacoes.msg);
        } catch (e) {
            console.error('Erro no comando me:', e);
            return reply('❌ Erro ao executar o comando me.');
        }
        break;

    // Ações
    case 'pescar':
        try {
            if (!isGroup) return reply('⚠️ Este comando só pode ser usado em grupos.');
            if (!isModoRpg) return reply('⚠️ O modo RPG precisa estar ativo.');
            const DadosRpPescar = await rpg(sender);
            if (!DadosRpPescar) return reply('⚠️ Você não está registrado.');
            const pesca = await rpg.acao.pescar(sender);
            return reply(pesca.msg);
        } catch (e) {
            console.error('Erro no comando pescar:', e);
            return reply('❌ Erro ao executar o comando pescar.');
        }
        break;

    case 'minerar':
        try {
            if (!isGroup) return reply('⚠️ Este comando só pode ser usado em grupos.');
            if (!isModoRpg) return reply('⚠️ O modo RPG precisa estar ativo.');
            const DadosRpMinerar = await rpg(sender);
            if (!DadosRpMinerar) return reply('⚠️ Você não está registrado.');
            const mineracao = await rpg.acao.minerar(sender);
            return reply(mineracao.msg);
        } catch (e) {
            console.error('Erro no comando minerar:', e);
            return reply('❌ Erro ao executar o comando minerar.');
        }
        break;

    case 'cacar':
        try {
            if (!isGroup) return reply('⚠️ Este comando só pode ser usado em grupos.');
            if (!isModoRpg) return reply('⚠️ O modo RPG precisa estar ativo.');
            const DadosRpCacar = await rpg(sender);
            if (!DadosRpCacar) return reply('⚠️ Você não está registrado.');
            const caca = await rpg.acao.cacar(sender);
            return reply(caca.msg);
        } catch (e) {
            console.error('Erro no comando cacar:', e);
            return reply('❌ Erro ao executar o comando cacar.');
        }
        break;

    case 'plantar':
        try {
            if (!isGroup) return reply('⚠️ Este comando só pode ser usado em grupos.');
            if (!isModoRpg) return reply('⚠️ O modo RPG precisa estar ativo.');
            const DadosRpPlantar = await rpg(sender);
            if (!DadosRpPlantar) return reply('⚠️ Você não está registrado.');
            const plantar = await rpg.acao.plantar(sender);
            return reply(plantar.msg);
        } catch (e) {
            console.error('Erro no comando plantar:', e);
            return reply('❌ Erro ao executar o comando plantar.');
        }
        break;

    case 'cortar':
        try {
            if (!isGroup) return reply('⚠️ Este comando só pode ser usado em grupos.');
            if (!isModoRpg) return reply('⚠️ O modo RPG precisa estar ativo.');
            const DadosRpCortar = await rpg(sender);
            if (!DadosRpCortar) return reply('⚠️ Você não está registrado.');
            const cortar = await rpg.acao.cortar(sender);
            return reply(cortar.msg);
        } catch (e) {
            console.error('Erro no comando cortar:', e);
            return reply('❌ Erro ao executar o comando cortar.');
        }
        break;

    case 'lutar':
    case 'batalhar':
        try {
            if (!isGroup) return reply('⚠️ Este comando só pode ser usado em grupos.');
            if (!isModoRpg) return reply('⚠️ O modo RPG precisa estar ativo.');
            const DadosRpLutar = await rpg(sender);
            if (!DadosRpLutar) return reply('⚠️ Você não está registrado.');
            const batalha = await rpg.acao.batalhar(sender);
            return reply(batalha.msg);
        } catch (e) {
            console.error('Erro no comando lutar:', e);
            return reply('❌ Erro ao executar o comando lutar.');
        }
        break;

    case 'pocao':
        try {
            if (!isGroup) return reply('⚠️ Este comando só pode ser usado em grupos.');
            if (!isModoRpg) return reply('⚠️ O modo RPG precisa estar ativo.');
            const DadosRpPocao = await rpg(sender);
            if (!DadosRpPocao) return reply('⚠️ Você não está registrado.');
            const usarPocao = await rpg.acao.pocao(sender);
            return reply(usarPocao.msg);
        } catch (e) {
            console.error('Erro no comando pocao:', e);
            return reply('❌ Erro ao executar o comando pocao.');
        }
        break;

    case 'alimentar':
        try {
            if (!isGroup) return reply('⚠️ Este comando só pode ser usado em grupos.');
            if (!isModoRpg) return reply('⚠️ O modo RPG precisa estar ativo.');
            const DadosRpAlimentar = await rpg(sender);
            if (!DadosRpAlimentar) return reply('⚠️ Você não está registrado.');
            const alimentar = await rpg.acao.alimentarPet(sender);
            return reply(alimentar.msg);
        } catch (e) {
            console.error('Erro no comando alimentar:', e);
            return reply('❌ Erro ao executar o comando alimentar.');
        }
        break;

    case 'assaltar':
        try {
            if (!isGroup) return reply('⚠️ Este comando só pode ser usado em grupos.');
            if (!isModoRpg) return reply('⚠️ O modo RPG precisa estar ativo.');
            const DadosRpAssaltar = await rpg(sender);
            if (!DadosRpAssaltar) return reply('⚠️ Você não está registrado.');
            if (!menc_os2) return reply(`📌 Marque quem deseja assaltar.\nExemplo: ${prefix}assaltar @usuario`);
            if (menc_os2 === sender) return reply('⚠️ Você não pode se assaltar.');
            const assalto = await rpg.acao.assaltar(sender, menc_os2);
            return reply(assalto.msg);
        } catch (e) {
            console.error('Erro no comando assaltar:', e);
            return reply('❌ Erro ao executar o comando assaltar.');
        }
        break;

    // Missões
    case 'missao':
        try {
            if (!isGroup) return reply('⚠️ Este comando só pode ser usado em grupos.');
            if (!isModoRpg) return reply('⚠️ O modo RPG precisa estar ativo.');
            const DadosRpMissao = await rpg(sender);
            if (!DadosRpMissao) return reply('⚠️ Você não está registrado.');
            if (!q) return reply(`📜 Digite o nome da missão.\nExemplo: ${prefix}missao caça ao tesouro`);
            const iniciarMissao = await rpg.missao.iniciar(sender, normalizar(q));
            return reply(iniciarMissao.msg);
        } catch (e) {
            console.error('Erro no comando missao:', e);
            return reply('❌ Erro ao executar o comando missao.');
        }
        break;

    case 'completar':
        try {
            if (!isGroup) return reply('⚠️ Este comando só pode ser usado em grupos.');
            if (!isModoRpg) return reply('⚠️ O modo RPG precisa estar ativo.');
            const DadosRpCompletar = await rpg(sender);
            if (!DadosRpCompletar) return reply('⚠️ Você não está registrado.');
            if (!q) return reply(`📜 Digite o nome da missão.\nExemplo: ${prefix}completar caça ao tesouro`);
            const completarMissao = await rpg.missao.completar(sender, normalizar(q));
            return reply(completarMissao.msg);
        } catch (e) {
            console.error('Erro no comando completar:', e);
            return reply('❌ Erro ao executar o comando completar.');
        }
        break;

    // Guildas
    case 'criarguilda':
        try {
            if (!isGroup) return reply('⚠️ Este comando só pode ser usado em grupos.');
            if (!isModoRpg) return reply('⚠️ O modo RPG precisa estar ativo.');
            const DadosRpCriarGuilda = await rpg(sender);
            if (!DadosRpCriarGuilda) return reply('⚠️ Você não está registrado.');
            if (!q) return reply(`🏰 Digite o nome da guilda.\nExemplo: ${prefix}criarguilda Cavaleiros`);
            const criarGuilda = await rpg.guilda.criar(sender, normalizar(q));
            return reply(criarGuilda.msg);
        } catch (e) {
            console.error('Erro no comando criarguilda:', e);
            return reply('❌ Erro ao executar o comando criarguilda.');
        }
        break;

    case 'entrarguilda':
        try {
            if (!isGroup) return reply('⚠️ Este comando só pode ser usado em grupos.');
            if (!isModoRpg) return reply('⚠️ O modo RPG precisa estar ativo.');
            const DadosRpEntrarGuilda = await rpg(sender);
            if (!DadosRpEntrarGuilda) return reply('⚠️ Você não está registrado.');
            if (!q) return reply(`🏰 Digite o nome da guilda.\nExemplo: ${prefix}entrarguilda Cavaleiros`);
            const entrarGuilda = await rpg.guilda.entrar(sender, normalizar(q));
            return reply(entrarGuilda.msg);
        } catch (e) {
            console.error('Erro no comando entrarguilda:', e);
            return reply('❌ Erro ao executar o comando entrarguilda.');
        }
        break;

    case 'sairguilda':
        try {
            if (!isGroup) return reply('⚠️ Este comando só pode ser usado em grupos.');
            if (!isModoRpg) return reply('⚠️ O modo RPG precisa estar ativo.');
            const DadosRpSairGuilda = await rpg(sender);
            if (!DadosRpSairGuilda) return reply('⚠️ Você não está registrado.');
            const sairGuilda = await rpg.guilda.sair(sender);
            return reply(sairGuilda.msg);
        } catch (e) {
            console.error('Erro no comando sairguilda:', e);
            return reply('❌ Erro ao executar o comando sairguilda.');
        }
        break;

    // Duelos
    case 'duelar':
        try {
            if (!isGroup) return reply('⚠️ Este comando só pode ser usado em grupos.');
            if (!isModoRpg) return reply('⚠️ O modo RPG precisa estar ativo.');
            const DadosRpDuelar = await rpg(sender);
            if (!DadosRpDuelar) return reply('⚠️ Você não está registrado.');
            if (!q || !menc_os2) return reply(`⚔️ Digite o valor da aposta e marque o adversário.\nExemplo: ${prefix}duelar 100 @alvo`);
            const [aposta] = q.split('/').map(v => v.trim());
            if (isNaN(aposta) || Number(aposta) < 100) return reply('⚠️ Aposta mínima é R$100.');
            const duelo = await rpg.duelo.desafiar(sender, menc_os2, Number(aposta));
            return reply(duelo.msg);
        } catch (e) {
            console.error('Erro no comando duelar:', e);
            return reply('❌ Erro ao executar o comando duelar.');
        }
        break;

    case 'aceitarduelo':
        try {
            if (!isGroup) return reply('⚠️ Este comando só pode ser usado em grupos.');
            if (!isModoRpg) return reply('⚠️ O modo RPG precisa estar ativo.');
            const DadosRpAceitarDuelo = await rpg(sender);
            if (!DadosRpAceitarDuelo) return reply('⚠️ Você não está registrado.');
            const aceitarDuelo = await rpg.duelo.aceitar(sender);
            return reply(aceitarDuelo.msg);
        } catch (e) {
            console.error('Erro no comando aceitarduelo:', e);
            return reply('❌ Erro ao executar o comando aceitarduelo.');
        }
        break;

    // Ranking
    case 'ranking':
        try {
            if (!isGroup) return reply('⚠️ Este comando só pode ser usado em grupos.');
            if (!isModoRpg) return reply('⚠️ O modo RPG precisa estar ativo.');
            const DadosRpRanking = await rpg(sender);
            if (!DadosRpRanking) return reply('⚠️ Você não está registrado.');
            const ranking = await rpg.ranking(sender);
            return reply(ranking.msg);
        } catch (e) {
            console.error('Erro no comando ranking:', e);
            return reply('❌ Erro ao executar o comando ranking.');
        }
        break;
  
 default:
 if(isCmd) await nazu.react('❌');
 };
 
 
} catch(e) {
console.error(e);
var {version} = JSON.parse(fs.readFileSync(__dirname+'/../../package.json'));
if (debug) reportError(e, version);
};
};

module.exports = NazuninhaBotExec;