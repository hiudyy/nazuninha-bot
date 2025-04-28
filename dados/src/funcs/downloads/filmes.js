// Sistema de Assistir filmes
// Sistema único, diferente de qualquer outro bot
// Criador: Hiudy
// Caso for usar deixe o caralho dos créditos 
// <3

const swiftly = require('swiftly');

async function search(query) {
    const keys = [
        "AIzaSyD51LedjJnOulDkA6u8nfmt17cnIlJ7igc",
        "AIzaSyDbQwjgQforqkA-cHt0omRNX4OQsJ3ocvg",
        "AIzaSyA9wPFHMwnkaBLpnLTP9d8lgEoHAsISQN0",
        "AIzaSyB1wjSU3NfUmc32bus34j9BmSDBKTKaEYg",
        "AIzaSyBm0L9hwLyZ9jhV3HGVcNKQ6znG7_zbSoU",
        "AIzaSyAm_B1DHAK_kCVWHPACK1XAe8sVry1Fj0U"
    ];

    for (let key of keys) {
        try {
            const response = await swiftly.get('https://www.googleapis.com/customsearch/v1', {
                params: {
                    q: query,
                    key: key,
                    cx: '32a7e8cb9ffc24cd5'
                }
            });

            if (response.items) {
                return response.items.map(item => ({
                    title: item.title,
                    link: item.link
                }));
            }
        } catch (error) {
            console.error(`Erro com a chave ${key}:`, error.message);
        }
    }
    return [];
}

async function Filmes(texto) {
    const results = await search(texto);
    if (results.length === 0) {
        console.log('Nenhum resultado encontrado.');
        return null;
    }

    for (const result of results) {
        if (result.link.includes('/video/')) {
            try {
                const videoData = await swiftly.scrape(result.link, {
                    videoUrl: '#tokyvideo_player@src',
                    img: '#tokyvideo_player@poster',
                    name: '#tokyvideo_player@data-title'
                });

                if (videoData.videoUrl[0] && videoData.img[0] && videoData.name[0]) {
                    return {
                        img: videoData.img[0],
                        name: videoData.name[0],
                        url: videoData.videoUrl[0]
                    };
                }
            } catch (error) {
                console.error(`Erro ao buscar vídeo:`, error.message);
            }
        }
    }

    console.log('Nenhum vídeo encontrado.');
    return null;
}

module.exports = Filmes;