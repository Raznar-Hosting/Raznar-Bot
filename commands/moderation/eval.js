const { Message, MessageEmbed } = require('discord.js');
const util = require('util');

module.exports = {
    name: 'eval',
    aliases: ['exec', 'evaluate', 'execute'],
    /**
     * @param {string} prefix
     * @param {string[]} args
     * @param {Message} msg
     */
    execute: async (prefix, args, msg) => {
        if (!msg.member.hasPermission('ADMINISTRATOR'))
            return channel.send('No permission!').then(m => m.delete({timeout: 3_000}));
        
        const channel = msg.channel;
        if (args.length === 0)
            return channel.send(`Usage: ${prefix}eval <code>`);

        let codeInput = args.join(' ');
        if (codeInput.startsWith('```js') && codeInput.endsWith('```'))
            codeInput = codeInput.replace(/^```js/g, '')
                        .replace(/```$/gi, '')
        
        if (codeInput.includes(msg.client.token)) {
            await msg.delete({timeout: 50});
            const res = await channel.send('Invalid code input!')

            return await res.delete({timeout: 1_000});
        }

        const sender = msg.author;
        const embed = new MessageEmbed()
            .setTitle('Code Evaluation')
            .setFooter(`Executed by ${sender.tag}`, sender.displayAvatarURL)
            .setColor(0x00FF2E)
            .addField(':inbox_tray: Code Input', '```js\n' + codeInput + '```')

        msg.delete({timeout: 50});
        try {
            let result = eval(codeInput);
            if (typeof result !== 'string')
                result = util.inspect(result, {depth: 0})

            if (result.includes(msg.client.token))
                throw Error("You don't have the permission to access this!");

            embed.addField(':outbox_tray: Code Output', '```js\n' + result + '```');
            await channel.send(embed);
        } catch (error) {
            embed.setDescription('An error has occurred during code evaluation!')
                .setColor(0xFF0000)
                .addField(':e_mail: Error', '```js\n' + error + '```');

            await channel.send(embed);
        }
    }
}