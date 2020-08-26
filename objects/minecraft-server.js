class MinecraftServer {

    /** the server online status */
    online = false;
    /** the server motd */
    motd = '';
    /** the server icon file type */
    iconType = '';
    /** the server icon (base64) data */
    iconData = '';

    /** the server max players */
    maxPlayers = 0;
    /** the server current players */
    currentPlayers = 0;

    /** the server platform name */
    platform = '';
    /** the server protocol */
    protocol = 0;

    /**
     * @param {object} data the json object
     */
    constructor(data) {
        if (typeof data !== 'object')
            throw TypeError('Data type must be an object!');

        if (data['status'] !== 'success')
            throw Error(data['error']);

        this.online = data['online'];
        this.motd = data['motd'];

        const arrayIcon = this.rawFavicon.split(';base64,');
        this.iconType = arrayIcon[0].substring('data:image/'.length);
        this.iconData = arrayIcon[1];

        this.maxPlayers = parseInt(data['players']['max']);
        this.currentPlayers = parseInt(data['players']['now']);

        this.platform = data['server']['name'];
        this.protocol = parseInt(data['server']['protocol']);
    }

}

module.exports = { MinecraftServer }