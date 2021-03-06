const Discord = require('discord.js');
const sys = require('../../Modules/Core/coresys.json');
const fs = require('fs');
const engm = require('../../Modules/fishsticks_engm.json');
const chs = require('../../Modules/fs_ids.json');

const syslogFunc = require('../../Modules/Functions/syslog.js');

var tempChannels = [];

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    function syslog(message, level) {
        syslogFunc.run(fishsticks, "[TEMP-CHA] " + message, level);
    }

    let engmode = fishsticks.engmode;

    if (fishsticks.subroutines.get("tempch")) {

        if (msg.member.roles.find('name', 'Staff') || msg.member.roles.find('name', 'Recognized')) {
            if (engmode == true) {
                if (msg.member.roles.find('name', 'Staff') || msg.member.roles.find('name', 'Bot')) {
                    syslog("ENGM Override Executed: Permission granted to " + msg.author.tag + ".", 2);

                    msg.channel.send("ENGM Override Recognized. Granting permissions to " + msg.author.tag + ".");

                    var maxUsers = parseInt(cmd[0]);
                    var tname;

                    if (maxUsers == null || maxUsers == NaN) {
                        maxUsers == 0;
                        tname == cmd[0] ? cmd.slice(1).join(" ") : cmd.join(' ');
                    }
        
                    var tempChannelCategory = chs.tempchannelCat;
                    var channelCloner = chs.fs_vcclone;
                    var channelClonerClone = fishsticks.channels.get(chs.fs_vcclone);
                    var tchID;
        
                    var user = msg.member;
                    const userVC = user.voiceChannelID;
        
                    if (userVC == undefined || userVC != channelCloner) {
                        msg.reply("Join the #channel-spawner channel first!").then(sent => sent.delete(15000));
                    }
                    else if (userVC === channelCloner) {
                        channelClonerClone.clone(tname)
                        .then(clone => {
                        syslog("Channel created called: " + tname + " by: " + msg.author.tag, 3);
        
                        tchID = clone.id;
                        fishsticks.tempChannels.push(tchID);
        
                        syslog("Channel " + tname + " has ID: " + tchID, 2);
                        syslog("Temp Channels now include " + fishsticks.tempChannels.length + " channels of IDs: ", 2);
        
                        msg.reply("Channel created!").then(sent => sent.delete(15000));
        
                        for (x = 0; x < fishsticks.tempChannels.length; x++) {
                            syslog(fishsticks.tempChannels[x], 1);
                        }
        
                        clone.setParent(tempChannelCategory);
        
                        if (maxUsers > 1) {
                            clone.setUserLimit(maxUsers).then(clone => syslog("Channel '" + tname + "' set max users to " + maxUsers, 1))
                            msg.reply("Setting user maximum to: " + maxUsers).then(sent => sent.delete(15000));
                        }
                        else if (maxUsers = null) {
        
                        }
        
                        msg.member.setVoiceChannel(tchID);
                    
                        })
                        .catch(console.error);
                    }
                }
                else {
                    msg.reply("Engineering mode is enabled! Disable it before using this command! (Ask a staff member).");
                }
                
            } else {
                var maxUsers = parseInt(cmd[0]);
                var tname = msg.author.username + "'s Channel";

                syslog(maxUsers, 1);

                if (isNaN(maxUsers)) {
                    maxUsers = 0;
                    tname = cmd.splice(0).join(' ');
                }
                else {
                    tname = cmd.splice(1).join(' ');
                }

                var tempChannelCategory = chs.tempchannelCat;
                var channelCloner = chs.fs_vcclone;
                var channelClonerClone = fishsticks.channels.get(chs.fs_vcclone);
                var tchID;

                var user = msg.member;
                const userVC = user.voiceChannelID;

                if (userVC == undefined || userVC != channelCloner) {
                    msg.reply("Join the #channel-spawner channel first!").then(sent => sent.delete(15000));
                }
                else if (userVC === channelCloner) {
                    channelClonerClone.clone(tname)
                    .then(clone => {
                    syslog("Channel created called: " + tname + " by: " + msg.author.tag), 2;

                    tchID = clone.id;
                    fishsticks.tempChannels.push(tchID);

                    syslog("Channel " + tname + " has ID: " + tchID, 2);
                    syslog("Temp Channels now include " + fishsticks.tempChannels.length + " channels of IDs: ", 2);

                    msg.reply("Channel created!").then(sent => sent.delete(15000));

                    for (x = 0; x < fishsticks.tempChannels.length; x++) {
                        syslog(fishsticks.tempChannels[x], 1);
                    }

                    clone.setParent(tempChannelCategory);

                    if (maxUsers > 1) {
                        clone.setUserLimit(maxUsers).then(clone => syslog("[TEMP-CHA] Channel '" + tname + "' set max users to " + maxUsers, 1))
                        msg.reply("Setting user maximum to: " + maxUsers).then(sent => sent.delete(15000));
                    }
                    else if (maxUsers = null) {

                    }

                    msg.member.setVoiceChannel(tchID);
                
                    })
                    .catch(console.error);
                }
                
            }
        }
        else {
            msg.reply("Looks like you're not permitted to run this thing! Check with staff to make sure you have the proper role assignment!")
        }
    }
    else {
        msg.reply("This subroutine is disabled! Ask " + fishsticks.ranger + " or another Staff member to turn it back on!").then(sent => sent.delete(15000));
    }
}