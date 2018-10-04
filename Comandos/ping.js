module.exports.run = async (bot, message, args) => {

     //Comando de Ping / Pong

    message.channel.send({embed: {
      title: "Ping!",
      description: "Pong!",
      url: "https://www.twitch.tv/emisulive",
      color: 0x17A589,
      fields:[
        {
          name:"Latencia",
          value:`**${Math.round(bot.ping)}ms**`,
          inline: false
        }
      ],
      timestamp: new Date(),
      footer: {
        text: 'você também pode definir um texto de rodapé',
        icon_url: "https://i.ytimg.com/vi/eSaYCC7f3H0/maxresdefault.jpg"
      }
    }}) //Envia uma Menssagem de Respota: "Pong!"
}


module.exports.config = {
    command: "ping"
}