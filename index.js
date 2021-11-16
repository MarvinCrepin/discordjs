const Discord = require("discord.js");
const config = require("./config.json");
const prefix = "$";
const client = new Discord.Client();
const settings = {
    prefix: '$'
};

client.login(config.BOT_TOKEN)
client.on('shardError', error => {
	console.error('A websocket connection encountered an error:', error);
});
const { Player } = require("discord-music-player");
const player = new Player(client, {
});
client.player = player;
client.on("ready", () => {
    console.log("Ready 🎶");


client.on('message', async (message) => {
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if(command === 'play'){
        let song = await client.player.play(message, {
            search: args.join(' '),
            requestedBy: message.author.tag
        });
        message.channel.send(`**${song.name}** est joué, demandé par @${song.requestedBy}`);

        if(song)
            console.log(`Started playing ${song.name}`);
        return;
    }
});
});

client.on("message", (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
  
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if (command === "ping") {
    message.reply(`Pong ! Ping de 1ms ! T'as la fibre ?`);
    }
    if (command === "spam") {

    }
    if (command === "421") {
        message.reply('En construction')
    }
    if (command === "pong") {
        message.reply('Ping')
        }
    if (command === "roll") {
        let result = Math.floor(Math.random() * args);
        message.reply(result + 1);
    }
    if (command  === "double" ) {
        let double = parseInt(args) + parseInt(args);
        message.reply(double)
    }
    if (command === "help") {
        message.reply('**Double** : Doubler ta valeur **Ping** : Latence **Roll** : Tirage au sort avec pour arguement max ta valeur définie **Clear** : Supprime les messages (modérateur) **Play** : Joue une musique YouTube  / Spotify');
    }
    if (command === "randomChose") {
    }
    
    if (command === 'clear' || command === 'c') {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) {
          return message.channel
            .send(
              "Tu n'as pas les droits pour cela",
            );
        }

        if (isNaN(args)) {
          return message.channel
            .send('Entrer le montant que vous voulez supprimer')
            .then((sent) => {
              setTimeout(() => {
                sent.delete();
              }, 2500);
            });
        }
        if (Number(args) < 0) {
          return message.channel
            .send('Entre un nombre positif')
            .then((sent) => {
              setTimeout(() => {
                sent.delete();
              }, 2500);
            });
        }
    
        const amount = Number(args) > 100
          ? 101
          : Number(args);
    
        message.channel.bulkDelete(amount +1 , true)
        .then((_message) => {
          message.channel
            .send(`**Le bot a supprimé \`${_message.size -1} \` messages ** :broom:`)
            .then((sent) => {
              setTimeout(() => {
                sent.delete();
              }, 2500);
            });
          message.channel.send('https://imgur.com/RAIesP0')
          .then((sent) => {
            setTimeout(() => {
              sent.delete();
            }, 2500);
          });

        });

      }
      }
)