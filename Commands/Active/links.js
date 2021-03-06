const Discord = require('discord.js');
const config = require('../../Modules/Core/corecfg.json');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    var links = new Discord.RichEmbed();
			links.setTitle("o0o - CC GAMING LINKS - o0o")
			links.setColor(config.fscolor)
			links.setDescription(
				"[CC Forums](https://forums.ccgaming.com)\n" +
				"[CC Gaming Website](https://www.ccgaming.com)\n" +
				"[CCG Discord Invite Link](https://discord.ccgaming.com)\n"+
				"[CC Knowledgebase](https://forums.ccgaming.com/kb/index)\n" +
				"[Official CCTV Twitch Stream](https://twitch.tv/christiancrewtv)\n" +
				"[Official CC YouTube Channel](https://www.youtube.com/user/ChristianCrewGaming)\n\n"+
				"[Fishsticks Feature Request Thread](https://forums.ccgaming.com/viewtopic.php?f=2&t=24835)\n"+
				"[Skye's Definitive Guide to Discord - KBase](https://forums.ccgaming.com/kb/viewarticle?a=2)\n"+
				"[Skye's Definitive Guide to Discord - Forums](https://forums.ccgaming.com/viewtopic.php?f=2&t=24357)\n\n"+
				"[LCARS Database: Fishsticks](https://wiki.pldyn.net/en/fishsticks)\n"+
				"[LCARS Database: Guide to Fishsticks](https://wiki.pldyn.net/en/fishsticks/general-guide)\n\n"+
				"``This message will delete itself in 30 seconds.``")

    msg.channel.send({embed: links}).then(sent => sent.delete(30000));
}