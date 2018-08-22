const watson = require('watson-developer-cloud/assistant/v1')
const prompt = require('prompt-sync')()

require('dotenv').config()

const chatbot = new watson({
    username: process.env.ASSISTANT_USERNAME,
    password: process.env.ASSISTANT_PASSWORD,
    version: process.env.ASSISTANT_VERSION
})

const workspace_id = process.env.WORKSPACE_ID

chatbot.message({workspace_id}, trataResposta)

let fimDeConversa = false

function trataResposta(err, response) {
    if(err)
        return console.log(err)
    
    if(response.intents.length > 0) {
        console.log('Eu sei qual intenção vc teve: '+ response.intents[0].intent)
        if(response.intents[0].intent === 'despedida') {
            fimDeConversa = true
        }
    }

    if(response.output.text.length > 0) 
        console.log(response.output.text[0])

    if(!fimDeConversa) {
        const messageUsuario = prompt('>>')
        chatbot.message({
            workspace_id,
            input: {text: messageUsuario},
            context: response.context
        }, trataResposta)
    }
}