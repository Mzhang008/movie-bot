const fs = require('node:fs');
const path = require('node:path');
//require('dotenv').config(); //if using .env file
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js"); //import discord.js lib
const { token } = require('./config.json'); //require token from config.json

 //create instance of Client
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, //GatewayIntentBits.Guilds intents option ensures that the caches for guilds, channels, and roles are populated and available for internal use. (guild = server)
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,    
    ] 
});

//store commands in collection
client.commands = new Collection();

const folderPath = path.join(__dirname, 'commands'); // construct path to commands dir
const commandFolders = fs.readdirSync(folderPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(folderPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js')); //use fs to read path to dir and return array of file names, then Array.filter() removes non .js files from array
//loop over each command and set them into the client.commands collection
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath); //read .js commands file, execute, then returns export object to command
        // prevent loading of invalid command files
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property`);
        }
    }
}

// register/add each event listener in /events
const eventsPath = path.join(__dirname, 'events');
const eventsFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventsFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.login(token);