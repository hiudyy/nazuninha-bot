const axios = require('axios');

async function consulta(dados, base, type) {
try {
if(type == 'placa') {
tar = await axios.get(`https://mdzapis.com/api/placanew?placa=${dados}&apikey=sonygozadinhas`);
return { resultado: `• *PLACA:* ${tar.data.resultado.placa}\n  • *CHASSI:* ${tar.data.resultado.chassi}\n  • *NÚM. MOTOR:* ${tar.data.resultado.numMotor}\n  • *RENAVAM:* ${tar.data.resultado.renavam}\n\n  • *SITUAÇÃO:* ${tar.data.resultado.situacao}\n\n  • *RESTRIÇÕES:*  \n  - ${tar.data.resultado.restricoes[0]}  \n  - ${tar.data.resultado.restricoes[1]}  \n  - ${tar.data.resultado.restricoes[2]}  \n  - ${tar.data.resultado.restricoes[3]}\n\n  • *MARCA/MODELO:* ${tar.data.resultado.marcaModelo}\n  • *COR:* ${tar.data.resultado.cor}\n  • *COMBUSTÍVEL:* ${tar.data.resultado.combustivel}\n\n  • *ESPÉCIE DO VEÍCULO:* ${tar.data.resultado.espécieVeiculo}\n  • *IMPORTADORA:* ${tar.data.resultado.identImportadora}\n  • *REGISTRO:* ${tar.data.resultado.registro}\n  • *UNIDADE LOCAL SRF:* ${tar.data.resultado.unidadeLocalSRF}\n\n  • *MULTAS:*  \n  - *Comentário:* ${tar.data.resultado.multas.comentario}  \n  - *Status:* ${tar.data.resultado.multas.status}  \n  - *Valor:* ${tar.data.resultado.multas.valor}\n\n  • *FATURADO:*  \n  - *Status:* ${tar.data.resultado.faturado.faturado}  \n  - *Pessoa:* ${tar.data.resultado.faturado.pessoa}\n\n👤 *PROPRIETÁRIO:*  \n  - *Nome:* ${tar.data.resultado.proprietario.nome}  \n  - *CPF:* ${tar.data.resultado.proprietario.cpf}\n\n📍 *ENDEREÇO:*  \n  - *Logradouro:* ${tar.data.resultado.enderecos.logradouro}  \n  - *Número:* ${tar.data.resultado.enderecos.numero}  \n  - *Bairro:* ${tar.data.resultado.enderecos.bairro}  \n  - *CEP:* ${tar.data.resultado.enderecos.cep}  \n  - *Município:* ${tar.data.resultado.enderecos.municipio}  \n  - *UF:* ${tar.data.resultado.enderecos.uf}\n\n📜 *DADOS COMPLETOS:*  \n  - *CNS:* ${dc.cns}  \n  - *Nome:* ${dc.nome}  \n  - *Nome Social:* ${dc.nome_social}  \n  - *Nome da Mãe:* ${dc.nome_mae}  \n  - *Nome do Pai:* ${dc.nome_pai}  \n  - *Sexo:* ${dc.sexo}  \n  - *Raça:* ${dc.raca}  \n  - *Nascimento:* ${dc.data_nascimento.data} (${dc.data_nascimento.idade})  \n  - *Nacionalidade:* ${dc.nacionalidade}  \n  - *Município de Nascimento:* ${dc.municipio_nascimento}\n\n🏠 *ENDEREÇO COMPLETO:*  \n  - *Tipo Logradouro:* ${endComp.tipo_logradouro}  \n  - *Logradouro:* ${endComp.logradouro}  \n  - *Complemento:* ${endComp.complemento}  \n  - *Número:* ${endComp.numero}  \n  - *Bairro:* ${endComp.bairro}  \n  - *CEP:* ${endComp.cep}  \n  - *Município de Residência:* ${endComp.municipio_residencia}  \n  - *País:* ${endComp.pais_residencia}\n\n📄 *DOCUMENTOS:*  \n  - *CPF:* ${tar.data.resultado.dados_completos.documentos.cpf}  \n  - *Identidade:* ${tar.data.resultado.dados_completos.documentos.identidade.numero}  \n  - *Órgão Emissor:* ${tar.data.resultado.dados_completos.documentos.identidade.orgao_emissor}  \n  - *Estado Emissor:* ${tar.data.resultado.dados_completos.documentos.identidade.estado_emissor}  \n  - *Data de Emissão:* ${tar.data.resultado.dados_completos.documentos.identidade.data_emissao}`};
} else {
tar = await axios.get(`https://scraper.mdzapis.com/consultar/mdz?type=${type}&data=${dados}&base=${base}&apikey=sonygozadinhas`);
return tar.data;
};
} catch(e) {
console.error(e);
console.log('tentando api 2');
if(type == 'cpf' && base == 'CREDILINK') {
tar = await axios.get(``);
}}};

module.exports = consulta;