const Discord = require("discord.js");
const fs = require("fs");
const editJsonFile = require("edit-json-file");
const config = require("./config.json");
const prefix = "$";
const client = new Discord.Client();
const settings = {
  prefix: "$",
};

client.login(config.BOT_TOKEN);

const { Player } = require("discord-music-player");
const { ENOTEMPTY } = require("constants");
const player = new Player(client, {
  leaveOnEmpty: false,
});
client.player = player;
client.on("ready", () => {
  console.log("Ready 🎶");

  client.on("message", async (message) => {
    // Commands consts
    const args = message.content
      .slice(settings.prefix.length)
      .trim()
      .split(/ +/g);
    const command = args.shift().toLowerCase();
    const mess = message.content;
    const feur = ["feur", "drilatère"];
    const lengthfeur = feur.length;
    const lastword = getLastWord(message.content);
    const answers = JSON.parse(fs.readFileSync("./answers.json", "utf8"));
    // Utils functions
    function getRandomFeur(lengthfeur) {
      return feur[Math.floor(Math.random() * lengthfeur)];
    }
    function getLastWord() {
      return (message.content.toLowerCase().match(/(\w+)\W*$/) || [])[1];
    }

    if (
      Object.keys(answers).indexOf(lastword) > 0 &&
      !message.author.bot &&
      message.content[0] !== settings["prefix"]
    ) {
      message.channel.send(`${Object.values(answers[lastword]).join("")}`);
      return;
    }

    if (getLastWord(message.content) === "quoi") {
      let result = getRandomFeur(lengthfeur);
      message.channel.send(`${result}`);
    }
    if (command === "roll") {
      let result = Math.floor(Math.random() * args);
      message.reply(result + 1);
    }
    if (command === "double") {
      let double = parseInt(args) + parseInt(args);
      message.reply(double);
    }
    if (command === "help") {
      message.channel.send(
        "**Double** : *Doubler ta valeur* \n**Ping** : *Latence actuelle* \n**Roll** : *Lancer de dé entre 1 et le nombre que tu définis comme argument*\n**Clear** : *Supprime les messages (admin perms needed)*\n**Play** : *Joue une musique YouTube  / Spotify*"
      );
    }
    if (command === "propose") {
      var key = message.content.split(" ")[1] ?? "";
      var value = message.content.split(" ")[2] ?? "";
      var errors = [];
      value.trim();
      key.trim();
      if (
        answers.hasOwnProperty(`${value}`) ||
        answers.hasOwnProperty(`${key}`) ||
        message.author.bot
      ) {
        errors.push(`Le mot ${key} a déjà été proposé comme ${value}`);
      } else if (value.length <= 3 || key.length <= 3) {
        errors.push(
          `Le mot et la réponse doit être plus grand que 3 caractères`
        );
      }
      if (Array.isArray(errors) && errors.length) {
      } else {
        let file = editJsonFile(`answers.json`);
        file.set(key, value);
        file.save();
        file = editJsonFile(`answers.json`, {
          autosave: true,
        });
        message.channel.send(`Merci mon reuf tu as ajouté le mot ${key} comme ${value}`);
      }
      for(let error in errors){
        message.channel.send(`${errors[error]}`);
      } 
    }

    if (command === "clear" || command === "c") {
      if (!message.member.hasPermission("MANAGE_MESSAGES")) {
        return message.channel.send("Tu n'as pas les droits pour cela");
      }

      if (isNaN(args)) {
        return message.channel
          .send("Entrer le montant que vous voulez supprimer")
          .then((sent) => {
            setTimeout(() => {
              sent.delete();
            }, 2500);
          });
      }
      if (Number(args) < 0) {
        return message.channel.send("Entre un nombre positif").then((sent) => {
          setTimeout(() => {
            sent.delete();
          }, 2500);
        });
      }

      const amount = Number(args) > 100 ? 101 : Number(args);

      message.channel.bulkDelete(amount + 1, true).then((_message) => {
        message.channel
          .send(
            `**Le bot a supprimé \`${_message.size - 1} \` messages ** :broom:`
          )
          .then((sent) => {
            setTimeout(() => {
              sent.delete();
            }, 2500);
          });
        message.channel.send("https://imgur.com/RAIesP0").then((sent) => {
          setTimeout(() => {
            sent.delete();
          }, 2500);
        });
      });
    }
    // Music Player

    if (command === "play") {
      let song = await client.player.play(message, {
        search: args.join(" "),
        requestedBy: message.author.tag,
      });
      if (message.author["username"] === "Sayn") {
        message.channel.send(
          `**${song.name}** est joué, demandé par ce beau gosse de ${message.author}`
        );
      } else if (message.author["username"] === "EnygmatiK") {
        message.channel.send(
          `**${song.name}** est joué, demandé par ce clébard d' ${message.author}`
        );
      } else if (message.author["username"] === "JoKe") {
        message.channel.send(
          `**${song.name}** est joué, demandé par ${message.author} (qui se fait exploser sur littéralement tous les jeux par Sayn & Eny btw)`
        );
      } else {
        message.channel.send(
          `**${song.name}** est joué, demandé par ' ${message.author}`
        );
      }
    }

    if(command === 'playlist') {
      let queue = client.player.createQueue(message.guild.id);
      await queue.join(message.member.voice.channel);
      let song = await queue.playlist(args.join(' ')).catch(_ => {
          if(!guildQueue)
              queue.stop();
      });
  }

  if(command === 'skip') {
      guildQueue.skip();
  }

  if(command === 'stop') {
      guildQueue.stop();
  }

  if(command === 'removeLoop') {
      guildQueue.setRepeatMode(RepeatMode.DISABLED); // or 0 instead of RepeatMode.DISABLED
  }

  if(command === 'toggleLoop') {
      guildQueue.setRepeatMode(RepeatMode.SONG); // or 1 instead of RepeatMode.SONG
  }

  if(command === 'toggleQueueLoop') {
      guildQueue.setRepeatMode(RepeatMode.QUEUE); // or 2 instead of RepeatMode.QUEUE
  }

  if(command === 'setVolume') {
      guildQueue.setVolume(parseInt(args[0]));
  }

  if(command === 'seek') {
      guildQueue.seek(parseInt(args[0]) * 1000);
  }

  if(command === 'clearQueue') {
      guildQueue.clearQueue();
  }

  if(command === 'shuffle') {
      guildQueue.shuffle();
  }

  if(command === 'getQueue') {
      console.log(guildQueue);
  }

  if(command === 'getVolume') {
      console.log(guildQueue.volume)
  }

  if(command === 'nowPlaying') {
      console.log(`Now playing: ${guildQueue.nowPlaying}`);
  }

  if(command === 'pause') {
      guildQueue.setPaused(true);
  }

  if(command === 'resume') {
      guildQueue.setPaused(false);
  }

  if(command === 'remove') {
      guildQueue.remove(parseInt(args[0]));
  }

  if(command === 'createProgressBar') {
      const ProgressBar = guildQueue.createProgressBar();
      
      // [======>              ][00:35/2:20]
      console.log(ProgressBar.prettier);
  }

  });
});

