/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export class MinecraftServer {

    /** the server online status */
    public readonly online: boolean;
    /** the server motd */
    public readonly motd: string;
    /** the server icon file type */
    public readonly iconType: string;
    /** the server icon (base64) data */
    public readonly iconData: string;

    /** the server max players */
    public readonly maxPlayers: number;
    /** the server current players */
    public readonly currentPlayers: number;

    /** the server platform name */
    public readonly platform: string;
    /** the server protocol */
    public readonly protocol: number;

    /**
     * @param data the json object
     */
    constructor(data: any) {
        if (typeof data !== 'object')
            throw TypeError('Data type must be an object!');

        if (data['status'] !== 'success')
            throw Error(data['error']);

        this.online = data['online'];
        this.motd = data['motd'];

        const arrayIcon = data['favicon'].split(';base64,');
        this.iconType = arrayIcon[0].substring('data:image/'.length);
        this.iconData = arrayIcon[1];

        this.maxPlayers = parseInt(data['players']['max']);
        this.currentPlayers = parseInt(data['players']['now']);

        this.platform = data['server']['name'];
        this.protocol = parseInt(data['server']['protocol']);
    }

}