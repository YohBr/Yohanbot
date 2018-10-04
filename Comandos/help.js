module.exports.run = async (bot, message, args) => {

    var fs = require('fs');
    var listaDeComandos = fs.readFileSync("Storage/comandos.txt", "utf8");
  
        message.channel.send(listaDeComandos)
    
}

module.exports.config = {
    command: "help"
}