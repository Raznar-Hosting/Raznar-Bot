module.exports = {
    name: 'purge',
    aliases: ['clear'],
    /**
     * @param {string} prefix
     * @param {string[]} args
     * @param {Message} msg
     */
    execute: async (prefix, args, msg) => {
        if (!msg.member.hasPermission('ADMINISTRATOR'))
            return channel.send('No permission!').then(m => m.delete({timeout: 3_000}));

        if (isNaN(args[0]))
            return msg.channel.send('Please provide a valid amount to purge');

        if (args[0] > 100)
            return msg.channel.send('Please give an amount less than 100');

        msg.channel.bulkDelete(args[0])
            .then(messages =>
                msg.channel.send(`Successfully deleted ${messages.size}/${args[0]} messages!`)
                    .then(m => m.delete({ timeout: 10_000 }))
            );
    }
}