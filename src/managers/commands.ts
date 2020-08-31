/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Client, Message } from 'discord.js';
import fs from 'fs';
import path from 'path';

/**
 * The object that holds the identity of a Command
 * 
 * The usage sample: 
 * @example
 * class HelpCommand extends Command {
 * 
 *      public name: string = 'help';
 *      public aliases: string[] = [];
 *      public desc: string = '';
 * 
 *      public async execute(prefix: string, args: string[], msg: Message) {
 *          // your code
 *      }
 * 
 * }
 * 
 * // this will be grabbed by the command manager
 * export const command = new HelpCommand();
 */
export abstract class Command {

    /** the command name */
    public abstract name: string;

    /** the command aliases */
    public abstract aliases: string[];

    /** the command description */
    public abstract desc: string;

    /**
     * executes the command
     * 
     * @param prefix the command prefix
     * @param args the arguments
     * @param msg the message instance
     */
    public async abstract execute(prefix: string, args: string[], msg: Message): Promise<any>;

}

export class CommandManager {

    /** determines if the manager is working with commands */
    public isWorking: boolean;

    /** stores all commands */
    public readonly commandMap: Map<string, Command>;

    /** the command prefix */
    public prefix: string;

    constructor(prefix: string) {
        this.prefix = prefix;
        this.isWorking = false;
        this.commandMap = new Map();
    }

    /**
     * Loads list of commands from a certain folder
     * 
     * @param dirPath the directory (file) path
     */
    public loadCommands(dirPath: fs.PathLike): void {
        if (!fs.existsSync(dirPath))
            throw Error('Cannot find the commands folder!');

        for (const file of fs.readdirSync(dirPath)) {
            const filePath = path.join(dirPath.toString(), file);

            // supports recursive loads
            if (fs.lstatSync(filePath).isDirectory()) {
                this.loadCommands(filePath);
                continue;
            }
            // files must be valid
            if (file.startsWith('__') || !file.endsWith('.js'))
                continue;

            try {
                const resolvedPath = path.resolve(filePath);
                // loads the command module
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const command: Command = require(resolvedPath).command;
                if (!command)
                    continue;

                // stores the command
                this.commandMap.set(command.name, command);
            } catch (error) {
                console.error(error);
            }
        }
    }

    /**
     * tries to find a command based on it's name or alias
     * 
     * @param name the command name or alias
     */
    public findCommand(name: string): Command | undefined {
        if (!name)
            return;

        // search based on name
        const command = this.commandMap.get(name);
        if (command)
            return command;

        // search based on aliases
        return Array.from(this.commandMap.values())
            .find(cmd => cmd.aliases.includes(name));
    }

    /**
     * starts working on the commands, with this commands will fully working
     * 
     * @param client the client object
     * @param configPath the path to the config.json
     */
    public startWorking(client: Client, configPath?: fs.PathLike): void {
        if (this.isWorking)
            throw Error('The command worker is already working!');

        client.on('message', async (msg) => {
            const { channel, content, author } = msg;

            // commands only avaiable for servers
            if (channel.type === 'dm')
                return;
            // executor cannot be bot or a webhook
            if (author.bot || msg.webhookID)
                return;
            // // if config path parameter is filled
            // // check the bot-lock
            // if (configPath) {
            //     const resolvedPath = path.resolve(configPath.toString());
            //     // eslint-disable-next-line @typescript-eslint/no-var-requires
            //     const config: Config = require(resolvedPath);

            //     if (config['bot-lock'] && !config['channels']['bot-cmds'].includes(channel.id))
            //         return;
            // }
            // to execute a command a prefix is needed
            if (!content.startsWith(this.prefix))
                return;

            const args = content.substring(this.prefix.length).split(' ');
            const name = args.shift()!.toLowerCase();

            const command = this.findCommand(name);
            if (!command)
                return;

            // executes the command once all checks has been passed
            try {
                command.execute(this.prefix, args, msg);
            } catch (error) {
                console.error(error);
            }
        });
    }

}