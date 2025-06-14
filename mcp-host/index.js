import express from 'express';
import cors from 'cors';
import { MCPClient } from '../mcp-client/build/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Armazenar instâncias de clientes MCP por sessão
const mcpClients = new Map();

// Função para obter ou criar cliente MCP
function getMCPClient(sessionId, apiKey, serverCommand, serverArgs) {
  const clientKey = `${sessionId}_${apiKey}_${serverCommand}_${serverArgs.join('_')}`;
  
  if (!mcpClients.has(clientKey)) {
    const client = new MCPClient(apiKey);
    mcpClients.set(clientKey, {
      client,
      connected: false,
      serverCommand,
      serverArgs
    });
  }
  
  return mcpClients.get(clientKey);
}

// Endpoint principal para executar o agente
app.post('/execute', async (req, res) => {
  try {
    const { 
      prompt, 
      apiKey, 
      serverCommand = 'node', 
      serverArgs = ['../mcp-server-demo/build/index.js'],
      sessionId = 'default'
    } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt é obrigatório'
      });
    }

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        error: 'API Key da OpenAI é obrigatória'
      });
    }

    console.log(`Executando prompt: ${prompt}`);
    console.log(`Comando do servidor: ${serverCommand} ${serverArgs.join(' ')}`);

    // Obter cliente MCP
    const mcpClientInfo = getMCPClient(sessionId, apiKey, serverCommand, serverArgs);
    
    // Conectar se necessário
    if (!mcpClientInfo.connected) {
      try {
        await mcpClientInfo.client.connect(serverCommand, serverArgs);
        mcpClientInfo.connected = true;
      } catch (error) {
        console.error('Erro ao conectar ao servidor MCP:', error);
        return res.status(500).json({
          success: false,
          error: `Erro ao conectar ao servidor MCP: ${error.message}`
        });
      }
    }

    // Executar prompt
    const result = await mcpClientInfo.client.executePrompt(prompt);
    
    res.json(result);
  } catch (error) {
    console.error('Erro no endpoint /execute:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Endpoint para verificar status
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    activeClients: mcpClients.size
  });
});

// Endpoint para listar ferramentas disponíveis
app.get('/tools', async (req, res) => {
  try {
    const { 
      apiKey, 
      serverCommand = 'node', 
      serverArgs = ['../mcp-server-demo/build/index.js'],
      sessionId = 'tools'
    } = req.query;

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        error: 'API Key da OpenAI é obrigatória'
      });
    }

    // Obter cliente MCP
    const mcpClientInfo = getMCPClient(sessionId, apiKey, serverCommand, serverArgs.split(','));
    
    // Conectar se necessário
    if (!mcpClientInfo.connected) {
      await mcpClientInfo.client.connect(serverCommand, serverArgs.split(','));
      mcpClientInfo.connected = true;
    }

    const tools = await mcpClientInfo.client.listTools();

    res.json({
      success: true,
      tools: tools
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Endpoint para desconectar um cliente específico
app.post('/disconnect', async (req, res) => {
  try {
    const { sessionId = 'default' } = req.body;
    
    // Encontrar e desconectar clientes da sessão
    const clientsToDisconnect = [];
    for (const [key, clientInfo] of mcpClients.entries()) {
      if (key.startsWith(sessionId + '_')) {
        clientsToDisconnect.push(key);
      }
    }

    for (const key of clientsToDisconnect) {
      const clientInfo = mcpClients.get(key);
      if (clientInfo.connected) {
        await clientInfo.client.disconnect();
      }
      mcpClients.delete(key);
    }

    res.json({
      success: true,
      disconnectedClients: clientsToDisconnect.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Cleanup ao encerrar o processo
process.on('SIGINT', async () => {
  console.log('Encerrando servidor e desconectando clientes MCP...');
  
  for (const [key, clientInfo] of mcpClients.entries()) {
    if (clientInfo.connected) {
      try {
        await clientInfo.client.disconnect();
      } catch (error) {
        console.error(`Erro ao desconectar cliente ${key}:`, error);
      }
    }
  }
  
  process.exit(0);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`MCP Host rodando na porta ${PORT}`);
});

