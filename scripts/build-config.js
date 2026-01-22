const fs = require('fs');
const path = require('path');
require('dotenv').config();

console.log('🔧 Building configuration...');

// Read environment variables with defaults for development
const config = {
  mqtt: {
    host: process.env.MQTT_HOST || '514ee1c5407448169298c78647ad26b9.s1.eu.hivemq.cloud',
    port: parseInt(process.env.MQTT_PORT || '8884'),
    username: process.env.MQTT_USERNAME || '',
    password: process.env.MQTT_PASSWORD || ''
  },
  web: {
    username: process.env.WEB_USERNAME || '',
    password: process.env.WEB_PASSWORD || ''
  },
  sensorInterval: 1800000,
  statusUpdateInterval: 30000
};

// Validate required environment variables in production
if (process.env.NODE_ENV === 'production') {
  const required = ['MQTT_USERNAME', 'MQTT_PASSWORD', 'WEB_USERNAME', 'WEB_PASSWORD'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
}

// Create config file
const configTemplate = `
// Auto-generated configuration - DO NOT EDIT MANUALLY
// Generated at: ${new Date().toISOString()}
// Environment: ${process.env.NODE_ENV || 'development'}

window.VQuailConfig = ${JSON.stringify(config, null, 2)};

// Security wrapper
Object.freeze(window.VQuailConfig);
Object.freeze(window.VQuailConfig.mqtt);
Object.freeze(window.VQuailConfig.web);
`;

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Write config file
fs.writeFileSync(path.join(distDir, 'config.js'), configTemplate);

// Copy HTML file and replace config
const htmlPath = path.join(__dirname, '..', 'index.html');
if (fs.existsSync(htmlPath)) {
  let html = fs.readFileSync(htmlPath, 'utf8');
  
  // Remove old config from script
  const oldConfigRegex = /const CONFIG = \{[\s\S]*?\};/;
  html = html.replace(oldConfigRegex, '// Configuration loaded from config.js');
  
  // Add config script tag before main script
  html = html.replace(
    /<script>\s*\/\/ Configuration/,
    '<script src="config.js"></script>\n    <script>\n        // Configuration'
  );
  
  fs.writeFileSync(path.join(distDir, 'index.html'), html);
}

console.log('✅ Configuration built successfully');
console.log('📁 Output directory:', distDir);
