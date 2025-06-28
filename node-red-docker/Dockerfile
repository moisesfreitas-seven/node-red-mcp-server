# Dockerfile optimized for Railway deployment with production-ready configuration

FROM nodered/node-red:4.0.0

# Copy package.json to the WORKDIR so npm builds all
# of your added nodes modules for Node-RED

COPY node_red_data/package.json /data/
WORKDIR /data

RUN npm install --no-cache --unsafe-perm --no-update-notifier --no-fund --only=production

COPY node_red_data /data

# Copy _your_ Node-RED project files into place
# NOTE: This will only work if you DO NOT later mount /data as an external volume.
#       If you need to use an external volume for persistence then
#       copy your settings and flows files to that volume instead.
#COPY node_red_data/settings.js /data/settings.js
#COPY node_red_data/flows_cred.json /data/flows_cred.json
#COPY node_red_data/flows.json /data/flows.json

# You should add extra nodes via your package.json file but you can also add them here:
#WORKDIR /usr/src/node-red
#RUN npm install node-red-node-smooth
 
# Start the container normally
#CMD ["npm", "start", "--", "--userDir", "/data", "--settings", "/data/settings.js"]