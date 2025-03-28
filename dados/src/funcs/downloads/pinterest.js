// Sistema de download e pesquisa Pinterest
// Sistema único, diferente de qualquer outro bot
// Criador: Hiudy
// Caso for usar deixe o caralho dos créditos 
// <3

const axios = require('axios');
const { parseHTML } = require('linkedom');

async function pinterestSearch(texto) {
    try {
        const response = await axios.get(`https://br.pinterest.com/search/pins/?q=${texto}`, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 10; SM-G975F Build/QP1A.190711.020) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.152 Mobile Safari/537.36' }
        });

        const { document } = parseHTML(response.data);
        const imagens = [];

        document.querySelectorAll('.hCL').forEach((el) => {
            const src = el.getAttribute('src');
            if (src) imagens.push(src.replace(/236/g, '736').replace('60x60', '736x'));
        });

        if (imagens.length === 0) return { ok: false, msg: 'Nenhuma imagem encontrada.' };

        const randomImage = imagens[Math.floor(Math.random() * imagens.length)];
        return { ok: true, criador: 'Hiudy', type: 'image', mime: 'image/jpeg', urls: [randomImage] };
    } catch (err) {
        return { ok: false, msg: 'Ocorreu um erro ao buscar imagens.' };
    }
}

async function pinterestDL(url) {
    try {
        if (!/^https?:\/\/(?:[a-zA-Z0-9-]+\.)?pinterest\.\w{2,6}(?:\.\w{2})?\/pin\/\d+|https?:\/\/pin\.it\/[a-zA-Z0-9]+/.test(url)) {
            return { ok: false, msg: 'URL inválida. Certifique-se de que é um link de pin do Pinterest.' };
        }

        const pinIdMatch = url.match(/(?:\/pin\/(\d+)|\/pin\/([a-zA-Z0-9]+))/);
        const pinId = pinIdMatch ? pinIdMatch[1] || pinIdMatch[2] : null;
        if (!pinId) {
            return { ok: false, msg: 'Não foi possível extrair o ID do pin.' };
        }

        const params = {
            source_url: `/pin/${pinId}/`,
            data: {
                options: {
                    id: pinId,
                    field_set_key: "auth_web_main_pin",
                    noCache: true,
                    fetch_visual_search_objects: true,
                },
                context: {},
            },
        };

        const apiUrl = `https://br.pinterest.com/resource/PinResource/get/?source_url=${encodeURIComponent(params.source_url)}&data=${encodeURIComponent(JSON.stringify(params.data))}`;
        const response = await axios.get(apiUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
        });

        const data = response.data;
        const videos = data.resource_response.data.videos?.video_list;
        const images = data.resource_response.data.images;
        let result = [];

        if (videos) {
            for (const key in videos) {
                result.push(videos[key].url);
            }
        }

        if (images) {
            for (const key in images) {
                result.push(images[key].url);
            }
        }

        if (result.length > 0) {
            return { ok: true, type: videos ? 'video' : 'image', mime: videos ? 'video/mp4' : 'image/jpeg', urls: [result[0]] };
        } else {
            return { ok: false, msg: 'Nenhum conteúdo encontrado.' };
        }
    } catch (err) {
        return { ok: false, msg: 'Ocorreu um erro ao baixar o conteúdo.', error: err.message };
    }
}

module.exports = { search: pinterestSearch, dl: pinterestDL };