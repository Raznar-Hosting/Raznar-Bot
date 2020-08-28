module.exports = {
    name: 'ready',
    call: async (client) => {
        const presence = require('../../resources/presence.json');

        const status = presence['status'];
        const activityType = presence['activity']['type'];
        const activityMessage = presence['activity']['message'];

        client.user.setPresence({
            status: status,
            activity: {
                name: activityMessage,
                type: activityType
            }
        });

        console.log('\nBot has fully started!');
    }
}