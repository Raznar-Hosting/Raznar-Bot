module.exports = {
    name: 'ready',
    call: async (client) => {
        const config = require('../config.json');

        client.user.setPresence({
            status: 'online',
            activity: {
                name: config['status']['message'],
                type: config['status']['type']
            }
        });

        console.log('\nBot has fully started!');
    }
}