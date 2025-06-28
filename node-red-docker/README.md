# Node-RED MCP Server Template

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/new?template=https://github.com/moises-paschoalick/node-red-mcp-server/tree/main/node-red-docker)

> **🚀 Ready-to-deploy Railway template** - Node-RED configured with MCP (Model Context Protocol) for LLM integration

[🇧🇷 Read in Portuguese](README_br.md)

## 📋 Project Description

This template provides a complete and pre-configured Node-RED environment with **Model Context Protocol (MCP)** support, allowing your flows to interact directly with language models like OpenAI's GPT-4.

### 🎯 What this template solves

- **LLM Integration**: Connects Node-RED to AI models via MCP
- **Simplified Deployment**: One-click to have Node-RED running in the cloud
- **Automatic Configuration**: Everything pre-configured and ready to use
- **Scalability**: Runs on Railway infrastructure with high availability

## ⚡ Main Features

- ✅ **Node-RED 4.0.0** with complete web interface
- ✅ **MCP Tools Node** pre-installed and configured
- ✅ **OpenAI Support** integrated
- ✅ **Automatic deployment** on Railway
- ✅ **Configuration via environment variables**
- ✅ **Centralized logs** and monitoring
- ✅ **Automatic backup** of flows and configurations

## 🛠️ Prerequisites

- [Railway](https://railway.app) account (free)
- OpenAI API key (optional, for LLM features)
- Modern web browser

## 🚀 How to Use

### Automatic Deployment (Recommended)

1. **Click the "Deploy on Railway" button** above
2. **Connect your GitHub account** (if necessary)
3. **Configure environment variables** (see Configuration section)
4. **Wait for deployment** (2-3 minutes)
5. **Access your instance** via URL provided by Railway

### Manual Deployment

```bash
# Clone the repository
git clone https://github.com/moises-paschoalick/node-red-mcp-server
cd node-red-docker

# Deploy to Railway via CLI
railway login
railway init
railway up
```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `ADMIN_PASSWORD` | Node-RED admin password | `admin123` | ✅ |
| `NODE_RED_ENABLE_PROJECTS` | Enable projects | `false` | ❌ |
| `NODE_RED_ENABLE_EDITOR_THEME` | Editor theme | `default` | ❌ |
| `OPENAI_API_KEY` | OpenAI API key | - | ❌ |

### Ports

- **1880**: Node-RED web interface
- **1881**: Node-RED REST API (if enabled)

### Volumes

- `/data`: Persistent Node-RED data
  - Flows and configurations
  - Custom node modules
  - Logs and backups

## 🏃‍♂️ How to Run Locally

### With Docker Compose

```bash
# Clone the repository
git clone https://github.com/moises-paschoalick/node-red-mcp-server
cd node-red-docker

# Configure environment variables
cp .env.example .env
# Edit the .env file with your configurations

# Execute
docker-compose up -d

# Access at http://localhost:1880
```

### With Docker

```bash
# Build the image
docker build -t node-red-mcp .

# Run the container
docker run -d \
  --name node-red-mcp \
  -p 1880:1880 \
  -e ADMIN_PASSWORD=your-password \
  node-red-mcp
```

## 📸 Screenshots

### Node-RED Main Interface
![Node-RED Interface](https://via.placeholder.com/800x400/4CAF50/FFFFFF?text=Node-RED+Interface)

### MCP Tools Node Configured
![MCP Tools Configuration](https://via.placeholder.com/600x300/2196F3/FFFFFF?text=MCP+Tools+Configuration)

### Flow Example with LLM
![Flow Example](https://via.placeholder.com/800x400/FF9800/FFFFFF?text=Flow+with+LLM+Integration)

## 🔧 Initial Configuration

### 1. First Access

1. Access the URL provided by Railway
2. Login with:
   - **Username**: `admin`
   - **Password**: Value of `ADMIN_PASSWORD` variable

### 2. Configure MCP Tools

1. **Drag the "MCP Tools" node** to the canvas
2. **Configure the properties**:
   - **MCP Host URL**: `http://localhost:3000` (for local) or your MCP Host URL
   - **OpenAI API Key**: Your OpenAI key
   - **Server Command**: MCP server command
   - **Server Args**: Server arguments

### 3. Test Integration

1. **Create a simple flow** with:
   - Trigger (inject)
   - MCP Tools node
   - Debug node
2. **Configure the prompt** in MCP Tools
3. **Deploy and test**

## 📚 Usage Examples

### Example 1: Simple Chatbot

```javascript
// Basic chatbot flow
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
          "payload": "Hello, how can you help me?"
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

### Example 2: Data Analysis

```javascript
// Flow for data analysis with LLM
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
          "prompt": "Analyze this weather data: {{JSON.stringify(payload)}}"
        }
      }
    ]
  }
]
```

## 🔗 Integrations

### Supported MCP Servers

- **Local MCP Server**: Included in template
- **Remote MCP Servers**: Via Smithery.io
- **Custom MCP Servers**: Your own implementation

### Supported LLMs

- **OpenAI GPT-4**: Default configuration
- **OpenAI GPT-3.5**: Supported
- **Claude**: Via custom configuration
- **Others**: Via MCP adapters

## 🐛 Troubleshooting

### Common Issues

#### 1. Node-RED doesn't start
```bash
# Check logs
docker logs node-red-mcp

# Check permissions
docker exec -it node-red-mcp ls -la /data
```

#### 2. MCP Tools doesn't work
- Verify OpenAI API key is correct
- Confirm MCP Host is accessible
- Check MCP Host logs

#### 3. Permission errors
```bash
# Fix permissions
docker exec -it node-red-mcp chown -R node-red:node-red /data
```

### Logs and Debug

```bash
# Node-RED logs
docker logs -f node-red-mcp

# MCP Host logs (if applicable)
docker logs -f mcp-host

# Access logs via web interface
# http://localhost:1880/admin/logs
```

## 📈 Monitoring

### Available Metrics

- **CPU Usage**: Via Railway Dashboard
- **Memory Usage**: Via Railway Dashboard
- **Network Traffic**: Via Railway Dashboard
- **Application Logs**: Via Railway Logs

### Alerts

Configure alerts in Railway for:
- CPU usage > 80%
- Memory usage > 80%
- Application errors
- Response time > 5s

## 🔄 Backup and Restore

### Automatic Backup

Railway automatically backs up volumes. For manual backup:

```bash
# Backup data
docker exec node-red-mcp tar -czf /tmp/backup.tar.gz /data

# Download backup
docker cp node-red-mcp:/tmp/backup.tar.gz ./backup.tar.gz
```

### Restore

```bash
# Upload backup
docker cp ./backup.tar.gz node-red-mcp:/tmp/

# Restore data
docker exec node-red-mcp tar -xzf /tmp/backup.tar.gz -C /
```

## 🤝 Contributing

1. **Fork** the project
2. **Create a branch** for your feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Help Channels

- **📧 Email**: [your-email@example.com](mailto:your-email@example.com)
- **🐛 Issues**: [GitHub Issues](https://github.com/moises-paschoalick/node-red-mcp-server/issues)
- **💬 Discord**: [Discord Link](https://discord.gg/your-server)
- **📖 Wiki**: [Wiki Documentation](https://github.com/moises-paschoalick/node-red-mcp-server/wiki)

### Useful Resources

- [Node-RED Documentation](https://nodered.org/docs/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Railway Documentation](https://docs.railway.app/)
- [OpenAI API Documentation](https://platform.openai.com/docs/)

## 🙏 Acknowledgments

- [Node-RED](https://nodered.org/) - Visual programming platform
- [Railway](https://railway.app/) - Deployment platform
- [OpenAI](https://openai.com/) - Language models
- [MCP Community](https://modelcontextprotocol.io/) - MCP Protocol

---

**⭐ If this template was helpful, consider giving a star to the repository!**