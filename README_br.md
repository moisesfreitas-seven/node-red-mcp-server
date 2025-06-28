# Node-RED MCP Server 

Conecta Node-RED a LLMs via Model Context Protocol (MCP) para fluxos de IA inteligentes.

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.com/deploy/node-red-mcp)

> **🚀 Template pronto para deploy no Railway** - Node-RED configurado com MCP (Model Context Protocol) para integração com LLMs

[🇺🇸 Read in English](README.md)

## 📋 Descrição do Projeto

Este projeto contém uma estrutura Docker com dois containers principais que integram o Node-RED e o mcp-host para rodar o MCP Server (Model Context Protocol). O objetivo é permitir que fluxos no Node-RED possam interagir com modelos LLM como o GPT-4 da OpenAI, usando um servidor MCP.

Essa primeira versão suporta somente o modelo GPT-4 da OpenAI.

Você consegue rodar um MCP local e remoto.
Exemplo de um MCP remoto:

```bash
npx -y @smithery/cli@latest run @nickclyde/duckduckgo-mcp-server --key sua-chave-do-smithery
```

[🔗 Encontre outros MCPs no smithery.io](https://smithery.io)

## 🚀 Templates Prontos para Deploy

### Node-RED MCP Template para Railway

Para facilitar o deploy e começar rapidamente, criamos um template otimizado para o Railway:

**[📋 Ver Template Completo](node-red-docker/README.md)**

**Características do Template:**
- ✅ **Deploy com um clique** no Railway
- ✅ **Node-RED 4.0.0** pré-configurado
- ✅ **MCP Tools Node** já instalado
- ✅ **Configuração automática** via variáveis de ambiente
- ✅ **Backup automático** de fluxos e configurações
- ✅ **Monitoramento** integrado

**Como usar:**
1. Acesse o [README do Template](node-red-docker/README.md)
2. Clique no botão "Deploy on Railway"
3. Configure suas variáveis de ambiente
4. Pronto! Node-RED rodando na nuvem

---

## ▶️ Como Executar

### Passos para rodar o projeto via Docker Compose:

1. **Clone este repositório:**
   ```bash
   git clone https://github.com/moises-paschoalick/node-red-mcp-server
   cd node-red-docker
   docker compose up -d
   ```

2. **Abra o projeto em:** http://localhost:1899/

3. **Instale o node mcp-tools**
   Para isso precisamos ter o node mcp-tools, instalar o node-red-contrib-mcp-tools na UI do Node-RED.

   **Opções -> Gerenciar Paleta**
   **Instalar node-red-contrib-mcp-tools**
   [Imagem instalação]

   [link do node-red-contrib-mcp-tools]
   link do projeto npm

4. **Configure o componente com a chave da OpenAI**
   [imagem do componente]

## 🧱 Estrutura dos Containers

- **`mcp-host`**  
  Componente feito em Node.js que faz a ponte (bridge) entre o Node-RED (via componente `mcp-tools`) e os MCP Servers.  
  Ele é responsável por intermediar a comunicação entre o `mcp-client` (modelo LLM) e o `mcp-server` (entende a implementação das tools).

- **`mcp-server-demo`** (Node-RED)  
  Contém o ambiente do Node-RED já configurado para se comunicar com o `mcp-host` usando o componente `mcp-tools`. É um exemplo de um mcp-server feito em NodeJS para testar e verificar se o ambiente está funcional.

> **Importante**: no componente **mcp-tools** dentro do Node-RED, é necessário configurar a URL do MCP Host como:
> ```
> http://mcp-host:3000
> ```

---

## 📦 Componentes

- **`mcp-host`**
  - Recebe chamadas do Node-RED via `mcp-tools`
  - Redireciona a solicitação para o `mcp-client`
  - Encaminha o resultado para o `mcp-server` (local ou remoto)
  
- **`mcp-client`**
  - Realiza a comunicação com um modelo de linguagem (LLM)
  - Atualmente usa o modelo `gpt-4o` da OpenAI
  - Pode ser modificado para usar outros modelos no futuro (ex: Claude, Gemini, LLaMA)

- **`mcp-server-demo`**
  - Um exemplo funcional de MCP Server rodando localmente
  - Contém "tools" (ferramentas) que podem ser chamadas pelo modelo, como:
    - **Hello Tool**: responde com "Hello World"
    - **Local Time**: retorna a hora local do servidor
    - **Weather Tool**: consulta clima atual de São Paulo via `wttr.in`

---

### Pré-requisitos

- Docker
- Docker Compose

### Endpoints para verificar a integridade no mcp-host 
http://localhost:3000/health

## Arquitetura

```
Node-RED Component → mcp-host (Express.js) → mcp-client → mcp-server
                                                ↓
                                           OpenAI API
```

### Componentes Detalhados

#### 1. **mcp-host** (Servidor Web)
- **Localização:** `/mcp-host/`
- **Função:** Servidor Express.js que orquestra as comunicações
- **Porta:** 3000 (configurável)
- **Endpoints:**
  - `POST /execute` - Executa prompts
  - `GET /health` - Status do servidor
  - `GET /tools` - Lista ferramentas disponíveis
  - `POST /disconnect` - Desconecta sessões

#### 2. **mcp-client** (Cliente MCP)
- **Localização:** `/mcp-client/`
- **Função:** Classe que gerencia conexões com servidores MCP e OpenAI
- **Recursos:**
  - Conexão/desconexão automática
  - Gerenciamento de sessões
  - Conversão de ferramentas MCP para formato OpenAI
  - Execução de prompts com tool calling

#### 3. **mcp-server** (Servidor MCP)
- **Localização:** `/mcp-server/`
- **Função:** Implementação do servidor MCP com ferramentas e recursos
- **Ferramentas incluídas:**
  - Hello Tool (exemplo)
  - Users Tool (API externa)
  - Textract Tool (análise de imagens)

#### 4. **node-red-mcp-component** (Componente Node-RED)
- **Localização:** `/node-red-mcp-component/`
- **Função:** Nó customizável para Node-RED
- **Configurações:**
  - URL do MCP Host
  - API Key da OpenAI
  - Comando do servidor MCP
  - Argumentos do servidor MCP
  - Session ID
  - Timeout

## Endpoints da API

### POST /execute

Executa um prompt através do agente MCP.

**Corpo da Requisição:**
```json
{
  "prompt": "show hello world message",
  "apiKey": "sk-sua-chave-aqui",
  "serverCommand": "node",
  "serverArgs": ["../mcp-server/build/index.js"],
  "sessionId": "default"
}
```

**Resposta:**
```json
{
  "success": true,
  "response": "Hello, World! This is a tool response!",
  "toolsUsed": [...],
  "messages": [...]
}
```

### GET /health

Verifica o status do servidor.

**Resposta:**
```json
{
  "status": "ok",
  "timestamp": "2025-06-11T23:32:04.612Z",
  "activeClients": 0
}
```

### GET /tools

Lista ferramentas disponíveis.

**Parâmetros de Query:**
- `apiKey` - API Key da OpenAI
- `serverCommand` - Comando do servidor MCP
- `serverArgs` - Argumentos do servidor MCP

## Instalação e Configuração (sem Docker)

### 1. Preparar os Componentes

```bash
# Instalar dependências do mcp-server
cd mcp-server
npm install
npm run build

# Instalar dependências do mcp-client
cd ../mcp-client
npm install
npm run build

# Instalar dependências do mcp-host
cd ../mcp-host
npm install
```

### 2. Iniciar o MCP Host

```bash
cd mcp-host
npm start
```

O servidor rodará na porta 3000.

## 🐛 Solução de Problemas

### Problemas Comuns

#### 1. Container não inicia
```bash
# Verifique os logs
docker logs node-red-mcp

# Verifique se as portas estão disponíveis
netstat -tulpn | grep :1899
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

# Logs do MCP Host
docker logs -f mcp-host

# Acesse os logs via interface web
# http://localhost:1899/admin/logs
```

## 🔧 Configuração Avançada

### Variáveis de Ambiente

| Variável | Descrição | Padrão | Obrigatório |
|----------|-----------|--------|-------------|
| `ADMIN_PASSWORD` | Senha do admin do Node-RED | `admin123` | ✅ |
| `NODE_RED_ENABLE_PROJECTS` | Habilitar projetos | `false` | ❌ |
| `OPENAI_API_KEY` | Chave da API OpenAI | - | ❌ |

### Portas

- **1899**: Interface web do Node-RED
- **3000**: MCP Host API

### Volumes

- `/data`: Dados persistentes do Node-RED
  - Fluxos e configurações
  - Node modules customizados
  - Logs e backups

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
          "payload": "Olá, como você pode me ajudar?"
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
          "prompt": "Analise estes dados meteorológicos: {{JSON.stringify(payload)}}"
        }
      }
    ]
  }
]
```

## 🔗 Integrações

### MCP Servers Suportados

- **Local MCP Server**: Incluído no projeto
- **Remote MCP Servers**: Via Smithery.io
- **Custom MCP Servers**: Sua própria implementação

### LLMs Suportados

- **OpenAI GPT-4**: Configuração padrão
- **OpenAI GPT-3.5**: Suportado
- **Claude**: Via configuração customizada
- **Outros**: Via adaptadores MCP

## 📈 Monitoramento

### Métricas Disponíveis

- **CPU Usage**: Via Docker stats
- **Memory Usage**: Via Docker stats
- **Network Traffic**: Via Docker stats
- **Application Logs**: Via Docker logs

### Alertas

Configure alertas para:
- Uso de CPU > 80%
- Uso de memória > 80%
- Erros de aplicação
- Tempo de resposta > 5s

## 🔄 Backup e Restore

### Backup Automático

Para backup manual:

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
2. **Crie uma branch** para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. **Commit** suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. **Push** para a branch (`git push origin feature/NovaFuncionalidade`)
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

**⭐ Se este projeto foi útil, considere dar uma estrela no repositório!** 