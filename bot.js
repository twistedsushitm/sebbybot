const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const messageCreate = require('./events/messageCreate');

// Create client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Register events
client.once('ready', () => {
  console.log(`${client.user.tag} is online and ready!`);
});

client.on('messageCreate', (message) => {
  messageCreate(client, message);
});

// Start bot
client.login(process.env.TOKEN);