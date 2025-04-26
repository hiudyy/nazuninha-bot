#!/bin/bash

# Nazuna Configurador
# Criado por Hiudy
# Mantenha os créditos, por favor! <3

# Configurações iniciais
set -e
CONFIG_FILE="./dados/src/config.json"
VERSION=$(jq -r .version package.json 2>/dev/null || echo "Desconhecida")

# Funções utilitárias
print_message() {
    printf "\033[1;32m%s\033[0m\n" "$1"
}

print_warning() {
    printf "\033[1;31m%s\033[0m\n" "$1"
}

print_separator() {
    printf "\033[1;34m============================================\033[0m\n"
}

validate_input() {
    local input=$1
    local field=$2
    case $field in
        prefixo)
            [[ ${#input} -eq 1 ]] || return 1
            ;;
        numero)
            [[ $input =~ ^[0-9]{10,15}$ ]] || return 1
            ;;
    esac
    return 0
}

# Função para ler entrada com valor padrão
read_input() {
    local prompt=$1
    local default=$2
    local var_name=$3
    local validate=$4

    while true; do
        printf "%s (Atual: %s): " "$prompt" "${default:-Não definido}"
        printf " "
        read -r input
        input=${input:-$default}

        if [ -n "$validate" ]; then
            if validate_input "$input" "$validate"; then
                break
            else
                print_warning "Entrada inválida para $validate!"
                continue
            fi
        fi
        break
    done

    eval "$var_name='$input'"
}

# Função para confirmar sim/não
confirm() {
    local prompt=$1
    local default=$2
    local response

    printf "%s (S/n): " "$prompt"
    printf " "
    read -r response
    response=$(echo "${response:-$default}" | tr '[:upper:]' '[:lower:]')
    [[ -z "$response" || "$response" = "s" ]]
}

# Instalação de dependências
install_dependencies() {
    print_separator
    print_message "📦 Instalando dependências..."
    npm install --no-bin-links --force
    print_message "✔ Instalação concluída! Rode 'npm start' para iniciar o bot."
}

# Verifica opção --install
if [ "$1" = "--install" ]; then
    install_dependencies
    exit 0
fi

# Carrega configuração existente
declare -A config=(
    [nomedono]=""
    [numerodono]=""
    [nomebot]=""
    [prefixo]=""
    [aviso]="false"
    [debug]="false"
    [enablePanel]="false"
)

if [ -f "$CONFIG_FILE" ]; then
    for key in "nomedono" "numerodono" "nomebot" "prefixo"; do
        config[$key]=$(jq -r ".$key" "$CONFIG_FILE" 2>/dev/null || echo "${config[$key]}")
    done
fi

# Cabeçalho
print_separator
print_message "🔧 Configurador da Nazuna - v$VERSION"
print_message "🚀 Criado por Hiudy"
print_separator
echo

# Termos de uso
print_warning "⚠ TERMOS DE USO:"
cat << EOF
1. Não remova os créditos do criador
2. Não venda este projeto
3. Use de forma ética e responsável
EOF
echo

if ! confirm "Você concorda com os termos?" "n"; then
    print_warning "❌ Instalação cancelada. É necessário aceitar os termos."
    exit 1
fi

print_message "✔ Termos aceitos!"
echo

# Coleta de configurações
read_input "👤 Qual seu nome?" "${config[nomedono]}" "config[nomedono]"
read_input "📞 Qual seu número (somente dígitos, 10-15)?" "${config[numerodono]}" "config[numerodono]" "numero"
read_input "🤖 Qual o nome do bot?" "${config[nomebot]}" "config[nomebot]"
read_input "⚙️ Qual o prefixo (1 caractere)?" "${config[prefixo]}" "config[prefixo]" "prefixo"

# Salva configuração
mkdir -p "$(dirname "$CONFIG_FILE")"
cat > "$CONFIG_FILE" << EOF
{
  "nomedono": "${config[nomedono]}",
  "numerodono": "${config[numerodono]}",
  "nomebot": "${config[nomebot]}",
  "prefixo": "${config[prefixo]}",
  "aviso": ${config[aviso]},
  "debug": ${config[debug]},
  "enablePanel": ${config[enablePanel]}
}
EOF

# Finalização
print_separator
print_message "🎉 Configuração concluída com sucesso!"
print_separator

if confirm "📦 Instalar dependências agora?" "s"; then
    install_dependencies
else
    print_message "⚡ Para instalar depois, use: npm run config:install"
fi

print_separator
print_message "🚀 Nazuna pronta para uso! - v$VERSION"
print_separator