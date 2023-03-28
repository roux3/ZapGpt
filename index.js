import {create, Whatsapp} from "@wppconnect-team/wppconnect";
import { Configuration, OpenAIApi } from "openai";
import {ImageAnnotatorClient,} from "@google-cloud/vision";
import {writeFile} from "fs"
// const vision = require('@google-cloud/vision');

let vari = process.env.GOOGLE_APPLICATION_CREDENTIALS

const app = new ImageAnnotatorClient({
  keyFilename: vari,
})


const config = new Configuration({
    apiKey: "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",
})
console.log(process.env.OPENAI_KEY)
const openai = new OpenAIApi(config);
 

const run = async(pergunta) =>{
    while(true){
        const resposta = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: pergunta,
            max_tokens: 500,
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
        {"role": "system", "content": "Você é uma inteligencia artificial chamada Taldo Cleitim, que responde as pessoas com oi gatinha!, e tambem responder a frases de duplo sentido apenas com 'lá ele' e sem pedir desculpas"},
            {"role": "user", "content": "Olá Taldo fred"},
            {"role": "assistant", "content": "Oi gatinha! como vai?"},
            
            ]
  
    client.onMessage(async (msg) =>{
        if (msg.type === 'image' && msg.caption == "/gpt") {
    
                const mediaData = await client.downloadMedia(msg);
          
                const imageBuffer = Buffer.from(mediaData.split(';base64,').pop(), 'base64');
                writeFile("img.png",imageBuffer,function(err) {
                  if (err) {
                    console.error(err);
                  } else {
                    app.textDetection("./img.png").then(async (r)=>{
                        const detections = r[0].fullTextAnnotation
                        const txt = detections.text
                        console.log("Text:");
                        console.log(txt)

                        prompt.push({"role": "user", "content": txt})
                        let resposta = await run(prompt)

                        console.log(prompt)
                        client.sendText(msg.from, resposta.content)
                            .then((r)=>{
                            console.log(r)
                            })
                            .catch((erro)=>{
                            console.log(erro);
                            });

                        
                        }).catch((e)=>{
                          console.log(e)
                        })
          
                  }
                });
    
    
        }


        
          

        if(msg.body.toLowerCase().indexOf('/gpt') != -1){
            prompt.push({"role": "user", "content": msg.body.substr(4)})
          
            let resposta = await run(prompt)


            client.sendText(msg.from, resposta.content)
            .then((r)=>{
                console.log(r)
            })
            .catch((erro)=>{
                console.log(erro);
            });
        }

        if(msg.body.toLowerCase().indexOf('/clear') != -1){
            prompt = [
                {"role": "system", "content": "Você é uma inteligencia artificial chamada Taldo Cleitim, que responde as pessoas com oi gatinha!, e tambem responder a frases de duplo sentido apenas com 'lá ele' e sem pedir desculpas"},
                    {"role": "user", "content": "Olá Taldo fred"},
                    {"role": "assistant", "content": "Oi gatinha! como vai?"},
                    
                    ]
        }

  
        

    })
}

