/**
 * Menu de RPG (em desenvolvimento)
 * @module menurpg
 * @param {string} prefix - Prefixo dos comandos do bot
 * @param {string} [botName="MeuBot"] - Nome do bot
 * @param {string} [userName="Usuário"] - Nome do usuário
 * @returns {Promise<string>} Menu formatado com comandos de RPG
 * @description Lista os comandos relacionados ao sistema de RPG
 * (Funcionalidade em desenvolvimento)
 */
async function menuRpg(prefix, botName = "MeuBot", userName = "Usuário") {
  return `
╭─🌸 *${botName}*
│ Oii, *${userName}*
╰───────────────

╭─🌷 *RPG (EM TESTES)* 🌷─
│ Escolha sua opção:
├──────────────┤
│
├─ *Registro*
│ *${prefix}registrar/reg*
│    → Registre-se na aventura!
│ *${prefix}deletar/delrg*
│    → Exclua seu personagem
│
├─ *Banco*
│ *${prefix}saldo/banco*
│    → Confira seu ouro!
│ *${prefix}depositar*
│    → Guarde ouro no banco
│ *${prefix}sacar*
│    → Retire ouro do banco
│ *${prefix}depoall*
│    → Deposite tudo no banco
│ *${prefix}saqueall*
│    → Saque tudo do banco
│ *${prefix}pix/transferir*
│    → Envie ouro a alguém
│
├─ *Empregos*
│ *${prefix}trabalhar*
│    → Ganhe ouro com seu emprego
│ *${prefix}empregos*
│    → Veja os empregos disponíveis
│ *${prefix}addemprego*
│    → Escolha um novo emprego
│ *${prefix}demissao*
│    → Abandone seu emprego
│
├─ *Loja e Inventário*
│ *${prefix}loja*
│    → Veja itens à venda
│ *${prefix}comprar*
│    → Compre itens na loja
│ *${prefix}vender*
│    → Venda seus itens
│ *${prefix}inventario*
│    → Veja seus itens
│ *${prefix}me*
│    → Veja seu perfil
│
├─ *Ações*
│ *${prefix}pescar*
│    → Pesque tesouros aquáticos
│ *${prefix}minerar*
│    → Extraia riquezas da terra
│ *${prefix}cacar*
│    → Cace feras selvagens
│ *${prefix}plantar*
│    → Cultive plantas mágicas
│ *${prefix}cortar*
│    → Corte árvores lendárias
│ *${prefix}lutar/batalhar*
│    → Enfrente monstros épicos
│ *${prefix}pocao*
│    → Use poções de cura
│ *${prefix}alimentar*
│    → Cuide do seu pet
│ *${prefix}assaltar*
│    → Roube ouro de alguém
│
├─ *Missões*
│ *${prefix}missao*
│    → Inicie uma missão épica
│ *${prefix}completar*
│    → Conclua sua missão
│
├─ *Guildas*
│ *${prefix}criarguilda*
│    → Crie sua guilda
│ *${prefix}entrarguilda*
│    → Junte-se a uma guilda
│ *${prefix}sairguilda*
│    → Saia da sua guilda
│
├─ *Duelos*
│ *${prefix}duelar*
│    → Desafie alguém para um duelo
│ *${prefix}aceitarduelo*
│    → Aceite um desafio de duelo
│
├─ *Ranking*
│ *${prefix}ranking*
│    → Veja os maiores heróis
╰──────────────╯
`;
}

module.exports = menuRpg;