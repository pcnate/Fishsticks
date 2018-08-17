const Discord = require('discord.js');
const config = require('../../Modules/Core/corecfg.json');
const chs = require('../../Modules/fs_channels.json');
const syst = require('../../Modules/fs_systems.json');

const ytdl = require('ytdl-core');
const YouTube = require('simple-youtube-api');

const yt = new YouTube(syst.googleYT_API);

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    //MUSIC SYSTEM VARIABLES
    const memberVC = msg.member.voiceChannel;
    
    fishsticks.playlist = fishsticks.queue.get(msg.guild.id);

    var hangoutVC = fishsticks.channels.get(chs.hangoutVC);
    var channelSpawner = fishsticks.channels.get(chs.fs_vcclone);
    var ranger = fishsticks.users.get("107203929447616512");
    var logger = fishsticks.channels.get(chs.musiclog);

    const url = cmd[0] ? cmd[0].replace(/<(.+)>/g, '$1') : '';
    var searchString = cmd.slice(0).join(' ');

    var song;
    var video;
    var videos;
    var numResults = 0;

    var playerSongTitle;
    var playerSongDescription;
    var playerSongAuthor;

    let engmode = fishsticks.engmode;
    let mattybmode = fishsticks.mattybmode;

    console.log("[MUSI-SYS] Play command recognized from user " + msg.author.tag + ".");
    console.log("[MUSI-SYS] Guild ID is: " + fishsticks.guildID);
    console.log("[MATB-MOD] MattyB Mode is currently: " + fishsticks.mattybmode);

    //ACTIVE FUNCTIONS
    function denied() {
        console.log("[MUSI-SYS] Play command rejected.");

        msg.reply("Request denied. You have to join a tempch channel first!\n\n*If this request was made from a temporary channel, Fishsticks has been restarted at some point and you need to recreate your channel for the music player to work.*").then(sent => sent.delete(30000));
        return;
    }

    async function accept() {
        console.log("[MUSI-SYS] Play command granted.");

        if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
            console.log("[MUSI-SYS] Playlist Detected.");

            const playlist = await yt.getPlaylist(url);

            videos = await playlist.getVideos();

            for (const video of Object.values(videos)) {
                const video2 = await yt.getVideoByID(video.id);
                await handleStuff(video2, msg, memberVC, true);
            }

            var playlistInfoPanel = new Discord.RichEmbed();
                playlistInfoPanel.setTitle("o0o - Playlist Added - o0o");
                playlistInfoPanel.setColor(config.fscolor);
                playlistInfoPanel.setDescription(
                    "**Playlist Title**: " + playlist.title + "\n" +
                    "**Author**: " + playlist.channel.title
                )
            logger.send({embed: playlistInfoPanel});
        }
        else {
            console.log("[MUSI-SYS] No playlist detected, attempting to collect video data.")
            try {
                video = await yt.getVideo(url);
            }
            catch (error) {
                try {
                    videos = await yt.searchVideos(searchString);
    
                    console.log("[MUSI-SYS] Videos")
                    for (var t = 0; t < videos.length; t++) {
                        result = await yt.getVideoByID(videos[t].id);
                        console.log(t + ": " + result.title);
                    }
                    
                    numResults = videos.length;

                    let searchIndex = 0;
    
                    var searchResult = new Discord.RichEmbed();
                        searchResult.setTitle("o0o - Player Search Result - o0o");
                        searchResult.setColor(config.fscolor);
                        searchResult.setDescription(
                            "**Search Term**: " + searchString + "\n" +
                            "**Result Count**: Top " + numResults + "\n" +
                            "**========================================**\n" +
                            `${videos.map(songresults => `${++searchIndex} -> ${songresults.title}`).join('\n')}\nSelect a video using 1-5 as your next message. (No ! required)`);
                    msg.reply({embed: searchResult}).then(sent => sent.delete(30000));

                    var response;

                    try {
                        response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 6, {
                            maxMatches: 1,
                            time: 10000,
                            errors: ['time']
                        });
                    } catch (error) {
                        console.log("[MUSI-SYS] YouTube Search failed because user didnt select a response.");
                        msg.reply("You didn't select a video!").then(sent => sent.delete(30000));
                        return;
                    }
                    var videoIndex = parseInt(response.first().content);

                    video = await yt.getVideoByID(videos[videoIndex - 1].id);
                }
                catch (error) {
                    msg.reply("I couldn't find any videos for that.");
                    console.log("[MUSI-SYS] Data Collection Error - Level 2: \n" + error);
                }
    
                console.log("[MUSI-SYS] Data Collection Error - Level 1: \n" + error);
            }

            return handleStuff(video, msg, memberVC);

        }

    }

    async function handleStuff(video, msg, voiceChannel, playlist = false) {

        fishsticks.playlist = fishsticks.queue.get(msg.guild.id);

        try {
            console.log("[MUSI-SYS] Attempting to gather song info...");

            song = {
                title: video.title,
                description: video.description,
                author: video.channel.title,
                url: `https://www.youtube.com/watch?v=${video.id}`,
                id: video.id
            }

            console.log('[MUSI-SYS] Logging Song Info:\n'+
                '->Title: ' + song.title + '\n'+
                '->Author: ' + song.author + '\n' +
                '->ID: ' + song.id + '\n' +
                '->URL: ' + song.url);

            playerSongTitle = song.title;
            playerSongDescription = song.description;
            playerSongAuthor = song.author;
            playerSongTitle = playerSongTitle.toLowerCase();
        }
        catch (error) {
            console.log("[MUSI-SYS] Failed to collect song information.");
            msg.reply("I couldn't gather the song information, this is a crash prevention system. Try another song?");
            return console.log('[MUSI-SYS] Error: \n' + error);
        }

        if (mattybmode == true) {
            var mattybentries = ["mattybraps", "mattyb", "matt b", "matthew david morris", "mattew morris", "matthew morris", "mat b", "mattb", "matthew", "mattbraps",
            "that terrible rapper", "#overhyped", "#why"];

            var mattybsongs = ["right in front of you", "gone", "friend zone", "little bit", "turn up the track", "spend it all on you", "stuck in the middle", "on my own",
            "hey matty", "can't get you off my mind", "shoulda coulda woulda", "live for today", "california dreamin", "trust me", "shine", "true colors", "thats the way",
            "right now i'm missing you", "you are my shining star", "blue skies", "life is unfair", "the king", "now kids", "video game", "imma be", "clique (cover)", "clique",
            "crush on you", "my oh my", "you make my heart skip", "royal wedding", "sugar sugar", "i just wanna love you", "moment", "be mine", "never too young", "far away",
            "so alive", "ms. jackson", "ms jackson", "goliath", "you", "flyin high", "guaranteed", "right on time", "back in time", "slow down", "low key", "that girl is mine",
            "hooked on you", "little bit (song)", "little bit(song)", "little bit", "turned out the lights", "talk dirty", "my first girlfriend", "see you again", "the good life",
            "ride it", "without you here", "to the top", "clap", "juicy", "be right there", "forever and always", "shake it off", "turn it up", "the royal wedding song", "i'm mattyb",
            "im mattyb", "burnout", "fancy", "enie meenie", "as long as you love me", "santa claus is coming to town (cover)", "santa claus is coming to town", "sants claus is coming to town",
            "sants claus is coming to town (cover)", "bad blood", "blank space", "boyfriend", "pressure rise"];

            for (var p = 0; p < mattybentries.length; p++) { //NAME CHECK IN TITLE
                if ((song.title.toLowerCase().includes(mattybentries[p]))) {
                    console.log("[MATB-MOD] Name caught.");

                    if ((song.title.toLowerCase().includes(mattybentries[p])) && fishsticks.playrejects == 0) {
                        msg.reply("Oh dear. As GlaDOS would say: If we're to blow up, let's at least blow up with some dignity. - aka, we're not playing that.");
                        fishsticks.playrejects++;
                        return;
                    }
                    else if (fishsticks.playrejects == 1) {
                        msg.reply("Oh we're playing this game? Ok...let's go. Still not playing that.");
                        fishsticks.playrejects++;
                        return;
                    }
                    else if (fishsticks.playrejects == 2) {
                        msg.reply("Alright, here we go. Let's start deducting respect points: -5. How low can you go? Not playing that!");
                        fishsticks.playrejects++;
                        return;
                    }
                    else if (fishsticks.playrejects == 3) {
                        msg.reply("That's another 5. You know, you're really good at this. Still not playing it!");
                        fishsticks.playrejects++;
                        return;
                    }
                    else if (fishsticks.playrejects == 4) {
                        msg.reply("Listen, I'm getting a little concerned. Here, lemme have 10 more respect points (-10), because I'm not gonna play that.");
                        fishsticks.playrejects++;
                        return;
                    }
                    else if (fishsticks.playrejects == 5) {
                        msg.reply("Your mental health may be called into question. This is the 6th time now (and another -10) that I'm not going to play that!");
                        fishsticks.playrejects++;
                        return;
                    }
                    else if (fishsticks.playrejects == 6) {
                        msg.reply("-10 more points. We might need to step this up. Do you enjoy doing this to yourself? Not playing it!");
                        fishsticks.playrejects++;
                        return;
                    }
                    else if (fishsticks.playrejects == 7) {
                        msg.reply("I mean, I guess if you get a kick out of it, we can keep going... (-15 respect points). I will not yield.");
                        fishsticks.playrejects++;
                        return;
                    }
                    else if (fishsticks.playrejects == 8) {
                        msg.reply("I wonder how much better your time could be spent than with me here trying to play a song. (-15 respect points). I like having you around too.");
                        fishsticks.playrejects++;
                        return;
                    }
                    else if (fishsticks.playrejects == 9) {
                        msg.reply("Wow, you've spent the last 10 play commands trying to get me to do this. Alright (-30 respect points). We'll do this. Let's go. I will not yield.");
                        fishsticks.playrejects++;
                        return;
                    }
                    else if (fishsticks.playrejects >= 10) {
                        msg.reply("Attempt " + (fishsticks.playrejects + 1) + ": minus " + (fishsticks.playrejects * 5) + " respect points. (It only gets worse).");
                        fishsticks.playrejects++;
                        return;
                    }
                }
            }

            for (var k = 0; k < mattybsongs.length; k++) { //SONG CHECK IN TITLE
                if ((song.title.toLowerCase().includes(mattybsongs[k])) || song.title.toLowerCase().includes(mattybsongs[k])) {
                    console.log("[MATB-MOD] Song title caught.");

                    if ((song.title.toLowerCase().includes(mattybsongs[k])) && fishsticks.playrejects == 0) {
                        msg.reply("Thought you were slick ey? Nope, not playing it!");
                        fishsticks.playrejects++;
                        return;
                    }
                    else {
                        msg.reply("You just don't seem to understand that I don't wanna play that...");
                        fishsticks.playrejects++;
                        return;
                    }
                }
            }

            for (var y = 0; y < mattybentries.length; y++) { //NAME CHECK IN DESCRIPTION
                if ((song.description.toLowerCase().includes(mattybentries[y]) || song.description.toLowerCase().includes(mattybentries[y]))) {
                    console.log("[MATB-MOD] Description caught.");

                    if ((song.description.toLowerCase().includes(mattybentries[y])) && fishsticks.playrejects == 0) {
                        msg.reply("Ooooh, smooth one. Ain't in the title, but it's in the description! Not playing it!");
                        fishsticks.playrejects++;
                        return;
                    }
                    else {
                        msg.reply("Hehe. I saw that one too! Still not playing it!");
                        fishsticks.playrejects++;
                        return;
                    }
                }
            }

            for (var f = 0; f < mattybentries.length; f++) { //NAME CHECK IN AUTHOR
                if ((song.author.toLowerCase().includes(mattybentries[f]))) {
                    console.log("[MATB-MOD] Name caught in author.");

                    if ((song.author.toLowerCase().includes(mattybentries[f])) && fishsticks.playrejects == 0) {
                        msg.reply("Man, you're getting really good at this. Got busted at the author though. It's kind of right there on the video. Not playing it.");
                        fishsticks.playrejects++;
                        return;
                    }
                    else {
                        msg.reply("I feel like we've been here before. Perhaps you shouldn't do that! Definately not playing it.");
                        fishsticks.playrejects++;
                        return;
                    }
                }
            }
        }

        if (song == null) {
            console.log("[TEMP-CHA] Caught an error at invalid song data.");
            msg.reply("I can't play that for some reason. Most likely it's got a copyright on it. Try a different video!");
            return;
        }
        else if (song == null) {
            console.log("[TEMP-CHA] Caught an error at invalid song.");
            msg.reply("I can't play that for some reason. Most likely it's got a copyright on it. Try a different video!");
            return;
        }
        else {
            if (!fishsticks.playlist) {
                const queueConstruct = {
                    txtCh: msg.channel,
                    vCh: memberVC,
                    connection: null,
                    songs: [],
                    volume: 2,
                    playing: true
                };
    
                fishsticks.queue.set(msg.guild.id, queueConstruct);
    
                queueConstruct.songs.push(song);
    
                try {
                    var connection = await memberVC.join();
                    fishsticks.vc = memberVC;
    
                    queueConstruct.connection = connection;
                    play(msg.guild, queueConstruct.songs[0]);
        
                    console.log("[MUSI-SYS] Attached to channel and playing song. Setting music playing to true.");
                    fishsticks.musicPlaying = true;

                    if (!playlist) {
                        var videoInfoPanel = new Discord.RichEmbed();
                            videoInfoPanel.setTitle("o0o - New Song Added - o0o");
                            videoInfoPanel.setColor(config.fscolor);
                            videoInfoPanel.setDescription(
                                "**Title**: " + song.title + "\n" +
                                "**Author**: " + song.author + "\n" +
                                "**URL**: " + song.url
                            )
                        logger.send({embed: videoInfoPanel});
                    }

                    fishsticks.playrejects = 0;
                }
                catch (error) {
                    console.error(`[MUSI-SYS] Connection to channel refused: ${error}`);
    
                    fishsticks.queue.delete(msg.guild.id);
    
                    return logger.send("I failed to connect to a channel, check the log! " + ranger);
                }
            }
            else {
                fishsticks.playlist.songs.push(song);
                if (playlist) {
                    return;
                }
                else {
                    var videoInfoPanel = new Discord.RichEmbed();
                        videoInfoPanel.setTitle("o0o - New Song Added - o0o");
                        videoInfoPanel.setColor(config.fscolor);
                        videoInfoPanel.setDescription(
                            "**Title**: " + song.title + "\n" +
                            "**Author**: " + song.author + "\n" +
                            "**URL**: " + song.url
                        )
                    logger.send({embed: videoInfoPanel});
                    return;
                }
                
            }

            return;
        }
    }

    function play(guild, song) {

        fishsticks.serverQueue = fishsticks.queue.get(guild.id);

        if (!song) {
            console.log("[MUSI-SYS] No songs detected in queue/player > terminating player.")
            fishsticks.serverQueue.vCh.leave();
            fishsticks.queue.delete(guild.id);
            console.log("[MUSI-SYS] Setting music playing to false.")
            fishsticks.musicPlaying = false;
            return;
        }

        var dispatch = fishsticks.serverQueue.connection.playStream(ytdl(song.url, {quality: '251'}))
            .on('end', () => {
                console.log("[MUSI-SYS] Song ended.");
                fishsticks.serverQueue.songs.shift();
                play(guild, fishsticks.serverQueue.songs[0]);
            })
            .on('error', error => console.error("[MUSI-SYS] Error Report: " + error));
        
        dispatch.setVolumeLogarithmic(fishsticks.serverQueue.volume / 5);

        logger.send(`**Now playing**: ${song.title}`);
    }

    //COMMAND CONDITIONS (CHECKS BEFORE EXECUTING FUNCTIONS)
    console.log("[MUSI-SYS] Checking User Permissions...");
    if (msg.guild.id == fishsticks.guildID) { //Check for if in-guild.
        console.log("[MUSI-SYS] User is in CC.");

        //Permissions check
        if (msg.member.roles.find("name", "Staff")) { //STAFF
            if (fishsticks.engmode) {
                msg.reply("Engeering Mode is enabled! Things might go wrong!").then(sent => sent.delete(15000));
                accept();
            }
            else {
                accept();
            }
        }
        else if (msg.member.roles.find("name", "CC Member") || msg.member.roles.get("name", "ACC Member")) { //NORMAL MEMBER
            if (fishsticks.engmode) {
                return msg.reply("Engeering Mode is enabled! You can't play music with ENGM on!").then(sent => sent.delete(15000));
            }
            else {
                accept();
            }
        }
        else { //NOT STAFF OR MEMBER
            msg.reply("You're not permitted to run this thing! Check with staff if you think you should have permissions for this.");
            console.log("[MUSI-SYS] User did not have permissions to run PLAY.")
            return;
        }
    }
    else { //If from different guild
        //Checking if player is connected to issuing channel

        console.log("[MUSI-SYS] User is from a different guild; checking authorization...");
        if (msg.member.roles.find("name", "FS Authorized")) { //User has FS Authorized Role?
            if (fishsticks.musicPlaying) {
                if (msg.member.voiceChannel != fishsticks.vc) {
                    msg.reply("Who are you? You're not even in the same channel as me!");
                    return;
                }
                else {
                    accept();
                }
            }
            else {
                accept();
            }
        }
        else {
            msg.reply("You're not permitted to run this thing!");
            return;
        }
    }
}