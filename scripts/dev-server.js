const fs = require('fs');
const path = require('path');
require('dotenv').config();

console.log('🚀 Starting development server...');

// Create dev config
const devConfig = {
  mqtt: {
    host: process.env.MQTT_HOST || '514ee1c5407448169298c78647ad26b9.s1.eu.hivemq.cloud',
    port: 8884,
    username: process.env.MQTT_USERNAME || 'vquail',
    password: process.env.MQTT_PASSWORD || 'Vquail12345'
  },
  web: {
    username: process.env.WEB_USERNAME || 'vquail',
    password: process.env.WEB_PASSWORD || 'vquail123'
  }
};

console.log('🔐 Using credentials from .env file');

// Create HTML with dev config
const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VQuail Dashboard (Development)</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Orbitron:wght@400;500;600&display=swap" rel="stylesheet">
    <script>
        // Development configuration
        window.VQuailConfig = ${JSON.stringify(devConfig, null, 2)};
        console.log('🔧 Development mode active');
    </script>
</head>
<body>
    <div style="padding: 20px; font-family: monospace;">
        <h1>🚧 Development Mode</h1>
        <p>Run the build script to generate production files:</p>
        <code>npm run build</code>
        <p>Or edit index.html directly for development.</p>
    </div>
</body>
</html>
`;

// Write dev HTML
fs.writeFileSync('dev.html', htmlTemplate);
console.log('📄 Development file created: dev.html');
console.log('👉 Open dev.html in your browser for development');
