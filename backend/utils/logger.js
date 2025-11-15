const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Send to Discord webhook
const sendToDiscord = async (message, type = 'info') => {
  if (!process.env.DISCORD_WEBHOOK_URL || process.env.DISCORD_WEBHOOK_URL === 'YOUR_DISCORD_WEBHOOK_URL_HERE') {
    return;
  }

  const colors = {
    info: 3447003,    // Blue
    success: 3066993, // Green
    warning: 15844367, // Yellow
    error: 15158332   // Red
  };

  const embed = {
    title: `IGTC Auth - ${type.toUpperCase()}`,
    description: message,
    color: colors[type] || colors.info,
    timestamp: new Date().toISOString(),
    footer: {
      text: 'IGTC Authentication System'
    }
  };

  try {
    const response = await fetch(process.env.DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] })
    });
  } catch (error) {
    // Discord webhook error - silent fail
  }
};

// Save to text file
const saveToFile = (filename, data) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${JSON.stringify(data, null, 2)}\n\n`;
  const filePath = path.join(logsDir, filename);
  
  fs.appendFileSync(filePath, logEntry);
};

// Main logging function
const logActivity = async (type, action, data) => {
  const message = `**${action}**\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\``;
  
  // Save to file
  saveToFile(`${type}.txt`, { action, ...data });
  
  // Send to Discord
  await sendToDiscord(message, type);
};

module.exports = { logActivity };