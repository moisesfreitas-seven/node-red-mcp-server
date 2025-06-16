# Node-RED MCP Server 

Connects Node-RED to LLMs via the Model Context Protocol (MCP) for intelligent AI workflows.

[Português-Brasil]

[Imagem do projeto inicial]

Este projeto contém uma estrutura Docker com dois containers principais que integram o Node-RED e o mcp-host para rodar o MCP Server (Model Context Protocol). O objetivo é permitir que fluxos no Node-RED possam interagir com modelos LLM como o GPT-4 da OpenAI, usando um servidor MCP.

Essa primeira versão suporta somente o modelo GTP-4 da OpenAI.

Você consegue rodar um mcp-local e remoto.
Exemlo de um MCP remoto:

npx
-y, @smithery/cli@latest, run, @nickclyde/duckduckgo-mcp-server, --key, sua-chave-do-smithery

[Link: Encontre outros mcp cno smithery.io ]

## ▶️ Como executar

Passos para rodar o projeto via docker compose:

1. Clone este repositório:
   ```bash
   git clone https://github.com/moises-paschoalick/node-red-mcp-server
   cd node-red-docker
   docker compose up -d
   ```

2. Abrir o projeto em: http://localhost:1899/

3. Instalar o node mcp-tools 
Para isso preciamos ter o node mcp-tools, instalar o node-red-contribu-mcp-tools na UI do node-red.

Opções -> Gerenciar Paleta
Instalar node-red-contrib-mcp-tools
[Imagem instalação]


[link do node-red-contrib-mcp-tools]
link do projeto npm

4. Configurar o componente com a chave da OpenAI
[imagem do componente]


## 🧱 Estrutura dos Containers

- **`mcp-host`**  
  Componente feito em Node.js que faz a ponte (bridge) entre o Node-RED (via componente `mcp-tools`) e os MCP Servers.  
  Ele é responsável por intermediar a comunicação entre o `mcp-client` (modeloLLM) e o `mcp-server` (entende a implementação das tools).

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

### Componentes

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


## Instalação e Configuração rodar sem docker

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