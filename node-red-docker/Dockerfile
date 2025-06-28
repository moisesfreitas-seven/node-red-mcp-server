# Dockerfile optimized for Railway deployment with production-ready configuration

FROM nodered/node-red:4.0.0

# Switch to root for installation
USER root

# Copia os dados do projeto (com package.json) para /data
COPY node_red_data /data

# Fix permissions before npm install
RUN chown -R node-red:node-red /data

# Instala as dependências do package.json que está em /data
RUN cd /data && npm install --no-cache --unsafe-perm --no-update-notifier --no-fund --only=production

# Fix permissions again after npm install
RUN chown -R node-red:node-red /data

# Switch back to node-red user
USER node-red

# Expose port for Railway
EXPOSE 1880

# Start Node-RED with the correct command
CMD ["npm", "start", "--", "--userDir", "/data"]