/*
 *****NÃO MEXA EM NADA AQUI SE NÃO SOUBER O QUE TA FAZENDO*****
*/
//Criador: hiudy
//Versão: 0.0.1
//Esse arquivo contem direitos autorais, caso meus creditos sejam tirados poderei tomar medidas jurídicas.

const youtube = require(__dirname+'/.downloads/.youtube.js');
const tiktok = require(__dirname+'/.downloads/.tiktok.js');
const pinterest = require(__dirname+'/.downloads/.pinterest.js');
const igdl = require(__dirname+'/.downloads/.igdl.js');
const reportError = require(__dirname+'/.utils/.debug.js');
const { sendSticker } = require(__dirname+'/.utils/.sticker.js');

module.exports = { reportError, youtube, tiktok, pinterest, igdl, sendSticker };