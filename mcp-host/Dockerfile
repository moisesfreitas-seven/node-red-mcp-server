FROM node:20-alpine

WORKDIR /app

# Copia todos os projetos
COPY mcp-client ./mcp-client
COPY mcp-server-demo ./mcp-server-demo
COPY mcp-host ./mcp-host

# Build do client
WORKDIR /app/mcp-client
RUN npm install && npm run build

# Build do server demo
WORKDIR /app/mcp-server-demo
RUN npm install && npm run build

# Instalação do host
WORKDIR /app/mcp-host
RUN npm install

# Garante que o index.js será encontrado
RUN test -f ./index.js || (echo "❌ index.js não encontrado em mcp-host" && exit 1)
RUN test -f ../mcp-client/build/index.js || (echo "❌ SDK MCPClient não buildado" && exit 1)

EXPOSE 3000

CMD ["npm", "start"]