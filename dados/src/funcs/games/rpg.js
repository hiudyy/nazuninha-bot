/*
 * SISTEMA DE RPG - VERSAO 2.1.0
 * Criado com muito carinho por: Hiudy
 * 
 * ATENCAO: Este código é meu (Hiudy)! Não venda sem permissão.
 * Se quiser melhorar ou mexer, mantenha meus créditos, por favor!
 * 
 * Forja sua lenda e domine o reino!
 */

// Importacoes
const path = require('path');
const fs = require('fs').promises;

// Diretorios
const RpgPath = path.join(__dirname, '../../../database/rpg');
const RankPath = path.join(RpgPath, 'ranking.json');

// Gerenciador de duelos
let duelosPendentes = {};

// Cria pastas
fs.mkdir(RpgPath, { recursive: true }).catch(err => console.error('Erro ao criar pasta:', err));

// Normaliza texto para minusculas e sem acentos
const normalizar = texto => texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

// Empregos
const empregos = [
    { nome: 'lixeiro', min: 50, max: 150, xp: 0, delay: 120, msgDelay: 'A próxima coleta é em #segundos# segundos, aventureiro!' },
    { nome: 'faxineiro', min: 80, max: 200, xp: 20, delay: 150, msgDelay: 'O castelo brilha! Volte em #segundos# segundos.' },
    { nome: 'garcom', min: 100, max: 250, xp: 40, delay: 180, msgDelay: 'Descanso, herói! Volte em #segundos# segundos.' },
    { nome: 'motorista', min: 150, max: 300, xp: 80, delay: 200, msgDelay: 'Próxima caravana em #segundos# segundos.' },
    { nome: 'vendedor', min: 200, max: 400, xp: 100, delay: 220, msgDelay: 'Mercado vazio! Volte em #segundos# segundos.' },
    { nome: 'cozinheiro', min: 250, max: 500, xp: 150, delay: 240, msgDelay: 'Taverna fechada! Volte em #segundos# segundos.' },
    { nome: 'professor', min: 300, max: 600, xp: 180, delay: 260, msgDelay: 'Próxima aula em #segundos# segundos, sábio!' },
    { nome: 'engenheiro', min: 400, max: 800, xp: 250, delay: 280, msgDelay: 'Sem projetos, mestre! Volte em #segundos# segundos.' },
    { nome: 'policial', min: 450, max: 900, xp: 350, delay: 300, msgDelay: 'Guarda descansa! Volte em #segundos# segundos.' },
    { nome: 'advogado', min: 500, max: 1000, xp: 450, delay: 320, msgDelay: 'Próximo caso em #segundos# segundos.' },
    { nome: 'medico', min: 600, max: 1200, xp: 600, delay: 340, msgDelay: 'Curandeiro, descanse! Volte em #segundos# segundos.' },
    { nome: 'ferreiro', min: 350, max: 700, xp: 200, delay: 270, msgDelay: 'Forja esfriou! Volte em #segundos# segundos.' },
    { nome: 'alquimista', min: 450, max: 850, xp: 300, delay: 290, msgDelay: 'Poções em preparo! Volte em #segundos# segundos.' },
    { nome: 'aventureiro', min: 500, max: 1000, xp: 500, delay: 350, msgDelay: 'Nova aventura em #segundos# segundos!' },
    { nome: 'ladrao', min: 300, max: 600, xp: 400, delay: 310, msgDelay: 'Guardas alertas! Espere #segundos# segundos.' },
    { nome: 'mago', min: 550, max: 1100, xp: 550, delay: 360, msgDelay: 'Mana recarregando! Volte em #segundos# segundos.' }
];

// Itens da loja e vendaveis
const itensLoja = [
    { nome: 'picareta', valor: 700, venda: 300 },
    { nome: 'isca', valor: 800, venda: 320 },
    { nome: 'faca', valor: 900, venda: 350 },
    { nome: 'arma', valor: 1100, venda: 480 },
    { nome: 'municao', valor: 300, venda: 80 },
    { nome: 'racao', valor: 150, venda: 50 },
    { nome: 'escudo', valor: 1450, venda: 760 },
    { nome: 'semente', valor: 200, venda: 80 },
    { nome: 'pocao', valor: 500, venda: 200 },
    { nome: 'machado', valor: 950, venda: 400 },
    { nome: 'varinha', valor: 1200, venda: 500 },
    { nome: 'lobo', valor: 2000, venda: 800, pet: true, bonus: { caca: 0.2 }, nomeExibicao: 'Lobo' },
    { nome: 'falcao', valor: 2500, venda: 1000, pet: true, bonus: { missaoDelay: 0.9 }, nomeExibicao: 'Falcão' },
    { nome: 'dragao bebe', valor: 5000, venda: 2000, pet: true, bonus: { batalhaDano: 10 }, nomeExibicao: 'Dragão Bebê' }
];

const itensVenda = [
    { nome: 'carvao', venda: 50, nomeExibicao: 'Carvão' },
    { nome: 'prata', venda: 70 },
    { nome: 'ferro', venda: 80 },
    { nome: 'ouro', venda: 95 },
    { nome: 'diamante', venda: 115 },
    { nome: 'esmeralda', venda: 130 },
    { nome: 'peixe', venda: 40 },
    { nome: 'carne', venda: 30 },
    { nome: 'trigo', venda: 60 },
    { nome: 'madeira', venda: 55 },
    { nome: 'mana', venda: 150 }
];

// Missoes
const missoes = [
    { nome: 'caca ao tesouro', recompensa: { dinheiro: 1000, xp: 50, item: 'diamante' }, dificuldade: 1, desc: 'Desbrave a floresta e encontre o baú perdido!', nomeExibicao: 'Caça ao Tesouro' },
    { nome: 'derrote o bandido', recompensa: { dinheiro: 1500, xp: 80, item: 'arma' }, dificuldade: 2, desc: 'Enfrente o bandido que assola a vila!', nomeExibicao: 'Derrote o Bandido' },
    { nome: 'entrega urgente', recompensa: { dinheiro: 800, xp: 40 }, dificuldade: 1, desc: 'Corra contra o tempo para entregar um pacote!', nomeExibicao: 'Entrega Urgente' },
    { nome: 'resgate na mina', recompensa: { dinheiro: 2000, xp: 100, item: 'esmeralda' }, dificuldade: 3, desc: 'Salve os mineiros presos!', nomeExibicao: 'Resgate na Mina' },
    { nome: 'derrote o dragao', recompensa: { dinheiro: 3000, xp: 150, item: 'varinha' }, dificuldade: 4, desc: 'Enfrente o dragão e prove sua coragem!', nomeExibicao: 'Derrote o Dragão' }
];

// Monstros
const monstros = [
    { nome: 'goblin', hp: 50, ataque: 10, recompensa: { dinheiro: 200, xp: 20, item: 'carvao' }, nomeExibicao: 'Goblin' },
    { nome: 'lobo selvagem', hp: 80, ataque: 15, recompensa: { dinheiro: 350, xp: 30, item: 'carne' }, nomeExibicao: 'Lobo Selvagem' },
    { nome: 'troll', hp: 120, ataque: 20, recompensa: { dinheiro: 500, xp: 50, item: 'ferro' }, nomeExibicao: 'Troll' },
    { nome: 'dragao menor', hp: 200, ataque: 30, recompensa: { dinheiro: 1000, xp: 100, item: 'diamante' }, nomeExibicao: 'Dragão Menor' }
];

// Frutas do cassino
const frutas = ['maça', 'banana', 'cereja', 'uva', 'abacaxi', 'melancia'];
const frutasExibicao = ['🍎', '🍌', '🍒', '🍇', '🍍', '🍉'];

// Inicializa ranking
async function initRanking() {
    try {
        if (!(await fs.access(RankPath).then(() => true).catch(() => false))) {
            await fs.writeFile(RankPath, JSON.stringify({ ouro: {}, xp: {}, monstros: {}, reset: Date.now() }, null, 2));
        }
    } catch (err) {
        console.error('Erro ao iniciar ranking:', err);
    }
}
initRanking();

// Funcoes utilitarias
const salvar = async (sender, dados) => {
    try {
        await fs.writeFile(path.join(RpgPath, `${sender}.json`), JSON.stringify(dados, null, 2));
        return true;
    } catch (err) {
        console.error('Erro ao salvar:', err);
        return false;
    }
};

const getUser = async sender => {
    try {
        const caminho = path.join(RpgPath, `${sender}.json`);
        if (await fs.access(caminho).then(() => true).catch(() => false)) {
            return JSON.parse(await fs.readFile(caminho, 'utf-8'));
        }
        return null;
    } catch (err) {
        console.error('Erro ao buscar usuário:', err);
        return null;
    }
};

const addSaldo = (dados, valor, banco = false) => {
    if (isNaN(valor)) return null;
    banco ? (dados.saldo.banco += valor) : (dados.saldo.carteira += valor);
    return dados;
};

const delSaldo = (dados, valor, banco = false) => addSaldo(dados, -valor, banco);

const addItem = (dados, item, qtd = 1) => {
    dados.inv[item] = (dados.inv[item] || 0) + qtd;
    return dados;
};

const delItem = (dados, item, qtd = 1) => {
    if (!dados.inv[item] || dados.inv[item] < qtd) return null;
    dados.inv[item] -= qtd;
    if (dados.inv[item] <= 0) delete dados.inv[item];
    return dados;
};

// Verifica se pet fugiu
async function verificarPet(dados) {
    if (!dados.pet) return null;
    const agora = Date.now();
    if (agora - dados.pet.ultimaAlimentacao > 3 * 24 * 60 * 60 * 1000) {
        const pet = itensLoja.find(i => i.nome === dados.pet.nome);
        const nomePet = pet?.nomeExibicao || dados.pet.nome;
        dados.pet = null;
        return {
            msg: `🐾 *Seu ${nomePet} fugiu!* Ele deixou uma carta para você:\n\n` +
                 `📜 *Carta de ${nomePet}* 📜\n` +
                 `Querido ${dados.nome || 'Herói'},\n` +
                 `Foi incrível estar ao seu lado, mas sinto que preciso encontrar alguém com mais tempo para cuidar de mim. ` +
                 `Você é uma lenda, e não quero ser um peso em sua jornada épica! Vou explorar o reino e encontrar novas aventuras. ` +
                 `Desejo que sua espada nunca embote e que seus tesouros sejam muitos! Com carinho,\n` +
                 `~${nomePet}`
        };
    }
    return null;
}

// Atualiza ranking
async function atualizarRanking(sender, tipo, valor) {
    try {
        const ranking = JSON.parse(await fs.readFile(RankPath, 'utf-8'));
        ranking[tipo][sender] = (ranking[tipo][sender] || 0) + valor;
        await fs.writeFile(RankPath, JSON.stringify(ranking, null, 2));
    } catch (err) {
        console.error('Erro ao atualizar ranking:', err);
    }
}

// Loja
async function gerarLoja() {
    try {
        let texto = '🛒 *Mercado de Nazu* 🛒\n\n⚔️ *Tesouros à venda* ⚔️\n';
        itensLoja.forEach(i => texto += `- *${i.nomeExibicao || i.nome}*: R$${i.valor}${i.pet ? ' (Pet)' : ''}\n`);
        texto += '\n📜 *Como comprar?*\nUse: #prefix#comprar [item]\nEx: #prefix#comprar picareta';
        return { msg: texto };
    } catch (err) {
        console.error('Erro na loja:', err);
        return { msg: '⚠️ O mercado tá fechado!' };
    }
}

// Registra usuario
async function rgUser(sender, nome = '') {
    try {
        const dados = {
            id: sender,
            nome,
            saldo: { banco: 0, carteira: 500 },
            inv: {},
            emprego: 'desempregado',
            xp: 0,
            status: { fadiga: 0, moral: 100, hp: 100 },
            missoes: [],
            guilda: null,
            pet: null,
            delay: {},
            titulo: null
        };
        await salvar(sender, dados);
        return { msg: `🌟 *${nome || 'Herói'}*, sua lenda começa! Ganhou R$500 para forjar sua saga!` };
    } catch (err) {
        console.error('Erro ao registrar:', err);
        return { msg: '⚠️ Falha ao criar sua lenda!' };
    }
}

// Deleta usuario
async function delUser(sender) {
    try {
        const caminho = path.join(RpgPath, `${sender}.json`);
        if (require('fs').existsSync(caminho)) {
            await fs.unlink(caminho);
            return { msg: '😢 Sua lenda foi apagada do reino.' };
        }
        return { msg: '⚠️ Nenhuma lenda encontrada!' };
    } catch (err) {
        console.error('Erro ao deletar:', err);
        return { msg: '⚠️ Falha ao apagar lenda!' };
    }
}

// Lista empregos
async function listarEmpregos(sender) {
    try {
        const dados = await getUser(sender);
        if (!dados) return { msg: '⚠️ Herói não encontrado!' };
        dados.xp = dados.xp || 0;
        const disp = empregos.filter(e => dados.xp >= e.xp).map(e => e.nome);
        const bloq = empregos.filter(e => dados.xp < e.xp).map(e => e.nome);
        let texto = '⚔️ *Caminhos Disponíveis* ⚔️\n';
        texto += disp.length ? `- ${disp.join(', ')}\n` : 'Nenhum caminho livre!\n';
        texto += '\n🔒 *Caminhos Bloqueados* 🔒\n';
        texto += bloq.length ? `- ${bloq.join(', ')}` : 'Nenhum caminho fechado!';
        return { msg: texto };
    } catch (err) {
        console.error('Erro ao listar caminhos:', err);
        return { msg: '⚠️ Erro ao revelar os caminhos!' };
    }
}

// Sai do emprego
async function sairEmprego(sender) {
    try {
        let dados = await getUser(sender);
        if (!dados) return { msg: '⚠️ Herói não encontrado!' };
        if (dados.emprego === 'desempregado') return { msg: '😅 Você já vive como andarilho!' };
        dados.emprego = 'desempregado';
        await salvar(sender, dados);
        return { msg: '🌬️ Abandonou seu caminho! A liberdade te chama, aventureiro!' };
    } catch (err) {
        console.error('Erro ao sair:', err);
        return { msg: '⚠️ Falha ao abandonar o caminho!' };
    }
}

// Entra em emprego
async function entrarEmprego(sender, emprego) {
    try {
        let dados = await getUser(sender);
        if (!dados) return { msg: '⚠️ Herói não encontrado!' };
        const job = empregos.find(e => normalizar(e.nome) === normalizar(emprego));
        if (!job) return { msg: '⚠️ Caminho inválido! Veja com #prefix#empregos.' };
        dados.xp = dados.xp || 0;
        if (dados.xp < job.xp) return { msg: '😓 Pouca experiência para esse caminho!' };
        dados.emprego = job.nome;
        await salvar(sender, dados);
        return { msg: `🌟 Parabéns, ${job.nome}! Sua lenda trilha um novo caminho! 🛡️` };
    } catch (err) {
        console.error('Erro ao entrar:', err);
        return { msg: '⚠️ Falha ao trilhar o caminho!' };
    }
}

// Trabalha
async function trabalhar(sender) {
    try {
        let dados = await getUser(sender);
        if (!dados) return { msg: '⚠️ Herói não encontrado!' };
        const petFugiu = await verificarPet(dados);
        if (petFugiu) {
            await salvar(sender, dados);
            return petFugiu;
        }
        if (dados.emprego === 'desempregado') return { msg: '😅 Andarilhos não trabalham! Escolha um caminho!' };
        if (dados.status.fadiga >= 100) return { msg: '😴 Exausto! Descanse antes de continuar!' };
        if (dados.status.hp <= 0) return { msg: '💔 Ferido demais! Cure-se primeiro!' };

        const job = empregos.find(e => e.nome === dados.emprego);
        if (!job) return { msg: '⚠️ Caminho inválido!' };

        const agora = Date.now();
        if (dados.delay?.trabalhar && dados.delay.trabalhar > agora) {
            return { msg: job.msgDelay.replace('#segundos#', Math.ceil((dados.delay.trabalhar - agora) / 1000)) };
        }

        let salario = 0, texto = '', xp = 1;
        const chance = Math.random() * 100;
        dados.status.fadiga += 10;
        dados.status.moral = Math.min(100, (dados.status.moral || 100) - 5);

        switch (dados.emprego) {
            case 'lixeiro':
                if (chance > 30) {
                    salario = Math.floor(Math.random() * (job.max - job.min)) + job.min;
                    texto = `🗑️ Limpou as ruas sombrias e ganhou R$${salario}!`;
                } else if (chance > 10) {
                    texto = '🚛 Carroça quebrou! Sem ouro hoje.';
                    xp = 0.5;
                } else {
                    salario = Math.floor(Math.random() * 140) + 100;
                    texto = `💎 Achou uma relíquia no lixo! Vendeu por R$${salario}!`;
                }
                break;
            case 'faxineiro':
                if (chance > 30) {
                    salario = Math.floor(Math.random() * (job.max - job.min)) + job.min;
                    texto = `🧹 O castelo reluz! Ganhou R$${salario}!`;
                } else if (chance > 10) {
                    texto = '🧼 Escorregou no sabão mágico! Dia perdido!';
                    xp = 0.5;
                } else {
                    salario = Math.floor(Math.random() * 150) + 100;
                    texto = `💵 Ouro escondido num baú! Ganhou R$${salario}!`;
                }
                break;
            case 'garcom':
                if (chance > 30) {
                    salario = Math.floor(Math.random() * (job.max - job.min)) + job.min;
                    texto = `🍽️ Serviu nobres e ganhou R$${salario} em gorjetas!`;
                } else if (chance > 10) {
                    texto = '😣 Cavaleiro reclamou do vinho! Sem ouro.';
                    xp = 0.5;
                } else {
                    salario = Math.floor(Math.random() * 180) + 200;
                    texto = `💰 Rei deixou gorjeta épica de R$${salario}!`;
                }
                break;
            case 'motorista':
                if (chance > 30) {
                    salario = Math.floor(Math.random() * (job.max - job.min)) + job.min;
                    texto = `🚗 Levou aventureiros e ganhou R$${salario}!`;
                } else if (chance > 10) {
                    texto = '🚘 Carroça furou! Sem trabalho.';
                    xp = 0.5;
                } else {
                    salario = Math.floor(Math.random() * 200) + 200;
                    texto = `🚖 Viagem secreta para mago! Ganhou R$${salario}!`;
                }
                break;
            case 'vendedor':
                if (chance > 30) {
                    salario = Math.floor(Math.random() * (job.max - job.min)) + job.min;
                    texto = `🛍️ Vendeu relíquias e ganhou R$${salario}!`;
                } else if (chance > 10) {
                    texto = '😞 Ninguém quis comprar hoje.';
                    xp = 0.5;
                } else {
                    salario = Math.floor(Math.random() * 250) + 300;
                    texto = `💸 Contrato com dragão! Ganhou R$${salario}!`;
                }
                break;
            case 'cozinheiro':
                if (chance > 30) {
                    salario = Math.floor(Math.random() * (job.max - job.min)) + job.min;
                    texto = `🍳 Banquete lendário! Ganhou R$${salario}!`;
                } else if (chance > 10) {
                    texto = '👨‍🍳 Mestre cozinheiro assumiu hoje.';
                    xp = 0.5;
                } else {
                    salario = Math.floor(Math.random() * 280) + 300;
                    texto = `🍽️ Cozinhou para rei! Ganhou R$${salario}!`;
                }
                break;
            case 'professor':
                if (chance > 30) {
                    salario = Math.floor(Math.random() * (job.max - job.min)) + job.min;
                    texto = `📚 Ensinou magias e ganhou R$${salario}!`;
                } else if (chance > 10) {
                    texto = '🏫 Academia fechada por feriado!';
                    xp = 0.5;
                } else {
                    salario = Math.floor(Math.random() * 300) + 350;
                    texto = `📝 Aula para príncipe! Ganhou R$${salario}!`;
                }
                break;
            case 'engenheiro':
                if (chance > 30) {
                    salario = Math.floor(Math.random() * (job.max - job.min)) + job.min;
                    texto = `🏗️ Ponte mágica construída! Ganhou R$${salario}!`;
                } else {
                    texto = '📉 Erro no projeto arcano! Sem ouro.';
                    xp = 0.5;
                }
                break;
            case 'policial':
                if (chance > 30) {
                    salario = Math.floor(Math.random() * (job.max - job.min)) + job.min;
                    texto = `👮 Capturou ladrões e ganhou R$${salario}!`;
                } else if (chance > 10) {
                    texto = '🛑 Folga na guarda real!';
                    xp = 0.5;
                } else {
                    salario = Math.floor(Math.random() * 350) + 390;
                    texto = `💸 "Suborno mágico" de R$${salario}!`;
                }
                break;
            case 'advogado':
                if (chance > 30) {
                    salario = Math.floor(Math.random() * (job.max - job.min)) + job.min;
                    texto = `⚖️ Defendeu herói e ganhou R$${salario}!`;
                } else if (chance > 10) {
                    texto = '📉 Perdeu caso contra mago! Sem ouro.';
                    xp = 0.5;
                } else {
                    salario = Math.floor(Math.random() * 500) + 500;
                    texto = `💼 Trabalhou para rei! Ganhou R$${salario}!`;
                }
                break;
            case 'medico':
                if (chance > 30) {
                    salario = Math.floor(Math.random() * (job.max - job.min)) + job.min;
                    texto = `🏥 Curou guerreiros e ganhou R$${salario}!`;
                } else if (chance > 10) {
                    texto = '😷 Doente! Não trabalhou hoje!';
                    xp = 0.5;
                } else {
                    salario = Math.floor(Math.random() * 650) + 600;
                    texto = `🩺 Curou dragão! Ganhou R$${salario}!`;
                }
                break;
            case 'ferreiro':
                if (chance > 30) {
                    salario = Math.floor(Math.random() * (job.max - job.min)) + job.min;
                    texto = `⚒️ Forjou espada lendária! Ganhou R$${salario}!`;
                } else if (chance > 10) {
                    texto = '🔥 Forja apagou! Sem trabalho.';
                    xp = 0.5;
                } else {
                    salario = Math.floor(Math.random() * 200) + 300;
                    texto = `🗡️ Armadura épica! Ganhou R$${salario}!`;
                }
                break;
            case 'alquimista':
                if (chance > 30) {
                    salario = Math.floor(Math.random() * (job.max - job.min)) + job.min;
                    texto = `🧪 Poções místicas! Ganhou R$${salario}!`;
                } else if (chance > 10) {
                    texto = '💥 Explosão no caldeirão! Sem ouro.';
                    xp = 0.5;
                } else {
                    salario = Math.floor(Math.random() * 250) + 350;
                    texto = `🧙‍♂️ Poção lendária! Ganhou R$${salario}!`;
                }
                break;
            case 'aventureiro':
                if (chance > 30) {
                    salario = Math.floor(Math.random() * (job.max - job.min)) + job.min;
                    texto = `🗺️ Explorou ruínas e ganhou R$${salario}!`;
                } else if (chance > 10) {
                    texto = '🌪️ Tempestade na trilha! Sem ouro.';
                    xp = 0.5;
                } else {
                    salario = Math.floor(Math.random() * 300) + 400;
                    texto = `🏆 Tesouro perdido! Ganhou R$${salario}!`;
                }
                break;
            case 'ladrao':
                if (chance > 30) {
                    salario = Math.floor(Math.random() * (job.max - job.min)) + job.min;
                    texto = `🕵️ Roubou baú nobre! Ganhou R$${salario}!`;
                } else if (chance > 10) {
                    texto = '🚨 Pego pelos guardas! Perdeu 20 HP!';
                    dados.status.hp -= 20;
                    xp = 0.5;
                } else {
                    salario = Math.floor(Math.random() * 200) + 300;
                    texto = `💎 Joia real roubada! Ganhou R$${salario}!`;
                }
                break;
            case 'mago':
                if (chance > 30) {
                    salario = Math.floor(Math.random() * (job.max - job.min)) + job.min;
                    texto = `🪄 Feitiços poderosos! Ganhou R$${salario}!`;
                } else if (chance > 10) {
                    texto = '🧙‍♂️ Mana esgotada! Sem trabalho.';
                    xp = 0.5;
                } else {
                    salario = Math.floor(Math.random() * 300) + 400;
                    texto = `✨ Artefato mágico! Ganhou R$${salario}!`;
                }
                break;
        }

        dados.delay.trabalhar = agora + (job.delay * 1000);
        dados.xp += xp;
        if (salario > 0) {
            dados = addSaldo(dados, salario);
            await atualizarRanking(sender, 'ouro', salario);
        }

        const proximo = empregos.find(e => e.xp > job.xp && e.xp <= dados.xp);
        if (proximo) texto += `\n\n📜 Nova trilha aberta! Torne-se *${proximo.nome}*!`;

        await salvar(sender, dados);
        await atualizarRanking(sender, 'xp', xp);
        return { msg: texto };
    } catch (err) {
        console.error('Erro ao trabalhar:', err);
        return { msg: '⚠️ Sombra atrapalhou seu trabalho!' };
    }
}

// Compra itens
async function comprarItem(sender, item) {
    try {
        const it = itensLoja.find(i => normalizar(i.nome) === normalizar(item));
        if (!it) return { msg: '⚠️ Item não está no mercado! Use #prefix#loja.' };
        let dados = await getUser(sender);
        if (!dados) return { msg: '⚠️ Herói não encontrado!' };
        if (dados.saldo.carteira < it.valor) return { msg: '💸 Ouro insuficiente!' };
        if (it.pet && dados.pet) return { msg: '⚠️ Você já tem um companheiro!' };
        dados = delSaldo(dados, it.valor);
        dados = addItem(dados, it.nome);
        if (it.pet) {
            dados.pet = { nome: it.nome, ultimaAlimentacao: Date.now() };
        }
        await salvar(sender, dados);
        return { msg: `🛒 Adquiriu *${it.nomeExibicao || it.nome}* por R$${it.valor}! ${it.pet ? 'Seu novo companheiro está pronto!' : 'Na sua mochila!'}` };
    } catch (err) {
        console.error('Erro ao comprar:', err);
        return { msg: '⚠️ Mercado rejeitou sua oferta!' };
    }
}

// Vende itens
async function venderItem(sender, item, qtd = 1) {
    try {
        const it = itensVenda.find(i => normalizar(i.nome) === normalizar(item)) || itensLoja.find(i => normalizar(i.nome) === normalizar(item));
        if (!it) return { msg: '⚠️ Item não vendável!' };
        let dados = await getUser(sender);
        if (!dados || !dados.inv[it.nome] || dados.inv[it.nome] < qtd) {
            return { msg: `⚠️ Não tem ${qtd}x *${it.nomeExibicao || it.nome}*! Mochila: ${dados.inv[it.nome] || 0}.` };
        }
        if (it.pet && dados.pet?.nome === it.nome) dados.pet = null;
        const ganho = it.venda * qtd;
        dados = addSaldo(dados, ganho);
        dados = delItem(dados, it.nome, qtd);
        await salvar(sender, dados);
        return { msg: `💰 Vendeu ${qtd}x *${it.nomeExibicao || it.nome}* por R$${ganho}!` };
    } catch (err) {
        console.error('Erro ao vender:', err);
        return { msg: '⚠️ Mercador recusou sua oferta!' };
    }
}

// Alimenta pet
async function alimentarPet(sender) {
    try {
        let dados = await getUser(sender);
        if (!dados) return { msg: '⚠️ Herói não encontrado!' };
        const petFugiu = await verificarPet(dados);
        if (petFugiu) {
            await salvar(sender, dados);
            return petFugiu;
        }
        if (!dados.pet) return { msg: '⚠️ Você não tem um companheiro!' };
        if (!dados.inv.racao) return { msg: '⚠️ Sem ração! Compre no mercado!' };
        const agora = Date.now();
        if (agora - dados.pet.ultimaAlimentacao < 24 * 60 * 60 * 1000) {
            const pet = itensLoja.find(i => i.nome === dados.pet.nome);
            return { msg: `🐾 Seu *${pet?.nomeExibicao || dados.pet.nome}* ainda está satisfeito! Volte em ${Math.ceil((24 * 60 * 60 * 1000 - (agora - dados.pet.ultimaAlimentacao)) / 1000 / 3600)} horas.` };
        }
        dados = delItem(dados, 'racao');
        dados.pet.ultimaAlimentacao = agora;
        await salvar(sender, dados);
        const pet = itensLoja.find(i => i.nome === dados.pet.nome);
        return { msg: `🐾 Alimentou seu *${pet?.nomeExibicao || dados.pet.nome}*! Ele está pronto para te ajudar!` };
    } catch (err) {
        console.error('Erro ao alimentar pet:', err);
        return { msg: '⚠️ Seu pet recusou a ração!' };
    }
}

// Pesca
async function pescar(sender) {
    try {
        let dados = await getUser(sender);
        if (!dados) return { msg: '⚠️ Herói não encontrado!' };
        const petFugiu = await verificarPet(dados);
        if (petFugiu) {
            await salvar(sender, dados);
            return petFugiu;
        }
        if (!dados.inv.isca) return { msg: '🎣 Sem iscas! Compre no mercado!' };
        const agora = Date.now();
        if (dados.delay?.pescar && agora < dados.delay.pescar) {
            return { msg: `🌊 Águas agitadas! Espere ${Math.ceil((dados.delay.pescar - agora) / 1000)} segundos.` };
        }
        let peixes = Math.floor(Math.random() * 11) + 5;
        if (dados.pet?.nome === 'falcao') peixes = Math.floor(peixes * 1.1);
        dados.delay.pescar = agora + 2 * 60 * 1000;
        dados = delItem(dados, 'isca');
        dados = addItem(dados, 'peixe', peixes);
        await salvar(sender, dados);
        return { msg: `🎣 Pescou ${peixes} peixes brilhantes! Boa, pescador!` };
    } catch (err) {
        console.error('Erro ao pescar:', err);
        return { msg: '⚠️ Monstro marinho roubou sua isca!' };
    }
}

// Caca
async function cacar(sender) {
    try {
        let dados = await getUser(sender);
        if (!dados) return { msg: '⚠️ Herói não encontrado!' };
        const petFugiu = await verificarPet(dados);
        if (petFugiu) {
            await salvar(sender, dados);
            return petFugiu;
        }
        if (!dados.inv.arma || !dados.inv.municao) return { msg: '🏹 Precisa de arma e munição!' };
        const agora = Date.now();
        if (dados.delay?.cacar && agora < dados.delay.cacar) {
            return { msg: `🦌 Presas escondidas! Espere ${Math.ceil((dados.delay.cacar - agora) / 1000)} segundos.` };
        }
        const quebra = Math.random() < 0.2;
        let carnes = Math.floor(Math.random() * 11) + 10;
        if (dados.pet?.nome === 'lobo') carnes = Math.floor(carnes * 1.2);
        dados.delay.cacar = agora + 4 * 60 * 1000;
        dados = delItem(dados, 'municao');
        if (quebra) {
            dados = delItem(dados, 'arma');
            await salvar(sender, dados);
            return { msg: `🏹 Caçou ${carnes} carnes, mas sua arma partiu-se!` };
        }
        dados = addItem(dados, 'carne', carnes);
        await salvar(sender, dados);
        return { msg: `🏹 Caçada gloriosa! Conseguiu ${carnes} carnes!` };
    } catch (err) {
        console.error('Erro ao caçar:', err);
        return { msg: '⚠️ Urso te assustou na floresta!' };
    }
}

// Mineracao
async function minerar(sender) {
    try {
        let dados = await getUser(sender);
        if (!dados) return { msg: '⚠️ Herói não encontrado!' };
        const petFugiu = await verificarPet(dados);
        if (petFugiu) {
            await salvar(sender, dados);
            return petFugiu;
        }
        if (!dados.inv.picareta) return { msg: '⛏️ Precisa de picareta!' };
        const agora = Date.now();
        if (dados.delay?.minerar && agora < dados.delay.minerar) {
            return { msg: `⛏️ Mina selada! Espere ${Math.ceil((dados.delay.minerar - agora) / 1000)} segundos.` };
        }
        const minerios = [
            { nome: 'carvao', chance: 50 },
            { nome: 'ferro', chance: 30 },
            { nome: 'prata', chance: 20 },
            { nome: 'ouro', chance: 15 },
            { nome: 'diamante', chance: 5 },
            { nome: 'esmeralda', chance: 3 }
        ];
        const ganhos = [];
        for (const m of minerios) {
            if (Math.random() * 100 < m.chance) {
                const qtd = Math.floor(Math.random() * 3) + 1;
                ganhos.push({ nome: m.nome, qtd });
                dados = addItem(dados, m.nome, qtd);
            }
        }
        if (Math.random() < 0.25) {
            dados = delItem(dados, 'picareta');
            ganhos.push({ nome: 'picareta quebrada', qtd: 1 });
        }
        dados.delay.minerar = agora + 3 * 60 * 1000;
        await salvar(sender, dados);
        const texto = ganhos.length ? ganhos.map(g => `${g.qtd}x ${itensVenda.find(i => i.nome === g.nome)?.nomeExibicao || g.nome}`).join(', ') : 'nada';
        return { msg: `⛏️ Cavou fundo e encontrou: ${texto}!` };
    } catch (err) {
        console.error('Erro ao minerar:', err);
        return { msg: '⚠️ Mina desmoronou!' };
    }
}

// Agricultura
async function plantar(sender) {
    try {
        let dados = await getUser(sender);
        if (!dados) return { msg: '⚠️ Herói não encontrado!' };
        const petFugiu = await verificarPet(dados);
        if (petFugiu) {
            await salvar(sender, dados);
            return petFugiu;
        }
        if (!dados.inv.semente) return { msg: '🌱 Precisa de sementes!' };
        const agora = Date.now();
        if (dados.delay?.plantar && agora < dados.delay.plantar) {
            return { msg: `🌾 Plantações crescem! Espere ${Math.ceil((dados.delay.plantar - agora) / 1000)} segundos.` };
        }
        let colheita = Math.floor(Math.random() * 5) + 3;
        if (dados.pet?.nome === 'falcao') colheita = Math.floor(colheita * 1.1);
        dados = delItem(dados, 'semente');
        dados = addItem(dados, 'trigo', colheita);
        dados.delay.plantar = agora + 5 * 60 * 1000;
        await salvar(sender, dados);
        return { msg: `🌾 Plantou e colheu ${colheita} trigos dourados!` };
    } catch (err) {
        console.error('Erro ao plantar:', err);
        return { msg: '⚠️ Praga atacou sua plantação!' };
    }
}

// Corte de madeira
async function cortar(sender) {
    try {
        let dados = await getUser(sender);
        if (!dados) return { msg: '⚠️ Herói não encontrado!' };
        const petFugiu = await verificarPet(dados);
        if (petFugiu) {
            await salvar(sender, dados);
            return petFugiu;
        }
        if (!dados.inv.machado) return { msg: '🪓 Precisa de machado!' };
        const agora = Date.now();
        if (dados.delay?.cortar && agora < dados.delay.cortar) {
            return { msg: `🌲 Floresta descansa! Espere ${Math.ceil((dados.delay.cortar - agora) / 1000)} segundos.` };
        }
        let madeira = Math.floor(Math.random() * 7) + 4;
        if (dados.pet?.nome === 'lobo') madeira = Math.floor(madeira * 1.2);
        const quebra = Math.random() < 0.2;
        if (quebra) {
            dados = delItem(dados, 'machado');
            await salvar(sender, dados);
            return { msg: `🪓 Cortou ${madeira} madeiras, mas seu machado quebrou!` };
        }
        dados = addItem(dados, 'madeira', madeira);
        dados.delay.cortar = agora + 3 * 60 * 1000;
        await salvar(sender, dados);
        return { msg: `🪓 Derrubou árvores e conseguiu ${madeira} madeiras!` };
    } catch (err) {
        console.error('Erro ao cortar:', err);
        return { msg: '⚠️ Espírito da floresta te expulsou!' };
    }
}

// Batalha contra monstros
async function batalhar(sender) {
    try {
        let dados = await getUser(sender);
        if (!dados) return { msg: '⚠️ Herói não encontrado!' };
        const petFugiu = await verificarPet(dados);
        if (petFugiu) {
            await salvar(sender, dados);
            return petFugiu;
        }
        if (!dados.inv.arma && !dados.inv.varinha) return { msg: '⚔️ Precisa de arma ou varinha!' };
        if (dados.status.hp <= 30) return { msg: '💔 Muito ferido! Cure-se antes!' };
        const agora = Date.now();
        if (dados.delay?.batalhar && agora < dados.delay.batalhar) {
            return { msg: `⚔️ Monstros escondidos! Espere ${Math.ceil((dados.delay.batalhar - agora) / 1000)} segundos.` };
        }
        const monstro = monstros[Math.floor(Math.random() * monstros.length)];
        let dano = Math.floor(Math.random() * monstro.ataque) + 5;
        if (dados.inv.escudo) dano = Math.floor(dano * 0.9);
        if (dados.pet?.nome === 'dragao bebe') dano -= 10;
        dados.status.hp -= dano;
        dados.delay.batalhar = agora + 5 * 60 * 1000;
        if (Math.random() < 0.1 && dados.inv.arma) dados = delItem(dados, 'arma');
        dados = addSaldo(dados, monstro.recompensa.dinheiro);
        dados = addItem(dados, monstro.recompensa.item);
        dados.xp += monstro.recompensa.xp;
        await salvar(sender, dados);
        await atualizarRanking(sender, 'monstros', 1);
        return { msg: `⚔️ Enfrentou *${monstro.nomeExibicao}*! Tomou ${dano} dano, mas ganhou R$${monstro.recompensa.dinheiro}, ${monstro.recompensa.xp} XP e 1x *${itensVenda.find(i => i.nome === monstro.recompensa.item)?.nomeExibicao || monstro.recompensa.item}*!` };
    } catch (err) {
        console.error('Erro ao batalhar:', err);
        return { msg: '⚠️ Monstro te emboscou!' };
    }
}

// Duelo PvP
async function duelar(sender, adversario, aposta) {
    try {
        let dados = await getUser(sender);
        let rival = await getUser(adversario);
        if (!dados || !rival) return { msg: '⚠️ Um dos heróis não existe!' };
        const petFugiu = await verificarPet(dados);
        if (petFugiu) {
            await salvar(sender, dados);
            return petFugiu;
        }
        if (sender === adversario) return { msg: '⚠️ Não pode duelar consigo mesmo!' };
        if (apesta < 100) return { msg: '⚠️ Aposta mínima é R$100!' };
        if (dados.saldo.carteira < aposta || rival.saldo.carteira < aposta) return { msg: '💸 Ouro insuficiente!' };
        if (dados.status.hp < 30 || rival.status.hp < 30) return { msg: '💔 Um dos heróis está muito ferido!' };
        const agora = Date.now();
        if (dados.delay?.duelar && agora < dados.delay.duelar) {
            return { msg: `⚔️ Recupere-se! Espere ${Math.ceil((dados.delay.duelar - agora) / 1000)} segundos.` };
        }

        duelosPendentes[sender] = { adversario, aposta, timestamp: agora };
        dados.delay.duelar = agora + 5 * 60 * 1000;
        await salvar(sender, dados);
        return { msg: `⚔️ @${dados.nome} desafiou @${rival.nome} por R$${apesta}! Use #prefix#aceitar para lutar!` };
    } catch (err) {
        console.error('Erro ao duelar:', err);
        return { msg: '⚠️ O duelo foi amaldiçoado!' };
    }
}

// Aceita duelo
async function aceitarDuelo(sender) {
    try {
        let dados = await getUser(sender);
        if (!dados) return { msg: '⚠️ Herói não encontrado!' };
        const petFugiu = await verificarPet(dados);
        if (petFugiu) {
            await salvar(sender, dados);
            return petFugiu;
        }
        const duelo = Object.values(duelosPendentes).find(d => d.adversario === sender);
        if (!duelo) return { msg: '⚠️ Nenhum duelo pendente!' };
        const desafianteId = Object.keys(duelosPendentes).find(k => duelosPendentes[k].adversario === sender);
        let desafiante = await getUser(desafianteId);
        if (!desafiante) return { msg: '⚠️ Desafiante sumiu!' };

        let poder1 = dados.status.hp + (dados.inv.arma ? 20 : 0) + (dados.inv.varinha ? 30 : 0) + (dados.pet?.nome === 'dragao bebe' ? 20 : 0);
        let poder2 = desafiante.status.hp + (desafiante.inv.arma ? 20 : 0) + (desafiante.inv.varinha ? 30 : 0) + (desafiante.pet?.nome === 'dragao bebe' ? 20 : 0);
        poder1 *= (Math.random() * 0.4 + 0.8);
        poder2 *= (Math.random() * 0.4 + 0.8);

        const vencedor = poder1 > poder2 ? dados : desafiante;
        const perdedor = vencedor === dados ? desafiante : dados;
        dados = delSaldo(dados, duelo.aposta);
        desafiante = delSaldo(desafiante, duelo.aposta);
        vencedor === dados ? (dados = addSaldo(dados, duelo.aposta * 2)) : (desafiante = addSaldo(desafiante, duelo.aposta * 2));
        vencedor.status.hp = Math.max(10, vencedor.status.hp - 20);
        perdedor.status.hp = Math.max(10, perdedor.status.hp - 30);
        if (Math.random() < 0.1 && vencedor.inv.arma) vencedor === dados ? (dados = delItem(dados, 'arma')) : (desafiante = delItem(desafiante, 'arma'));
        if (Math.random() < 0.15 && perdedor.inv.arma) perdedor === dados ? (dados = delItem(dados, 'arma')) : (desafiante = delItem(desafiante, 'arma'));
        await salvar(dados.id, dados);
        await salvar(desafiante.id, desafiante);
        delete duelosPendentes[desafiante.id];

        return { msg: `⚔️ Duelo épico! @${vencedor.nome} venceu @${perdedor.nome} e levou R$${duelo.aposta * 2}! Ambos estão feridos!` };
    } catch (err) {
        console.error('Erro ao aceitar duelo:', err);
        return { msg: '⚠️ O duelo falhou!' };
    }
}

// Usa pocao
async function usarPocao(sender) {
    try {
        let dados = await getUser(sender);
        if (!dados) return { msg: '⚠️ Herói não encontrado!' };
        const petFugiu = await verificarPet(dados);
        if (petFugiu) {
            await salvar(sender, dados);
            return petFugiu;
        }
        if (!dados.inv.pocao) return { msg: '🧪 Sem poções!' };
        dados = delItem(dados, 'pocao');
        dados.status.hp = Math.min(100, dados.status.hp + 50);
        dados.status.fadiga = Math.max(0, dados.status.fadiga - 20);
        await salvar(sender, dados);
        return { msg: `🧪 Bebeu poção mágica! Recuperou 50 HP e 20 energia!` };
    } catch (err) {
        console.error('Erro ao usar poção:', err);
        return { msg: '⚠️ Poção estragada!' };
    }
}

// Inventario
async function verInventario(sender) {
    try {
        let dados = await getUser(sender);
        if (!dados) return { msg: '⚠️ Herói não encontrado!' };
        const petFugiu = await verificarPet(dados);
        if (petFugiu) {
            await salvar(sender, dados);
            return petFugiu;
        }
        if (!Object.keys(dados.inv).length) return { msg: '🛒 *Mochila vazia!* Explore o mercado!' };
        let texto = '🎒 *Sua Mochila* 🎒\n\n';
        for (const item in dados.inv) {
            const it = itensLoja.find(i => i.nome === item) || itensVenda.find(i => i.nome === item);
            texto += `- *${it?.nomeExibicao || item}*: ${dados.inv[item]}\n`;
        }
        return { msg: texto.trim() };
    } catch (err) {
        console.error('Erro no inventário:', err);
        return { msg: '⚠️ Mochila enfeitiçada!' };
    }
}

// Perfil
async function verPerfil(sender) {
    try {
        let dados = await getUser(sender);
        if (!dados) return { msg: '⚠️ Herói não encontrado!' };
        const petFugiu = await verificarPet(dados);
        if (petFugiu) {
            await salvar(sender, dados);
            return petFugiu;
        }
        const inv = Object.keys(dados.inv).length ? Object.keys(dados.inv).map(i => {
            const it = itensLoja.find(item => item.nome === i) || itensVenda.find(item => item.nome === i);
            return `- *${it?.nomeExibicao || i}*: ${dados.inv[i]}`;
        }).join('\n') : 'Nenhum item';
        const guilda = dados.guilda ? `Faz parte da guilda *${dados.guilda}*` : 'Sem guilda';
        const pet = dados.pet ? `Companheiro: *${itensLoja.find(i => i.nome === dados.pet.nome)?.nomeExibicao || dados.pet.nome}*` : 'Sem companheiro';
        const titulo = dados.titulo ? `🏆 Título: *${dados.titulo}*` : '';
        const texto = `🛡️ *Lenda de ${dados.nome || 'Herói'}* 🛡️
---------------------------------
📛 *Nome*: ${dados.nome || 'Desconhecido'}
${titulo}
💼 *Caminho*: ${dados.emprego || 'Andarilho'}
📊 *XP*: ${dados.xp || 0}
🩺 *Vida*: ${dados.status.hp || 100}%
😴 *Fadiga*: ${dados.status.fadiga || 0}%
😊 *Moral*: ${dados.status.moral || 100}%

🏦 *Ouro no Banco*: R$${dados.saldo.banco || 0}
💰 *Ouro na Mochila*: R$${dados.saldo.carteira || 0}

🎒 *Mochila*:
${inv}

🏰 *Guilda*: ${guilda}
🐾 *Pet*: ${pet}
---------------------------------`;
        return { msg: texto.trim() };
    } catch (err) {
        console.error('Erro no perfil:', err);
        return { msg: '⚠️ Lenda oculta!' };
    }
}

// Inicia missao
async function iniciarMissao(sender, nome) {
    try {
        let dados = await getUser(sender);
        if (!dados) return { msg: '⚠️ Herói não encontrado!' };
        const petFugiu = await verificarPet(dados);
        if (petFugiu) {
            await salvar(sender, dados);
            return petFugiu;
        }
        const missao = missoes.find(m => normalizar(m.nome) === normalizar(nome));
        if (!missao) return { msg: '⚠️ Missão não encontrada!' };
        if (dados.missoes.includes(missao.nome)) return { msg: '⚠️ Você já está nessa saga!' };
        dados.missoes.push(missao.nome);
        await salvar(sender, dados);
        return { msg: `📜 *${missao.nomeExibicao}* começou! ${missao.desc}` };
    } catch (err) {
        console.error('Erro ao iniciar missão:', err);
        return { msg: '⚠️ Missão amaldiçoada!' };
    }
}

// Completa missao
async function completarMissao(sender, nome) {
    try {
        let dados = await getUser(sender);
        if (!dados) return { msg: '⚠️ Herói não encontrado!' };
        const petFugiu = await verificarPet(dados);
        if (petFugiu) {
            await salvar(sender, dados);
            return petFugiu;
        }
        const missao = missoes.find(m => normalizar(m.nome) === normalizar(nome));
        if (!missao || !dados.missoes.includes(missao.nome)) return { msg: '⚠️ Missão não iniciada!' };
        let delayMissao = 5 * 60 * 1000;
        if (dados.pet?.nome === 'falcao') delayMissao *= 0.9;
        dados.missoes = dados.missoes.filter(m => m !== missao.nome);
        dados = addSaldo(dados, missao.recompensa.dinheiro);
        dados.xp += missao.recompensa.xp;
        if (missao.recompensa.item) dados = addItem(dados, missao.recompensa.item);
        dados.delay.missao = Date.now() + delayMissao;
        await salvar(sender, dados);
        await atualizarRanking(sender, 'xp', missao.recompensa.xp);
        let texto = `🏆 Completou *${missao.nomeExibicao}*! Ganhou R$${missao.recompensa.dinheiro} e ${missao.recompensa.xp} XP!`;
        if (missao.recompensa.item) texto += ` Também conseguiu 1x *${itensVenda.find(i => i.nome === missao.recompensa.item)?.nomeExibicao || missao.recompensa.item}*!`;
        return { msg: texto };
    } catch (err) {
        console.error('Erro ao completar missão:', err);
        return { msg: '⚠️ Missão falhou!' };
    }
}

// Cria guilda
async function criarGuilda(sender, nome) {
    try {
        let dados = await getUser(sender);
        if (!dados) return { msg: '⚠️ Herói não encontrado!' };
        const petFugiu = await verificarPet(dados);
        if (petFugiu) {
            await salvar(sender, dados);
            return petFugiu;
        }
        if (dados.guilda) return { msg: '⚠️ Você já pertence a uma guilda!' };
        if (dados.saldo.carteira < 5000) return { msg: '⚠️ Guilda custa R$5000!' };
        dados = delSaldo(dados, 5000);
        dados.guilda = normalizar(nome);
        await salvar(sender, dados);
        return { msg: `🏰 Guilda *${nome}* fundada! Você é o líder supremo!` };
    } catch (err) {
        console.error('Erro ao criar guilda:', err);
        return { msg: '⚠️ Reino rejeitou sua guilda!' };
    }
}

// Junta-se a guilda
async function entrarGuilda(sender, nome) {
    try {
        let dados = await getUser(sender);
        if (!dados) return { msg: '⚠️ Herói não encontrado!' };
        const petFugiu = await verificarPet(dados);
        if (petFugiu) {
            await salvar(sender, dados);
            return petFugiu;
        }
        if (dados.guilda) return { msg: '⚠️ Você já pertence a uma guilda!' };
        const arquivos = await fs.readdir(RpgPath);
        let guildaExiste = false;
        for (const arquivo of arquivos) {
            const user = JSON.parse(await fs.readFile(path.join(RpgPath, arquivo), 'utf-8'));
            if (normalizar(user.guilda || '') === normalizar(nome)) {
                guildaExiste = true;
                break;
            }
        }
        if (!guildaExiste) return { msg: '⚠️ Guilda não encontrada!' };
        dados.guilda = normalizar(nome);
        await salvar(sender, dados);
        return { msg: `🤝 Agora faz parte da guilda *${nome}*! Aventuras épicas te esperam!` };
    } catch (err) {
        console.error('Erro ao entrar na guilda:', err);
        return { msg: '⚠️ Guilda recusou seu pedido!' };
    }
}

// Sai da guilda
async function sairGuilda(sender) {
    try {
        let dados = await getUser(sender);
        if (!dados) return { msg: '⚠️ Herói não encontrado!' };
        const petFugiu = await verificarPet(dados);
        if (petFugiu) {
            await salvar(sender, dados);
            return petFugiu;
        }
        if (!dados.guilda) return { msg: '⚠️ Você não está em guilda!' };
        dados.guilda = null;
        await salvar(sender, dados);
        return { msg: '🌬️ Abandonou sua guilda! O caminho solitário te espera.' };
    } catch (err) {
        console.error('Erro ao sair da guilda:', err);
        return { msg: '⚠️ Não conseguiu deixar a guilda!' };
    }
}

// Exibe ranking
async function verRanking(sender) {
    try {
        let dados = await getUser(sender);
        if (!dados) return { msg: '⚠️ Herói não encontrado!' };
        const petFugiu = await verificarPet(dados);
        if (petFugiu) {
            await salvar(sender, dados);
            return petFugiu;
        }
        const ranking = JSON.parse(await fs.readFile(RankPath, 'utf-8'));
        const agora = Date.now();
        if (agora - ranking.reset > 7 * 24 * 60 * 60 * 1000) {
            ranking.ouro = {};
            ranking.xp = {};
            ranking.monstros = {};
            ranking.reset = agora;
            await fs.writeFile(RankPath, JSON.stringify(ranking, null, 2));
        }

        const formatarRanking = (tipo, nome, unidade) => {
            const lista = Object.entries(ranking[tipo])
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([id, valor], i) => `${i + 1}. @${id.split('@')[0]}: ${valor}${unidade}`);
            return lista.length ? lista.join('\n') : 'Ninguém no ranking!';
        };

        let texto = '🏆 *Ranking do Reino* 🏆\n\n';
        texto += '💰 *Reis do Ouro* 💰\n';
        texto += formatarRanking('ouro', 'Ouro', ' ouro') + '\n\n';
        texto += '📊 *Lendas do XP* 📊\n';
        texto += formatarRanking('xp', 'XP', ' XP') + '\n\n';
        texto += '⚔️ *Matadores de Monstros* ⚔️\n';
        texto += formatarRanking('monstros', 'Monstros', ' monstros');

        const topOuro = Object.entries(ranking.ouro).sort((a, b) => b[1] - a[1])[0]?.[0];
        const topXp = Object.entries(ranking.xp).sort((a, b) => b[1] - a[1])[0]?.[0];
        const topMonstros = Object.entries(ranking.monstros).sort((a, b) => b[1] - a[1])[0]?.[0];
        if (topOuro) {
            let user = await getUser(topOuro);
            if (user) {
                user.titulo = 'Rei do Ouro';
                await salvar(topOuro, user);
            }
        }
        if (topXp) {
            let user = await getUser(topXp);
            if (user) {
                user.titulo = 'Lenda Viva';
                await salvar(topXp, user);
            }
        }
        if (topMonstros) {
            let user = await getUser(topMonstros);
            if (user) {
                user.titulo = 'Matador de Monstros';
                await salvar(topMonstros, user);
            }
        }

        return { msg: texto };
    } catch (err) {
        console.error('Erro no ranking:', err);
        return { msg: '⚠️ As runas do ranking falharam!' };
    }
}

// Cassino
async function cassino(sender, aposta) {
    try {
        let dados = await getUser(sender);
        if (!dados) return { msg: '⚠️ Herói não encontrado!' };
        const petFugiu = await verificarPet(dados);
        if (petFugiu) {
            await salvar(sender, dados);
            return petFugiu;
        }
        if (apesta < 150) return { msg: '⚠️ Aposta mínima é R$150!' };
        if (dados.saldo.carteira < aposta) return { msg: '💸 Ouro insuficiente!' };
        dados = delSaldo(dados, aposta);
        const rodada = Array(3).fill().map(() => frutas[Math.floor(Math.random() * frutas.length)]);
        const rodadaExibicao = rodada.map(r => frutasExibicao[frutas.indexOf(r)]);
        let resultado = '', premio = 0;
        if (Math.random() <= 0.4) {
            if (rodada[0] === rodada[1] && rodada[1] === rodada[2]) {
                premio = aposta * 5;
                resultado = `🎉 *Jackpot Mágico!* ${rodadaExibicao.join(' ')}\nGanhou R$${premio}!`;
            } else if (rodada[0] === rodada[1] || rodada[1] === rodada[2] || rodada[0] === rodada[2]) {
                resultado = `😐 Duas iguais: ${rodadaExibicao.join(' ')}\nNem ganhou, nem perdeu!`;
            } else {
                resultado = `💔 Perdeu! Runas: ${rodadaExibicao.join(' ')}`;
            }
        } else {
            resultado = `💔 Perdeu! Runas: ${rodadaExibicao.join(' ')}`;
        }
        if (premio > 0) dados = addSaldo(dados, premio);
        await salvar(sender, dados);
        return { msg: `${resultado}\n💰 *Ouro Atual*: R$${dados.saldo.carteira}` };
    } catch (err) {
        console.error('Erro no cassino:', err);
        return { msg: '⚠️ Runas do cassino falharam!' };
    }
}

// Depositar (transfere do saldo da carteira para o banco)
async function depositar(sender, valor) {
    try {
        let dados = await getUser(sender);
        if (!dados) return { msg: '⚠️ Herói não encontrado!' };
        if (isNaN(valor) || valor <= 0) return { msg: '⚠️ Valor inválido! Informe um número maior que zero.' };
        if (dados.saldo.carteira < valor) return { msg: '💸 Ouro insuficiente na carteira!' };
        dados = delSaldo(dados, valor, false); // Remove da carteira
        dados = addSaldo(dados, valor, true);  // Adiciona ao banco
        await salvar(sender, dados);
        return { msg: `🏦 Depositou R$${valor} no banco! Agora tem R$${dados.saldo.banco} no banco e R$${dados.saldo.carteira} na carteira.` };
    } catch (err) {
        console.error('Erro ao depositar:', err);
        return { msg: '⚠️ Falha ao depositar no banco!' };
    }
}

// Sacar (transfere do banco para a carteira)
async function sacar(sender, valor) {
    try {
        let dados = await getUser(sender);
        if (!dados) return { msg: '⚠️ Herói não encontrado!' };
        if (isNaN(valor) || valor <= 0) return { msg: '⚠️ Valor inválido! Informe um número maior que zero.' };
        if (dados.saldo.banco < valor) return { msg: '🏦 Ouro insuficiente no banco!' };
        dados = delSaldo(dados, valor, true);  // Remove do banco
        dados = addSaldo(dados, valor, false); // Adiciona à carteira
        await salvar(sender, dados);
        return { msg: `💰 Sacou R$${valor} do banco! Agora tem R$${dados.saldo.banco} no banco e R$${dados.saldo.carteira} na carteira.` };
    } catch (err) {
        console.error('Erro ao sacar:', err);
        return { msg: '⚠️ Falha ao sacar do banco!' };
    }
}

// Depositar tudo (transfere todo o saldo da carteira para o banco)
async function depoall(sender) {
    try {
        let dados = await getUser(sender);
        if (!dados) return { msg: '⚠️ Herói não encontrado!' };
        if (dados.saldo.carteira <= 0) return { msg: '💸 Nenhum ouro na carteira para depositar!' };
        const valor = dados.saldo.carteira;
        dados = delSaldo(dados, valor, false); // Remove da carteira
        dados = addSaldo(dados, valor, true);  // Adiciona ao banco
        await salvar(sender, dados);
        return { msg: `🏦 Depositou todo o ouro (R$${valor}) no banco! Agora tem R$${dados.saldo.banco} no banco e R$${dados.saldo.carteira} na carteira.` };
    } catch (err) {
        console.error('Erro ao depositar tudo:', err);
        return { msg: '⚠️ Falha ao depositar todo o ouro!' };
    }
}

// Sacar tudo (transfere todo o saldo do banco para a carteira)
async function saqueall(sender) {
    try {
        let dados = await getUser(sender);
        if (!dados) return { msg: '⚠️ Herói não encontrado!' };
        if (dados.saldo.banco <= 0) return { msg: '🏦 Nenhum ouro no banco para sacar!' };
        const valor = dados.saldo.banco;
        dados = delSaldo(dados, valor, true);  // Remove do banco
        dados = addSaldo(dados, valor, false); // Adiciona à carteira
        await salvar(sender, dados);
        return { msg: `💰 Sacou todo o ouro (R$${valor}) do banco! Agora tem R$${dados.saldo.banco} no banco e R$${dados.saldo.carteira} na carteira.` };
    } catch (err) {
        console.error('Erro ao sacar tudo:', err);
        return { msg: '⚠️ Falha ao sacar todo o ouro!' };
    }
}

// Pix (transfere ouro da carteira de um usuário para a carteira de outro)
async function pix(sender, destinatario, valor) {
    try {
        let remetenteDados = await getUser(sender);
        let destinatarioDados = await getUser(destinatario);
        if (!remetenteDados || !destinatarioDados) return { msg: '⚠️ Um dos heróis não foi encontrado!' };
        if (sender === destinatario) return { msg: '⚠️ Não pode enviar ouro para si mesmo!' };
        if (isNaN(valor) || valor <= 0) return { msg: '⚠️ Valor inválido! Informe um número maior que zero.' };
        if (remetenteDados.saldo.carteira < valor) return { msg: '💸 Ouro insuficiente na carteira!' };
        
        // Modifica os dados
        remetenteDados = delSaldo(remetenteDados, valor, false); // Remove da carteira do remetente
        destinatarioDados = addSaldo(destinatarioDados, valor, false); // Adiciona à carteira do destinatário
        
        // Salva ambos os usuários
        await salvar(sender, remetenteDados);
        await salvar(destinatario, destinatarioDados);
        
        return { 
            msg: `💸 Transferiu R$${valor} para @${destinatarioDados.nome || destinatario}! ` +
                 `Você tem R$${remetenteDados.saldo.carteira} na carteira.`
        };
    } catch (err) {
        console.error('Erro ao realizar pix:', err);
        return { msg: '⚠️ Falha ao transferir ouro!' };
    }
}

// Assaltar (tenta roubar ouro da carteira de outro usuário)
async function assaltar(sender, alvo) {
    try {
        let assaltanteDados = await getUser(sender);
        let alvoDados = await getUser(alvo);
        if (!assaltanteDados || !alvoDados) return { msg: '⚠️ Um dos heróis não foi encontrado!' };
        if (sender === alvo) return { msg: '⚠️ Não pode assaltar a si mesmo!' };
        if (assaltanteDados.emprego !== 'ladrao') return { msg: '⚠️ Apenas ladrões podem assaltar!' };
        if (assaltanteDados.status.hp <= 30) return { msg: '💔 Muito ferido para assaltar!' };
        
        const agora = Date.now();
        if (assaltanteDados.delay?.assaltar && agora < assaltanteDados.delay.assaltar) {
            return { msg: `🕵️ Guardas atentos! Espere ${Math.ceil((assaltanteDados.delay.assaltar - agora) / 1000)} segundos.` };
        }

        const chance = Math.random() * 100;
        const maxRoubo = Math.min(alvoDados.saldo.carteira, 500); // Limite de roubo
        let texto = '';

        if (chance < 60) {
            // Sucesso
            const ouroRoubado = Math.floor(Math.random() * (maxRoubo - 50)) + 50;
            if (ouroRoubado <= 0) return { msg: '🕵️ O alvo não tinha ouro para roubar!' };
            assaltanteDados = addSaldo(assaltanteDados, ouroRoubado, false);
            alvoDados = delSaldo(alvoDados, ouroRoubado, false);
            texto = `🕵️ Assalto bem-sucedido! Roubou R$${ouroRoubado} de @${alvoDados.nome || alvo}!`;
        } else if (chance < 90) {
            // Falha sem punição
            texto = '🛡️ O alvo escapou! Nenhum ouro roubado.';
        } else {
            // Falha com punição
            assaltanteDados.status.hp -= 20;
            texto = '🚨 Pego pelos guardas! Perdeu 20 HP!';
        }

        // Define delay do assalto (5 minutos)
        assaltanteDados.delay.assaltar = agora + 5 * 60 * 1000;

        // Salva ambos os usuários
        await salvar(sender, assaltanteDados);
        await salvar(alvo, alvoDados);

        return { msg: texto };
    } catch (err) {
        console.error('Erro ao assaltar:', err);
        return { msg: '⚠️ O assalto foi frustrado!' };
    }
}

// Exporta funcoes
module.exports = Object.assign(getUser, {
    rg: rgUser,
    del: delUser,
    trabalhar,
    empregos: listarEmpregos,
    loja: gerarLoja,
    comprar: comprarItem,
    vender: venderItem,
    itens: verInventario,
    me: verPerfil,
    cassino,
    depositar,
    sacar,
    depoall,
    saqueall,
    pix,
    acao: {
        minerar,
        cacar,
        pescar,
        plantar,
        cortar,
        batalhar,
        pocao: usarPocao,
        alimentarPet,
        assaltar
    },
    emprego: {
        add: entrarEmprego,
        del: sairEmprego
    },
    saldo: {
        add: addSaldo,
        del: delSaldo
    },
    banco: {
        add: (dados, valor) => addSaldo(dados, valor, true),
        del: (dados, valor) => delSaldo(dados, valor, true)
    },
    inventario: {
        add: addItem,
        remove: delItem
    },
    missao: {
        iniciar: iniciarMissao,
        completar: completarMissao
    },
    guilda: {
        criar: criarGuilda,
        entrar: entrarGuilda,
        sair: sairGuilda
    },
    duelo: {
        desafiar: duelar,
        aceitar: aceitarDuelo
    },
    ranking: verRanking
});