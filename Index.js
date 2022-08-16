
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const CLIENT_ID = 'YOUR_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = 'YOUR_REFRESH_TOKEN';



const {Telegraf} = require('telegraf');
const sender = require('telegraf-sender');

const  {URL}  = require('url')
const {oauth2} = require("googleapis/build/src/apis/oauth2");
const {file} = require("googleapis/build/src/apis/file");

const bot = new Telegraf('YOUR_BOT_TOKEN');
bot.use(sender)
let  files = [];
let massiveId = [];
let checkValue = [];
let usersId = [];

let users = ['user_id', 'user_id', 'user_id']
 let chat_id = 'chat_id';



const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
)



oauth2Client.setCredentials({refresh_token:REFRESH_TOKEN})

function listFiles() {
    const drive = google.drive({
        version:'v3',
        auth: oauth2Client
    })
    drive.files.list({
        q: '\'your_folder_id\' in parents',

        fields: 'nextPageToken, files(id, name)',

    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
         files = res.data.files;




        if (files.length) {
            console.log('Files:');
            files.map((file) => {

                console.log(`${file.name} (${file.id})`);

            });

        } else {
            console.log('No files found.');
        }

    });

}











bot.hears('start', (ctx) => {
   setInterval(() =>  {ctx.msg.broadcast({
       users: ['user_id','user_id'],
       isCopy: false,
       message: {
           text: 'some message',
   },
    })}, 5000)
})

async function step() {

 await   setInterval(() => {
        listFiles()
    }, 4000)

}

 step();


function getDifference(array1, array2){
    return array1.filter(object1 => {
        return !array2.some(object2 => {
            return object1.id === object2.id;
        })
    })

}

function broadcastQuery(arg_ctx) {
    if(!(usersId.includes(arg_ctx.chat.id))) {
        usersId.push(arg_ctx.chat.id)
        usersId.forEach(element => console.log(element));
    }
    else  {
        return null;
    }
}


bot.command('download', (ctx) =>
    {   
    broadcastQuery(ctx);
     setInterval( () => {

         checkValue = [
             ...getDifference(files, massiveId)
         ]


         if (!(checkValue.length)) {
             return  massiveId = Object.assign([], files);



         } else {

            checkValue = [
                ...getDifference(files, massiveId)
            ]
              console.log(checkValue.length)
           for(let p = 0; p < usersId.length; p++) {
             for (let i = 0; i < checkValue.length; i++) {

                     // the second argument of sendDocument method use a Google Drive ref download link
                 bot.telegram.sendDocument(usersId[p], `https://docs.google.com/uc?export=download&id=${checkValue[i].id}`);


             }
           }
             massiveId = Object.assign([], files);
         }
     }, 2000)



    }


)


bot.launch()


