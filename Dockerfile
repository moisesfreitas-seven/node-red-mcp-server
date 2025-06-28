# Etapa 1 - Imagem base com Node
FROM node:20-alpine

# Diretório de trabalho no container
WORKDIR /app

# Copiar tudo do projeto para o container
COPY mcp-client ./mcp-client
COPY mcp-host ./mcp-host
COPY mcp-server-demo ./mcp-server-demo

# Instalar e buildar o client
WORKDIR /app/mcp-client
RUN npm install && npm run build

# Instalar e buildar o server-demo
WORKDIR /app/mcp-server-demo
RUN npm install && npm run build

# Instalar e iniciar o host
WORKDIR /app/mcp-host
RUN npm install

# Porta que o host expõe (ajuste se for diferente)
EXPOSE 3000

# Comando para iniciar o host
CMD ["npm", "start"]
