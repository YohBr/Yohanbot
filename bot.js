//Estrutura Base do Bot
var Discord = require('discord.js');
var bot = new Discord.Client();
var config = require("./config.json");
var fs = require('fs');
var profanities = require('profanities')

var userData = JSON.parse(fs.readFileSync("Storage/userData.json", "utf8"));
var listaDeComandos = fs.readFileSync("Storage/comandos.txt", "utf8");
bot.commands = new Discord.Collection();

function loadCmds () {
  fs.readdir('./Comandos/', (err, files) => {
    if(err) console.log(err);

    var jsfiles = files.filter(f => f.split('.').pop() === 'js');
    if (jsfiles.length <= 0) { return console.log('Nenhum Comando Encontrado...')}
    else { console.log(jsfiles.length + ' Comandos Encontrados.') }
    
    jsfiles.forEach((f, i) => {
      delete require.cache[require.resolve(`./Comandos/${f}`)];
      var cmds = require(`./Comandos/${f}`);
      console.log(`Comando ${f} Carregando...`);
      bot.commands.set(cmds.config.command, cmds);
    })
  })
}

function userInfo(user, guild) {
  var finalString = '';

  finalString += '**' + user.username + '**, da ID de **' + user.id + '**';

  var userCreated = user.createdAt.toString().split(' ');
  finalString += ', Criado em **' + userCreated[1] + ' ' + userCreated[2] + ', ' + userCreated[3] + '**.'

  finalString += ' Alem disso, ele tem ** ' + userData[user.id].messagesSent + ' menssagens** neste server.' 

  return finalString;
}

loadCmds();
//Evento do Ouvinte: Mensagem Recebida (Isso é executado toda vez que uma mensagem é recebida)
bot.on("message", message => {

  //Variaveis
  var sender = message.author; //A pessoa que enviou a menssagem
  var msg = message.content.toUpperCase(); //Pega a menssagem, e faça todo em MAIÚSCULAS
  var prefix = "!" //O caractere antes do comando, você pode alterar e por o que você quiser no lugar
  var cont = message.content.slice(prefix.length).split(" ");
  var args = cont.slice(1);

  if (!message.content.startsWith(prefix)) return;
  
  var cmd = bot.commands.get(cont[0])
  if (cmd) cmd.run(bot, message, args);

  if (msg === prefix + 'RELOAD') {
    message.channel.send({embed: {description: "Todos os Comandos Recarregados"}})
    message.channel.send("Todos os comandos Recarregados")
    loadCmds()
  }

  //Faz o Bot ignorar coisas ditas por ele mesmo
  if (sender.id === '423628432694312980') { //Checa se a ID do autor é a mesma que a do bot
    return; //Cancela todo o processo seguinte
  }

 
  //Deletando Mensagens de um Chat Especifico
  if (message.channel.id === '480042055200931851') { //Checa se a mensagem foi enfiada no chat especifico
    if (isNaN(message.content)) { //Checa se a menssagem for um numero,  se não for o comando fai ativar
        message.delete(); //deleta a mensagem
        message.author.send('Não é Permitido envio de menssagens nesse chat, a menos q sejam numeros') //Envia uma menssagem Privada a pessoa
    }    
  }
  
  //Deletando Palavras que podem ser ofenssivas, você pode alterar para qualquer outra palavra
  if (msg.includes('PUTZ')) { //Checa se a Palavra Putz esta inclusa na menssagem
    message.delete(); //Deleta a Menssagem
    message.author.send('Esta Palavra **Putz** Não é Permitido no Server, Por Favor não à use.') //Envia uma menssagem privada ao autor da menssagem
  }
  
  if (msg.startsWith(prefix + 'USERINFO')) {

    if (msg === prefix + 'USERINFO') {
      message.channel.send(userInfo(sender))
    }
  
    if (!userData[sender.id + message.guild.id]) userData[sender.id + message.guild.id] = {
      messagesSent: 0
    }
    
    userData[sender.id + message.guild.id].messagesSent++;
    
    fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
      if (err) console.error(err);
    });
  }

  
});

//Evento do Ouvinte: Ligando o Bot
bot.on("ready", () => {
  console.log('Bot Ligado...') //Execulta quando o Bot esta Funcionando
  
  //Você pode por qualque codigo que queira aqui, ele sera execultado quando o bot ligar.
  
  //Alterando os Status do Bot, tipo o que ele esta jogando ou transmindo, se esta online ou ocupado
  
  //status
  bot.user.setStatus("dnd") //Você pode alterar para 'Online", 'idle' para ausente, 'dnd' para ocupado & 'ínvisible' para invisivel
  
  //Jogando & Transmitindo
  bot.user.setGame('Olá!') //Você pode alterar pra qualquer coisa que quiser tipo "Dona Florinda Ultra Adventures"
  //apa transmissões você pode por dessa forma:
  bot.user.setGame('Olá!', 'https://www.twitch.tv/emisulive'); 
  
});

//Evento do Ouvinte: Um Usuario Entrou no Server
bot.on("guildMemberAdd", member => {
  
  console.log('User ' + member.user.username + ' Entrou no Server!') //Envia uma menssagem no console avisando que alguem entrou no servr
  console.log(member)
  //Adicionando o cargo quer q a pessoa receba assim que entrar no server
  var role = member.guild.roles.find('name', 'level 1'); //Checa os cargos do server e preocura o cargo descrito, no caso o Cobaia Favoriata, você pode mudar pra qualquer cargo que tenha no server
  
  //Adicionando o Cargo a Pessoa
  member.addRole(role)
  
  member.guild.channels.get('497076287677005824').send('**' + member.user.username + ' Entrou no Server!') //Envia Uma Mensagem de Aviso de Novo Membro
  
  
});

//Evento do Ouvinte: Um Usuario Saiu no Server
bot.on("guildMemberRemove", member => {
  
  member.guild.channels.get('497076287677005824').send('**' + member.user.username + ' Saiu no Server!') //Envia Uma Mensagem de Aviso de um Membro que deixou o server

});


//Login
bot.login(config.token)