import { Message, MessageEmbed } from 'discord.js';
import { Command } from '../../managers/commands';
import mathjs from 'mathjs';

class MathCommand extends Command {

    public name = 'math';
    public aliases: string[] = ['calc', 'calculator'];
    public desc = 'You can do math stuff here';

    public async execute(prefix: string, args: string[], msg: Message) {
        if (!args[0])
            return msg.channel.send("**Enter Something To Calculate**");

        let result;
        try {
            result = mathjs.evaluate(
                args.join(" ")
                    .replace(/[x]/gi, "*")
                    .replace(/[,]/g, ".")
                    .replace(/[÷]/gi, "/")
            );
        } catch (e) {
            return msg.channel.send(
                "**Enter Valid Calculation!**\n\n**List of Calculations** - \n1. **sqrt equation** - `sqrt(3^2 + 4^2) = 5`\n2. **Units to Units** - `2 inch to cm = 0.58`\n3. **Complex Expressions Like** - `cos(45 deg) = 0.7071067811865476`\n4. **Basic Maths Expressions** - `+, -, ^, /, decimals` = **2.5 - 2 = 0.5**"
            );
        }

        const embed = new MessageEmbed()
            .setColor("GREEN")
            .setAuthor(`${msg.client.user?.username} Calculator`)
            .addField(
                "**Operation**",
                `\`\`\`Js\n${args
                    .join("")
                    .replace(/[x]/gi, "*")
                    .replace(/[,]/g, ".")
                    .replace(/[÷]/gi, "/")}\`\`\``
            )
            .addField("**Result**", `\`\`\`Js\n${result}\`\`\``)
            .setFooter(
                msg.author.tag,
                msg.author.displayAvatarURL({ dynamic: true })
            );

        msg.channel.send(embed);      
    }

}

export const command = new MathCommand();