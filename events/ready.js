// When client is ready run this code only once
const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady, //name prop states which event file is for
    once: true,
    execute(client) { //execute called by event handler when event emits
        console.log(`Logged in as ${client.user.tag}`)
    }
}
/* equivalent code in main.js
client.once(Events.ClientReady, c => {
    console.log(`Logged in as ${c.user.tag}!`)
})}
*/