const Discord = require('discord.js');
const config = require('../Modules/Core/corecfg.json');
const chs = require('./Modules/fs_channels.json');

var logger = fishsticks.channels.get(chs.musiclog);

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    if (msg.member.roles.find("name", "Staff")) {
        if (!fishsticks.serverQueue) {
            msg.reply("There's nothing to stop!");
        }
        else {
            fishsticks.serverQueue.songs = [];
            fishsticks.serverQueue.connection.dispatcher.end();
            logger.send("Staff override: playback terminated by " + msg.author.tag);

            console.log("[MUSI-SYS] Staff override: Playback termination by " + msg.author.tag);
        }
    }

    if (msg.member.voiceChannel != fishsticks.vc) {
        msg.reply("Who are you? You're not even in the same channel as me!");
    }
    else {
        if (msg.member.roles.find('name', 'Members')) {

            if (!fishsticks.serverQueue) {
                msg.reply("There's nothing to stop!");
            }
            else {
                fishsticks.serverQueue.songs = [];
                fishsticks.serverQueue.connection.dispatcher.end();
                logger.send("Playback terminated by " + msg.author.tag);

                console.log("[MUSI-SYS] Playback terminated by " + msg.author.tag);
            }
        }
        else {
            msg.reply("Are you qualified to run this thing?");
        }
    }
}