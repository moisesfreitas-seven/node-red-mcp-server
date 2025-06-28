#!/bin/bash

# Node-RED MCP Server - Deploy Script
# Este script automatiza o deploy no Railway

set -e

echo "🚀 Node-RED MCP Server - Deploy Script"
echo "======================================"

# Verificar se o Railway CLI está instalado
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI não encontrado!"
    echo "📦 Instalando Railway CLI..."
    npm install -g @railway/cli
fi

# Verificar se está logado no Railway
if ! railway whoami &> /dev/null; then
    echo "🔐 Fazendo login no Railway..."
    railway login
fi

# Verificar se existe um projeto Railway
if [ ! -f "railway.json" ]; then
    echo "📁 Inicializando projeto Railway..."
    railway init
fi

# Verificar se existe arquivo .env
if [ ! -f ".env" ]; then
    echo "⚙️ Criando arquivo .env..."
    cp .env.example .env
    echo "📝 Por favor, edite o arquivo .env com suas configurações"
    echo "   - ADMIN_PASSWORD: Senha do admin do Node-RED"
    echo "   - OPENAI_API_KEY: Sua chave da API OpenAI (opcional)"
    read -p "Pressione Enter após configurar o .env..."
fi

# Deploy no Railway
echo "🚀 Fazendo deploy no Railway..."
railway up

# Obter URL do projeto
echo "🔗 Obtendo URL do projeto..."
PROJECT_URL=$(railway status --json | jq -r '.url' 2>/dev/null || echo "Verifique manualmente no dashboard do Railway")

echo ""
echo "✅ Deploy concluído!"
echo "🌐 URL do projeto: $PROJECT_URL"
echo ""
echo "📋 Próximos passos:"
echo "1. Acesse a URL acima"
echo "2. Faça login com:"
echo "   - Usuário: admin"
echo "   - Senha: valor da variável ADMIN_PASSWORD"
echo "3. Configure o MCP Tools node"
echo "4. Comece a criar seus fluxos!"
echo ""
echo "📚 Para mais informações, consulte:"
echo "   - README do template: node-red-docker/README.md"
echo "   - Documentação do Railway: https://docs.railway.app" 