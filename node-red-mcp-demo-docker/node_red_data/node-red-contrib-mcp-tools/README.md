# Node-RED MCP tools Component

Este é um componente para Node-RED que permite executar MCP Servers (Model Context Protocol).

## Instalação

### Opção 1: Instalação Local no Node-RED

1. Copie os arquivos `mcp-tools.js` e `mcp-tools.html` para o diretório de nós do seu Node-RED
2. Reinicie o Node-RED
3. O componente "MCP tools" aparecerá na categoria "IA"

### Opção 2: Instalação via npm (quando publicado)

```bash
npm install node-red-contrib-mcp-tools
```

## Configuração

### 1. Primeiro passo: Executar o MCP Host

Antes de iniciar, você precisa ter o **MCP Host** em execução. Utilize o código disponível na pasta [`mcp-host`](https://github.com/moisesfreitas-seven/node-red-mcp-server/tree/main/mcp-host).

O **MCP Host** é uma aplicação Node.js responsável por intermediar a comunicação entre o **MCP Client** e o **MCP Server**.

Você pode executá-lo de diferentes formas:

- 💻 **Localmente** na sua máquina;
- 🐳 **Em um contêiner Docker**, com suporte a **Java**, **Python** ou **Node.js**, dependendo do ambiente necessário para o seu modelo MCP;
- 🌐 **Remotamente**, conectando-se a um MCP Host já disponível em outro servidor.

```bash
cd mcp-host
npm install
npm start
```

O servidor rodará por padrão na porta 3000.

### 2. Configuração do Componente

- **URL do Servidor**: URL onde o serviço MCP está rodando (ex: http://localhost:3000) ou http://host.docker.internal:3000 casp esteja rodando com docker
- **Prompt Padrão**: Prompt opcional que será usado se não for fornecido na mensagem
- **Timeout**: Tempo limite para a requisição em milissegundos (padrão: 30000)

## Uso

### Entradas

- `msg.payload` (string): O prompt a ser enviado para o tools MCP
- `msg.prompt` (string): Prompt específico (sobrescreve o prompt padrão)

### Saídas

- `msg.payload` (string): A resposta do tools MCP
- `msg.mcpResult` (object): Objeto detalhado contendo:
  - `success`: Se a execução foi bem-sucedida
  - `response`: A resposta do toolse
  - `toolsUsed`: Array das ferramentas utilizadas
  - `messages`: Histórico completo da conversa
  - `originalPrompt`: O prompt original enviado

## Exemplo de Fluxo

```json
[
    {
        "id": "inject1",
        "type": "inject",
        "name": "Teste MCP",
        "props": [
            {
                "p": "payload",
                "v": "exiba informações do usuário",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "x": 100,
        "y": 100,
        "wires": [["mcp1"]]
    },
    {
        "id": "mcp1",
        "type": "mcp-tools",
        "name": "toolse MCP",
        "serverUrl": "http://localhost:3000",
        "prompt": "",
        "timeout": 30000,
        "x": 300,
        "y": 100,
        "wires": [["debug1"]]
    },
    {
        "id": "debug1",
        "type": "debug",
        "name": "Resultado",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "true",
        "targetType": "full",
        "x": 500,
        "y": 100,
        "wires": []
    }
]
```

## Funcionalidades

- ✅ Execução de prompts via componente MCP tools
- ✅ Configuração flexível de servidor
- ✅ Timeout configurável
- ✅ Status visual do nó (executando, sucesso, erro)
- ✅ Tratamento de erros robusto
- ✅ Suporte a prompts dinâmicos via mensagem
- ✅ Retorno detalhado com ferramentas utilizadas

## Troubleshooting

### Erro de Conexão
- Verifique se o servidor MCP está rodando
- Confirme a URL do servidor na configuração
- Verifique se não há firewall bloqueando a conexão

### Timeout
- Aumente o valor de timeout se as operações demoram mais
- Verifique a performance do servidor MCP

### Erro de Parsing
- Verifique se o servidor está retornando JSON válido
- Confirme se o servidor MCP está funcionando corretamente

## Licença

MIT

