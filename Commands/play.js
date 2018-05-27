const Discord = require('discord.js');
const config = require('../Modules/Core/corecfg.json');
const chs = require('../Modules/fs_channels.json');

const ytdl = require('ytdl-core');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    //MUSIC SYSTEM VARIABLES
    const memberVC = msg.member.voiceChannel;
    
    fishsticks.playlist = fishsticks.queue.get(msg.guild.id);

    var hangoutVC = fishsticks.channels.get(chs.hangoutVC);
    var channelSpawner = fishsticks.channels.get(chs.fs_vcclone);
    var ranger = fishsticks.users.get("107203929447616512");

    var playerSongTitle;

    let engmode = fishsticks.engmode;

    console.log("[MUSI-SYS] Play command recognized from user " + msg.author.tag + ".");

    //ACTIVE FUNCTIONS
    function denied() {
        console.log("[MUSI-SYS] Play command rejected.");

        msg.reply("Request denied. You have to join a tempch channel first!").then(sent => sent.delete(30000));
    }

    async function accept() {
        console.log("[MUSI-SYS] Play command granted.");

        const songInfo = await ytdl.getInfo(cmd[0]);
        const song = {
            title: songInfo.title,
            url: songInfo.video_url
        }

        playerSongTitle = song.title;
        playerSongTitle = playerSongTitle.toLowerCase();

        if (!fishsticks.playlist) {
            const queueConstruct = {
                txtCh: msg.channel,
                vCh: memberVC,
                connection: null,
                songs: [],
                volume: 5,
                playing: true
            };

            fishsticks.queue.set(msg.guild.id, queueConstruct);

            queueConstruct.songs.push(song);

            try {
                var connection = await memberVC.join();
                fishsticks.vc = memberVC;

                queueConstruct.connection = connection;
                msg.channel.send(`**Now Playing**: ${song.title}`)
                play(msg.guild, queueConstruct.songs[0]);
    
                console.log("[MUSI-SYS] Attached to channel and playing song...");
            }
            catch (error) {
                console.error(`[MUSI-SYS] Connection to channel refused: ${error}`);

                fishsticks.queue.delete(msg.guild.id);

                return msg.channel.send("I failed to connect to a channel, check the log! " + ranger);
            }
        }
        else {
            fishsticks.playlist.songs.push(song);
            msg.channel.send(`The song **${song.title}** has been added to the play queue.`);
        }
    }

    function play(guild, song) {

        fishsticks.serverQueue = fishsticks.queue.get(guild.id);

        if (!song) {
            fishsticks.serverQueue.vCh.leave();
            fishsticks.queue.delete(guild.id);
            return;
        }

        if (playerSongTitle.includes("mattyb")) {
            msg.reply("No. Not playing that. Begone.");
            fishsticks.serverQueue.vCh.leave();
            fishsticks.queue.delete(guild.id);
            return;
        }

        const dispatch = fishsticks.serverQueue.connection.playStream(ytdl(song.url))
            .on('end', () => {
                console.log("[MUSI-SYS] Song ended.");
                fishsticks.serverQueue.songs.shift();
                play(guild, fishsticks.serverQueue.songs[0]);
            })
            .on('error', error => console.error("[MUSI-SYS] Error Report: " + error));
        
        dispatch.setVolumeLogarithmic(fishsticks.serverQueue.volume / 5);

        msg.channel.send(`**Now playing**: ${song.title}`);
    }

    //COMMAND CONDITIONS (CHECKS BEFORE EXECUTING FUNCTIONS)
    if (msg.member.roles.find('name', 'Bot') || msg.member.roles.find("name", "Staff")) {
        msg.channel.send("Command permissions authorized and granted to " + msg.author.tag + ".");
        accept();
    }
    else if (msg.member.roles.find('name', 'Members')) { //If member
        if (engmode == true) { //If ENGM is on
            console.log("[MUSI-SYS] Play command ignored via ENGM being true.")

            msg.reply("I can't play music while Engineering Mode is enabled! Ask" + ranger + " to clarify.");
        }
        else { //If ENGM is not on
            if (!memberVC) {
                msg.reply("You're not attached to a voice channel silly; you can't play music if you can't hear it. :thonk:");
            }
            else if (memberVC == hangoutVC) {
                msg.reply("No no, get out of the Hangout channel. You can't play music in there.");
            }
            else if (memberVC == channelSpawner) {
                msg.reply("The channel spawner channel is not meant for music! Spawn one and then use the play system.");
            }
        
            for (var t = 0; t < fishsticks.tempChannels.length; t++) {
                if (memberVC == (fishsticks.channels.get(fishsticks.tempChannels[t]))) {
                    accept();
                }
            }
        }
    }
    else {
        msg.reply("You lack the necessary permissions to use the music player. You must be a member!").then(sent => sent.delete(10000));
    }
}