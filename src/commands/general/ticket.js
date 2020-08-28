const { Message, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'ticket',
    aliases: ['tickets', 'support', 'req', 'request'],
    desc: 'Managers the tickets',
    /**
     * @param {string} prefix
     * @param {string[]} args
     * @param {Message} msg
     */
    execute: async (prefix, args, msg) => {
        const sender = msg.member;
        const channel = msg.channel;
        const guild = msg.guild;

        if (!args[0])
            return module.exports.execute(prefix, ['help'], msg);

        const config = require('../../../resources/config.json');
        const ticketdb = require('../../index.js').ticketdb;
        const category = guild.channels.cache.get(config['channels']['ticket-category']);

        const everyoneRole = guild.roles.cache.get(config['roles']['everyone'])
        const supportRole = guild.roles.cache.get(config['roles']['support']);

        try {
            if (!category)
                throw Error('Cannot find the category to hold the tickets!');
            if (!everyoneRole || !supportRole)
                throw Error('Cannot find certain role(s)!');
        } catch (error) {
            console.error(error);
            return channel.send(error.message);
        }

        switch (args[0].toLowerCase()) {
            case 'create': {
                const data = ticketdb.prepare('SELECT * FROM tickets WHERE user_id = ?;').get(sender.id);
                // if the user already has a ticket
                // confirms the channel existence to prevent duplication
                if (data) {
                    const ticketChannel = guild.channels.cache.get(data['channel_id']);
                    // prevents user to have more than 1 ticket channel
                    if (ticketChannel)
                        return channel.send(`You already have a ticket! Please open ${ticketChannel.toString()} to view your ticket!`)

                    // if the ticket channel cannot be found
                    // deletes the data
                    ticketdb.prepare('DELETE FROM tickets WHERE user_id = ?;')
                        .run(sender.id);
                }

                // generates an id for the channel name
                const randomId = Math.floor(Math.random() * 10_000);
                // creates the channel
                const ticketChannel = await guild.channels.create(`ticket-${randomId}`, {
                    parent: category,
                    topic: `${sender.user.tag}'s ticket channel`,
                    type: 'text',
                    permissionOverwrites: [
                        {
                            id: everyoneRole,
                            deny: ['VIEW_CHANNEL']
                        },
                        {
                            id: sender,
                            allow: [
                                'VIEW_CHANNEL', 'ADD_REACTIONS', 'READ_MESSAGE_HISTORY',
                                'SEND_MESSAGES', 'ATTACH_FILES', 'EMBED_LINKS'
                            ]
                        }
                    ]
                });

                // inserts the new data
                ticketdb.prepare('INSERT INTO tickets (user_id, channel_id) VALUES (?, ?);')
                    .run(sender.id, ticketChannel.id);

                // tells the user that their ticket channel is creat
                await ticketChannel.send(
                    `${sender.toString()} your ticket has been created!`
                    + `\n\n`
                    + `Summon ${supportRole.toString()}`
                );
                await channel.send(
                    `${sender.toString()} your ticket has been created!`
                    + `\nYou may go to ${ticketChannel.toString()}!`
                );

                break;
            }
            case 'delete':
            case 'close': {
                if (args.length >= 2) {
                    // only admin can delete other 
                    if (!sender.hasPermission('ADMINISTRATOR'))
                        return channel.send('No permission!').then(m => m.delete({ timeout: 3_000 }));

                    const ticketChannel = Array.from(msg.mentions.channels.values())[0];
                    // checks the mentioned channel
                    if (!ticketChannel)
                        return channel.send('Please mention the correct ticket channel!');

                    const ticketId = ticketChannel.id
                    const data = ticketdb.prepare('SELECT * FROM tickets WHERE channel_id = ?;')
                        .get(ticketId);

                    // checks if the channel is the same channel as the ticket channel
                    if (!data)
                        return channel.send("This channel isn't a ticket channel!");

                    const userId = data['user_id'];
                    const ticketOwner = guild.members.cache.get(userId);
                    // notifies the ticket owner
                    if (ticketOwner)
                        ticketOwner.send('Your ticket channel named `' + ticketChannel.name + '` was deleted by ' + sender.user.tag + '!');

                    ticketChannel.delete('Force ticket close');
                    ticketdb.prepare('DELETE FROM tickets WHERE user_id = ?;')
                        .run(userId);
                    return;
                }

                const data = ticketdb.prepare('SELECT * FROM tickets WHERE user_id = ?;').get(sender.id);
                if (!data)
                    return channel.send("You don't have a ticket!");

                const ticketChannel = guild.channels.cache.get(data['channel_id']);
                // deletes the ticket channel
                if (ticketChannel)
                    ticketChannel.delete();

                // deletes the ticket data
                ticketdb.prepare('DELETE FROM tickets WHERE user_id = ?;')
                    .run(sender.id);

                break;
            }
            default: {
                const embed = new MessageEmbed()
                    .setTitle('Ticket Help')
                    .setColor('RANDOM')
                    .setFooter(config['footer'])
                    .setDescription(
                        '`' + prefix + 'ticket create` - To create a ticket'
                        + '\n`' + prefix + 'ticket close` - To close a ticket'
                    );

                return channel.send(embed);
            }
        }
    }
}