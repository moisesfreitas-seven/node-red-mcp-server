## Dockerfile optimized for Railway deployment with production-ready configuration
FROM node:20-alpine

WORKDIR /app

COPY mcp-client ./mcp-client
COPY mcp-host ./mcp-host
COPY mcp-server-demo ./mcp-server-demo

WORKDIR /app/mcp-client
RUN npm install && npm run build

WORKDIR /app/mcp-server-demo
RUN npm install && npm run build

WORKDIR /app/mcp-host
RUN npm install

EXPOSE 3000

CMD ["npm", "start"]