const Discord = require('discord.js');
const config = require('../Modules/Core/corecfg.json');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    if (msg.member.voiceChannel != fishsticks.vc) {
        msg.reply("Who are you? You're not even in the same channel as me!");
    }
    else {
        if (msg.member.roles.find('name', 'Members')) {

            if (!fishsticks.serverQueue) {
                msg.reply("There's nothing to stop!");
            }

            if (!cmd[0]) {
                msg.channel.send("**Current Volume**: `" + fishsticks.serverQueue.volume + "`.");
            }

            fishsticks.serverQueue.volume = cmd[0];
            fishsticks.serverQueue.connection.dispatcher.setVolumeLogarithmic(cmd[0] / 5);

            return msg.channel.send("**Volume set to**:`" + fishsticks.serverQueue.volume + "` by " + msg.author.tag);
        }
        else {
            msg.reply("Are you qualified to run this thing?");
        }
    }
}