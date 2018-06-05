const Discord = require('discord.js');
const config = require('../../Modules/Core/corecfg.json');
const chs = require('../../Modules/fs_channels.json');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    var logger = fishsticks.channels.get(chs.musiclog);

    if (!fishsticks.serverQueue) {
        msg.reply("There's nothing playing!");
        return;
    }

    return logger.send(`
        __**Song Queue**__

    ${fishsticks.serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}

    **Now Playing:** ${fishsticks.serverQueue.songs[0].title}
    `);

}