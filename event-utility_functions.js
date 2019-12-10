//----EVENT----
//Developer: <Connor Brown>
//Calculate day
    //NOTE: This system assumes that with the exception of Feb. only, each month has 32 days.
    if (event.month != 2) {
        if ((time[1] > 0 && time[1] < 33) && time[1] != undefined) {
            event.day = parseInt(time[1]);
        } else {
            return msg.reply("That’s not a day in this month! C’mon.")
            .then(sent => sent.delete(10000));
        }
    } else if (event.month == 2) {
        if ((time[1] > 0 && time[1] < 29) && time[1] != undefined) {
            event.day = parseInt(time[1]);
        } else {
            return msg.reply("February only has 28 days (and in my system there are no leap years).")
            .then(sent => sent.delete(10000));
        }
    } else {
        return msg.reply("Something…wait, how did you get here. Try that one again.")
        .then(sent => sent.delete(10000));
    }

      //Calculate year
      if ((time[2] < currDate.getFullYear()) && time[2] != undefined) {
        return msg.reply("We live in " + currDate.getFullYear() + ". Can’t schedule before that.")
        .then(sent => sent.delete(10000));
    } else if (time[2] > 9999) {
        return msg.reply("Wow, trying to schedule a game night for your 18x grandkids? No, go get another bot for that.")
        .then(sent => sent.delete(10000));
    } else {
        event.year = parseInt(time[2]);
    }

    //Calculate hour
    if ((time[3] > 0 && time[3] < 13) && time[3] != undefined) {
        event.time_HR = parseInt(time[3]);
    } else if (time[3] > 12 && time[3] < 24 && time[3] != undefined) {
        return msg.reply("Hey hey, I don’t do any of that tWeNtY-fOuR hOuR mess. I want actual hours.")
        .then(sent => sent.delete(10000));
    } else {
        return msg.reply("You…have gone horribly wrong somewhere. We’re not working with relativity here, just a standard clock.")
        .then(sent => sent.delete(10000));
    }

    //Calculate minute
    if (time[4] >= 0 && time[4] <= 59 && (time[4] != undefined)) {
        event.time_M = parseInt(time[4]);
    } else {
        return msg.reply("Mmmmmmmmmmmmmmmmmmmmmmmmmminutes…only run from 0 to 59.")
        .then(sent => sent.delete(10000));
    }

    //Calulate meridiem
    if (time[5].toLowerCase() == "am" | time[5].toLowerCase() == "pm") {
        event.meridiem = time[5];
    } else {
        return msg.reply("Remember. 12. Hours. I’m gonna need either AM or PM.")
        .then(sent => sent.delete(10000));
    }

    if (event.meridiem.toLowerCase() == "pm") {
        event.time_HR24 = event.time_HR + 12;
    }

     //Build payload date
    event.url_date = `${event.month}/${event.day}/${event.year} 
    ${event.time_HR}:${event.time_M}${event.meridiem}`;
        event.url_endDate = `${event.month}/${event.day}/${event.year} 
    ${event.time_HR+1}:${event.time_M}${event.meridiem}`;
    
        console.log(event.url_date);
        console.log(`${event.year}–${event.month–1}–${event.day}–${convertTime(event.time_HR + event.meridiem, ‘HH’)}–${event.time_M}-0`);
    
        event.startTime = new Date(event.year, event.month – 1, event.day, 
    convertTime(event.time_HR + event.meridiem, ‘HH’), event.time_M, 0);
        event.endTime = new Date(event.year, event.month – 1, event.day, 
    convertTime((event.time_HR + 1) + event.meridiem, ‘HH’), event.time_M, 0)
    
        log("Setting times:\n\tStart: " + event.startTime + "\n\tEnd: " + event.endTime, 2);
    
        //Build description
        event.desc = cmdAlt[3].trim();
    
    //Verify event using Embed
    let eventPanel = new Discord.RichEmbed();
        eventPanel.setTitle(“New Event: “ + event.name);
        eventPanel.setDescription(event.desc);
        eventPanel.addField(“Save the Date!”, `${event.month}/${event.day}/${event.year} at ${event.time_HR}:${event.time_M}${event.meridiem}`);
        eventPanel.setFooter(“Coordinated by “ + event.host + ". Automated by yours truely.");
    
    msg.channel.send({embed: eventPanel});

    try {
        var eventLink = await handleCreateEvent(event, msg);
    } catch (error) {
        var eventLink = error;
    }

    msg.channel.send(eventLink);
}
