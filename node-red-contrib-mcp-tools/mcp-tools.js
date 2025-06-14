module.exports = function(RED) {
    const http = require('http');
    const https = require('https');
    const url = require('url');

    function MCPAgentNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        
        // Configurações do nó
        node.serverUrl = config.serverUrl || 'http://localhost:3000';
        node.prompt = config.prompt || '';
        node.apiKey = config.apiKey || '';
        node.mcpServerCommand = config.mcpServerCommand || 'node';
        node.mcpServerArgs = config.mcpServerArgs || '../mcp-server/build/index.js';
        node.timeout = parseInt(config.timeout) || 30000;
        node.sessionId = config.sessionId || 'default';

        node.on('input', function(msg) {
            // Usar configurações do nó ou da mensagem
            const promptToUse = msg.prompt || node.prompt || msg.payload;
            const apiKeyToUse = msg.apiKey || node.apiKey;
            const serverCommandToUse = msg.mcpServerCommand || node.mcpServerCommand;
            const serverArgsToUse = msg.mcpServerArgs || node.mcpServerArgs;
            const sessionIdToUse = msg.sessionId || node.sessionId;
            
            if (!promptToUse) {
                node.error("Nenhum prompt fornecido", msg);
                return;
            }

            if (!apiKeyToUse) {
                node.error("API Key da OpenAI é obrigatória", msg);
                return;
            }

            // Preparar argumentos do servidor MCP
            let serverArgsArray;
            if (typeof serverArgsToUse === 'string') {
                serverArgsArray = serverArgsToUse.split(',').map(arg => arg.trim());
            } else if (Array.isArray(serverArgsToUse)) {
                serverArgsArray = serverArgsToUse;
            } else {
                serverArgsArray = ['../mcp-server/build/index.js'];
            }

            // Preparar dados para envio
            const postData = JSON.stringify({
                prompt: promptToUse,
                apiKey: apiKeyToUse,
                serverCommand: serverCommandToUse,
                serverArgs: serverArgsArray,
                sessionId: sessionIdToUse
            });

            // Configurar requisição HTTP
            const parsedUrl = url.parse(node.serverUrl + '/execute');
            const options = {
                hostname: parsedUrl.hostname,
                port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
                path: parsedUrl.path,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData)
                },
                timeout: node.timeout
            };

            // Escolher módulo HTTP apropriado
            const httpModule = parsedUrl.protocol === 'https:' ? https : http;

            // Atualizar status do nó
            node.status({fill: "blue", shape: "dot", text: "executando..."});

            // Fazer requisição
            const req = httpModule.request(options, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    try {
                        const response = JSON.parse(data);
                        
                        if (response.success) {
                            // Sucesso
                            node.status({fill: "green", shape: "dot", text: "sucesso"});
                            
                            msg.payload = response.response;
                            msg.mcpResult = {
                                success: true,
                                response: response.response,
                                toolsUsed: response.toolsUsed || [],
                                messages: response.messages || [],
                                originalPrompt: promptToUse,
                                serverCommand: serverCommandToUse,
                                serverArgs: serverArgsArray,
                                sessionId: sessionIdToUse
                            };
                            
                            node.send(msg);
                        } else {
                            // Erro na resposta
                            node.status({fill: "red", shape: "ring", text: "erro na resposta"});
                            node.error(`Erro do servidor MCP: ${response.error}`, msg);
                        }
                    } catch (parseError) {
                        node.status({fill: "red", shape: "ring", text: "erro de parsing"});
                        node.error(`Erro ao fazer parse da resposta: ${parseError.message}`, msg);
                    }
                });
            });

            req.on('error', (error) => {
                node.status({fill: "red", shape: "ring", text: "erro de conexão"});
                node.error(`Erro de conexão: ${error.message}`, msg);
            });

            req.on('timeout', () => {
                node.status({fill: "red", shape: "ring", text: "timeout"});
                node.error("Timeout na requisição", msg);
                req.destroy();
            });

            // Enviar dados
            req.write(postData);
            req.end();
        });

        // Limpar status quando o nó for fechado
        node.on('close', function() {
            node.status({});
        });
    }

    RED.nodes.registerType("mcp-tools", MCPAgentNode);
};

