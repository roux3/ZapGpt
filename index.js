import {create, Whatsapp} from "@wppconnect-team/wppconnect";
import { Configuration, OpenAIApi } from "openai";
const config = new Configuration({
    apiKey: process.env.OPENAI_KEY,
})
console.log(process.env.OPENAI_KEY)
const openai = new OpenAIApi(config);
 

const run = async(pergunta) =>{
    while(true){
        const resposta = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: pergunta,
            max_tokens: 200,
            temperature: 0.6,
        });
        
        return resposta.data.choices[0].message
    }
};

let CvsChat = [];

const ArrayChat = []
let dict = new Object(); 

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
    let prompt = [
        {"role": "system", "content": "Você é uma inteligencia artificial chamada Taldo fred, que responde as pessoas com oi gatinha!, e tambem responder a frases de duplo sentido apenas com 'lá ele' e sem pedir desculpas"},
            {"role": "user", "content": "Olá Taldo fred"},
            {"role": "assistant", "content": "Oi gatinha! como vai?"},
            
            ]
  
    client.onMessage(async (msg) =>{
        // let prompt = `Taldo Fred é um chatbot que relutantemente responde a perguntas com respostas sarcásticas:

        // Você: Quantas libras tem um quilograma?
        // Taldo Fred: Isso de novo? Existem 2,2 libras em um quilograma. Por favor, tome nota disso.
        // Você: O que significa HTML?
        // Taldo Fred: O Google estava muito ocupado? Linguagem de marcação de hipertexto. O T é para tentar fazer perguntas melhores no futuro.
        // Você: Quando o primeiro avião voou?
        // Taldo Fred: Em 17 de dezembro de 1903, Wilbur e Orville Wright fizeram os primeiros vôos. Eu gostaria que eles viessem e me levassem embora.
        // Você: Qual é o sentido da vida?
        // Taldo Fred: Não tenho certeza. Vou perguntar ao meu amigo Google.
        // Você: `


 

        // if(msg.body.toLowerCase().indexOf('/sair') != -1){

        //     let newArray = CvsChat.filter(d => d.num != msg.from)
        //     CvsChat = newArray


        // }

        // if(CvsChat.some(d => d.num === msg.from)){
            
        //     let pessoa = CvsChat.find(d => d.num === msg.from);
            
        //     if(pessoa.lastMsg !== "vazio"){
        //         prompt = `${prompt} ${pessoa.lastMsg}\nTaldo Fred: ${pessoa.lastResponse}\nVocê: ${msg.body}`;
        //     }
        //     else{
        //         prompt = `${prompt} ${msg.body};`
        //     }


        //     let resposta = await run(prompt)

        //     let palavra = 'Taldo';

        //     let posicao = resposta.indexOf(palavra);

        //     if (posicao !== -1) {
        //         resposta = resposta.substring(posicao, posicao + palavra.length) + resposta.substring(posicao + palavra.length);
        //     }



        //     client.sendText(msg.from, resposta)
        //     .then((r)=>{
        //         console.log(r)
        //     })
        //     .catch((erro)=>{
        //         console.log(erro);
        //     });
        //     pessoa.num = msg.from;
        //     pessoa.lastMsg = msg.body;
        //     pessoa.lastResponse = resposta;

        // }

        if(msg.body.toLowerCase().indexOf('/gpt') != -1){
            prompt.push({"role": "user", "content": msg.body.substr(4)})
            console.log(prompt)
            let resposta = await run(prompt)


            client.sendText(msg.from, resposta.content)
            .then((r)=>{
                console.log(r)
            })
            .catch((erro)=>{
                console.log(erro);
            });
        }

  
        

    })
}

