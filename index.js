import {create, Whatsapp} from "@wppconnect-team/wppconnect";
import { Configuration, OpenAIApi } from "openai";
const config = new Configuration({
    apiKey: "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",
})

const openai = new OpenAIApi(config);
const run = async(pergunta) =>{
    while(true){
        const resposta = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: pergunta,
            max_tokens: 200,
            temperature: 0.6,
        });
        console.log(resposta.data.choices[0].text)
        return resposta.data.choices[0].text
    }
}


create(
        {session: "Teste",
        headless: true,
        debug: false,
        statusFind: (statusSession, session) => {
            console.log("Status da sessão: ", statusSession)
            console.log("Nome da sessão: ",session)
        }
        }
    )
    .then((client) => start(client))
    .catch((error) => console.log(error));

 function start(client){
    client.onMessage(async (msg) =>{
        if (msg.body.indexOf('/gpt') != -1){
            let resposta = await run(msg.body.substr(4))
            client.sendText(msg.from,  resposta)
            .then((r)=>{
                console.log(r)
            })
            .catch((erro)=>{
                console.log(erro)
            })
        }
    })
}

