const discord = require('discord.js');
const main = require('../index.js');

module.exports = {
    name: 'ready',
    async call(client) {
        const client = main.client;

        client.user.setPresence({
            status: 'online',
            activity: {
                name: 'Me being recoded',
                type: 'WATCHING',
            }
        })
    }
}