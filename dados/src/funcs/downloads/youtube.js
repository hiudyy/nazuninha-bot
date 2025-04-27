/**
 * Sistema de Download e Pesquisa YouTube Otimizado
 * Desenvolvido por Hiudy, corrigido por Cognima Team
 * Versão: 3.0.0
 */

const yts = require('yt-search');
const axios = require('axios');
const CryptoJS = require('crypto-js');

// Configurações
const CONFIG = {
  API: {
    SAVETUBE: {
      CDN_URL: 'https://media.savetube.me/api/random-cdn',
      TIMEOUT: 30000
    },
    YTDL_VREDEN: {
      BASE_URL: 'https://ytdl.vreden.web.id',
      TIMEOUT: 30000
    }
  },
  FORMATS: {
    AUDIO: [64, 96, 128, 192, 256, 320, 1000, 1411],
    VIDEO: [360, 480, 720, 1080, 1440]
  },
  CACHE: {
    MAX_SIZE: 1000,
    EXPIRE_TIME: 6 * 60 * 60 * 1000 // 6 horas
  },
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000
  }
};

// Cache para resultados
class YouTubeCache {
  constructor() {
    this.cache = new Map();
  }

  getKey(type, input) {
    return `${type}:${input}`;
  }

  get(type, input) {
    const key = this.getKey(type, input);
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > CONFIG.CACHE.EXPIRE_TIME) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  set(type, input, data) {
    if (this.cache.size >= CONFIG.CACHE.MAX_SIZE) {
      const oldestKey = Array.from(this.cache.keys())[0];
      this.cache.delete(oldestKey);
    }

    const key = this.getKey(type, input);
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
}

// Gerenciador de URLs do YouTube
class YouTubeURLManager {
  static getVideoId(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|v\/|embed\/|user\/[^\/\n\s]+\/)?(?:watch\?v=|v%3D|embed%2F|video%2F)?|youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/|youtube\.com\/playlist\?list=)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : url;
  }

  static getVideoUrl(input) {
    const id = this.getVideoId(input);
    return `https://www.youtube.com/watch?v=${id}`;
  }
}

// Cliente de API
class APIClient {
  constructor(timeout) {
    this.axios = axios.create({
      timeout,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Mobile Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Connection': 'keep-alive',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });
  }

  async request(config, attempt = 1) {
    try {
      const response = await this.axios.request(config);
      return response.data;
    } catch (error) {
      if (attempt < CONFIG.RETRY.MAX_ATTEMPTS) {
        await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY.DELAY * attempt));
        return this.request(config, attempt + 1);
      }
      throw error;
    }
  }
}

// Decodificador para savetube usando CryptoJS
class SaveTubeDecoder {
  static decode(enc) {
    try {
      const secret_key = 'C5D58EF67A7584E4A29F6C35BBC4EB12';
      const data = CryptoJS.enc.Base64.parse(enc);
      const iv = data.words.slice(0, 4); // Primeiros 16 bytes (4 words)
      const content = CryptoJS.lib.WordArray.create(data.words.slice(4));
      
      const key = CryptoJS.enc.Hex.parse(secret_key);
      const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: content },
        key,
        {
          iv: CryptoJS.lib.WordArray.create(iv),
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        }
      );

      return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      throw new Error('Falha na decodificação: ' + error.message);
    }
  }
}

// Gerenciador de Download
class DownloadManager {
  constructor() {
    this.client = new APIClient(CONFIG.API.SAVETUBE.TIMEOUT);
  }

  // Métodos para savetube
  async getCDN() {
    const response = await this.client.request({
      method: 'GET',
      url: CONFIG.API.SAVETUBE.CDN_URL
    });
    return response.cdn;
  }

  async getVideoInfo(cdn, url) {
    const response = await this.client.request({
      method: 'POST',
      url: `https://${cdn}/v2/info`,
      data: { url },
      headers: {
        'Referer': 'https://yt.savetube.me/1kejjj1?id=362796039'
      }
    });
    return SaveTubeDecoder.decode(response.data);
  }

  async download(cdn, info, quality, downloadType) {
    const response = await this.client.request({
      method: 'POST',
      url: `https://${cdn}/download`,
      data: {
        downloadType,
        quality: `${quality}`,
        key: info.key
      },
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://yt.savetube.me/start-download?from=1kejjj1%3Fid%3D362796039'
      }
    });
    return response.data.downloadUrl;
  }

  async downloadMedia(url, quality, type) {
    if (!CONFIG.FORMATS[type.toUpperCase()].includes(Number(quality))) {
      throw new Error('Qualidade inválida');
    }

    const cdn = await this.getCDN();
    const info = await this.getVideoInfo(cdn, url);
    const downloadUrl = await this.download(cdn, info, quality, type);

    return {
      ok: true,
      title: info.title,
      image: info.thumbnail,
      url: downloadUrl,
      filename: `${info.title} (${quality}${type === 'audio' ? 'kbps).mp3' : 'p).mp4'})`,
      quality: `${quality}${type === 'audio' ? 'kbps' : 'p'}`,
      availableQuality: CONFIG.FORMATS[type.toUpperCase()]
    };
  }

  // Método para ytdl.vreden.web.id
  async downloadVreden(videoId, quality, type) {
    if (!CONFIG.FORMATS[type.toUpperCase()].includes(Number(quality))) {
      throw new Error('Qualidade inválida');
    }

    const response = await this.client.request({
      method: 'GET',
      url: `${CONFIG.API.YTDL_VREDEN.BASE_URL}/convert.php/${videoId}/${quality}`
    });

    let download;
    do {
      download = await this.client.request({
        method: 'GET',
        url: `${CONFIG.API.YTDL_VREDEN.BASE_URL}/progress.php/${response.convert}`
      });
      if (download.status === 'Error') {
        throw new Error('Erro no progresso da conversão');
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    } while (download.status !== 'Finished');

    return {
      status: true,
      quality: `${quality}${type === 'audio' ? 'kbps' : 'p'}`,
      availableQuality: CONFIG.FORMATS[type.toUpperCase()],
      url: download.url,
      filename: `${response.title} (${quality}${type === 'audio' ? 'kbps).mp3' : 'p).mp4'})`
    };
  }
}

// Cache e gerenciadores instanciados uma única vez
const cache = new YouTubeCache();
const downloadManager = new DownloadManager();

/**
 * Pesquisa vídeos no YouTube
 * @param {string} name - Termo de pesquisa
 * @returns {Promise<Object>} Resultado da pesquisa
 */
async function search(name) {
  try {
    const cached = cache.get('search', name);
    if (cached) return cached;

    const searchRes = await yts(name);
    if (!searchRes.videos?.length) {
      return { ok: false, msg: 'Não encontrei nenhuma música.' };
    }

    const result = { ok: true, criador: 'Hiudy', data: searchRes.videos[0] };
    cache.set('search', name, result);
    return result;
  } catch (error) {
    console.error('Erro na pesquisa:', error);
    return { ok: false, msg: 'Ocorreu um erro ao realizar a pesquisa.' };
  }
}

/**
 * Download de áudio (savetube)
 * @param {string} input - URL ou ID do vídeo
 * @param {number} quality - Qualidade do áudio (64, 96, 128, 192, 256, 320, 1000, 1411)
 * @returns {Promise<Object>} URL de download
 */
async function mp3(input, quality = 128) {
  try {
    const url = YouTubeURLManager.getVideoUrl(input);
    const cacheKey = url + quality;
    const cached = cache.get('mp3', cacheKey);
    if (cached) return cached;

    const result = await downloadManager.downloadMedia(url, quality, 'audio');
    cache.set('mp3', cacheKey, result);
    return result;
  } catch (error) {
    console.error('Erro no download MP3:', error);
    return { ok: false, msg: 'Erro ao processar o áudio: ' + error.message };
  }
}

/**
 * Download de vídeo (savetube)
 * @param {string} input - URL ou ID do vídeo
 * @param {number} quality - Qualidade do vídeo (360, 480, 720, 1080, 1440)
 * @returns {Promise<Object>} URL de download
 */
async function mp4(input, quality = 360) {
  try {
    const url = YouTubeURLManager.getVideoUrl(input);
    const cacheKey = url + quality;
    const cached = cache.get('mp4', cacheKey);
    if (cached) return cached;

    const result = await downloadManager.downloadMedia(url, quality, 'video');
    cache.set('mp4', cacheKey, result);
    return result;
  } catch (error) {
    console.error('Erro no download MP4:', error);
    return { ok: false, msg: 'Erro ao processar o vídeo: ' + error.message };
  }
}

/**
 * Download de áudio v2 (ytdl.vreden.web.id)
 * @param {string} input - URL ou ID do vídeo
 * @param {number} formats - Qualidade do áudio (64, 96, 128, 192, 256, 320, 1000, 1411)
 * @returns {Promise<Object>} URL de download
 */
async function mp3v2(input, formats = 128) {
  try {
    const url = YouTubeURLManager.getVideoUrl(input);
    const videoId = YouTubeURLManager.getVideoId(url);
    const format = CONFIG.FORMATS.AUDIO.includes(Number(formats)) ? Number(formats) : 128;
    const cacheKey = `mp3v2:${url}:${format}`;
    const cached = cache.get('mp3v2', cacheKey);
    if (cached) return cached;

    if (!videoId) {
      return { status: false, msg: 'URL do YouTube inválida.' };
    }

    const metadata = await yts(url);
    if (!metadata.all?.length) {
      return { status: false, msg: 'Vídeo não encontrado.' };
    }

    const response = await downloadManager.downloadVreden(videoId, format, 'audio');
    const result = {
      status: true,
      creator: 'Hiudy',
      metadata: metadata.all[0],
      download: response
    };

    cache.set('mp3v2', cacheKey, result);
    return result;
  } catch (error) {
    console.error('Erro no download MP3v2:', error);
    return { status: false, msg: 'Erro ao processar o áudio: ' + error.message };
  }
}

/**
 * Download de vídeo v2 (ytdl.vreden.web.id)
 * @param {string} input - URL ou ID do vídeo
 * @param {number} formats - Qualidade do vídeo (360, 480, 720, 1080, 1440)
 * @returns {Promise<Object>} URL de download
 */
async function mp4v2(input, formats = 360) {
  try {
    const url = YouTubeURLManager.getVideoUrl(input);
    const videoId = YouTubeURLManager.getVideoId(url);
    const format = CONFIG.FORMATS.VIDEO.includes(Number(formats)) ? Number(formats) : 360;
    const cacheKey = `mp4v2:${url}:${format}`;
    const cached = cache.get('mp4v2', cacheKey);
    if (cached) return cached;

    if (!videoId) {
      return { status: false, msg: 'URL do YouTube inválida.' };
    }

    const metadata = await yts(url);
    if (!metadata.all?.length) {
      return { status: false, msg: 'Vídeo não encontrado.' };
    }

    const response = await downloadManager.downloadVreden(videoId, format, 'video');
    const result = {
      status: true,
      creator: 'Hiudy',
      metadata: metadata.all[0],
      download: response
    };

    cache.set('mp4v2', cacheKey, result);
    return result;
  } catch (error) {
    console.error('Erro no download MP4v2:', error);
    return { status: false, msg: 'Erro ao processar o vídeo: ' + error.message };
  }
}

module.exports = {
  search,
  mp3,
  mp4,
  mp3v2,
  mp4v2
};