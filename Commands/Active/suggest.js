//---SUGGEST---

const Discord = require('discord.js');
const systems = require('../../Modules/fs_systems.json');
const ids = require('../../Modules/fs_ids.json');
const https = require('https');

const query = require('../../Modules/Functions/db/query.js');

const logger = require('../../Modules/Functions/syslog.js');

exports.run = async (fishsticks, msg, cmd) => {
    msg.delete();

    var hookURL = systems.fsSuggestionHook;

    cmdRef = msg.content.toLowerCase().split("-");
    cmdRefAlt = msg.content.split("-");
	
	logger.run(fishsticks, `Processing suggestion:\n\tAuthor: ${msg.author.username}\n\tTitle: ${cmdRefAlt[1].trim()}\n\tBody: ${cmdRefAlt[2].trim()}`, 2);

    hookURL = hookURL.concat(`?sender=${msg.author.username}&suggTitle=${cmdRefAlt[1].trim()}&suggBody=${cmdRefAlt[2].trim()}`);

    try {
        //Attempt suggestion send
		console.log("Sending request!");
        https.get(hookURL, (res) => {
            console.log("[SGGST-SUBR] Status Code: " + res.statusCode);

            res.on("data", (d) => {
                console.log(d);
            })
        }).on('error', (eventGetError) => {
            console.log(eventGetError);
        });

        //FSO Sync Suggestions
        console.log("[FS-ONLINE] Syncing suggestions...")
        let member = await query.run(fishsticks, `SELECT suggestionsPosted FROM fs_members WHERE memberDiscordID = ${msg.author.id}`);

        console.log(member);
        console.log(member[0].suggestionsPosted);

        let update = await query.run(fishsticks, `UPDATE fs_members SET suggestionsPosted = ${member[0].suggestionsPosted + 1} WHERE memberDiscordID = ${msg.author.id}`);

    } catch (eventSendErr) {
        msg.reply("SOMETHING FUNKY IS GOING ON. Hey yo " + fishsticks.ranger + " some assistance please.");
        console.log(eventSendErr);
        console.log("\nStack:\n");
        console.log(eventSendErr.stack);
    }
}