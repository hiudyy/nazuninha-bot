async function menuDono(prefix, botName = "MeuBot", userName = "Usuário") {
  return `
╭─🌸 *${botName}*
│ Oii, *${userName}*
╰───────────────

╭─🌷 *CONFIGURAR BOT* 🌷
│ Escolha sua opção: 
├──────────────┤
│ *${prefix}prefixo*
│    → Mudar prefixo do bot
│ *${prefix}numerodono*
│    → Definir número do dono
│ *${prefix}nomedono*
│    → Alterar nome do dono
│ *${prefix}nomebot*
│    → Mudar nome do bot
│ *${prefix}fotomenu*
│    → Configurar foto do menu
│ *${prefix}videomenu*
│    → Configurar vídeo do menu
╰──────────────╯

╭─🌷 *FUNÇÕES DE DONO* 🌷
│ Escolha sua opção: 
├──────────────┤
│ *${prefix}seradm*
│    → Tornar-se admin
│ *${prefix}sermembro*
│    → Tornar-se membro
│ *${prefix}bangp*
│    → Banir grupo
│ *${prefix}unbangp*
│    → Desbanir grupo
│ *${prefix}addpremium*
│    → Adicionar usuário premium
│ *${prefix}delpremium*
│    → Remover usuário premium
│ *${prefix}blockcmdg [comando] [motivo?]*
│    → Bloquear comando globalmente
│ *${prefix}unblockcmdg [comando]*
│    → Desbloquear comando global
│ *${prefix}blockuserg [usuário] [motivo?]*
│    → Bloquear usuário globalmente
│ *${prefix}unblockuserg [usuário]*
│    → Desbloquear usuário global
│ *${prefix}listblocks*
│    → Listar bloqueios globais
╰──────────────╯
`;
}

module.exports = menuDono;