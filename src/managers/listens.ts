import { Client } from 'discord.js';
import fs from 'fs';
import path from 'path';

/**
 * Loads a bunch of listeners at once from a directory
 * 
 * @param dirPath the directory path
 * 
 * 
 * Example for an event file must be like this:
 * @example
 * // test-event.ts
 * import { Client } from 'discord.js';
 * 

 * export function callEvent(client: Client) {
 *      client.on('message', async (msg) => {
 *          // your code
 *      });
 * }
 */
export function loadListeners(client: Client, dirPath: fs.PathLike) {
    // checks directory existence
    if (!fs.existsSync(dirPath))
        return;

    for (const file of fs.readdirSync(dirPath)) {
        const filePath = path.join(dirPath.toString(), file);

        // supports recursive loads
        if (fs.lstatSync(filePath).isDirectory()) {
            loadListeners(client, filePath);
            continue;
        }
        // the file must be valid
        if (file.startsWith('__') || !file.endsWith('.js'))
            continue;

        // resolves the path
        const resolvedPath = path.resolve(filePath);

        // loads the listener
        try {
            const listener = require(resolvedPath);
            listener.callEvent(client);
        } catch (error) {
            console.error(error);
        }
    }
}