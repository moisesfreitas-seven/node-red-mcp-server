# Node-RED MCP Server Template

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/new?template=https://github.com/moises-paschoalick/node-red-mcp-server/tree/main/node-red-docker)

> **🚀 Template pronto para deploy no Railway** - Node-RED configurado com MCP (Model Context Protocol) para integração com LLMs

## 📋 Descrição do Projeto

Este template fornece um ambiente Node-RED completo e pré-configurado com suporte ao **Model Context Protocol (MCP)**, permitindo que seus fluxos interajam diretamente com modelos de linguagem como GPT-4 da OpenAI.

### 🎯 O que este template resolve

- **Integração LLM**: Conecta Node-RED a modelos de IA via MCP
- **Deploy Simplificado**: Um clique para ter Node-RED rodando na nuvem
- **Configuração Automática**: Tudo pré-configurado e pronto para uso
- **Escalabilidade**: Roda na infraestrutura do Railway com alta disponibilidade

## ⚡ Funcionalidades Principais

- ✅ **Node-RED 4.0.0** com interface web completa
- ✅ **MCP Tools Node** pré-instalado e configurado
- ✅ **Suporte a OpenAI** integrado
- ✅ **Deploy automático** no Railway
- ✅ **Configuração via variáveis de ambiente**
- ✅ **Logs centralizados** e monitoramento
- ✅ **Backup automático** de fluxos e configurações

## 🛠️ Pré-requisitos

- Conta no [Railway](https://railway.app) (gratuita)
- Chave da API da OpenAI (opcional, para funcionalidades LLM)
- Navegador web moderno

## 🚀 Como Usar

### Deploy Automático (Recomendado)

1. **Clique no botão "Deploy on Railway"** acima
2. **Conecte sua conta GitHub** (se necessário)
3. **Configure as variáveis de ambiente** (veja seção Configurações)
4. **Aguarde o deploy** (2-3 minutos)
5. **Acesse sua instância** via URL fornecida pelo Railway

### Deploy Manual

```bash
# Clone o repositório
git clone https://github.com/moises-paschoalick/node-red-mcp-server
cd node-red-docker

# Deploy no Railway via CLI
railway login
railway init
railway up
```

## ⚙️ Configurações

### Variáveis de Ambiente

| Variável | Descrição | Padrão | Obrigatório |
|----------|-----------|--------|-------------|
| `ADMIN_PASSWORD` | Senha do admin do Node-RED | `admin123` | ✅ |
| `NODE_RED_ENABLE_PROJECTS` | Habilitar projetos | `false` | ❌ |
| `NODE_RED_ENABLE_EDITOR_THEME` | Tema do editor | `default` | ❌ |
| `OPENAI_API_KEY` | Chave da API OpenAI | - | ❌ |

### Portas

- **1880**: Interface web do Node-RED
- **1881**: API REST do Node-RED (se habilitada)

### Volumes

- `/data`: Dados persistentes do Node-RED
  - Fluxos e configurações
  - Node modules customizados
  - Logs e backups

## 🏃‍♂️ Como Rodar Localmente

### Com Docker Compose

```bash
# Clone o repositório
git clone https://github.com/moises-paschoalick/node-red-mcp-server
cd node-red-docker

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Execute
docker-compose up -d

# Acesse em http://localhost:1880
```

### Com Docker

```bash
# Build da imagem
docker build -t node-red-mcp .

# Execute o container
docker run -d \
  --name node-red-mcp \
  -p 1880:1880 \
  -e ADMIN_PASSWORD=sua-senha \
  node-red-mcp
```

## 📸 Screenshots

### Interface Principal do Node-RED
![Node-RED Interface](https://via.placeholder.com/800x400/4CAF50/FFFFFF?text=Node-RED+Interface)

### MCP Tools Node Configurado
![MCP Tools Configuration](https://via.placeholder.com/600x300/2196F3/FFFFFF?text=MCP+Tools+Configuration)

### Exemplo de Fluxo com LLM
![Flow Example](https://via.placeholder.com/800x400/FF9800/FFFFFF?text=Flow+with+LLM+Integration)

## 🔧 Configuração Inicial

### 1. Primeiro Acesso

1. Acesse a URL fornecida pelo Railway
2. Faça login com:
   - **Usuário**: `admin`
   - **Senha**: Valor da variável `ADMIN_PASSWORD`

### 2. Configurar MCP Tools

1. **Arraste o nó "MCP Tools"** para o canvas
2. **Configure as propriedades**:
   - **MCP Host URL**: `http://localhost:3000` (para local) ou URL do seu MCP Host
   - **OpenAI API Key**: Sua chave da OpenAI
   - **Server Command**: Comando do servidor MCP
   - **Server Args**: Argumentos do servidor

### 3. Testar Integração

1. **Crie um fluxo simples** com:
   - Trigger (inject)
   - MCP Tools node
   - Debug node
2. **Configure o prompt** no MCP Tools
3. **Deploy e teste**

## 📚 Exemplos de Uso

### Exemplo 1: Chatbot Simples

```javascript
// Fluxo básico de chatbot
[
  {
    "id": "chatbot-flow",
    "type": "tab",
    "label": "Chatbot Example",
    "nodes": [
      {
        "id": "trigger",
        "type": "inject",
        "name": "Start Chat",
        "props": {
          "payload": "Hello, how can you help me?"
        }
      },
      {
        "id": "mcp-tools",
        "type": "mcp-tools",
        "name": "AI Response",
        "config": {
          "prompt": "{{payload}}",
          "apiKey": "{{env.OPENAI_API_KEY}}"
        }
      },
      {
        "id": "debug",
        "type": "debug",
        "name": "Show Response"
      }
    ]
  }
]
```

### Exemplo 2: Análise de Dados

```javascript
// Fluxo para análise de dados com LLM
[
  {
    "id": "data-analysis",
    "type": "tab",
    "label": "Data Analysis",
    "nodes": [
      {
        "id": "data-input",
        "type": "inject",
        "name": "Input Data",
        "props": {
          "payload": {
            "temperature": 25,
            "humidity": 60,
            "pressure": 1013
          }
        }
      },
      {
        "id": "analysis",
        "type": "mcp-tools",
        "name": "Analyze Data",
        "config": {
          "prompt": "Analyze this weather data: {{JSON.stringify(payload)}}"
        }
      }
    ]
  }
]
```

## 🔗 Integrações

### MCP Servers Suportados

- **Local MCP Server**: Incluído no template
- **Remote MCP Servers**: Via Smithery.io
- **Custom MCP Servers**: Sua própria implementação

### LLMs Suportados

- **OpenAI GPT-4**: Configuração padrão
- **OpenAI GPT-3.5**: Suportado
- **Claude**: Via configuração customizada
- **Outros**: Via adaptadores MCP

## 🐛 Troubleshooting

### Problemas Comuns

#### 1. Node-RED não inicia
```bash
# Verifique os logs
docker logs node-red-mcp

# Verifique as permissões
docker exec -it node-red-mcp ls -la /data
```

#### 2. MCP Tools não funciona
- Verifique se a API Key da OpenAI está correta
- Confirme se o MCP Host está acessível
- Verifique os logs do MCP Host

#### 3. Erro de permissões
```bash
# Corrija as permissões
docker exec -it node-red-mcp chown -R node-red:node-red /data
```

### Logs e Debug

```bash
# Logs do Node-RED
docker logs -f node-red-mcp

# Logs do MCP Host (se aplicável)
docker logs -f mcp-host

# Acesse os logs via interface web
# http://localhost:1880/admin/logs
```

## 📈 Monitoramento

### Métricas Disponíveis

- **CPU Usage**: Via Railway Dashboard
- **Memory Usage**: Via Railway Dashboard
- **Network Traffic**: Via Railway Dashboard
- **Application Logs**: Via Railway Logs

### Alertas

Configure alertas no Railway para:
- Uso de CPU > 80%
- Uso de memória > 80%
- Erros de aplicação
- Tempo de resposta > 5s

## 🔄 Backup e Restore

### Backup Automático

O Railway faz backup automático dos volumes. Para backup manual:

```bash
# Backup dos dados
docker exec node-red-mcp tar -czf /tmp/backup.tar.gz /data

# Download do backup
docker cp node-red-mcp:/tmp/backup.tar.gz ./backup.tar.gz
```

### Restore

```bash
# Upload do backup
docker cp ./backup.tar.gz node-red-mcp:/tmp/

# Restore dos dados
docker exec node-red-mcp tar -xzf /tmp/backup.tar.gz -C /
```

## 🤝 Contribuição

1. **Fork** o projeto
2. **Crie uma branch** para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra um Pull Request**

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

### Canais de Ajuda

- **📧 Email**: [seu-email@exemplo.com](mailto:seu-email@exemplo.com)
- **🐛 Issues**: [GitHub Issues](https://github.com/moises-paschoalick/node-red-mcp-server/issues)
- **💬 Discord**: [Link do Discord](https://discord.gg/seu-servidor)
- **📖 Wiki**: [Documentação Wiki](https://github.com/moises-paschoalick/node-red-mcp-server/wiki)

### Recursos Úteis

- [Node-RED Documentation](https://nodered.org/docs/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Railway Documentation](https://docs.railway.app/)
- [OpenAI API Documentation](https://platform.openai.com/docs/)

## 🙏 Agradecimentos

- [Node-RED](https://nodered.org/) - Plataforma de programação visual
- [Railway](https://railway.app/) - Plataforma de deploy
- [OpenAI](https://openai.com/) - Modelos de linguagem
- [MCP Community](https://modelcontextprotocol.io/) - Protocolo MCP

---

**⭐ Se este template foi útil, considere dar uma estrela no repositório!**