//======================================
//"FISHSTICKS" - OFFICIAL CC DISCORD BOT
//======================================

//--------------------------------------
//..........SYSTEM VARIABLES............
//--------------------------------------
//CONSTANT DECLARATIONS
const Discord = require("discord.js");
const fs = require('fs');
const fishsticks = new Discord.Client();

const systems = require('./Modules/fs_systems.json');
const sys = require('./Modules/Core/coresys.json');
const channels = require('./Modules/fs_channels.json');
const config = require('./Modules/Core/corecfg.json');

const token = systems.token;
const fscolor = config.fscolor;
const prefix = config.prefix;

//ENGINEERING MODE
let engmode = false;

fishsticks.tempChannels = [];
fishsticks.version = sys.fsversion;

var fsconsoleChannel;
var announceChannel;
var fstempchclone;
var staffChannel;

//--------------------------------------
//............MAIN SCRIPT...............
//--------------------------------------
//SESSION/ENGM MANAGER
var fsvarsdoc = JSON.parse(fs.readFileSync('./fishsticks_vars.json', 'utf8'));
var fs_session = fsvarsdoc.sessionnum++;
fishsticks.syssession = fs_session;

fs.writeFileSync("./fishsticks_vars.json", JSON.stringify(fsvarsdoc));

var fsengmdoc = JSON.parse(fs.readFileSync('./Modules/fishsticks_engm.json', 'utf8'));
engmode = fsengmdoc.engmode;
fishsticks.engmode = engmode;

//VOUCH FILE SYSTEM (that does nothing...)
var fsvouchesdoc = JSON.parse(fs.readFileSync('./fishsticks_vouches.json', 'utf8'));

//STARTUP PROCEDURE
fishsticks.on('ready', () => {

	fsconsoleChannel = fishsticks.channels.get(channels.fsconsole);
	announceChannel = fishsticks.channels.get(channels.announcements);
	staffChannel = fishsticks.channels.get(channels.staffChannel);

	//Startup Message - console
	console.log(`Successfully Logged ${fishsticks.user.tag} into the server.`);
	console.log("Initialized and booted Fishsticks version " + fishsticks.version);
	console.log("===========================================================");
	console.log("[SESSION#] " + fishsticks.syssession);
	console.log("[ENG-MODE] Currently: " + engmode)

	//Startup Message - Discord
	if (engmode == true) {
		fishsticks.user.setActivity('ENGM Enabled! | !help');
	} else {
		fishsticks.user.setActivity("!help | V" + fishsticks.version);
	}

	var startupseq = new Discord.RichEmbed();
		startupseq.setTitle("o0o - FISHSTICKS STARTUP - o0o")
		startupseq.setColor(fscolor);
		startupseq.setThumbnail("https://cdn.discordapp.com/attachments/125677594669481984/419996636370960385/fishdiscord.png")
		startupseq.setDescription(
			"Dipping in flour...\n" +
			"Baking at 400°...\n" +
			"Fishsticks V" + fishsticks.version + " is ready to go!")

	fsconsoleChannel.send({embed: startupseq}).catch(console.error).then(sent => sent.delete(30000));



});

//----------------------------------
//FISHSTICKS COMMAND LISTING
//----------------------------------

//RICH EMBEDS
	/*

//COMMAND STRUCTURE
	//Listed alphabetically
	//-Current List-
		//Hello
		//Hi
		//Log(S)
		//Vouch */

function comm(str, msg) {
	return msg.content.startsWith(prefix + str);
}

var svuArr = ["fishsticks is bad", "fishsticks are bad", "fishsticks are gross", "fishsticks eww", "hate fishsticks"];

//MESSAGE AND EVENT SYSTEMS
fishsticks.on('message', async msg => {

	//PASSIVE COMMANDS
	if (msg.content == "hi" || msg.content == "Hi") {
		msg.reply("Hello!");
	}
	
	if (msg.content == "eyup" || msg.content == "ey up") {
		msg.reply("'Ello, I'm right chuffed you're 'ere.");
	}

	if (msg.content == "fishsticks" || msg.content == "Fishsticks") {
		msg.channel.send("Mmmm, fishsticks....", {files: ["./images/fsimg.jpg"]});
	}

	if (msg.content == "ni hao" || msg.content == "Ni Hao" || msg.content == "Ni Hao Ma" || msg.content == "ni hao ma") {
		msg.reply("Hao!");
	}

	if (msg.content.includes(svuArr)) {
		msg.reply("Excuse me!? We are going to have to have a talk about where your standards lie and where they should be. Keep that attitude up and I'll have to take extra measures... (automatic 15 respect point loss).\n\n *Very idea...\nHating fishsticks...")
	}

	if (msg.content == "svu") {
		msg.delete();

		msg.channel.send("*In the criminal justice system, bot based offenses are considered especially heinous. In this Discord, the dedicated detectives who investigate these vicious felonies are members of an elite squad known as the Special Developers Unit. These are their stories.* GLUNG GLUNG", {files: ["./images/fs_defense.png"]});
	}
	
	if (msg.content == "hello" || msg.content == "Hello") {
		msg.reply("Hi there!");
	}
	else { //MESSAGE COMMAND HANDLER
		if (msg.author.fishsticks) return
		if (msg.author.id == fishsticks.user.id) return
		if (msg.content.indexOf(prefix) !== 0) return
	
		const cmd = msg.content.slice(prefix.length).trim().split(/ +/g);
		const cmdID = cmd.shift().toLowerCase();
	
		try {
			let cmdFile = require(`./Commands/${cmdID}.js`);
			cmdFile.run(fishsticks, msg, cmd);
		} catch (err) {
			console.error(err);
			msg.reply("You trying to thonk me? That's not a command silly. Use `!help` to get a reference.");
		}
	}
});

/*

	//VOUCH SYSTEM
	else if (command("vouch", msg)) {
		msg.delete();

		var vouchestot = fsvouchesdoc.vouchnumtotal++;

		var vouchRequester = msg.author.id;
		var vouchCMD = msg.content.split(" ");
		var memberFor = vouchCMD.splice(1, 1).join(' ');
		var memberForID = parseInt(memberFor);

		console.log(memberFor);
		console.log(memberForID);
		console.log(vouchestot);
		
	} else {
		msg.reply("Was that command? Perhaps try again and reference `!help` if you don't know?")
	}

	//SECRET
	if (msg.content.toLowerCase() === "fishsticks, how are you feeling?") {
		msg.reply("I'm a little rattled, feeling pretty good right now though. SkyeRanger is a pretty darn good bot doctor.");
	}

	if (msg.content.toLowerCase() == "Fishsticks, how are you?") {
		if (engmode == true) {
			msg.reply("Well, looks like engineering mode is on, so that means I'm probably being worked on. I'll be better than ever soon though. :)");
		}
		else {
			msg.reply("I'm doin' pretty good right now. That whole hijacking thing caught me off gaurd but I'm good.");
		}
	}

	if (msg.content == "good evening Fishsticks" || msg.content == "good evening fishsticks") {
		msg.reply("Good evening to you!");
	}

	if (msg.content == "ey up" || msg.content == "eyup") {
		msg.reply("Greetings! I'm right chuffed you're 'ere.");
	}

	if (msg.content == "football" || msg.content == "ffootballl") {
		msg.reply("*Erm, hrm, ~~troll~~ cough*");
	}

	if (command("feed", msg)) {
		msg.reply("Probably not a good idea. :)")
	}


}); */


//VOICE CHANNEL CONNECTION CHECK
fishsticks.on('voiceStateUpdate', (oldMember, newMember) => {
	let newUserChannel = newMember.voiceChannel;
	let oldUserChannel = oldMember.voiceChannel;

	if (fishsticks.tempChannels.includes(oldMember.voiceChannelID)) {
		if (oldUserChannel.members.size === 0) {
			oldUserChannel.delete()
			.then(deleted => console.log("[TEMP-CHA] Deleted channel " + oldMember.voiceChannelID + ". (Everyone Left)"));

			var vcIDIndex = fishsticks.tempChannels.indexOf(oldMember.voiceChannelID);
			if (vcIDIndex > -1) {
				fishsticks.tempChannels.splice(vcIDIndex, 1);
				console.log("[TEMP-CHA] Channel Index removed. Channels online now: " + fishsticks.tempChannels.length + " with IDs:");

				for (var t = 0; t < fishsticks.tempChannels.length; t++) {
					console.log(fishsticks.tempChannels[t]);
				}
			}
		}
	}
});



//MEMBER JOIN/LEAVE SYSTEM  ==EXPERIMENTAL==
/*fishsticks.on('guildMemberAdd', member => {
	var join = new Discord.RichEmbed();
		join.setTitle("o0o - Welcome! - o0o")
		join.setColor(fscolor)
		join.setThumbnail(member.user.avatarURL)
		join.addField("Welcome to the offical CC Discord, " + member.user.username + "! Stick around for some fish!")
		join.setDescription(member.user.username +" Joined at | " +formatDate(new Date()))
    						member.guild.channels.find("name", "fishsticks-console").send({join})

    console.log("+USER: " + member.user.username + " joined the server.");
});
*/

fishsticks.login(token);